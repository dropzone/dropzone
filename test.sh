#!/bin/bash

if [ $# -gt 0 ]
  then
    if [ $1 != "compiled" ]
      then
         echo
         echo "Invalid argument passed. Call './test.sh compiled' if don't want to compile the source before."
         echo
         exit 1
    fi
else
  grunt
fi
./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test.html
