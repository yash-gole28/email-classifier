// utils/fetchEmails.js

import axios from 'axios';

// Function to fetch emails from Gmail API
export async function fetchEmails(accessToken) {
  try {
    const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        maxResults: 15, // Limit to 15 emails
      },
    });

    const emails = response.data.messages || [];

    // Fetch individual email details
    const emailPromises = emails.map(async (email) => {
      const res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return {
        subject: res.data.payload.headers.find(header => header.name === 'Subject')?.value,
        from: res.data.payload.headers.find(header => header.name === 'From')?.value,
      };
    });

    // Wait for all emails to be fetched
    const fetchedEmails = await Promise.all(emailPromises);
    return fetchedEmails;
  } catch (error) {
    console.error('Error fetching emails:', error.response ? error.response.data : error.message);
    throw error;
  }
}