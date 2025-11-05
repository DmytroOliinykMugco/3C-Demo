# Docker Setup Guide

This guide explains how to run the 3C Demo application using Docker.

## Prerequisites

- Docker installed on your system ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose

From the project root directory, run:

```bash
docker-compose up --build
```

This will:
- Build both frontend and backend containers
- Start the backend on port 3000
- Start the frontend on port 80

### 2. Access the Application

Once the containers are running:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api

### 3. Stop the Application

To stop the containers:

```bash
docker-compose down
```

## Docker Commands

### Build containers without starting
```bash
docker-compose build
```

### Start containers in detached mode (background)
```bash
docker-compose up -d
```

### View container logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart containers
```bash
docker-compose restart
```

### Stop and remove containers, networks
```bash
docker-compose down
```

### Stop and remove containers, networks, and volumes
```bash
docker-compose down -v
```

## Configuration

### Change Backend Port

Edit `docker-compose.yml` and modify the backend port mapping:

```yaml
backend:
  ports:
    - "8080:3000"  # Change 8080 to your desired port
```

### Change Frontend Port

Edit `docker-compose.yml` and modify the frontend port mapping:

```yaml
frontend:
  ports:
    - "8080:80"  # Change 8080 to your desired port
```

### Change API URL for Frontend

If you deploy the backend on a different domain or port, update the `VITE_API_URL` in `docker-compose.yml`:

```yaml
frontend:
  build:
    args:
      - VITE_API_URL=https://your-api-domain.com
```

## Production Deployment

For production deployment:

1. **Update API URL**: Modify the `VITE_API_URL` in `docker-compose.yml` to point to your production backend URL

2. **Add Environment Variables**: Create a `.env` file in the root directory if needed:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

3. **Use production docker-compose**: You may want to create a `docker-compose.prod.yml`:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Enable HTTPS**: Consider using a reverse proxy like nginx or Traefik with SSL certificates

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

1. Check running containers:
   ```bash
   docker ps
   ```

2. Stop conflicting containers or change the port in `docker-compose.yml`

### Container Won't Start

Check the logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Frontend Can't Connect to Backend

1. Make sure both containers are running:
   ```bash
   docker-compose ps
   ```

2. Verify the backend is accessible:
   ```bash
   curl http://localhost:3000/api/profile
   ```

3. Check if the API URL is correctly configured in the frontend build

### Rebuild After Code Changes

When you make changes to the code:

```bash
docker-compose down
docker-compose up --build
```

Or for a specific service:
```bash
docker-compose build backend
docker-compose up -d backend
```

## Individual Container Commands

### Run Backend Only
```bash
cd backend
docker build -t 3c-backend .
docker run -p 3000:3000 3c-backend
```

### Run Frontend Only
```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:3000 -t 3c-frontend .
docker run -p 80:80 3c-frontend
```

## Health Checks

The backend container includes a health check that verifies the API is responding. You can check the health status:

```bash
docker-compose ps
```

The STATUS column will show "healthy" when the backend is ready.
