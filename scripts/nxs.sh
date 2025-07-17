#!/bin/bash
set -e

# Extract the full command
full_command="$@"

# Match common dev/watch scenarios
if [[ "$full_command" == *"serve"* || "$full_command" == *"dev"* || "$full_command" == *"preview"* || "$full_command" == *"storybook"* || "$full_command" == *"--watch"* ]]; then
  echo "Running (interactive/dev mode): npx nx $full_command --output-style=dynamic"
  npx nx "$@" --output-style=dynamic 
else
  echo "Running (scripted mode): npx nx $full_command --output-style=stream --watch=false"
  npx nx "$@" --output-style=stream --watch=false
fi