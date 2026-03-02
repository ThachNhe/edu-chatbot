function initChat() {
  (() => {
    const logEl = document.getElementById("log");
    const inputEl = document.getElementById("input");
    const sendBtn = document.getElementById("send");
    let lastUserMessage = "";

    const wsProto = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProto}://${location.host}/ws/chat`);

    ws.onopen = () => append("assistant", "ChatBot ready. Ask me anything.");
    ws.onclose = () => append("assistant", "Disconnected");
    ws.onerror = () => append("assistant", "WebSocket error");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        let role = msg.role || "assistant";
        let content = msg.content || "";
        let canAnswer = msg.canAnswer !== false;

        console.log("[WS RAW]", msg);

        if (typeof content === "string") {
          const attemptParse = (txt, label) => {
            try {
              const parsed = JSON.parse(txt);
              console.log("[WS PARSE " + label + " OK]", parsed);
              if (parsed && typeof parsed === "object") {
                return parsed;
              }
            } catch (e) {
              console.log("[WS PARSE " + label + " ERR]", e && e.message ? e.message : e);
            }
            return null;
          };

          let parsed = attemptParse(content, "direct");
          if (!parsed) {
            const trimmed = content.trim();
            parsed = attemptParse(trimmed, "trimmed");
          }
          if (!parsed) {
            const fenceMatch = content.trim().match(/```(?:json)?\s*([\s\S]*?)```/i);
            console.log("[WS TRY fenced]", fenceMatch ? fenceMatch[1] : null);
            if (fenceMatch) parsed = attemptParse(fenceMatch[1].trim(), "fenced");
          }

          if (parsed) {
            if (parsed.answer) content = parsed.answer;
            if (typeof parsed.canAnswer !== "undefined") canAnswer = !!parsed.canAnswer;
            console.log("[WS PARSED OK]", parsed);
          } else {
            console.log("[WS PARSED FAIL, SHOW RAW]", content);
          }
        }

        append(role, content, canAnswer);
      } catch (err) {
        console.log("[WS HANDLER ERR]", err);
        append("assistant", event.data, true);
      }
    };

    sendBtn.onclick = sendMessage;
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    function append(role, text, canAnswer = true) {
      const cls = role === "user" ? "user" : "assistant";
      const row = document.createElement("div");
      row.className = "row " + cls;
      const bubble = document.createElement("div");
      bubble.className = "bubble " + cls;
      bubble.innerHTML = renderMarkdown(text);

      if (role === "assistant" && canAnswer === false) {
        const supportWrap = document.createElement("div");
        supportWrap.className = "support-wrap";
        const supportBtn = document.createElement("button");
        supportBtn.className = "support-btn";
        supportBtn.textContent = "Send Question To Customer Support Via Email";
        const supportStatus = document.createElement("span");
        supportStatus.className = "support-status";
        supportWrap.appendChild(supportBtn);
        supportWrap.appendChild(supportStatus);
        bubble.appendChild(supportWrap);

        supportBtn.addEventListener("click", async () => {
          supportBtn.disabled = true;
          supportStatus.textContent = "Sending...";
          try {
            const res = await fetch("/send_mail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question: lastUserMessage || "" }),
            });
            if (res.ok) {
              supportStatus.textContent = "Email sent, please wait for a response.";
            } else {
              supportStatus.textContent = "Failed to send email.";
            }
          } catch (e) {
            supportStatus.textContent = "Failed to send email.";
          } finally {
            supportBtn.disabled = false;
          }
        });
      }

      row.appendChild(bubble);
      logEl.appendChild(row);
      logEl.scrollTop = logEl.scrollHeight;
    }

    function renderMarkdown(str) {
      if (!str) return "";
      if (window.marked) {
        try {
          const renderer = new marked.Renderer();
          renderer.link = (...args) => {
            let href, title, text;
            if (args.length === 1 && typeof args[0] === "object") {
              const tok = args[0] || {};
              href = tok.href;
              title = tok.title;
              text = tok.text;
            } else {
              [href, title, text] = args;
            }
            const safeHref = href || "#";
            const safeTitle = title ? ` title="${title}"` : "";
            const safeText = typeof text === "undefined" ? "" : text;
            return `<a target="_blank" rel="noopener noreferrer"${safeTitle} href="${safeHref}">${safeText}</a>`;
          };
          return marked.parse(str, {
            renderer,
            mangle: false,
            headerIds: false,
            breaks: true,
          });
        } catch (e) {
          console.warn("Markdown render error", e);
        }
      }
      return (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
    }

    function sendMessage() {
      const text = inputEl.value.trim();
      if (!text) return;
      ws.send(JSON.stringify({ text }));
      append("user", text);
      inputEl.value = "";
      lastUserMessage = text;
    }
  })();
}

async function checkAuth() {
  try {
    const res = await fetch("/api/auth");

    if (res.status === 401) {
      const data = await res.json();
      document.getElementById("login-view").style.display = "flex";
      document.getElementById("chat-view").style.display = "none";
      document.getElementById("login-btn").href = data.login_url;
      return;
    }

    // 200 OK
    document.getElementById("login-view").style.display = "none";
    document.getElementById("chat-view").style.display = "block";
    initChat();

  } catch (e) {
    console.error("Auth check failed", e);
  }
}

checkAuth();