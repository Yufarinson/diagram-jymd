import { Handle, Position } from '@xyflow/react';
import { Database, Key, Hash, Link } from 'lucide-react';

export interface ColumnData {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

export interface TableNodeData {
  tableName: string;
  columns: ColumnData[];
}

export function TableNode({ data, isConnectable }: { data: TableNodeData; isConnectable: boolean }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl min-w-[320px] rounded-2xl border border-slate-700/60 shadow-2xl text-slate-200 font-sans transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/20">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-to-r from-slate-800 to-slate-800/80 px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-lg tracking-wide text-slate-100">{data.tableName}</h3>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-slate-950/50 text-slate-400 font-medium">TABLE</div>
      </div>
      
      {/* Body */}
      <div className="flex flex-col py-2">
        {data.columns.map((col) => (
          <div key={col.name} className="relative flex items-center justify-between px-5 py-2.5 hover:bg-slate-800/40 transition-colors group">
            
            {/* Target Handle (Left) - Inbound Relations */}
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${col.name}`}
              className={`w-3 h-3 !bg-indigo-500 !border-2 !border-slate-900 transition-all hover:scale-125 ${col.isPk || col.isFk ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              isConnectable={isConnectable}
            />

            <div className="flex items-center gap-2.5">
              {col.isPk ? (
                <Key className="w-4 h-4 text-amber-400" />
              ) : col.isFk ? (
                <Link className="w-4 h-4 text-indigo-400" />
              ) : (
                <Hash className="w-4 h-4 text-slate-500" />
              )}
              <span className={`text-sm ${col.isPk ? 'font-semibold text-amber-100' : col.isFk ? 'font-medium text-indigo-200' : 'text-slate-300'}`}>
                {col.name}
              </span>
            </div>
            
            <span className="text-xs text-slate-400 font-mono bg-slate-950/40 px-2 py-1 rounded-md">
              {col.type}
            </span>

            {/* Source Handle (Right) - Outbound Relations */}
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${col.name}`}
              className={`w-3 h-3 !bg-emerald-400 !border-2 !border-slate-900 transition-all hover:scale-125 ${col.isPk || col.isFk ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              isConnectable={isConnectable}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
