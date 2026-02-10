#!/bin/bash
# Restart Frontend to Pick Up Environment Variables

echo "Stopping any running Next.js processes..."
pkill -f "next dev" 2>/dev/null || true

echo "Starting frontend on port 3000..."
cd "$(dirname "$0")"
npm run dev
