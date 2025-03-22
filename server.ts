import * as api from "./api"

const server = Bun.serve({
	async fetch(req) {
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
				"https://github.com/dev-kit77/pebl-client/archive/refs/tags/downloadable.zip",
				301
			)
		}
		//serve favicon for browsers
		if (path === "/favicon.ico")
			return new Response(Bun.file("favicon.png"))
		//api endpoint for automatic data backups
		const dk = "/dump/742728342780928349872349234/"
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
})

console.log(`Listening on ${server.url}`)
