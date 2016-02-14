#!/bin/bash

echo "This will copy all the files of the articles module and rename them with the right file names"
echo "--------------------------------------------------------"
echo "What do you want your module to be called (singular base name)?"

read tagName

cp -R articles $tagName's'

find articles -name '*articles*'