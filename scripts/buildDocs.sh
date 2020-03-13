#!/bin/bash

rm -rf docs

mkdir docs

pushd ui
npm run setupDocs
popd

cp -r ui/build/ docs

pushd ui
npm run restoreApp
popd