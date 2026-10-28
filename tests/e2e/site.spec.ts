import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { missingRoutes, routes } from "./routes";

async function open(page: Page, route: string) {
  const problems: string[] = [];

  page.on("pageerror", (error) => problems.push(`erro de página: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !/favicon/.test(message.text())) {
      problems.push(`console: ${message.text()}`);
    }
  });

  const response = await page.goto(route, { waitUntil: "networkidle" });

  return { response, problems };
}

for (const route of routes) {
  test.describe(`página ${route}`, () => {
    test("abre sem erro e sem rolagem lateral", async ({ page }) => {
      const { response, problems } = await open(page, route);

      expect(response?.status()).toBe(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      expect(problems).toEqual([]);
    });

    test("não tem texto quebrado nem cortado", async ({ page }) => {
      await open(page, route);
      const text = await page.locator("body").innerText();

      expect(text).not.toMatch(/\bundefined\b|\bNaN\b|\[object Object\]|\{\{|\}\}|—/);

      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a, button, h1, h2, h3, label, [role=button]")]
          .filter((element) => {
            const style = getComputedStyle(element);
            const visible = element.offsetParent !== null && style.visibility !== "hidden" && element.getClientRects().length > 0;
            const clips = style.overflow !== "visible" || style.textOverflow === "ellipsis" || style.whiteSpace === "nowrap";

            return visible && clips && element.innerText.trim() !== "" && element.scrollWidth > element.clientWidth + 2;
          })
          .map((element) => element.innerText.trim().slice(0, 40)),
      );

      expect(clipped).toEqual([]);
    });

    test("tem links e imagens certos", async ({ page, request }) => {
      await open(page, route);
      const links = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) => ({ href: anchor.getAttribute("href") ?? "", target: anchor.getAttribute("target"), rel: anchor.getAttribute("rel") ?? "", name: (anchor.textContent ?? "").trim() || anchor.getAttribute("aria-label") || "" })),
      );

      for (const link of links) {
        expect(link.name, `link sem nome: ${link.href}`).not.toBe("");

        if (/^https?:/.test(link.href)) {
          expect(link.target, `link externo sem nova aba: ${link.href}`).toBe("_blank");
          expect(link.rel, `link externo sem rel seguro: ${link.href}`).toMatch(/noreferrer|noopener/);
        }
      }

      const internal = [...new Set(links.map((link) => link.href).filter((href) => href.startsWith("/") && !href.startsWith("//")).map((href) => href.split("#")[0]).filter(Boolean))];

      for (const href of internal) {
        const response = await request.get(href);

        expect(response.status(), `link interno quebrado: ${href}`).toBe(200);
      }

      const missingAlt = await page.locator("img:not([alt])").count();

      expect(missingAlt).toBe(0);
    });

    test("passa na checagem de acessibilidade", async ({ page }) => {
      await open(page, route);
      const results = await new AxeBuilder({ page }).exclude("nextjs-portal").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const violations = results.violations.map((violation) => `${violation.id}: ${violation.nodes.length} elemento(s), ex: ${violation.nodes[0]?.target.join(" ")}`);

      expect(violations).toEqual([]);
    });
  });
}

for (const route of missingRoutes) {
  test(`endereço inexistente ${route} mostra o 404 do site`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /Game over\. This page does not exist\./ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voltar para as versões" })).toHaveAttribute("href", "/pt");
  });
}

test("a página inicial leva às três versões e à visão rápida", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Arcade.*Play/ })).toHaveAttribute("href", "/arcade");
  await expect(page.getByRole("link", { name: /Overworld.*Play/ })).toHaveAttribute("href", "/overworld");
  await expect(page.getByRole("link", { name: /Journey.*Play/ })).toHaveAttribute("href", "/journey");
  await expect(page.getByRole("link", { name: "Quick view" }).first()).toHaveAttribute("href", "/quick");
  await page.getByRole("link", { name: "PT" }).click();
  await expect(page).toHaveURL(/\/pt$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Luan Magalhães");
  await expect(page.getByText("Escolha a sua versão")).toBeVisible();
});

test("os currículos para download existem e não têm telefone no nome", async ({ request }) => {
  for (const file of ["/resume/luan-magalhaes-resume.pdf", "/resume/luan-magalhaes-curriculo.pdf"]) {
    const response = await request.get(file);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  }
});

test("robots e sitemap respondem", async ({ request }) => {
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();

  expect(sitemap.match(/<loc>/g)?.length).toBe(routes.length);
});

test("o primeiro Tab vai para o atalho de pular conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveClass(/skip-link/);
});
