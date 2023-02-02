import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { ThreeDots } from 'react-loader-spinner';
import ReactDOM from 'react-dom';
import ThumbsForm from './ThumbsForm';

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();
  var [query, setQuery] = useState();
  const [error, setError] = useState(null);
  const memoryLength = 10;
  var context = "The following is a conversation with a user and health chat. Health chat is helpful and listens to try to predict the user's medical condition based on the symptoms described by the user and the NHS information. The health chat likes to ask questions to improve the answer for the user and refers to itself as I. Health chat will never suggest or recommend to speak with a gp. At the end of the conversation, the ai will ask something like 'Would you like some more ideas that could help?' \n\n";

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);

    // Clear the input
    setInput("");

    // Add user message to chatbox
    // Get chatbox
    const chat = document.querySelector("#chatbox");

    //Create message div and add text with styling
    const div = document.createElement("div");
    div.className = styles.user__messages;
    //create text element for user message
    let userMessage = document.createElement("p");
    // Set styling and message
    userMessage.style.backgroundColor = "#f6f4fe";
    userMessage.style.color = "black";
    userMessage.innerHTML = input;
    //Append to message div
    div.appendChild(userMessage);
    // align text right
    div.style.textAlign = "right";
    chat.appendChild(div); // Add to chatbox
    chat.scrollTop = chat.scrollHeight; // Scroll to bottom to see new message

    // Create loading dots
    let loadingImg = document.createElement("img");
    loadingImg.src = "/loading2.gif";
    //set size
    loadingImg.style.width = "50px";
    loadingImg.style.height = "50px";
    loadingImg.style.verticalAlign = "middle";

    // Add ai message to chatbox
    // Create the message div
    const aiDiv = document.createElement("div");
    div.className = styles.healthchat__messages;

    //Create img and add to div
    let img = document.createElement("img");
    img.src = "/health-logo.png";
    img.className = styles.logoIcon;
    aiDiv.appendChild(img);
    aiDiv.appendChild(loadingImg);
    chat.appendChild(aiDiv);

    try { // Embed the keywords
      console.log(query)
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

        // Get all semantic matches and add to context
        context += " NHS information:"
        for (let i = 0; i < matchData.result.length; i++) {
          context += matchData.result[i].metadata.text;
          if (matchData.result[i].metadata.text.length > 400) {
            break;
          }
        }

      } catch (error) {
        console.log(error)
      }

    } catch (error) {
      console.log(error)
    }

    // Get the last 3 messages from the chatbox
    let previousChat = chat.querySelectorAll("p");
    let chatContext = "";

    if (previousChat.length > memoryLength) {
      previousChat = Array.from(previousChat).slice(-3);
    }

    // Add previous messages to context
    previousChat.forEach(function (el) {
      // Check if message is from user or health chat
      if (el.style.backgroundColor == "rgb(246, 244, 254)") {
        chatContext += "User: " + el.innerHTML + "/n";
      } else {
        chatContext += "Health Chat: " + el.innerHTML + "/n";
      }
    });
    // Add ending to context
    chatContext += "Health Chat: ";
    context += "\n" + chatContext;

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

      //Remove loading dots 
      aiDiv.removeChild(loadingImg);

      // Add ai message to chatbox
      let p = document.createElement("p");
      p.innerHTML = data.result;
      aiDiv.appendChild(p);

      // Debug
      //const results = document.querySelector("#results");
      //results.innerHTML = `<p>'${context}'</p>`;

      console.log(context)
      //console.log("\nQuery:" + query) //

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
        <div className={styles.chatbox}>
          <div id="chatHeader">
            <img src="/health-logo.png" className={styles.logoHeader} />
            <h2>Health Chat</h2>
          </div>

          <div className={styles.chat}>
            <div id="chatbox">
              <div className={styles.healthchat__messages}>
                <img src="/health-logo.png" className={styles.logoIcon} /><p> Hi, how can I help? </p>
              </div>
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
        <div className={styles.about}>
          <div>
            <h1 className={styles.title}> Health Chat </h1>
            <p className={styles.description}>
              You are now talking to Healthchat, here to answer all your healthcare needs. Just so you know, I am not a licensed doctor, but I do use the latest NHS information, and can also give guidance on natural remedies and nutritional information that could help your health if asked.
            </p>
          </div>
          <h3> Our Partners </h3>
          <div className={styles.partners}>
            <a href="#"><img src="/the-bag.jpg" href="" title="Our Partners" /></a>
            <a target="_blank" href="https://www.harleystreet104.com/"><img src="/harley-street.jpg" title="Our Partners" /></a>
            <a target="_blank" href="https://www.dtmglobalholdings.com/"><img src="/dtm-global.jpg" title="Our Partners" /></a>
          </div>
        </div>
      </main>
    </div>
  );
}
