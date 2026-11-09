import type { Portfolio } from "@/domain/view";
import type { JourneyCopy } from "@/components/journey/copy";
import { uiIconPath } from "@/components/journey/model/assets";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function ContactLinks({ profile, copy }: { profile: Portfolio["profile"]; copy: JourneyCopy }) {
  const [mailbox, domain] = profile.email.split("@");

  return (
    <ul className="jr-goal-links">
      <li>
        <a className="jr-btn jr-btn-primary" href={profile.resume} download>
          <Sprite className="jr-ico" src={uiIconPath("scroll")} width={16} height={16} />
          {copy.resume}
        </a>
      </li>
      <li>
        <a className="jr-btn jr-btn-text" href={`mailto:${profile.email}`} aria-label={`${copy.email}: ${profile.email}`}>
          <Sprite className="jr-ico" src={uiIconPath("mail")} width={16} height={16} />
          <span>
            {mailbox}
            <wbr />@{domain}
          </span>
        </a>
      </li>
      <li>
        <a className="jr-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
          <Sprite className="jr-ico" src={uiIconPath("link")} width={16} height={16} />
          LinkedIn
        </a>
      </li>
      <li>
        <a className="jr-btn" href={profile.github} target="_blank" rel="noreferrer">
          <Sprite className="jr-ico" src={uiIconPath("octo")} width={16} height={16} />
          GitHub
        </a>
      </li>
    </ul>
  );
}
