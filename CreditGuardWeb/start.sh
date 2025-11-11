#!/bin/bash

# CreditGuard Landing Page - Start Script
# This script starts a local web server to view the landing page

echo "🚀 Starting CreditGuard Landing Page..."
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 detected - Starting server on port 8000..."
    echo ""
    echo "📱 Open your browser and visit:"
    echo "   http://localhost:8000/creditguard_landing_page.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000

# Check if Python 2 is available
elif command -v python &> /dev/null; then
    echo "✅ Python detected - Starting server on port 8000..."
    echo ""
    echo "📱 Open your browser and visit:"
    echo "   http://localhost:8000/creditguard_landing_page.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000

# Check if PHP is available
elif command -v php &> /dev/null; then
    echo "✅ PHP detected - Starting server on port 8000..."
    echo ""
    echo "📱 Open your browser and visit:"
    echo "   http://localhost:8000/creditguard_landing_page.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    php -S localhost:8000

# Check if Node.js is available
elif command -v node &> /dev/null; then
    echo "✅ Node.js detected - Installing http-server if needed..."
    npx http-server -p 8000 -o creditguard_landing_page.html

else
    echo "❌ Error: No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo "  - PHP: https://www.php.net/downloads"
    echo ""
    echo "Or manually open 'creditguard_landing_page.html' in your browser."
    exit 1
fi
