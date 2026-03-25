import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/protool_mern')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function setupDemoUser() {
  try {
    console.log('🏗 Setting up demo user for MERN application...');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@kanban.com' });
    
    if (existingUser) {
      console.log('✅ Demo user already exists');
      console.log('👤 Email: demo@kanban.com');
      console.log('🔑 Password: password123');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      name: 'Demo User',
      email: 'demo@kanban.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    await user.save();
    console.log('✅ Demo user created successfully');
    console.log('👤 Email: demo@kanban.com');
    console.log('🔑 Password: password123');
    console.log('🎯 You can now login with these credentials');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupDemoUser();
