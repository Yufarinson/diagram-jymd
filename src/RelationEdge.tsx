import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import type { Edge, EdgeProps } from '@xyflow/react';
import type { CSSProperties } from 'react';

export type RelationEdgeData = {
  sourceCardinality?: string; // e.g., "1"
  targetCardinality?: string; // e.g., "N"
};

export type CustomRelationEdge = Edge<RelationEdgeData, 'relation'>;

export function RelationEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps<CustomRelationEdge>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const sCard = data?.sourceCardinality || '1';
  const tCard = data?.targetCardinality || 'N';

  // Function to calculate a point along the smoothstep path for the labels
  // We place the source label slightly after the start, and target slightly before the end
  const offset = 20;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style as CSSProperties} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourceX + (targetX > sourceX ? offset : -offset)}px,${sourceY}px)`,
            pointerEvents: 'all',
          }}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm pointer-events-auto"
        >
          {sCard}
        </div>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX - (targetX > sourceX ? offset : -offset)}px,${targetY}px)`,
            pointerEvents: 'all',
          }}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm pointer-events-auto"
        >
          {tCard}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
