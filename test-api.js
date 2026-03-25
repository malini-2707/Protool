// Simple API test script
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const PROJECT_ID = 'demo-project-123';

async function testAPI() {
  try {
    console.log('🧪 Testing Kanban Board API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test creating a task
    console.log('\n2. Creating a test task...');
    const createResponse = await axios.post(`${API_BASE}/tasks`, {
      title: 'Sample Kanban Task',
      description: 'This is a test task created via API',
      projectId: PROJECT_ID
    });
    console.log('✅ Task created:', createResponse.data);
    const taskId = createResponse.data.data.id;

    // Test getting tasks
    console.log('\n3. Fetching all tasks...');
    const getResponse = await axios.get(`${API_BASE}/tasks/${PROJECT_ID}`);
    console.log('✅ Tasks fetched:', getResponse.data.data.length, 'tasks');

    // Test updating task status
    console.log('\n4. Updating task status to IN_PROGRESS...');
    const updateResponse = await axios.put(`${API_BASE}/tasks/${taskId}`, {
      status: 'IN_PROGRESS'
    });
    console.log('✅ Task updated:', updateResponse.data);

    // Test getting single task
    console.log('\n5. Fetching single task...');
    const singleTaskResponse = await axios.get(`${API_BASE}/tasks/task/${taskId}`);
    console.log('✅ Single task:', singleTaskResponse.data);

    console.log('\n🎉 All API tests passed! Your Kanban board is ready!');
    console.log('\n📱 Open http://localhost:3000 to see the frontend');
    console.log('🌐 Open d:\\protool\\kanban-test.html to test the HTML version');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPI();
