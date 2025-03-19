import type { User } from "./types";
let users = Bun.file("./data/users.json").json();

const countryFlags = {
  "AF": "🇦🇫", "AL": "🇦🇱", "DZ": "🇩🇿", "AS": "🇦🇸", "AD": "🇦🇩", "AO": "🇦🇴",
  "AR": "🇦🇷", "AM": "🇦🇲", "AW": "🇦🇼", "AU": "🇦🇺", "AT": "🇦🇹", "AZ": "🇦🇿",
  "BS": "🇧🇸", "BH": "🇧🇭", "BD": "🇧🇩", "BB": "🇧🇧", "BY": "🇧🇾", "BE": "🇧🇪",
  "BZ": "🇧🇿", "BJ": "🇧🇯", "BT": "🇧🇹", "BO": "🇧🇴", "BA": "🇧🇦", "BW": "🇧🇼",
  "BR": "🇧🇷", "BN": "🇧🇳", "BG": "🇧🇬", "BF": "🇧🇫", "BI": "🇧🇮", "KH": "🇰🇭",
  "CM": "🇨🇲", "CA": "🇨🇦", "CV": "🇨🇻", "KY": "🇰🇾", "CF": "🇨🇫", "TD": "🇹🇩",
  "CL": "🇨🇱", "CN": "🇨🇳", "CO": "🇨🇴", "KM": "🇰🇲", "CG": "🇨🇬", "CD": "🇨🇩",
  "CR": "🇨🇷", "CU": "🇨🇺", "CY": "🇨🇾", "CZ": "🇨🇿", "CI": "🇨🇮", "DK": "🇩🇰",
  "DJ": "🇩🇯", "DM": "🇩🇲", "DO": "🇩🇴", "EC": "🇪🇨", "EG": "🇪🇬", "SV": "🇸🇻",
  "GQ": "🇬🇶", "ER": "🇪🇷", "EE": "🇪🇪", "SZ": "🇸🇿", "ET": "🇪🇹", "FI": "🇫🇮",
  "FJ": "🇫🇯", "FM": "🇫🇲", "FA": "🇫🇦", "FR": "🇫🇷", "GA": "🇬🇦", "GB": "🇬🇧",
  "GE": "🇬🇪", "GH": "🇬🇭", "GI": "🇬🇮", "GR": "🇬🇷", "GL": "🇬🇱", "GD": "🇬🇩",
  "GU": "🇬🇺", "GT": "🇬🇹", "GN": "🇬🇳", "GW": "🇬🇼", "GY": "🇬🇾", "HT": "🇭🇹",
  "HN": "🇭🇳", "HK": "🇭🇰", "HU": "🇭🇺", "IS": "🇮🇸", "IN": "🇮🇳", "ID": "🇮🇩",
  "IR": "🇮🇷", "IQ": "🇮🇶", "IE": "🇮🇪", "IL": "🇮🇱", "IT": "🇮🇹", "JM": "🇯🇲",
  "JP": "🇯🇵", "JO": "🇯🇴", "KZ": "🇰🇿", "KE": "🇰🇪", "KI": "🇰🇮", "KP": "🇰🇵",
  "KR": "🇰🇷", "KW": "🇰🇼", "KG": "🇰🇬", "LA": "🇱🇦", "LV": "🇱🇻", "LB": "🇱🇧",
  "LS": "🇱🇸", "LR": "🇱🇷", "LY": "🇱🇾", "LI": "🇱🇮", "LT": "🇱🇹", "LU": "🇱🇺",
  "MO": "🇲🇴", "MK": "🇲🇰", "MG": "🇲🇬", "MW": "🇲🇼", "MY": "🇲🇾", "MV": "🇲🇻",
  "ML": "🇲🇱", "MT": "🇲🇹", "MH": "🇲🇭", "MQ": "🇲🇶", "MR": "🇲🇷", "MU": "🇲🇺",
  "YT": "🇾🇹", "MX": "🇲🇽", "FM": "🇫🇲", "MD": "🇲🇩", "MC": "🇲🇨", "MN": "🇲🇳",
  "ME": "🇲🇪", "MS": "🇲🇸", "MA": "🇲🇦", "MZ": "🇲🇿", "MM": "🇲🇲", "NA": "🇳🇦",
  "NR": "🇳🇷", "NP": "🇳🇵", "NL": "🇳🇱", "NC": "🇳🇨", "NZ": "🇳🇿", "NI": "🇳🇮",
  "NE": "🇳🇪", "NG": "🇳🇬", "NU": "🇳🇺", "NF": "🇳🇫", "MP": "🇲🇵", "NO": "🇳🇴",
  "NP": "🇳🇵", "OM": "🇴🇲", "PK": "🇵🇰", "PW": "🇵🇼", "PA": "🇵🇦", "PG": "🇵🇬",
  "PY": "🇵🇾", "PE": "🇵🇪", "PH": "🇵🇭", "PN": "🇵🇳", "PL": "🇵🇱", "PT": "🇵🇹",
  "PR": "🇵🇷", "QA": "🇶🇦", "RO": "🇷🇴", "RU": "🇷🇺", "RW": "🇷🇼", "RE": "🇷🇪",
  "BL": "🇧🇱", "SH": "🇸🇭", "KN": "🇰🇳", "LC": "🇱🇨", "MF": "🇲🇫", "PM": "🇵🇲",
  "VC": "🇻🇨", "WS": "🇼🇸", "SM": "🇸🇲", "ST": "🇸🇹", "SA": "🇸🇦", "SN": "🇸🇳",
  "RS": "🇷🇸", "SC": "🇸🇨", "SL": "🇸🇱", "SG": "🇸🇬", "SX": "🇸🇽", "SK": "🇸🇰",
  "SI": "🇸🇮", "SB": "🇸🇧", "SO": "🇸🇴", "ZA": "🇿🇦", "SS": "🇸🇸", "ES": "🇪🇸",
  "LK": "🇱🇰", "SD": "🇸🇩", "SR": "🇸🇷", "SJ": "🇯🇴", "SE": "🇸🇪", "SG": "🇸🇬",
  "SY": "🇸🇾", "TW": "🇹🇼", "TJ": "🇹🇯", "TZ": "🇹🇿", "TH": "🇹🇭", "TL": "🇹🇱",
  "TG": "🇹🇬", "TO": "🇹🇴", "TT": "🇹🇹", "TN": "🇹🇳", "TR": "🇹🇷", "TM": "🇹🇲",
  "TC": "🇹🇨", "TV": "🇹🇻", "UG": "🇺🇬", "UA": "🇺🇦", "AE": "🇦🇪", "GB": "🇬🇧",
  "US": "🇺🇸", "UY": "🇺🇾", "UZ": "🇺🇿", "VU": "🇻🇺", "VA": "🇻🇦", "VE": "🇻🇪",
  "VN": "🇻🇳", "WF": "🇼🇫", "YE": "🇾🇪", "ZM": "🇿🇲", "ZW": "🇿🇼"
};

