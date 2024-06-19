import http from 'node:http';
import { routes } from './routes.js';
import { extractReqBody } from './middlewares/extract-req-body.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await extractReqBody(req, res);

  const route = routes.find((route) => {
    return route.path.test(url) && route.method == method;
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  res.statusCode = 404;
  return res.setHeader('Content-type', 'text/plain').end('Route Not Found');
});

server.listen(3333);
