#!/bin/bash
# Build script for Render static site deployment

echo "Starting build process..."

# Set environment variables
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export SKIP_PREFLIGHT_CHECK=true
export DISABLE_ESLINT_PLUGIN=true

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Verify react-scripts is installed
echo "Verifying react-scripts installation..."
if [ ! -f "node_modules/.bin/react-scripts" ]; then
    echo "react-scripts not found, installing manually..."
    npm install react-scripts --save
fi

# List node_modules/.bin to debug
echo "Available scripts:"
ls -la node_modules/.bin/ | head -10

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"