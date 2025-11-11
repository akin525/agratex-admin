# Agartex Admin Frontend

A modern, responsive admin dashboard built with React and Vite for managing the Agartex platform.

## Features

- 🔐 **Authentication System** - Secure login with JWT token management
- 📊 **Dashboard Overview** - Real-time statistics and metrics
- 👥 **User Management** - View, search, and manage users
- 📦 **Plans Management** - Monitor investment plans
- 💰 **Investments Tracking** - Track all investment activities
- 🪙 **Staking Management** - Comprehensive staking dashboard
- 📢 **Bot Cast** - Send messages to users via Telegram
- 🎯 **Referral Configuration** - Manage referral commission levels
- ⚙️ **Settings** - View system configuration

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ and npm
- Backend API running (Laravel)

## Installation

1. Clone the repository or extract the files

2. Install dependencies:
```bash
cd admin-frontend
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://your-backend-url/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── UserDetails.jsx
│   │   ├── Plans.jsx
│   │   ├── Investments.jsx
│   │   ├── Staking.jsx
│   │   ├── BotCast.jsx
│   │   ├── Referrals.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── axios.js
│   ├── config/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## API Endpoints

The application connects to the following backend endpoints:

### Authentication
- `POST /sc/login` - Admin login
- `POST /sc/change-password` - Change password

### Dashboard
- `GET /sc/dashboard` - Dashboard statistics
- `GET /sc/settings` - System settings

### Users
- `GET /sc/users` - List all users (paginated)
- `GET /sc/user-details/{id}` - User details
- `GET /sc/user-status-update/{id}/{status}` - Update user status

### Plans
- `GET /sc/plans` - List all plans

### Investments
- `GET /sc/investments/{status}` - List investments by status

### Staking
- `GET /sc/staking/dashboard` - Staking dashboard
- `GET /sc/staking/stakes` - List all stakes

### Bot Cast
- `POST /sc/bot-cast` - Send message to users

### Referrals
- `GET /sc/referral-config` - Get referral configuration
- `POST /sc/update-referral-config` - Update referral configuration

## Default Login

Use the admin credentials from your backend database to login.

## Features Overview

### Dashboard
- Total users count
- Active users count
- Total bids and asks
- Success rates
- Financial summaries

### User Management
- Search users by name, email, or username
- View user details
- Update user status (active, inactive, blocked)
- Pagination support

### Plans Management
- View all investment plans
- Plan details including duration, amount, and returns

### Investments
- Filter by status (all, running, completed, cancelled, pending)
- View investment details
- Track expected profits and returns

### Staking
- Dashboard with key metrics
- View all stakes
- Monitor staking activities

### Bot Cast
- Send messages to all users or specific user
- Telegram integration
- Message formatting support

### Referrals
- Configure commission levels
- Multiple commission types
- Dynamic level management

### Settings
- View system configuration
- System status indicators
- Trading hours information

## Customization

### Styling
The application uses Tailwind CSS. You can customize the theme in `tailwind.config.js`.

### API Configuration
Update API endpoints in `src/config/api.js`.

### Authentication
Modify authentication logic in `src/context/AuthContext.jsx`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend API has proper CORS configuration:
- Allow origin: Your frontend URL
- Allow credentials: true
- Allow headers: Authorization, Content-Type

### Authentication Issues
- Check if the API base URL is correct in `.env`
- Verify the backend is running
- Check browser console for error messages

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## License

This project is part of the Agartex platform.

## Support

For support, please contact the development team.