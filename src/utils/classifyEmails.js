import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your actual API key
const apiUrl = 'https://api.openai.com/v1/completions';

export async function classifyEmails(emails, maxTokens) {
  try {
    if (!Array.isArray(emails)) {
      throw new Error('Input emails is not an array');
    }

    const textPrompts = emails.map((email) => `Classification:\n"${email.subject}"\n"${email.body}"\n`).join('\n');
    const response = await axios.post(apiUrl, {
      model : 'gpt-3.5-turbo',
      prompt: textPrompts,
      max_tokens: maxTokens,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data.choices.map(choice => choice.text.trim());
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Usage example
