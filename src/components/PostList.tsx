'use client'

import { Post } from "@/domain/Post"
import { client } from "@/lib/client"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { PostItem } from "./PostItem"

export function PostList() {
  const { userId } = useAuth()

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const params = userId ? { userId } : {}
      const res = await client.post.all.$get(params)
      return await res.json()
    },
  })

  console.log("PostList debug:", { posts, isLoading, error, userId })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading posts: {error.message}
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet. Be the first to post!
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {posts.map((post: Post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}