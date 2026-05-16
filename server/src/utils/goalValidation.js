function validateGoalSheet(goals) {
  const errors = [];
  if (!Array.isArray(goals) || goals.length === 0) errors.push('At least one goal is required');
  if (goals.length > 8) errors.push('Maximum number of goals per employee is 8');
  if (goals.some(goal => Number(goal.weightage) < 10)) errors.push('Each goal must have at least 10% weightage');
  const total = goals.reduce((sum, goal) => sum + Number(goal.weightage || 0), 0);
  if (total !== 100) errors.push('Total weightage must equal 100%');
  return errors;
}

module.exports = { validateGoalSheet };
