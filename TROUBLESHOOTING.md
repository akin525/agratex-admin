# Troubleshooting Guide

## Common Issues and Solutions

### 1. Tailwind CSS PostCSS Error

**Error Message:**
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**Solution:**
```bash
# Uninstall the newer version and install Tailwind CSS v3.4
npm uninstall tailwindcss
npm install tailwindcss@^3.4.0 -D

# Restart the dev server
npm run dev
```

### 2. Module Not Found Errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. Port Already in Use

**Error Message:**
```
Port 5173 is already in use
```

**Solution:**
```bash
# Kill the process using the port
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### 4. API Connection Issues

**Symptoms:**
- Login fails
- Data not loading
- CORS errors

**Solutions:**

1. **Check .env file:**
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

2. **Verify backend is running:**
   ```bash
   # Check if backend is accessible
   curl http://localhost:8000/api/sc/dashboard
   ```

3. **Configure CORS on backend:**
   
   In Laravel `config/cors.php`:
   ```php
   'allowed_origins' => [
       'http://localhost:5173',
       'http://localhost:3000',
   ],
   'supports_credentials' => true,
   ```

4. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Storage
   - Refresh page

### 5. Build Errors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

### 6. Authentication Issues

**Symptoms:**
- Can't login
- Redirected to login after successful login
- Token expired errors

**Solutions:**

1. **Clear localStorage:**
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. **Check token in localStorage:**
   ```javascript
   // In browser console
   console.log(localStorage.getItem('admin_token'))
   ```

3. **Verify backend authentication:**
   - Check if admin user exists in database
   - Verify password is correct
   - Check if admin status is active

### 7. Styling Issues

**Symptoms:**
- No styles applied
- Tailwind classes not working

**Solutions:**

1. **Verify Tailwind is imported:**
   Check `src/index.css` has:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Check tailwind.config.js:**
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ],
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### 8. Routing Issues

**Symptoms:**
- 404 on page refresh
- Routes not working

**Solutions:**

1. **For development:** Should work automatically with Vite

2. **For production (Nginx):**
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

3. **For production (Apache):**
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### 9. Environment Variables Not Working

**Symptoms:**
- API calls going to wrong URL
- Environment variables undefined

**Solutions:**

1. **Restart dev server after changing .env:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Verify variable name starts with VITE_:**
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Access in code:**
   ```javascript
   import.meta.env.VITE_API_BASE_URL
   ```

### 10. Performance Issues

**Symptoms:**
- Slow page loads
- Laggy interface

**Solutions:**

1. **Enable production mode:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check network tab in DevTools:**
   - Look for slow API calls
   - Check for large bundle sizes

3. **Optimize images:**
   - Use appropriate formats (WebP)
   - Compress images
   - Use lazy loading

### 11. Browser Compatibility

**Issue:** Not working in older browsers

**Solution:**
- Use modern browsers (Chrome, Firefox, Safari, Edge latest versions)
- Check browser console for errors
- Update browser to latest version

### 12. Development Server Won't Start

**Solutions:**

1. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 13. TypeScript Errors (if using TypeScript)

**Solution:**
This project uses JavaScript, not TypeScript. If you see TypeScript errors:
- Make sure you're not accidentally using .ts/.tsx files
- Check that all files are .js/.jsx

### 14. Hot Module Replacement Not Working

**Symptoms:**
- Changes not reflecting automatically
- Need to refresh manually

**Solutions:**

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Check file watchers limit (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## Getting Help

If you're still experiencing issues:

1. **Check browser console** (F12) for error messages
2. **Check terminal** for build/server errors
3. **Review the README.md** for setup instructions
4. **Check the DEPLOYMENT.md** for deployment-specific issues
5. **Verify backend is running** and accessible

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm install
npm run dev

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Debug Mode

To enable verbose logging:

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Check for errors and warnings**
4. **Network tab** shows API calls and responses

## Contact Support

If none of these solutions work, please provide:
- Error message (full text)
- Browser and version
- Node.js version
- Steps to reproduce
- Screenshots if applicable