#!/bin/bash

rm -rf publish

mkdir -p publish/dist/stub4

cd ui && npm run build && cd ..
cp -r ui/build/ publish/dist/stub4

cd server && npm install --prod-only && cd ..
cp -r server/src/ publish/lib
rm -rf publish/lib/**/*.test.js

cp server/package.json publish/package.json
cp server/package-lock.json publish/package-lock.json

cp LICENSE publish/LICENSE
cp README.md publish/README.md

