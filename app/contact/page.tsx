import { Faq } from '@/components/contact/Faq';
import { GoogleFormEmbed } from '@/components/contact/GoogleFormEmbed';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { siteConfig } from '@/data/site';
import { createMetadata } from '@/lib/metadata';
import { asset } from '@/lib/utils';
import Image from 'next/image';

export const metadata = createMetadata({
  title: 'Join Us',
  description:
    'Join Apple Club EPI or get in touch with the team at EPI Sup (Sousse, Tunisia). Fill in the form or find us on Instagram and Facebook.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Join the club."
            description="Want to become a member, pitch a project, or just say hello? Fill in the form and the team will get back to you."
          />
        </Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <GoogleFormEmbed src={siteConfig.joinFormUrl} />
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Le formulaire ne s&apos;affiche pas ?{' '}
              <a
                href={siteConfig.joinFormUrlDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Ouvre-le dans un nouvel onglet
              </a>
              .
            </p>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal delay={100}>
              <Card>
                <h2 className="text-xl font-semibold tracking-tight">Find us online</h2>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Follow our news on Instagram and Facebook.
                </p>
                <SocialLinks
                  showLabels
                  className="-ml-2 mt-5 flex-col items-start gap-1"
                  linkClassName="px-3 text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800"
                />
              </Card>
            </Reveal>

            <Reveal delay={150}>
              <Card className="flex flex-col items-center text-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white shadow-md dark:ring-neutral-900">
                  <Image
                    src={asset('/images/advisor/nahla-baccar.jpg')}
                    alt={siteConfig.teacherAdvisor.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">Encadrement</h2>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {siteConfig.teacherAdvisor.name} — {siteConfig.teacherAdvisor.role}
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{siteConfig.contactEmail}</p>
              </Card>
            </Reveal>

            <Reveal delay={200}>
              <Card>
                <h2 className="text-xl font-semibold tracking-tight">Where we meet</h2>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {siteConfig.school}, {siteConfig.campus}. Workshops and meetups happen on campus. Follow us on
                  Instagram and Facebook for updates.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>

      <Faq />
    </>
  );
}
