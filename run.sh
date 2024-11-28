#! /bin/bash

pnpm build
node dist/index.js "$@" >> run.log 2>&1
