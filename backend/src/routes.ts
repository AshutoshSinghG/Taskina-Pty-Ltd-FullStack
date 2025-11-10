import { Router, Request, Response } from "express";
import { authMiddleware } from "./auth";
import { db } from "./store";
import { OperationType } from "./types";

export const router = Router();

router.get("/tree", (_req: Request, res: Response) => {
	const data = db.getAllTrees();
	return res.json(data);
});

router.post("/start", authMiddleware, (req: Request & { user?: { userId: string } }, res: Response) => {
	const { value } = req.body ?? {};
	const num = Number(value);
	if (!Number.isFinite(num)) {
		return res.status(400).json({ error: "value must be a number" });
	}
	const node = db.createRootNode(num, req.user!.userId);
	return res.status(201).json(node);
});

router.post("/operate/:id", authMiddleware, (req: Request & { user?: { userId: string } }, res: Response) => {
	const { id } = req.params;
	const { type, operand } = req.body ?? {};
	const validTypes: OperationType[] = ["add", "subtract", "multiply", "divide"];
	if (!validTypes.includes(type)) {
		return res.status(400).json({ error: "Invalid operation type" });
	}
	const value = Number(operand);
	if (!Number.isFinite(value)) {
		return res.status(400).json({ error: "operand must be a valid number" });
	}
	const parent = db.getNode(id);
	if (!parent) {
		return res.status(404).json({ error: "Node not found" });
	}
	if (type === "divide" && value === 0) {
		return res.status(400).json({ error: "Division by zero" });
	}
	let result = parent.value;
	switch (type) {
		case "add":
			result = parent.value + value;
			break;
		case "subtract":
			result = parent.value - value;
			break;
		case "multiply":
			result = parent.value * value;
			break;
		case "divide":
			result = parent.value / value;
			break;
	}
	const child = db.createChildNode(parent.id, result, req.user!.userId, { type, value });
	return res.status(201).json(child);
});

