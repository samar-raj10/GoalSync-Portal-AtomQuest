function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateProgressScore({ scoreType, uom, target, actualAchievement }) {
  const type = scoreType || (uom === 'timeline' ? 'timeline' : uom === 'zero' ? 'zero' : 'min');
  if (type === 'zero') return asNumber(actualAchievement) === 0 ? 100 : 0;
  if (type === 'timeline') {
    const deadline = new Date(target);
    const actual = new Date(actualAchievement);
    if (Number.isNaN(deadline.getTime()) || Number.isNaN(actual.getTime())) return 0;
    return actual.getTime() <= deadline.getTime() ? 100 : 0;
  }
  const targetNumber = asNumber(target);
  const actualNumber = asNumber(actualAchievement);
  if (targetNumber <= 0 || actualNumber < 0) return 0;
  const ratio = type === 'max' ? targetNumber / Math.max(actualNumber, 1) : actualNumber / targetNumber;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

module.exports = { calculateProgressScore };
