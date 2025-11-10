export type User = {
	username: string;
	passwordHash: string;
	id: string;
	createdAt: number;
};

export type OperationType = "add" | "subtract" | "multiply" | "divide";

export type Operation = {
	type: OperationType;
	value: number;
};

export type NodeItem = {
	id: string;
	parentId: string | null;
	createdBy: string;
	value: number;
	operation?: Operation;
	createdAt: number;
	childrenIds: string[];
};

export type DataShape = {
	users: User[];
	nodes: Record<string, NodeItem>;
	roots: string[]; // list of starting node ids
};

export type JwtPayload = {
	userId: string;
	username: string;
};

