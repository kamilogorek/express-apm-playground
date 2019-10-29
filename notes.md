1. When failure happens use span.setFailure and finish transaction

2. Traceable:

- http module
- https module
- child processes
  - creation
  - awaiting response from the process
- middleware
- database queries (packages based) + breadcrumbs (task for later)
- templates (also packages based)
- manual spans

Sentry.init({
  integration: [Django()]
})

Read on NewRelic + Bugsnag Express integration

Investigate:
integration: [ expressIntegration({
  app,
  disableErrorHandler: true
}) ]
integration: [ tracingIntegration({ app }) ]

Patch internal middlewares queue to place our request/error handler first/last
