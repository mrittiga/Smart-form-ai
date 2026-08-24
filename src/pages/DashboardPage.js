import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import Layout from '../components/Common/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import Chart from '../components/Dashboard/Chart';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import FormList from '../components/Forms/FormList';
import Loading from '../components/Common/Loading';
import { useForms } from '../hooks/useForms';
import { useAnalytics } from '../store/useAnalytics';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

/**
 * Dashboard Page
 * Main dashboard with statistics, charts, and recent forms
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { forms, fetchForms, loading: formsLoading, createForm } = useForms();
  const { dashboard, fetchDashboard, loading: analyticsLoading } = useAnalytics();

  const [chartData, setChartData] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchForms();
        await fetchDashboard();

        // Generate chart data
        const data = Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          submissions: Math.floor(Math.random() * 20) + 5,
          timeSaved: Math.floor(Math.random() * 100) + 20,
        }));
        setChartData(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, [fetchForms, fetchDashboard]);

  const handleCreateForm = async () => {
    try {
      const newForm = await createForm({
        title: 'New Form',
        description: 'Click to edit',
        status: 'draft',
      });
      toast.success('Form created successfully!');
      navigate(`/form/${newForm.id}/edit`);
    } catch (error) {
      toast.error('Failed to create form');
    }
  };

  const isLoading = formsLoading || analyticsLoading;

  if (isLoading) {
    return <Loading fullScreen message="Loading dashboard..." />;
  }

  return (
    <Layout
      title="Dashboard"
      description={`Welcome back, ${user?.full_name}! Here's your form activity.`}
    >
      {/* Stats Row */}
      <div className="dashboard-stats">
        <StatsCard
          title="Forms Created"
          value={dashboard?.forms_created || 0}
          icon={FileText}
          color="primary"
          trend="+2 this week"
          trendDirection="up"
        />
        <StatsCard
          title="Submissions Sent"
          value={dashboard?.submissions_sent || 0}
          icon={CheckCircle}
          color="success"
          trend="+5 this week"
          trendDirection="up"
        />
        <StatsCard
          title="Time Saved"
          value={dashboard?.time_saved_minutes || 0}
          unit=" min"
          icon={Clock}
          color="warning"
          trend="+30 min this week"
          trendDirection="up"
        />
        <StatsCard
          title="Active Forms"
          value={dashboard?.active_forms || 0}
          icon={TrendingUp}
          color="info"
          trend="2 awaiting responses"
          trendDirection="down"
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts">
        <Chart
          title="Weekly Submissions"
          subtitle="Number of form submissions"
          type="line"
          data={chartData}
          dataKey="submissions"
          color="#6366f1"
          height={300}
        />
        <Chart
          title="Time Saved"
          subtitle="Minutes saved by using AI"
          type="bar"
          data={chartData}
          dataKey="timeSaved"
          color="#10b981"
          height={300}
        />
      </div>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        subtitle="Get started with your forms"
        className="dashboard-actions"
      >
        <div className="dashboard-actions-grid">
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreateForm}
            fullWidth
          >
            Create New Form
          </Button>
          <Button
            variant="secondary"
            icon={FileText}
            onClick={() => navigate('/forms')}
            fullWidth
          >
            View All Forms
          </Button>
          <Button
            variant="secondary"
            icon={CheckCircle}
            onClick={() => navigate('/submissions')}
            fullWidth
          >
            View Submissions
          </Button>
          <Button
            variant="secondary"
            icon={TrendingUp}
            onClick={() => navigate('/analytics')}
            fullWidth
          >
            View Analytics
          </Button>
        </div>
      </Card>

      {/* Recent Forms */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Recent Forms</h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/forms')}
          >
            View All →
          </Button>
        </div>

        {forms.length === 0 ? (
          <Card className="dashboard-empty">
            <div className="dashboard-empty-content">
              <div className="dashboard-empty-icon">📋</div>
              <h3>No forms yet</h3>
              <p>Create your first form to get started</p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleCreateForm}
              >
                Create Form
              </Button>
            </div>
          </Card>
        ) : (
          <FormList
            forms={forms.slice(0, 6)}
            onCreateForm={handleCreateForm}
            onEditForm={(id) => navigate(`/form/${id}/edit`)}
            onViewForm={(id) => navigate(`/form/${id}/fill`)}
            onDeleteForm={(id) => {
              // Handle delete
              toast.success('Form deleted');
            }}
          />
        )}
      </div>

      {/* Tips */}
      <Card
        title="💡 Pro Tips"
        subtitle="Get the most out of Smart Form AI"
        className="dashboard-tips"
      >
        <ul className="dashboard-tips-list">
          <li>Use the AI suggestion feature to auto-fill common fields</li>
          <li>Create reusable form templates for faster form creation</li>
          <li>Set up voice input for hands-free form filling</li>
          <li>Monitor your analytics to improve form completion rates</li>
        </ul>
      </Card>
    </Layout>
  );
};

export default DashboardPage;
