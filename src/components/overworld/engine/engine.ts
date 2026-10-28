import { drawIcon } from "@/components/overworld/art/buildings";
import { context, createCanvas, hash2, spriteCanvas, TILE } from "@/components/overworld/art/canvas";
import { paletteSignature, readColors, type Colors } from "@/components/overworld/art/palette";
import { buildArcadeScene, buildTownScene, type CabinetApp, type LineKey, type Scene, type SceneId, type Speaker, type TalkEntry } from "@/components/overworld/art/scenes";
import { bossArt, decorArt, npcRows, type BossSprite, type NpcLook } from "@/components/overworld/art/sprites";
import { cameraAxis, computeScale, phoneBreakpoint, toolbarBreakpoint } from "@/components/overworld/model/camera";
import { buildingById, placeById, townBuildings, townDecor, townRows, type ArcadeLayout, type DistrictId, type FacingDirection } from "@/components/overworld/model/map";
import { directionBetween, samePoint, type Direction, type Point, type TileMap } from "@/game/grid";
import { findPath, nearestWalkable } from "@/game/pathfinding";

export type SoundKind = "step" | "bump" | "door" | "select" | "text" | "hit" | "win" | "open";

export interface EngineCallbacks {
  onPlace(place: DistrictId, fromDoor: boolean): void;
  onApp(appId: string): void;
  onPrivate(): void;
  onTalk(speaker: Speaker, lines: LineKey): void;
  onSceneChange(scene: SceneId): void;
  onArcadeEntered(): void;
  onSound(kind: SoundKind): void;
}

export interface EngineOptions {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  tagLayer: HTMLElement;
  topBar: () => HTMLElement | null;
  bottomBar: () => HTMLElement | null;
  cabinetApps: CabinetApp[];
  layout: ArcadeLayout;
  thumbs: Record<string, string>;
  callbacks: EngineCallbacks;
}

interface Actor {
  x: number;
  y: number;
  px: number;
  py: number;
  dir: FacingDirection;
  moving: boolean;
  from: Point;
  to: Point;
  progress: number;
  steps: number;
  speed: number;
  idle: number;
  trail: Point | null;
}

interface Goal {
  place?: DistrictId;
  app?: string;
  privateBuilds?: boolean;
  talk?: TalkEntry;
  face?: FacingDirection;
}

interface TravelTarget {
  stand: Point;
  face: FacingDirection;
  door: string | null;
  goal: Goal;
}

interface Transition {
  phase: "out" | "in";
  elapsed: number;
  duration: number;
  onMiddle: () => void;
  resolve: () => void;
}

