# 💰 SF-1 Price Service

Cannabis seed price scraper and comparison service with real-time updates.

## 🎯 Features

- **Web Scraping**: Playwright-based stealth scraping
- **3 Seedbanks**: Zamnesia, Royal Queen Seeds, Sensi Seeds
- **Price Comparison**: Real-time price tracking
- **Price Alerts**: Notify users when prices drop
- **WebSocket**: Live price updates
- **BullMQ Queue**: Scalable scraping jobs
- **MongoDB**: Seed & Price storage
- **Redis**: Caching & Queue

## 📦 Installation

```bash
npm install
```

## 🔧 Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure MongoDB & Redis URLs in `.env`

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

## 🚀 Development

```bash
# Start API server
npm run dev

# Start worker (separate terminal)
npm run worker
```

## 📡 API Endpoints

### Prices
```
GET  /api/prices/today           - Today's prices
GET  /api/prices/search?q=...    - Search seeds
GET  /api/prices/seed/:slug      - Prices for specific seed
GET  /api/prices/compare?slugs=  - Compare multiple seeds
GET  /api/prices/trending        - Trending seeds
```

### Alerts
```
POST   /api/alerts               - Create price alert
GET    /api/alerts               - Get user's alerts
PATCH  /api/alerts/:id/deactivate - Deactivate alert
DELETE /api/alerts/:id           - Delete alert
```

### Admin
```
POST /admin/scrape/:seedbank     - Manual scrape trigger
GET  /queue/stats                - Queue statistics
```

## 🔌 WebSocket

Connect to `ws://localhost:3002`:

```javascript
const socket = io('ws://localhost:3002');

// Subscribe to seed updates
socket.emit('subscribe:seed', 'gorilla-glue-4');

// Listen for price changes
socket.on('price:changed', (data) => {
  console.log('New price:', data);
});

// Scraping status
socket.on('scraping:status', (status) => {
  console.log('Scraping:', status);
});
```

## 🤖 Scraper Architecture

```
BaseScraper (abstract)
  ├── ZamnesiaScraper
  ├── RQSScraper
  └── SensiSeedsScraper
```

### Adding New Seedbank

1. Create adapter in `src/scrapers/adapters/`:
```typescript
export class NewSeebankScraper extends BaseScraper {
  protected baseUrl = 'https://newseedbank.com';
  protected seedbankName = 'New Seedbank';
  protected seedbankSlug = 'newseedbank';
  
  async scrapeAll(): Promise<ScrapedProduct[]> {
    // Implementation
  }
}
```

2. Register in `src/workers/scraper.worker.ts`:
```typescript
const scrapers = {
  zamnesia: new ZamnesiaScraper(),
  rqs: new RQSScraper(),
  newseedbank: new NewSeebankScraper()
};
```

## 📊 MongoDB Schema

### Seed
```typescript
{
  name: string
  slug: string (unique)
  breeder: string
  type: 'feminized' | 'autoflower' | 'regular'
  thc?: number
  cbd?: number
  floweringTime?: number
  viewCount: number
  lowestPrice?: number
  avgPrice?: number
}
```

### Price
```typescript
{
  seedId: ObjectId
  seedbank: string
  price: number
  currency: 'EUR' | 'USD' | 'GBP'
  inStock: boolean
  packSize: string
  seedCount: number
  url: string
  scrapedAt: Date
  validUntil: Date
}
```

### PriceAlert
```typescript
{
  userId: string
  seedId: ObjectId
  targetPrice: number
  isActive: boolean
  triggeredAt?: Date
}
```

## 🕐 Scheduled Jobs

- **Daily Scraping**: 02:00 (all seedbanks)
- **Alert Checks**: Every hour
- **Price Cleanup**: Every 6 hours (remove expired)

## 🐳 Docker

Build:
```bash
docker build -t sf1-price-service .
```

Run:
```bash
docker run -p 3002:3002 \
  -e MONGODB_URL=mongodb://host.docker.internal:27017/sf1-prices \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  sf1-price-service
```

## ☸️ Kubernetes

Deploy:
```bash
kubectl apply -f k8s/deployment.yml
```

Includes:
- Main API (2 replicas)
- Worker (1 replica)
- CronJob (daily scraping)

## 🔒 Robots.txt Compliance

The scraper respects `robots.txt`:
- Checks before scraping
- Honors rate limits
- User-Agent: `SF1-PriceBot`

## ⚡ Performance

- **Caching**: Redis (5 min TTL)
- **Rate Limiting**: 2s between requests per seedbank
- **Stealth Mode**: Anti-detection measures
- **Concurrency**: 1 scrape job at a time

## 🧪 Testing

```bash
npm test
```

## 📈 Monitoring

Prometheus metrics exposed at `/metrics`:
- Scrape duration
- Price count
- Alert triggers
- WebSocket connections

## 🛠️ Maintenance

### Clean expired prices
```bash
curl -X POST http://localhost:3002/admin/cleanup
```

### View queue stats
```bash
curl http://localhost:3002/queue/stats
```

## 🐛 Troubleshooting

### CAPTCHA Issues
If scrapers hit CAPTCHAs frequently:
1. Increase `rateLimitMs` in scraper
2. Rotate user agents
3. Use proxy rotation

### Memory Issues
Large scrapes can use significant memory:
```yaml
resources:
  limits:
    memory: "4Gi"  # Increase if needed
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests
4. Submit pull request

## 📞 Support

- Issues: GitHub Issues
- Docs: /docs
- API: /api-docs (Swagger)
