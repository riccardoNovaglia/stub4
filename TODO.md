https://trello.com/b/BSfIfp9d/stub4

- Record interactions and allow verification

  - Allow verification via call in client

- ~~Proxyish~~

  - Websocket for observing in-route

- Pact?

  - Make files desination configurable
  - How do we match each interactions to the correct provider? And created different providers when creating contracts? Does it need to be setup with each stub? Is this where I need the App/Downstream abstraction once to set this up?
  - Random port? Retry?
  - State/Upon receiving?
  - What do if the pact verification fails?
  - Use recorded interactions - replay against Pact provider to generate contract?

- DB-like for app?

  - Defects. Editing doesn't quite refresh, maybe should enforce format? Later
  - Option to merge vs overwrite (maybe the default should be merge?)

- Help create definition/stub by pointing at openapi def

- Files for defaults/statics

  - Read all json files in a directory, set all up
  - Restart on changes to files
  - Reset button to go back to files data

- Named app abstraction?

- Better matching?

  - Starts with
  - Ends with
  - Contains?

- '\*' for method, catchall

- CI in GitHub actions maybe? For test + publish?

DEFECTS:

- Why can't the log level be set on its own via static config? Not spread properly?
