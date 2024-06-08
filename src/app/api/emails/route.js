// // app/api/emails/route.js

// import { NextResponse } from 'next/server';
// import { google } from 'googleapis';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const accessToken = searchParams.get('accessToken');

//   if (!accessToken) {
//     return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
//   }

//   try {
//     const auth = new google.auth.OAuth2();
//     auth.setCredentials({ access_token: accessToken });

//     const gmail = google.gmail({ version: 'v1', auth });

//     const res = await gmail.users.messages.list({
//       userId: 'me',
//       maxResults: 15,
//     });

//     const messages = res.data.messages || [];
//     const emailData = await Promise.all(
//       messages.map(async (message) => {
//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const headers = msg.data.payload.headers;
//         const subjectHeader = headers.find((header) => header.name === 'Subject');
//         const fromHeader = headers.find((header) => header.name === 'From');

//         return {
//           id: message.id,
//           subject: subjectHeader ? subjectHeader.value : '(No subject)',
//           from: fromHeader ? fromHeader.value : '(No sender)',
//         };
//       })
//     );

//     return NextResponse.json(emailData);
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return NextResponse.json({ error: 'Error fetching emails' }, { status: 500 });
//   }
// }
