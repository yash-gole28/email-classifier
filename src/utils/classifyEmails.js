import axios from "axios";

export async function classifyEmails(emails, maxTokens) {
  const apiUrl = 'https://api.openai.com/v1/completions';
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  try {
    if (!Array.isArray(emails)) {
      throw new Error('Input emails is not an array');
    }

    const textPrompts = emails.map((email) => {
      const { subject, body, from } = email;
      return `Classification:\n"${subject}"\n"${body}"\nFrom: ${from}\n`;
    }).join('\n');

    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo',
      prompt: textPrompts,
      max_tokens: maxTokens,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    console.log(response.data)
    return response.data.choices.map(choice => choice.text.trim());
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
