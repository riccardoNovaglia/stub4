#!/bin/bash

npm run build 

mkdir -p ./build/stub4 
cp -r ./build/static/ ./build/stub4/static

cp ./build/index.html ./build/404.html