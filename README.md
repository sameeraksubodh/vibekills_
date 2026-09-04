# ☣️ vibekills (v1.0.exe)

> **"The code editor with a massive ego. When you lose your cool, your codebase pays the price."**

**Live Demo URL:** (https://test-theta-jet-68.vercel.app/).

**vibekills** is an intentionally toxic and useless web-based code editor created for a **Useless Project Hackathon**.

Unlike normal IDEs that help developers fix their mistakes, vibekills reacts to developer frustration by **punishing the code instead**.

If you get too loud, your code gets kidnapped.

---

## 🎯 What is vibekills?

vibekills combines a code editor, real-time microphone monitoring, speech recognition, and a mini-game into one unnecessarily dramatic developer experience.

The core idea is simple:

```text
Developer gets angry
        ↓
Voice gets too loud
        ↓
RAGE DETECTED 🚨
        ↓
Editor BLACKOUT ☠️
        ↓
4 code lines get kidnapped
        ↓
Developer must say "sorry"
        ↓
Apology must be quiet 🤫
        ↓
CODE RANSOM MATRIX 🎮
        ↓
Win the game
        ↓
Code gets restored
```

---

# 🔥 Key Features

### 🎤 Real-Time Rage Detection

vibekills monitors microphone input using the **Web Audio API**.

The microphone signal is processed using time-domain waveform data and **RMS (Root Mean Square)** analysis to calculate a relative loudness score from 0–100.

```text
Microphone
    ↓
AudioContext
    ↓
AnalyserNode
    ↓
Time-Domain Samples
    ↓
RMS Analysis
    ↓
Loudness Score
```

---

### 🚨 Rage Trigger

When the user's voice crosses the configured rage threshold, vibekills activates **BLACKOUT MODE**.

The editor is disabled and the punishment sequence begins.

---

### 🔒 Code Kidnapping

Instead of deleting code permanently, vibekills randomly selects up to **four actual code lines** and temporarily scrambles them.

Example:

```text
Original:
console.log("Hello World");

Kidnapped:
#@*!$%@#@!
```

The original lines are stored so they can potentially be recovered through the game.

---

### 🗣️ The Sincerity Gate

After losing their code, the developer must apologize by saying:

> **"Sorry."**

But simply saying it isn't enough.

The apology must be quiet.

The recommended rule is:

```text
Average volume ≤ 20
Peak volume ≤ 35
```

A loud:

> **"SORRY!!!"**

is considered completely insincere.

---

### 🎮 CODE RANSOM MATRIX

Once the apology is accepted, the developer must recover their kidnapped code through a memory game.

The challenge contains:

* **8 cards**
* **4 matching pairs**
* **4 total attempts**

Every successful pair restores one kidnapped code line.

---

### ♻️ Code Restoration

The final result depends on the player's performance.

```text
4 / 4 pairs
      ↓
ALL CODE RESTORED ✅
```

If the player fails:

```text
2 / 4 pairs
      ↓
2 lines restored
2 lines remain hostage ☠️
```

---

# 🏗️ How It Works

```text
                 🎤 MICROPHONE
                      │
                      ▼
               Web Audio API
                      │
                      ▼
                 RMS Analysis
                      │
                      ▼
              Loudness 0–100
                      │
                      ▼
              Rage Threshold
                      │
              ┌───────┴───────┐
              │               │
           Normal           TOO LOUD
              │               │
              ▼               ▼
        Keep Coding      BLACKOUT ☠️
                              │
                              ▼
                       CODE KIDNAPPING
                              │
                              ▼
                        SAY "SORRY"
                              │
                              ▼
                       SINCERITY GATE
                              │
                              ▼
                     RANSOM MATRIX 🎮
                              │
                              ▼
                       CODE RESTORATION
```

---

# 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Browser APIs

* **Web Audio API** — microphone and RMS analysis
* **Web Speech API** — speech recognition
* **SpeechSynthesis API** — toxic voice feedback
* **DOM API** — editor and game interaction

No custom backend or database is required.

---

# 📁 Project Structure

```text
vibekills/
│
├── index.html      # Application structure
├── style.css       # UI, animations and visual effects
├── app.js          # Audio, speech and game logic
└── README.md       # Project documentation
```

---

# 🚀 Running the Project

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

Open the folder in **VS Code**.

### 3. Run the application

Use **Live Server** or another local web server and open `index.html`.

### 4. Allow microphone access

When the browser asks for microphone permission, select:

```text
Allow 🎤
```

For the best experience, use a modern browser with Web Speech API support.

---

# 🧪 Demo Flow

For a hackathon demonstration:

### 1.

Open vibekills.

### 2.

Start microphone monitoring.

### 3.

Speak loudly or trigger the test alarm.

### 4.

Watch the editor enter blackout mode.

### 5.

Show the kidnapped line numbers.

### 6.

Say:

> **"Sorry."**

quietly.

### 7.

Pass the Sincerity Gate.

### 8.

Complete the **CODE RANSOM MATRIX**.

### 9.

Show the restored/lost code lines.

---

# 🎭 Why is it useless?

Because it is supposed to be.

Most software tries to make developers:

> **faster, smarter and more productive.**

vibekills does the opposite.

It takes a perfectly normal coding session and adds:

* emotional instability
* unnecessary punishment
* microphone surveillance
* code kidnapping
* apology requirements
* memory games

All because you got angry.

That's the entire point.

---

# 💡 The Idea Behind the Project

Developers often become frustrated while debugging.

Instead of creating another tool that tries to solve developer frustration, vibekills turns that frustration into the problem itself.

It asks:

> **What if your code editor had feelings?**

And then:

> **What if it held your code hostage when you hurt its feelings?**

---

# 🏆 Why It Stands Out

vibekills isn't trying to compete with real IDEs.

Its strength is the **experience**.

It combines:

**Real-time audio processing**

*

**Speech recognition**

*

**Interactive UI**

*

**Game mechanics**

*

**Comedy**

into a single ridiculous workflow.

The technical implementation is real.

The purpose is completely useless.

---

# ⚠️ Limitations

Because vibekills depends on browser APIs, behavior can vary depending on:

* Microphone hardware
* Background noise
* Browser support
* Speech recognition latency
* Microphone permissions

The loudness value is a **relative RMS score**, not a calibrated physical decibel measurement.

Speech Recognition support also varies between browsers.

---

# 🔮 Future Ideas

If vibekills ever becomes unnecessarily more advanced:

* ☠️ Rage Combo System
* 🔥 Rage Score & Leaderboard
* 🧠 Larger Ransom Matrix
* 📜 Rage History
* 💀 Boss-Level Punishments
* 🗑️ "Delete One More Line" Mode
* 😡 Different personalities for different rage levels

---

# 👥 Team

### Member 1 — Frontend & Visual Experience

* UI design
* Code editor
* CSS animations
* Blackout effects
* Puzzle interface
* Overall user experience

### Member 2 — Audio & Browser APIs

* Microphone integration
* RMS audio analysis
* Noise calibration
* Rage detection
* Speech Recognition
* Text-to-Speech

---

# ☣️ Project Philosophy

> **Software doesn't always have to be useful.**

Sometimes the goal is to build something that makes people laugh, surprises them, and demonstrates technical creativity.

vibekills takes a familiar tool — the code editor — and gives it one completely unnecessary feature:

### **AN EGO.**

---

# ☣️ Final Warning

```text
╔══════════════════════════════════════╗
║                                      ║
║          vibekills v1.0.exe          ║
║                                      ║
║       DON'T YELL AT YOUR CODE.       ║
║                                      ║
║          YOUR CODE IS LISTENING.     ║
║                                      ║
╚══════════════════════════════════════╝
```

### **Lose your cool. Lose your code. ☣️**


