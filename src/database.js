import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((task) => {
        return Object.entries(search).some(([key, value]) => {
          return task[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
      this.#persist();
    } else {
      this.#database[table] = [data];
    }
  }

  update(table, id, data) {
    const taskIndex = this.#database[table].findIndex((task) => {
      return task.id == id;
    });

    if (taskIndex > -1) {
      this.#database[table][taskIndex] = { ...data };
      this.#persist();
    }
  }

  delete() {}
}
