// import * as user from "./user"

export async function handle(path: string, req: Request): Promise<Response> {
	console.log("handling request: " + path)
	const body = await req.text()
	let jsonBody
	try {
		jsonBody = JSON.parse(body)
	} catch (error) {
		jsonBody = false
	}
	const rm = req.method
	const rmg = rm === "GET"
	const rmput = rm === "PUT"
	const rmpost = rm === "POST"
	if (path === "/api/") return new Response("OK")
	if (path === "/api/register" && rmpost) return await register(req, body)
	if (path === "/api/auth" && rmput) return await handleAuth(req, body)
	if (path === "/api/user/profile" && rmg) return await getUser(req, body)
	if (path === "/api/user/profile" && rmput) return await setUser(req, body)
	if (path === "/api/post/get" && rmg) return await handleGetPost(req, body)
	if (path === "/api/post/create" && rmpost)
		return await createPost(req, body)
	if (path === "/api/feed" && rmg) return await handleFeed(req, body)
	if (path === "/api/leaderboard" && rmg) return await leaderboard(req, body)
	return new Response("No such endpoint exists", { status: 404 })
}

async function register(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function getUser(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function handleAuth(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function setUser(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function handleGetPost(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function createPost(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function handleGetPosts(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function handleFeed(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
async function leaderboard(req: Request, body: any): Promise<Response> {
	return await Response.json(
		{ message: "Not implemented" },
		{ status: 500, statusText: "unimplemented" }
	)
}
