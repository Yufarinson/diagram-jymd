import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const emptyNodes: Node[] = [
  {
    id: "ejemplo_tabla_1",
    type: "table",
    position: { x: 50, y: 50 },
    data: {
      tableName: "Ejemplo_1",
      columns: [
        { name: "id", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(50)" },
      ],
    },
  },
  {
    id: "ejemplo_tabla_2",
    type: "table",
    position: { x: 450, y: 50 },
    data: {
      tableName: "Ejemplo_2",
      columns: [
        { name: "id", type: "INT", isPk: true },
        { name: "ejemplo_1_id", type: "INT", isFk: true },
        { name: "descripcion", type: "TEXT" },
      ],
    },
  },
];

export const emptyEdges: Edge[] = [
  {
    id: "e-ejemplo-1-2",
    source: "ejemplo_tabla_1",
    target: "ejemplo_tabla_2",
    sourceHandle: "source-id",
    targetHandle: "target-ejemplo_1_id",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
];
