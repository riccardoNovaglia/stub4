# STUB4

Prototype, test, explore

## Installing

Using npm:

`$ npm install @stub4/stub4`

## Getting started

There's a few of ways you can setup Stub4:

- set it up programmatically in javascript
- configure it with json configuration files

In the first two cases, you can define its ports, log level, and more. If not defined, Stub4 will pick available ports and log them as it starts. You can add stubbings as you start it, or you can always add more later via its API or web interface.

### Starting Stub4 with javascript

Simply create a javascript file wherever convenient, import Stub4, and assign it to some value.  
With it, you can now add stubs and more, start its server and its interface.

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

You can setup Stub4 using simply JSON files. After installation, you can add a script to your package.json to start Stub4. Starting it accepts a single argument which is its JSON configuration. (You can also not pass anything to it, and it will pick up some sensible defaults)

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
