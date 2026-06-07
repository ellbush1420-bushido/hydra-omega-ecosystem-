export function calculateScore(values = []) {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getRating(score) {
  if (score >= 90) return 'Crown Ready';
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Developing';
  if (score >= 40) return 'Needs Review';
  return 'Reset Required';
}

export function getNextAction(score) {
  return score >= 75
    ? 'Advance trainee to the next reflection gate.'
    : 'Repeat the scenario with a written reflection note.';
}
