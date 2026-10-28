import { memo, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import type { JourneyCopy } from "@/components/journey/copy";
import { doorColorFor, emblemPath, skyGradient, themeLayerPath } from "@/components/journey/model/assets";
import type { Placed } from "@/components/journey/model/geometry";
import { worlds, type LevelNode, type WorldSpec } from "@/components/journey/model/level";
import { BonusDoor } from "@/components/journey/nodes/BonusDoor";
import { BossArena } from "@/components/journey/nodes/BossArena";
import { CheckpointNode, checkpointSign } from "@/components/journey/nodes/CheckpointNode";
import { GateBanner } from "@/components/journey/nodes/GateBanner";
import { GemRow } from "@/components/journey/nodes/GemRow";
import { GoalCard } from "@/components/journey/nodes/GoalCard";
import { LootNode } from "@/components/journey/nodes/LootNode";
import { RushSign } from "@/components/journey/nodes/RushSign";
import { SecretRoom } from "@/components/journey/nodes/SecretRoom";
import { TitleCard } from "@/components/journey/nodes/TitleCard";

interface TrackProps {
  nodes: LevelNode[];
  placed: Placed[];
  portfolio: Portfolio;
  copy: JourneyCopy;
  locale: Locale;
  onOpenApp: (appId: string) => void;
  onOpenBoss: (caseId: string) => void;
  onMap: () => void;
  onStart: () => void;
  onRestart: () => void;
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;

function worldStyle(world: WorldSpec): CSSProperties {
  return vars({ "--wsky": skyGradient(world.theme), "--wfar": `url(${themeLayerPath(world.theme, "far")})`, "--wmid": `url(${themeLayerPath(world.theme, "mid")})` });
}

function NodeView({ node, index, spot, props }: { node: LevelNode; index: number; spot: Placed; props: TrackProps }): ReactNode {
  const { portfolio, copy, locale } = props;
  const world = worlds.find((item) => item.id === node.world) ?? worlds[0];

  switch (node.kind) {
    case "intro":
      return <TitleCard index={index} portfolio={portfolio} copy={copy} locale={locale} onStart={props.onStart} onMap={props.onMap} />;
    case "gate":
      return <GateBanner index={index} worldId={node.world} number={worlds.indexOf(world) + 1} copy={copy} />;
    case "checkpoint": {
      const sign = checkpointSign(portfolio, copy, node.source, node.id);
      return sign ? <CheckpointNode index={index} sign={sign} flagColor={world.flag} /> : null;
    }
    case "loot": {
      const job = portfolio.jobs.find((item) => item.id === node.jobId);
      return job ? <LootNode index={index} kicker={`${copy.loot} · ${job.company}`} text={job.highlights[node.index]} emblem={emblemPath(job.emblem)} /> : null;
    }
    case "gems":
      return <GemRow index={index} gems={node.gems} width={spot.w} label={copy.skills} />;
    case "door": {
      const appIndex = portfolio.apps.findIndex((item) => item.id === node.appId);
      const app = portfolio.apps[appIndex];
      return app ? <BonusDoor index={index} app={app} color={doorColorFor(app.id, appIndex)} copy={copy} onOpen={props.onOpenApp} /> : null;
    }
    case "rush":
      return <RushSign index={index} title={copy.bossRushTitle} lead={copy.bossRushLead} />;
    case "boss": {
      const item = portfolio.cases.find((entry) => entry.id === node.caseId);
      return item ? <BossArena index={index} item={item} order={node.order} total={node.total} width={spot.w} copy={copy} onOpen={props.onOpenBoss} /> : null;
    }
    case "secret":
      return <SecretRoom index={index} privateApps={portfolio.privateApps} copy={copy} />;
    case "goal":
      return <GoalCard index={index} profile={portfolio.profile} copy={copy} locale={locale} onMap={props.onMap} onRestart={props.onRestart} />;
  }
}

function TrackView(props: TrackProps) {
  const { nodes, placed } = props;

  return (
    <div className="jr-track">
      <div className="jr-grounds" aria-hidden="true">
        {nodes.map((node, index) => (
          <span
            key={node.key}
            className="jr-ground"
            style={vars({ "--x": placed[index].x, "--w": placed[index].w, "--lvl": node.level, "--g-top": `url(${themeLayerPath(node.theme, "top")})`, "--g-body": `url(${themeLayerPath(node.theme, "body")})` })}
          />
        ))}
      </div>
      {worlds.map((world) => (
        <section key={world.id} className="jr-world" aria-labelledby={`jr-world-${world.id}`} style={worldStyle(world)}>
          {nodes.map((node, index) =>
            node.world === world.id ? (
              <div key={node.key} className="jr-slot" style={vars({ "--x": placed[index].x, "--lvl": node.level })}>
                <NodeView node={node} index={index} spot={placed[index]} props={props} />
              </div>
            ) : null,
          )}
        </section>
      ))}
    </div>
  );
}

export const Track = memo(TrackView);
