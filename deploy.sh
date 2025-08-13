#!/bin/bash

# Exit on error
set -e

# === CONFIG ===
SSH_KEY_PATH="$(pwd)/Prushal_django.pem"
SERVER_USER="ubuntu"
SERVER_HOST="ec2-65-0-90-250.ap-south-1.compute.amazonaws.com"
REMOTE_PATH="~/HSuite/dist"
LOG_FILE="deploy.log"

# === START LOGGING ===
echo "===== Deployment started at $(date) =====" | tee -a "$LOG_FILE"

# === BUILD PROJECT ===
echo "Building project..." | tee -a "$LOG_FILE"
npm install >> "$LOG_FILE" 2>&1
npm run build >> "$LOG_FILE" 2>&1

# Detect OS
OS_TYPE="$(uname | tr '[:upper:]' '[:lower:]')"

# === UPLOAD FILES ===
echo "Uploading files to server..." | tee -a "$LOG_FILE"

if [[ "$OS_TYPE" == *"mingw"* || "$OS_TYPE" == *"msys"* || "$OS_TYPE" == *"cygwin"* ]]; then
  echo "Detected Windows environment — using scp instead of rsync" | tee -a "$LOG_FILE"
  chmod 600 "$SSH_KEY_PATH"
  scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no -r dist/* "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH" \
    >> "$LOG_FILE" 2>&1
else
  if ! command -v rsync >/dev/null 2>&1; then
    echo "rsync not found. Installing..."
    if [[ "$OS_TYPE" == *"linux"* ]]; then
      sudo apt update && sudo apt install -y rsync
    elif [[ "$OS_TYPE" == *"darwin"* ]]; then
      brew install rsync
    else
      echo "Please install rsync manually."
      exit 1
    fi
  fi

  rsync -avz --delete \
    -e "ssh -i \"$SSH_KEY_PATH\" -o StrictHostKeyChecking=no" \
    dist/ "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH" \
    >> "$LOG_FILE" 2>&1
fi

# === DONE ===
echo "Deployment completed successfully at $(date)" | tee -a "$LOG_FILE"
echo "============================================================================" | tee -a "$LOG_FILE"
