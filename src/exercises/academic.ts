import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const academicNodes: Node[] = [
  {
    id: "estudiante",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "ESTUDIANTE",
      columns: [
        { name: "carnet", type: "VARCHAR(20)", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "apellido", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "telefono", type: "VARCHAR(20)" },
      ],
    },
  },
  {
    id: "profesor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "PROFESOR",
      columns: [
        { name: "id_profesor", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "especialidad", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "periodo_academico",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "PERIODO_ACADEMICO",
      columns: [
        { name: "id_periodo", type: "INT", isPk: true },
        { name: "semestre", type: "VARCHAR(10)" },
        { name: "ano", type: "INT" },
        { name: "fecha_inicio", type: "DATE" },
        { name: "fecha_fin", type: "DATE" },
      ],
    },
  },
  {
    id: "materia",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "MATERIA",
      columns: [
        { name: "codigo_materia", type: "VARCHAR(10)", isPk: true },
        { name: "nombre_materia", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "matricula",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "MATRICULA",
      columns: [
        { name: "id_matricula", type: "INT", isPk: true },
        { name: "carnet", type: "VARCHAR(20)", isFk: true },
        { name: "codigo_materia", type: "VARCHAR(10)", isFk: true },
        { name: "id_periodo", type: "INT", isFk: true },
        { name: "id_profesor", type: "INT", isFk: true },
        { name: "promedio_final", type: "DECIMAL(3,1)" },
      ],
    },
  },
  {
    id: "tipo_examen",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "TIPO_EXAMEN",
      columns: [
        { name: "id_tipo_examen", type: "INT", isPk: true },
        { name: "nombre_tipo", type: "VARCHAR(50)" },
        { name: "porcentaje", type: "DECIMAL(5,2)" },
      ],
    },
  },
  {
    id: "nota",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "NOTA",
      columns: [
        { name: "id_nota", type: "INT", isPk: true },
        { name: "id_matricula", type: "INT", isFk: true },
        { name: "id_tipo_examen", type: "INT", isFk: true },
        { name: "calificacion", type: "DECIMAL(3,1)" },
      ],
    },
  },
];

export const academicEdges: Edge[] = [
  // Hacia MATRICULA (La Estrella central)
  {
    id: "e-estudiante-matricula",
    source: "estudiante",
    target: "matricula",
    sourceHandle: "source-carnet",
    targetHandle: "target-carnet",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-materia-matricula",
    source: "materia",
    target: "matricula",
    sourceHandle: "source-codigo_materia",
    targetHandle: "target-codigo_materia",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#818cf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
  },
  {
    id: "e-periodo-matricula",
    source: "periodo_academico",
    target: "matricula",
    sourceHandle: "source-id_periodo",
    targetHandle: "target-id_periodo",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#f472b6", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f472b6" },
  },
  {
    id: "e-profesor-matricula",
    source: "profesor",
    target: "matricula",
    sourceHandle: "source-id_profesor",
    targetHandle: "target-id_profesor",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fbbf24", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" },
  },

  // Desde MATRICULA hacia abajo
  {
    id: "e-matricula-nota",
    source: "matricula",
    target: "nota",
    sourceHandle: "source-id_matricula",
    targetHandle: "target-id_matricula",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#c084fc", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#c084fc" },
  },
  {
    id: "e-tipoexamen-nota",
    source: "tipo_examen",
    target: "nota",
    sourceHandle: "source-id_tipo_examen",
    targetHandle: "target-id_tipo_examen",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#38bdf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
  },
];
