#!/bin/bash

rm -rf docs

mkdir docs

pushd ui
npm run setupDocs
npm run deploy
npm run restoreApp
popd
