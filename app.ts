import Koa = require('koa');
const app = new Koa();
const onerror = require('koa-onerror');
import baseMiddleware from './middleware/base';
import routerMiddleware from './middleware/router';
import restMiddleware from './middleware/rest';
import { authManager } from './middleware/authority';

// error handler
onerror(app);

// middleware
baseMiddleware(app);
authManager(app);
restMiddleware(app);
routerMiddleware(app);


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

export default app
