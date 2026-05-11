import React, { useState, useEffect } from 'react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import Canvas from './components/Canvas';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      setProjects(data);
      if (data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Progetto ${projects.length + 1}` })
      });
      const newProject = await res.json();
      setProjects([...projects, newProject]);
      setActiveProject(newProject);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleUpdateProject = async (updates) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${activeProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setActiveProject(updated);
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleRenameProject = async (id, newName) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      const updated = await res.json();
      setProjects(projects.map(p => p.id === id ? updated : p));
      if (activeProject?.id === id) setActiveProject(updated);
    } catch (err) {
      console.error('Error renaming project:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    console.log('handleDeleteProject executing for id:', id);
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      
      console.log('Project deleted on server, updating local state...');
      setProjects(prevProjects => {
        const updatedList = prevProjects.filter(p => p.id !== id);
        
        // If we deleted the active project, switch to the first remaining one or null
        if (activeProject?.id === id) {
          console.log('Switching active project to:', updatedList[0]?.name || 'none');
          setActiveProject(updatedList[0] || null);
        }
        
        return updatedList;
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Impossibile eliminare il progetto. Controlla la connessione al server.');
    }
  };

  const handleUploadImage = async (file, type) => {
    if (!activeProject) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/projects/${activeProject.id}/upload/${type}`, {
        method: 'POST',
        body: formData
      });
      const updated = await res.json();
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setActiveProject(updated);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Inizializzazione Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <SidebarLeft 
        projects={projects}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900/30">
        <Canvas project={activeProject} />
      </main>

      <SidebarRight 
        activeProject={activeProject}
        onUpdateProject={handleUpdateProject}
        onUploadImage={handleUploadImage}
      />
    </div>
  );
}

export default App;
