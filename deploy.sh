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

# === UPLOAD FILES (including hidden ones) ===
echo "Uploading files to server..." | tee -a "$LOG_FILE"
rsync -avz --delete \
  -e "ssh -i \"$SSH_KEY_PATH\" -o StrictHostKeyChecking=no" \
  dist/ "$SERVER_USER@$SERVER_HOST:$REMOTE_PATH" \
  >> "$LOG_FILE" 2>&1

# === DONE ===
echo "Deployment completed successfully at $(date)" | tee -a "$LOG_FILE"

echo "============================================================================" | tee -a "$LOG_FILE"
