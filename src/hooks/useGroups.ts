import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroupsApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';
import type StudentInterface from '@/types/StudentInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
}

// Deduplicate items that might arrive twice from the API (for example when dev
// tooling replays requests or the DB contains accidental duplicates).
const uniqById = <T extends { id: number }>(items: T[] = []): T[] => {
  const seen = new Set<number>();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const useGroups = (): GroupsHookInterface => {
  const { data } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
    enabled: true,
  });

  const groups = useMemo(() => {
    if (!data) return [];

    return uniqById(
      data.map(group => ({
        ...group,
        // Also dedupe students inside each group to keep UI stable
        students: uniqById<StudentInterface>(group.students),
      }))
    );
  }, [data]);

  return { groups };
};

export default useGroups;