import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import "./Main.css";

const Main = () => {
  const { onSent, responses } = useContext(Context);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");

  // Latest response
  const latestResponse = responses.length > 0 ? responses[responses.length - 1] : null;

  // Typewriter effect
  useEffect(() => {
    if (latestResponse && !loading) {
      let i = 0;
      setDisplayText(""); // reset
      const text = latestResponse.reply;
      const interval = setInterval(() => {
        setDisplayText((prev) => prev + text[i]);
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 20); // adjust speed here
      return () => clearInterval(interval);
    }
  }, [latestResponse, loading]);

  const handleSend = async (promptText) => {
    const prompt = promptText || input;
    if (!prompt) return;

    setLoading(true);
    setInput("");
    await onSent(prompt);
    setLoading(false);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>harsh.ai</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {/* Greeting */}
        {!latestResponse && (
          <div className="greet">
            <p><span>Hello, Harsh 👋</span></p>
            <p>Ready when you are!</p>
          </div>
        )}

        {/* Gemini Response */}
        {latestResponse && (
          <div className="result-box">
            <p className="user-question">{latestResponse.prompt}</p>
            <div className="ai-response-box">
              <p className="ai-response">{loading ? "Thinking..." : displayText}</p>
            </div>
          </div>
        )}

        {/* Cards: hide when a response is active */}
        {!latestResponse && (
          <div className="cards">
            <div className="card" onClick={() => handleSend("What is the weather of New Delhi?")}>
              <p>What is the weather of New Delhi?</p>
              <img src={assets.compass_icon} alt="" />
            </div>

            <div className="card" onClick={() => handleSend("Briefly summarize urban planning")}>
              <p>Briefly summarize urban planning</p>
              <img src={assets.bulb_icon} alt="" />
            </div>

            <div className="card" onClick={() => handleSend("Explain React Context API")}>
              <p>Explain React Context API</p>
              <img src={assets.message_icon} alt="" />
            </div>

            <div className="card" onClick={() => handleSend("Write a simple JavaScript example")}>
              <p>Write a simple JavaScript example</p>
              <img src={assets.code_icon} alt="" />
            </div>
          </div>
        )}

        {/* Bottom Input */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                src={assets.send_icon}
                alt=""
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <p className="bottom-info">
            It may display inaccurate info. Always verify important details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
