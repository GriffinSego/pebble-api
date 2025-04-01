import * as database from "./database"
const cf = process.env.USE_CLOUDFLARE_KV_STORE_FOR_DATA_PERSISTENCE === "TRUE" //will default to false if .env is missing
if (!cf) throw new Error("dont.")
export async function get(key: "users" | "posts" | "tokens"): Promise<any> {
	if (cf) {
		return await database[key]
	} else {
		if (!Bun.file(`./data/${key}.json`).exists())
			Bun.write(`./data/${key}.json`, "{}")
		return await Bun.file(`./data/${key}.json`).json()
	}
}

export async function set(
	key: "users" | "posts" | "tokens",
	object: any
): Promise<void> {
	if (typeof object == "string") throw new Error("Must be JS Object")
	if (cf) {
		return await database.update(key, object)
	} else {
		await Bun.write(`./data/${key}.json`, JSON.stringify(key))
	}
	return
}

export default {
	users: {
		get: function () {
			return get("users")
		},
		set: function (data: any) {
			return set("users", data)
		}
	},
	tokens: {
		get: function () {
			return get("tokens")
		},
		set: function (data: any) {
			return set("tokens", data)
		}
	},
	posts: {
		get: function () {
			return get("posts")
		},
		set: function (data: any) {
			return set("posts", data)
		}
	}
}
