import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    const chatbox = document.querySelector("#chatbox");

    const div = document.createElement("div");
    div.className = styles.user__messages;
    div.innerHTML = `<p>You: ${chatInput}</p>`;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
    
    setChatInput("");

    // Get the last 3 messages from the chatbox
    let previousChat = chatbox.querySelectorAll("p");
    let chatContext = "";

    if (previousChat.length > 3) {
      previousChat = Array.from(previousChat).slice(-3);
    }

    previousChat.forEach(function(el) {
      chatContext += el.innerHTML + "/n";
    });
    // Add ending to context
    chatContext += "Health Chat: ";

    console.log(chatContext);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: chatInput, context: chatContext }),
      });
      
      setChatInput("");
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


    } catch(error) {
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
        
        <h3>Health Chat</h3>
        
        <div className={styles.chat}>
          <div id="chatbox" className={styles.chatbox}>
            <div className={styles.healthchat__messages}>
              <p>Health Chat: You are now talking to Healthchat, here to answer all your healthcare needs. Just so you know, I am not a licensed doctor, but I do use the latest NHS information, and can also give guidance on natural remedies and nutritional information that could help your health if asked.</p>
            </div>
          </div>
        
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="chat"
              placeholder="Tell health chat about your health"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <input type="submit" value="Send Message" />
          </form>
        </div>
        <div className={styles.about}>
            <img src="/the-bag.jpg" className={styles.partners} />
            <img src="/harley-street.jpg" className={styles.partners} />
            <img src="/dtm-global.jpg" className={styles.partners} />
        </div>
      </main>
    </div>
  );
}
