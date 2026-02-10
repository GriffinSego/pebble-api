import Cloudflare from "cloudflare"

const client = new Cloudflare({
	apiEmail: process.env.CLOUDFLARE_EMAIL,
	apiToken: process.env.CLOUDFLARE_API_TOKEN,
	apiKey: process.env.CLOUDFLARE_API_KEY,
	timeout: 4000,
	maxRetries: 100
})

async function get(key: "users" | "posts" | "tokens") {
	const response = await client.kv.namespaces.values.get(
		process.env.CLOUDFLARE_NAMESPACE_ID!,
		key,
		{ account_id: process.env.CLOUDFLARE_ACCOUNT_ID! }
	)
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${key}: ${response.status} ${response.statusText}`
		)
	} else {
		const json = await response.json()
		console.log(key + "'s keys:")
		console.log(Object.keys(json))
		if (!json.value || (json.metadata && json.metadata != "")) {
			console.log(
				"suspect response from cloudflare regarding GET " + key,
				json
			)
			if (!json.value) {
				console.error(
					"no json.value. server will attempt to parse the whole request."
				)
				return await json
			} else if (json.metadata && json.metadata != "") {
				throw new Error("Got unexpected metadata from server. Aborting")
			}
			// console.log(json)
		}
		if (json.value) console.error("found json.value, will return it")
		console.log(JSON.parse(json.value))
		return JSON.parse(json.value)
	}
}

export const posts: any = await get("posts")
export const users: any = await get("users")
export const tokens: any = await get("tokens")

export async function update(
	key: "users" | "posts" | "tokens",
	stringifiableData: any
): Promise<void> {
	const v = JSON.stringify(stringifiableData)
	console.log(
		"request to cloudflare regarding UPDATE " + key,
		JSON.stringify(v),
		typeof v
	)
	console.log(v)
	if (typeof stringifiableData == "string")
		throw new Error("string sent to update function")
	if (!!stringifiableData.value)
		throw new Error("the values are back. database write denied.")
	await client.kv.namespaces.values.update(
		process.env.CLOUDFLARE_NAMESPACE_ID!,
		key,
		{
			account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
			value: JSON.stringify(stringifiableData),
			metadata: ""
		}
	)
	return
}
