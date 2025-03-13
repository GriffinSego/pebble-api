type User = {
	username: string;
	password: string;
	nickname: string;
	status: string;
	followers: string[];
	following: string[];
	location: string;
	skips: number;
	gender: boolean;
	age: number;
};

type Post = {
	id: string;
	author: string;
	content: string;
	likes: number;
};

type LeaderboardEntry = {
	username: string;
	score: number;
};

type Leaderboard = {
	entries: LeaderboardEntry[];
};
