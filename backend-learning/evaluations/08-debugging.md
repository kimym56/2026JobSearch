# Debugging & Troubleshooting Guide

This guide helps you debug and troubleshoot backend issues.

## Table of Contents

1. [Reading Backend Logs](#reading-backend-logs)
2. [Common Issues](#common-issues)
3. [Testing the Backend](#testing-the-backend)

## Reading Backend Logs

### NestJS Logs

Logs are stored in `backend/logs/`:

```bash
# View all logs
tail -f backend/logs/combined.log

# View error logs
tail -f backend/logs/error.log
```

### Python Agent Manager Logs

```bash
# View Celery worker logs
docker-compose logs -f celery-worker

# View Agent Manager logs
docker-compose logs -f agent-server
```

## Common Issues

### Issue: Cannot Connect to Database

**Symptoms**: `Connection refused` error

**Solutions**:
1. Check PostgreSQL is running: `docker ps`
2. Verify DB_HOST and DB_PORT in `.env`
3. Ensure database exists: `docker exec -it postgres psql -U postgres -c "CREATE DATABASE mocheong_db;"`

### Issue: Socket.IO Connection Fails

**Symptoms**: Frontend cannot connect to WebSocket

**Solutions**:
1. Verify JWT token is valid
2. Check CORS settings in `chat.gateway.ts`
3. Ensure Socket.IO path matches: `/chat`

### Issue: Agent Manager Not Responding

**Symptoms**: Chat messages timeout

**Solutions**:
1. Check Celery worker is running: `docker-compose ps celery-worker`
2. Verify Redis connection: `docker-compose logs redis`
3. Check Agent Manager health: `curl http://localhost:8000/health`

## Testing the Backend

### API Testing with Swagger

Visit: `http://localhost:3002/api/docs`

### Manual Testing

```bash
# Test health
curl http://localhost:3002/api

# Test registration
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

- [09-glossary.md](./09-glossary.md) - Look up unfamiliar terms
