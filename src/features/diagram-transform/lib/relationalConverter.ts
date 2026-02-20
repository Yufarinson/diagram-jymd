import type { Node, Edge } from "@xyflow/react";
import type {
  EntityData,
  AttributeData,
  RelationEdgeData,
} from "../../../shared/model/types";

// Interfaces for our mapping logic
interface ColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface TableDef {
  id: string; // The original entity id
  tableName: string;
  columns: ColumnDef[];
  x: number;
  y: number;
}

export function convertToRelational(
  nodes: Node[],
  edges: Edge[],
): { newNodes: Node[]; newEdges: Edge[] } {
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];

  // 1. Encontrar todas las Entidades (se convertirán en Tablas)
  const entities = nodes.filter((n) => n.type === "entity");
  const attributes = nodes.filter((n) => n.type === "attribute");
  const relationships = nodes.filter((n) => n.type === "relationship");

  // Mapa temporal para construir las tablas
  const tablesMap = new Map<string, TableDef>();

  entities.forEach((entity) => {
    const data = entity.data as EntityData;
    tablesMap.set(entity.id, {
      id: entity.id,
      tableName: (data.label || "Entity").replace(/\s+/g, "_").toUpperCase(),
      columns: [],
      x: entity.position.x,
      y: entity.position.y,
    });
  });

  // 2. Procesar Atributos (se anidan a la entidad conectada como Columnas)
  attributes.forEach((attr) => {
    const data = attr.data as AttributeData;
    // Buscar todas las aristas que tocan este atributo
    const connectedEdges = edges.filter(
      (e) => e.source === attr.id || e.target === attr.id,
    );

    connectedEdges.forEach((edge) => {
      // El otro extremo debe ser una entidad
      const otherNodeId = edge.source === attr.id ? edge.target : edge.source;
      const otherNode = nodes.find((n) => n.id === otherNodeId);

      if (otherNode && otherNode.type === "entity") {
        const table = tablesMap.get(otherNode.id);
        if (table) {
          table.columns.push({
            name: (data.label || "col").replace(/\s+/g, "_").toLowerCase(),
            type: data.isPrimaryKey ? "INT" : "VARCHAR(255)", // Tipo simple inferido
            isPk: data.isPrimaryKey === true,
          });
        }
      }
    });
  });

  // 3. Procesar Relaciones (Rombos)
  relationships.forEach((rel) => {
    // Buscar qué entidades conecta este rombo
    const relEdges = edges.filter(
      (e) => e.source === rel.id || e.target === rel.id,
    );

    // Necesitamos al menos 2 entidades conectadas
    const connectedEntities = relEdges
      .map((e) => {
        const nodeId = e.source === rel.id ? e.target : e.source;
        return {
          nodeId,
          edge: e,
          node: nodes.find((n) => n.id === nodeId),
        };
      })
      .filter((item) => item.node?.type === "entity");

    if (connectedEntities.length === 2) {
      const entA = connectedEntities[0];
      const entB = connectedEntities[1];

      const tableA = tablesMap.get(entA.nodeId);
      const tableB = tablesMap.get(entB.nodeId);

      if (!tableA || !tableB) return;

      // Extract cardinalities. This is a heuristic based on user input on the edges connecting to the diamond
      const dataA = entA.edge.data as RelationEdgeData | undefined;
      const dataB = entB.edge.data as RelationEdgeData | undefined;

      const cardA = dataA?.targetCardinality ?? dataA?.sourceCardinality ?? "1";
      const cardB = dataB?.targetCardinality ?? dataB?.sourceCardinality ?? "1";

      const isMtoN =
        (cardA === "N" || cardA === "0..N") &&
        (cardB === "N" || cardB === "0..N");
      const is1toN =
        (cardA === "1" || cardA === "0..1") &&
        (cardB === "N" || cardB === "0..N");
      const isNto1 =
        (cardA === "N" || cardA === "0..N") &&
        (cardB === "1" || cardB === "0..1");

      if (isMtoN) {
        // Regla: Muchos a Muchos genera una nueva Tabla
        const joinTableName = `${tableA.tableName}_${tableB.tableName}`;
        const pkA =
          tableA.columns.find((c) => c.isPk)?.name ??
          `${tableA.tableName.toLowerCase()}_id`;
        const pkB =
          tableB.columns.find((c) => c.isPk)?.name ??
          `${tableB.tableName.toLowerCase()}_id`;

        const newId = `table_${String(Date.now())}_${String(Math.random())}`;

        tablesMap.set(newId, {
          id: newId,
          tableName: joinTableName,
          columns: [
            { name: pkA, type: "INT", isPk: true, isFk: true },
            { name: pkB, type: "INT", isPk: true, isFk: true },
          ],
          x: rel.position.x, // Put table exactly where the diamond was
          y: rel.position.y,
        });

        // Crear lineas de ambas a la nueva tabla
        newEdges.push(createRelationEdge(tableA.id, newId, "1", "N"));
        newEdges.push(createRelationEdge(tableB.id, newId, "1", "N"));
      } else if (is1toN) {
        // A es 1, B es N. La PK de A va a B como FK.
        const pkA = tableA.columns.find((c) => c.isPk)?.name ?? "id";
        tableB.columns.push({
          name: `${tableA.tableName.toLowerCase()}_${pkA}`,
          type: "INT",
          isFk: true,
        });
        newEdges.push(createRelationEdge(tableA.id, tableB.id, "1", "N"));
      } else if (isNto1) {
        // B es 1, A es N. La PK de B va a A como FK.
        const pkB = tableB.columns.find((c) => c.isPk)?.name ?? "id";
        tableA.columns.push({
          name: `${tableB.tableName.toLowerCase()}_${pkB}`,
          type: "INT",
          isFk: true,
        });
        newEdges.push(createRelationEdge(tableB.id, tableA.id, "1", "N"));
      } else {
        // 1 a 1: Generalmente se fusionan o la PK va de uno a otro. Lo trataremos como 1 a 1 físico
        const pkA = tableA.columns.find((c) => c.isPk)?.name ?? "id";
        tableB.columns.push({
          name: `${tableA.tableName.toLowerCase()}_${pkA}`,
          type: "INT",
          isFk: true,
        });
        newEdges.push(createRelationEdge(tableA.id, tableB.id, "1", "1"));
      }
    }
  });

  // 4. Transformar el Map a React Flow TableNodes
  Array.from(tablesMap.values()).forEach((tDef) => {
    // Si la tabla no tiene PK creada por el usuario (olvidó el óvalo), inyectarle un ID genérico para evitar errores
    if (!tDef.columns.find((c) => c.isPk)) {
      tDef.columns.unshift({ name: "id", type: "INT", isPk: true });
    }

    newNodes.push({
      id: tDef.id,
      type: "table",
      position: { x: tDef.x, y: tDef.y },
      data: {
        tableName: tDef.tableName,
        columns: tDef.columns,
      },
    });
  });

  return { newNodes, newEdges };
}

function createRelationEdge(
  sourceId: string,
  targetId: string,
  sourceCard: string,
  targetCard: string,
): Edge {
  return {
    id: `e-${sourceId}-${targetId}-${String(Date.now())}`,
    source: sourceId,
    target: targetId,
    type: "relation",
    sourceHandle: `source-${sourceId}`, // Simplificado para que el custom edge no falle (aunque requerirá layout)
    targetHandle: `target-${targetId}`,
    data: { sourceCardinality: sourceCard, targetCardinality: targetCard },
    style: { stroke: "#4ade80", strokeWidth: 2, opacity: 0.8 },
  };
}
