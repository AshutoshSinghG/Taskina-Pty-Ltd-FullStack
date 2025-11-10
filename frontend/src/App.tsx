import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "./api";
import AuthForm from "./components/AuthForm";
import CalculationTree from "./components/CalculationTree";

type DataShape = {
  users: any[];
  nodes: Record<string, any>;
  roots: string[];
};

export default function App() {
  const [data, setData] = useState<DataShape | null>(null);
  const [seed, setSeed] = useState("");
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await api.get("/tree");
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, [authed]);

  const startThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/start", { value: Number(seed) });
      setSeed("");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to start");
    }
  };

  const logout = () => {
    setAuthToken(undefined);
    setAuthed(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Number Communication</h1>
        <div>
          {authed ? (
            <button className="bg-gray-100" onClick={logout}>
              Logout
            </button>
          ) : null}
        </div>
      </header>

      {!authed ? (
        <div className="flex justify-center">
          <AuthForm onAuth={() => setAuthed(true)} />
        </div>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <form className="flex gap-2 items-center" onSubmit={startThread}>
            <input
              type="number"
              className="border rounded px-3 py-2 flex-1"
              placeholder="Start with a number..."
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              required
            />
            <button className="bg-indigo-600 text-white">Start</button>
          </form>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
      )}

      <CalculationTree data={data} reload={load} />
    </div>
  );
}


