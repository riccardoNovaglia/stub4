#!/bin/bash

rm -rf publish

mkdir publish

cd client && npm run build && cd ..
cp -r client/build/ publish/dist

cp -r server/src/ publish/lib
rm -rf publish/lib/**/*.test.js

cp server/package.json publish/package.json
cp server/package-lock.json publish/package-lock.json

cp LICENSE publish/LICENSE
cp README.md publish/README.md
