export type User = {
	username: string
	password: string
	nickname: string
	status: string
	followers: string[]
	following: string[]
	posts: string[]
	location: string
	skips: number
	gender: boolean
	age: number
}
export type UserSafe = {
	username: string
	nickname: string
	status: string
	followers: string[]
	following: string[]
	posts: string[]
	location: string
	skips: number
	gender: boolean
	age: number
}

export type Post = {
	id: string
	author: string
	time: number
	content: string
	likes: number
}
export type LeaderboardEntry = {
	username: string
	score: number
}

export type Leaderboard = {
	entries: LeaderboardEntry[]
}

export type auth = {
	username: string
	token: string
}
