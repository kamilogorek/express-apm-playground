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

