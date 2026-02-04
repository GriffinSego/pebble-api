import * as api from "./api"

const corsHeaders: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization, id, sudo",
}

function addCorsHeaders(response: Response): Response {
	for (const [key, value] of Object.entries(corsHeaders)) {
		response.headers.set(key, value)
	}
	return response
}

const server = Bun.serve({
	async fetch(req) {
		if (req.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders })
		}

		const response = await handleRequest(req)
		return addCorsHeaders(response)
	}
})

async function handleRequest(req: Request): Promise<Response> {
	const path = new URL(req.url).pathname

	// respond with text/html in case some lost soul tries to access the api in a browser
	if (path === "/" || path === "/index.html" || path === "/index")
		return new Response(
			"<body>Web interface unavailable. <a href='/install'>Download and install the app</a> to access this service.</body>",
			{
				status: 200,
				statusText: "OK",
				headers: {
					"Content-Type": "text/html"
				}
			}
		)
	//redirect aforementioned lost souls to the download link
	if (path === "/install") {
		return Response.redirect(
			"https://github.com/dev-kit77/pebl-client/releases/latest/download/pebl-client.zip",
			301
		)
	}
	//serve favicon for browsers
	if (path === "/favicon.ico")
		return new Response(Bun.file("favicon.png"))
	//api endpoint for automatic data backups
	const dk = "/dump/742728342780928349872349234/"
	if (path.startsWith("/legal")) {
		return new Response(Bun.file("./legal.html"))
	}
	if (path.startsWith(dk)) {
		if (await Bun.file(path.replace(dk, "")).exists())
			return new Response(Bun.file(path.replace(dk, "")))
		return new Response("Huh?", api.http(404))
	}
	// respond with JSON
	if (path.startsWith("/api")) return await api.handle(path, req)

	// receive JSON data to a POST request
	if (req.method === "POST" && path === "/api/post") {
		const data = await req.json()
		console.log("Received JSON:", data)
		return Response.json({ success: true, data })
	}

	// receive POST data from a form
	if (req.method === "POST" && path === "/form") {
		const data = await req.formData()
		console.log(data.get("someField"))
		return new Response("Success")
	}

	// 404s
	return new Response("Page not found", api.http(404))
}

console.log(`Listening on ${server.url}`)
