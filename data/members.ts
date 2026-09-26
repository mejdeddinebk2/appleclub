import type { Member, MemberGroup } from '@/lib/types';
import data from './members.json';

/** Club members. Edit data/members.json to add, remove, or update people. */
export const members: Member[] = data;

/** Display order for teams. Teams not listed here appear afterwards, in the order they first occur in the JSON. */
export const teamOrder: string[] = ['Board', 'Dev Team', 'Design Team'];

/** Optional short blurb shown under each team heading. */
export const teamDescriptions: Record<string, string> = {
  Board: 'Steering the club, its partnerships, and its community.',
  'Dev Team': 'Running workshops and building the projects we ship.',
  'Design Team': 'Crafting the look, feel, and experience of everything we make.',
};

const DEFAULT_TEAM = 'Members';

/** Groups members by `team`, keeping the JSON order inside each group. */
export function groupMembersByTeam(list: Member[] = members): MemberGroup[] {
  const groups = new Map<string, Member[]>();

  for (const member of list) {
    const team = member.team?.trim() || DEFAULT_TEAM;
    const group = groups.get(team);
    if (group) group.push(member);
    else groups.set(team, [member]);
  }

  const rank = (team: string) => {
    const index = teamOrder.indexOf(team);
    return index === -1 ? teamOrder.length : index;
  };

  return Array.from(groups, ([team, teamMembers]) => ({ team, members: teamMembers })).sort(
    (a, b) => rank(a.team) - rank(b.team),
  );
}
