import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.PINECONE_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "Pinecone API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  
  const request = {vector: req.body.vector, topK: 3, includeMetadata: true, includeValues: true}

  try {
    const response = await fetch("https://openai-9229b3f.svc.us-west1-gcp.pinecone.io/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": `${configuration.apiKey}`
      },
      body: JSON.stringify(request)
    });
    const data = await response.json();
    res.status(200).json({ result: data.matches });
  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}
