import { GalleryCover } from '@/components/gallery/GalleryCover';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { JoinCta } from '@/components/home/JoinCta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryImages } from '@/data/gallery';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Gallery',
  description:
    'Photos from Apple Club workshops, hackathons, and community events at EPI Digital School (IMSET Sousse).',
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Gallery"
            title="Moments we made."
            description="Snapshots from our workshops, hackathons, and meetups. Click any photo to see it larger."
          />
        </Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <GalleryCover />
        <GalleryGrid images={galleryImages} />
      </Section>

      <JoinCta />
    </>
  );
}
