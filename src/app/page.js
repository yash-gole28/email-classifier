'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchEmails } from '../utils/fetchEmails';
import { classifyEmails } from '../utils/classifyEmails';
import Link from 'next/link';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [limit , setLimit] = useState(15)

  // const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const handleChange = (event)=> {
    setLimit(event.target.value)
  }
  // Load emails from local storage on initial render
  useEffect(() => {
    const storedEmails = localStorage.getItem('emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
  }, []);

  // Save emails to local storage whenever emails state changes
  useEffect(() => {
    localStorage.setItem('emails', JSON.stringify(emails));
  }, [emails]);

  const handleFetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (session?.user?.accessToken) {
        const fetchedEmails = await fetchEmails(session.user.accessToken , limit);
        console.log(fetchedEmails)
        setEmails(fetchedEmails)
        // const classifiedEmails = await classifyEmails(fetchedEmails , 150);
        // setEmails(classifiedEmails);
      } else {
        setError('No access token available.');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        {session ? (
          <>
            <h1 className="text-3xl font-bold text-black mb-4">Welcome, {session.user.name}</h1>
            <h1 className="text-2xl text-slate-700 mb-4">Email: {session.user.email}</h1>
            <h2 className="text-xl text-black mb-4">select the number of emails you want to get</h2>
           <div>
                 <Link href="/api/auth/signout" className="px-4 py-2 mr-4 bg-blue-600 text-white rounded">Sign Out</Link>
            {emails?.length ? null : <button onClick={handleFetchEmails} className="px-4 py-2 mr-4 bg-blue-600 text-white rounded">
              {loading ? 'Fetching...' : 'Fetch and Classify Emails'}
            </button> }
            {emails?.length ? null :  <select className=' border-2 rounded-xl mr-4 px-4 py-2 text-blue-700 border-slate-800'  onChange={handleChange} name="emailLimit" value={limit} id="">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select> }

           </div>
           

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {emails?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl text-blue-500 font-bold mb-4">Your Emails</h2>
                <table className="w-full border-collapse text-black border border-gray-500">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-500 px-4 py-2">Subject</th>
                      <th className="border border-gray-500 px-4 py-2">From</th>
                      <th className="border border-gray-500 px-4 py-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email, index) => (
                      <tr key={index} className="border border-gray-500">
                        <td className="border border-gray-500 px-4 py-2">{email.subject}</td>
                        <td className="border border-gray-500 px-4 py-2">{email.from}</td>
                        <td className="border border-gray-500 px-4 py-2">{email.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : ( <div>
          <h1 className=' text-slate-700 text-3xl m-8'>SignIn to get Your Emails</h1>
          <Link href="/api/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</Link>
        </div>
        )}
      </div>
    </div>
  );
}
