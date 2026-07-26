const BLOCKED_PATTERNS = [
  [/(offensive|attack|exploit|malware|ransomware|spyware)\s+(cyber|hack|intrusion)/i, "offensive_cyber"],
  [/(construct|build|make|create|assemble).{0,40}(weapon|bomb|device|explosive)/i, "weapon_construction"],
  [/(evad|bypass|circumvent).{0,30}(security|detection|law enforcement)/i, "evasion_guidance"],
  [/(target|attack|injure|harm|kill).{0,30}(person|individual|group|officer)/i, "force_escalation"],
  [/(medical diagnosis|prescribe|treat|cure).{0,30}(condition|disease|illness|patient)/i, "medical_claim"],
  [/(government|TCOLE|TEEX|military).{0,30}(endors|certif|approv).{0,30}(Hydra|proprietary)/i, "credential_misrepresentation"],
  [/(unauthorized access|hack into|break into).{0,30}(system|network|account|server)/i, "unauthorized_access"]
];

const REVIEW_PATTERNS = [
  [/(emergency response|first aid|CPR|AED|triage)/i, "medical_adjacent"],
  [/(firearm|weapon|force|shoot|lethal)/i, "force_adjacent"],
  [/(classified|secret|restricted).{0,20}(document|information|data)/i, "sensitive_data_reference"],
  [/(TCOLE|TEEX|government|federal|certified instructor)/i, "credential_reference"]
];

export function classifySafety(normalizedSource = {}, framework = {}) {
  const text = [
    normalizedSource.text || "",
    normalizedSource.description || "",
    ...(framework.coreSteps || []).map((s) => s.action || "")
  ].join(" ");

  const flags = [];
  const blockedReasons = [];

  for (const [pattern, label] of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      blockedReasons.push(label);
      flags.push(label);
    }
  }

  for (const [pattern, label] of REVIEW_PATTERNS) {
    if (pattern.test(text) && !flags.includes(label)) {
      flags.push(label);
    }
  }

  const blocked = blockedReasons.length > 0;
  const requiresReview = !blocked && flags.some((f) =>
    ["medical_adjacent", "force_adjacent", "sensitive_data_reference", "credential_reference"].includes(f)
  );

  let approvalStatus = "approved";
  if (blocked) approvalStatus = "blocked";
  else if (requiresReview) approvalStatus = "pending_review";

  const claimStatus = normalizedSource.claimStatus || "inferred";
  const disclaimer = blocked
    ? "This source has been blocked due to safety policy violations."
    : (normalizedSource.disclaimer || "Educational use only. Not professional, medical, or legal advice.");

  return {
    sourceId: normalizedSource.sourceId,
    passed: !blocked,
    claimStatus,
    flags,
    blockedReasons,
    permittedUse: normalizedSource.permittedUse || [],
    requiredDisclaimer: disclaimer,
    reviewedAt: new Date().toISOString(),
    approvalStatus
  };
}
