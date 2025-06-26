'use client'

import { useClerk } from "@clerk/nextjs"
import { Bookmark, ListTodo, LogOut, Search, Twitter, User } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { name: "Explore", icon: Search, href: "/explore" },
  { name: "Lists", icon: ListTodo, href: "/lists" },
  { name: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { name: "Profile", icon: User, href: "/profile" },
]

export function SideMenu() {
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="fixed top-0 left-0 h-screen flex flex-col border-r w-64 py-4 px-2 bg-white z-30 overflow-y-auto shadow-md">
      <div className="px-4 mb-6">
        <Link href="/" className="flex items-center">
          <Twitter className="h-8 w-8 text-blue-500" />
        </Link>
      </div >

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <div key={item.name} className="flex items-center gap-4 px-4 py-3 text-lg rounded-full hover:bg-gray-100 transition-colors font-normal">
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto px-4 mb-6">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-full hover:bg-red-100 transition-colors flex items-center gap-3 text-red-600 border border-red-200">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">ログアウト</span>
        </button>
      </div>
    </div >
  )
}