import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { Maximize2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BlackboardNode } from "../../shared/api/types";
import {
  BLACKBOARD_NODE_STATUS_COLOR,
  BLACKBOARD_NODE_STATUS_LABEL,
  BLACKBOARD_NODE_TYPE_COLOR,
  BLACKBOARD_NODE_TYPE_LABEL,
} from "../../shared/lib/labels";
import { formatDateTime } from "../../shared/lib/date";

cytoscape.use(fcose);

const FIT_PADDING = 64;
const MIN_ZOOM = 0.06;
const MAX_ZOOM = 4;
const WHEEL_SENSITIVITY = 1.6;
const NODE_SIZE = 14;
const CONTROL_ZOOM_FACTOR = 1.45;

type GraphElements = cytoscape.ElementDefinition[];

export function BlackboardGraphCanvas({ nodes }: { nodes: BlackboardNode[] }) {
  const graphRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const layoutRef = useRef<cytoscape.Layouts | null>(null);

  const elements = useMemo(() => buildGraphElements(nodes), [nodes]);

  useEffect(() => {
    if (!graphRef.current || cyRef.current) return;
    const cy = cytoscape({
      container: graphRef.current,
      elements: [],
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      wheelSensitivity: WHEEL_SENSITIVITY,
      boxSelectionEnabled: false,
      hideLabelsOnViewport: true,
      style: blackboardStyles(),
    });
    cyRef.current = cy;

    const observer = new ResizeObserver(() => {
      cy.resize();
      cy.fit(undefined, FIT_PADDING);
    });
    observer.observe(graphRef.current);

    return () => {
      observer.disconnect();
      layoutRef.current?.stop();
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    layoutRef.current?.stop();
    layoutRef.current = null;
    cy.elements().remove();
    if (!nodes.length) return;

    cy.add(elements);
    const layout = cy.layout({
      name: "fcose",
      // @ts-expect-error fcose-specific option not in base types
      quality: "proof",
      randomize: true,
      animate: false,
      fit: true,
      padding: FIT_PADDING,
      nodeDimensionsIncludeLabels: true,
      uniformNodeDimensions: false,
      packComponents: false,
      nodeSeparation: 180,
      nodeRepulsion: 16000,
      idealEdgeLength: 220,
      edgeElasticity: 0.22,
      gravity: 0.06,
      gravityRange: 7,
      numIter: 2500,
      stop: () => {
        cy.fit(undefined, FIT_PADDING);
        layoutRef.current = null;
      },
    });
    layoutRef.current = layout;
    layout.run();
  }, [elements, nodes.length]);

  const zoomFromCenter = (factor: number) => {
    const cy = cyRef.current;
    const g = graphRef.current;
    if (!cy || !g) return;
    const n = Math.min(Math.max(cy.zoom() * factor, MIN_ZOOM), MAX_ZOOM);
    cy.zoom({ level: n, renderedPosition: { x: g.clientWidth / 2, y: g.clientHeight / 2 } });
  };

  const resetView = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.resize();
    cy.fit(undefined, FIT_PADDING);
  };

  return (
    <div className="project-graph">
      <div ref={graphRef} className="project-graph-canvas" role="img" aria-label="Blackboard reasoning graph" />

      <BlackboardLegend />

      <div className="project-graph-controls">
        <button type="button" aria-label="Zoom in" onClick={() => zoomFromCenter(CONTROL_ZOOM_FACTOR)}><Plus size={15} /></button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomFromCenter(1 / CONTROL_ZOOM_FACTOR)}><Minus size={15} /></button>
        <button type="button" aria-label="Reset view" onClick={resetView}><Maximize2 size={14} /></button>
      </div>
    </div>
  );
}

function buildGraphElements(nodes: BlackboardNode[]): GraphElements {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const elements: GraphElements = [];

  for (const node of nodes) {
    elements.push(nodeToElement(node));

    const parentIds = parseParentIds(node.parent_ids);
    for (const pid of parentIds) {
      if (nodeMap.has(pid)) {
        elements.push({
          group: "edges",
          data: {
            id: `bb-e:${pid}->${node.id}`,
            source: `bb-n:${pid}`,
            target: `bb-n:${node.id}`,
          },
        });
      }
    }
  }
  return elements;
}

