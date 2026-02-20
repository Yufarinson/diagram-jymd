import { Handle, Position } from '@xyflow/react';
import { Files, FileJson, Hash, Type, ToggleLeft, Calendar, MapPin, List, Link } from 'lucide-react';
import type { DocumentData, NoSQLFieldDef } from '../../../shared/model/types';

const FieldIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'string': return <Type className="w-3.5 h-3.5 text-sky-400" />;
    case 'number': return <Hash className="w-3.5 h-3.5 text-amber-400" />;
    case 'boolean': return <ToggleLeft className="w-3.5 h-3.5 text-emerald-400" />;
    case 'timestamp': return <Calendar className="w-3.5 h-3.5 text-rose-400" />;
    case 'geopoint': return <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />;
    case 'map': return <FileJson className="w-3.5 h-3.5 text-indigo-400" />;
    case 'array': return <List className="w-3.5 h-3.5 text-blue-400" />;
    case 'reference': return <Link className="w-3.5 h-3.5 text-orange-400" />;
    default: return <Type className="w-3.5 h-3.5 text-slate-500" />;
  }
};

function FieldItem({ field, depth = 0 }: { field: NoSQLFieldDef; depth?: number }) {
  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center justify-between px-5 py-2 hover:bg-slate-800/40 transition-colors group relative"
        style={{ paddingLeft: `${(20 + depth * 16).toString()}px` }}
      >
        <div className="flex items-center gap-2.5">
          <FieldIcon type={field.type} />
          <span className={`text-sm ${field.isId ? 'font-bold text-amber-200' : 'text-slate-300'}`}>
            {field.name}
            {field.isId && <span className="ml-1.5 text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded uppercase tracking-tighter">ID</span>}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono uppercase opacity-60">
          {field.type}
        </span>

        {/* Handles only for top level fields for clarity */}
        {depth === 0 && (
          <>
            <Handle 
              type="target" 
              position={Position.Left} 
              id={`target-${field.id}`} 
              className="!w-2 !h-2 !bg-slate-700 !border-slate-400 !opacity-0 group-hover:!opacity-100" 
            />
            <Handle 
              type="source" 
              position={Position.Right} 
              id={`source-${field.id}`} 
              className="!w-2 !h-2 !bg-emerald-500 !border-slate-400 !opacity-0 group-hover:!opacity-100" 
            />
          </>
        )}
      </div>
      
      {field.fields && (
        <div className="border-l border-slate-800/50 ml-6">
          {field.fields.map(subField => (
            <FieldItem key={subField.id} field={subField} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CollectionNode({ data }: { data: DocumentData }) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl min-w-[280px] rounded-2xl border border-slate-700/50 shadow-2xl text-slate-200 font-sans transition-all hover:border-emerald-500/40 hover:shadow-emerald-500/10">
      {/* Target handle for the whole collection (e.g. for sub-collection pointer) */}
      <Handle type="target" position={Position.Top} className="!bg-indigo-400 !w-3 !h-3 !border-slate-900" />
      
      <div className={`rounded-t-2xl px-5 py-3 border-b border-slate-700/50 flex items-center justify-between ${data.isSubcollection ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
        <div className="flex items-center gap-3">
          <Files className={`w-5 h-5 ${data.isSubcollection ? 'text-indigo-400' : 'text-emerald-400'}`} />
          <h3 className="font-bold text-base tracking-tight text-slate-100">{data.collectionName}</h3>
        </div>
        <div className="text-[9px] px-2 py-0.5 rounded shadow-sm bg-slate-950/80 text-slate-400 font-bold tracking-widest uppercase border border-slate-800">
          {data.isSubcollection ? 'Sub-Collection' : 'Collection'}
        </div>
      </div>
      
      <div className="flex flex-col py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {data.fields.length > 0 ? (
          data.fields.map((field) => (
            <FieldItem key={field.id} field={field} />
          ))
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-xs text-slate-500 italic">Sin campos definidos</p>
          </div>
        )}
      </div>
      
      {/* Source handle for the whole collection */}
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-3 !h-3 !border-slate-900" />
    </div>
  );
}
