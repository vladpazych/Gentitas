#!/bin/bash

function node_is_installed {
  # set to 1 initially
  local return_=1
  # set to 0 if not found
  type node >/dev/null 2>&1 || { local return_=0; }
  # return value
  echo "$return_"
}

function echo_fail {
  echo "Node.js is not installed or not in the PATH."
  echo ""
  echo "Next steps:"
  echo "1. Install Node.js - https://nodejs.org/"
  echo "2. Run InstallDependencies"
  echo "3. Run StartGenerator"
}

function echo_pass {
  echo "Node.js is installed. Congratulations!"
  echo ""
  echo "Next steps:"
  echo "1. Run InstallDependencies"
  echo "2. Run Generate"
}

function echo_if {
  if [ $1 == 1 ]; then
    echo_pass $2
  else
    echo_fail $2
  fi
}

# command line programs
echo "$(echo_if $(node_is_installed))"
echo ""

read  -n 1 -p "Process completed" mainmenuinput