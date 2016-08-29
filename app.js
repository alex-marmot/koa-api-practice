import Koa from 'koa'
import cors from 'koa-cors'
import json from 'koa-json'
import logger from 'koa-logger'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import onerror from 'koa-onerror';
import Router from 'koa-router';
import mongoose from 'mongoose';
import passport from 'koa-passport';

import auth from './routes/auth';
import dbConfig from './config/dbConfig';


const app = new Koa();
onerror(app);

mongoose.connect(dbConfig.database);
mongoose.Promise = require('bluebird');


// middlewares
app.use(convert(bodyParser()));
app.use(convert(cors()));
app.use(convert(json()));
app.use(convert(logger()));
app.use(passport.initialize())
app.use(passport.session())
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(auth.routes()).use(auth.allowedMethods());
// response

app.on('error', (err, ctx) => {
  console.log(err)
  log.error('server error', err, ctx);
});


export default app;
