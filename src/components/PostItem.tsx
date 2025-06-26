'use client'

import { Button } from "@/components/ui/button"
import { Post } from "@/domain/Post"
import { client } from "@/lib/client"
import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import { Heart, MessageCircle, Repeat, Share } from "lucide-react"
import Image from "next/image"
import { useEffect, useOptimistic, useState, useTransition } from "react"

interface PostItemProps {
  post: Post
}

export function PostItem({ post }: PostItemProps) {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()

  // ローカル状態で楽観的更新を管理
  const [localPost, setLocalPost] = useState(post)

  // アニメーション用の一時的な状態
  const [showAnimation, setShowAnimation] = useState(false)

  // propsが変更されたらローカル状態を更新（初回のみ）
  useEffect(() => {
    setLocalPost(post)
  }, [post.id]) // post.idが変更された時のみ更新

  const [optimisticPost, updateOptimisticPost] = useOptimistic(
    localPost,
    (state: Post, newLikeState: boolean) => ({
      ...state,
      like: newLikeState ? state.like + 1 : state.like - 1,
      isLiked: newLikeState,
    })
  )

  const handleLike = () => {
    if (!userId) return

    const newLikeState = !optimisticPost.isLiked

    // いいねを追加する時のみアニメーション表示
    if (newLikeState) {
      setShowAnimation(true)
      // アニメーション終了後に非表示
      setTimeout(() => setShowAnimation(false), 600)
    }

    startTransition(async () => {
      // Optimistically update the UI within transition
      updateOptimisticPost(newLikeState)

      try {
        // Send the actual request
        await client.post.toggleLike.$post({
          postId: optimisticPost.id,
          userId,
        })

        // ローカル状態も更新
        setLocalPost(prev => ({
          ...prev,
          like: newLikeState ? prev.like + 1 : prev.like - 1,
          isLiked: newLikeState,
        }))

        // サーバーとの同期は不要 - 楽観的更新で完結
        // queryClient.invalidateQueries({ queryKey: ["posts"] })
      } catch (error) {
        // Revert optimistic update on error
        updateOptimisticPost(!newLikeState)
        console.error('Failed to toggle like:', error)
      }
    })
  }

  return (
    <div className="hover:bg-gray-50 transition-colors px-4 py-3">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {optimisticPost.handle?.[0]?.toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm">
            <span className="font-bold text-gray-900 mr-1">
              {optimisticPost.name || optimisticPost.handle}
            </span>
            <span className="text-gray-500 mr-1">@{optimisticPost.handle}</span>
            <span className="text-gray-500">
              ・{new Date(optimisticPost.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-gray-900">{optimisticPost.content}</p>
          {optimisticPost.image && (
            <div className="mt-2 rounded-xl overflow-hidden relative max-h-[300px]">
              <Image
                src={optimisticPost.image}
                alt="Post image"
                width={500}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex justify-between max-w-md mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-0 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              <span className="ml-2 text-xs">0</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-0 text-gray-500 hover:text-green-500"
            >
              <Repeat className="h-[18px] w-[18px]" />
              <span className="ml-2 text-xs">0</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-0 text-gray-500 hover:text-red-500 like-button-hover ${optimisticPost.isLiked ? "text-red-500" : ""
                }`}
              onClick={handleLike}
              disabled={!userId || isPending}
            >
              <Heart
                className={`h-[18px] w-[18px] transition-all duration-300 heart-icon ${optimisticPost.isLiked ? "fill-red-500 heart-beat" : ""
                  }`}
              />
              <span className="ml-2 text-xs relative">
                {optimisticPost.like}
                {showAnimation && (
                  <span className="absolute -top-2 -right-1 text-xs text-red-500 count-up">
                    +1
                  </span>
                )}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-0 text-gray-500 hover:text-blue-500"
            >
              <Share className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}