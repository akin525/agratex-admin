# Complete Setup Guide for Agartex Admin Frontend

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm (comes with Node.js)
- ✅ Backend API running (Laravel)
- ✅ Admin credentials for login

## Step-by-Step Setup

### Step 1: Extract/Clone the Project

If you received a zip file:
```bash
unzip admin-frontend.zip
cd admin-frontend
```

Or if using git:
```bash
git clone <repository-url>
cd admin-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router DOM
- Axios
- Tailwind CSS v3.4
- Lucide React (icons)
- And other dependencies

**Expected output:**
```
added 316 packages in 10s
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Important:** Replace `http://localhost:8000` with your actual backend URL.

Examples:
- Local development: `http://localhost:8000/api`
- Production: `https://api.yourdomain.com/api`
- Custom port: `http://localhost:3000/api`

### Step 4: Verify Backend Configuration

Ensure your Laravel backend has proper CORS configuration.

Edit `config/cors.php`:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // Alternative port
        'https://your-admin-domain.com',  // Production
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.2.2  ready in 177 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the login page.

### Step 7: Login

Use your admin credentials from the backend database:
- Email: Your admin email
- Password: Your admin password

**Note:** If you don't have admin credentials, create one in your Laravel backend:

```php
// In Laravel tinker or seeder
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

Admin::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'status' => 1,
]);
```

## Verification Checklist

After setup, verify everything works:

- [ ] Development server starts without errors
- [ ] Login page loads correctly
- [ ] Can login with admin credentials
- [ ] Dashboard displays data
- [ ] Navigation works
- [ ] All pages load without errors
- [ ] API calls are successful (check Network tab)

## Common Setup Issues

### Issue 1: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Port 5173 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- --port 3000
```

Or kill the process using port 5173:
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue 3: Tailwind CSS not working

**Solution:**
```bash
# Ensure correct Tailwind version
npm uninstall tailwindcss
npm install tailwindcss@^3.4.0 -D

# Restart dev server
npm run dev
```

### Issue 4: Cannot connect to backend

**Checklist:**
1. ✅ Backend server is running
2. ✅ VITE_API_BASE_URL is correct in .env
3. ✅ CORS is configured on backend
4. ✅ No firewall blocking the connection

**Test backend connection:**
```bash
curl http://localhost:8000/api/sc/dashboard
```

### Issue 5: Login fails

**Possible causes:**
1. Wrong credentials
2. Admin status is not active (status = 1)
3. Backend authentication not working
4. CORS issues

**Debug steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the login request
5. Look at the response

## Project Structure Overview

```
admin-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout/      # Layout components
│   ├── context/         # React Context (Auth)
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── config/          # Configuration files
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── .env.example         # Example env file
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── README.md            # Documentation
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

## Environment Variables

All environment variables must start with `VITE_`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Add more as needed
# VITE_APP_NAME=Agartex Admin
# VITE_APP_VERSION=1.0.0
```

**Access in code:**
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Development Workflow

1. **Make changes** to your code
2. **Save the file** - Hot Module Replacement (HMR) will update automatically
3. **Check browser** - Changes should reflect immediately
4. **Check console** - Look for any errors

## Building for Production

### Step 1: Build the application
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Step 2: Test the production build
```bash
npm run preview
```

This serves the production build locally for testing.

### Step 3: Deploy
See `DEPLOYMENT.md` for detailed deployment instructions.

## IDE Setup (Optional)

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[&quot;'`]([^&quot;'`]*).*?[&quot;'`]"]
  ]
}
```

## Git Setup (Optional)

Create `.gitignore`:
```
# Dependencies
node_modules/

# Build output
dist/
dist-ssr/

# Environment variables
.env
.env.local
.env.production

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Cache
.cache/
.vite/
```

## Next Steps

After successful setup:

1. ✅ Explore the dashboard
2. ✅ Test all features
3. ✅ Customize as needed
4. ✅ Read FEATURES.md for feature details
5. ✅ Read DEPLOYMENT.md for deployment
6. ✅ Read TROUBLESHOOTING.md if issues arise

## Support

If you need help:
1. Check TROUBLESHOOTING.md
2. Review browser console for errors
3. Check backend logs
4. Verify all setup steps completed

## Quick Reference

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your API URL

# Run
npm run dev

# Build
npm run build

# Deploy
# See DEPLOYMENT.md
```

## Success Indicators

You'll know setup is successful when:
- ✅ No errors in terminal
- ✅ No errors in browser console
- ✅ Login page loads
- ✅ Can login successfully
- ✅ Dashboard shows data
- ✅ All navigation works

Congratulations! Your Agartex Admin Frontend is now set up and ready to use! 🎉