const Sentry = require("@sentry/node");
// const { Integrations } = require("@sentry/tracing");
const { Integrations } = require("@sentry/apm");
const express = require("express");
const http = require("http");

var app = express();

Sentry.init({
  dsn: "https://9e9fd4523d784609a5fc0ebb1080592f@o19635.ingest.sentry.io/50622",
  // dsn: "http://2ac609ee6fa449f5bc295ea0fa258711@localhost:8000/2",
  tracesSampleRate: 1,
  debug: true,
  integrations: [
    // Instrument HTTP/s calls to emit spans
    new Sentry.Integrations.Http({
      tracing: true
    }),
    // Instrument express middlewares to emit spans
    new Integrations.Express({ app })
  ],
  beforeSend(event) {
    console.log(event);
    return event;
  }
});

Sentry.addGlobalEventProcessor(function(event) {
//   if (event.contexts) {
//     console.log(event.contexts.trace);
//   }
//   if (event.spans) {
//     console.log(event.spans);
//   }
  return event;
});

app.use(express.static('dist'));
// This handler still has to be the first one, as it creates a context separated domain
app.use(Sentry.Handlers.requestHandler());
// Create transactions out of incoming requests by naming them `${method}|${path}`
app.use(Sentry.Handlers.tracingHandler());

app.use(function randomNoopMiddleware(req, res, next) {
  next();
});

app.get("/users", function usersHandler(req, res) {
    setTimeout(() => {
        if (Math.random() > 0.5) {
            res.status(200).end(JSON.stringify({'a': Math.random()}));
        } else {
            throw new Error('Backend Error');
        }
    }, Math.random() * 500 + 100);
});

app.use(Sentry.Handlers.errorHandler());

app.listen(3123, () => {
//   http.get("http://localhost:3123/users");
});
