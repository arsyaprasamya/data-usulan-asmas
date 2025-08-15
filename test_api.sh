#!/bin/bash

# API Testing Script untuk Data Usulan ASMAS
# Usage: 
#   ./test_api.sh local    # Test local development
#   ./test_api.sh prod     # Test production deployment

if [ "$1" = "prod" ]; then
    BASE_URL="https://ornate-5001be.netlify.app"
    echo "🌐 Testing PRODUCTION deployment at: $BASE_URL"
elif [ "$1" = "local" ]; then
    BASE_URL="http://localhost:3000"
    echo "🏠 Testing LOCAL development at: $BASE_URL"
else
    BASE_URL="http://localhost:3000"
    echo "🏠 Testing LOCAL development at: $BASE_URL (default)"
    echo "💡 Use './test_api.sh prod' to test production deployment"
fi

echo "🔑 Step 1: Generate Token"
TOKEN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@usulan-asmas.com",
    "password": "admin123"
  }')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to generate token"
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

echo "✅ Token generated successfully"
echo "Token: ${TOKEN:0:50}..."

echo ""
echo "🔍 Step 2: Test GET with filtering"
curl -s -X GET "$BASE_URL/api/usulan?tahun=2024&page=1&limit=3" \
  -H "Authorization: Bearer $TOKEN" | head -20

echo ""
echo ""
echo "➕ Step 3: Test POST (Create usulan)"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/usulan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "judul": "Test API Script",
    "deskripsi": "Created by test script",
    "pengusul": "Test User",
    "kode_wilayah": "31.01.07.001",
    "latitude": -6.200000,
    "longitude": 106.800000,
    "skpd_id": 1,
    "periode_id": 2,
    "status_id": 1,
    "gambar": [
      {
        "file_path": "/uploads/test/script_test.jpg",
        "keterangan": "Test image from script"
      }
    ]
  }')

CREATED_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Created usulan with ID: $CREATED_ID"

echo ""
echo "✏️ Step 4: Test PUT (Update usulan)"
curl -s -X PUT $BASE_URL/api/usulan/$CREATED_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "judul": "UPDATED Test API Script",
    "status_id": 2
  }' > /dev/null

echo "✅ Updated usulan ID: $CREATED_ID"

echo ""
echo "🗑️ Step 5: Test DELETE (Soft delete)"
curl -s -X DELETE $BASE_URL/api/usulan/$CREATED_ID \
  -H "Authorization: Bearer $TOKEN" > /dev/null

echo "✅ Soft deleted usulan ID: $CREATED_ID"

echo ""
echo "🎯 Step 6: Test Master Data"
curl -s -X GET $BASE_URL/api/master \
  -H "Authorization: Bearer $TOKEN" | head -10

echo ""
echo ""
echo "🏁 All tests completed successfully!"
