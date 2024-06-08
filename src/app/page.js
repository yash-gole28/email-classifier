'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  useEffect(() => {
    // This effect runs only on the client side
    // You can place any client-side code here
  }, [])

  // Use an initial session value to prevent accessing undefined session on the server
  const { data: session = null } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Render UI based on session status */}
      {session ? (
        <div className="text-center">
          <div className=' flex justify-center'><img className=' rounded-full overflow-hidden' src={session.user.image} alt="" /></div>
          <h1 className="text-2xl text-black mb-4">Welcome, {session.user.name}</h1>
          <h1 className="text-2xl text-black mb-4">Welcome, {session.user.email}</h1>
          <h1 className="text-2xl text-black mb-4">Welcome, {session?.user?.accessToken}</h1>
           <Link className="px-4 py-2 bg-red-600 text-white rounded" href={'/api/auth/signout'}>Signout</Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl mb-4 text-black">Sign In</h1>
          <Link href={'/api/auth/signin'} className="px-4 py-2 bg-blue-600 text-white rounded">
            Sign in with Google
          </Link>
        </div>
      )}
    </div>
  )
}
