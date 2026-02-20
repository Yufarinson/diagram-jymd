import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const coopNodes: Node[] = [
  {
    id: "modalidad",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "MODALIDAD",
      columns: [
        { name: "id_modalidad", type: "INT", isPk: true },
        { name: "nombre_modalidad", type: "VARCHAR(50)" },
        { name: "plazo_maximo", type: "INT" },
        { name: "tasa_interes", type: "DECIMAL(5,2)" },
      ],
    },
  },
  {
    id: "empresa",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "EMPRESA",
      columns: [
        { name: "id_empresa", type: "INT", isPk: true },
        { name: "nombre_empresa", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "telefono", type: "VARCHAR(20)" },
        { name: "sector", type: "VARCHAR(50)" },
      ],
    },
  },
  {
    id: "codeudor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CODEUDOR",
      columns: [
        { name: "id_codeudor", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "telefono", type: "VARCHAR(20)" },
        { name: "documento_id", type: "VARCHAR(20)" },
        { name: "salario", type: "DECIMAL(15,2)" },
      ],
    },
  },
  {
    id: "socio",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "SOCIO",
      columns: [
        { name: "id_socio", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "fecha_nacimiento", type: "DATE" },
        { name: "telefono", type: "VARCHAR(20)" },
        { name: "id_empresa", type: "INT", isFk: true },
      ],
    },
  },
  {
    id: "prestamo",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "PRESTAMO",
      columns: [
        { name: "num_prestamo", type: "INT", isPk: true },
        { name: "fecha_inicio", type: "DATE" },
        { name: "valor_prestamo", type: "DECIMAL(15,2)" },
        { name: "cuota_mensual", type: "DECIMAL(15,2)" },
        { name: "plazo_meses", type: "INT" },
        { name: "id_socio", type: "INT", isFk: true },
        { name: "id_modalidad", type: "INT", isFk: true },
        { name: "id_codeudor", type: "INT", isFk: true },
      ],
    },
  },
];

export const coopEdges: Edge[] = [
  {
    id: "e-modalidad-prestamo",
    source: "modalidad",
    target: "prestamo",
    sourceHandle: "source-id_modalidad",
    targetHandle: "target-id_modalidad",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-socio-prestamo",
    source: "socio",
    target: "prestamo",
    sourceHandle: "source-id_socio",
    targetHandle: "target-id_socio",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#818cf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
  },
  {
    id: "e-empresa-socio",
    source: "empresa",
    target: "socio",
    sourceHandle: "source-id_empresa",
    targetHandle: "target-id_empresa",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#f472b6", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f472b6" },
  },
  {
    id: "e-codeudor-prestamo",
    source: "codeudor",
    target: "prestamo",
    sourceHandle: "source-id_codeudor",
    targetHandle: "target-id_codeudor",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fbbf24", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" },
  },
];
