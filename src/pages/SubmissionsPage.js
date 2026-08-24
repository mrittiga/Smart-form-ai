import React, { useEffect, useState } from 'react';
import { Eye, Trash2, Download, Filter } from 'lucide-react';
import Layout from '../components/Common/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import { useSubmissions } from '../store/useSubmissions';
import { formatDate, formatDateRelative } from '../utils/formatters';
import toast from 'react-hot-toast';
import '../styles/submissions.css';

/**
 * Submissions Page
 * View and manage all form submissions
 */
const SubmissionsPage = () => {
  const { submissions, loading, fetchSubmissions, stats } = useSubmissions();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleExport = () => {
    const csv = submissions.map(s => ({
      ID: s.id,
      'Form': s.form_id,
      'Status': s.status,
      'Submitted': formatDate(s.created_at),
      'Time': s.time_taken || '-',
    }));

    const csvContent = [
      Object.keys(csv[0]).join(','),
      ...csv.map(r => Object.values(r).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading fullScreen message="Loading submissions..." />;
  }

  return (
    <Layout
      title="Submissions"
      description="Track and manage all form submissions"
    >
      <div className="submissions-container">
        {/* Stats */}
        <div className="submissions-stats">
          <Card className="submissions-stat-card">
            <h4>Total Submissions</h4>
            <p className="submissions-stat-value">{stats.totalSubmissions || 0}</p>
          </Card>

          <Card className="submissions-stat-card">
            <h4>Success Rate</h4>
            <p className="submissions-stat-value">{stats.successRate || 0}%</p>
          </Card>

          <Card className="submissions-stat-card">
            <h4>Avg. Time</h4>
            <p className="submissions-stat-value">
              {Math.round(stats.averageTime || 0)}s
            </p>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="submissions-toolbar">
          <div className="submissions-filters">
            {['all', 'submitted', 'draft'].map(status => (
              <button
                key={status}
                className={`submissions-filter ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExport}
            disabled={submissions.length === 0}
          >
            Export
          </Button>
        </div>

        {/* Submissions Table */}
        <Card className="submissions-table-card">
          {filteredSubmissions.length === 0 ? (
            <div className="submissions-empty">
              <p>No submissions yet</p>
            </div>
          ) : (
            <div className="submissions-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Form</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Time Taken</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map(submission => (
                    <tr key={submission.id}>
                      <td>#{submission.id}</td>
                      <td>Form {submission.form_id}</td>
                      <td>
                        <span className={`submissions-badge submissions-badge--${submission.status}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td>{formatDateRelative(submission.created_at)}</td>
                      <td>{submission.time_taken || '-'}s</td>
                      <td>
                        <div className="submissions-actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => toast.info('View details coming soon')}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => toast.info('Delete coming soon')}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SubmissionsPage;
