import React from 'react';

function Team({ tasks }) {
  const assignees = {};

  tasks.forEach((task) => {
    const name = task.assignee || 'Unassigned';
    if (!assignees[name]) {
      assignees[name] = { total: 0, completed: 0, pending: 0, tasks: [] };
    }
    assignees[name].total++;
    if (task.completed) assignees[name].completed++;
    else assignees[name].pending++;
    assignees[name].tasks.push(task);
  });

  const teamMembers = Object.entries(assignees).sort((a, b) => b[1].total - a[1].total);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getColor = (name) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{teamMembers.length}</div>
          <div className="stat-label">Team Members</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{tasks.filter(t => !t.completed).length}</div>
          <div className="stat-label">Total Pending</div>
        </div>
        <div className="stat-card stat-done">
          <div className="stat-number">{tasks.filter(t => t.completed).length}</div>
          <div className="stat-label">Total Completed</div>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map(([name, data]) => (
          <div key={name} className="team-card">
            <div className="team-card-header">
              <div className="avatar" style={{ background: getColor(name) }}>
                {getInitials(name)}
              </div>
              <div>
                <div className="member-name">{name}</div>
                <div className="member-role">{data.total} tasks assigned</div>
              </div>
            </div>

            <div className="member-stats">
              <div className="member-stat">
                <span className="member-stat-num pending-text">{data.pending}</span>
                <span>Pending</span>
              </div>
              <div className="member-stat">
                <span className="member-stat-num done-text">{data.completed}</span>
                <span>Done</span>
              </div>
              <div className="member-stat">
                <span className="member-stat-num">{data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%</span>
                <span>Progress</span>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}></div>
            </div>

            <div className="member-tasks">
              {data.tasks.slice(0, 3).map((task) => (
                <div key={task._id} className={`mini-task ${task.completed ? 'mini-done' : ''}`}>
                  <span className={`mini-dot ${task.completed ? 'done-dot' : 'pending-dot'}`}></span>
                  {task.title}
                </div>
              ))}
              {data.tasks.length > 3 && (
                <div className="more-tasks">+{data.tasks.length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <p className="empty-msg">No team members yet. Create tasks and assign them!</p>
      )}
    </>
  );
}

export default Team;