import React, { useState } from "react";
import { api, setAuthToken } from "../api";

export default function AuthForm({ onAuth }: { onAuth: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const route = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(route, { username, password });
      setAuthToken(res.data.token);
      onAuth();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">{isLogin ? "Login" : "Register"}</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="bg-indigo-600 text-white w-full py-2">Submit</button>
      </form>
      <button className="text-indigo-600 mt-3 p-0" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
}


