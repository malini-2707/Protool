// Setup script to create a demo project
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupProject() {
  try {
    console.log('🏗 Setting up demo project...');

    // Create demo project
    const project = await prisma.project.create({
      data: {
        id: 'demo-project-123',
        name: 'Demo Kanban Project'
      }
    });

    console.log('✅ Project created:', project);

    // Create some sample tasks
    const sampleTasks = [
      {
        id: 'task-1',
        title: 'Design the user interface',
        description: 'Create mockups and wireframes for the Kanban board',
        status: 'DONE',
        projectId: project.id
      },
      {
        id: 'task-2',
        title: 'Implement drag and drop',
        description: 'Add @hello-pangea/dnd library for task movement',
        status: 'DONE',
        projectId: project.id
      },
      {
        id: 'task-3',
        title: 'Set up database schema',
        description: 'Create Prisma schema with Project and Task models',
        status: 'DONE',
        projectId: project.id
      },
      {
        id: 'task-4',
        title: 'Build REST API endpoints',
        description: 'Create CRUD operations for tasks',
        status: 'IN_PROGRESS',
        projectId: project.id
      },
      {
        id: 'task-5',
        title: 'Add error handling',
        description: 'Implement comprehensive error handling and validation',
        status: 'TODO',
        projectId: project.id
      },
      {
        id: 'task-6',
        title: 'Write documentation',
        description: 'Create README and API documentation',
        status: 'TODO',
        projectId: project.id
      }
    ];

    for (const taskData of sampleTasks) {
      const task = await prisma.task.create({
        data: taskData
      });
      console.log(`✅ Created task: ${task.title} (${task.status})`);
    }

    console.log('\n🎉 Demo project setup complete!');
    console.log('📊 Project ID: demo-project-123');
    console.log('📝 Tasks created:', sampleTasks.length);
    console.log('\n🚀 You can now test the API and view the Kanban board!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProject();
