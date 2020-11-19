## next

- definition to JSON/JS to allow saving to file
- reset to files definitions (everything, especially for cruds)
- "try" functionality. Send requests, verify responses, from UI
- base response + default response for scenarios
- scenarios UI
- metadata for stubbings
  - app/system name
- modes - e.g. delay everything, make all stubs matching x return errors
  - situations: app x is down -> stubs for app name return failures
- interaction verification
- contains matcher
- better Crud UI

## someday

- Pact?
  - Make files destination configurable
  - How do we match each interactions to the correct provider? And created different providers when creating contracts? Does it need to be setup with each stub? Is this where I need the App/Downstream abstraction once to set this up?
  - Random port? Retry?
  - State/Upon receiving?
  - What do if the pact verification fails?
  - Use recorded interactions - replay against Pact provider to generate contract?
- openAPI wizard
- observe proxy request/response as they happen

## defects
