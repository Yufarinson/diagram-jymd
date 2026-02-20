import { type Node, type Edge } from "@xyflow/react";

// Common Types
export type AppMode = "home" | "conceptual" | "relational" | "nosql";

// Node Data Interfaces
export interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

export interface TableData {
  tableName: string;
  columns: ColumnDef[];
  [key: string]: unknown; // satisfy Record<string, unknown> constraint of xyflow Data
}

export interface EntityData {
  label: string;
  isWeak?: boolean;
  [key: string]: unknown;
}

export interface AttributeData {
  label: string;
  isPrimaryKey?: boolean;
  isMultivalued?: boolean;
  isDerived?: boolean;
  [key: string]: unknown;
}

export interface RelationshipData {
  label: string;
  isIdentifying?: boolean;
  [key: string]: unknown;
}

export interface RelationEdgeData {
  sourceCardinality: string;
  targetCardinality: string;
  [key: string]: unknown;
}

// NoSQL Types
export type NoSQLFieldType =
  | "string"
  | "number"
  | "boolean"
  | "timestamp"
  | "geopoint"
  | "map"
  | "array"
  | "reference"
  | "null";

export interface NoSQLFieldDef {
  id: string;
  name: string;
  type: NoSQLFieldType;
  isId?: boolean;
  fields?: NoSQLFieldDef[]; // Recursion for Maps and Arrays
}

export interface DocumentData {
  collectionName: string;
  fields: NoSQLFieldDef[];
  isSubcollection?: boolean;
  parentPath?: string; // For Firestore subcollections
  [key: string]: unknown;
}

// Strictly Typed Nodes
export type AppNode =
  | Node<TableData, "table">
  | Node<EntityData, "entity">
  | Node<AttributeData, "attribute">
  | Node<RelationshipData, "relationship">
  | Node<DocumentData, "collection">;

export type AppEdge =
  | Edge<RelationEdgeData, "relation">
  | Edge<Record<string, unknown>, "default">;
