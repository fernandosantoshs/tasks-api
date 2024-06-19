import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    path: buildRoutePath('/tasks'),
    method: 'GET',
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search ? { title: search, description: search } : null
      );
      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    path: buildRoutePath('/tasks'),
    method: 'POST',
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    path: buildRoutePath('/tasks/:id'),
    method: 'PUT',
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end('Title or description is mandatory!');
      }

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end('Task not found');

      database.update('tasks', id, {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });

      return res.writeHead(200).end();
    },
  },
  {
    path: buildRoutePath('/tasks/:id'),
    method: 'DELETE',
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end('Task not found');

      database.delete('tasks', id);

      return res.writeHead(200).end();
    },
  },
  {
    path: buildRoutePath('/tasks/:id/complete'),
    method: 'PATCH',
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end('Task not found');

      const completed_at = task.completed_at ? null : new Date();

      database.update('tasks', id, {
        ...task,
        completed_at,
        updated_at: new Date(),
      });

      return res.writeHead(200).end();
    },
  },
];
