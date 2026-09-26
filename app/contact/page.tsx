import { ContactForm } from '@/components/contact/ContactForm';
import { Faq } from '@/components/contact/Faq';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { siteConfig } from '@/data/site';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Join Us',
  description:
    'Join Apple Club or get in touch with the team at EPI Digital School (IMSET Sousse). Send us a message or find us on Instagram and Discord.',
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
            description="Want to become a member, pitch a project, or just say hello? Send us a message and the team will get back to you."
          />
        </Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal delay={100}>
              <Card>
                <h2 className="text-xl font-semibold tracking-tight">Find us online</h2>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Follow our news on Instagram and hang out with members on Discord.
                </p>
                <SocialLinks
                  showLabels
                  className="-ml-2 mt-5 flex-col items-start gap-1"
                  linkClassName="px-3 text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800"
                />
              </Card>
            </Reveal>

            <Reveal delay={200}>
              <Card>
                <h2 className="text-xl font-semibold tracking-tight">Where we meet</h2>
                <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {siteConfig.school}, {siteConfig.campus}. Workshops and meetups happen on campus, and everything
                  else happens on Discord.
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
