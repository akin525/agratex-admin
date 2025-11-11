# Quick Reference Card

## 🚀 Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
```

## 🔧 Configuration

### .env File
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend CORS (Laravel)
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing |
| `src/context/AuthContext.jsx` | Authentication logic |
| `src/config/api.js` | API endpoints |
| `src/services/axios.js` | HTTP client setup |
| `.env` | Environment variables |

## 🌐 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | Login page |
| `/dashboard` | Dashboard | Main dashboard |
| `/users` | Users | User management |
| `/users/:id` | UserDetails | User details |
| `/plans` | Plans | Investment plans |
| `/investments` | Investments | Investment tracking |
| `/staking` | Staking | Staking management |
| `/bot-cast` | BotCast | Telegram messaging |
| `/referrals` | Referrals | Referral config |
| `/settings` | Settings | System settings |

## 🔌 API Endpoints

### Authentication
```
POST /api/sc/login
POST /api/sc/change-password
```

### Dashboard
```
GET /api/sc/dashboard
GET /api/sc/settings
```

### Users
```
GET /api/sc/users
GET /api/sc/user-details/{id}
GET /api/sc/user-status-update/{id}/{status}
```

### Plans & Investments
```
GET /api/sc/plans
GET /api/sc/investments/{status}
GET /api/sc/investment-details/{id}
```

### Staking
```
GET /api/sc/staking/dashboard
GET /api/sc/staking/stakes
```

### Communication
```
POST /api/sc/bot-cast
```

### Configuration
```
GET /api/sc/referral-config
POST /api/sc/update-referral-config
```

## 🐛 Quick Fixes

### Tailwind Not Working
```bash
npm uninstall tailwindcss
npm install tailwindcss@^3.4.0 -D
npm run dev
```

### Port Already in Use
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Clear Everything
```bash
rm -rf node_modules package-lock.json dist .vite
npm install
npm run dev
```

### API Not Connecting
1. Check `.env` file
2. Verify backend is running
3. Check CORS configuration
4. Clear browser cache

### Login Not Working
1. Clear localStorage: `localStorage.clear()`
2. Check admin credentials
3. Verify admin status = 1
4. Check browser console

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "latest",
  "tailwindcss": "^3.4.0"
}
```

## 🎨 Tailwind Classes

### Common Patterns
```jsx
// Card
<div className="bg-white rounded-xl shadow-sm p-6">

// Button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">

// Badge
<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

## 🔐 Authentication Flow

```javascript
// Login
const { login } = useAuth();
await login(email, password);

// Logout
const { logout } = useAuth();
logout();

// Check auth
const { isAuthenticated } = useAuth();
if (isAuthenticated) { /* ... */ }

// Get user
const { user } = useAuth();
console.log(user.name);
```

## 📊 Data Fetching Pattern

```javascript
import axios from '../services/axios';
import { API_ENDPOINTS } from '../config/api';

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

## 🎯 Status Badges

```javascript
const getStatusBadge = (status) => {
  const badges = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-red-100 text-red-800',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};
```

## 📱 Responsive Design

```jsx
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Hide on mobile
<div className="hidden md:block">

// Show only on mobile
<div className="block md:hidden">
```

## 🔍 Debug Tips

```javascript
// Check environment variables
console.log(import.meta.env.VITE_API_BASE_URL);

// Check auth token
console.log(localStorage.getItem('admin_token'));

// Check user data
console.log(localStorage.getItem('admin_user'));

// Clear storage
localStorage.clear();
```

## 📝 Common Tasks

### Add New Page
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation in `src/components/Layout/Sidebar.jsx`

### Add New API Endpoint
1. Add to `src/config/api.js`
2. Use in component with axios

### Update Styling
1. Use Tailwind classes
2. Or add to `src/index.css`

## 🚀 Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Configure CORS on backend
- [ ] Set up HTTPS/SSL
- [ ] Deploy `dist` folder
- [ ] Test all features in production

## 📞 Support

| Issue | Solution |
|-------|----------|
| Setup issues | Check SETUP.md |
| Deployment issues | Check DEPLOYMENT.md |
| Feature questions | Check FEATURES.md |
| Bugs/errors | Check TROUBLESHOOTING.md |

## 🔗 Useful Links

- **Live Demo**: https://5173-fc0e80e5-463a-4cde-b034-1d0b0c331506.proxy.daytona.works
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com

## 💡 Pro Tips

1. Always restart dev server after changing `.env`
2. Use browser DevTools Network tab to debug API calls
3. Check browser console for errors
4. Clear localStorage if authentication issues
5. Use `npm run preview` to test production build locally

---

**Keep this card handy for quick reference!** 📌