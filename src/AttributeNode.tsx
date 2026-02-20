import { Handle, Position } from '@xyflow/react';

export function AttributeNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`
      relative min-w-[100px] px-4 py-2 bg-slate-900 border transition-all flex items-center justify-center
      ${selected ? 'border-sky-400 shadow-sky-500/20 shadow-md' : 'border-slate-500'}
      ${data.isMultivalued ? 'border-double border-[3px]' : ''}
      ${data.isDerived ? 'border-dashed' : ''}
    `}
    style={{ borderRadius: '50%' }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-sky-400 opacity-50" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-sky-400 opacity-50" />
      
      <div className={`text-center text-slate-300 text-xs px-2
        ${data.isPrimaryKey ? 'underline font-bold decoration-sky-400 underline-offset-4' : ''}
      `}>
        {data.label || 'Attribute'}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-sky-400 opacity-50" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-sky-400 opacity-50" />
    </div>
  );
}
