import { Trash2, Plus, X, ArrowRightLeft } from 'lucide-react';
import type { ColumnDef, TableData, EntityData, AttributeData, RelationshipData, RelationEdgeData, AppNode, AppEdge } from '../../../shared/model/types';
import { useDiagramStore } from '../../../entities/store/diagramStore';

function NodePropsForm({ node }: { node: AppNode }) {
  const { updateNodeData } = useDiagramStore();
  const data = node.data as TableData;

  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { tableName: e.target.value });
  };

  const handleColumnChange = (index: number, field: keyof ColumnDef, value: string | boolean) => {
    const newColumns = [...data.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    updateNodeData(node.id, { columns: newColumns });
  };

  const adColumn = () => {
    const newCol: ColumnDef = { name: `col_${String(data.columns.length + 1)}`, type: 'VARCHAR(50)' };
    updateNodeData(node.id, { columns: [...data.columns, newCol] });
  };

  const removeColumn = (index: number) => {
    const newColumns = data.columns.filter((_, i) => i !== index);
    updateNodeData(node.id, { columns: newColumns });
  };

  return (
    <>
      {/* Table Name */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nombre de la Tabla</label>
        <input 
          type="text" 
          value={data.tableName} 
          onChange={handleTableNameChange}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
        />
      </div>

      {/* Columns */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Columnas</label>
          <button 
            onClick={() => { adColumn(); }}
            className="px-2 py-1 text-xs bg-slate-800 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-300 rounded-md border border-slate-700 flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" /> Añadir
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {data.columns.map((col: ColumnDef, index: number) => (
            <div key={String(index)} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col gap-3 group relative hover:border-slate-700 transition-colors">
              <button 
                onClick={() => { removeColumn(index); }}
                className="absolute -top-2 -right-2 bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white p-1 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              
              <input 
                type="text"
                value={col.name}
                onChange={(e) => { handleColumnChange(index, 'name', e.target.value); }}
                placeholder="nombre_columna"
                className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono w-full"
              />
              
              <div className="flex items-center gap-2">
                <select
                  value={col.type}
                  onChange={(e) => { handleColumnChange(index, 'type', e.target.value); }}
                  className="bg-slate-950 border border-slate-800 rounded-md px-1 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono w-2/3 cursor-pointer"
                >
                  <optgroup label="Numéricos">
                    <option value="INT">INT</option>
                    <option value="BIGINT">BIGINT</option>
                    <option value="SMALLINT">SMALLINT</option>
                    <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                    <option value="FLOAT">FLOAT</option>
                  </optgroup>
                  <optgroup label="Texto">
                    <option value="VARCHAR(20)">VARCHAR(20)</option>
                    <option value="VARCHAR(50)">VARCHAR(50)</option>
                    <option value="VARCHAR(100)">VARCHAR(100)</option>
                    <option value="VARCHAR(200)">VARCHAR(200)</option>
                    <option value="VARCHAR(255)">VARCHAR(255)</option>
                    <option value="TEXT">TEXT</option>
                  </optgroup>
                  <optgroup label="Fecha y Hora">
                    <option value="DATE">DATE</option>
                    <option value="DATETIME">DATETIME</option>
                    <option value="TIMESTAMP">TIMESTAMP</option>
                  </optgroup>
                  <optgroup label="Otros">
                    <option value="BOOLEAN">BOOLEAN</option>
                    <option value="JSON">JSON</option>
                  </optgroup>
                </select>
                
                <div className="flex gap-1.5 flex-1 justify-end">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={col.isPk ?? false}
                      onChange={(e) => { handleColumnChange(index, 'isPk', e.target.checked); }}
                      className="sr-only peer"
                    />
                    <span className="text-[10px] font-bold px-1.5 py-1 rounded bg-slate-800 text-slate-500 peer-checked:bg-amber-500/20 peer-checked:text-amber-400 peer-checked:border-amber-500/30 border border-transparent transition-all">PK</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={col.isFk ?? false}
                      onChange={(e) => { handleColumnChange(index, 'isFk', e.target.checked); }}
                      className="sr-only peer"
                    />
                    <span className="text-[10px] font-bold px-1.5 py-1 rounded bg-slate-800 text-slate-500 peer-checked:bg-indigo-500/20 peer-checked:text-indigo-400 peer-checked:border-indigo-500/30 border border-transparent transition-all">FK</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function EdgePropsForm({ edge }: { edge: AppEdge }) {
  const { updateEdgeData } = useDiagramStore();
  const data = (edge.data ?? { sourceCardinality: '1', targetCardinality: 'N' }) as RelationEdgeData;

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateEdgeData(edge.id, { sourceCardinality: e.target.value });
  };
  
  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateEdgeData(edge.id, { targetCardinality: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background for edges */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
          Configurar Cardinalidad
        </h3>
        
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Origen</span>
              <span className="text-slate-600">(Izquierda)</span>
            </label>
            <select 
              value={data.sourceCardinality ?? '1'} 
              onChange={handleSourceChange}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer hover:border-slate-600"
            >
              <option value="1">1 (Uno)</option>
              <option value="N">N (Muchos)</option>
              <option value="0..1">0..1 (Cero a Uno)</option>
              <option value="0..N">0..N (Cero a Muchos)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Destino</span>
              <span className="text-slate-600">(Derecha)</span>
            </label>
            <select 
              value={data.targetCardinality ?? 'N'} 
              onChange={handleTargetChange}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer hover:border-slate-600"
            >
              <option value="1">1 (Uno)</option>
              <option value="N">N (Muchos)</option>
              <option value="0..1">0..1 (Cero a Uno)</option>
              <option value="0..N">0..N (Cero a Muchos)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}


function ConceptualPropsForm({ node }: { node: AppNode }) {
  const { updateNodeData } = useDiagramStore();
  const data = node.data as (EntityData | AttributeData | RelationshipData);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateNodeData(node.id, { [field]: checked });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Etiqueta</label>
        <input 
          type="text" 
          value={String((data as any).label ?? "")} 
          onChange={handleLabelChange}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
        />
      </div>

      {node.type === 'entity' && (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input 
            type="checkbox" 
            checked={(data as EntityData).isWeak ?? false}
            onChange={(e) => { handleCheckboxChange('isWeak', e.target.checked); }}
            className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950"
          />
          <span className="text-sm text-slate-300">Entidad Débil</span>
        </label>
      )}

      {node.type === 'attribute' && (
        <div className="flex flex-col gap-3 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={(data as AttributeData).isPrimaryKey ?? false}
              onChange={(e) => { handleCheckboxChange('isPrimaryKey', e.target.checked); }}
              className="w-4 h-4 rounded text-sky-500"
            />
            <span className="text-sm text-slate-300">Clave Primaria</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={(data as AttributeData).isMultivalued ?? false}
              onChange={(e) => { handleCheckboxChange('isMultivalued', e.target.checked); }}
              className="w-4 h-4 rounded text-sky-500"
            />
            <span className="text-sm text-slate-300">Multivaluado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={(data as AttributeData).isDerived ?? false}
              onChange={(e) => { handleCheckboxChange('isDerived', e.target.checked); }}
              className="w-4 h-4 rounded text-sky-500"
            />
            <span className="text-sm text-slate-300">Derivado</span>
          </label>
        </div>
      )}

      {node.type === 'relationship' && (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input 
            type="checkbox" 
            checked={(data as RelationshipData).isIdentifying ?? false}
            onChange={(e) => { handleCheckboxChange('isIdentifying', e.target.checked); }}
            className="w-4 h-4 rounded text-amber-500"
          />
          <span className="text-sm text-slate-300">Relación Identificadora</span>
        </label>
      )}
    </div>
  );
}

export function PropertiesPanel() {
  const { 
    nodes, 
    edges, 
    selectedNodeId, 
    selectedEdgeId, 
    setSelectedNodeId, 
    setSelectedEdgeId,
    deleteNode,
    deleteEdge
  } = useDiagramStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) return null;

  const closePanel = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  return (
    <aside className="w-80 border-l border-slate-800 flex flex-col z-20 overflow-y-auto" style={{ backgroundColor: '#020617' }}>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
        <h2 className="text-slate-200 font-semibold flex items-center gap-2">
          Propiedades 
          {selectedNode && selectedNode.type === 'table' && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Tabla</span>}
          {selectedNode && selectedNode.type === 'entity' && <span className="text-xs bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-full border border-fuchsia-500/30">Entidad</span>}
          {selectedNode && selectedNode.type === 'attribute' && <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">Atributo</span>}
          {selectedNode && selectedNode.type === 'relationship' && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Relación</span>}
          {selectedEdge && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Línea</span>}
        </h2>
        <button onClick={() => { closePanel(); }} className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {selectedNode && selectedNode.type === 'table' && (
          <NodePropsForm node={selectedNode} />
        )}

        {selectedNode && ['entity', 'attribute', 'relationship'].includes(String(selectedNode.type ?? "")) && (
          <ConceptualPropsForm node={selectedNode} />
        )}
        
        {selectedEdge && (
          <EdgePropsForm edge={selectedEdge as AppEdge} />
        )}
      </div>
      
      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/40">
        {selectedNode && (
          <button 
            onClick={() => { deleteNode(selectedNode.id); }}
            className="w-full py-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-medium text-sm rounded-lg border border-red-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Eliminar Nodo
          </button>
        )}
        {selectedEdge && (
          <button 
            onClick={() => { deleteEdge(selectedEdge.id); }}
            className="w-full py-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-medium text-sm rounded-lg border border-red-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Eliminar Línea
          </button>
        )}
      </div>
    </aside>
  );
}
