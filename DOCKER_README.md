# Google Maps Scraper - Docker Deployment

This guide explains how to run the Google Maps Scraper application using Docker and Docker Compose on any server.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

### Installing Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Other platforms:**
Visit [Docker's official installation guide](https://docs.docker.com/get-docker/)

## Quick Start

1. **Clone or copy the project to your server:**
   ```bash
   cd /path/to/google-maps-scraper
   ```

2. **Build and start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   Open your browser and navigate to `http://your-server-ip:5000`

## Docker Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f app
```

### Rebuild after code changes
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Check container status
```bash
docker-compose ps
```

## Configuration

### Port Configuration

By default, the application runs on port 5000. To change this, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:5000"  # Change 8080 to your desired port
```

### Environment Variables

You can add custom environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - MAX_SCRAPE_TIMEOUT=60000
```

## Troubleshooting

### Chromium Issues

The application runs Chromium with the `--no-sandbox` flag, which works in most Docker environments without special capabilities. If you encounter Chromium-related errors, you can try uncommenting the security option in docker-compose.yml (note: this is less secure):

```yaml
security_opt:
  - seccomp:unconfined
```

### Memory Issues

If scraping fails due to memory constraints, increase Docker's memory limit:

```yaml
services:
  app:
    # ... other config
    mem_limit: 2g
```

### Logs Directory

The application creates a `logs` directory that's mounted as a volume. This persists logs between container restarts.

## Production Deployment

### Using a Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### SSL/HTTPS

For production, use Let's Encrypt with Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Auto-restart on Server Reboot

The `docker-compose.yml` includes `restart: unless-stopped` which automatically restarts the container if the server reboots.

## Updating the Application

1. Pull the latest code
2. Rebuild and restart:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Security Considerations

- Always use HTTPS in production
- Consider rate limiting at the reverse proxy level
- Monitor resource usage to prevent abuse
- Review Google's Terms of Service for scraping compliance

## Support

For issues or questions, check the logs:
```bash
docker-compose logs -f app
```
