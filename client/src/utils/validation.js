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
  const map = { approved: 'bg-green-100 text-green-800', submitted: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800', draft: 'bg-gray-100 text-gray-800', Completed: 'bg-green-100 text-green-800', 'On Track': 'bg-blue-100 text-blue-800', 'Not Started': 'bg-gray-100 text-gray-800' };
  return map[status] || 'bg-gray-100 text-gray-800';
}
