#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# Diet Tracker - Post-Deploy Test Script
# ═══════════════════════════════════════════════════════════════
#
# Uso: ./scripts/test-deploy.sh [URL_BASE]
# Ejemplo: ./scripts/test-deploy.sh https://diet-tracker.vercel.app
#
# Si no se proporciona URL, usa la URL por defecto

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
DEFAULT_URL="https://diet-tracker.vercel.app"
BASE_URL="${1:-$DEFAULT_URL}"
TIMEOUT=10
VERBOSE=false

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# ═══════════════════════════════════════════════════════════════
# Funciones de utilidad
# ═══════════════════════════════════════════════════════════════

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

test_endpoint() {
  local name=$1
  local endpoint=$2
  local expected_codes=$3
  local check_body=$4
  
  echo -n "  Testing $name... "
  
  local response
  local http_code
  
  if ! response=$(curl -s --max-time $TIMEOUT -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null); then
    log_error "Failed to connect"
    ((TESTS_FAILED++))
    return 1
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if echo "$expected_codes" | grep -q "$http_code"; then
    if [ -n "$check_body" ] && ! echo "$body" | grep -q "$check_body"; then
      log_error "HTTP $http_code (body check failed)"
      [ "$VERBOSE" = true ] && echo "    Expected in body: $check_body"
      ((TESTS_FAILED++))
      return 1
    fi
    log_info "✓ HTTP $http_code"
    ((TESTS_PASSED++))
    return 0
  else
    log_error "HTTP $http_code (expected: $expected_codes)"
    ((TESTS_FAILED++))
    return 1
  fi
}

# ═══════════════════════════════════════════════════════════════
# Header
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     DIET TRACKER - POST-DEPLOYMENT VERIFICATION              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
log_info "Testing deployment at: $BASE_URL"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
  log_error "curl is required but not installed"
  exit 1
fi

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: Health Checks
# ═══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: Health Checks"
echo "═══════════════════════════════════════════════════════════════"

test_endpoint "Health API" "/api/health" "200" "status"

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: Static Pages
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: Static Pages"
echo "═══════════════════════════════════════════════════════════════"

test_endpoint "Home Page" "/" "200"
test_endpoint "Login Page" "/login" "200"
test_endpoint "Register Page" "/register" "200"
test_endpoint "Dashboard" "/dashboard" "200|307|308"
test_endpoint "404 Page" "/nonexistent-page-xyz" "404"

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: API Endpoints
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: API Endpoints"
echo "═══════════════════════════════════════════════════════════════"

# Public endpoints
test_endpoint "API: Products" "/api/products" "200|401"
test_endpoint "API: Recipes" "/api/recipes" "200|401"
test_endpoint "API: Barcode Lookup" "/api/barcode-lookup" "200|400|401"

# Auth endpoints (POST sin body = 400, o 405 si method not allowed)
test_endpoint "API: Auth Login (OPTIONS)" "/api/auth/login" "200|204" ""

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: Static Assets
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: Static Assets"
echo "═══════════════════════════════════════════════════════════════"

# Check _next/static (donde están los assets compilados)
echo -n "  Testing Next.js assets... "
asset_response=$(curl -s --max-time $TIMELO --head "$BASE_URL/_next/static/" 2>/dev/null | head -1 || echo "")
if echo "$asset_response" | grep -q "404"; then
  log_warn "⚓ Asset folder accessible (may indicate missing files)"
else
  log_info "✓ Asset structure looks OK"
fi

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: Headers & CORS
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: Headers & Configuration"
echo "═══════════════════════════════════════════════════════════════"

echo -n "  Testing CORS headers on API... "
cors_headers=$(curl -s --max-time $TIMEOUT -I -X OPTIONS \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  "$BASE_URL/api/health" 2>/dev/null | grep -i "access-control" || echo "")

if [ -n "$cors_headers" ]; then
  log_info "✓ CORS headers present"
else
  log_warn "⚓ CORS headers may be missing (check manually)"
fi

echo -n "  Testing Content Security... "
security_headers=$(curl -s --max-time $TIMEOUT -I "$BASE_URL/" 2>/dev/null | grep -i "content-security-policy" || echo "")
if [ -n "$security_headers" ]; then
  log_info "✓ Security headers present"
else
  log_warn "⚓ No CSP header (not critical but recommended)"
fi

# ═══════════════════════════════════════════════════════════════
# TEST SUITE: Performance
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 TEST SUITE: Performance"
echo "═══════════════════════════════════════════════════════════════"

echo -n "  Testing response time... "
start_time=$(date +%s%N 2>/dev/null || date +%s)
curl -s --max-time $TIMEOUT -o /dev/null "$BASE_URL/"
end_time=$(date +%s%N 2>/dev/null || date +%s)

if command -v bc &> /dev/null 2>/dev/null; then
  duration=$(echo "scale=3; ($end_time - $start_time) / 1000000000" | bc 2>/dev/null || echo "unknown")
else
  duration="<1s"
fi

log_info "✓ Response time: ${duration}s"

# ═══════════════════════════════════════════════════════════════
# Results
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                      TEST RESULTS                            ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
printf  "║  ✅ Passed:  %-48s ║\n" "$TESTS_PASSED"
printf  "║  ❌ Failed:  %-48s ║\n" "$TESTS_FAILED"
printf  "║  ⏭️  Skipped: %-48s ║\n" "$TESTS_SKIPPED"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  log_info "🎉 All critical tests passed! Deployment looks healthy."
  echo ""
  echo "Next steps:"
  echo "  1. Visit $BASE_URL and test manual functionality"
  echo "  2. Register a test user"
  echo "  3. Complete the onboarding flow"
  echo "  4. Add a test food entry"
  echo ""
  exit 0
else
  log_error "⚠️  Some tests failed. Please review the output above."
  echo ""
  echo "Troubleshooting:"
  echo "  - Check Vercel logs: vercel logs --prod"
  echo "  - Verify environment variables in Vercel Dashboard"
  echo "  - Ensure Supabase is accessible"
  echo ""
  exit 1
fi