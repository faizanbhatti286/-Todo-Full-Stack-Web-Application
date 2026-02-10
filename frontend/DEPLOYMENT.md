# Frontend Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API running (FastAPI)
- Environment variables configured

## Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production

# Application
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment Variables

For production deployment, update the values:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=<generate-secure-random-string>
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm run build
```

## Development

```bash
# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

## Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start

# Application will be available at http://localhost:3000
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard

4. Set up custom domain (optional)

### Option 2: Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Build and run:
```bash
docker build -t todo-app-frontend .
docker run -p 3000:3000 --env-file .env.local todo-app-frontend
```

### Option 3: Traditional Server (PM2)

1. Install PM2:
```bash
npm install -g pm2
```

2. Build the application:
```bash
npm run build
```

3. Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'todo-app-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

4. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 4: Static Export (if no server-side features needed)

1. Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // ... other config
};
```

2. Build:
```bash
npm run build
```

3. Deploy the `out` directory to any static hosting (Netlify, GitHub Pages, S3, etc.)

## Nginx Configuration (Reverse Proxy)

If deploying behind Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/HTTPS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

## Performance Optimization

### 1. Enable Compression

Nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Caching Strategy

```nginx
location /_next/static/ {
    alias /path/to/frontend/.next/static/;
    expires 1y;
    access_log off;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN Integration

Configure CDN (Cloudflare, AWS CloudFront) to cache static assets:
- `/_next/static/*` - Cache for 1 year
- `/images/*` - Cache for 1 month
- HTML pages - Cache with revalidation

## Monitoring and Logging

### Application Monitoring

1. Add error tracking (Sentry):
```bash
npm install @sentry/nextjs
```

2. Configure in `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Server Logs

```bash
# PM2 logs
pm2 logs todo-app-frontend

# Docker logs
docker logs -f <container-id>

# Vercel logs
vercel logs
```

## Health Checks

Create a health check endpoint by adding `app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

## Backup and Recovery

### Database Backups
- Backend handles database backups
- Frontend is stateless (no data to backup)

### Configuration Backups
- Store environment variables securely (1Password, AWS Secrets Manager)
- Version control all configuration files

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors

1. Check browser console for client-side errors
2. Check server logs for SSR errors
3. Verify environment variables are set correctly
4. Ensure backend API is accessible

### Performance Issues

1. Enable Next.js analytics:
```bash
npm install @vercel/analytics
```

2. Monitor Core Web Vitals
3. Use Lighthouse for performance audits

## Security Checklist

- [ ] Environment variables are not committed to git
- [ ] HTTPS is enabled in production
- [ ] CORS is properly configured on backend
- [ ] CSP headers are configured
- [ ] Rate limiting is enabled
- [ ] Authentication tokens are stored securely (sessionStorage)
- [ ] XSS protection is enabled
- [ ] Dependencies are regularly updated

## Scaling

### Horizontal Scaling

1. Deploy multiple instances behind a load balancer
2. Use session-based authentication (already implemented)
3. Configure load balancer health checks

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize Next.js configuration
3. Enable caching at multiple levels

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 stop todo-app-frontend
# Deploy previous version
pm2 start ecosystem.config.js
```

### Docker
```bash
docker stop <container-id>
docker run -p 3000:3000 todo-app-frontend:<previous-tag>
```

## Support and Maintenance

### Regular Maintenance Tasks

1. Update dependencies monthly:
```bash
npm outdated
npm update
```

2. Security audits:
```bash
npm audit
npm audit fix
```

3. Performance monitoring
4. Log analysis
5. Backup verification

### Emergency Contacts

- DevOps Team: devops@example.com
- Backend Team: backend@example.com
- On-call: +1-XXX-XXX-XXXX

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Docker Documentation](https://docs.docker.com/)
