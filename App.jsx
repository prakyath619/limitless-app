import React, { useEffect, useState } from "react";

export default function App() {
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState(null); // 'productive' | 'vibe' | 'surprise'
  const [streak, setStreak] = useState(0);
  const [currentView, setCurrentView] = useState("Stuff");
  const [input, setInput] = useState("");
  const [miniScore, setMiniScore] = useState(null);

  useEffect(() => {
    const greeting = `Yo! What’s up, man? I’m Jesse Jarvis — kinda like Jesse Pinkman if you know Breaking Bad. If not… go watch it. I’m also like Jarvis from Iron Man, so I got your back. Call me JJ. So, what’s the move today?`;
    pushJJ(greeting, 600);
  }, []);

  function pushJJ(text, delay = 300) {
    setTimeout(() => {
      setHistory((h) => [...h, { who: "JJ", text }]);
    }, delay);
  }

  function pushUser(text) {
    setHistory((h) => [...h, { who: "You", text }]);
  }

  function handleChoice(choice) {
    setMode(choice);
    pushUser(choice === "productive" ? "Let’s be productive" : choice === "vibe" ? "Just vibing" : "Surprise me");

    if (choice === "productive") {
      pushJJ("Alright, look at you trying to be responsible. Respect. I’ll drop your top 3 wins for today.");
      pushJJ("1) Knock out one task from Glow-Up. 2) Post a tiny update in People. 3) 10-min micro-lesson.");
      setCurrentView("Glow-Up");
    } else if (choice === "vibe") {
      pushJJ("Chill mode activated. I got memes, music recs, and a 30s game. Want to try anything?");
      setCurrentView("Mess Around");
    } else {
      pushJJ("You trust me that much? Bold move. Rolling the dice... surprise unlocked: quick challenge!");
      setCurrentView("People");
      setTimeout(() => {
        pushJJ("Surprise: post a throwback pic in People. I’ll roast it lovingly.");
      }, 800);
    }
  }

  function handlePost(content) {
    pushUser(content || "(posted)");
    const opinion = honestOpinion(content || "your post");
    pushJJ(opinion);
    setStreak((s) => s + 1);
    setCurrentView("People");
  }

  function honestOpinion(content) {
    const len = content.length;
    if (len < 10) return "Short and spicy — might get a chuckle, might get a crickets chorus.";
    if (len < 40) return "Hmm... not bad. Tweak the caption and it could slay.";
    return "Wordy... cut it down or people will nap. But points for effort.";
  }

  function startMiniGame() {
    pushUser("Start mini-game");
    pushJJ("30-second challenge — try beat my low-key perfect score. Ready? Go!");
    setTimeout(() => {
      const score = Math.floor(Math.random() * 100);
      setMiniScore(score);
      pushJJ(`Game over. Your score: ${score}. ${score > 70 ? "Woah, impressive... for once." : "Not terrible. Keep practicing, champ."}`);
      if (score > 70) setStreak((s) => s + 2);
      else setStreak((s) => s + 1);
    }, 1400);
  }

  function openModule(mod) {
    setCurrentView(mod);
    pushUser(`Open ${mod}`);
    pushJJ(`Opening ${mod}. Here’s what matters:`);
    if (mod === "Glow-Up") {
      pushJJ("Glow-Up: hydrate, 10 push-ups, read 10 pages. Small wins stack up.");
    } else if (mod === "Show Off") {
      pushJJ("Show Off: post something you made. I’ll roast or praise, depends on you.");
    } else if (mod === "Stack") {
      pushJJ(`Stack: You have ${streak} stacks. Spend or hoard?`);
    } else if (mod === "People") {
      pushJJ("People: Your top friend posted a spicy meme. Wanna see?");
    } else if (mod === "Mess Around") {
      pushJJ("Mess Around: quick games, dares, and chaos. Start a 30s challenge?");
    } else if (mod === "Stuff") {
      pushJJ("Stuff: Your daily snapshot — streaks, suggested tasks, and a hot tip.");
    } else if (mod === "Me") {
      pushJJ("Me: Your vibe, your stats, and my roast of the week.");
    }
  }

  function handleQuickReply(reply) {
    pushUser(reply);
    if (reply.includes("productive")) {
      handleChoice("productive");
    } else if (reply.includes("vibing") || reply.includes("chill")) {
      handleChoice("vibe");
    } else if (reply.includes("surprise")) {
      handleChoice("surprise");
    } else if (reply.includes("game")) {
      startMiniGame();
    } else if (reply.includes("post")) {
      handlePost(input || "My epic post");
      setInput("");
    }
  }

  return (
    <div className="app-root">
      <div className="container">
        <header className="topbar">
          <div className="logo">LIMITLESS</div>
          <div className="streak">Streaks: <span className="badge">{streak}</span></div>
        </header>

        <main className="main">
          <section className="left">
            <div className="jj-card">
              <div className="jj-header">
                <div className="jj-avatar">JJ</div>
                <div className="jj-name">Jesse Jarvis</div>
              </div>

              <div className="jj-greeting">
                {history.filter(h => h.who === "JJ").slice(-1)[0]?.text ?? ""}
              </div>

              <div className="quick-actions">
                <button onClick={() => handleChoice("productive")} className="btn primary">Let's be productive</button>
                <button onClick={() => handleChoice("vibe")} className="btn neutral">Just vibing</button>
                <button onClick={() => handleChoice("surprise")} className="btn alt">Surprise me</button>
              </div>

              <div className="chat-history">
                {history.map((m, i) => (
                  <div key={i} className={`chat-row ${m.who === "JJ" ? "jj" : "you"}`}>
                    <div className="meta">{m.who}</div>
                    <div className="text">{m.text}</div>
                  </div>
                ))}
              </div>

              <div className="input-row">
                <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Say something to JJ (post / game / productive)" />
                <button onClick={()=>{ if (input.trim()){ pushUser(input); pushJJ(honestOpinion(input)); setInput(""); } }} className="btn send">Send</button>
                <button onClick={()=>handleQuickReply('game')} className="btn play">Play</button>
              </div>
            </div>
          </section>

          <aside className="right">
            <Module title="People" desc="Who’s up? See it. Say hi." onOpen={()=>openModule('People')} />
            <Module title="Show Off" desc="Make. Post. Flex a little." onOpen={()=>openModule('Show Off')} />
            <Module title="Glow-Up" desc="Do stuff. Get better. Repeat." onOpen={()=>openModule('Glow-Up')} />
            <Module title="Stack" desc="Stack 'em. Spend 'em. Brag." onOpen={()=>openModule('Stack')} />
            <Module title="Mess Around" desc="Play. Win. Trash talk optional." onOpen={()=>openModule('Mess Around')} />
            <Module title="Me" desc="All your stuff. Your vibe." onOpen={()=>openModule('Me')} />
          </aside>
        </main>

        <footer className="footer">
          <nav>
            <button className={`navbtn ${currentView==='Stuff'?'active':''}`} onClick={()=>openModule('Stuff')}>Stuff</button>
            <button className={`navbtn ${currentView==='People'?'active':''}`} onClick={()=>openModule('People')}>People</button>
            <button className={`navbtn ${currentView==='Mess Around'?'active':''}`} onClick={()=>openModule('Mess Around')}>Mess Around</button>
            <button className={`navbtn ${currentView==='Glow-Up'?'active':''}`} onClick={()=>openModule('Glow-Up')}>Glow-Up</button>
          </nav>
          <div className="brand">Limitless — Jesse Jarvis (JJ)</div>
        </footer>
      </div>
    </div>
  );
}

function Module({title, desc, onOpen}) {
  return (
    <div className="module">
      <div>
        <div className="m-title">{title}</div>
        <div className="m-desc">{desc}</div>
      </div>
      <button onClick={onOpen} className="btn open">Open</button>
    </div>
  );
}
