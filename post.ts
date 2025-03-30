import type { Post } from "./types"
let postsFile = Bun.file("./data/posts.json")
let posts: Post[]
try {
	posts = JSON.parse(await postsFile.text()) as Post[]
} catch (error) {
	console.error("Error loading posts:", error)
}

async function savePosts() {
	await Bun.write(postsFile, JSON.stringify(posts))
}

export function getFeed(): Post[] {
	console.log("getting feed")
	const feed = posts.slice(Math.max(0, posts.length - 50), posts.length)
	console.log("feed is" + JSON.stringify(feed))
	console.log("posts are " + feed.length)
	return feed
}

export function get(id: number): Post | undefined {
	console.log("getting post " + id)
	const post = posts.find((post) => post.id === id)
	console.log("post is" + JSON.stringify(post))
	return post
}

export function exists(id: number): boolean {
	const post = get(id)
	return post !== undefined
}

export async function createPost(
	content: string,
	author: string
): Promise<Post> {
	if (!content || !author) throw new Error("Content and author are required")
	const id = posts.length + 1
	const post: Post = {
		id: id,
		content: content.toString(),
		author: author.toString(),
		likes: 0,
		time: Date.now()
	}
	posts.push(post)
	await savePosts()
	return post
}