interface Gull {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type FrameSet = Record<FacingDirection, HTMLImageElement[]> & { idle: HTMLImageElement[] };

const facings: FacingDirection[] = ["down", "left", "right", "up"];

function makeActor(x: number, y: number, dir: FacingDirection): Actor {
  return { x, y, px: x * TILE, py: y * TILE, dir, moving: false, from: { x, y }, to: { x, y }, progress: 0, steps: 0, speed: 0.15, idle: 0, trail: null };
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function loadFrames(base: string, idle: boolean): Promise<FrameSet | null> {
  const set: Partial<Record<FacingDirection, HTMLImageElement[]>> = {};
  for (const dir of facings) {
    const frames = await Promise.all([0, 1, 2].map((frame) => loadImage(`${base}-${dir}-${frame}.png`)));
    if (frames.some((frame) => !frame)) return null;
    set[dir] = frames as HTMLImageElement[];
  }
  const idleFrames = idle ? await Promise.all([0, 1].map((frame) => loadImage(`${base}-idle-${frame}.png`))) : [];
  const complete = idleFrames.every(Boolean) ? (idleFrames as HTMLImageElement[]) : [];
  return { down: set.down!, left: set.left!, right: set.right!, up: set.up!, idle: complete };
}

export class OverworldEngine {
  private readonly options: EngineOptions;
  private readonly ctx: CanvasRenderingContext2D;
  private colors: Colors;
  private signature = "";
  private scenes: Record<SceneId, Scene>;
  private scene: Scene;
  private hero: Actor;
  private dog: Actor;
  private path: Point[] = [];
  private pathGoal: Goal | null = null;
  private held: FacingDirection[] = [];
  private time = 0;
  private last = 0;
  private frameId = 0;
  private running = false;
  private paused = false;
  private transition: Transition | null = null;
  private camera = { x: 0, y: 0 };
  private cameraFocus: { x: number; y: number } | null = null;
  private insets = { top: 0, bottom: 0 };
  private view = { w: 480, h: 300 };
  private scale = 3;
  private hover: string | null = null;
  private reducedMotion = false;
  private warpTravel = false;
  private gulls: Gull[] = [];
  private crab = { x: 3 * TILE, y: 41 * TILE + 4, dir: 1, frame: 0 };
  private heroFrames: FrameSet | null = null;
  private dogFrames: FrameSet | null = null;
  private npcSprites: Record<string, HTMLCanvasElement> = {};
  private gullSprites: HTMLCanvasElement[] = [];
  private crabSprites: HTMLCanvasElement[] = [];
  private thumbs: Record<string, HTMLCanvasElement> = {};
  private mosaic: HTMLCanvasElement | null = null;
  private tags: { element: HTMLElement; x: number; y: number; width: number; height: number }[] = [];
  private roomBottom = -1;
  private drag: { x: number; y: number; moved: boolean; focus: { x: number; y: number } } | null = null;
  private readonly listeners: [EventTarget, string, EventListener][] = [];

  constructor(options: EngineOptions) {
    this.options = options;
    this.ctx = context(options.canvas);
    this.colors = readColors(options.root);
    this.signature = paletteSignature(options.root);
    this.scenes = this.buildScenes();
    this.scene = this.scenes.town;
    this.hero = makeActor(this.scene.spawn.x, this.scene.spawn.y, this.scene.spawn.dir);
    this.dog = makeActor(this.scene.spawn.x, this.scene.spawn.y - 1, this.scene.spawn.dir);
    this.buildSprites();
    this.loadAssets();
    this.attachPointer();
    this.resize();
  }

  private buildScenes(): Record<SceneId, Scene> {
    return {
      town: buildTownScene(this.colors),
      arcade: buildArcadeScene(this.colors, this.options.layout, this.options.cabinetApps),
    };
  }

  private buildSprites(): void {
    const looks: NpcLook[] = ["kid", "harbor", "keeper", "nurse", "attendant"];
    this.npcSprites = Object.fromEntries(looks.map((look) => [look, spriteCanvas(npcRows(look), this.colors.px)]));
    this.gullSprites = decorArt.gull.map((rows) => spriteCanvas(rows, this.colors.px));
    this.crabSprites = decorArt.crab.map((rows) => spriteCanvas(rows, this.colors.px));
  }

  private loadAssets(): void {
    void loadFrames("/kit/characters/luan/frames/luan-topdown", false).then((frames) => {
      this.heroFrames = frames;
    });
    void loadFrames("/kit/characters/matilda/frames/matilda-topdown", true).then((frames) => {
      this.dogFrames = frames;
    });
    for (const [appId, src] of Object.entries(this.options.thumbs)) {
      void loadImage(src).then((image) => {
        if (!image) return;
        const canvas = createCanvas(25, 11);
        const ctx = context(canvas);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        const sourceHeight = image.naturalWidth / (25 / 11);
        ctx.drawImage(image, 0, Math.max(0, (image.naturalHeight - sourceHeight) / 3), image.naturalWidth, Math.min(sourceHeight, image.naturalHeight), 0, 0, 25, 11);
        this.thumbs[appId] = canvas;
      });
    }
  }

  townSnapshot(): HTMLCanvasElement {
    const town = this.scenes.town;
    const canvas = createCanvas(town.cols * TILE, town.rows * TILE);
    const ctx = context(canvas);
    ctx.drawImage(town.ground, 0, 0);
    ctx.drawImage(town.upper, 0, 0);
    return canvas;
  }

  rebuildIfPaletteChanged(): void {
    const signature = paletteSignature(this.options.root);
    if (signature === this.signature) return;
    this.signature = signature;
    this.colors = readColors(this.options.root);
    const sceneId = this.scene.id;
    this.scenes = this.buildScenes();
    this.scene = this.scenes[sceneId];
    this.buildSprites();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = 0;
    const loop = (now: number): void => {
      if (!this.running) return;
      const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0);
      this.last = now;
      this.time += dt;
      this.stepTransition(dt);
      this.update(dt);
      this.positionTags();
      this.render();
      this.frameId = requestAnimationFrame(loop);
    };
    this.frameId = requestAnimationFrame(loop);
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
    for (const [target, type, listener] of this.listeners) target.removeEventListener(type, listener);
    this.listeners.length = 0;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    if (paused) {
      this.held = [];
      this.drag = null;
    }
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.updateTravelMode();
  }

  get sceneId(): SceneId {
    return this.scene.id;
  }

  private updateTravelMode(): void {
    this.warpTravel = this.reducedMotion || window.innerWidth < phoneBreakpoint;
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scale = computeScale(width, height, townRows[0].length * TILE);
    this.view.w = Math.ceil(width / this.scale);
    this.view.h = Math.ceil(height / this.scale);
    const canvas = this.options.canvas;
    canvas.width = this.view.w;
    canvas.height = this.view.h;
    canvas.style.width = this.view.w * this.scale + "px";
    canvas.style.height = this.view.h * this.scale + "px";
    const top = this.options.topBar();
    const bottom = width < toolbarBreakpoint ? this.options.bottomBar() : null;
    this.insets.top = Math.ceil((top ? top.getBoundingClientRect().bottom : 0) / this.scale);
    this.insets.bottom = bottom ? Math.ceil(bottom.getBoundingClientRect().height / this.scale) : 0;
    this.updateTravelMode();
    this.refreshTags();
    this.updateCamera();
  }

  refreshTags(): void {
    this.tags = Array.from(this.options.tagLayer.querySelectorAll<HTMLElement>("[data-anchor-x]")).map((element) => ({
      element,
      x: Number(element.dataset.anchorX),
      y: Number(element.dataset.anchorY),
      width: element.offsetWidth,
      height: element.offsetHeight,
    }));
    this.positionTags();
  }

  setHover(id: string | null): void {
    this.hover = id;
  }

  focusAnchor(x: number, y: number): void {
    const screenX = (x - this.camera.x) * this.scale;
    const screenY = (y - this.camera.y) * this.scale;
    const top = this.insets.top * this.scale;
    const bottom = window.innerHeight - this.insets.bottom * this.scale;
    if (screenX < 0 || screenX > window.innerWidth || screenY < top + 30 || screenY > bottom - 10) this.cameraFocus = { x, y: y + 40 };
  }

  private tileMap(): TileMap {
    const scene = this.scene;
    const inside = (point: Point): boolean => point.x >= 0 && point.y >= 0 && point.x < scene.cols && point.y < scene.rows;
    return {
      width: scene.cols,
      height: scene.rows,
      tileAt: (point) => (inside(point) ? (scene.solid[point.y * scene.cols + point.x] ? "#" : ".") : null),
      isWalkable: (point) => inside(point) && scene.solid[point.y * scene.cols + point.x] === 0,
    };
  }

  private isSolid(x: number, y: number): boolean {
    return !this.tileMap().isWalkable({ x, y });
  }

  private isDoor(point: Point): boolean {
    return this.scene.doors.has(point.x + "," + point.y);
  }

  private pathTo(goal: Point): Point[] | null {
    return findPath(this.tileMap(), { x: this.hero.x, y: this.hero.y }, goal, (point) => this.isDoor(point) && !samePoint(point, goal));
  }

  private freeNear(x: number, y: number, avoidX: number, avoidY: number): Point {
    const candidates: Point[] = [{ x, y }, { x: avoidX, y: avoidY + 1 }, { x: avoidX - 1, y: avoidY }, { x: avoidX + 1, y: avoidY }, { x: avoidX, y: avoidY - 1 }];
    const found = candidates.find((point) => !this.isSolid(point.x, point.y) && !(point.x === avoidX && point.y === avoidY) && !this.isDoor(point));
    return found ?? { x: avoidX, y: avoidY };
  }

  private placeHero(x: number, y: number, dir: FacingDirection): void {
    this.hero = makeActor(x, y, dir);
    const offset = { up: { x: 0, y: 1 }, down: { x: 0, y: -1 }, left: { x: 1, y: 0 }, right: { x: -1, y: 0 } }[dir];
    const spot = this.freeNear(x + offset.x, y + offset.y, x, y);
    this.dog = makeActor(spot.x, spot.y, dir);
    this.path = [];
    this.pathGoal = null;
    this.cameraFocus = null;
  }

  private setScene(id: SceneId, spawn?: { x: number; y: number; dir: FacingDirection }): void {
    this.scene = this.scenes[id];
    const start = spawn ?? this.scene.spawn;
    this.placeHero(start.x, start.y, start.dir);
    this.options.callbacks.onSceneChange(id);
    this.updateCamera();
  }

  private startMove(actor: Actor, dir: FacingDirection, speed: number, to?: Point): void {
    const offsets: Record<FacingDirection, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    actor.dir = dir;
    actor.from = { x: actor.x, y: actor.y };
    actor.to = to ?? { x: actor.x + offsets[dir].x, y: actor.y + offsets[dir].y };
    actor.moving = true;
    actor.progress = 0;
    actor.speed = speed;
  }

  private tryStep(dir: FacingDirection, speed: number): boolean {
    const offsets: Record<FacingDirection, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const tx = this.hero.x + offsets[dir].x;
    const ty = this.hero.y + offsets[dir].y;
    this.hero.dir = dir;
    const talk = this.scene.talk.get(tx + "," + ty);
    if (talk) {
      this.path = [];
      this.pathGoal = null;
      this.held = [];
      this.interact(talk);
      return false;
    }
    if (this.isSolid(tx, ty)) {
      this.options.callbacks.onSound("bump");
      return false;
    }
    this.dog.trail = { x: this.hero.x, y: this.hero.y };
    this.startMove(this.hero, dir, speed);
    this.hero.steps += 1;
    if (this.hero.steps % 2 === 0) this.options.callbacks.onSound("step");
    return true;
  }

  private interact(entry: TalkEntry): void {
    const callbacks = this.options.callbacks;
    if (entry.place) callbacks.onPlace(entry.place, false);
    else if (entry.app) callbacks.onApp(entry.app);
    else if (entry.privateBuilds) callbacks.onPrivate();
    else if (entry.lines) callbacks.onTalk(entry.speaker ?? "sign", entry.lines);
  }

  interactFacing(): void {
    if (this.paused || this.transition) return;
    const offsets: Record<FacingDirection, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const offset = offsets[this.hero.dir];
    const entry = this.scene.talk.get(this.hero.x + offset.x + "," + (this.hero.y + offset.y));
    if (entry) this.interact(entry);
  }

  press(dir: Direction): void {
    this.path = [];
    this.pathGoal = null;
    if (!this.held.includes(dir)) this.held.push(dir);
  }

  release(dir: Direction): void {
    this.held = this.held.filter((entry) => entry !== dir);
  }

  releaseAll(): void {
    this.held = [];
  }

  private update(dt: number): void {
    const hero = this.hero;
    if (hero.moving) {
      hero.progress += dt / hero.speed;
      if (hero.progress >= 1) {
        hero.x = hero.to.x;
        hero.y = hero.to.y;
        hero.moving = false;
        hero.progress = 0;
        const door = this.scene.doors.get(hero.x + "," + hero.y);
        if (door) {
          this.path = [];
          this.pathGoal = null;
          this.held = [];
          this.enterDoor(door);
        } else if (this.path.length === 0 && this.pathGoal) {
          const goal = this.pathGoal;
          this.pathGoal = null;
          this.arrive(goal);
        }
      }
    }
    if (!hero.moving && !this.paused && !this.transition) {
      if (this.path.length) {
        const next = this.path.shift()!;
        const dir = directionBetween({ x: hero.x, y: hero.y }, next);
        if (!dir || !this.tryStep(dir, 0.09)) {
          this.path = [];
          this.pathGoal = null;
        }
      } else if (this.held.length) {
        this.tryStep(this.held[this.held.length - 1], 0.15);
        this.cameraFocus = null;
      }
    }
    hero.px = hero.moving ? (hero.from.x + (hero.to.x - hero.from.x) * hero.progress) * TILE : hero.x * TILE;
    hero.py = hero.moving ? (hero.from.y + (hero.to.y - hero.from.y) * hero.progress) * TILE : hero.y * TILE;
    this.updateDog(dt);
    if (!this.reducedMotion) this.updateAmbient(dt);
    this.updateCamera();
  }

  private updateDog(dt: number): void {
    const dog = this.dog;
    const hero = this.hero;
    if (dog.moving) {
      dog.progress += dt / dog.speed;
      if (dog.progress >= 1) {
        dog.x = dog.to.x;
        dog.y = dog.to.y;
        dog.moving = false;
      }
    }
    if (!dog.moving && dog.trail) {
      const target = dog.trail;
      const distance = Math.abs(dog.x - hero.x) + Math.abs(dog.y - hero.y);
      if (distance > 1 || (hero.moving && distance >= 1)) {
        const dx = Math.sign(target.x - dog.x);
        const dy = Math.sign(target.y - dog.y);
        if (dx || dy) {
          const dir: FacingDirection = dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";
          if (Math.abs(target.x - dog.x) + Math.abs(target.y - dog.y) > 2) {
            dog.x = target.x;
            dog.y = target.y;
            dog.dir = dir;
          } else this.startMove(dog, dir, hero.speed, dx && dy ? { x: dog.x + dx, y: dog.y } : undefined);
        }
      }
    }
    dog.px = dog.moving ? (dog.from.x + (dog.to.x - dog.from.x) * dog.progress) * TILE : dog.x * TILE;
    dog.py = dog.moving ? (dog.from.y + (dog.to.y - dog.from.y) * dog.progress) * TILE : dog.y * TILE;
    dog.idle = dog.moving ? 0 : dog.idle + dt;
  }

  private updateAmbient(dt: number): void {
    if (this.scene.id !== "town") return;
    const crab = this.crab;
    crab.x += crab.dir * dt * 9;
    if (crab.x > 9 * TILE) crab.dir = -1;
    if (crab.x < 3 * TILE) crab.dir = 1;
    crab.frame = Math.floor(this.time * 6) % 2;
    if (this.gulls.length < 2 && hash2(Math.floor(this.time * 10), 7, 3) < dt * 0.25) {
      const fromLeft = hash2(Math.floor(this.time * 10), 9, 1) < 0.5;
      const lane = hash2(Math.floor(this.time * 10), 11, 2);
      this.gulls.push({ x: fromLeft ? this.camera.x - 20 : this.camera.x + this.view.w + 20, y: this.camera.y + 30 + lane * (this.view.h - 80), vx: (fromLeft ? 1 : -1) * 30, vy: (lane - 0.5) * 6 });
    }
    for (const gull of this.gulls) {
      gull.x += gull.vx * dt;
      gull.y += gull.vy * dt;
    }
    this.gulls = this.gulls.filter((gull) => gull.x > this.camera.x - 60 && gull.x < this.camera.x + this.view.w + 60);
  }

  private updateCamera(): void {
    const scene = this.scene;
    const focus = this.cameraFocus ?? { x: this.hero.px + 8, y: this.hero.py };
    const alignTop = scene.id === "arcade" && window.innerWidth < phoneBreakpoint;
    this.camera.x = cameraAxis({ focus: focus.x, view: this.view.w, scene: scene.cols * TILE, insetStart: 0, insetEnd: 0, alignStart: false });
    this.camera.y = cameraAxis({ focus: focus.y, view: this.view.h, scene: scene.rows * TILE, insetStart: this.insets.top, insetEnd: this.insets.bottom, alignStart: alignTop });
    const roomBottom = Math.round((scene.rows * TILE - this.camera.y) * this.scale);
    if (roomBottom !== this.roomBottom) {
      this.roomBottom = roomBottom;
      this.options.host.style.setProperty("--ow-room-bottom", roomBottom + "px");
    }
  }

  private positionTags(): void {
    const top = this.insets.top * this.scale + 4;
    const bottom = window.innerHeight - this.insets.bottom * this.scale - 4;
    for (const tag of this.tags) {
      let x = Math.round((tag.x - this.camera.x) * this.scale);
      let y = Math.round((tag.y - this.camera.y) * this.scale);
      x = Math.max(tag.width / 2 + 4, Math.min(window.innerWidth - tag.width / 2 - 4, x));
      if (y - tag.height < top && y > top - tag.height * 2) y = top + tag.height;
      const hidden = y - tag.height > bottom || y < top - tag.height;
      tag.element.style.visibility = hidden ? "hidden" : "";
      tag.element.style.transform = `translate(${Math.round(x)}px, ${y}px)`;
    }
  }

  private arrive(goal: Goal): void {
    if (goal.face) this.hero.dir = goal.face;
    const callbacks = this.options.callbacks;
    if (goal.place) callbacks.onPlace(goal.place, false);
    else if (goal.app) callbacks.onApp(goal.app);
    else if (goal.privateBuilds) callbacks.onPrivate();
    else if (goal.talk) this.interact(goal.talk);
  }

  private runTransition(onMiddle: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (this.reducedMotion) {
        onMiddle();
        resolve();
        return;
      }
      this.options.callbacks.onSound("door");
      this.transition = { phase: "out", elapsed: 0, duration: 0.24, onMiddle, resolve };
    });
  }

  private stepTransition(dt: number): void {
    const transition = this.transition;
    if (!transition) return;
    transition.elapsed += dt;
    if (transition.elapsed < transition.duration) return;
    if (transition.phase === "out") {
      transition.onMiddle();
      transition.phase = "in";
      transition.elapsed = 0;
    } else {
      this.transition = null;
      transition.resolve();
    }
  }

  private travel(target: TravelTarget, warp: boolean): void {
    if (this.paused || this.transition) return;
    if (this.warpTravel || warp) {
      void this.runTransition(() => {
        this.placeHero(target.stand.x, target.stand.y, target.face);
        this.updateCamera();
      }).then(() => {
        if (target.door) this.enterDoor(target.door);
        else this.arrive({ ...target.goal, face: target.face });
      });
      return;
    }
    const destination = target.stand;
    const path = this.pathTo(destination);
    if (!path) return;
    if (path.length === 0) {
      if (target.door) this.enterDoor(target.door);
      else this.arrive({ ...target.goal, face: target.face });
      return;
    }
    this.path = path;
    this.pathGoal = target.door ? null : { ...target.goal, face: target.face };
    this.cameraFocus = null;
  }

  private targetForPlace(id: DistrictId): TravelTarget {
    const building = buildingById(id);
    if (building) return { stand: building.door, face: "up", door: building.id, goal: {} };
    const place = placeById(id);
    return { stand: place.entry, face: place.face, door: null, goal: { place: id } };
  }

  goToPlace(id: DistrictId, warp = false): void {
    if (this.scene.id !== "town") {
      void this.exitArcade().then(() => this.travel(this.targetForPlace(id), warp));
      return;
    }
    this.travel(this.targetForPlace(id), warp);
  }

  goToCabinet(appId: string): void {
    const go = (): void => {
      const spot = this.scene.cabinets.find((entry) => entry.appId === appId);
      if (spot) this.travel({ stand: { x: spot.x, y: spot.y + 2 }, face: "up", door: null, goal: { app: appId } }, false);
    };
    if (this.scene.id !== "arcade") void this.enterArcade().then(go);
    else go();
  }

  goToPrivate(): void {
    const go = (): void => {
      const sign = this.options.layout.privateSign;
      this.travel({ stand: { x: sign.x, y: sign.y + 1 }, face: "up", door: null, goal: { privateBuilds: true } }, false);
    };
    if (this.scene.id !== "arcade") void this.enterArcade().then(go);
    else go();
  }

  enterArcade(): Promise<void> {
    return this.runTransition(() => this.setScene("arcade"));
  }

  exitArcade(): Promise<void> {
    const arcade = buildingById("arcade");
    const spawn = arcade ? { x: arcade.door.x, y: arcade.door.y + 1, dir: "down" as FacingDirection } : undefined;
    return this.runTransition(() => this.setScene("town", spawn));
  }

  private enterDoor(id: string): void {
    if (id === "exit") {
      void this.exitArcade();
      return;
    }
    if (id === "arcade") {
      void this.enterArcade().then(() => this.options.callbacks.onArcadeEntered());
      return;
    }
    const building = townBuildings.find((entry) => entry.id === id);
    if (building) this.options.callbacks.onPlace(building.id, true);
  }

  stepOutOfDoor(id: DistrictId): void {
    const building = buildingById(id);
    if (!building || this.scene.id !== "town") return;
    this.placeHero(building.door.x, building.door.y + 1, "down");
  }

  private attachPointer(): void {
    const host = this.options.host;
    const listen = (type: string, handler: (event: PointerEvent) => void): void => {
      const listener = handler as EventListener;
      host.addEventListener(type, listener);
      this.listeners.push([host, type, listener]);
    };
    listen("pointerdown", (event) => {
      if ((event.target as HTMLElement).closest("button, a, [data-anchor-x]") || this.paused) return;
      const available = this.view.h - this.insets.top - this.insets.bottom;
      this.drag = { x: event.clientX, y: event.clientY, moved: false, focus: { x: this.camera.x + this.view.w / 2, y: this.camera.y + this.insets.top + available / 2 } };
    });
    listen("pointermove", (event) => {
      if (event.pointerType === "mouse" && !this.drag) {
        const tile = this.tileAt(event);
        this.hover = this.scene.id === "town" ? this.placeAt(tile.x, tile.y) : null;
      }
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      if (!this.drag.moved && Math.hypot(dx, dy) > 12) this.drag.moved = true;
      if (this.drag.moved) this.cameraFocus = { x: this.drag.focus.x - dx / this.scale, y: this.drag.focus.y - dy / this.scale };
    });
    listen("pointercancel", () => {
      this.drag = null;
    });
    listen("pointerup", (event) => {
      const drag = this.drag;
      this.drag = null;
      if (!drag || drag.moved || this.paused || (event.target as HTMLElement).closest("button, a, [data-anchor-x]")) return;
      this.tap(this.tileAt(event));
    });
  }

  private tileAt(event: PointerEvent): Point {
    const rect = this.options.host.getBoundingClientRect();
    const worldX = (event.clientX - rect.left) / this.scale + this.camera.x;
    const worldY = (event.clientY - rect.top) / this.scale + this.camera.y;
    return { x: Math.floor(worldX / TILE), y: Math.floor(worldY / TILE) };
  }

  private placeAt(x: number, y: number): DistrictId | null {
    const building = townBuildings.find((entry) => x >= entry.x && x < entry.x + entry.w && y >= entry.y - 1 && y < entry.y + entry.h);
    if (building) return building.id;
    if (x >= 17 && y >= 24 && y <= 30) return "harbor";
    const talk = this.scene.talk.get(x + "," + y);
    return talk?.place ?? null;
  }

  private tap(tile: Point): void {
    if (this.scene.id === "town") {
      const place = this.placeAt(tile.x, tile.y);
      if (place) {
        this.goToPlace(place);
        return;
      }
    } else {
      const cabinet = this.scene.cabinets.find((spot) => tile.x >= spot.x && tile.x <= spot.x + 1 && tile.y >= spot.y - 1 && tile.y <= spot.y + 1);
      if (cabinet) {
        this.goToCabinet(cabinet.appId);
        return;
      }
      const layout = this.options.layout;
      if (tile.x >= layout.ropeColumn.x && tile.y <= layout.ropeRow.y) {
        this.goToPrivate();
        return;
      }
      if (layout.exits.some((exit) => exit.x === tile.x && tile.y >= exit.y)) {
        void this.exitArcade();
        return;
      }
    }
    const talk = this.scene.talk.get(tile.x + "," + tile.y);
    const map = this.tileMap();
    const target = talk || this.isSolid(tile.x, tile.y) ? nearestWalkable(map, tile, { x: this.hero.x, y: this.hero.y }) : tile;
    if (!target || this.isDoor(target)) return;
    const path = this.pathTo(target);
    if (!path) return;
    this.path = path;
    this.pathGoal = talk ? { talk } : null;
    this.cameraFocus = null;
  }

  private render(): void {
    const ctx = this.ctx;
    const scene = this.scene;
    const camera = this.camera;
    const t = this.reducedMotion ? 0 : this.time;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = scene.outside === "sea" ? this.colors.tok("world-sea-deep") : this.colors.px.K;
    ctx.fillRect(0, 0, this.view.w, this.view.h);
    if (scene.skirt) ctx.drawImage(scene.skirt, -scene.skirtPad * TILE - camera.x, -scene.skirtPad * TILE - camera.y);
    if (scene.outside === "sea") this.drawOuterSparkles(t);
    ctx.drawImage(scene.ground, -camera.x, -camera.y);
    if (scene.id === "town") this.drawTown(t);
    else this.drawArcade(t);
    const actors: { y: number; draw: () => void }[] = scene.npcs.map((npc) => ({ y: npc.y * TILE, draw: () => this.drawNpc(npc.look, npc.x, npc.y, t) }));
    actors.push({ y: this.dog.py, draw: () => this.drawDog(t) });
    actors.push({ y: this.hero.py + 0.5, draw: () => this.drawHero() });
    actors.sort((a, b) => a.y - b.y).forEach((actor) => actor.draw());
    ctx.drawImage(scene.upper, -camera.x, -camera.y);
    if (scene.id === "town") this.drawGulls(t);
    this.drawMarker(t);
    if (this.transition) this.drawTransition();
  }

  private drawSparkle(tx: number, ty: number, t: number, depth: number): void {
    const seed = hash2(tx, ty, 77);
    if (seed > 0.55) return;
    const phase = seed * 12;
    const visible = this.reducedMotion ? seed < 0.25 : Math.sin(t * 1.4 + phase) > 0.2;
    if (!visible) return;
    const drift = this.reducedMotion ? 0 : Math.floor((t * 2 + phase) % 4);
    const x = tx * TILE + 3 + Math.floor(seed * 9) + drift - this.camera.x;
    const y = ty * TILE + 4 + Math.floor(hash2(ty, tx, 5) * 8) - this.camera.y;
    this.ctx.fillStyle = depth > 2 ? this.colors.tok("world-sea-light") : this.colors.tok("world-foam");
    this.ctx.fillRect(x, y, 3, 1);
    this.ctx.fillRect(x + 1, y - 1, 1, 1);
  }

  private visibleTiles(): { startX: number; startY: number; endX: number; endY: number } {
    return {
      startX: Math.floor(this.camera.x / TILE) - 1,
      startY: Math.floor(this.camera.y / TILE) - 1,
      endX: Math.ceil((this.camera.x + this.view.w) / TILE) + 1,
      endY: Math.ceil((this.camera.y + this.view.h) / TILE) + 1,
    };
  }

  private drawOuterSparkles(t: number): void {
    const scene = this.scene;
    const { startX, startY, endX, endY } = this.visibleTiles();
    for (let ty = startY; ty < endY; ty++) {
      for (let tx = startX; tx < endX; tx++) {
        if (tx >= 0 && ty >= 0 && tx < scene.cols && ty < scene.rows) continue;
        this.drawSparkle(tx, ty, t, 3);
      }
    }
  }

  private drawTown(t: number): void {
    const ctx = this.ctx;
    const camera = this.camera;
    const colors = this.colors;
    const scene = this.scene;
    const { startX, startY, endX, endY } = this.visibleTiles();
    for (let ty = Math.max(0, startY); ty < Math.min(scene.rows, endY); ty++) {
      for (let tx = Math.max(0, startX); tx < Math.min(scene.cols, endX); tx++) {
        const char = townRows[ty][tx];
        if (char === "~" && scene.depth && scene.depth[ty * scene.cols + tx] >= 2) this.drawSparkle(tx, ty, t, scene.depth[ty * scene.cols + tx]);
        else if (char === "r") {
          const offset = Math.floor((t * 10 + hash2(tx, ty, 3) * 16) % 16);
          ctx.fillStyle = colors.tok("world-foam");
          ctx.fillRect(tx * TILE + offset - camera.x, ty * TILE + 5 + (tx % 2) * 5 - camera.y, 3, 1);
        }
      }
    }
    ctx.fillStyle = colors.tok("world-foam-bright");
    const shore = scene.shore;
    const left = camera.x - 2;
    const right = camera.x + this.view.w + 2;
    const top = camera.y - 2;
    const bottom = camera.y + this.view.h + 2;
    for (let index = 0; index < shore.length; index += 2) {
      const x = shore[index];
      const y = shore[index + 1];
      if (x < left || x > right || y < top || y > bottom) continue;
      const wave = this.reducedMotion ? hash2(x, y, 9) - 0.75 : Math.sin(t * 2.2 - (x + y) * 0.09) + hash2(x, y, 9) * 0.6 - 1.1;
      if (wave > 0) ctx.fillRect(x - camera.x, y - camera.y, 1, 1);
    }
    scene.ships.forEach((ship) => {
      const bob = this.reducedMotion ? 0 : Math.round(Math.sin(t * 1.6 + ship.phase));
      ctx.drawImage(ship.canvas, ship.x - 6 - camera.x, ship.y - 8 + bob - camera.y);
    });
    const crabSprite = this.crabSprites[this.crab.frame];
    if (crabSprite) ctx.drawImage(crabSprite, Math.round(this.crab.x) - camera.x, Math.round(this.crab.y) - camera.y);
    const [fx, fy] = townDecor.fountain;
    const fountainX = fx * TILE + 16 - camera.x;
    const fountainY = fy * TILE + 6 - camera.y;
    ctx.fillStyle = colors.tok("world-foam");
    for (let drop = 0; drop < 6; drop++) {
      const phase = (t * 1.5 + drop / 6) % 1;
      const side = drop % 2 ? 1 : -1;
      ctx.fillRect(Math.round(fountainX + side * (2 + phase * 7)), Math.round(fountainY - 6 + phase * 14 - Math.sin(phase * Math.PI) * 8), 1, 2);
    }
    ctx.fillStyle = colors.tok("world-foam-bright");
    ctx.fillRect(fountainX - 1, fountainY - 4 - (Math.floor(t * 4) % 2), 2, 3);
    const arcade = buildingById("arcade");
    if (arcade) {
      const signX = arcade.door.x * TILE + 8 - 46 - camera.x;
      const signY = arcade.y * TILE + 10 - camera.y;
      const bulbs = [colors.px.R, colors.px.W, colors.px.r];
      const chase = Math.floor(t * 4);
      let bulb = 0;
      for (let x = 2; x < 90; x += 4) {
        ctx.fillStyle = bulbs[(bulb + chase) % 3];
        ctx.fillRect(signX + x, signY, 2, 2);
        ctx.fillRect(signX + 88 - x, signY + 28, 2, 2);
        bulb += 1;
      }
    }
    const fort = buildingById("fort");
    if (fort) {
      const gateX = fort.door.x * TILE + 8;
      for (const torchX of [gateX - 32, gateX + 30]) {
        const tx = torchX - camera.x;
        const ty = fort.y * TILE + 56 - camera.y;
        ctx.fillStyle = colors.px.K;
        ctx.fillRect(tx - 1, ty, 3, 8);
        ctx.fillStyle = colors.tok("world-wood-dark");
        ctx.fillRect(tx, ty + 1, 1, 6);
        const flicker = Math.floor(t * 7 + torchX) % 3;
        ctx.fillStyle = colors.px.A;
        ctx.fillRect(tx - 1, ty - 4 - (flicker === 1 ? 1 : 0), 3, 4);
        ctx.fillStyle = colors.px.Y;
        ctx.fillRect(tx, ty - 3 - (flicker === 2 ? 1 : 0), 1, 3);
      }
    }
    const lighthouse = buildingById("lighthouse");
    if (lighthouse) {
      const lampX = lighthouse.door.x * TILE + 8 - camera.x;
      const lampY = lighthouse.y * TILE + 3 - camera.y;
      ctx.fillStyle = (Math.sin(t * 2) + 1) / 2 > 0.5 ? colors.px.W : colors.px.Y;
      ctx.fillRect(lampX - 2, lampY + 2, 4, 4);
      if (!this.reducedMotion) {
        const angle = t * 0.9;
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = colors.px.W;
        ctx.beginPath();
        ctx.moveTo(lampX, lampY + 4);
        ctx.lineTo(lampX + Math.cos(angle - 0.12) * 90, lampY + 4 + Math.sin(angle - 0.12) * 40);
        ctx.lineTo(lampX + Math.cos(angle + 0.12) * 90, lampY + 4 + Math.sin(angle + 0.12) * 40);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }

  private drawArcade(t: number): void {
    const ctx = this.ctx;
    const colors = this.colors;
    this.scene.cabinets.forEach((spot, index) => {
      const sx = spot.x * TILE + 4 - this.camera.x;
      const sy = spot.y * TILE + 3 - this.camera.y;
      const thumb = this.thumbs[spot.appId];
      if (thumb) ctx.drawImage(thumb, sx, sy);
      else {
        const stripes = [colors.px.r, colors.px.V, colors.px.b, colors.px.a, colors.px.g, colors.px.Y, colors.px.A, colors.px.R];
        const shift = this.reducedMotion ? 0 : Math.floor(t * 3);
        for (let column = 0; column < 25; column++) {
          ctx.fillStyle = stripes[(Math.floor(column / 3) + shift) % stripes.length];
          ctx.fillRect(sx + column, sy, 1, 11);
        }
        drawIcon(ctx, colors, "play", sx + 7, sy);
      }
      if (!this.reducedMotion) {
        const line = Math.floor((t * 8 + index * 3) % 14);
        if (line < 11) {
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = colors.px.W;
          ctx.fillRect(sx, sy + line, 25, 1);
          ctx.restore();
        }
      }
      const blink = this.reducedMotion ? 1 : Math.floor(t * 2 + index) % 2;
      ctx.fillStyle = blink ? colors.px.Y : colors.px.A;
      ctx.fillRect(sx + 1, sy - 8, 2, 2);
      ctx.fillRect(sx + 22, sy - 8, 2, 2);
    });
  }

  private drawShadow(x: number, y: number, radius: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = this.colors.tok("world-shadow");
    ctx.fillRect(Math.round(x - radius) - this.camera.x, Math.round(y) - this.camera.y, radius * 2, 2);
    ctx.fillRect(Math.round(x - radius + 2) - this.camera.x, Math.round(y) + 2 - this.camera.y, radius * 2 - 4, 1);
    ctx.restore();
  }

  private drawNpc(look: NpcLook, x: number, y: number, t: number): void {
    const sprite = this.npcSprites[look];
    if (!sprite) return;
    const bob = this.reducedMotion ? 0 : Math.floor(t * 1.5 + x) % 2;
    this.drawShadow(x * TILE + 8, y * TILE + 14, 6);
    this.ctx.drawImage(sprite, 0, 0, 16, 24 - bob, x * TILE - this.camera.x, y * TILE - 8 + bob - this.camera.y, 16, 24 - bob);
  }

  private walkFrame(actor: Actor): number {
    if (!actor.moving) return 0;
    if (actor.progress < 0.5) return actor.steps % 2 ? 1 : 2;
    return 0;
  }

  private drawHero(): void {
    const frames = this.heroFrames;
    this.drawShadow(this.hero.px + 8, this.hero.py + 14, 6);
    if (!frames) return;
    const frame = frames[this.hero.dir][this.walkFrame(this.hero)];
    this.ctx.drawImage(frame, Math.round(this.hero.px) - this.camera.x, Math.round(this.hero.py) - 8 - this.camera.y);
  }

  private drawDog(t: number): void {
    const frames = this.dogFrames;
    const dog = this.dog;
    this.drawShadow(dog.px + 8, dog.py + 14, 5);
    if (!frames) return;
    let frame: HTMLImageElement;
    if (dog.moving) frame = frames[dog.dir][dog.progress < 0.5 ? 1 : 2];
    else if (dog.idle > 1.2 && frames.idle.length) frame = frames.idle[this.reducedMotion ? 0 : Math.floor(t * 3) % frames.idle.length];
    else frame = frames[dog.dir][0];
    this.ctx.drawImage(frame, Math.round(dog.px) - this.camera.x, Math.round(dog.py) - this.camera.y);
  }

  private drawGulls(t: number): void {
    if (this.reducedMotion) return;
    const ctx = this.ctx;
    this.gulls.forEach((gull, index) => {
      const frame = this.gullSprites[Math.floor(t * 5 + index) % 2];
      if (!frame) return;
      const x = Math.round(gull.x) - this.camera.x;
      const y = Math.round(gull.y) - this.camera.y;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = this.colors.tok("world-shadow");
      ctx.fillRect(x + 4, y + 30, 8, 2);
      ctx.restore();
      if (gull.vx < 0) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -x - 16, y);
        ctx.restore();
      } else ctx.drawImage(frame, x, y);
    });
  }

  private drawMarker(t: number): void {
    if (!this.hover) return;
    const tag = this.tags.find((entry) => entry.element.dataset.tagId === this.hover);
    if (!tag) return;
    const ctx = this.ctx;
    const bounce = this.reducedMotion ? 0 : Math.floor(t * 4) % 2;
    const x = Math.round(tag.x) - this.camera.x;
    const y = Math.round(tag.y) - this.camera.y + bounce;
    ctx.fillStyle = this.colors.px.K;
    for (let row = 0; row < 5; row++) ctx.fillRect(x - 5 + row, y - 1 + row * 2, 11 - row * 2, 2);
    ctx.fillStyle = this.colors.px.Y;
    for (let row = 0; row < 4; row++) ctx.fillRect(x - 4 + row, y + row * 2, 9 - row * 2, 1);
  }

  private drawTransition(): void {
    const transition = this.transition;
    if (!transition) return;
    const ctx = this.ctx;
    const canvas = this.options.canvas;
    const progress = Math.min(1, transition.elapsed / transition.duration);
    const amount = transition.phase === "out" ? progress : 1 - progress;
    const block = Math.max(1, Math.round(1 + amount * 11));
    if (block > 1) {
      const small = this.mosaic ?? (this.mosaic = createCanvas(1, 1));
      small.width = Math.ceil(canvas.width / block);
      small.height = Math.ceil(canvas.height / block);
      const smallCtx = context(small);
      smallCtx.imageSmoothingEnabled = true;
      smallCtx.drawImage(canvas, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, small.width * block, small.height * block);
    }
    ctx.save();
    ctx.globalAlpha = amount * 0.85;
    ctx.fillStyle = this.colors.px.N;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

export function bossCanvas(root: Element, sprite: BossSprite): HTMLCanvasElement {
  return spriteCanvas(bossArt[sprite], readColors(root).px);
}
