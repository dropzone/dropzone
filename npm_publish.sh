#!/bin/bash

echo "Going to checkout master and publish to npm..." &&
read && 
git checkout master &&
echo "Publishing to npm..." &&
npm publish && 
echo "Checking out develop." &&
git checkout develop

