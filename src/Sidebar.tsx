import { Table, Download, Upload, LayoutDashboard, Square, Circle, Diamond, Play } from 'lucide-react';

interface SidebarProps {
  currentMode: 'conceptual' | 'relational';
  onAddTable: () => void;
  onAddEntity: () => void;
  onAddAttribute: () => void;
  onAddRelationship: () => void;
  onTransformToRelational: () => void;
  onAutoLayout: () => void;
  onExport: () => void;
  onImport: () => void;
}

export function Sidebar({ currentMode, onAddTable, onAddEntity, onAddAttribute, onAddRelationship, onTransformToRelational, onAutoLayout, onExport, onImport }: SidebarProps) {
  const isRelational = currentMode === 'relational';
  const isConceptual = currentMode === 'conceptual';

  return (
    <aside className="w-16 border-r border-slate-800 flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto" style={{ backgroundColor: '#020617' }}>
      
      {/* Relational Sector */}
      {isRelational && (
        <>
          <button 
            onClick={onAddTable}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-indigo-500/50 group"
            title="Nueva Tabla"
          >
            <Table className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <div className="w-8 h-px bg-slate-800 my-2"></div>
        </>
      )}
      
      {/* Conceptual Sector */}
      {isConceptual && (
        <>
          <button 
            onClick={onAddEntity}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-fuchsia-500/20 hover:text-fuchsia-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-fuchsia-500/50 group"
            title="Entidad"
          >
            <Square className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={onAddAttribute}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-sky-500/20 hover:text-sky-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-sky-500/50 group"
            title="Atributo"
          >
            <Circle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={onAddRelationship}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-amber-500/50 group"
            title="Relación"
          >
            <Diamond className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-8 h-px bg-slate-800 my-2"></div>

          {/* Execution Sector */}
          <button 
            onClick={onTransformToRelational}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-lg shadow-indigo-500/30 group"
            title="Transformar a Relacional"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
          </button>

          <div className="w-8 h-px bg-slate-800 my-2"></div>
        </>
      )}

      <button 
        onClick={onAutoLayout}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-emerald-500/50 group"
        title="Auto Ordenar (Dagre)"
      >
        <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Placeholder buttons for more tools */}
      <div className="w-8 h-px bg-slate-800 my-2"></div>

      <button 
        onClick={onExport}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-cyan-500/50 group"
        title="Guardar (.jymd)"
      >
        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      
      <button 
        onClick={onImport}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-amber-500/50 group"
        title="Abrir (.jymd)"
      >
        <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </aside>
  );
}
