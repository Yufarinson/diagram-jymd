import { useCallback } from "react";
import { useDiagramStore } from "../../../entities/store/diagramStore";
import { convertToRelational } from "../lib/relationalConverter";
import { getLayoutedElements } from "../../../shared/lib/layoutUtils";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import type { AppNode, AppEdge } from "../../../shared/model/types";

export function useTransform() {
  const { nodes, edges, setNodes, setEdges } = useDiagramStore();
  const { fitView } = useReactFlow();

  const transformToRelational = useCallback(() => {
    const { newNodes, newEdges } = convertToRelational(
      nodes as Node[],
      edges as Edge[],
    );

    if (newNodes.length === 0) {
      alert("No hay entidades conceptuales para convertir.");
      return;
    }

    // Replace current canvas with new relational data
    setNodes(newNodes as AppNode[]);
    setEdges(newEdges as AppEdge[]);

    // Run auto-layout on the new relational nodes
    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges, "LR");
      setNodes(layoutedNodes as AppNode[]);
      setEdges(layoutedEdges as AppEdge[]);
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }, 50);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  return { transformToRelational };
}
