import type { User, UserSafe, Token, TokenList } from "./types"
import data from "./data"
let users: Map<string, User> = new Map<string, User>(
	Object.entries(await data.users.get())
)
let authTokens: Map<string, Token> = new Map<string, Token>(
	Object.entries(await data.tokens.get())
)

//remove expired tokens
for (const [key, token] of authTokens) {
	if (token.expiry < Date.now()) {
		authTokens.delete(key)
	}
}
async function saveUsers() {
	await data.users.set(Object.fromEntries(users))
}
async function saveTokens() {
	await data.tokens.set(Object.fromEntries(authTokens))
}

export async function update(
	username: string,
	age: number,
	gender: boolean,
	status: string
) {
	let userCached = await get(username)
	if (!userCached) return false
	userCached.age = age
	userCached.gender = gender
	userCached.status = status
	users.set(username, userCached)
	await saveUsers()
	return true
}

export async function addPost(username: string, postid: number) {
	let userCached = await get(username)
	if (!userCached) throw new Error("User not found while adding post")
	if (userCached.posts === undefined || userCached.posts.length === 0) {
		userCached.posts = []
	}
	userCached.posts.push(postid.toString())
	users.set(username, userCached)
	await saveUsers()
	return true
}

export async function addSkips(
	username: string,
	skips: number
): Promise<number> {
	console.log("adding " + skips + " skips to " + username)
	let userCached = await get(username)
	if (!userCached) throw new Error("User not found while adding skips")
	if (userCached.skips === undefined) {
		userCached.skips = 0
	}
	console.log("skips:" + userCached.skips)
	userCached.skips += skips
	users.set(username, userCached)
	console.log("new skips:" + userCached.skips)
	await saveUsers()
	return userCached.skips
}
export async function hasSkips(username: string): Promise<boolean> {
	let userCached = await get(username)
	if (!userCached) return false
	if (userCached.skips === undefined || userCached.skips < 1) {
		return false
	}
	return true
}

export async function followToggle(
	user: string,
	target: string
): Promise<boolean> {
	let userCached = await get(user)
	let targetCached = await get(target)
	if (!userCached) return false
	if (!targetCached) return false
	if (
		userCached.following === undefined ||
		userCached.following.length === 0
	) {
		userCached.following = []
	}
	if (
		targetCached.followers === undefined ||
		targetCached.followers.length === 0
	) {
		targetCached.followers = []
	}
	//check if currently following
	if (userCached.following.includes(target)) {
		userCached.following = userCached.following.filter((f) => f !== target)
		targetCached.followers = targetCached.followers.filter(
			(f) => f !== user
		)
	} else {
		userCached.following.push(target)
		targetCached.followers.push(user)
	}
	users.set(user, userCached)
	users.set(target, targetCached)
	await saveUsers()
	return true
}

function makeSafe(user: User): UserSafe {
	return {
		username: user.username,
		gender: user.gender,
		age: user.age,
		nickname: user.nickname,
		status: user.status,
		followers: user.followers,
		following: user.following,
		posts: user.posts,
		location: user.location,
		skips: user.skips
	}
}

//this may be the most data-intensive operation in the entire application
export async function getLeaderboard() {
	//take users mapping of usernames to user objects and convert it to an array of [username, user] tuples
	//and then immediately sort it by skips in descending order
	const leaderboardMapAsArray: [string, User][] = Array.from(
		users.entries()
	).sort((a, b) => b[1].skips - a[1].skips)
	//strip out string and return array of users
	const leaderboardAsList = leaderboardMapAsArray.map(
		([username, user]) => user
	)
	//strip out non-public fields from user objects
	const safeLeaderboard = leaderboardAsList.map((user) => makeSafe(user))
	//only return the top 100 users on the leaderboard to preserve bandwidth
	return safeLeaderboard.slice(0, 100)
}

