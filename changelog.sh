#!/bin/bash

#echo git log $1...$2 --pretty=format:'<li> <a href="http://github.com/jerel/<project>/commit/%H">view commit &bull;</a> %s</li> ' --reverse | grep "#changelog"

firstTag=`git tag | tail -2 | head -1`
secondTag=`git tag | tail -1`


if [ $# -eq 2 ] 
then
  firstTag=$1
  secondTag=$2
else
  if [ $# -eq 1 ]
  then
    if [ "$1" == "HEAD" ]
    then
      secondTag="HEAD"
    else
      firstTag=$1
    fi
  fi
fi


echo "CHANGELOG from $firstTag to $secondTag"
echo

git log $firstTag...$secondTag --pretty=format:'- [%h](https://github.com/enyo/dropzone/commit/%H) %s ||||>>>> %b' --reverse | grep "#changelog" | sed 's/^\(.*\)||||>>>>.*$/\1/'

echo
echo

