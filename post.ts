import type { Post } from "./types"
import data from "./data"
let posts: Post[] = await data.posts.get()

async function savePosts() {
	await data.posts.set(posts)
}

export function getFeed(): Post[] {
	console.log("getting feed")
	if (posts.length == 0) return []
	const feed = posts.slice(Math.max(0, posts.length - 50), posts.length)
	console.log("there are", feed.length, "posts")
	return feed
}

export function get(id: number): Post | undefined {
	console.log("getting post " + id)
	const post = posts.find((post) => post.id === id)
	console.log("post is" + JSON.stringify(post))
	return post
}

export async function addSkips(id: number, skips: number): Promise<void> {
	let post = posts.find((post) => post.id === id)
	if (!post) return
	post.likes += skips
	//replace the old post entry with the updated one
	const index = posts.findIndex((post) => post.id === id)
	if (index !== -1) {
		posts[index] = post
	}
	await savePosts()
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
