# DeSo Secure Messenger - Setup Guide

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v5.0 or higher
- **Git**: Latest version

### Development Tools (Recommended)
- **VSCode** with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - MongoDB for VS Code

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/deso-secure-messenger.git
cd deso-secure-messenger
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables (see Configuration section)
# Generate strong JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod --dbpath /path/to/your/db

# Create database (optional - will be created automatically)
mongosh
use deso-messenger
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## ⚙️ Configuration

### Backend Environment Variables (.env)

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database - Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/deso-messenger

# Security - GENERATE NEW SECRET FOR PRODUCTION
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# DeSo Configuration
DESO_NODE_URL=https://node.deso.org

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
MESSAGE_RATE_LIMIT_WINDOW_MS=60000
MESSAGE_RATE_LIMIT_MAX=30
```

### Frontend Environment Variables (.env)

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_WS_URL=http://localhost:3001

# DeSo Configuration
REACT_APP_DESO_NODE_URL=https://node.deso.org
REACT_APP_DESO_APP_NAME=DeSo Secure Messenger

# Security Settings
REACT_APP_ENCRYPTION_ENABLED=true

# Feature Flags
REACT_APP_ENABLE_FILE_SHARING=true
```

## 🔧 Development Setup

### Code Quality Tools

```bash
# Backend
cd backend
npm run lint      # ESLint checking
npm run build     # TypeScript compilation
npm test          # Run tests

# Frontend  
cd frontend
npm run lint      # ESLint checking
npm run format    # Prettier formatting
npm test          # Run tests
```

### Database Seeding (Optional)

```bash
cd backend
npm run seed      # Seed database with test data
```

## 🏭 Production Deployment

### Security Checklist

- [ ] **Strong JWT Secret**: Generate cryptographically random secret
- [ ] **Database Security**: Enable authentication and encryption
- [ ] **HTTPS**: Configure TLS certificates
- [ ] **Environment Variables**: Use secure secret management
- [ ] **Dependencies**: Update to latest stable versions
- [ ] **Security Audit**: Run security scans

### Environment Setup

#### Backend Production
```bash
# Build application
npm run build

# Start production server
npm start
```

#### Frontend Production
```bash
# Build for production
npm run build

# Serve static files (use nginx/apache in production)
npx serve -s build
```

### Docker Deployment (Optional)

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🔐 Security Configuration

### Generate Secure JWT Secret
```bash
# Generate 256-bit random secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Security
```javascript
// Enable authentication
db.createUser({
  user: "messenger_user",
  pwd: "strong_password_here",
  roles: ["readWrite"]
});
```

### HTTPS Setup
```nginx
# nginx configuration
server {
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

## 🧪 Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests
```bash
# Full application test
npm run test:e2e
```

### Security Tests
```bash
# Security audit
npm run security-audit

# Dependency vulnerability check
npm audit
```

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Check MongoDB status
systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh $MONGODB_URI
```

#### DeSo Identity Not Working
- Check browser console for CORS errors
- Verify DeSo Identity script loading
- Ensure HTTPS in production

#### WebSocket Connection Issues
```bash
# Check firewall settings
# Verify CORS configuration
# Check WebSocket URL in frontend
```

### Debug Mode

#### Backend Debug
```bash
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
REACT_APP_DEBUG_MODE=true npm start
```

## 📊 Monitoring

### Application Monitoring
- Health check endpoint: `/health`
- Application logs in console
- MongoDB logs for database issues

### Performance Monitoring
```bash
# Monitor backend performance
npm run monitor

# Frontend bundle analysis
npm run analyze
```

## 🔄 Updates

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Security updates
npm audit fix
```

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run database migrations (if any)
npm run migrate

# Restart services
pm2 restart all
```

## 💡 Tips

### Development Tips
- Use browser dev tools for debugging encryption
- Monitor network tab for API calls
- Check console for DeSo Identity logs
- Use MongoDB Compass for database inspection

### Performance Tips
- Enable MongoDB indexes
- Use CDN for static assets
- Implement caching strategies
- Monitor bundle size

### Security Tips
- Regularly audit dependencies
- Use Content Security Policy
- Implement rate limiting
- Monitor for suspicious activity

## 📚 Additional Resources

- [DeSo Documentation](https://docs.deso.org/)
- [React Documentation](https://reactjs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🆘 Support

### Getting Help
1. Check this setup guide
2. Review [SECURITY.md](./SECURITY.md) for security questions
3. Search existing GitHub issues
4. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Error messages
   - Expected vs actual behavior

---

**Happy coding! 🚀 Remember to prioritize security in every step.**
