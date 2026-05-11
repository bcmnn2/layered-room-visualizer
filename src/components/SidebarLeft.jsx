import React, { useState } from 'react';
import { Plus, Settings, Trash2, Edit3, Check, X } from 'lucide-react';

const SidebarLeft = ({ projects, activeProject, onSelectProject, onCreateProject, onDeleteProject, onRenameProject }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const handleStartEdit = (e, project) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
    setConfirmingId(null);
  };

  const handleSaveEdit = (e, id) => {
    e.stopPropagation();
    onRenameProject(id, editName);
    setEditingId(null);
  };

  const handleStartDelete = (e, id) => {
    e.stopPropagation();
    setConfirmingId(id);
    setEditingId(null);
  };

  const handleConfirmDelete = (e, id) => {
    e.stopPropagation();
    onDeleteProject(id);
    setConfirmingId(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmingId(null);
  };

  return (
    <div className="w-72 glass-panel h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Layered Rooms
        </h1>
      </div>

      <div className="p-4">
        <button
          onClick={onCreateProject}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          <span>Nuovo Progetto</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Progetti</p>
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              activeProject?.id === project.id 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {editingId === project.id ? (
                <input
                  autoFocus
                  className="bg-slate-900 text-slate-200 px-2 py-0.5 rounded border border-blue-500 outline-none w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(e, project.id)}
                />
              ) : (
                <span className="truncate text-sm font-medium">{project.name}</span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {editingId === project.id ? (
                <>
                  <button onClick={(e) => handleSaveEdit(e, project.id)} className="p-1 hover:text-emerald-400">
                    <Check size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1 hover:text-red-400">
                    <X size={14} />
                  </button>
                </>
              ) : confirmingId === project.id ? (
                <div className="flex items-center gap-1 bg-slate-900 rounded-md p-1 border border-red-500/30">
                  <button 
                    onClick={(e) => handleConfirmDelete(e, project.id)} 
                    className="p-1 hover:text-emerald-400 text-slate-400"
                    title="Conferma eliminazione"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={handleCancelDelete} 
                    className="p-1 hover:text-red-400 text-slate-400"
                    title="Annulla"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={(e) => handleStartEdit(e, project)} className="p-1 hover:text-blue-400">
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={(e) => handleStartDelete(e, project.id)} 
                    className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all active:scale-90"
                    title="Elimina Progetto"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
