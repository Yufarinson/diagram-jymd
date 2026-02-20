import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDiagramStore } from '../../../entities/store/diagramStore';
import { Sidebar } from '../../../widgets/sidebar/ui/Sidebar';
import { PropertiesPanel } from '../../../widgets/properties/ui/PropertiesPanel';
import { EntityNode } from '../../../entities/nodes/ui/EntityNode';
import { AttributeNode } from '../../../entities/nodes/ui/AttributeNode';
import { RelationshipNode } from '../../../entities/nodes/ui/RelationshipNode';
import { TableNode } from '../../../entities/nodes/ui/TableNode';
import { RelationEdge } from '../../../entities/edges/ui/RelationEdge';

import { Home, Trash2 } from 'lucide-react';

const nodeTypes = {
  entity: EntityNode,
  attribute: AttributeNode,
  relationship: RelationshipNode,
  table: TableNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

export function EditorPage() {
  const {
    appMode,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setSelectedEdgeId,
    setAppMode,
    setNodes,
    setEdges,
  } = useDiagramStore();

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  };

  const handleEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  };

  const handlePaneClick = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  const handleGoHome = () => {
    setAppMode('home');
  };

  const handleClear = () => {
    if (window.confirm("¿Seguro que quieres limpiar todo el lienzo?")) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen font-sans" style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Header */}
      <header className="px-6 py-4 w-full backdrop-blur-md border-b border-slate-800 flex justify-between items-center z-10 shrink-0" style={{ backgroundColor: '#020617', color: '#f1f5f9', height: '70px' }}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleGoHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-100">Diagram.Jymd</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGoHome}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 hover:border-slate-500 flex items-center gap-2"
          >
            <Home className="w-3.5 h-3.5" /> Inicio
          </button>
          <button
            onClick={handleClear}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20 hover:border-red-500/40 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpiar
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative bg-slate-950">
          <ReactFlow
            nodes={nodes as Node[]}
            edges={edges as Edge[]}
            onNodesChange={onNodesChange as any}
            onEdgesChange={onEdgesChange as any}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            colorMode="dark"
          >
            <Background color="#1e293b" variant={BackgroundVariant.Dots} />
            <Controls className="bg-slate-900 border-slate-800 fill-slate-400" />
            {/* Panel component removed as per instruction */}
          </ReactFlow>

          {/* Floating Indicator for Mode */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-md z-10 flex items-center gap-3 shadow-xl">
            <div className={`w-2 h-2 rounded-full animate-pulse ${appMode === 'conceptual' ? 'bg-fuchsia-400' : 'bg-indigo-400'}`}></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              Modo {appMode === 'conceptual' ? 'Conceptual (Chen)' : 'Relacional (Físico)'}
            </span>
          </div>
        </main>

        <PropertiesPanel />
      </div>
    </div>
  );
}
