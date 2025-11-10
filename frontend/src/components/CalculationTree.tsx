import React from "react";
import NodeCard from "./NodeCard";

type DataShape = {
  users: any[];
  nodes: Record<string, any>;
  roots: string[];
};

export default function CalculationTree({
  data,
  reload,
}: {
  data: DataShape | null;
  reload: () => void;
}) {
  if (!data) return null;
  return (
    <div className="space-y-6">
      {data.roots.map((rid) => (
        <div key={rid} className="bg-white rounded shadow p-4">
          <NodeCard nodeId={rid} nodes={data.nodes} onChanged={reload} />
        </div>
      ))}
    </div>
  );
}


