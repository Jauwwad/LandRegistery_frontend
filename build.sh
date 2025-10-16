#!/bin/bash
# Build script for Render static site deployment

echo "Starting build process..."

# Set Node.js version
export NODE_VERSION=18.18.0

# Clean install to avoid permission issues
rm -rf node_modules package-lock.json
npm install

# Fix permissions
chmod +x node_modules/.bin/*

# Build the application
npm run build

echo "Build completed successfully!"