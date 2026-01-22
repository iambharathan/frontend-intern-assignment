#!/bin/bash

# Simple Backend Test Script
# This script will test if the backend is working properly

echo "🧪 Testing Task Manager Backend API..."
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "📍 Test 1: Health Check"
HEALTH=$(curl -s "$BASE_URL/health")
if [[ $HEALTH == *"success"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Signup
echo "📍 Test 2: User Signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

if [[ $SIGNUP_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ Signup successful${NC}"
    TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:20}..."
else
    echo -e "${YELLOW}⚠ Signup failed (user may already exist)${NC}"
fi
echo ""

# Test 3: Login
echo "📍 Test 3: User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Get Profile (Protected Route)
echo "📍 Test 4: Get Profile (Protected Route)"
PROFILE_RESPONSE=$(curl -s "$BASE_URL/api/users/profile" \
  -H "Authorization: Bearer $TOKEN")

if [[ $PROFILE_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ Protected route access successful${NC}"
else
    echo -e "${RED}✗ Protected route failed${NC}"
    exit 1
fi
echo ""

# Test 5: Create Task
echo "📍 Test 5: Create Task"
TASK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task from the automated script",
    "status": "pending",
    "priority": "medium"
  }')

if [[ $TASK_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ Task creation successful${NC}"
    TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo "   Task ID: $TASK_ID"
else
    echo -e "${RED}✗ Task creation failed${NC}"
    exit 1
fi
echo ""

# Test 6: Get All Tasks
echo "📍 Test 6: Get All Tasks"
TASKS_RESPONSE=$(curl -s "$BASE_URL/api/tasks" \
  -H "Authorization: Bearer $TOKEN")

if [[ $TASKS_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ Get tasks successful${NC}"
    TASK_COUNT=$(echo $TASKS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "   Total tasks: $TASK_COUNT"
else
    echo -e "${RED}✗ Get tasks failed${NC}"
    exit 1
fi
echo ""

# Final Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ All backend tests passed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Backend is working properly!"
echo "💡 Your JWT Token (save this for frontend testing):"
echo "   $TOKEN"
echo ""
echo "📝 Next Steps:"
echo "   1. Keep backend running (npm run dev)"
echo "   2. Start building the frontend!"
echo ""