const countryFlags = {
	AF: "🇦🇫",
	AL: "🇦🇱",
	DZ: "🇩🇿",
	AS: "🇦🇸",
	AD: "🇦🇩",
	AO: "🇦🇴",
	AR: "🇦🇷",
	AM: "🇦🇲",
	AW: "🇦🇼",
	AU: "🇦🇺",
	AT: "🇦🇹",
	AZ: "🇦🇿",
	BS: "🇧🇸",
	BH: "🇧🇭",
	BD: "🇧🇩",
	BB: "🇧🇧",
	BY: "🇧🇾",
	BE: "🇧🇪",
	BZ: "🇧🇿",
	BJ: "🇧🇯",
	BT: "🇧🇹",
	BO: "🇧🇴",
	BA: "🇧🇦",
	BW: "🇧🇼",
	BR: "🇧🇷",
	BN: "🇧🇳",
	BG: "🇧🇬",
	BF: "🇧🇫",
	BI: "🇧🇮",
	KH: "🇰🇭",
	CM: "🇨🇲",
	CA: "🇨🇦",
	CV: "🇨🇻",
	KY: "🇰🇾",
	CF: "🇨🇫",
	TD: "🇹🇩",
	CL: "🇨🇱",
	CN: "🇨🇳",
	CO: "🇨🇴",
	KM: "🇰🇲",
	CG: "🇨🇬",
	CD: "🇨🇩",
	CR: "🇨🇷",
	CU: "🇨🇺",
	CY: "🇨🇾",
	CZ: "🇨🇿",
	CI: "🇨🇮",
	DK: "🇩🇰",
	DJ: "🇩🇯",
	DM: "🇩🇲",
	DO: "🇩🇴",
	EC: "🇪🇨",
	EG: "🇪🇬",
	SV: "🇸🇻",
	GQ: "🇬🇶",
	ER: "🇪🇷",
	EE: "🇪🇪",
	SZ: "🇸🇿",
	ET: "🇪🇹",
	FI: "🇫🇮",
	FJ: "🇫🇯",
	FM: "🇫🇲",
	FA: "🇫🇦",
	FR: "🇫🇷",
	GA: "🇬🇦",
	GB: "🇬🇧",
	GE: "🇬🇪",
	GH: "🇬🇭",
	GI: "🇬🇮",
	GR: "🇬🇷",
	GL: "🇬🇱",
	GD: "🇬🇩",
	GU: "🇬🇺",
	GT: "🇬🇹",
	GN: "🇬🇳",
	GW: "🇬🇼",
	GY: "🇬🇾",
	HT: "🇭🇹",
	HN: "🇭🇳",
	HK: "🇭🇰",
	HU: "🇭🇺",
	IS: "🇮🇸",
	IN: "🇮🇳",
	ID: "🇮🇩",
	IR: "🇮🇷",
	IQ: "🇮🇶",
	IE: "🇮🇪",
	IL: "🇮🇱",
	IT: "🇮🇹",
	JM: "🇯🇲",
	JP: "🇯🇵",
	JO: "🇯🇴",
	KZ: "🇰🇿",
	KE: "🇰🇪",
	KI: "🇰🇮",
	KP: "🇰🇵",
	KR: "🇰🇷",
	KW: "🇰🇼",
	KG: "🇰🇬",
	LA: "🇱🇦",
	LV: "🇱🇻",
	LB: "🇱🇧",
	LS: "🇱🇸",
	LR: "🇱🇷",
	LY: "🇱🇾",
	LI: "🇱🇮",
	LT: "🇱🇹",
	LU: "🇱🇺",
	MO: "🇲🇴",
	MK: "🇲🇰",
	MG: "🇲🇬",
	MW: "🇲🇼",
	MY: "🇲🇾",
	MV: "🇲🇻",
	ML: "🇲🇱",
	MT: "🇲🇹",
	MH: "🇲🇭",
	MQ: "🇲🇶",
	MR: "🇲🇷",
	MU: "🇲🇺",
	YT: "🇾🇹",
	MX: "🇲🇽",
	MD: "🇲🇩",
	MC: "🇲🇨",
	MN: "🇲🇳",
	ME: "🇲🇪",
	MS: "🇲🇸",
	MA: "🇲🇦",
	MZ: "🇲🇿",
	MM: "🇲🇲",
	NA: "🇳🇦",
	NR: "🇳🇷",
	NP: "🇳🇵",
	NL: "🇳🇱",
	NC: "🇳🇨",
	NZ: "🇳🇿",
	NI: "🇳🇮",
	NE: "🇳🇪",
	NG: "🇳🇬",
	NU: "🇳🇺",
	NF: "🇳🇫",
	MP: "🇲🇵",
	NO: "🇳🇴",
	OM: "🇴🇲",
	PK: "🇵🇰",
	PW: "🇵🇼",
	PA: "🇵🇦",
	PG: "🇵🇬",
	PY: "🇵🇾",
	PE: "🇵🇪",
	PH: "🇵🇭",
	PN: "🇵🇳",
	PL: "🇵🇱",
	PT: "🇵🇹",
	PR: "🇵🇷",
	QA: "🇶🇦",
	RO: "🇷🇴",
	RU: "🇷🇺",
	RW: "🇷🇼",
	RE: "🇷🇪",
	BL: "🇧🇱",
	SH: "🇸🇭",
	KN: "🇰🇳",
	LC: "🇱🇨",
	MF: "🇲🇫",
	PM: "🇵🇲",
	VC: "🇻🇨",
	WS: "🇼🇸",
	SM: "🇸🇲",
	ST: "🇸🇹",
	SA: "🇸🇦",
	SN: "🇸🇳",
	RS: "🇷🇸",
	SC: "🇸🇨",
	SL: "🇸🇱",
	SG: "🇸🇬",
	SX: "🇸🇽",
	SK: "🇸🇰",
	SI: "🇸🇮",
	SB: "🇸🇧",
	SO: "🇸🇴",
	ZA: "🇿🇦",
	SS: "🇸🇸",
	ES: "🇪🇸",
	LK: "🇱🇰",
	SD: "🇸🇩",
	SR: "🇸🇷",
	SJ: "🇯🇴",
	SE: "🇸🇪",
	SY: "🇸🇾",
	TW: "🇹🇼",
	TJ: "🇹🇯",
	TZ: "🇹🇿",
	TH: "🇹🇭",
	TL: "🇹🇱",
	TG: "🇹🇬",
	TO: "🇹🇴",
	TT: "🇹🇹",
	TN: "🇹🇳",
	TR: "🇹🇷",
	TM: "🇹🇲",
	TC: "🇹🇨",
	TV: "🇹🇻",
	UG: "🇺🇬",
	UA: "🇺🇦",
	AE: "🇦🇪",
	US: "🇺🇸",
	UY: "🇺🇾",
	UZ: "🇺🇿",
	VU: "🇻🇺",
	VA: "🇻🇦",
	VE: "🇻🇪",
	VN: "🇻🇳",
	WF: "🇼🇫",
	YE: "🇾🇪",
	ZM: "🇿🇲",
	ZW: "🇿🇼"
}

