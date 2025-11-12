#!/bin/bash
# Health Check Script for SF-1 API Gateway

GATEWAY_URL="${GATEWAY_URL:-http://localhost}"

echo "🔍 Checking API Gateway Health..."

# Check Traefik API
if curl -sf "${GATEWAY_URL}:8082/ping" > /dev/null; then
    echo "✅ Traefik is healthy"
else
    echo "❌ Traefik is down!"
    exit 1
fi

# Check all backend services
services=(
    "auth:3001"
    "price:3002"
    "journal:3003"
    "tools:3004"
    "community:3005"
    "notification:3006"
    "search:3007"
    "media:3008"
    "gamification:3009"
    "ai:3010"
)

failed=0

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    
    if curl -sf "http://${name}-service:${port}/health" > /dev/null 2>&1; then
        echo "✅ ${name}-service is healthy"
    else
        echo "⚠️  ${name}-service is not responding"
        ((failed++))
    fi
done

echo ""
echo "📊 Summary: $((${#services[@]} - failed))/${#services[@]} services healthy"

if [ $failed -gt 0 ]; then
    echo "⚠️  Some services are not responding, but gateway is still operational"
fi

exit 0
