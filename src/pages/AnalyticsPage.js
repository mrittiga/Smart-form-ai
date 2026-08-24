import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Chart from '../components/Dashboard/Chart';
import StatsCard from '../components/Dashboard/StatsCard';
import Loading from '../components/Common/Loading';
import { useAnalytics } from '../store/useAnalytics';
import toast from 'react-hot-toast';
import '../styles/analytics.css';

/**
 * Analytics Page
 * Comprehensive analytics and insights
 */
const AnalyticsPage = () => {
  const { dashboard, fetchDashboard, loading } = useAnalytics();
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        await fetchDashboard();

        // Generate sample chart data
        const data = Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          submissions: Math.floor(Math.random() * 30) + 10,
          timeSaved: Math.floor(Math.random() * 150) + 50,
          completionRate: Math.floor(Math.random() * 30) + 70,
        }));

        setChartData(data);
      } catch (error) {
        toast.error('Failed to load analytics');
      }
    };

    loadAnalytics();
  }, [fetchDashboard, timeRange]);

  if (loading) {
    return <Loading fullScreen message="Loading analytics..." />;
  }

  return (
    <Layout
      title="Analytics"
      description="Track your form performance and insights"
    >
      <div className="analytics-container">
        {/* Time Range Selector */}
        <div className="analytics-header">
          <div className="analytics-time-range">
            {['today', '7days', '30days', '90days'].map(range => (
              <button
                key={range}
                className={`analytics-time-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range === 'today' && 'Today'}
                {range === '7days' && 'Last 7 Days'}
                {range === '30days' && 'Last 30 Days'}
                {range === '90days' && 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="analytics-metrics">
          <StatsCard
            title="Total Forms"
            value={dashboard?.forms_created || 0}
            icon={BarChart3}
            color="primary"
            trend="+2 this week"
            trendDirection="up"
          />
          <StatsCard
            title="Total Submissions"
            value={dashboard?.submissions_sent || 0}
            icon={Activity}
            color="success"
            trend="+8 this week"
            trendDirection="up"
          />
          <StatsCard
            title="Avg. Completion Time"
            value="2m 34s"
            unit=""
            icon={TrendingUp}
            color="warning"
            trend="-15 sec this week"
            trendDirection="down"
          />
          <StatsCard
            title="Completion Rate"
            value="82"
            unit="%"
            icon={PieChart}
            color="info"
            trend="+5% this week"
            trendDirection="up"
          />
        </div>

        {/* Charts */}
        <div className="analytics-charts">
          <Chart
            title="Weekly Submissions"
            subtitle="Number of form submissions over time"
            type="line"
            data={chartData}
            dataKey="submissions"
            color="#6366f1"
            height={350}
          />

          <Chart
            title="Time Saved"
            subtitle="Minutes saved by using Smart Form AI"
            type="bar"
            data={chartData}
            dataKey="timeSaved"
            color="#10b981"
            height={350}
          />

          <Chart
            title="Completion Rate"
            subtitle="Form completion percentage"
            type="bar"
            data={chartData}
            dataKey="completionRate"
            color="#f59e0b"
            height={350}
          />

          <Chart
            title="Form Distribution"
            subtitle="By status"
            type="pie"
            data={[
              { name: 'Active', value: dashboard?.active_forms || 0 },
              { name: 'Draft', value: 3 },
              { name: 'Archived', value: 2 },
            ]}
            dataKey="value"
            height={350}
          />
        </div>

        {/* Detailed Metrics */}
        <Card title="Detailed Metrics" className="analytics-detailed">
          <div className="analytics-metrics-grid">
            <div className="analytics-metric">
              <span className="analytics-metric-label">Avg Form Fields</span>
              <span className="analytics-metric-value">5.2</span>
            </div>
            <div className="analytics-metric">
              <span className="analytics-metric-label">Avg Form Size</span>
              <span className="analytics-metric-value">2.3 KB</span>
            </div>
            <div className="analytics-metric">
              <span className="analytics-metric-label">Total Time Saved</span>
              <span className="analytics-metric-value">
                {dashboard?.time_saved_minutes || 0} min
              </span>
            </div>
            <div className="analytics-metric">
              <span className="analytics-metric-label">AI Suggestions Used</span>
              <span className="analytics-metric-value">
                {dashboard?.ai_suggestions_used || 0}
              </span>
            </div>
            <div className="analytics-metric">
              <span className="analytics-metric-label">Voice Inputs</span>
              <span className="analytics-metric-value">24</span>
            </div>
            <div className="analytics-metric">
              <span className="analytics-metric-label">Peak Time</span>
              <span className="analytics-metric-value">3:00 PM</span>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card title="📊 Insights" subtitle="Recommendations based on your data">
          <div className="analytics-insights">
            <div className="analytics-insight">
              <div className="analytics-insight-icon">💡</div>
              <div>
                <h4>Forms with highest completion</h4>
                <p>Your signup forms have a 92% completion rate. Consider using similar structure for other forms.</p>
              </div>
            </div>

            <div className="analytics-insight">
              <div className="analytics-insight-icon">⚡</div>
              <div>
                <h4>Optimize long forms</h4>
                <p>Forms with more than 10 fields have 45% lower completion rate. Try breaking them into steps.</p>
              </div>
            </div>

            <div className="analytics-insight">
              <div className="analytics-insight-icon">🎯</div>
              <div>
                <h4>Peak activity time</h4>
                <p>Most submissions occur between 3-5 PM. Schedule important forms during these hours.</p>
              </div>
            </div>

            <div className="analytics-insight">
              <div className="analytics-insight-icon">🤖</div>
              <div>
                <h4>AI suggestions impact</h4>
                <p>Forms with AI suggestions see 34% faster completion. Enable suggestions for more forms.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
