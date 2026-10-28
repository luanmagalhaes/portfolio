import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { AppsSection } from "@/components/quick/AppsSection";
import { BossesSection } from "@/components/quick/BossesSection";
import { CareerSection } from "@/components/quick/CareerSection";
import { AiSection, EducationSection, PrivateSection, SkillsSection } from "@/components/quick/ExtrasSection";
import { QuickHeader } from "@/components/quick/QuickHeader";
import { Section } from "@/components/quick/Section";

export function QuickView({ portfolio, dictionary, locale }: { portfolio: Portfolio; dictionary: Dictionary; locale: Locale }) {
  return (
    <>
      <a href="#content" className="skip-link">
        {dictionary.skipToContent}
      </a>
      <QuickHeader portfolio={portfolio} dictionary={dictionary} locale={locale} />
      <main id="content">
        <Section id="about" title={dictionary.about}>
          <p className="max-w-3xl text-lg leading-relaxed text-cream/90">{portfolio.profile.summary}</p>
        </Section>
        <AppsSection portfolio={portfolio} dictionary={dictionary} />
        <BossesSection portfolio={portfolio} dictionary={dictionary} />
        <CareerSection portfolio={portfolio} dictionary={dictionary} />
        <AiSection portfolio={portfolio} dictionary={dictionary} />
        <PrivateSection portfolio={portfolio} dictionary={dictionary} />
        <SkillsSection portfolio={portfolio} dictionary={dictionary} />
        <EducationSection portfolio={portfolio} dictionary={dictionary} />
      </main>
      <footer className="border-t-4 border-ink bg-plum/60 px-5 py-8 text-center text-sm text-silver">{dictionary.footer}</footer>
    </>
  );
}
