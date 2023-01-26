import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const chat = req.body.chat || '';
  if (chat.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      //model: "curie:ft-personal:nhs-ai-2023-01-17-11-47-55",
      //model: "curie",
      //model: "text-davinci-003",
      model: "text-curie-001",
      //model: "text-babbage-001",
      //model: "text-ada-001",
      //prompt: generatePrompt(chat, context),
      //prompt: context + "\n" + chat,
      prompt: generatePrompt(chat),
      temperature: 0.6,
      max_tokens: 200, 
	    stop: "/n"
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(context) {
 //return `Imagine a long text message chat log between a friendly ai and a user. The ai tries to answer questions but also ask follow-up questions to customize and improve the answer for the user. \n' ${context}`;
 return `Imagine a long text message chat log between a friendly ai and a user. The ai is instructed to give healthcare diagnosis and advice for symptoms based on medical advice from trusted sources. The ai likes to ask questions to improve the answer for the user. '${context}`;
 //return `Imagine a long text message chat log between a doctor and a user. The doctor uses compassionate listening to help her clients get better. He asks questions to customize and improve the answer for the user. \n user: '${chat}'} ->`;
}