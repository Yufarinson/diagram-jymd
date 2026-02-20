import { create } from "zustand";
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import type { AppNode, AppEdge, AppMode } from "../../shared/model/types";

interface DiagramState {
  appMode: AppMode;
  nodes: AppNode[];
  edges: AppEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Actions
  setAppMode: (mode: AppMode) => void;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;

  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (node: AppNode) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  updateEdgeData: (id: string, data: Record<string, unknown>) => void;
  deleteEdge: (id: string) => void;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  appMode: "home",
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  setAppMode: (mode) => {
    set({ appMode: mode });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },
  setSelectedEdgeId: (id) => {
    set({ selectedEdgeId: id });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as AppEdge[],
    });
  },

  onConnect: (connection) => {
    const isConceptual = get().appMode === "conceptual";

    // Auto-detect if we're connecting an attribute to an entity
    const sourceNode = get().nodes.find((n) => n.id === connection.source);
    const targetNode = get().nodes.find((n) => n.id === connection.target);

    const isAttrConnection =
      (sourceNode?.type === "attribute" && targetNode?.type === "entity") ||
      (sourceNode?.type === "entity" && targetNode?.type === "attribute");

    const edgeType = isConceptual && !isAttrConnection ? "relation" : "default";

    const newEdge: AppEdge = {
      ...connection,
      id: `e${connection.source}-${connection.target}-${String(Date.now())}`,
      type: edgeType,
      data:
        edgeType === "relation"
          ? { sourceCardinality: "1", targetCardinality: "1" }
          : undefined,
      style: isConceptual ? { stroke: "#94a3b8", strokeWidth: 2 } : undefined,
    } as AppEdge;

    set({
      edges: addEdge(newEdge, get().edges) as AppEdge[],
    });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node], selectedNodeId: node.id });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }) as AppNode[],
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === id) {
          return { ...edge, data: { ...edge.data, ...data } };
        }
        return edge;
      }) as AppEdge[],
    });
  },

  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
      selectedEdgeId: get().selectedEdgeId === id ? null : get().selectedEdgeId,
    });
  },
}));
