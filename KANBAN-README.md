# 🎯 Jira-Style Kanban Board

A complete, production-ready Kanban board implementation similar to Jira's board view, built with React, Node.js, and PostgreSQL.

## 🚀 Features

### ✅ Core Functionality
- **3 Columns**: TODO, IN_PROGRESS, DONE
- **Drag & Drop**: Move tasks between columns seamlessly
- **Real-time Updates**: Status changes saved instantly to database
- **Task Management**: Create, edit, delete tasks
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🎨 Jira-Style UI
- Clean, modern interface
- Light gray background
- White card columns with shadows
- Rounded corners and smooth transitions
- Color-coded task statuses
- Hover effects and micro-interactions

### 🔧 Technical Features
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Smooth loading indicators
- **Form Validation**: Client and server-side validation
- **Security**: Rate limiting, CORS, input sanitization
- **Performance**: Optimized queries and efficient rendering

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## 🛠 Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install --save-dev prisma
npm install @prisma/client express cors helmet express-rate-limit dotenv

# Copy the Kanban schema
cp prisma/kanban-schema.prisma prisma/schema.prisma

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma db push

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install react react-dom axios @hello-pangea/dnd lucide-react

# Install dev dependencies
npm install --save-dev @vitejs/plugin-react vite tailwindcss autoprefixer postcss

# Set up environment variables
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm run dev
```

## 📁 File Structure

```
protool/
├── backend/
│   ├── prisma/
│   │   └── kanban-schema.prisma      # Database schema
│   ├── controllers/
│   │   └── kanbanController.js      # Business logic
│   ├── routes/
│   │   └── kanbanRoutes.js         # API routes
│   ├── kanban-server.js            # Express server
│   └── package-kanban.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/kanban/
│   │   │   ├── TaskCard.jsx       # Individual task component
│   │   │   ├── KanbanColumn.jsx   # Column component
│   │   │   └── TaskModal.jsx     # Create/edit modal
│   │   ├── services/
│   │   │   └── kanbanService.js   # API service
│   │   └── pages/
│   │       └── KanbanBoard.jsx   # Main board component
│   └── package-kanban.json        # Frontend dependencies
└── KANBAN-README.md              # This file
```

## 🗄️ Database Schema

### Project Model
```prisma
model Project {
  id        String   @id @default(uuid())
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

### Task Model
```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### Task Status Enum
```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

## 🔌 API Endpoints

### Tasks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:projectId` | Get all tasks for a project |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update task (status, title, description) |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/task/:id` | Get specific task by ID |

### Request/Response Examples

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the application",
  "projectId": "project-uuid-123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-456",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the application",
    "status": "TODO",
    "projectId": "project-uuid-123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Task created successfully"
}
```

#### Update Task Status
```bash
PUT /api/tasks/task-uuid-456
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

## 🎨 UI Components

### TaskCard Component
- Displays individual task information
- Drag and drop functionality
- Edit and delete actions
- Status-based styling
- Responsive design

### KanbanColumn Component
- Represents a single status column
- Droppable area for tasks
- Empty state handling
- Task count display
- Add task button

### TaskModal Component
- Create and edit task modal
- Form validation
- Loading states
- Error handling
- Responsive design

### KanbanBoard Component
- Main board component
- Drag and drop context
- State management
- Error boundaries
- Loading indicators

## 🎯 Usage Examples

### Adding a New Task
1. Click "Add Task" button or the "+" icon in any column
2. Fill in task title (required) and description (optional)
3. Click "Create Task"
4. Task appears in the TODO column

### Moving Tasks
1. Drag any task card by its title area
2. Drop it in a different column
3. Status updates automatically in the database
4. Visual feedback during the move

### Editing Tasks
1. Hover over a task card
2. Click the edit icon (pencil)
3. Modify title, description, or status
4. Click "Update Task"

### Deleting Tasks
1. Hover over a task card
2. Click the delete icon (trash)
3. Confirm deletion
4. Task is removed from the board

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:3000`

### Production Mode

1. **Build Frontend**:
```bash
cd frontend
npm run build
```

2. **Start Backend**:
```bash
cd backend
npm start
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Error Handling**: Sanitized error messages

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get tasks
curl http://localhost:5000/tasks/demo-project-123

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","projectId":"demo-project-123"}'
```

### Frontend Testing
Open browser developer tools and check:
- Network requests
- Console for errors
- Drag and drop functionality
- Responsive design

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify database exists

2. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Ensure frontend URL matches

3. **Drag and Drop Not Working**
   - Check @hello-pangea/dnd installation
   - Verify DragDropContext wrapper
   - Check browser console for errors

4. **Tasks Not Loading**
   - Check API URL in frontend .env
   - Verify backend is running
   - Check network tab for failed requests

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev

# Frontend
# Add to browser console
localStorage.setItem('debug', 'true')
```

## 📈 Performance Optimizations

- **Lazy Loading**: Components load as needed
- **Debounced Updates**: Prevent excessive API calls
- **Optimized Queries**: Efficient database queries
- **Caching**: Response caching where appropriate
- **Bundle Optimization**: Tree-shaking and minification

## 🔄 Next Steps

### Potential Enhancements
- [ ] Real-time updates with WebSockets
- [ ] Task assignments to users
- [ ] File attachments
- [ ] Task comments
- [ ] Search and filtering
- [ ] Multiple project support
- [ ] Task templates
- [ ] Time tracking
- [ ] Analytics dashboard

### Scaling Considerations
- [ ] Redis for session management
- [ ] Database connection pooling
- [ ] Load balancing
- [ ] CDN for static assets
- [ ] Microservices architecture

## 📄 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Create an issue with detailed information
4. Include steps to reproduce the problem

---

**🎉 You now have a complete, production-ready Jira-style Kanban board!**

The implementation includes all requested features:
- ✅ 3 columns (TODO, IN_PROGRESS, DONE)
- ✅ Drag & drop functionality
- ✅ Real-time database updates
- ✅ Jira-style UI design
- ✅ Complete CRUD operations
- ✅ Error handling and validation
- ✅ Production-ready code

Start building amazing project management workflows! 🚀
