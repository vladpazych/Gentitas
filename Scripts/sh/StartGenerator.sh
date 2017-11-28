#!/bin/sh
BASEDIR=$(dirname "$0")
cd "$BASEDIR"/../../.Generator
echo "Starting Gentitas Generator..."
echo ""
npm start
echo ""

read  -n 1 -p "Process completed" mainmenuinput