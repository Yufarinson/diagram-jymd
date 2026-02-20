import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";

export const libraryNodes: Node[] = [
  {
    id: "usuario",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "USUARIO",
      columns: [
        { name: "num_carnet", type: "VARCHAR(20)", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
        { name: "direccion", type: "VARCHAR(200)" },
      ],
    },
  },
  {
    id: "libro",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "LIBRO",
      columns: [
        { name: "codigo", type: "VARCHAR(20)", isPk: true },
        { name: "titulo", type: "VARCHAR(200)" },
        { name: "num_paginas", type: "INT" },
        { name: "clave_clase", type: "VARCHAR(10)", isFk: true },
        { name: "id_editorial", type: "INT", isFk: true },
      ],
    },
  },
  {
    id: "clase",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "CLASE",
      columns: [
        { name: "clave", type: "VARCHAR(10)", isPk: true },
        { name: "descripcion", type: "VARCHAR(100)" },
        { name: "tiempo_max_prestamo", type: "INT" },
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
        { name: "id_prestamo", type: "INT", isPk: true },
        { name: "num_carnet", type: "VARCHAR(20)", isFk: true },
        { name: "codigo_libro", type: "VARCHAR(20)", isFk: true },
        { name: "fecha_inicio", type: "DATE" },
        { name: "fecha_devolucion", type: "DATE" },
      ],
    },
  },
  {
    id: "autor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "AUTOR",
      columns: [
        { name: "id_autor", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "editorial",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "EDITORIAL",
      columns: [
        { name: "id_editorial", type: "INT", isPk: true },
        { name: "nombre", type: "VARCHAR(100)" },
      ],
    },
  },
  {
    id: "libro_autor",
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: "LIBRO_AUTOR",
      columns: [
        { name: "codigo_libro", type: "VARCHAR(20)", isPk: true, isFk: true },
        { name: "id_autor", type: "INT", isPk: true, isFk: true },
      ],
    },
  },
];

export const libraryEdges: Edge[] = [
  {
    id: "e-usuario-prestamo",
    source: "usuario",
    target: "prestamo",
    sourceHandle: "source-num_carnet",
    targetHandle: "target-num_carnet",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-libro-prestamo",
    source: "libro",
    target: "prestamo",
    sourceHandle: "source-codigo",
    targetHandle: "target-codigo_libro",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#818cf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
  },
  {
    id: "e-clase-libro",
    source: "clase",
    target: "libro",
    sourceHandle: "source-clave",
    targetHandle: "target-clave_clase",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#f472b6", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f472b6" },
  },
  {
    id: "e-editorial-libro",
    source: "editorial",
    target: "libro",
    sourceHandle: "source-id_editorial",
    targetHandle: "target-id_editorial",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#fbbf24", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" },
  },
  {
    id: "e-libro-libro_autor",
    source: "libro",
    target: "libro_autor",
    sourceHandle: "source-codigo",
    targetHandle: "target-codigo_libro",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#38bdf8", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
  },
  {
    id: "e-autor-libro_autor",
    source: "autor",
    target: "libro_autor",
    sourceHandle: "source-id_autor",
    targetHandle: "target-id_autor",
    type: "relation",
    data: { sourceCardinality: "1", targetCardinality: "N" },
    style: { stroke: "#a78bfa", strokeWidth: 2, opacity: 0.8 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" },
  },
];
