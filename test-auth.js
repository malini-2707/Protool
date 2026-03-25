// Test authentication endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Endpoints...\n');

    // Test registration
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'MEMBER'
    });
    
    if (registerResponse.data.success) {
      console.log('✅ Registration successful:', registerResponse.data.user.name);
      console.log('📝 Token received:', registerResponse.data.token ? 'YES' : 'NO');
    } else {
      console.log('❌ Registration failed:', registerResponse.data.error);
    }

    // Test login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'demo@kanban.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful:', loginResponse.data.user.name);
      console.log('📝 Token received:', loginResponse.data.token ? 'YES' : 'NO');
      
      // Test protected route with token
      if (loginResponse.data.token) {
        console.log('\n3. Testing protected route with token...');
        const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`
          }
        });
        
        if (profileResponse.data.success) {
          console.log('✅ Profile access successful:', profileResponse.data.user.name);
        } else {
          console.log('❌ Profile access failed:', profileResponse.data.error);
        }
      }
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
    }

    console.log('\n🎉 Authentication tests completed!');
    console.log('👤 Demo credentials: demo@kanban.com / password123');
    console.log('📱 Frontend should now be able to login with these credentials');

  } catch (error) {
    console.error('❌ Auth test failed:', error.response?.data || error.message);
  }
}

testAuth();
