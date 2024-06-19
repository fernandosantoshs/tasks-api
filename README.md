# tasks-api

CRUD tasks API only with node's native libraries
Rotas:

- `POST - /tasks`
  Cria uma task, enviando os campos title e description por meio do body da requisição. Exemplo :
  {
  "title": "Cook Dinner",
  "description": "Grilled chicken breast, rice and salad"
  }
- `GET - /tasks`
  Lista todas as tasks. Também deve ser possível realizar uma busca, filtrando as tasks pelo title e description
  Envie o filtro "search" pelo query params. Exemplo: http://localhost:3333/tasks?search=cook

- `PUT - /tasks/:id`
  Atualiza uma task pelo `id`, title e/ou description

- `DELETE - /tasks/:id`
  Remove uma task pelo `id`.

- `PATCH - /tasks/:id/complete`
  Marca a task como completa ou não. Isso significa que se a task estiver concluída, volta ao seu estado “normal”.
