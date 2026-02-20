import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import type { AppEdge, RelationEdgeData } from '../../../shared/model/types';
import { useDiagramStore } from '../../../entities/store/diagramStore';

export function RelationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<AppEdge>) {
  const { deleteEdge } = useDiagramStore();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationData = data as RelationEdgeData | undefined;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${String(labelX)}px,${String(labelY)}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center group"
        >
          <div className="flex items-center bg-slate-900 border border-emerald-500/30 px-2 py-0.5 rounded-md shadow-lg shadow-emerald-500/10 gap-2">
            <span className="text-[10px] font-bold text-emerald-400 font-mono">{relationData?.sourceCardinality ?? '1'}</span>
            <div className="w-px h-2 bg-slate-700"></div>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">{relationData?.targetCardinality ?? 'N'}</span>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); deleteEdge(id); }}
            className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-0.5 rounded-full shadow-md hover:bg-red-600"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
