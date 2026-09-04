# ☣️ vibekills (v1.0.exe)

> **"The code editor with a massive ego. When you lose your cool, your codebase pays the price."**

**Live Demo URL:** (https://test-theta-jet-68.vercel.app/)

Built over a frantic, overnight 12-hour sprint for a **Useless Project Hackathon**, **vibekills** is an emotionally volatile, hyper-sensitive, and toxic web-based text editor. It actively punishes developer frustration by scrambling your actual source code and holding it hostage, forcing you into total submission and a high-stakes arcade mini-game to get it back.

---

## 🎨 Workspace Aesthetic & UX Design
*   **VS Code Mimic Panel:** A premium, minimalist dark-charcoal editor layout (`#1e1e1e`) built with pure CSS flexbox elements, featuring an automated side column tracking active line numbers.
*   **Live Decibel Status Bar:** A neon volume progress bar tracking ambient environmental room volume in real time right alongside a manual sensitivity calibration slider to bypass ambient hackathon hall noise.
*   **Retro Arcade Matrix Overlay:** A vibrant full-screen purple-to-black gradient (`radial-gradient(#1a0f30, #080512)`) that isolates the card grid and applies 3D perspective layers to handle crisp card-flip rotations natively.

---

## 🛠️ Core Engineering Pipeline (How it Kills the Vibe)

### 1. High-Accuracy RMS Waveform Sensing 🎛️
The system bypasses volatile frequency averages by using the browser-native **Web Audio API** (`AudioContext` and `AnalyserNode`) to tap into raw **Time-Domain waveforms** (`analyser.getByteTimeDomainData()`). It calculates true acoustic power through a **Root Mean Square (RMS)** mathematical model, mapping sudden physical impact energy (like a desk slam or keyboard slap) onto a stable 0–100 decibel scale.

### 2. Hostage Code Encryption Protocol 🔒
The exact millisecond your volume spikes past the threshold set by the sensitivity slider, keyboard typing control is permanently locked. Instantly, the engine splits your text, selects **4 random lines of your actual code**, and scrambles their contents into unreadable, randomized junk strings (`#@*!!$`). A real-time tracker logs the exact positions held hostage: 
`Lines Under Threat: Lines X, Y, Z, W`. 

Simultaneously, a massive **👊 emoji pops onto the center of the screen** with a custom CSS bounce animation, while the laptop commands over your speakers: *"You are too loud."* 😡

### 3. Sincerity Gate Verification 🤫
To drop the black void, you must verbally say the keyword **"sorry"** into your microphone. The app utilizes the **Web Speech API** (`webkitSpeechRecognition`) to transcribe your voice while cross-checking real-time RMS input volumes. If you scream or speak angrily, the system registers a **Rude Apology**, triggers a chaotic detuned buzzer note, and violently shakes the interface using custom CSS classes. You *must* submissively whisper it gently (Volume ≤ 20) to clear the gate.

### 4. Code Ransom Matrix Gauntlet 🧠 (Single Play, 4 Guesses)
Once your quiet whisper is verified, the system announces: *"Your 4 lines are deleted... you have four attempts win and get your code back."* 

Instead of resetting multiple times, the game launches **one single full-screen window containing an 8-card grid (4 matching pairs of developer tokens: Coffee ☕, Bugs 🐛, Brackets {}, and Keyboards ⌨️)**. The user is given exactly **4 total guess attempts** on this single board. Every mismatch fires an electronic error tone and shakes the card wrappers.

### 5. Final Judgment & Execution 🤖
After your 4 guess turns are exhausted, the matrix locks down, evaluates your final score, and restores that exact corresponding number of encrypted code lines:
*   **Perfect 4/4 Run:** Your full code array is cleanly restored to clear text, and the browser states: *"You got your code back!"* 🎉
*   **Failed Run:** Any lines you failed to match remain **permanently corrupted** inside your editor text box as garbage strings. The interface reveals a bright green `📋 RESTORATION NOTE` box detailing exactly which lines were salvaged or lost, and the system voice drops the final hammer: *"Say them [N] lines are missing."* 🤖

---

## ⚡ The Zero-Cloud Technical Stack
To ensure 100% stage reliability and immunity to crowded hackathon Wi-Fi network drops, the application features **zero external cloud, database, or node package manager dependencies**. Everything runs entirely on the client side inside **3 lightweight local files**:
*   `index.html` (Semantic Layout Views)
*   `style.css` (Pastel Graphics, 3D Flip Configurations, and Spring Keyframes)
*   `app.js` (RMS Time-Domain Calculus, Web Speech Lifecycles, & Game States)

---


