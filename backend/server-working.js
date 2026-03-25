import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Working server is running',
    port: PORT
  });
});

// Simple projects endpoint for testing
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    message: 'Projects endpoint working',
    data: []
  });
});

// POST /api/projects - Create a new project
app.post('/api/projects', (req, res) => {
  try {
    const { name, description, features } = req.body;
    
    console.log('📝 Creating project:', { name, description, features });
    
    // Simple validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Project name is required"
      });
    }
    
    // Mock project creation
    const newProject = {
      id: String(Date.now()),
      name,
      description: description || '',
      features: features || [],
      status: 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Project created:', newProject);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Project creation failed'
    });
  }
});

// Add auth routes with simple controllers
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('📝 Registration request:', { name, email });
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and password are required"
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: '1',
      name,
      email,
      role: 'MEMBER',
      createdAt: new Date().toISOString()
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login request:', { email });
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required"
    });
  }
  
  // Mock successful login
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: '1',
      name: 'Demo User',
      email,
      role: 'MEMBER'
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: '1',
      name: 'Demo User',
      email: 'demo@kanban.com',
      role: 'MEMBER',
      createdAt: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Working Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Frontend: http://localhost:5173`);
  console.log(`🔗 Backend: http://localhost:${PORT}`);
  console.log(`✅ Ready for frontend connections`);
});
