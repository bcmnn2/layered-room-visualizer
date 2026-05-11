import React from 'react';

const Canvas = ({ project }) => {
  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 italic">
        Seleziona o crea un progetto per iniziare
      </div>
    );
  }

  const { color, imgWall, imgRoom } = project;
  const baseUrl = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3001';

  return (
    <div className="flex-1 relative overflow-hidden bg-slate-900 flex items-center justify-center p-8">
      <div 
        className={`relative premium-shadow rounded-lg overflow-hidden bg-slate-800 transition-all duration-700 ease-in-out ${!imgRoom && !imgWall ? 'w-full h-full max-w-4xl aspect-video' : 'max-h-full max-w-full shadow-2xl'}`}
      >
        {/* Helper image to maintain aspect ratio without fixed CSS values */}
        {imgRoom ? (
          <img 
            src={`${baseUrl}${imgRoom}`} 
            alt="Proportions Reference"
            className="invisible w-auto h-auto max-h-[80vh] max-w-full block"
          />
        ) : imgWall ? (
          <img 
            src={`${baseUrl}${imgWall}`} 
            alt="Proportions Reference"
            className="invisible w-auto h-auto max-h-[80vh] max-w-full block"
          />
        ) : null}

        {/* Level 1: COLWALL (Bottom) */}
        <div 
          className="absolute inset-0 z-10 transition-colors duration-500"
          style={{ backgroundColor: color || '#ffffff' }}
        />

        {/* Level 2: IMGWALL (Middle) - Blend Mode: Multiply */}
        {imgWall && (
          <img 
            src={`${baseUrl}${imgWall}`} 
            alt="Wall Layer"
            className="absolute inset-0 z-20 w-full h-full object-contain mix-blend-multiply"
          />
        )}

        {/* Level 3: IMGROOM (Top) - Normal */}
        {imgRoom && (
          <img 
            src={`${baseUrl}${imgRoom}`} 
            alt="Room Layer"
            className="absolute inset-0 z-30 w-full h-full object-contain"
          />
        )}

        {(!imgWall && !imgRoom) && (
          <div className="absolute inset-0 z-40 flex items-center justify-center text-slate-400 p-12 text-center bg-black/20 backdrop-blur-sm">
            Carica gli asset IMGWALL e IMGROOM nella sidebar destra per vedere il rendering
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
