import { emptyNodes, emptyEdges } from "./empty";
import { libraryNodes, libraryEdges } from "./library";
import { videoStoreNodes, videoStoreEdges } from "./videostore";
import { bankNodes, bankEdges } from "./bank";
import { coopNodes, coopEdges } from "./coop";
import { academicNodes, academicEdges } from "./academic";
import type { Node, Edge } from "@xyflow/react";

export interface Exercise {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const EXERCISES: Exercise[] = [
  {
    id: "empty",
    name: "Lienzo en Blanco",
    nodes: emptyNodes,
    edges: emptyEdges,
  },
  {
    id: "library",
    name: "Ej. 1: Gestión de Biblioteca",
    nodes: libraryNodes,
    edges: libraryEdges,
  },
  {
    id: "videostore",
    name: "Ej. 2: Gestión de Videotienda",
    nodes: videoStoreNodes,
    edges: videoStoreEdges,
  },
  {
    id: "bank",
    name: "Ej. 3: Sistema Bancario (Herencia)",
    nodes: bankNodes,
    edges: bankEdges,
  },
  {
    id: "coop",
    name: "Ej. 4: Cooperativa Servir",
    nodes: coopNodes,
    edges: coopEdges,
  },
  {
    id: "academic",
    name: "Ej. 5: Calificaciones Académicas",
    nodes: academicNodes,
    edges: academicEdges,
  },
];

// Helper para obtener un ejercicio por ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISES.find((ex) => ex.id === id);
};
