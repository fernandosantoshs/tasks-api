import fs from 'node:fs';
import { parse } from 'csv-parse';

const filePath = new URL('./tasks.csv', import.meta.url);

const processCSV = async () => {
  const csv = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ delimiter: ',', from_line: 2, skip_empty_lines: true }));

  for await (const row of parser) {
    const [title, description] = row;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }

  return csv;
};

await processCSV();
