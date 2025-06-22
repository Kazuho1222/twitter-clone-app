import PostForm from "@/components/PostForm"
import PostList from "@/components/PostList"
import { SignOutButton } from "@clerk/nextjs"

function Home() {
  return (
    <div className="max-w-xl mx-auto min-h-screen">
      <div><PostForm /></div>
      <PostList />
    </div>
  )
}

export default Home