export function generateMissionTemplates(skill = {}) {
  const sourceId = skill.sourceId || skill.id || "unknown";
  const claimStatus = skill.claimStatus || "inferred";
  const permittedUse = skill.permittedUse || [];

  return [
    {
      title: `${skill.name} — Awareness Mission`,
      objective: "Review the source concept and identify one personal or organizational improvement area.",
      output: "One short reflection and one safe improvement action.",
      sourceId,
      claimStatus,
      permittedUse,
      durationMinutes: 15,
      difficulty: "beginner"
    },
    {
      title: `${skill.name} — Checklist Mission`,
      objective: "Convert the core steps into a checklist and complete the first item.",
      output: "Checklist draft with completion status.",
      sourceId,
      claimStatus,
      permittedUse,
      durationMinutes: 30,
      difficulty: "intermediate"
    },
    {
      title: `${skill.name} — Documentation Mission`,
      objective: "Record what was learned, what changed, and what needs follow-up.",
      output: "AAR note with next recommended action.",
      sourceId,
      claimStatus,
      permittedUse,
      durationMinutes: 20,
      difficulty: "beginner"
    }
  ];
}
