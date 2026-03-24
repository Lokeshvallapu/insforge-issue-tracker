import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Issue } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Issues: React.FC = () => {
  const { user } = useAuth();
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIssues = async () => {
    const [assignedRes, allRes] = await Promise.all([
      insforge.database.from('issues').select('*').eq('assigned_to', user?.id).order('updated_at', { ascending: false }),
      insforge.database.from('issues').select('*').order('updated_at', { ascending: false }).limit(50)
    ]);

    if (assignedRes.data) setAssignedIssues(assignedRes.data);
    if (allRes.data) setAllIssues(allRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadIssues();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading issues...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Issues</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage all project issues in one place.</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Link to="/" className="inline-flex items-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-slate-700">Back to Dashboard</Link>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{allIssues.length} total issues</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Assigned to Me</h2>
            {assignedIssues.length === 0 ? (
              <p className="text-sm text-slate-500">No assigned issues.</p>
            ) : (
              <ul className="space-y-2">
                {assignedIssues.map((issue) => (
                  <li key={issue.id}>
                    <Link to={`/issues/${issue.id}`} className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-indigo-700">{issue.title}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{issue.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Priority: {issue.priority} � Project: {issue.project_id}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Issues</h2>
            {allIssues.length === 0 ? (
              <p className="text-sm text-slate-500">No issues yet.</p>
            ) : (
              <ul className="space-y-2">
                {allIssues.map((issue) => (
                  <li key={issue.id}>
                    <Link to={`/issues/${issue.id}`} className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-indigo-700">{issue.title}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{issue.status}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Project: {issue.project_id} � Priority: {issue.priority}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Issues;
