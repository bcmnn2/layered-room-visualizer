import React, { useState, useEffect, useRef } from 'react';
import { Upload, Palette, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseHex } from '../utils/color';

const SidebarRight = ({ activeProject, onUpdateProject, onUploadImage }) => {
  const [hexInput, setHexInput] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [dragType, setDragType] = useState(null); // 'wall' or 'room'

  const wallInputRef = useRef(null);
  const roomInputRef = useRef(null);

  useEffect(() => {
    if (activeProject) {
      setHexInput(activeProject.color || '#ffffff');
    }
  }, [activeProject?.id]); // Only reset when switching projects

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const parsed = parseHex(hexInput);
      if (parsed) onUpdateProject({ color: parsed });
    }
  };

  const handleColorChange = (value) => {
    setHexInput(value);
    const parsed = parseHex(value);
    setIsValid(!!parsed);
  };

  // Use useEffect to handle debounced color update instead of inline timeout
  useEffect(() => {
    const parsed = parseHex(hexInput);
    if (parsed && parsed !== activeProject.color) {
      const timeoutId = setTimeout(() => {
        onUpdateProject({ color: parsed });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [hexInput]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      onUploadImage(file, type);
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragType(type);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragType(null);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragType(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUploadImage(file, type);
    }
  };

  if (!activeProject) {
    return (
      <div className="w-80 glass-panel h-screen flex items-center justify-center text-slate-500 p-8 text-center italic">
        Nessun progetto attivo
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3001';

  return (
    <div className="w-80 glass-panel h-screen flex flex-col border-l border-slate-800 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200">Control Panel</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Color Picker Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Palette size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Pareti (COLWALL)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl border-2 border-slate-700 shadow-inner overflow-hidden"
              style={{ backgroundColor: parseHex(hexInput) || '#000' }}
            />
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Codice Hex</label>
              <div className="relative">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleColorChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full bg-slate-900/80 border ${isValid ? 'border-slate-700 focus:border-blue-500' : 'border-red-500 focus:border-red-500'} text-slate-200 px-3 py-2 rounded-lg outline-none transition-all`}
                  placeholder="#FFFFFF"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValid ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={14} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layer Manager Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <ImageIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Livelli (Asset)</span>
          </div>

          {/* IMGWALL Upload */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Pareti & Ombre (IMGWALL)</label>
              {activeProject.imgWall && <span className="text-[10px] text-emerald-500 font-bold uppercase">Caricato</span>}
            </div>
            <div 
              onClick={() => wallInputRef.current.click()}
              onDragOver={(e) => handleDragOver(e, 'wall')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'wall')}
              className={`relative group aspect-video rounded-xl bg-slate-900 border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragType === 'wall' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-blue-500/50'}`}
            >
              {activeProject.imgWall ? (
                <img src={`${baseUrl}${activeProject.imgWall}`} className="w-full h-full object-cover opacity-50 group-hover:opacity-30" alt="Wall Preview" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Upload size={24} />
                  <span className="text-xs">Upload Multiply Layer</span>
                </div>
              )}
              <input 
                ref={wallInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileChange(e, 'wall')}
                accept="image/*"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-blue-600/10 transition-opacity">
                <span className="text-xs text-blue-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-full shadow-lg border border-blue-500/30">
                  {activeProject.imgWall ? 'Sostituisci' : 'Carica Immagine'}
                </span>
              </div>
            </div>
          </div>

          {/* IMGROOM Upload */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Arredamento (IMGROOM)</label>
              {activeProject.imgRoom && <span className="text-[10px] text-emerald-500 font-bold uppercase">Caricato</span>}
            </div>
            <div 
              onClick={() => roomInputRef.current.click()}
              onDragOver={(e) => handleDragOver(e, 'room')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'room')}
              className={`relative group aspect-video rounded-xl bg-slate-900 border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragType === 'room' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-blue-500/50'}`}
            >
              {activeProject.imgRoom ? (
                <img src={`${baseUrl}${activeProject.imgRoom}`} className="w-full h-full object-cover opacity-50 group-hover:opacity-30" alt="Room Preview" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Upload size={24} />
                  <span className="text-xs">Upload Alpha Layer</span>
                </div>
              )}
              <input 
                ref={roomInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileChange(e, 'room')}
                accept="image/*"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-blue-600/10 transition-opacity">
                <span className="text-xs text-blue-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-full shadow-lg border border-blue-500/30">
                  {activeProject.imgRoom ? 'Sostituisci' : 'Carica Immagine'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto p-6 bg-slate-900/50 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 leading-tight">
          Il livello <span className="text-slate-400 font-bold">IMGWALL</span> viene fuso in modalità <span className="italic">Multiply</span> con il colore di fondo. Assicurarsi che le zone delle pareti siano bianche nell'asset originale.
        </p>
      </div>
    </div>
  );
};

export default SidebarRight;
