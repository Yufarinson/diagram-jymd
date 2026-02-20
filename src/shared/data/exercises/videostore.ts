import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const videoStoreNodes: Node[] = [
  {
    id: "cliente",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CLIENTE",
      columns: [
        { name: "codigo_cliente", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "correo_electronico", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "video",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "VIDEO",
      columns: [
        { name: "codigo_video", type: "INT", isPk: true },
        { name: "titulo", type: "VARCHAR(200)" },
        { name: "idioma", type: "VARCHAR(50)" },
        { name: "duracion", type: "INT" },
        { name: "id_formato", type: "INT", isFk: true },
        { name: "id_genero", type: "INT", isFk: true },
        { name: "id_director", type: "INT", isFk: true },
      ],
    },
  },
  {
    id: "alquiler",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "ALQUILER",
      columns: [
        { name: "id_alquiler", type: "INT", isPk: true },
        { name: "codigo_cliente", type: "INT", isFk: true },
        { name: "codigo_video", type: "INT", isFk: true },
        { name: "fecha_alquiler", type: "DATE" },
        { name: "fecha_devolucion", type: "DATE" },
        { name: "valor_alquiler", type: "DECIMAL(10,2)" },
        { name: "dias_retraso", type: "INT" },
      ],
    },
  },
  {
    id: "formato",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "FORMATO",
      columns: [
        { name: "id_formato", type: "INT", isPk: true },
        { name: "nombre_formato", type: "VARCHAR(20)" },
        { name: "valor_base_alquiler", type: "DECIMAL(10,2)" },
      ],
    },
  },
  {
    id: "genero",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "GENERO",
      columns: [
        { name: "id_genero", type: "INT", isPk: true },
        { name: "nombre_genero", type: "VARCHAR(50)" },
      ],
    },
  },
  {
    id: "director",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "DIRECTOR",
      columns: [
        { name: "id_director", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "nacionalidad", type: "VARCHAR(50)" },
      ],
    },
  },
  {
    id: "actor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "ACTOR",
      columns: [
        { name: "id_actor", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "video_actor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "VIDEO_ACTOR",
      columns: [
        { name: "codigo_video", type: "INT", isPk: true, isFk: true },
        { name: "id_actor", type: "INT", isPk: true, isFk: true },
      ],
    },
  },
];

export const videoStoreEdges: Edge[] = [
  {
    id: "e-cliente-alquiler",
    source: "cliente",
    target: "alquiler",
    sourceHandle: "source-codigo_cliente",
    targetHandle: "target-codigo_cliente",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-video-alquiler",
    source: "video",
    target: "alquiler",
    sourceHandle: "source-codigo_video",
    targetHandle: "target-codigo_video",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#818cf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
  },
  {
    id: "e-formato-video",
    source: "formato",
    target: "video",
    sourceHandle: "source-id_formato",
    targetHandle: "target-id_formato",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#f472b6", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f472b6" },
  },
  {
    id: "e-genero-video",
    source: "genero",
    target: "video",
    sourceHandle: "source-id_genero",
    targetHandle: "target-id_genero",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fbbf24", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" },
  },
  {
    id: "e-director-video",
    source: "director",
    target: "video",
    sourceHandle: "source-id_director",
    targetHandle: "target-id_director",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#c084fc", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#c084fc" },
  },
  {
    id: "e-video-video_actor",
    source: "video",
    target: "video_actor",
    sourceHandle: "source-codigo_video",
    targetHandle: "target-codigo_video",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#38bdf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
  },
  {
    id: "e-actor-video_actor",
    source: "actor",
    target: "video_actor",
    sourceHandle: "source-id_actor",
    targetHandle: "target-id_actor",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fb923c", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fb923c" },
  },
];
