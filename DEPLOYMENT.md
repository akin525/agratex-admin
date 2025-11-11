# Deployment Guide for Agartex Admin Frontend

## Quick Start

The admin frontend is now running and accessible at:
**https://5173-fc0e80e5-463a-4cde-b034-1d0b0c331506.proxy.daytona.works**

## Local Development

To run the application locally:

```bash
cd admin-frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Configuration

Before deploying, update the `.env` file with your backend API URL:

```env
VITE_API_BASE_URL=http://your-backend-url/api
```

For the current backend (based on the uploaded files), the API base URL should be:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Or if your backend is deployed:
```env
VITE_API_BASE_URL=https://your-domain.com/api
```

## Production Build

### 1. Build the Application

```bash
cd admin-frontend
npm run build
```

This creates an optimized production build in the `dist` directory.

### 2. Preview Production Build

```bash
npm run preview
```

## Deployment Options

### Option 1: Static Hosting (Vercel, Netlify, etc.)

1. **Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Option 2: Traditional Web Server (Apache/Nginx)

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy the `dist` folder contents to your web server:
   ```bash
   scp -r dist/* user@server:/var/www/html/admin
   ```

3. **Nginx Configuration**:
   ```nginx
   server {
       listen 80;
       server_name admin.yourdomain.com;
       root /var/www/html/admin;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # API proxy (optional)
       location /api {
           proxy_pass http://your-backend-url;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Apache Configuration** (.htaccess):
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 3: Docker Deployment

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create `nginx.conf`:
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. Build and run:
   ```bash
   docker build -t agartex-admin .
   docker run -p 80:80 agartex-admin
   ```

### Option 4: Node.js Server

1. Install serve:
   ```bash
   npm install -g serve
   ```

2. Serve the build:
   ```bash
   serve -s dist -l 3000
   ```

## Backend Integration

### CORS Configuration

Ensure your Laravel backend has proper CORS configuration in `config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'https://your-admin-domain.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### API Routes

The admin routes are defined in `routes/admin.php` with the `/sc` prefix:
- Login: `POST /api/sc/login`
- Dashboard: `GET /api/sc/dashboard`
- Users: `GET /api/sc/users`
- etc.

## Environment Variables

### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **API Keys**: Never commit API keys to version control
3. **CORS**: Configure CORS properly on the backend
4. **Authentication**: Tokens are stored in localStorage
5. **CSP**: Consider implementing Content Security Policy headers

## Performance Optimization

1. **Code Splitting**: Already implemented via React Router
2. **Lazy Loading**: Consider lazy loading heavy components
3. **CDN**: Use a CDN for static assets
4. **Compression**: Enable gzip/brotli compression on the server
5. **Caching**: Configure proper cache headers

## Monitoring

Consider adding:
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (Web Vitals)

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues
- Check VITE_API_BASE_URL in .env
- Verify CORS configuration on backend
- Check network tab in browser DevTools

### Authentication Issues
- Clear localStorage
- Check token expiration
- Verify backend authentication middleware

## Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Version Control
```bash
git add .
git commit -m "Update admin frontend"
git push origin main
```

## Support

For issues or questions:
1. Check the README.md file
2. Review browser console for errors
3. Check backend API logs
4. Contact the development team

## Checklist Before Deployment

- [ ] Update .env with production API URL
- [ ] Test all features in production build
- [ ] Configure CORS on backend
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure web server (Nginx/Apache)
- [ ] Test authentication flow
- [ ] Verify all API endpoints work
- [ ] Set up monitoring and error tracking
- [ ] Create backup of current deployment
- [ ] Document any custom configurations