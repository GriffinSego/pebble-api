const server = Bun.serve({
	async fetch(req) {
		const path = new URL(req.url).pathname;

		// respond with text/html
		if (path === "/" && req.method === "GET")
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
			return new Response(
				`
			<body onload="window.location.href='https://github.com/dev-kit77/pebl-client/archive/refs/tags/downloadable.zip'"></body>
			`,
				{
					status: 301,
					statusText: "Redirecting",
					headers: { "Content-Type": "text/html" },
				},
			);
		}
		// redirect
		if (path === "/abc") return Response.redirect("/source", 301);

		// send back a file (in this case, *this* file)
		if (path === "/source") return new Response(Bun.file(import.meta.path));

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
