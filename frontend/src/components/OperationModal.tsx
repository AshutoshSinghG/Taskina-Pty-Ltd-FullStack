import React, { useState } from "react";
import { OperationType } from "../api";

type Props = {
  onClose: () => void;
  onSubmit: (type: OperationType, operand: number) => void;
};

const ops: { label: string; value: OperationType }[] = [
  { label: "+ Add", value: "add" },
  { label: "- Subtract", value: "subtract" },
  { label: "× Multiply", value: "multiply" },
  { label: "÷ Divide", value: "divide" },
];

export default function OperationModal({ onClose, onSubmit }: Props) {
  const [type, setType] = useState<OperationType>("add");
  const [operand, setOperand] = useState<string>("1");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-4 w-80">
        <h3 className="text-lg font-semibold mb-3">Perform Operation</h3>
        <div className="space-y-2">
          <select
            className="w-full border rounded px-2 py-1"
            value={type}
            onChange={(e) => setType(e.target.value as OperationType)}
          >
            {ops.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={operand}
            onChange={(e) => setOperand(e.target.value)}
            placeholder="Value"
          />
          <div className="flex gap-2 justify-end pt-2">
            <button className="bg-gray-100" onClick={onClose}>
              Cancel
            </button>
            <button
              className="bg-indigo-600 text-white"
              onClick={() => onSubmit(type, Number(operand))}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

