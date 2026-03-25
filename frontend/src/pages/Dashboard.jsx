import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { Button } from '../components/ui';
import { 
  FolderKanban, 
  CheckSquare, 
  Target, 
  Users, 
  TrendingUp,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getAnalytics();
      setAnalytics(response.analytics);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <Button 
          onClick={loadAnalytics} 
          className="mt-2"
          variant="outline"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  const { overview, tasksByPriority, tasksByStatus, recentActivities, projectProgress } = analytics;

  const statCards = [
    {
      title: 'Total Projects',
      value: overview.totalProjects,
      icon: FolderKanban,
      color: 'bg-blue-500',
      change: overview.activeProjects,
      changeLabel: 'Active'
    },
    {
      title: 'Total Tasks',
      value: overview.totalTasks,
      icon: CheckSquare,
      color: 'bg-green-500',
      change: overview.doneTasks,
      changeLabel: 'Completed'
    },
    {
      title: 'Active Sprints',
      value: overview.activeSprints,
      icon: Target,
      color: 'bg-purple-500',
      change: overview.completedSprints,
      changeLabel: 'Completed'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((overview.doneTasks / overview.totalTasks) * 100) || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+12%',
      changeLabel: 'This month'
    }
  ];

  const priorityColors = {
    HIGH: 'bg-red-100 text-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link to="/projects">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="text-gray-500 ml-1">{stat.changeLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
          <div className="space-y-3">
            {Object.entries(tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status === 'DONE' ? 'bg-green-500' :
                    status === 'IN_PROGRESS' ? 'bg-blue-500' :
                    status === 'REVIEW' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-900 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Priority Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Priority</h3>
          <div className="space-y-3">
            {Object.entries(tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    priority === 'HIGH' ? 'bg-red-500' :
                    priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{priority}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[priority]}`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent activities
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.projectName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[activity.priority]}`}>
                    {activity.priority}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {projectProgress.slice(0, 5).map((project) => (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-2">
                  <Link 
                    to={`/projects/${project.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {project.name}
                  </Link>
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {project.completedTasks} of {project.totalTasks} tasks
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
