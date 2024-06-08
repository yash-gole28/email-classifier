import openai from 'openai';

// Function to classify emails using OpenAI's GPT model
export async function classifyEmails(apiKey, emails) {
  try {
    // Initialize OpenAI client with the provided API key
    const openaiClient = new openai.OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    // Prepare text prompts for all emails
    const textPrompts = emails.map((email) => `Classification:\n"${email.subject}"\n"${email.body}"\n`).join('\n');

    // Call OpenAI's GPT model to generate text completions for all emails
    const response = await openaiClient.completions.create({
      model: 'davinci-002', // Specify an available GPT model
      prompt: textPrompts,
      max_tokens: emails.length, // Adjust as needed
      temperature: 0.5, // Adjust as needed
      stop: ['\n\n'], // Stop generation at new email
    });

    // Extract generated texts from model response
    const generatedTexts = response.data.choices.map((choice) => choice.text.trim().split('\n'));

    // Update emails with priorities
    const classifiedEmails = emails.map((email, index) => ({ ...email, priority: generatedTexts[index] }));

    return classifiedEmails;
  } catch (error) {
    console.error('Error classifying emails:', error);
    throw error;
  }
}
