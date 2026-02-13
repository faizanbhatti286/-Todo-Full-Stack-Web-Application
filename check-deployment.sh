#!/bin/bash

# Production Deployment Checklist Script
# Run this to verify your deployment configuration

echo "🔍 Checking Production Deployment Configuration..."
echo ""

# Check if backend files exist
echo "📦 Backend Files:"
if [ -f "backend/Dockerfile" ]; then
    echo "  ✅ Dockerfile exists"
else
    echo "  ❌ Dockerfile missing"
fi

if [ -f "backend/app.py" ]; then
    echo "  ✅ app.py exists"
else
    echo "  ❌ app.py missing"
fi

if [ -f "backend/requirements.txt" ]; then
    echo "  ✅ requirements.txt exists"
else
    echo "  ❌ requirements.txt missing"
fi

echo ""
echo "🌐 Frontend Configuration:"
if [ -f "frontend/.env.local" ]; then
    echo "  ✅ .env.local exists"

    # Check if using production URL
    if grep -q "localhost" frontend/.env.local; then
        echo "  ⚠️  WARNING: .env.local contains localhost URLs"
        echo "     Make sure Vercel environment variables use production URLs"
    else
        echo "  ✅ No localhost URLs found"
    fi
else
    echo "  ❌ .env.local missing"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Deploy Backend to Hugging Face Spaces:"
echo "   - Create new Space with Docker SDK"
echo "   - Upload all backend files"
echo "   - Set environment variables in Space settings:"
echo "     • DATABASE_URL"
echo "     • BETTER_AUTH_SECRET"
echo "     • FRONTEND_URL"
echo "     • PORT=7860"
echo ""
echo "2. Configure Frontend on Vercel:"
echo "   - Go to Project Settings → Environment Variables"
echo "   - Set NEXT_PUBLIC_API_BASE_URL to your HF Space URL"
echo "   - Set BETTER_AUTH_SECRET (same as backend)"
echo "   - Redeploy"
echo ""
echo "3. Test the deployment:"
echo "   - Visit your HF Space URL/health"
echo "   - Try signup/login on your Vercel frontend"
echo ""
echo "📖 See backend/README_DEPLOYMENT.md for detailed instructions"
