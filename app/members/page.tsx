import { AdvisorSpotlight } from '@/components/about/AdvisorSpotlight';
import { JoinCta } from '@/components/home/JoinCta';
import { MemberCard } from '@/components/members/MemberCard';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { groupMembersByTeam, members, teamDescriptions } from '@/data/members';
import { createMetadata } from '@/lib/metadata';
import { slugify } from '@/lib/utils';

export const metadata = createMetadata({
  title: 'Members',
  description:
    'Meet the board, developers, and designers behind Apple Club, the tech club of EPI Digital School (IMSET Sousse).',
  path: '/members',
});

export default function MembersPage() {
  const groups = groupMembersByTeam(members);

  return (
    <>
      <Section className="pb-8 sm:pb-12">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Members"
            title="The people behind the club."
            description="Builders, designers, and organizers who make Apple Club happen, one workshop and one project at a time."
          />
        </Reveal>

        {groups.length > 1 && (
          <Reveal delay={100}>
            <nav aria-label="Teams" className="mt-10 flex flex-wrap justify-center gap-2">
              {groups.map(({ team, members: teamMembers }) => (
                <a
                  key={team}
                  href={`#${slugify(team)}`}
                  className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                >
                  {team} <span className="text-neutral-400 dark:text-neutral-600">{teamMembers.length}</span>
                </a>
              ))}
            </nav>
          </Reveal>
        )}
      </Section>

      <Section className="pt-0 sm:pt-0">
        <AdvisorSpotlight />
      </Section>

      {groups.length === 0 ? (
        <Section className="pt-0 sm:pt-0">
          <p className="text-center text-neutral-500">Our team roster is coming soon.</p>
        </Section>
      ) : (
        groups.map(({ team, members: teamMembers }) => {
          const id = slugify(team);
          return (
            <Section key={team} id={id} className="scroll-mt-20 py-12 sm:py-16">
              <Reveal>
                <div className="flex flex-col gap-2 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-neutral-800">
                  <div>
                    <h2 id={`${id}-heading`} className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {team}
                    </h2>
                    {teamDescriptions[team] && (
                      <p className="mt-2 text-neutral-600 dark:text-neutral-400">{teamDescriptions[team]}</p>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </Reveal>

              <ul aria-labelledby={`${id}-heading`} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teamMembers.map((member, i) => (
                  <li key={member.id}>
                    <Reveal delay={Math.min(i, 6) * 80} className="h-full">
                      <MemberCard member={member} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })
      )}

      <div className="pt-12 sm:pt-16">
        <JoinCta />
      </div>
    </>
  );
}
