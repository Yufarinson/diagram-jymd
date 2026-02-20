import { useCallback } from "react";
import { useDiagramStore } from "../../../entities/store/diagramStore";
import { convertToRelational } from "../lib/relationalConverter";
import { convertToNoSQL } from "../lib/nosqlConverter";
import { getLayoutedElements } from "../../../shared/lib/layoutUtils";
import { useReactFlow } from "@xyflow/react";

export function useTransform() {
  const { nodes, edges, setNodes, setEdges, setAppMode } = useDiagramStore();
  const { fitView } = useReactFlow();

  const transformToRelational = useCallback(() => {
    const { newNodes, newEdges } = convertToRelational(nodes, edges);

    if (newNodes.length === 0) {
      alert("No hay entidades conceptuales para convertir.");
      return;
    }

    // Replace current canvas with new relational data
    setNodes(newNodes);
    setEdges(newEdges);
    setAppMode("relational");

    // Run auto-layout on the new relational nodes
    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges, "LR");
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }, 50);
  }, [nodes, edges, setNodes, setEdges, setAppMode, fitView]);

  const transformToNoSQL = useCallback(() => {
    const { newNodes, newEdges } = convertToNoSQL(nodes, edges);

    if (newNodes.length === 0) {
      alert("No hay entidades conceptuales para convertir.");
      return;
    }

    // Switch to nosql mode implicitly
    setNodes(newNodes);
    setEdges(newEdges);
    setAppMode("nosql");

    setTimeout(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges, "LR");
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
    }, 50);
  }, [nodes, edges, setNodes, setEdges, setAppMode, fitView]);

  return { transformToRelational, transformToNoSQL };
}
