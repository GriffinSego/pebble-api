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
	console.log("feed is" + posts.slice(posts.length - 3, posts.length))
	console.log("posts are " + posts.length)
	return posts.slice(posts.length - 3, posts.length)
}

export async function createPost(
	content: string,
	author: string
): Promise<Post> {
	const id = posts.length + 1
	const post: Post = {
		id: id,
		content: content,
		author: author,
		likes: 0,
		time: Date.now()
	}
	posts.push(post)
	await savePosts()
	return post
}
