import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await insforge.database.from('projects').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    if (!name.trim()) return setError('Project name is required');
    setError('');

    const { error } = await insforge.database.from('projects').insert([{ name, description, created_by: user?.id }]);
    if (error) {
      setError(error.message);
      return;
    }

    setName('');
    setDescription('');
    await loadProjects();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading projects...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Create, manage and drill into your active projects.</p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Link to="/" className="inline-flex items-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-slate-700">Back to Dashboard</Link>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{projects.length} projects total</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Create New Project</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input type="text" placeholder="Name" className="rounded-lg border border-slate-300 p-2" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Description" className="rounded-lg border border-slate-300 p-2" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button onClick={createProject} className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700">Create</button>
            </div>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Quick Stats</h2>
            <p className="mt-2 text-sm text-slate-500">Projects currently active: <strong className="text-slate-900">{projects.length}</strong></p>
            <p className="mt-1 text-sm text-slate-500">Your user id: <strong className="text-slate-900">{user?.id ?? 'N/A'}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700"><Link to={`/projects/${project.id}`} className="hover:text-indigo-800">{project.name}</Link></h3>
                  <p className="text-sm text-slate-500 mt-1">{project.description || 'No description provided.'}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
