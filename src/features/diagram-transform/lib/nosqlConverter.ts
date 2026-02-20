import { type Node, type Edge } from "@xyflow/react";
import type {
  EntityData,
  AttributeData,
  DocumentData,
  NoSQLFieldDef,
  NoSQLFieldType,
  AppNode,
  AppEdge,
  RelationEdgeData,
} from "../../../shared/model/types";

export function convertToNoSQL(
  nodes: Node[],
  edges: Edge[],
): { newNodes: AppNode[]; newEdges: AppEdge[] } {
  const conceptualEntities = nodes.filter((n) => n.type === "entity");
  const conceptualAttributes = nodes.filter((n) => n.type === "attribute");
  const conceptualRelationships = nodes.filter(
    (n) => n.type === "relationship",
  );

  const newNodes: AppNode[] = [];
  const newEdges: AppEdge[] = [];

  // 1. Convert ENTITIES to COLLECTIONS
  conceptualEntities.forEach((entityNode) => {
    const data = entityNode.data as EntityData;
    const collectionId = `nosql-${entityNode.id}`;

    // Find connected attributes
    const connectedAttributeNodes = edges
      .filter(
        (edge) =>
          edge.source === entityNode.id || edge.target === entityNode.id,
      )
      .map((edge) => {
        const otherId =
          edge.source === entityNode.id ? edge.target : edge.source;
        return conceptualAttributes.find((attr) => attr.id === otherId);
      })
      .filter(Boolean) as Node[];

    const fields: NoSQLFieldDef[] = connectedAttributeNodes.map((attrNode) => {
      const attrData = attrNode.data as AttributeData;
      let fieldType: NoSQLFieldType = "string";

      // Basic type inference
      const label = attrData.label;
      const labelLower = label.toLowerCase();
      if (labelLower.includes("fecha") || labelLower.includes("date")) {
        fieldType = "timestamp";
      } else if (
        labelLower.includes("monto") ||
        labelLower.includes("precio") ||
        labelLower.includes("cantidad")
      ) {
        fieldType = "number";
      } else if (labelLower.startsWith("es_") || labelLower.startsWith("is_")) {
        fieldType = "boolean";
      }

      return {
        id: `f-${attrNode.id}`,
        name: label.toLowerCase().replace(/\s+/g, "_"),
        type: fieldType,
        isId: attrData.isPrimaryKey,
      };
    });

    // If no PK was found, add a default ID field
    if (!fields.some((f) => f.isId)) {
      fields.unshift({
        id: `f-id-${entityNode.id}`,
        name: "id",
        type: "string",
        isId: true,
      });
    }

    const collectionNode: AppNode = {
      id: collectionId,
      type: "collection",
      position: { ...entityNode.position },
      data: {
        collectionName: data.label.toLowerCase().replace(/\s+/g, "_") + "s",
        fields,
      },
    };

    newNodes.push(collectionNode);
  });

  // 2. Handle RELATIONSHIPS (References)
  conceptualRelationships.forEach((relNode) => {
    const connectedEdges = edges.filter(
      (edge) => edge.source === relNode.id || edge.target === relNode.id,
    );

    const entities = connectedEdges
      .map((edge) => {
        const otherId = edge.source === relNode.id ? edge.target : edge.source;
        const entity = conceptualEntities.find((e) => e.id === otherId);
        return { entity, edge };
      })
      .filter((e) => e.entity);

    if (entities.length === 2) {
      const [e1, e2] = entities;
      if (!e1.entity || !e2.entity) return;

      const card1 =
        (e1.edge.data as RelationEdgeData | undefined)?.targetCardinality ??
        "1";
      const card2 =
        (e2.edge.data as RelationEdgeData | undefined)?.targetCardinality ??
        "1";

      const coll1 = newNodes.find(
        (n) => n.id === `nosql-${e1.entity?.id ?? "unknown"}`,
      );
      const coll2 = newNodes.find(
        (n) => n.id === `nosql-${e2.entity?.id ?? "unknown"}`,
      );

      if (!coll1 || !coll2) return;

      // We need to access data, and coll1 is AppNode, so data can be any of the union.
      // Since type is 'collection', it's DocumentData.
      const coll1Data = coll1.data as DocumentData;
      const coll2Data = coll2.data as DocumentData;

      const e1Label = (e1.entity.data as EntityData).label.toLowerCase();
      const e2Label = (e2.entity.data as EntityData).label.toLowerCase();

      // 1:N Relationship -> Reference in the "N" side
      if (card1 === "1" && (card2 === "N" || card2 === "0..N")) {
        coll2Data.fields.push({
          id: `ref-${relNode.id}`,
          name: `${e1Label}_id`,
          type: "reference",
        });
      } else if (card2 === "1" && (card1 === "N" || card1 === "0..N")) {
        coll1Data.fields.push({
          id: `ref-${relNode.id}`,
          name: `${e2Label}_id`,
          type: "reference",
        });
      }
      // N:M Relationship -> Reference arrays in both
      else if (
        (card1 === "N" || card1 === "0..N") &&
        (card2 === "N" || card2 === "0..N")
      ) {
        coll1Data.fields.push({
          id: `ref-${relNode.id}-1`,
          name: `${e2Label}_ids`,
          type: "array",
        });
        coll2Data.fields.push({
          id: `ref-${relNode.id}-2`,
          name: `${e1Label}_ids`,
          type: "array",
        });
      }
    }
  });

  return { newNodes, newEdges };
}
