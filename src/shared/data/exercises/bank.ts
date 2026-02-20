import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const bankNodes: Node[] = [
  {
    id: "sucursal",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "SUCURSAL",
      columns: [
        { name: "num_sucursal", type: "INT", isPk: true },
        { name: "direccion", type: "VARCHAR(200)" },
        { name: "telefono", type: "VARCHAR(20)" },
        { name: "ciudad", type: "VARCHAR(100)" },
      ],
    },
  },
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
        { name: "num_sucursal", type: "INT", isFk: true },
      ],
    },
  },
  {
    id: "persona",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "PERSONA",
      columns: [
        { name: "codigo_cliente", type: "INT", isPk: true, isFk: true },
        { name: "fecha_nacimiento", type: "DATE" },
        { name: "genero", type: "VARCHAR(20)" },
      ],
    },
  },
  {
    id: "organizacion",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "ORGANIZACION",
      columns: [
        { name: "codigo_cliente", type: "INT", isPk: true, isFk: true },
        { name: "tipo_organizacion", type: "VARCHAR(50)" },
        { name: "representante", type: "VARCHAR(100)" },
        { name: "num_empleados", type: "INT" },
      ],
    },
  },
  {
    id: "cuenta",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CUENTA",
      columns: [
        { name: "num_cuenta", type: "VARCHAR(20)", isPk: true },
        { name: "saldo_actual", type: "DECIMAL(15,2)" },
        { name: "saldo_promedio", type: "DECIMAL(15,2)" },
        { name: "codigo_cliente", type: "INT", isFk: true },
        { name: "num_sucursal", type: "INT", isFk: true },
      ],
    },
  },
  {
    id: "cuenta_ahorro",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CUENTA_AHORRO",
      columns: [
        { name: "num_cuenta", type: "VARCHAR(20)", isPk: true, isFk: true },
        { name: "tasa_interes", type: "DECIMAL(5,2)" },
      ],
    },
  },
  {
    id: "cuenta_corriente",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CUENTA_CORRIENTE",
      columns: [
        { name: "num_cuenta", type: "VARCHAR(20)", isPk: true, isFk: true },
        { name: "limite_sobregiro", type: "DECIMAL(15,2)" },
      ],
    },
  },
];

export const bankEdges: Edge[] = [
  // Relaciones 1:N
  {
    id: "e-sucursal-cliente",
    source: "sucursal",
    target: "cliente",
    sourceHandle: "source-num_sucursal",
    targetHandle: "target-num_sucursal",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-sucursal-cuenta",
    source: "sucursal",
    target: "cuenta",
    sourceHandle: "source-num_sucursal",
    targetHandle: "target-num_sucursal",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fbbf24", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" },
  },
  {
    id: "e-cliente-cuenta",
    source: "cliente",
    target: "cuenta",
    sourceHandle: "source-codigo_cliente",
    targetHandle: "target-codigo_cliente",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#38bdf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
  },

  // Herencia / Especialización (1:1)
  {
    id: "e-cliente-persona",
    source: "cliente",
    target: "persona",
    sourceHandle: "source-codigo_cliente",
    targetHandle: "target-codigo_cliente",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "1" },
    style: { stroke: "#94a3b8", strokeWidth: 2, strokeDasharray: "5,5" }, // Línea punteada para herencia
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
  {
    id: "e-cliente-organizacion",
    source: "cliente",
    target: "organizacion",
    sourceHandle: "source-codigo_cliente",
    targetHandle: "target-codigo_cliente",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "1" },
    style: { stroke: "#94a3b8", strokeWidth: 2, strokeDasharray: "5,5" }, // Línea punteada para herencia
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
  },
  {
    id: "e-cuenta-ahorro",
    source: "cuenta",
    target: "cuenta_ahorro",
    sourceHandle: "source-num_cuenta",
    targetHandle: "target-num_cuenta",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "1" },
    style: { stroke: "#a78bfa", strokeWidth: 2, strokeDasharray: "5,5" }, // Línea punteada para herencia
    markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" },
  },
  {
    id: "e-cuenta-corriente",
    source: "cuenta",
    target: "cuenta_corriente",
    sourceHandle: "source-num_cuenta",
    targetHandle: "target-num_cuenta",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "1" },
    style: { stroke: "#a78bfa", strokeWidth: 2, strokeDasharray: "5,5" }, // Línea punteada para herencia
    markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" },
  },
];
