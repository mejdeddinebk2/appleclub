import { Bento } from '@/components/home/Bento';
import { CodeShowcase } from '@/components/home/CodeShowcase';
import { CrewMarquee } from '@/components/home/CrewMarquee';
import { Features } from '@/components/home/Features';
import { Hero } from '@/components/home/Hero';
import { JoinCta } from '@/components/home/JoinCta';
import { Mission } from '@/components/home/Mission';
import { PhoneStory } from '@/components/home/PhoneStory';
import { ShowcaseReveal } from '@/components/home/ShowcaseReveal';
import { Ticker } from '@/components/ui/Ticker';
import { techStack } from '@/data/site';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker items={techStack} label="Technologies we work with" />
      <Features />
      <PhoneStory />
      <CodeShowcase />
      <ShowcaseReveal />
      <Bento />
      <CrewMarquee />
      <Mission />
      <JoinCta />
    </>
  );
}
