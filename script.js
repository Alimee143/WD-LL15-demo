// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');

// Shared system prompt for tone and personality
const systemPrompt = "You are a friendly, positive conversation assistant for students. Keep responses light, safe for class, and easy to understand.";

// This function sends a prompt to OpenAI and returns the response
async function getOpenAIResponse(userPrompt) {
  // Check if the API key is present
  if (!apiKey || apiKey.trim() === "") {
    responseDiv.textContent = "API key is missing. Please add your OpenAI API key to secrets.js.";
    return;
  }

  // Show loading message
  responseDiv.textContent = 'Thinking...';

  try {
    // Call the OpenAI API using fetch and async/await
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // apiKey comes from secrets.js
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        // Use your prompt ID as a tool for OpenAI (if needed)
        tools: [{ type: "retrieval", id: "pmpt_686c651fcd9081968e1baa872ee67b1006683c9e7244bb76" }],
        max_tokens: 100
      })
    });

    // Parse the JSON response
    const data = await res.json();

    // Get the message from the response
    const message = data.choices && data.choices[0]?.message?.content
      ? data.choices[0].message.content.trim()
      : 'Sorry, I could not get a response.';

    // Show the message in the response area
    responseDiv.textContent = message;
  } catch (error) {
    // Show error message if something goes wrong
    responseDiv.textContent = 'Error: ' + error.message;
  }
}

// Add event listeners to each button

// Icebreaker button
iceBtn.addEventListener('click', () => {
  getOpenAIResponse('Generate a light conversation starter for a group.');
});

// Weird Fact button
factBtn.addEventListener('click', () => {
  getOpenAIResponse('Share a surprising, school-appropriate fact.');
});

// Joke button
jokeBtn.addEventListener('click', () => {
  getOpenAIResponse('Tell a mild, safe-for-class joke.');
});

// Weather button
weatherBtn.addEventListener('click', () => {
  getOpenAIResponse('Start a conversation about what the weather is like outside.');
});