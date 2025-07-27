#!/bin/bash

# Test script to verify Electron app starts without "exports is not defined" error

cd /home/runner/work/testing-copilot/testing-copilot/packages/app

echo "Building the application..."
pnpm build

echo "Starting Electron app in test mode..."
timeout 10s npx electron dist-electron/main.js --no-sandbox > test_output.log 2>&1 &
APP_PID=$!

# Wait for app to start
sleep 5

# Check if the error "exports is not defined" appears in the output
if grep -q "exports is not defined" test_output.log; then
    echo "❌ FAIL: 'exports is not defined' error still present"
    exit 1
else
    echo "✅ PASS: No 'exports is not defined' error found"
fi

# Check if the app started successfully (database connected)
if grep -q "Database connection established successfully" test_output.log; then
    echo "✅ PASS: App started successfully - database connected"
else
    echo "❌ FAIL: App did not start properly"
    exit 1
fi

# Clean up
kill $APP_PID 2>/dev/null || true

echo "✅ All tests passed!"