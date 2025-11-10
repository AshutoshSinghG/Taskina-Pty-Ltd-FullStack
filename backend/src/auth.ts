import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./store";
import { JwtPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_EXPIRY = "7d";

export function issueToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function authMiddleware(req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) {
	const header = req.headers.authorization;
	if (!header || !header.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Missing authorization header" });
	}
	const token = header.slice("Bearer ".length);
	try {
		const payload = verifyToken(token);
		req.user = payload;
		next();
	} catch {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}

export async function registerController(req: Request, res: Response) {
	const { username, password } = req.body ?? {};
	if (!username || !password || typeof username !== "string" || typeof password !== "string") {
		return res.status(400).json({ error: "username and password are required" });
	}
	if (db.findUserByUsername(username)) {
		return res.status(409).json({ error: "Username already exists" });
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user = db.createUser(username, passwordHash);
	const token = issueToken({ userId: user.id, username: user.username });
	return res.status(201).json({ token, user: { id: user.id, username: user.username } });
}

export async function loginController(req: Request, res: Response) {
	const { username, password } = req.body ?? {};
	if (!username || !password) {
		return res.status(400).json({ error: "username and password are required" });
	}
	const user = db.findUserByUsername(username);
	if (!user) {
		return res.status(401).json({ error: "Invalid credentials" });
	}
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) {
		return res.status(401).json({ error: "Invalid credentials" });
	}
	const token = issueToken({ userId: user.id, username: user.username });
	return res.json({ token, user: { id: user.id, username: user.username } });
}

