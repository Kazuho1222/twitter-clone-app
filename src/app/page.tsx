import { SignOutButton } from "@clerk/nextjs"

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <SignOutButton />
    </div>
  )
}

export default Home