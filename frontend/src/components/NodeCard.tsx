import React, { useState } from "react";
import OperationModal from "./OperationModal";
import { api, OperationType } from "../api";

type NodeItem = {
  id: string;
  parentId: string | null;
  createdBy: string;
  value: number;
  operation?: { type: OperationType; value: number };
  createdAt: number;
  childrenIds: string[];
};

type Props = {
  nodeId: string;
  nodes: Record<string, NodeItem>;
  onChanged: () => void;
};

export default function NodeCard({ nodeId, nodes, onChanged }: Props) {
  const node = nodes[nodeId];
  const [open, setOpen] = useState(false);

  const perform = async (type: OperationType, operand: number) => {
    setOpen(false);
    await api.post(`/operate/${node.id}`, { type, operand });
    onChanged();
  };

  return (
    <div className="flex items-start gap-4 py-3">
      <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-700">
        {node.value}
      </div>
      <div className="flex-1 border-b pb-3">
        <div className="text-xs text-gray-500 mb-1">
          {new Date(node.createdAt).toLocaleString()}
        </div>
        {node.operation && (
          <div className="text-sm text-gray-700 mb-1">
            {formatOperation(node.operation)} → {node.value}
          </div>
        )}
        {!node.operation && (
          <div className="text-sm text-gray-700 mb-1">Start: {node.value}</div>
        )}
        <button className="text-indigo-600 p-0" onClick={() => setOpen(true)}>
          Reply
        </button>

        <div className="ml-10">
          {node.childrenIds.map((cid) => (
            <NodeCard key={cid} nodeId={cid} nodes={nodes} onChanged={onChanged} />
          ))}
        </div>
      </div>
      {open && (
        <OperationModal
          onClose={() => setOpen(false)}
          onSubmit={perform}
        />
      )}
    </div>
  );
}

function formatOperation(op: { type: OperationType; value: number }) {
  switch (op.type) {
    case "add":
      return `+ ${op.value}`;
    case "subtract":
      return `- ${op.value}`;
    case "multiply":
      return `× ${op.value}`;
    case "divide":
      return `÷ ${op.value}`;
  }
}

