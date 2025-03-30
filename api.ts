import * as user from "./user"
import * as post from "./post"

export async function handle(path: string, req: Request): Promise<Response> {
	console.log("handling request: " + path)
	let body: any = await req.text()
	let jsonBody
	try {
		jsonBody = JSON.parse(body)
		body = jsonBody
	} catch (error) {
		jsonBody = false
	}
	const authSent = req.headers.get("Authorization") !== null
	const account = authSent
		? await user.auth(req.headers.get("Authorization")!, req)
		: "FAIL"
	req.headers.set("account", account ? account : "FAIL")
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
	if (path === "/api/") return new Response("OK") //done
	if (path === "/api/register" && rmpost) return await register(req, body) //done
	if (path === "/api/user/profile" && rmg) return await getUser(req, body) //done
	if (path === "/api/auth" && rmpost) return await login(req, body) //done
	if (path === "/api/user/profile" && rmput) return await setUser(req, body) //done
	if (path === "/api/user/delete" && rmput) return await deleteUser(req, body) //done
	if (path === "/api/post/get" && rmg) return await handleGetPost(req, body) //done
	if (path === "/api/post/create" && rmput) return await createPost(req, body) //done
	if (path === "/api/feed" && rmg) return await handleFeed(req, body) //done
	if (path === "/api/leaderboard" && rmg) return await leaderboard(req, body) //done
	return new Response("No such endpoint exists", { status: 404 })
}

async function register(req: Request, body: any): Promise<Response> {
	if (!body.username || !body.password || !body.gender || !body.age) {
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	}
	if (await user.exists(body.username.toLowerCase()))
		return Response.json(
			{ error: "Username already exists", success: false },
			http(400)
		)
	const newAccount = await user.create(
		body.username.toLowerCase(),
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
	if (await user.checkPassword(body.username, body.password)) {
		const newToken = await user.token(body.username)
		return Response.json(
			{ error: "none", success: true, token: newToken },
			http(200)
		)
	}
	return Response.json(
		{ error: "Invalid credentials", success: false },
		http(400)
	)
}

async function getUser(req: Request, body: any): Promise<Response> {
	if (!req.headers.get("target"))
		return Response.json(
			{ error: "Missing required target header", success: false },
			http(400)
		)
	//check if the user exists
	if (!(await user.exists(req.headers.get("target")!)))
		return Response.json(
			{ error: "Account does not exist", success: false },
			http(404)
		)
	//get userdata
	const userData = await user.getSafe(body.username)
	return Response.json(userData, http(200))
}
async function setUser(req: Request, body: any): Promise<Response> {
	if (!body.age || !body.gender || !body.status) {
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	}
	//validate that request authorization is linked to a valid user account and get that accounts username
	const accountUsername = req.headers.get("account")
	if (
		!accountUsername ||
		accountUsername === "FAIL" ||
		!accountUsername.length ||
		accountUsername.length < 1
	)
		return Response.json({ error: "Auth error", success: false }, http(401))
	try {
		parseInt(body.age)
	} catch (e) {
		return Response.json(
			{ error: "Invalid age", success: false },
			http(400)
		)
	}
	if (body.gender !== "true" && body.gender !== "false") {
		return Response.json(
			{ error: "Invalid gender", success: false },
			http(400)
		)
	}
	const accountExists = await user.exists(accountUsername)
	if (!accountExists)
		return Response.json(
			{ error: "Account does not exist", success: false },
			http(404)
		)
	if (
		await user.update(accountUsername, body.age, body.gender, body.status)
	) {
		return Response.json(
			{ message: "User updated successfully", success: true },
			http(200)
		)
	} else {
		return Response.json(
			{ message: "Failed to update user", success: false },
			http(500)
		)
	}
}
async function deleteUser(req: Request, body: any): Promise<Response> {
	if (!body.username)
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	if (
		!(
			req.headers.get("sudo") &&
			req.headers.get("sudo") === "9253abe8-1d90-4f4a-9cba-35f37214fc05"
		)
	)
		return Response.json(
			{ error: "Sudo key wrong or missing", success: false },
			http(400)
		)
	const success = await user.remove(body.username)
	if (success) {
		return Response.json({ message: body.username + " deleted" }, http(200))
	} else {
		return Response.json(
			{ message: body.username + " was not found. No such user exists." },
			http(200)
		)
	}
}
async function handleGetPost(req: Request, body: any): Promise<Response> {
	if (!req.headers.get("id")) {
		return Response.json(
			{ error: "Missing required headers", success: false },
			http(400)
		)
	}
	let bodyid
	try {
		bodyid = parseInt(req.headers.get("id")!)
	} catch (error) {
		return Response.json(
			{ error: "ID header is not a parseable number", success: false },
			http(400)
		)
	}
	if (post.exists(bodyid)) {
		return Response.json(post.get(bodyid), http(200))
	} else {
		return Response.json(
			{
				error: "Post was not found. No such post exists.",
				success: false
			},
			http(404)
		)
	}
}
async function createPost(req: Request, body: any): Promise<Response> {
	if (!body.content)
		return Response.json(
			{ error: "Missing required fields", success: false },
			http(400)
		)
	if (req.headers.get("account") == "FAIL")
		return Response.json(
			{ error: "Account does not exist", success: false },
			http(400)
		)
	const newPost = await post.createPost(
		body.content,
		req.headers.get("account")!
	)
	user.addSkips(body.author, 1)
	return Response.json({ id: newPost.id }, http(200))
}
async function handleGetPosts(req: Request, body: any): Promise<Response> {
	return Response.json({ message: "Not implemented" }, http(500))
}
async function handleFeed(req: Request, body: any): Promise<Response> {
	const feed = post.getFeed()
	return Response.json({ feed }, http(200))
}
//this function is far more expensive than the others because it has to filter all users from maps to arrays and back. This should ideally only be invoked when necessary by clients and not on a loop
async function leaderboard(req: Request, body: any): Promise<Response> {
	if (!(await user.getLeaderboard())) {
		return Response.json(
			{ error: "Leaderboard calculation error", success: false },
			http(500)
		)
	}
	return Response.json(await user.getLeaderboard(), http(200))
}

export function http(code: number) {
	return { status: code }
}
