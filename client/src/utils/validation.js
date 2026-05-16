export function validateGoalSheet(goals) {
  const errors = [];
  if (!goals.length) errors.push('At least one goal is required');
  if (goals.length > 8) errors.push('Maximum number of goals per employee is 8');
  if (goals.some(goal => Number(goal.weightage) < 10)) errors.push('Each goal must have at least 10% weightage');
  const total = goals.reduce((sum, goal) => sum + Number(goal.weightage || 0), 0);
  if (total !== 100) errors.push('Total weightage must equal 100%');
  return { errors, total };
}

export function statusColor(status) {
  const map = {
    approved: 'badge-success',
    submitted: 'badge-warning',
    rejected: 'badge-error',
    draft: 'badge-neutral',
    Completed: 'badge-success',
    'On Track': 'badge-info',
    'Not Started': 'badge-ghost'
  };
  return map[status] || 'badge-ghost';
}
