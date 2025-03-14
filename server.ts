const server = Bun.serve({
	async fetch(req) {
		const path = new URL(req.url).pathname;

		// respond with text/html
		if (path === "/" || path === "/index.html" || path === "/index")
			return new Response(
				"<body>Web interface unavailable. <a href='/install'>Download and install the app</a> to access this service.</body>",
				{
					status: 200,
					statusText: "OK",
					headers: {
						"Content-Type": "text/html",
					},
				},
			);
		if (path === "/install") {
			return Response.redirect(
				"https://github.com/dev-kit77/pebl-client/archive/refs/tags/downloadable.zip",
				301,
			);
		}

		// send back a file (in this case, *this* file)
		if (path === "/favicon.ico")
			return new Response(Bun.file("favicon.png"));

		// respond with JSON
		if (path === "/api") return Response.json({ some: "buns", for: "you" });

		// receive JSON data to a POST request
		if (req.method === "POST" && path === "/api/post") {
			const data = await req.json();
			console.log("Received JSON:", data);
			return Response.json({ success: true, data });
		}

		// receive POST data from a form
		if (req.method === "POST" && path === "/form") {
			const data = await req.formData();
			console.log(data.get("someField"));
			return new Response("Success");
		}

		// 404s
		return new Response("Page not found", { status: 404 });
	},
});

console.log(`Listening on ${server.url}`);