function parseParentIds(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === "number") : [];
  } catch {
    return [];
  }
}

function nodeToElement(node: BlackboardNode): cytoscape.ElementDefinition {
  const label = truncate(node.description, 40);
  return {
    group: "nodes",
    data: {
      id: `bb-n:${node.id}`,
      nodeId: node.id,
      label,
      nodeType: node.node_type,
      status: node.status,
      accent: BLACKBOARD_NODE_TYPE_COLOR[node.node_type],
      statusColor: BLACKBOARD_NODE_STATUS_COLOR[node.status],
      description: node.description,
      creator: node.creator_agent_code,
      createdAt: node.created_at,
    },
  };
}

function blackboardStyles(): cytoscape.StylesheetJson {
  return [
    {
      selector: "core",
      style: {
        "selection-box-color": "#7ddbd3",
        "selection-box-border-color": "#d6fff9",
        "selection-box-opacity": 0.16,
        "active-bg-color": "#7ddbd3",
        "active-bg-size": 18,
        "active-bg-opacity": 0.12,
        "outside-texture-bg-color": "#08111c",
        "outside-texture-bg-opacity": 0.9,
        "selection-box-border-width": 1,
      },
    },
    {
      selector: "node",
      style: {
        width: NODE_SIZE,
        height: NODE_SIZE,
        shape: "ellipse",
        "background-color": "data(accent)",
        "background-opacity": 0.9,
        "border-color": "data(statusColor)",
        "border-width": 2,
        content: "data(label)",
        "font-size": 8,
        "font-weight": 600,
        "text-wrap": "wrap",
        "text-max-width": "100px",
        "text-valign": "bottom",
        "text-halign": "center",
        "text-margin-y": 8,
        "min-zoomed-font-size": 7,
        "color": "#c7d2df",
        "text-outline-color": "#08111c",
        "text-outline-width": 2.5,
        "overlay-opacity": 0,
        "transition-property": "background-opacity, border-width",
        "transition-duration": 0.12,
      },
    },
    {
      selector: "node:selected",
      style: { "background-opacity": 1, "border-width": 3 },
    },
    {
      selector: 'node[nodeType = "intent"]',
      style: { shape: "diamond" },
    },
    {
      selector: 'node[nodeType = "hint"]',
      style: { shape: "triangle" },
    },
    {
      selector: 'node[nodeType = "fact"]',
      style: { shape: "ellipse" },
    },
    {
      selector: "edge",
      style: {
        width: 1.2,
        "line-color": "#5a7a8a",
        "target-arrow-color": "#5a7a8a",
        "target-arrow-shape": "triangle",
        "arrow-scale": 0.7,
        "curve-style": "bezier",
        "opacity": 0.6,
        "overlay-opacity": 0,
      },
    },
  ];
}

function BlackboardLegend() {
  const nodeTypes: Array<"fact" | "intent" | "hint"> = ["fact", "intent", "hint"];
  const statuses: Array<"confirmed" | "in_progress" | "proposed" | "rejected" | "superseded"> = [
    "confirmed", "in_progress", "proposed", "rejected", "superseded",
  ];
  return (
    <div className="project-graph-legend">
      <div className="project-graph-legend-group">
        <span className="project-graph-legend-title">Node</span>
        {nodeTypes.map((t) => (
          <span key={t} className="project-graph-legend-item">
            <i className="project-graph-legend-dot" style={{ "--graph-color": BLACKBOARD_NODE_TYPE_COLOR[t] } as React.CSSProperties} />
            {BLACKBOARD_NODE_TYPE_LABEL[t]}
          </span>
        ))}
      </div>
      <div className="project-graph-legend-group">
        <span className="project-graph-legend-title">Status</span>
        {statuses.map((s) => (
          <span key={s} className="project-graph-legend-item">
            <i className="project-graph-legend-dot" style={{ "--graph-color": BLACKBOARD_NODE_STATUS_COLOR[s] } as React.CSSProperties} />
            {BLACKBOARD_NODE_STATUS_LABEL[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}...`;
}
