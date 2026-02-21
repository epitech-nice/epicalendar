# EpiCalendar



## Launch Guide

This project supports multiple deployment modes: local development, development with Docker, and production with Docker.

### Prerequisites

- Node.js and pnpm
- Docker and Docker Compose
- MongoDB (for local development only)
- A `.env` (for local development and development with Docker) and a `.env.prod` (for production with Docker) in the project root

### Local Development Mode

#### Requirements
- MongoDB must be running locally
- Start MongoDB service: `sudo systemctl start mongod`

#### Commands
```bash
# Install dependencies and launch the project
make all

# Or run steps individually:
make init     # Link environment files
make install  # Install dependencies
make launch   # Build and start both server and client
```

**Important**: For local development, ensure MongoDB is running with `sudo systemctl start mongod`. Stop MongoDB (`sudo systemctl stop mongod`) when switching to Docker modes to avoid conflicts.

### Development Environment (Docker)

#### Requirements
- Stop local MongoDB if running: `sudo systemctl stop mongod`

#### Commands
```bash
# Start development environment
make dev-up

# View logs
make dev-logs

# Stop development environment
make dev-down

# Restart development environment
make dev-restart
```

### Production Environment (Docker)

#### Requirements
- Stop local MongoDB if running: `sudo systemctl stop mongod`

#### Commands
```bash
# Start production environment
make prod-up

# View logs
make prod-logs

# Stop production environment
make prod-down

# Restart production environment
make prod-restart
```

### Cleanup

#### Light cleanup
```bash
# Remove environment links, stop containers, and prune unused Docker resources
make clean
```

#### Full cleanup
```bash
# WARNING: This will reset the MongoDB database
make fclean
```

The `fclean` command will prompt for confirmation before removing all Docker volumes, which will result in database data loss.



## Contributors
TORO Nicolas : nicolas2.toro@epitech.eu
