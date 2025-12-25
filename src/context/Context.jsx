import { createContext, useState } from "react";
import { GoogleGenAI } from "@google/genai";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [responses, setResponses] = useState([]);

  const onSent = async (prompt) => {
    try {
      // Initialize the AI client
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY, // your dev key
      });

      // Generate content
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
        config: {
          tools: [{ codeExecution: {} }], // optional, if you want executable code
        },
      });

      // Extract text parts
      const parts = response?.candidates?.[0]?.content?.parts || [];
      let replyText = "";
      parts.forEach((part) => {
        if (part.text) replyText += part.text + "\n";
        if (part.executableCode?.code)
          replyText += "\n[Code]: " + part.executableCode.code + "\n";
        if (part.codeExecutionResult?.output)
          replyText += "\n[Output]: " + part.codeExecutionResult.output + "\n";
      });

      // Update context state
      setResponses((prev) => [...prev, { prompt, reply: replyText }]);
      return replyText;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error fetching response.";
    }
  };

  return (
    <Context.Provider value={{ responses, onSent }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
