import { activeReport } from "./detect.js";

// AI Chatbot context-aware replies database
const defaultReplies = [
  "I can help clarify specifics. You can ask: 'Why is the cancer cure suspicious?', 'Explain the clickbait score', or 'Can I trust Reuters?'.",
  "To verify articles, I review emotional indices, checking for missing citations, and comparing statements against verified media repositories.",
  "If you want details on a particular statement, paste it here and I will scan our database outlines for you.",
  "You can use the Language Switcher in the top right to change the application layout language at any time."
];

document.addEventListener("DOMContentLoaded", () => {
  setupChatbot();
});

function setupChatbot() {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-user-input");
  const container = document.getElementById("chat-messages-container");
  const clearBtn = document.getElementById("chat-clear-btn");
  const suggestionBox = document.getElementById("chat-suggestions-box");

  if (!form) return;

  const appendMessage = (text, sender = "bot") => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender === "user" ? "user-msg" : "bot-msg"}`;
    
    msgDiv.innerHTML = `
      <div class="chat-bubble">
        ${text}
      </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  };

  const getBotReply = (query) => {
    const q = query.toLowerCase();

    // Check Hindi request
    if (q.includes("hindi") || q.includes("हिंदी")) {
      if (activeReport && activeReport.verdict === "fake") {
        return "सत्यापन सारांश (Hindi): यह लेख पूरी तरह से असत्य (Fake) है। कैंसर का कोई 'एक दिन का इलाज' वैज्ञानिक रूप से प्रमाणित नहीं है। इसे साझा न करें।";
      } else if (activeReport && activeReport.verdict === "misleading") {
        return "सत्यापन सारांश (Hindi): यह लेख भ्रामक (Misleading) है। सरकारी नीति में परीक्षा को पूरी तरह समाप्त करने की बात नहीं कही गई है, केवल मूल्यांकन पद्धतियों में सुधार किया जा रहा है।";
      }
      return "नमस्ते! मैं आपकी सहायता कर सकता हूँ। आप मुझसे किसी भी खबर की सत्यता के बारे में पूछ सकते हैं।";
    }

    // Cancer Cure replies
    if (q.includes("cancer") || q.includes("cure") || q.includes("miracle")) {
      return "The cancer cure claim is marked as **Fake News (87% probability)**. It claims an overnight cure using unverified herbs. The World Health Organization (WHO) and PubMed verify that no such botanical extract cure exists, and clinical oncology requires extensive peer-reviewed testing.";
    }

    // Education Policy replies
    if (q.includes("education") || q.includes("policy") || q.includes("exam") || q.includes("school")) {
      return "The education policy report is **Misleading (58% probability)**. While the policy drafts suggest using AI tools for learning analysis and administration support, it does not replace examinations or grading frameworks. Classroom testing continues under national guidelines.";
    }

    // India Economy replies
    if (q.includes("economy") || q.includes("gdp") || q.includes("india") || q.includes("largest")) {
      return "The India GDP Growth report is **Credible (92% credibility)**. The 6.8% expansion rate aligns directly with publications from the Central Statistics Office and has been validated by global financial panels like the IMF.";
    }

    // Specific source reputation
    if (q.includes("trust") || q.includes("source") || q.includes("reuters") || q.includes("bbc")) {
      if (q.includes("reuters")) {
        return "Yes, **Reuters** is a highly trusted global news organization with a credibility rating of **95/100** on TruthLens. They follow strict editorial codes and source verification standards.";
      }
      if (q.includes("bbc")) {
        return "Yes, **BBC News** maintains high journalistic standards with a credibility index of **90/100**. They provide neutral coverage of international events.";
      }
      return "To verify if you can trust a source, look at our 'Trusted Outlets Comparison Matrix' on the Fake News Detection page to see how similar outlets cover the topic.";
    }

    if (q.includes("bias") || q.includes("political")) {
      if (activeReport) {
        return `Regarding the active article, our bias indicator shows a score of **${activeReport.bias.pol}** which equates to a **${activeReport.biasLabels.pol}** stance. It features an emotional language level of **${activeReport.bias.emo}%**.`;
      }
      return "Political bias measures whether the writing style favors Left or Right viewpoints, using sentiment analysis and adjective densities.";
    }

    if (q.includes("evidence") || q.includes("incorrect") || q.includes("suspicious")) {
      if (activeReport) {
        const firstClaim = Object.values(activeReport.claims)[0];
        return `A key suspicious statement flagged is: *"${firstClaim.text}"*. Our database reports: **${firstClaim.explanation}** Verified references include: **${firstClaim.sources}**.`;
      }
      return "Suspicious items are marked by our AI analyzer whenever assertions contradict primary fact-check whitelists or lack links to established journals.";
    }

    // Fallback
    const randomIdx = Math.floor(Math.random() * defaultReplies.length);
    return defaultReplies[randomIdx];
  };

  const handleMessageSend = (text) => {
    appendMessage(text, "user");
    
    // Typing indicator delay
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-msg bot-msg typing-indicator";
    typingBubble.innerHTML = `
      <div class="chat-bubble" style="display:flex; gap:4px; align-items:center;">
        <span style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; animation: bounce 1.4s infinite both;"></span>
        <span style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; animation: bounce 1.4s infinite both 0.2s;"></span>
        <span style="width:6px; height:6px; background:var(--text-muted); border-radius:50%; animation: bounce 1.4s infinite both 0.4s;"></span>
      </div>
    `;
    
    // Inline keyframe helper
    if (!document.getElementById("chat-bounce-style")) {
      const style = document.createElement("style");
      style.id = "chat-bounce-style";
      style.textContent = `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(typingBubble);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      // Remove typing bubble
      container.removeChild(typingBubble);
      // Append bot response
      const botResponse = getBotReply(text);
      appendMessage(botResponse, "bot");
    }, 800);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const queryText = input.value.trim();
    if (!queryText) return;
    
    handleMessageSend(queryText);
    input.value = "";
  });

  // Suggested queries clicks
  if (suggestionBox) {
    suggestionBox.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-tag")) {
        const text = e.target.textContent;
        handleMessageSend(text);
      }
    });
  }

  // Clear chat logs
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      container.innerHTML = `
        <div class="chat-msg bot-msg">
          <div class="chat-bubble">
            Chat history cleared. How can I help you investigate claims today?
          </div>
        </div>
      `;
    });
  }
}
