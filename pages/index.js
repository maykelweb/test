import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();
  const [error, setError] = useState(null);
  let context = "";

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    
    // Clear the input
    setInput("");

    try {
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      try {
        const response = await fetch("/api/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vector: data.result }),
        });

        const matchData = await response.json();
        if (response.status !== 200) {
          throw matchData.error || new Error(`Request failed with status ${response.status}`);
        }

        // Get the div to place the results
        const resultbox = document.querySelector("#results");
        resultbox.innerHTML = "";
        let p = document.createElement("p");
        context = "The following is a conversation with an user and AI. The Ai listens and tries to find out the user's symptons using the conversation and context that is not visible to the user.\n\n context:"
        // Append the matches to the results div
        for (let i = 0; i < matchData.result.length; i++) {
          context += matchData.result[i].metadata.text;
          if (matchData.result[i].metadata.text.length > 300) {
            break;
          }
        }

      } catch (error) {
        console.log(error)
      }

    } catch (error) {
      console.log(error)
    }

    // Add user message to chatbox
    // Get chatbox
    const chat = document.querySelector("#chatbox");

    //Create message div and add input with styling
    const div = document.createElement("div");
    div.className = styles.user__messages;
    div.innerHTML = `<p>You: ${input}</p>`;
    chat.appendChild(div); // Add to chatbox
    chat.scrollTop = chat.scrollHeight; // Scroll to bottom to see new message

    // Get the last 3 messages from the chatbox
    let previousChat = chat.querySelectorAll("p");
    let chatContext = "";

    if (previousChat.length > 3) {
      previousChat = Array.from(previousChat).slice(-3);
    }

    // Add previous messages to context
    previousChat.forEach(function (el) {
      chatContext += el.innerHTML + "/n";
    });
    // Add ending to context
    chatContext += "Health Chat: ";
    context += "\n" + chatContext;

    console.log(context)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: context }),
      });

      setInput("");
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);

      // append message as div to chatbox
      const chatbox = document.querySelector("#chatbox");
      const div = document.createElement("div");
      div.className = styles.healthchat__messages;
      div.innerHTML = `<p>Health Chat: ${data.result}</p>`;
      chatbox.appendChild(div);
      chatbox.scrollTop = chatbox.scrollHeight;

      //Debug 
      const resultbox = document.querySelector("#results");
      resultbox.innerHTML = "";
      let p = document.createElement("p");
      p.innerHTML = context;
      resultbox.appendChild(p);
      

    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Health Chat</title>
        <link rel="icon" href="/health-logo.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.about}>
          <div id="results" className={styles.debug}></div>
        </div>
        <div className={styles.chatbox}>
          <div id="chatHeader">
            <img src="/health-logo.png" className={styles.logoHeader} />
            <h2>Health Chat</h2>
          </div>

          <div className={styles.chat}>
            <div id="chatbox">
              <div className={styles.healthchat__messages}>
                <p>Hi, how can I help you?</p>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="chat"
                placeholder="Enter your symptoms"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <input type="submit" value=">" />
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}
