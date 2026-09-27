import { Features } from '@/components/home/Features';
import { Hero } from '@/components/home/Hero';
import { JoinCta } from '@/components/home/JoinCta';
import { Mission } from '@/components/home/Mission';
import { ShowcaseReveal } from '@/components/home/ShowcaseReveal';
import { Stats } from '@/components/home/Stats';
import { Ticker } from '@/components/ui/Ticker';
import { techStack } from '@/data/site';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker items={techStack} label="Technologies we work with" />
      <Features />
      <ShowcaseReveal />
      <Stats />
      <Mission />
      <JoinCta />
    </>
  );
}