export async function exists(username: string): Promise<boolean> {
	return users.get(username) !== undefined
}

export async function get(username: string): Promise<User | undefined> {
	return users.get(username)
}

export async function remove(username: string) {
	const len1 = users.size
	users.delete(username)
	await saveUsers()
	const len2 = users.size
	return len1 != len2
}

export async function getSafe(username: string): Promise<UserSafe | undefined> {
	if (!username) throw new Error("Username is undefined")

	const user = users.get(username)
	console.log("User: ", user)
	if (!user) return undefined
	return {
		username: user.username,
		gender: user.gender,
		age: user.age,
		nickname: user.nickname,
		status: user.status,
		followers: user.followers,
		following: user.following,
		posts: user.posts,
		location: user.location,
		skips: user.skips
	}
}

export async function auth(
	token: string,
	req: Request
): Promise<string | undefined> {
	const tokenData = authTokens.get(token)
	if (!tokenData || tokenData.expiry < Date.now()) {
		if (tokenData) authTokens.delete(token)
		return "FAIL"
	}
	//update location
	const ip = req.headers.get("X-Forwarded-For") || "73.162.45.210"
	// if (ip == "73.162.45.210") {
	// 	throw new Error(
	// 		`ip header fetch failed, x-f-f: ${req.headers.get("X-Forwarded-For")}`
	// 	)
	// }
	updateLocation(tokenData.username, ip)
	return tokenData.username
}

export async function token(username: string): Promise<string | undefined> {
	const token = Bun.randomUUIDv7()
	authTokens.set(token, {
		username: username,
		expiry: Date.now() + 3600000, //equal to 1 hour in milliseconds
		token: token
	} as Token)
	await saveTokens()
	console.log("saved token " + token + " to tokens.json")
	return token
}

export async function create(
	username: string,
	password: string,
	gender: boolean,
	age: number,
	ip: string
): Promise<User> {
	const user: User = {
		username,
		password,
		gender,
		age,
		nickname: "",
		status: "",
		posts: [],
		followers: ["fýr"],
		following: ["fýr"],
		location: "",
		skips: 1
	}
	followToggle("fýr", username)
	users.set(username, user)
	console.log("Getting location of " + ip + "...")
	await updateLocation(username, ip)
	console.log("Location:" + users.get(username)!.location)
	saveUsers()
	return user
}

export async function updateLocation(
	username: string,
	ip: string
): Promise<void> {
	console.error("UPDATE LOCATION")
	const user = users.get(username)
	if (!user) throw new Error("no user??")
	if (!ip || ip == "") throw new Error("no ip??")
	let queryip = ip
	if (typeof ip === "object") {
		queryip = ip[0]
	} else if (ip.includes(",")) {
		queryip = ip.split(",")[0]
	}
	// (await (await fetch("http://ip-api.com/json/" + ip)).json())
	// 	.regionName +
	// ", " +
	// (await (await fetch("http://ip-api.com/json/" + ip)).json())
	// 	.country
	console.log("req url:" + "http://ip-api.com/json/" + queryip)
	const response = await (
		await fetch("http://ip-api.com/json/" + queryip)
	).json()
	if (response && response.status && response.status === "success") {
		user.location =
			response.city + ", " + response.regionName + ", " + response.country
		users.set(username, user)
		console.log("location: " + user.location)
		saveUsers()
	} else {
		if (response.status === "fail") {
			user.location =
				"UIAF" +
				JSON.stringify(response)
					.replace("{", "")
					.replace("}", "")
					.replace("\t", "")
			console.log("status is fail")
			users.set(username, user)
			saveUsers()
		} else {
			console.log("WTH?")
			console.log("response:", response)
			console.log("user:", user)
			console.log("ip:", queryip)
		}
	}
}

export async function checkPassword(
	username: string,
	password: string
): Promise<User | undefined> {
	if (!(await exists(username))) return undefined
	const user = await get(username)
	if (!user || user.password !== password) return undefined
	return user
}
