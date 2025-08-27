import { CommunityMember } from './types';

export async function fetchCommunityMembers(): Promise<{
  members: CommunityMember[];
  categories: string[];
}> {
  try {
   const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
   const dataUrl = `${base}/output_kg.jsonl`;

    console.log('Fetching data from:', dataUrl);

    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${dataUrl}, status: ${response.status}`);
    }

    const text = await response.text();

    // Parse JSON or JSONL
    const kgData = text.trim().startsWith('[')
      ? JSON.parse(text)
      : text
          .trim()
          .split('\n')
          .map((line, i) => {
            try {
              return JSON.parse(line);
            } catch (err) {
              console.error(`Error parsing line ${i}:`, line, err);
              throw err;
            }
          });

    const members: CommunityMember[] = [];
    const allCategories = new Set<string>();

    kgData.forEach((entry: any, index: number) => {
      if (!entry.fields?.Name) return;

      const expertise = entry.fields.Expertise || '';
      const interest = entry.fields.Interest || '';
      const role = entry.fields.Role || '';
      const note = entry.fields.Note || '';

      const keywords = [
        ...(entry.mappings.Expertise?.map((m: any) => m.concept_label) || []),
        ...(entry.mappings.Interest?.map((m: any) => m.concept_label) || []),
        ...(entry.mappings.Role?.map((m: any) => m.concept_label) || []),
      ].filter(Boolean);

      keywords.forEach((k) => allCategories.add(k));

      let type = 'Community Member';
      if (role.toLowerCase().includes('student')) type = 'Student';
      else if (role.toLowerCase().includes('research')) type = 'Researcher';
      else if (role.toLowerCase().includes('professor') || role.toLowerCase().includes('faculty')) type = 'Faculty';
      else if (role.toLowerCase().includes('developer') || role.toLowerCase().includes('engineer')) type = 'Developer';

      let programmingLanguage = '';
      if (expertise.toLowerCase().includes('python') || interest.toLowerCase().includes('python')) programmingLanguage = 'Python';
      else if (expertise.toLowerCase().includes('r') || interest.toLowerCase().includes('r')) programmingLanguage = 'R';
      else if (expertise.toLowerCase().includes('matlab') || interest.toLowerCase().includes('matlab')) programmingLanguage = 'MATLAB';
      else if (expertise.toLowerCase().includes('git') || interest.toLowerCase().includes('git')) programmingLanguage = 'Git';

      let platform = 'NA';
      if (expertise.toLowerCase().includes('jupyter') || interest.toLowerCase().includes('jupyter')) platform = 'Jupyter';
      else if (expertise.toLowerCase().includes('rstudio') || interest.toLowerCase().includes('rstudio')) platform = 'RStudio';
      else if (expertise.toLowerCase().includes('matlab') || interest.toLowerCase().includes('matlab')) platform = 'MATLAB';

      const description =
        note ||
        `${role ? `Role: ${role}. ` : ''}${expertise ? `Expertise: ${expertise}. ` : ''}${interest ? `Interests: ${interest}` : ''}`.trim();

      members.push({
        id: `member-${index}`,
        title: entry.fields.Name,
        description,
        type,
        keywords: Array.from(new Set(keywords)) as string[],
        programmingLanguage,
        platform,
        originalData: entry,
      });
    });

    return { members, categories: Array.from(allCategories).sort() };
  } catch (error) {
    console.error('Error fetching community members:', error);
    return { members: [], categories: [] };
  }
}
