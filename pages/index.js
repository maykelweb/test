import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: chatInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setChatInput("");
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
        <link rel="icon" href="/health-chat-logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/health-chat-logo.png" className={styles.icon} />
        <h3>Health Chat</h3>
        
        <div className={styles.result}>{result}</div>
        
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="chat"
            placeholder="Enter your symptoms"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <input type="submit" value="Chat" />
        </form>
      </main>
    </div>
  );
}
