import type { User, UserSafe, Token, TokenList } from "./types"
let users: Map<string, User> = new Map<string, User>(
	Object.entries(await Bun.file("./data/users.json").json())
)
let authTokens: Map<string, Token> = new Map<string, Token>(
	Object.entries(await Bun.file("./data/tokens.json").json())
)

//remove expired tokens
for (const [key, token] of authTokens) {
	if (token.expiry < Date.now()) {
		authTokens.delete(key)
	}
}
async function saveUsers() {
	await Bun.write(
		"./data/users.json",
		JSON.stringify(Object.fromEntries(users))
	)
}
async function saveTokens() {
	await Bun.write(
		"./data/tokens.json",
		JSON.stringify(Object.fromEntries(authTokens))
	)
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
	users.delete(username)
	await saveUsers()
}

export async function getSafe(username: string): Promise<UserSafe | undefined> {
	const user = users.get(username)
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

export async function auth(token: string): Promise<string | undefined> {
	const tokenData = authTokens.get(token)
	if (!tokenData || tokenData.expiry < Date.now()) {
		if (tokenData) authTokens.delete(token)
		return "FAIL"
	}
	return tokenData.username
}

export async function token(username: string): Promise<string | undefined> {
	const token = Bun.randomUUIDv7()
	authTokens.set(token, {
		username: username,
		expiry: Date.now() + 3600000,
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
		location:
			(await (await fetch("http://ip-api.com/json/" + ip)).json())
				.regionName +
			", " +
			(await (await fetch("http://ip-api.com/json/" + ip)).json())
				.country,
		skips: 1
	}

	users.set(username, user)
	saveUsers()
	return user
}

export async function updateLocation(
	username: string,
	ip: string
): Promise<void> {
	const user = await get(username)
	if (!user) return
	const response = await (await fetch("http://ip-api.com/json/" + ip)).json()
	if (response && response.status && response.status === "success") {
		user.location =
			response.city + ", " + response.regionName + ", " + response.country
		users.set(username, user)
		saveUsers()
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
