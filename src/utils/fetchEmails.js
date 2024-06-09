import axios from 'axios';

// Function to fetch emails from Gmail API
export async function fetchEmails(accessToken , limit) {
  try {
    const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        maxResults: limit, // Limit to 15 emails
      },
    });

    // console.log(response.data.messages)

    const emails = response.data.messages || [];

    // Fetch individual email details
    const emailPromises = emails.map(async (email) => {
      try {
        const res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log(res.data.payload)
        return {
          subject: res.data.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject',
          from: res.data.payload.headers.find(header => header.name === 'From')?.value || 'Unknown Sender',
          body: res.data.payload.body.data || 'no body',
        };
      } catch (error) {
        console.error(`Error fetching details for email ID ${email.id}:`, error.response ? error.response.data : error.message);
        return {
          subject: 'Error fetching subject',
          from: 'Error fetching sender',
          body: 'Error fetching body',
        };
      }
    });

    // Wait for all emails to be fetched
    const fetchedEmails = await Promise.all(emailPromises);
    return fetchedEmails;
  } catch (error) {
    console.error('Error fetching emails:', error.response ? error.response.data : error.message);
    throw error;
  }
}
