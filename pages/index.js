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
    div.innerHTML = `<p><span>You:</span> ${chatInput}</p>`;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
    
    setChatInput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: chatInput }),
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
      div.innerHTML = `<p><span>Health Chat:</span> ${data.result}</p>`;
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
        <link rel="icon" href="/health-chat-logo.jpg" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chat}>
          <h3>Health Chat</h3>
        
          <div id="chatbox" className={styles.chatbox}>
            <div className={styles.healthchat__messages}>
              <p><span>Health Chat:</span> You are now talking to Healthchat, here to answer all your healthcare needs. Just so you know, I am not a licensed doctor, but I do use the latest NHS information, and can also give guidance on natural remedies and nutritional information that could help your health if asked.</p>
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
          <img src="/health-chat-logo.jpg" className={styles.icon} />
          <p> The most advanced Ai healthcare assistant that can give you an instant diagnosis and treatment plan based on your symptoms. </p>
          <p>
          Take the guesswork out of healthcare! Get the best diagnosis and treatment advice from trusted sources based on your input.
          </p>

          <div>
            <img src="/the-bag.jpg" className={styles.partners} />
            <img src="/harley-street.jpg" className={styles.partners} />
            <img src="/dtm-global.jpg" className={styles.partners} />
          </div>
        </div>
      </main>
    </div>
  );
}
