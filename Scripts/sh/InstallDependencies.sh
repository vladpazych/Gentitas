#!/bin/sh
BASEDIR=$(dirname "$0")
cd "$BASEDIR"/../../.Generator
echo "Installing Gentitas Dependencies..."
echo "If you have a slow internet connection, this may take a while."
echo ""
npm install
echo ""
echo "Next steps:"
echo "1. Run StartGenerator"
echo ""

read -n 1 -p "Process completed" mainmenuinput