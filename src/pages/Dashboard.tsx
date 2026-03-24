import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { useAuth } from '../contexts/AuthContext';
import { Project, Issue } from '../types';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [projectsRes, myIssuesRes, recentIssuesRes] = await Promise.all([
        insforge.database.from('projects').select('*'),
        insforge.database.from('issues').select('*').eq('assigned_to', user?.id),
        insforge.database.from('issues').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (myIssuesRes.data) setMyIssues(myIssuesRes.data);
      if (recentIssuesRes.data) setRecentIssues(recentIssuesRes.data);
      setLoading(false);
    };

    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const issueStatusCounts = recentIssues.reduce(
    (acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Project Intelligence</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to track progress, issues, and AI help in one place.</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <button className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-slate-700">Browse Projects</button>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" onClick={() => signOut()}>Sign Out</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 xl:col-span-3">
            <div className="sticky top-6 space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Quick Links</h2>
                <div className="mt-3 space-y-2">
                  <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" onClick={() => navigate('/projects')}>Projects</button>
                  <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" onClick={() => navigate('/issues')}>Issues</button>
                  <button className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600" onClick={() => navigate('/ai')}>AI Assistant</button>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Account</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user?.profile?.name || user?.email || 'Unknown user'}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">ID: {user?.id ?? 'N/A'}</p>
              </section>
            </div>
          </aside>

          <main className="col-span-12 xl:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{projects.length}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Assigned to Me</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{myIssues.length}</p>
              </article>
            </div>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Issue Health</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{recentIssues.length} recent (last 5)</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">Open</p>
                  <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-300">{issueStatusCounts.open || 0}</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
                  <p className="text-sm text-amber-700 dark:text-amber-400">In Progress</p>
                  <p className="mt-1 text-xl font-bold text-amber-900 dark:text-amber-300">{issueStatusCounts.in_progress || 0}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-400">Closed</p>
                  <p className="mt-1 text-xl font-bold text-blue-900 dark:text-blue-300">{issueStatusCounts.closed || 0}</p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Issues</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" onClick={() => navigate('/issues')}>See all</button>
              </div>
              <div className="mt-3 space-y-3">
                {recentIssues.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recent issues. Create one to get started.</p>
                ) : (
                  recentIssues.map((issue) => (
                    <button key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)} className="w-full text-left rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{issue.title}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 dark:bg-emerald-900/30 dark:text-emerald-300">{issue.status}</span>
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 dark:bg-sky-900/30 dark:text-sky-300">{issue.priority}</span>
                        <span className="">Project: {issue.project_id}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </article>
          </main>

          <aside className="col-span-12 xl:col-span-3">
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use the AI assistant for issue summaries, sprint planning, release notes, and automated commands.</p>
                <button onClick={() => navigate('/ai')} className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">Open AI Chat</button>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Team Health</h2>
                <ul className="mt-2 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li>• 12 active team members</li>
                  <li>• 8 open pull requests</li>
                  <li>• 2 blockers in current sprint</li>
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
