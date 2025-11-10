import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";
import { loginController, registerController } from "./auth";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "number-communication-backend" }));

app.post("/auth/register", registerController);
app.post("/auth/login", loginController);

app.use("/", router);

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
	console.log(`Backend listening on http://localhost:${PORT}`);
});


