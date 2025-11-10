import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { DataShape, NodeItem, User } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "data.json");

const defaultData: DataShape = {
	users: [],
	nodes: {},
	roots: [],
};

function ensureDataFile(): void {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	if (!existsSync(DATA_PATH)) {
		writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2), "utf8");
	}
}

ensureDataFile();

function load(): DataShape {
	const content = readFileSync(DATA_PATH, "utf8");
	return JSON.parse(content) as DataShape;
}

function save(data: DataShape): void {
	writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export const db = {
	getData(): DataShape {
		return load();
	},
	saveData(data: DataShape): void {
		save(data);
	},
	createUser(username: string, passwordHash: string): User {
		const data = load();
		const user: User = {
			id: randomUUID(),
			username,
			passwordHash,
			createdAt: Date.now(),
		};
		data.users.push(user);
		save(data);
		return user;
	},
	findUserByUsername(username: string): User | undefined {
		return load().users.find((u) => u.username.toLowerCase() === username.toLowerCase());
	},
	findUserById(id: string): User | undefined {
		return load().users.find((u) => u.id === id);
	},
	createRootNode(value: number, userId: string): NodeItem {
		const data = load();
		const id = randomUUID();
		const node: NodeItem = {
			id,
			parentId: null,
			value,
			createdAt: Date.now(),
			createdBy: userId,
			childrenIds: [],
		};
		data.nodes[id] = node;
		data.roots.unshift(id);
		save(data);
		return node;
	},
	getNode(id: string): NodeItem | undefined {
		return load().nodes[id];
	},
	getAllTrees(): DataShape {
		return load();
	},
	createChildNode(parentId: string, value: number, userId: string, operation: NodeItem["operation"]): NodeItem {
		const data = load();
		const parent = data.nodes[parentId];
		if (!parent) {
			throw new Error("Parent node not found");
		}
		const id = randomUUID();
		const node: NodeItem = {
			id,
			parentId,
			value,
			operation,
			createdAt: Date.now(),
			createdBy: userId,
			childrenIds: [],
		};
		data.nodes[id] = node;
		parent.childrenIds.push(id);
		save(data);
		return node;
	},
};

