export function navigableItems(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }

  return Array.from(root.querySelectorAll<HTMLElement>("[data-nav]")).filter((node) => node.offsetParent !== null && !node.hasAttribute("disabled"));
}

export function moveFocus(root: HTMLElement | null, delta: number): HTMLElement | null {
  const items = navigableItems(root);

  if (items.length === 0) {
    return null;
  }

  const index = items.indexOf(document.activeElement as HTMLElement);
  const next = index === -1 ? (delta > 0 ? 0 : items.length - 1) : (index + delta + items.length) % items.length;
  const target = items[next];
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "nearest" });
  return target;
}

export function pressFocused(root: HTMLElement | null): boolean {
  const active = document.activeElement as HTMLElement | null;

  if (root && active && root.contains(active) && active.hasAttribute("data-nav")) {
    active.click();
    return true;
  }

  return Boolean(moveFocus(root, 1));
}

export function shake(element: HTMLElement): void {
  element.classList.remove("shake");
  void element.offsetWidth;
  element.classList.add("shake");
}

export function flyCartridge(source: HTMLElement, target: HTMLElement | null, targetWidth: number): Promise<void> {
  const art = source.querySelector("svg") ?? source;
  const from = art.getBoundingClientRect();
  const to = target?.getBoundingClientRect();

  if (!to || from.width === 0 || to.width === 0) {
    return Promise.resolve();
  }

  const ghost = document.createElement("div");
  ghost.className = "cart-ghost";
  ghost.appendChild(art.cloneNode(true));
  Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px` });
  document.body.appendChild(ghost);

  const scale = targetWidth / from.width;
  const dx = to.left + to.width / 2 - (from.left + (from.width * scale) / 2);
  const dy = to.top - from.height * scale * 0.55 - from.top;
  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)" },
      { transform: `translate(${dx * 0.5}px, ${Math.min(dy * 0.5, -40) - 60}px) scale(${(1 + scale) / 2})`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
    ],
    { duration: 520, easing: "cubic-bezier(.45,0,.3,1)" },
  );

  return animation.finished.then(
    () => ghost.remove(),
    () => ghost.remove(),
  );
}

export function burstNoise(canvas: HTMLCanvasElement, screen: HTMLElement | null): void {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const image = context.createImageData(canvas.width, canvas.height);
  let frames = 0;
  screen?.classList.add("is-switching");

  const draw = () => {
    for (let index = 0; index < image.data.length; index += 4) {
      const value = Math.floor(Math.random() * 120);
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value + 24;
      image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    frames += 1;

    if (frames < 5) {
      window.requestAnimationFrame(draw);
    } else {
      screen?.classList.remove("is-switching");
    }
  };

  draw();
}
