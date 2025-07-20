const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  // Show a thinking message that we can update later
  const thinkingMsg = appendMessage("bot", "Gemini is thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reply || "An error occurred on the server.");
    }

    const data = await response.json();
    // Update the "thinking" message with the actual reply
    thinkingMsg.textContent = data.reply;
  } catch (error) {
    console.error("Error:", error);
    thinkingMsg.textContent = `Error: ${error.message}`;
    thinkingMsg.classList.add("error"); // Optional: for styling error messages
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
