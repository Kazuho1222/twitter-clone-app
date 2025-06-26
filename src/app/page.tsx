import PostForm from "@/components/PostForm"
import { PostList } from "@/components/PostList"
import { SideMenu } from "@/components/SideMenu"
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please sign in to continue</p>
      </div>
    )
  }

  const userProfile = {
    id: 0, // データベースのIDは後で取得
    clerkId: user.id,
    name: user.firstName + " " + user.lastName,
    handle: user.username || user.emailAddresses[0]?.emailAddress || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    avatarUrl: user.imageUrl,
    bio: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <SideMenu />
      </div>
      <main className="flex-1 min-w-0 border-x border-gray-200">
        <PostForm user={userProfile} />
        <PostList />
      </main>
    </div>
  )
}