export async function userExists(username: string): Promise<boolean> {
	return (await users).some((user: User) => user.username === username);
}

export async function getUser(username: string): Promise<User | undefined> {
	return (await users).find((user: User) => user.username === username);
}

export async function createUser(username: string, password: string, gender: boolean, age: number, ip: string): Promise<User> {
	const user: User = {
		username,
		password,
		gender,
		age,
		nickname: "",
		status: "",
		followers: ["fýr"],
		following: ["fýr"],
		location: (await (await fetch("http://ip-api.com/json/"+ip)).json()).country,
		skips: 1
	};

	await users.append(JSON.stringify(user) + "\n");
	return user;
}

export async function updateUserLocation(username: string, ip: string): Promise<void> {
	const user = await getUser(username);
	if (!user) return;
	const response = await (await fetch("http://ip-api.com/json/" + ip)).json();
	if(response && response.status && response.status === "success" && response.mobile === false && response.)
	user.location = ;
	await users.write(JSON.stringify(await users) + "\n");
}


export async function handleRegister(req: Request): Promise<Response> {
	const body = await req.json();
	if(!body.username || !body.password || !body.gender || !body.age){
		return Response.json({ error: "Missing required fields", "success": false }, { status: 400 });
	}
	if (await userExists(body.username)) return Response.json({ error: "Username already exists", "success": false }, { status: 400 });
	const user = await createUser(body.username, body.password, body.gender, body.age, req.headers.get("x-forwarded-for") || "");
	return Response.json({ error: "none", "success": true }, { status: 200 });
}
