const Sentry = require("@sentry/node");
const { Express: ExpressIntegration } = require("@sentry/integrations");
const express = require("express");
const http = require("http");
const https = require("https");

var app = express();

const banner = msg =>
  console.log(
    `${"-".repeat(msg.length + 4)}\n| ${msg} |\n${"-".repeat(msg.length + 4)}`
  );

Sentry.init({
  dsn: "http://dc04f196cc294d32978cfd2c0e51564b@localhost:8000/1",
  tracesSampleRate: 1,
  integrations: [
    new Sentry.Integrations.Http({
      tracing: true
    }),
    new ExpressIntegration({ app })
  ],
  beforeSend(event) {
    if (event.spans) {
      banner("TRACING EVENT");
      banner("SPANS");
      console.log(event.spans.map(x => `${x.op} ${x.description}`));
    } else {
      banner("EXCEPTION EVENT");
      console.log(
        `${event.exception.values[0].type}: ${event.exception.values[0].value}`
      );
    }
    banner("BREADCRUMBS");
    console.log(event.breadcrumbs.map(x => x.category));
    return null;
  }
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(function assignId(req, res, next) {
  req.id = "someid";
  setTimeout(function() {
    next();
  }, 37);
});

app.use(function getDataForUser(_, _, next) {
  setTimeout(() => {
    http
      .request(
        {
          protocol: "http:",
          hostname: "example.com",
          path: "/user",
          method: "POST"
        },
        res => {
          res.on("data", () => {});
          res.on("end", () => {
            http.get("http://example.com/details", res => {
              res.on("data", () => {});
              res.on("end", () => next());
            });
          });
        }
      )
      .end();
  }, 1);
});

app.use(function parseUserData(_, _, next) {
  setTimeout(() => {
    let span = Sentry.startSpan({
      op: "encode",
      description: "parseAvatarImages"
    });
    setTimeout(() => {
      span.finish();
      span = Sentry.startSpan({
        op: "image",
        description: "generateAllPossibleFormats"
      });
      setTimeout(() => {
        span.finish();
        next();
      }, 54);
    }, 75);
  }, 2);
});

app.use(function updateComments(_, _, next) {
  setTimeout(() => {
    https
      .request(
        {
          protocol: "https:",
          hostname: "example.com",
          path: "/comments",
          method: "POST"
        },
        res => {
          res.on("data", () => {});
          res.on("end", () => {
            https.get("https://example.com/summary", res => {
              res.on("data", () => {});
              res.on("end", () => next());
            });
          });
        }
      )
      .end();
  }, 1);
});

app.get("/success", function successHandler(req, res) {
  banner("SUCCESS HANDLER");
  res.status(200).end();
});

app.get("/failed", function failedHandler(req, res) {
  banner("FAILED HANDLER");
  throw new Error("Uh-oh Test" + Date.now());
});

app.use(Sentry.Handlers.errorHandler());

app.listen(3000, () => {
  setTimeout(() => http.get("http://localhost:3000/success"), 100);
  setTimeout(() => http.get("http://localhost:3000/failed"), 200);
});
