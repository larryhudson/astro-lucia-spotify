import fs from "fs";

async function fetchChatCompletion(model, systemPrompt, messages) {
  const openAiUrl = "https://api.openai.com/v1/chat/completions";

  const requestData = {
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
  };

  const openAiKey = import.meta.env.OPENAI_API_KEY;

  const openAiResponse = await fetch(openAiUrl, {
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestData),
  });

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();
    const responseStatus = openAiResponse.status;
    throw new Error(`Error ${responseStatus}. ${errorText}`);
  }

  const responseJson = await openAiResponse.json();

  return responseJson;
}

export async function extractStructuredDataFromArticle(articleText) {
  const systemPrompt = `Extract structured data about the music artist in the supplied article text.
Return data in JSON.
Example:
{
"members": [{
"name": "John Lennon",
}],
"city_of_origin": "Liverpool, England",
"genres": ["rock", "pop"],
"similar_artists": ["Paul McCartney", "George Harrison", "Ringo Starr"],
"songs": ["Imagine", "Strawberry Fields Forever", "Lucy in the Sky with Diamonds"],
}
`;

  const message = {
    role: "user",
    content: articleText,
  };

  const messages = [message];

  const response = await fetchChatCompletion("gpt-4", systemPrompt, messages);
  fs.writeFileSync(
    "tmp/openai-response.json",
    JSON.stringify(response, null, 2),
  );

  const data = response.choices[0].message.content;

  return data;
}

export async function summariseText(text) {
  const systemPrompt = `Summarise the supplied text. Extract the key ideas and return a one-paragraph summary.`;

  const message = {
    role: "user",
    content: text,
  };

  const messages = [message];

  const response = await fetchChatCompletion("gpt-4", systemPrompt, messages);

  const summary = response.choices[0].message.content;

  return summary;
}
