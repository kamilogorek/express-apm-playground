const Sentry = require("@sentry/node");
const { Express: ExpressIntegration } = require("@sentry/integrations");
const express = require("express");
const http = require("http");

var app = express();

Sentry.init({
  dsn: "http://dc04f196cc294d32978cfd2c0e51564b@localhost:8000/1",
  tracesSampleRate: 1,
  integrations: [
    // Instrument HTTP/s calls to emit spans
    new Sentry.Integrations.Http({
      tracing: true
    }),
    // Instrument express middlewares to emit spans
    new ExpressIntegration({ app })
  ],
  beforeSend(event) {
    if (event.contexts) {
      console.log(event.contexts.trace);
    }
    if (event.spans) {
      console.log(event.spans);
    }
    return null;
  }
});

// This handler still has to be the first one, as it creates a context separated domain
app.use(Sentry.Handlers.requestHandler());
// Create transactions out of incoming requests by naming them `${method}|${path}`
app.use(Sentry.Handlers.tracingHandler());

app.use(function randomNoopMiddleware(req, res, next) {
  next();
});

app.get("/users", function usersHandler(req, res) {
  http.get("http://example.com/users", response => {
    response.on("data", () => {});
    response.on("end", () => res.status(200).end());
  });
});
app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => {
  http.get("http://localhost:3000/users");
});
