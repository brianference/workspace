#!/usr/bin/env node
/**
 * Kanban Task Updater - CLI tool for programmatic task updates
 * Usage: node update-task.js <taskId> <status> [title] [description]
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'kanban-data.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('Error: kanban-data.json not found');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function updateTask(taskId, status, title, description) {
  const data = loadData();
  const task = data.tasks.find(t => t.id === taskId);
  
  if (!task) {
    console.error(`Error: Task ${taskId} not found`);
    process.exit(1);
  }
  
  task.status = status;
  task.updatedAt = new Date().toISOString();
  
  if (title) task.title = title;
  if (description) task.description = description;
  
  saveData(data);
  console.log(`✅ Updated ${taskId}: status=${status}`);
}

function createTask(title, description, priority, tags, status) {
  const data = loadData();
  const newId = `task-${String(data.tasks.length + 1).padStart(3, '0')}`;
  
  const task = {
    id: newId,
    title,
    description: description || '',
    priority: priority || 'medium',
    tags: tags ? tags.split(',') : [],
    status: status || 'backlog',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.tasks.push(task);
  saveData(data);
  console.log(`✅ Created ${newId}: ${title}`);
  return newId;
}

function listTasks(status) {
  const data = loadData();
  const filtered = status 
    ? data.tasks.filter(t => t.status === status)
    : data.tasks;
  
  console.log(`\n📋 Tasks (${filtered.length}):\n`);
  filtered.forEach(t => {
    const priority = t.priority === 'critical' ? '🔴' : 
                     t.priority === 'high' ? '🟠' : 
                     t.priority === 'medium' ? '🟡' : '🟢';
    console.log(`${priority} ${t.id} [${t.status}] ${t.title}`);
    if (t.description) console.log(`   ${t.description}`);
  });
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'update' && args.length >= 3) {
  updateTask(args[1], args[2], args[3], args[4]);
} else if (command === 'create' && args.length >= 2) {
  createTask(args[1], args[2], args[3], args[4], args[5]);
} else if (command === 'list') {
  listTasks(args[1]);
} else {
  console.log(`
Kanban CLI - Task Management

Usage:
  node update-task.js list [status]               List all tasks (or by status)
  node update-task.js update <id> <status>        Update task status
  node update-task.js create <title> [desc] [pri] [tags] [status]

Examples:
  node update-task.js list active
  node update-task.js update task-001 done
  node update-task.js create "New Feature" "Build X" high coding,infra active
`);
}
