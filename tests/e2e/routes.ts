import { locales } from "../../src/domain/locale";
import { pagePath, versionIds, type PageId } from "../../src/lib/routes";

const pages: PageId[] = ["home", "quick", ...versionIds];

export const routes = pages.flatMap((page) => locales.map((locale) => pagePath(page, locale)));

export const missingRoutes = ["/does-not-exist", "/pt/nao-existe", "/quick/extra", "/arcade/level-99", "/pt/journey/fim"];
