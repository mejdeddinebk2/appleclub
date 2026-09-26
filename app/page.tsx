import { Features } from '@/components/home/Features';
import { Hero } from '@/components/home/Hero';
import { JoinCta } from '@/components/home/JoinCta';
import { Mission } from '@/components/home/Mission';
import { Stats } from '@/components/home/Stats';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Mission />
      <JoinCta />
    </>
  );
}
