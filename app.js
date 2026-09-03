/**
 * Rage IDE - Frustration-Proof Code Editor
 * Pure browser implementation using Web Audio API & Web Speech API
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const editor = document.getElementById('editor');
  const editorContainer = document.querySelector('.editor-container');
  const lineNumbers = document.getElementById('lineNumbers');
  const startAudioBtn = document.getElementById('startAudioBtn');
  const testBeepBtn = document.getElementById('testBeepBtn');
  const blackoutCountDisplay = document.getElementById('blackoutCount');
  const micStatusText = document.getElementById('micStatusText');
  const volumeMeterFill = document.getElementById('volumeMeterFill');
  const volumeValue = document.getElementById('volumeValue');
  const sensitivitySlider = document.getElementById('sensitivitySlider');
  const sensitivityValue = document.getElementById('sensitivityValue');
  const warningIndicator = document.getElementById('warningIndicator');
  const warningThresholdMarker = document.getElementById('warningThresholdMarker');
  const warningBanner = document.getElementById('warningBanner');
  const warningBannerText = document.getElementById('warningBannerText');

  // Overlay Elements
  const blackout = document.getElementById('blackout');
  const alertCard = document.getElementById('alertCard');
  const statusBadge = document.getElementById('statusBadge');
  const alertTitle = document.getElementById('alertTitle');
  const alertBody = document.getElementById('alertBody');
  const blackoutVolumeFill = document.getElementById('blackoutVolumeFill');
  const blackoutVolumeValue = document.getElementById('blackoutVolumeValue');
  const punchingEmoji = document.getElementById('punchingEmoji');
  const whisperMeterContainer = document.querySelector('.whisper-meter-container');

  // Puzzle Modal Elements
  const puzzleModal = document.getElementById('puzzleModal');
  const currentAttemptText = document.getElementById('currentAttemptText');
  const hostageLinesLog = document.getElementById('hostageLinesLog');
  const puzzleStatus = document.getElementById('puzzleStatus');
  const cardGrid = document.getElementById('cardGrid');
  const finalRestorationNote = document.getElementById('finalRestorationNote');

  // State Variables
  let blackoutCount = 0;
  let currentVolume = 0;
  let sensitivity = parseInt(sensitivitySlider.value, 10);
  let isBlackedOut = false;

  // Audio & Speech Contexts
  let audioCtx = null;
  let analyser = null;
  let speechRecognition = null;
  let isListeningSpeech = false;

  // ---- Noise-floor calibration ----
  // Ambient room / mic-gain noise means "silence" is rarely a true 0. We sample
  // the first CALIBRATION_DURATION_MS of mic input as a baseline and subtract it
  // from every reading afterwards, so the volume shown reflects actual speech,
  // not just how noisy the room or how hot the mic gain is.
  let noiseFloor = 0;
  let isCalibrating = false;
  let calibrationSamples = [];
  let calibrationStartTime = 0;
  const CALIBRATION_DURATION_MS = 1200;

  // ---- Rolling volume history ----
  // A single animation frame can spike (a consonant, a mic pop) even during an
  // otherwise quiet whisper. The apology check judges a short rolling average
  // instead of one instantaneous frame so one spurious spike doesn't reject it.
  let volumeHistory = [];
  const VOLUME_HISTORY_SIZE = 12; // roughly 200ms of frames

  // ---- Warning Alarm System State ----
  const WARNING_ZONE_RATIO = 0.8;      // Warning zone threshold ratio
  const WARNING_BEEP_MIN_INTERVAL = 300; // Fast cadence right before punishment
  const WARNING_BEEP_MAX_INTERVAL = 1000; // Slow cadence at zone entry
  let lastWarningBeepTime = 0;
  let isInWarningZone = false;

  // ---- Hostage Code Encryption & Single-Play 4-Attempt Game Engine State ----
  let originalCodeLines = [];
  let encryptedLineIndexes = [];
  let attemptsRemaining = 4; // Tracks remaining guess attempts on the single play board
  let correctPairsFound = 0;

  // Matrix game board state
  let boardCards = [];
  let selectedCards = [];
  let isLockingTurnInput = false;
  const MATRIX_SYMBOLS = ['🔥', '💻', '⚡', '🐛'];

  // Passive-Aggressive Messages
  const PASSIVE_AGGRESSIVE_MESSAGES = [
    "YOUR RAGE IS UNACCEPTABLE! Screaming at code has never solved a syntax error in human history.",
    "COMPUTER SAYS NO. Take a deep breath, count to 10, and apologize nicely to your laptop.",
    "EXCESSIVE DECIBELS DETECTED! Violence against keyboards and monitors will not be tolerated.",
    "WHOA THERE, REFACTOR RAGE! Lower your tone before your code gets deleted permanently.",
    "ANGER ISSUES DETECTED. The JavaScript compiler is sensitive. Please say 'sorry' softly.",
    "DEVOPS SAYS CALM DOWN. Your frustration level has exceeded maximum hackathon safety limits.",
    "EMOTIONAL DAMAGE! Screaming won't fix your null pointer exception.",
    "KEEP IT DOWN! Stack Overflow didn't hurt you, your algorithm logic did.",
    "SERVERS ARE CRYING. Lower your voice and whisper your sincere apology to unlock."
  ];

  // Escalating warning stages
  const WARNING_BANNER_STAGES = [
    { max: 0.34, text: "🧘 CALM DOWN: Volume rising! Take a deep breath." },
    { max: 0.67, text: "🚨 WARNING ALARM: You are approaching terminal lockdown!" },
    { max: 1.01, text: "💥 CRITICAL LEVEL: Lower your voice IMMEDIATELY or face Blackout Mode!" }
  ];

  // Sample Code in Editor
  editor.value = `// ------------------------------------------------------------
// HACKATHON RAGE IDE - DEMO SCRIPT
// ------------------------------------------------------------
// 1. Click "Start Mic Monitor" at the top right.
// 2. Try shouting, clapping, or yelling into your microphone.
// 3. Watch the warning alarm fire as you approach the threshold!
// 4. Softly whisper "sorry" (Volume <= 35) to recover control.
// 5. Then win the Code Ransom Matrix game to decrypt your lines!

function debugFrustratingBug(attempts, coffeeCups) {
  if (attempts > 100 && coffeeCups === 0) {
    throw new Error("RAGE_QUIT_IMMOBILIZED");
  }

  console.log("Keep calm and keep coding!");
  return "Hackathon Project Complete";
}

debugFrustratingBug(101, 0);`;

  function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    let lineNumbersHtml = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      lineNumbersHtml += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersHtml;
  }

  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });
  updateLineNumbers();

  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      updateLineNumbers();
    }
  });

  sensitivitySlider.addEventListener('input', (e) => {
    sensitivity = parseInt(e.target.value, 10);
    sensitivityValue.textContent = sensitivity;
    updateWarningMarkerPosition();
  });

  function updateWarningMarkerPosition() {
    const warningPercent = Math.min(100, sensitivity * WARNING_ZONE_RATIO);
    warningThresholdMarker.style.left = warningPercent + '%';
  }
  updateWarningMarkerPosition();

  // Manual Test Alarm Button
  testBeepBtn.addEventListener('click', async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    playWarningAlarm(0.8);
    showWarningUI(0.8);
    setTimeout(() => hideWarningUI(), 1200);
  });

  startAudioBtn.addEventListener('click', initAudioStream);

  async function initAudioStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      micStatusText.textContent = 'Calibrating... stay quiet';
      startAudioBtn.textContent = 'Mic Active';
      startAudioBtn.classList.add('active');
      startAudioBtn.disabled = true;

      isCalibrating = true;
      calibrationSamples = [];
      calibrationStartTime = performance.now();

      processAudio();
      initSpeechRecognition();
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      micStatusText.textContent = 'Denied / Error';
      alert('Microphone access is required for Rage IDE!');
    }
  }

  function processAudio() {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const rawAverage = sum / dataArray.length;

    // ---- Calibration pass: sample ambient noise before doing anything else ----
    if (isCalibrating) {
      calibrationSamples.push(rawAverage);

      const elapsed = performance.now() - calibrationStartTime;
      const calibrationPercent = Math.min(100, Math.round((elapsed / CALIBRATION_DURATION_MS) * 100));
      micStatusText.textContent = `Calibrating... ${calibrationPercent}%`;
      volumeMeterFill.style.width = '0%';
      volumeValue.textContent = '0';

      if (elapsed >= CALIBRATION_DURATION_MS) {
        const baseline = calibrationSamples.reduce((a, b) => a + b, 0) / calibrationSamples.length;
        // Small headroom above the measured baseline so normal mic hiss doesn't
        // register as "speech" the instant calibration ends.
        noiseFloor = baseline + 3;
        isCalibrating = false;
        micStatusText.textContent = 'Active 🎤';
      }

      requestAnimationFrame(processAudio);
      return;
    }

    // Subtract the calibrated noise floor so the reading reflects actual speech
    const adjustedAverage = Math.max(0, rawAverage - noiseFloor);
    currentVolume = Math.min(100, Math.round(adjustedAverage));

    // Track a short rolling history so a single spiky frame doesn't distort
    // volume-sensitive checks like the whisper apology.
    volumeHistory.push(currentVolume);
    if (volumeHistory.length > VOLUME_HISTORY_SIZE) volumeHistory.shift();

    volumeMeterFill.style.width = currentVolume + '%';
    volumeValue.textContent = currentVolume;

    if (blackoutVolumeFill) {
      blackoutVolumeFill.style.width = currentVolume + '%';
      blackoutVolumeValue.textContent = currentVolume;
      blackoutVolumeFill.style.background = currentVolume > 35 ? '#ff4444' : '#00C851';
    }

    const warningThreshold = sensitivity * WARNING_ZONE_RATIO;

    // Trigger warning alarm zone before full terminal blackout
    if (!isBlackedOut && currentVolume >= warningThreshold && currentVolume < sensitivity) {
      const proximity = (currentVolume - warningThreshold) / (sensitivity - warningThreshold);

      if (!isInWarningZone) {
        isInWarningZone = true;
      }
      showWarningUI(proximity);
      volumeMeterFill.classList.add('warning-pulse');

      const dynamicInterval = WARNING_BEEP_MAX_INTERVAL - (proximity * (WARNING_BEEP_MAX_INTERVAL - WARNING_BEEP_MIN_INTERVAL));
      const now = performance.now();
      if (now - lastWarningBeepTime > dynamicInterval) {
        playWarningAlarm(proximity);
        lastWarningBeepTime = now;
      }
    } else {
      if (isInWarningZone) {
        isInWarningZone = false;
        hideWarningUI();
      }
      volumeMeterFill.classList.remove('warning-pulse');
    }

    if (currentVolume > sensitivity) {
      volumeMeterFill.style.background = '#ff4444';
    } else if (currentVolume > 20) {
      volumeMeterFill.style.background = '#ffbb33';
    } else {
      volumeMeterFill.style.background = '#00C851';
    }

    if (!isBlackedOut && currentVolume > sensitivity) {
      triggerBlackout();
    }

    requestAnimationFrame(processAudio);
  }

  function showWarningUI(proximity) {
    const clamped = Math.max(0, Math.min(1, proximity));
    const stage = WARNING_BANNER_STAGES.find(s => clamped <= s.max) || WARNING_BANNER_STAGES[WARNING_BANNER_STAGES.length - 1];

    warningBannerText.textContent = stage.text;
    warningBanner.style.display = 'flex';
    warningIndicator.style.display = 'flex';

    editorContainer.classList.add('warning-vignette');
    editorContainer.style.setProperty('--warning-intensity', (0.2 + clamped * 0.5).toFixed(2));
  }

  function hideWarningUI() {
    warningBanner.style.display = 'none';
    warningIndicator.style.display = 'none';
    editorContainer.classList.remove('warning-vignette');
    editorContainer.style.removeProperty('--warning-intensity');
  }

  // Multi-tone alarm chime synthesizer
  function playWarningAlarm(proximity) {
    if (!audioCtx || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const baseFreq = 600 + (proximity * 600);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 0.8, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);
  }

  // Low buzzer tone for a mismatched matrix pair
  function playMismatchBuzzer() {
    if (!audioCtx || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // ---- Native Text-to-Speech Helper ----
  function speakAloud(text, rate, pitch) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any pending speech requests
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = typeof rate === 'number' ? rate : 1.0;
    utterance.pitch = typeof pitch === 'number' ? pitch : 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // ---- Hostage Code Encryption ----
  function encryptFourLinesOfCode() {
    originalCodeLines = editor.value.split('\n');

    const codeLineIndexes = originalCodeLines
      .map((line, idx) => ({ idx, hasCode: line.trim().length > 0 }))
      .filter(l => l.hasCode)
      .map(l => l.idx);

    encryptedLineIndexes = [];
    const pool = [...codeLineIndexes];
    while (encryptedLineIndexes.length < 4 && pool.length > 0) {
      const randPos = Math.floor(Math.random() * pool.length);
      encryptedLineIndexes.push(pool[randPos]);
      pool.splice(randPos, 1);
    }
    encryptedLineIndexes.sort((a, b) => a - b);

    if (hostageLinesLog) {
      hostageLinesLog.innerText = "Lines Under Threat: Lines " + encryptedLineIndexes.map(idx => idx + 1).join(", ");
    }

    const displayLines = [...originalCodeLines];
    const GIBBERISH_CHARS = ['#', '@', '$', '*', '!', '%', '&', '?', '~'];
    encryptedLineIndexes.forEach(idx => {
      const len = Math.max(originalCodeLines[idx].length, 8);
      let scrambled = '';
      for (let i = 0; i < len; i++) {
        scrambled += GIBBERISH_CHARS[Math.floor(Math.random() * GIBBERISH_CHARS.length)];
      }
      displayLines[idx] = scrambled;
    });

    editor.value = displayLines.join('\n');
    updateLineNumbers();
  }

  // ---- Blackout Trigger ----
  function triggerBlackout() {
    isBlackedOut = true;
    blackoutCount++;
    blackoutCountDisplay.textContent = blackoutCount;

    isInWarningZone = false;
    hideWarningUI();
    volumeMeterFill.classList.remove('warning-pulse');

    encryptFourLinesOfCode();

    if (whisperMeterContainer) whisperMeterContainer.style.display = '';

    blackout.style.display = 'flex';
    blackout.classList.add('active');

    if (punchingEmoji) {
      punchingEmoji.classList.remove('pop');
      void punchingEmoji.offsetWidth; // force reflow to restart animation
      punchingEmoji.classList.add('pop');
    }

    editor.disabled = true;
    editor.blur();

    const randomMsg = PASSIVE_AGGRESSIVE_MESSAGES[
      Math.floor(Math.random() * PASSIVE_AGGRESSIVE_MESSAGES.length)
    ];

    statusBadge.textContent = "RAGE DETECTED";
    statusBadge.className = "status-badge";
    alertTitle.textContent = "BLACKOUT ENFORCED";
    alertBody.textContent = randomMsg;

    speakAloud("you are too loud", 1.0, 0.75);

    startSpeechRecognition();
  }

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';

    speechRecognition.onresult = (event) => {
      if (!isBlackedOut) return;

      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      transcript = transcript.toLowerCase();
      if (transcript.includes('sorry')) {
        evaluateApology();
      }
    };

    speechRecognition.onend = () => {
      if (isBlackedOut && isListeningSpeech) {
        try { speechRecognition.start(); } catch (e) {}
      }
    };
  }

  function startSpeechRecognition() {
    if (!speechRecognition) return;
    isListeningSpeech = true;
    try { speechRecognition.start(); } catch (e) {}
  }

  // Smooths out a single spiky frame (a consonant, a mic pop) by averaging
  // the last VOLUME_HISTORY_SIZE frames instead of judging one instant.
  function getRecentAverageVolume() {
    if (volumeHistory.length === 0) return currentVolume;
    const sum = volumeHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / volumeHistory.length);
  }

  // ---- Apology Evaluation ----
  function evaluateApology() {
    const checkVolume = getRecentAverageVolume();

    if (checkVolume > 35) {
      statusBadge.textContent = "INSINCERE APOLOGY";
      statusBadge.className = "status-badge rejected";
      alertTitle.textContent = "APOLOGY REJECTED";
      alertBody.textContent = `Whisper it gently. Your live mic volume (${checkVolume}) was too high! (Target ≤ 35).`;

      alertCard.classList.remove('shake');
      void alertCard.offsetWidth;
      alertCard.classList.add('shake');
    } else {
      statusBadge.textContent = "APOLOGY ACCEPTED";
      statusBadge.className = "status-badge accepted";
      alertTitle.textContent = "FORGIVEN!";
      alertBody.textContent = "Apology accepted. Now win back your code!";

      // Drop the whisper mic gauge meter display block
      if (whisperMeterContainer) whisperMeterContainer.style.display = 'none';

      speakAloud("your 4 lines are deleted...you have four attempts win and get your code back", 1.0, 0.85);

      isListeningSpeech = false;
      try { if (speechRecognition) speechRecognition.stop(); } catch (e) {}

      // Give the voice line 4.5s to finish before opening the puzzle
      setTimeout(() => {
        blackout.style.display = 'none';
        blackout.classList.remove('active');

        puzzleModal.style.display = 'flex';
        initializeMemoryMatrix();
      }, 4500);
    }
  }

  // ---- Code Ransom Matrix: Single-Board, 4-Attempt Memory Match Game ----
  function initializeMemoryMatrix() {
    if (!cardGrid) return;

    attemptsRemaining = 4;
    correctPairsFound = 0;
    selectedCards = [];
    isLockingTurnInput = false;

    if (finalRestorationNote) finalRestorationNote.style.display = 'none';
    if (puzzleStatus) puzzleStatus.textContent = '';
    currentAttemptText.textContent = String(attemptsRemaining);

    let deck = [...MATRIX_SYMBOLS, ...MATRIX_SYMBOLS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    boardCards = deck.map((symbol, i) => ({ id: i, symbol, matched: false }));

    cardGrid.innerHTML = '';
    boardCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'matrix-card';
      cardEl.dataset.id = String(card.id);
      cardEl.innerHTML =
        '<div class="matrix-card-inner">' +
          '<div class="matrix-card-front">?</div>' +
          '<div class="matrix-card-back">' + card.symbol + '</div>' +
        '</div>';
      cardEl.addEventListener('click', () => handleMatrixCardClick(card.id, cardEl));
      cardGrid.appendChild(cardEl);
    });
  }

  function handleMatrixCardClick(id, cardEl) {
    if (isLockingTurnInput) return;
    const card = boardCards.find(c => c.id === id);
    if (!card || card.matched || cardEl.classList.contains('flipped')) return;
    if (selectedCards.length >= 2) return;

    cardEl.classList.add('flipped');
    selectedCards.push({ card, el: cardEl });

    if (selectedCards.length === 2) {
      isLockingTurnInput = true;
      setTimeout(() => evaluateMatrixMatchPair(), 500);
    }
  }

  function evaluateMatrixMatchPair() {
    const [first, second] = selectedCards;
    if (!first || !second) return;

    // Revealing two cards counts as 1 guess attempt, decremented instantly.
    attemptsRemaining--;
    currentAttemptText.textContent = String(attemptsRemaining);

    if (first.card.symbol === second.card.symbol) {
      // MATCH
      first.card.matched = true;
      second.card.matched = true;
      first.el.classList.add('matched');
      second.el.classList.add('matched');
      correctPairsFound++;

      selectedCards = [];
      isLockingTurnInput = false;

      if (correctPairsFound === 4 || attemptsRemaining === 0) {
        processEndGameResults();
      }
      // otherwise: inputs are already unlocked, let them make their next turn
    } else {
      // MISMATCH
      playMismatchBuzzer();
      first.el.classList.add('shake');
      second.el.classList.add('shake');
      if (puzzleStatus) puzzleStatus.textContent = 'MISMATCHED! TRY AGAIN.';

      setTimeout(() => {
        first.el.classList.remove('flipped', 'shake');
        second.el.classList.remove('flipped', 'shake');
        selectedCards = [];
        isLockingTurnInput = false;

        if (attemptsRemaining === 0) {
          processEndGameResults();
        }
      }, 700);
    }
  }

  function processEndGameResults() {
    isLockingTurnInput = true;

    // Restore as many lines as pairs found, oldest-encrypted-first.
    let restoredLinesList = [];
    const lines = editor.value.split('\n');
    for (let i = 0; i < correctPairsFound; i++) {
      const recoveredIdx = encryptedLineIndexes.shift();
      if (recoveredIdx === undefined) break;
      lines[recoveredIdx] = originalCodeLines[recoveredIdx];
      restoredLinesList.push(recoveredIdx + 1);
    }
    editor.value = lines.join('\n');
    updateLineNumbers();

    // Render the summary note
    if (finalRestorationNote) {
      finalRestorationNote.style.display = 'block';
      if (restoredLinesList.length > 0) {
        finalRestorationNote.textContent = `📋 RESTORATION NOTE: Code lines [${restoredLinesList.join(", ")}] have been successfully restored!`;
      } else {
        finalRestorationNote.textContent = `📋 RESTORATION NOTE: 0 lines restored. System lock evaluated.`;
      }
    }

    // Final voice readout
    if (correctPairsFound === 4) {
      speakAloud("you got your code back", 1.0, 0.95);
    } else {
      const linesMissing = 4 - correctPairsFound;
      speakAloud("say them " + linesMissing + " lines are missing", 1.0, 0.85);
    }

    // Let the summary note display and the voice finish before closing
    setTimeout(() => {
      puzzleModal.style.display = 'none';
      blackout.style.display = 'none';
      blackout.classList.remove('active');
      editor.disabled = false;
      editor.focus();
      isBlackedOut = false;
    }, 3500);
  }

  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'Escape') {
      if (!isBlackedOut) triggerBlackout();
      else evaluateApology();
    }
  });
});
