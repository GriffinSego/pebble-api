import * as user from "./user"

export async function handle(path: string, req: Request): Promise<Response> {
	console.log("handling request: " + path)
	let body = await req.text()
	let jsonBody
	try {
		jsonBody = JSON.parse(body)
		body = jsonBody
	} catch (error) {
		jsonBody = false
	}
	const authSent = req.headers.get("Authorization") !== null
	const account = authSent
		? await user.auth(req.headers.get("Authorization")!)
		: "FAIL"
	const rm = req.method
	const rmg = rm === "GET"
	const rmput = rm === "PUT"
	const rmpost = rm === "POST"
	if (account === "FAIL" && !rmg && !rmpost)
		return authSent
			? new Response("Bad authorization", { status: 401 })
			: new Response("Authorization required", { status: 401 })
	if (jsonBody === false && !rmg)
		return new Response("Invalid JSON", { status: 400 })
	if (path === "/api/") return new Response("OK")
	if (path === "/api/register" && rmpost) return await register(req, body)
	if (path === "/api/auth" && rmpost) return await handleAuth(req, body)
	if (path === "/api/user/profile" && rmg) return await getUser(req, body)
	if (path === "/api/user/profile" && rmput) return await setUser(req, body)
	if (path === "/api/post/get" && rmg) return await handleGetPost(req, body)
	if (path === "/api/post/create" && rmput) return await createPost(req, body)
	if (path === "/api/feed" && rmg) return await handleFeed(req, body)
	if (path === "/api/leaderboard" && rmg) return await leaderboard(req, body)
	return new Response("No such endpoint exists", { status: 404 })
}

async function register(req: Request, body: any): Promise<Response> {
	if (!body.username || !body.password || !body.gender || !body.age) {
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	}
	if (await user.exists(body.username))
		return Response.json(
			{ error: "Username already exists", success: false },
			http(400)
		)
	const newAccount = await user.create(
		body.username,
		body.password,
		body.gender,
		body.age,
		req.headers.get("x-forwarded-for") || ""
	)
	const token = await user.token(body.username)
	return Response.json(
		{ error: "none", success: true, token: token },
		http(200)
	)
}
async function login(req: Request, body: any): Promise<Response> {
	if (!body.username || !body.password) {
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	}
	if (!(await user.exists(body.username)))
		return Response.json(
			{ error: "Account does not exist", success: false },
			http(400)
		)
	if(await user.checkPassword(body.username, body.password)){
		const newToken = await user.token(body.username)
		return Response.json(
			{ error: "none", success: true, token: newToken },
			http(200)
		)
	}
	return Response.json({error: "Invalid credentials", success: false}, http(400))
}

async function getUser(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function handleAuth(req: Request, body: any): Promise<Response> {

	return user.
}
async function setUser(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function handleGetPost(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function createPost(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function handleGetPosts(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function handleFeed(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function leaderboard(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}

export function http(code: number) {
	return { status: code }
}
