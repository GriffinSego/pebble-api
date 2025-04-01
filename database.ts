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
		{
			account_id: process.env.CLOUDFLARE_ACCOUNT_ID!
		}
	)
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${key}: ${response.status} ${response.statusText}`
		)
	} else {
		return response.json()
	}
}

export const posts: any = await get("posts")
export const users: any = await get("users")
export const tokens: any = await get("tokens")

export async function update(
	key: "users" | "posts" | "tokens",
	stringifiableData: any
): Promise<void> {
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
