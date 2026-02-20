import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TableNode } from './TableNode';
import { RelationEdge } from './RelationEdge';
import { getLayoutedElements } from './layoutUtils';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';

import { EntityNode } from './EntityNode';
import { AttributeNode } from './AttributeNode';
import { RelationshipNode } from './RelationshipNode';

import { convertToRelational } from './relationalConverter';
import { HomeScreen } from './HomeScreen';

const nodeTypes = {
  table: TableNode,
  entity: EntityNode,
  attribute: AttributeNode,
  relationship: RelationshipNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

function Modeler() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [appMode, setAppMode] = useState<'home' | 'conceptual' | 'relational'>('home');
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const handleStartMode = useCallback((mode: 'conceptual' | 'relational') => {
    setAppMode(mode);
    setNodes([]);
    setEdges([]);
    setTimeout(() => fitView({ padding: 0.2, maxZoom: 1 }), 50);
  }, [setNodes, setEdges, fitView]);

  const handleLoadTemplate = useCallback((initialNodes: Node[], initialEdges: Edge[], mode: 'conceptual' | 'relational') => {
    setAppMode(mode);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'LR');
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTimeout(() => fitView({ padding: 0.2, maxZoom: 1 }), 50);
    }, 50);
  }, [setNodes, setEdges, fitView]);

  const handleGoHome = useCallback(() => {
    setAppMode('home');
  }, []);

  // Auto-Layout trigger
  const onAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'LR'
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    setTimeout(() => fitView({ padding: 0.2, maxZoom: 1 }), 100);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  // Initial layout boot
  useEffect(() => {
    onAutoLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'relation', 
      data: { sourceCardinality: '1', targetCardinality: 'N' },
      style: { stroke: '#4ade80', strokeWidth: 2, opacity: 0.8 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#4ade80' }
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  const updateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = data;
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateEdge = useCallback((id: string, data: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          edge.data = data;
        }
        return edge;
      })
    );
  }, [setEdges]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    setSelectedEdgeId(null);
  }, [setEdges]);

  const spawnNode = useCallback((type: string, defaultData: any) => {
    const newNode: Node = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: defaultData,
    };
    
    if (reactFlowWrapper.current) {
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
      newNode.position = position;
    }

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
  }, [screenToFlowPosition, setNodes]);

  const onAddTable = useCallback(() => {
    spawnNode('table', {
      tableName: 'New_Table',
      columns: [{ name: 'id', type: 'INT', isPk: true }],
    });
  }, [spawnNode]);

  const onAddEntity = useCallback(() => {
    spawnNode('entity', { label: 'Entity', isWeak: false });
  }, [spawnNode]);

  const onAddAttribute = useCallback(() => {
    spawnNode('attribute', { label: 'Attribute', isPrimaryKey: false, isMultivalued: false, isDerived: false });
  }, [spawnNode]);

  const onAddRelationship = useCallback(() => {
    spawnNode('relationship', { label: 'Relation', isIdentifying: false });
  }, [spawnNode]);

  const onTransformToRelational = useCallback(() => {
    const { newNodes, newEdges } = convertToRelational(nodes, edges);
    
    if (newNodes.length === 0) {
      alert("No hay entidades conceptuales para convertir.");
      return;
    }

    // Replace current canvas with new relational data
    setNodes(newNodes);
    setEdges(newEdges);

    // Run auto-layout on the new relational nodes
    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        newNodes,
        newEdges,
        'LR'
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      setTimeout(() => fitView({ padding: 0.2, maxZoom: 1 }), 100);
    }, 50);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onExport = useCallback(async () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const defaultName = `diagrama_${Date.now()}.jymd`;

    // Intentamos usar la File System Access API (Navegadores modernos basados en Chromium)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: defaultName,
          types: [{
            description: 'Archivo de DiagramJymd',
            accept: { 'application/json': ['.jymd'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(dataStr);
        await writable.close();
      } catch (err: any) {
        // Ignorar el error si el usuario simplemente cerró la ventana de guardar
        if (err.name !== 'AbortError') {
          console.error('Error al guardar:', err);
        }
      }
    } else {
      // Fallback para navegadores antiguos (Firefox, Safari)
      let customName = prompt('Ingresa el nombre del archivo para guardar:', defaultName);
      if (!customName) return; // Si el usuario cancela
      if (!customName.endsWith('.jymd')) customName += '.jymd';

      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = customName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [nodes, edges]);

  const onImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jymd,.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed.nodes && parsed.edges) {
            // Auto-detect mode
            const hasConceptualNodes = parsed.nodes.some((n: any) => ['entity', 'attribute', 'relationship'].includes(n.type));
            setAppMode(hasConceptualNodes ? 'conceptual' : 'relational');
            
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            setTimeout(() => fitView({ padding: 0.2, maxZoom: 1 }), 50);
          } else {
            alert('El archivo no tiene el formato correcto de .jymd');
          }
        } catch (error) {
          alert('Error al leer el archivo');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, fitView]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (appMode === 'home') {
    return <HomeScreen onSelectMode={handleStartMode} onImport={onImport} onLoadTemplate={handleLoadTemplate} />;
  }

  return (
    <div className="flex flex-col w-screen h-screen font-sans" style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Header */}
      <header className="px-6 py-4 w-full backdrop-blur-md border-b border-slate-800 flex justify-between items-center z-10 shrink-0" style={{ backgroundColor: '#020617', color: '#f1f5f9', height: '70px' }}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleGoHome}>
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:opacity-80 transition-opacity">
            Diagram.jymd
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoHome}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 hover:border-slate-500 flex items-center gap-2"
          >
           🏠 Volver al Inicio
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          currentMode={appMode}
          onAddTable={onAddTable} 
          onAddEntity={onAddEntity}
          onAddAttribute={onAddAttribute}
          onAddRelationship={onAddRelationship}
          onTransformToRelational={onTransformToRelational}
          onAutoLayout={onAutoLayout} 
          onExport={onExport} 
          onImport={onImport} 
        />
        
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes as any}
            colorMode="dark"
            minZoom={0.1}
            maxZoom={1.5}
            fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
            elementsSelectable={true}
            style={{ backgroundColor: '#020617' }}
          >
            <Background color="#94a3b8" gap={16} size={1} />
            <Controls className="!bg-slate-800/80 backdrop-blur-sm !border-slate-700 !fill-slate-200 shadow-xl rounded-lg overflow-hidden" position="bottom-left" />
            <MiniMap 
              nodeColor={(n) => n.type === 'table' ? '#312e81' : '#475569'}
              maskColor="rgba(2, 6, 23, 0.7)"
              className="!bg-slate-900/90 backdrop-blur-md !border-slate-700 rounded-xl overflow-hidden shadow-2xl"
              position="bottom-right"
              style={{ bottom: 10, right: 10 }}
            />
          </ReactFlow>
        </div>

        <PropertiesPanel 
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          updateNode={updateNode} 
          deleteNode={deleteNode}
          updateEdge={updateEdge}
          deleteEdge={deleteEdge}
          closePanel={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
        />
      </div>
    </div>
  );
}

export default function DatabaseDiagram() {
  return (
    <ReactFlowProvider>
      <Modeler />
    </ReactFlowProvider>
  );
}
