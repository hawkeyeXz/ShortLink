# ShortLink 🔗

A powerful and scalable URL shortener service built with Node.js, Express, and Redis. ShortLink provides fast URL shortening with API token-based rate limiting, device tracking, and production-ready deployment options.

## ✨ Features

- **URL Shortening**: Generate short, unique URLs that expire after 48 hours
- **Token-Based Authentication**: Secure API access with token generation and validation
- **Rate Limiting**: Multi-layer rate limiting (IP-based, device-based, and token-based)
- **Device Tracking**: Cookie-based device identification for usage limits
- **Redis Backend**: Fast, in-memory data storage with automatic expiration
- **Production Ready**: Docker, Nginx, and AWS infrastructure support (Terraform)
- **Logging**: Structured logging with Winston
- **Tested**: Jest-based test suite

## 🛠️ Technology Stack

- **Backend**: Node.js (ES Modules), Express 5
- **Database**: Redis 7
- **Rate Limiting**: express-rate-limit
- **ID Generation**: nanoid
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **Infrastructure**: Terraform (AWS ALB, ASG, Route53, ACM)

## 📋 Prerequisites

- Node.js 24+ (Alpine recommended)
- Redis 7+
- Docker & Docker Compose (for containerized deployment)
- AWS account (for production deployment with Terraform)

## 🚀 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/fajlur79/ShortLink.git
   cd ShortLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   REDIS_URL=redis://localhost:6379
   BASE_URL=localhost:3000
   NODE_ENV=development
   ```

4. **Start Redis** (if not already running)
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Or using local Redis installation
   redis-server
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The service will be available at `http://localhost:3000`

### Docker Deployment

1. **Using Docker Compose** (Recommended)
   ```bash
   # Create environment file
   cp .env.example .env  # Configure your environment variables
   
   # Start all services (app, Redis, Nginx)
   docker-compose up -d
   ```

   Services:
   - App: Running on port 3000 (internal)
   - Redis: Data storage with persistence
   - Nginx: Reverse proxy on port 80

2. **Using Docker image from GitHub Container Registry**
   ```bash
   docker pull ghcr.io/fajlur79/shortlink:latest
   docker run -d -p 3000:3000 \
     -e REDIS_URL=redis://redis:6379 \
     -e BASE_URL=yourdomain.com \
     ghcr.io/fajlur79/shortlink:latest
   ```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | Yes |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | Yes |
| `BASE_URL` | Base URL for short links | `localhost:3000` | Yes |
| `NODE_ENV` | Environment mode | `development` | No |

## 📚 API Endpoints

### 1. Health Check
```http
GET /
```
Returns a welcome message to verify the service is running.

**Response:**
```
Welcome to ShortLink.
```

### 2. Generate API Token
```http
POST /generate-key
```
Generates a new API token for device. Requires a device cookie.

**Response:**
```json
{
  "token": "32-character-hex-token"
}
```

**Limits:**
- 5 tokens per device per day
- 100 tokens per IP per day
- 5 tokens per IP per 2 minutes (burst limit)

### 3. Get Active Token
```http
GET /get-key
```
Retrieves the active API token for the current device.

**Response:**
```json
{
  "token": "your-active-token"
}
```

### 4. Check Token Usage
```http
GET /usage
```
Returns the current usage statistics for the active token.

**Headers:**
- `x-api-key`: Your API token

**Response:**
```json
{
  "usage": 5,
  "limit": 10,
  "remaining": 5
}
```

### 5. Shorten URL
```http
POST /shorten
Content-Type: application/json
x-api-key: your-token-here
```

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "http://yourdomain.com/abc12345"
}
```

**Features:**
- URLs expire after 48 hours
- 8-character unique IDs (nanoid)
- URL validation and sanitization
- 10 requests per token per day

### 6. Redirect to Original URL
```http
GET /:id
```
Redirects to the original URL associated with the short ID.

**Example:**
```
GET /abc12345
→ Redirects to https://example.com/very/long/url
```

**Response:**
- `302 Found`: Redirect to original URL
- `404 Not Found`: Short link doesn't exist or has expired

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project uses Jest with ES Module support and Supertest for API testing.

## 📦 Project Structure

```
ShortLink/
├── app.js                 # Main application entry point
├── routes/
│   ├── index.js          # Route aggregator
│   ├── token/            # Token management routes
│   │   ├── generate.js   # Generate new token
│   │   ├── getKey.js     # Get active token
│   │   └── usage.js      # Check token usage
│   └── urls/             # URL shortening routes
│       ├── shorten.js    # Create short URL
│       └── redirect.js   # Redirect handler
├── middleware/
│   ├── device.js         # Device cookie management
│   ├── rateLimit.js      # Rate limiting logic
│   └── validateUrl.js    # URL validation
├── services/
│   └── redisClient.js    # Redis connection
├── utils/
│   ├── logger.js         # Winston logger
│   └── dateKey.js        # Date key generation
├── test/
│   └── app.test.js       # API tests
├── terraform/            # AWS infrastructure
├── nginx/                # Nginx configuration
├── Dockerfile            # Container image
├── docker-compose.yml    # Multi-container setup
└── package.json          # Dependencies
```

## 🏗️ Production Deployment

### AWS (with Terraform)

The repository includes Terraform configurations for AWS deployment:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Infrastructure includes:
- Application Load Balancer (ALB)
- Auto Scaling Group (ASG)
- Route53 DNS configuration
- ACM SSL certificates
- ElastiCache for Redis

## 🔒 Rate Limiting

ShortLink implements multiple layers of rate limiting:

1. **IP-based Global Limit**: 100 requests per 15 minutes per IP
2. **Token Generation Limits**:
   - 5 tokens per device per day
   - 100 tokens per IP per day
   - 5 tokens per IP per 2 minutes (burst protection)
3. **URL Shortening Limit**: 10 URLs per token per day

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Fajlur R Chowdhury

## 👤 Author

**Fajlur**
- Email: fajlur939@proton.me
- GitHub: [@fajlur79](https://github.com/fajlur79)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/fajlur79/ShortLink/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with Express.js and Redis
- ID generation powered by nanoid
- Rate limiting by express-rate-limit
- Logging by Winston