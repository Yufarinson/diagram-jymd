import { Handle, Position } from '@xyflow/react';

export function EntityNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`
      relative min-w-[120px] px-4 py-3 bg-slate-800 border-2 rounded-sm shadow-md transition-all
      ${selected ? 'border-indigo-400 shadow-indigo-500/30' : 'border-slate-600'}
      ${data.isWeak ? 'border-double border-[4px]' : ''}
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-400" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-indigo-400" />
      
      <div className="font-bold text-center text-slate-200 tracking-wider text-sm uppercase">
        {data.label || 'Entity'}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-indigo-400" />
    </div>
  );
}
