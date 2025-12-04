# Kitchen Activity Management - Frontend

A modern React frontend application for managing kitchen-related data with Bootstrap styling.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - Styling framework

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:4000`

## 🛠️ Setup Instructions

### 1. Install dependencies

```bash
cd kitchen-frontend
npm install
```

### 2. Configure API URL (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000/api
```

If not set, it defaults to `http://localhost:4000/api`

### 3. Start development server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Build for production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📁 Project Structure

```
kitchen-frontend/
├── src/
│   ├── components/
│   │   ├── shared/          # Reusable components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Modal.tsx
│   │   ├── Levels/          # Level components
│   │   │   ├── LevelsList.tsx
│   │   │   └── LevelForm.tsx
│   │   ├── Categories/      # Category components
│   │   ├── Admins/          # Admin components
│   │   ├── Items/           # Kitchen Item components
│   │   └── Layout/          # Layout components
│   │       ├── Navbar.tsx
│   │       └── Layout.tsx
│   ├── pages/
│   │   └── Dashboard.tsx    # Dashboard page
│   ├── services/            # API services
│   │   ├── api.ts
│   │   ├── levelService.ts
│   │   ├── categoryService.ts
│   │   ├── adminService.ts
│   │   └── itemService.ts
│   ├── config/
│   │   └── api.ts           # API configuration
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Features

✅ **Full CRUD Operations**
- Create, Read, Update, Delete for all entities
- Modal-based forms for create/edit

✅ **Search & Pagination**
- Real-time search functionality
- Paginated tables with navigation

✅ **Responsive Design**
- Mobile-friendly Bootstrap layout
- Works on all screen sizes

✅ **Modern UI**
- Clean and professional design
- Bootstrap 5 components
- Gradient headers and cards

✅ **Type Safety**
- Full TypeScript support
- Type-safe API calls

## 📡 API Integration

The frontend connects to the backend API endpoints:

- `GET /api/levels` - Get all levels
- `POST /api/levels` - Create level
- `PUT /api/levels/:id` - Update level
- `DELETE /api/levels/:id` - Delete level

Similar endpoints for categories, admins, and items.

## 🎨 UI Components

### Dashboard
- Overview statistics
- Quick navigation cards
- Getting started guide

### Entity Management Pages
- Search bar
- Data table with actions
- Pagination controls
- Create/Edit modals

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure

- **Services**: Handle all API communication
- **Components**: Reusable UI components
- **Pages**: Full page components
- **Layout**: App-wide layout components

## 📝 Notes

- Make sure the backend API is running before starting the frontend
- The app uses React Router for navigation
- Bootstrap modals are used for forms
- All API calls are handled through Axios with interceptors

## 🐛 Troubleshooting

**API Connection Issues:**
- Check if backend is running on port 4000
- Verify CORS settings in backend
- Check browser console for errors

**Build Issues:**
- Clear node_modules and reinstall
- Check Node.js version (v16+)

## 📄 License

ISC

