import { useCallback } from "react";
import { useDiagramStore } from "../../../entities/store/diagramStore";
import { convertToRelational } from "../lib/relationalConverter";
import { getLayoutedElements } from "../../../shared/lib/layoutUtils";
import { useReactFlow } from "@xyflow/react";

export function useTransform() {
  const { nodes, edges, setNodes, setEdges } = useDiagramStore();
  const { fitView } = useReactFlow();

  const transformToRelational = useCallback(() => {
    const { newNodes, newEdges } = convertToRelational(
      nodes as any,
      edges as any,
    );

    if (newNodes.length === 0) {
      alert("No hay entidades conceptuales para convertir.");
      return;
    }

    // Replace current canvas with new relational data
    setNodes(newNodes as any);
    setEdges(newEdges as any);

    // Run auto-layout on the new relational nodes
    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges, "LR");
      setNodes(layoutedNodes as any);
      setEdges(layoutedEdges as any);
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }, 50);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  return { transformToRelational };
}
