import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
// import { Integrations } from "@sentry/apm";


Sentry.init({
    dsn: "https://9e9fd4523d784609a5fc0ebb1080592f@o19635.ingest.sentry.io/50622",
    tracesSampleRate: 1,
    debug: true,
    integrations: [
      new Integrations.BrowserTracing()
    //   new Integrations.Tracing()
    ],
    beforeSend(event) {
      console.log(event);
      return event;
    }
});


for (let i = 0; i < 5; i++) {
    fetch('/users')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => {
            throw new Error("frontend error with " + e.message);
        });
}