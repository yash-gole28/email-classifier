'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchEmails } from '../utils/fetchEmails';
import Link from 'next/link';

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

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
        const fetchedEmails = await fetchEmails(session.user.accessToken);
        setEmails(fetchedEmails);
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
            <h1 className="text-2xl text-black mb-4">Welcome, {session.user.name}</h1>
            <h1 className="text-2xl text-black mb-4">Email: {session.user.email}</h1>
            <button onClick={handleFetchEmails} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Fetching...' : 'Fetch Emails'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {emails.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl text-blue-500 font-bold mb-4">Fetched Emails</h2>
                <table className="w-full border-collapse text-black border border-gray-500">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-500 px-4 py-2">Subject</th>
                      <th className="border border-gray-500 px-4 py-2">From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email, index) => (
                      <tr key={index} className="border border-gray-500">
                        <td className="border border-gray-500 px-4 py-2">{email.subject}</td>
                        <td className="border border-gray-500 px-4 py-2">{email.from}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <Link href="/api/auth/signin" className="text-2xl mb-4 text-black">Sign In</Link>
        )}
      </div>
    </div>
  );
}
