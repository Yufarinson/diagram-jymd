import { Handle, Position } from '@xyflow/react';
import type { RelationshipData } from '../../../shared/model/types';

export function RelationshipNode({ data, selected }: { data: RelationshipData, selected: boolean }) {
  return (
    <div className={`
      relative min-w-[120px] h-[80px] flex items-center justify-center transition-all
      ${selected ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}
    `}>
      {/* Rombo SVG Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon 
          points="50,5 95,50 50,95 5,50" 
          className={`
            fill-slate-900 border transition-colors
            ${selected ? 'stroke-amber-400 stroke-2' : 'stroke-slate-500 stroke-1'}
            ${data.isIdentifying ? 'stroke-double stroke-[4px]' : ''}
          `}
        />
      </svg>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-amber-400 opacity-0" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-amber-400 opacity-0" />
      
      <div className="relative z-10 text-center text-slate-200 text-xs px-6 py-2">
        {data.label || 'Relation'}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-amber-400 opacity-0" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-amber-400 opacity-0" />
    </div>
  );
}
