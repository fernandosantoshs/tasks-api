import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    path: buildRoutePath('/tasks'),
    method: 'GET',
    handler: (req, res) => {
      const tasks = database.select('tasks');

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
      console.log('Entrou no PUT handler!');
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end('Title or description is mandatory!');
      }

      const task = database.select('tasks', id);

      if (!task) return res.writeHead(404).end('Task not found');

      return res.writeHead(200).end();
    },
  },
  {
    path: buildRoutePath('/tasks/:id'),
    method: 'DELETE',
    handler: (req, res) => {
      console.log('Entrou no DELTE handler!');
      const { id } = req.params;

      const indexOfId = database.findIndex((task) => {
        return task.id == id;
      });
      console.log(indexOfId);

      if (indexOfId > -1) {
        database.splice(indexOfId, 1);
        console.log('DESTRUIDO!');
      }

      return res.writeHead(200).end();
    },
  },
];