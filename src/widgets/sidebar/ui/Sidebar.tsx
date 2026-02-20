import { Table, Download, Upload, LayoutDashboard, Square, Circle, Diamond, Play } from 'lucide-react';
import { useDiagramStore } from '../../../entities/store/diagramStore';
import { useTransform } from '../../../features/diagram-transform/model/useTransform';
import type { AppNode } from '../../../shared/model/types';

export function Sidebar() {
  const { 
    appMode, 
    addNode, 
  } = useDiagramStore();
  
  
  const { transformToRelational } = useTransform();

  const isRelational = appMode === 'relational';
  const isConceptual = appMode === 'conceptual';

  const spawnNode = (type: AppNode['type'], data: Record<string, unknown> = {}) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Nuevo ${type}`, ...data },
    } as AppNode;
    addNode(newNode);
  };

  return (
    <aside className="w-16 border-r border-slate-800 flex flex-col items-center py-6 gap-6 z-20 overflow-y-auto" style={{ backgroundColor: '#020617' }}>
      
      {/* Relational Sector */}
      {isRelational && (
        <>
          <button 
            onClick={() => {
              spawnNode('table', {
                tableName: 'New_Table',
                columns: [{ name: 'id', type: 'INT', isPk: true }],
              });
            }}
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
            onClick={() => { spawnNode('entity', { label: 'Entity', isWeak: false }); }}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-fuchsia-500/20 hover:text-fuchsia-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-fuchsia-500/50 group"
            title="Entidad"
          >
            <Square className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={() => { spawnNode('attribute', { label: 'Attribute', isPrimaryKey: false, isMultivalued: false, isDerived: false }); }}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-sky-500/20 hover:text-sky-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-sky-500/50 group"
            title="Atributo"
          >
            <Circle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button 
            onClick={() => { spawnNode('relationship', { label: 'Relation', isIdentifying: false }); }}
            className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-amber-500/50 group"
            title="Relación"
          >
            <Diamond className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="w-8 h-px bg-slate-800 my-2"></div>
          
          <button 
            onClick={() => { transformToRelational(); }}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-lg shadow-indigo-500/30 group"
            title="Transformar a Relacional"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
          </button>

          <div className="w-8 h-px bg-slate-800 my-2"></div>
        </>
      )}

      <button 
        onClick={() => { alert("Auto Layout (Próximamente)"); }}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-emerald-500/50 group"
        title="Auto Ordenar (Dagre)"
      >
        <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-8 h-px bg-slate-800 my-2"></div>

      <button 
        onClick={() => { alert("Exportar (Próximamente)"); }}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-cyan-500/50 group"
        title="Guardar (.jymd)"
      >
        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      
      <button 
        onClick={() => { alert("Importar (Próximamente)"); }}
        className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 flex items-center justify-center transition-all border border-slate-700/50 hover:border-amber-500/50 group"
        title="Abrir (.jymd)"
      >
        <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </aside>
  );
}
