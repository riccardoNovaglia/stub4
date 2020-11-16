# STUB4

A stub HTTP server for the whole team.

## Installing

Using npm:

`$ npm install @stub4/stub4`

## Getting started

There's a couple of ways to setup Stub4: programmatically via javascript, and using json configuration files.

In both cases, you can define its ports, log level, and more. If not otherwise configured, Stub4 will pick available ports and log them as it starts. You can add stubbings as you start it, or you can always add more later via its API or web interface.

Once you start its web interface, you'll find in it the documentation for the version you downloaded.  
The latest documentation can be found [at the repo's github page](https://riccardonovaglia.github.io/stub4).

### Starting Stub4 with javascript

Create a javascript file in your project, import Stub4, and assign it to some value.  
With it, you can now add stubs and more, start its server and its UI.

```
const stub4 = require('@stub4/stub4');

stub4.addItems([
  { requestMatcher: { url: '/something' }, response: { body: 'ok' } }
]);

stub4.startup({ logLevel: 'info' });
stub4.startUi({ port: 8081 });
```

Once started, you should see output similar to this:

```
info  [stubs]: Created new stub '* /something *'
info  [stub4]: Stub4 started on port 49678
info  [stub4]: UI started on 8081 - http://localhost:8081
```

### Starting Stub4 and configuring it with JSON

You also can setup Stub4 using JSON files. Add a script to your package.json to start Stub4, and pass as its first parameter the path to your configuration file. In it you can configure its ports, and logging, and point to at files tha contain your stubbings. These will be pickedup up as Stub4 starts. You can always add more later via its API and UI.

```
In your package.json
"scripts: {
  "stub4": "stub4 config.json"
}
...
$ npm run stub4
```

You can use the JSON file to specify its ports, logging level, and further json files used to setup its initial stubbings

```
config.json
{
  "uiPort": 9091,
  "defaultsFiles": ["stubbings.json"]
}

stubbings.json
{
  "stubs": [
      {
        "requestMatcher": { "url": "/some-url", "method": "GET" },
        "response": { "body": "hello there", "type": "text" }
      }
  ]
}
```

## What next

Once you have Stub4 running, check out its web interface. It conveniently comes with built-in documentation where you can find more details about its various features. Remember to either set its UI port when starting it, or look out for its auto-selected port when it starts.
