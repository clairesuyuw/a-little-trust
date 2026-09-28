const requests = [
  {
    item: "Fish",
    icon: "🐟",
    prompt: "My tummy is rumbling... Could I have something from the sea?",
    options: [{ name: "Watermelon", icon: "🍉" }, { name: "Fish", icon: "🐟" }, { name: "Cookie", icon: "🍪" }]
  },
  {
    item: "Yarn",
    icon: "🧶",
    prompt: "I want to pounce and chase! Can you find my favorite tangly toy?",
    options: [{ name: "Teddy Bear", icon: "🧸" }, { name: "Yarn", icon: "🧶" }, { name: "Book", icon: "📘" }]
  },
  {
    item: "Milk",
    icon: "🥛",
    prompt: "All that playing made me thirsty. May I have a little drink?",
    options: [{ name: "Milk", icon: "🥛" }, { name: "Lemon", icon: "🍋" }, { name: "Boot", icon: "🥾" }]
  },
  {
    item: "Blanket",
    icon: "🧣",
    prompt: "The room feels chilly. Could you bring me something soft and warm?",
    options: [{ name: "Blanket", icon: "🧣" }, { name: "Ice Cube", icon: "🧊" }, { name: "Ball", icon: "⚽" }]
  },
  {
    item: "Brush",
    icon: "🪮",
    prompt: "My fur is a little messy. What could make it neat and smooth?",
    options: [{ name: "Spoon", icon: "🥄" }, { name: "Brush", icon: "🪮" }, { name: "Crayon", icon: "🖍️" }]
  },
  {
    item: "Box",
    icon: "📦",
    prompt: "I need a cozy hiding place. Which one can I curl up inside?",
    options: [{ name: "Box", icon: "📦" }, { name: "Umbrella", icon: "☂️" }, { name: "Flower", icon: "🌼" }]
  }
];

const els = {
  kitten: document.querySelector("#kitten"),
  requestText: document.querySelector("#requestText"),
  roundLabel: document.querySelector("#roundLabel"),
  trustValue: document.querySelector("#trustValue"),
  trustFill: document.querySelector("#trustFill"),
  trustTrack: document.querySelector(".trust-track"),
  trustNote: document.querySelector("#trustNote"),
  choices: document.querySelector("#choices"),
  feedback: document.querySelector("#feedback"),
  title: document.querySelector("#gameTitle"),
  hint: document.querySelector("#hint"),
  soundButton: document.querySelector("#soundButton"),
  celebration: document.querySelector("#celebration")
};

let trust = 20;
let round = 0;
let deck = [];
let locked = false;
let soundOn = true;

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function resetDeck() {
  deck = shuffled(requests);
}

function trustMessage() {
  if (trust >= 80) return "Miso is almost ready to come closer.";
  if (trust >= 60) return "Miso's tail curls with happiness.";
  if (trust >= 40) return "Miso is beginning to feel safe.";
  return "Miso is watching you carefully.";
}

function updateTrust() {
  els.trustValue.textContent = `${trust} / 100`;
  els.trustFill.style.width = `${trust}%`;
  els.trustTrack.setAttribute("aria-valuenow", trust);
  els.trustNote.textContent = trustMessage();
}

function playTone(correct) {
  if (!soundOn || !window.AudioContext) return;
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.frequency.value = correct ? 620 : 190;
  oscillator.type = correct ? "sine" : "triangle";
  gain.gain.setValueAtTime(.08, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .22);
  oscillator.start();
  oscillator.stop(audio.currentTime + .22);
}

function renderRound() {
  locked = false;
  const request = deck[round % deck.length];
  els.roundLabel.textContent = `MISO'S REQUEST · ${round + 1}`;
  els.requestText.textContent = request.prompt;
  els.feedback.hidden = true;
  els.feedback.className = "feedback";
  els.kitten.className = "kitten";
  els.choices.innerHTML = "";

  shuffled(request.options).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.dataset.item = option.name;
    button.innerHTML = `<span class="choice-icon" aria-hidden="true">${option.icon}</span><span class="choice-name">${option.name}</span>`;
    button.addEventListener("click", () => choose(button, option.name, request));
    els.choices.appendChild(button);
  });
}

function choose(button, selected, request) {
  if (locked) return;
  locked = true;
  const correct = selected === request.item;
  trust = Math.max(0, Math.min(100, trust + (correct ? 20 : -10)));
  playTone(correct);

  document.querySelectorAll(".choice").forEach((choice) => {
    choice.disabled = true;
    if (choice.dataset.item === request.item) choice.classList.add("correct");
  });

  if (correct) {
    els.kitten.classList.add("happy");
    els.feedback.textContent = `Yes! ${request.icon} That is exactly what Miso wanted. Trust +20`;
  } else {
    button.classList.add("wrong");
    els.kitten.classList.add("sad");
    els.feedback.textContent = `Oh no... Miso asked for ${request.item.toLowerCase()}. Trust −10`;
    els.feedback.classList.add("wrong");
  }

  els.feedback.hidden = false;
  updateTrust();

  if (trust <= 0) {
    window.setTimeout(showFailure, 900);
  } else if (trust >= 100) {
    window.setTimeout(showEnding, 900);
  } else {
    window.setTimeout(() => {
      round += 1;
      if (round >= deck.length) resetDeck();
      renderRound();
    }, 1500);
  }
}

function showFailure() {
  locked = true;
  els.title.textContent = "Miso has left.";
  els.roundLabel.textContent = "TRUST LOST";
  els.requestText.textContent = "Hiss! Miso is upset. She turns away and disappears around the corner.";
  els.trustNote.textContent = "Miso no longer trusts you.";
  els.kitten.className = "kitten leaving";
  els.feedback.hidden = true;
  els.hint.textContent = "The game is over. Listen carefully if you try again.";
  els.choices.innerHTML = '<button class="restart-button" type="button" id="restartButton">Try again</button>';
  document.querySelector("#restartButton").addEventListener("click", startGame);
}

function showEnding() {
  els.title.textContent = "You earned Miso's trust!";
  els.roundLabel.textContent = "A NEW FRIEND";
  els.requestText.textContent = "Purr... I feel safe with you. Miso rubs her little head against your hand.";
  els.trustNote.textContent = "Miso trusts you completely.";
  els.kitten.className = "kitten trusting";
  els.feedback.hidden = true;
  els.hint.textContent = "A little patience can grow into a wonderful friendship.";
  els.choices.innerHTML = '<button class="restart-button" type="button" id="restartButton">Play again</button>';
  document.querySelector("#restartButton").addEventListener("click", startGame);
  makeHearts();
}

function makeHearts() {
  els.celebration.hidden = false;
  els.celebration.innerHTML = "";
  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = i % 3 === 0 ? "✦" : "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${16 + Math.random() * 20}px`;
    heart.style.animationDelay = `${Math.random() * .8}s`;
    els.celebration.appendChild(heart);
  }
  window.setTimeout(() => { els.celebration.hidden = true; }, 3600);
}

function startGame() {
  trust = 20;
  round = 0;
  els.title.textContent = "What does Miso need?";
  els.hint.textContent = "Choose the thing Miso is asking for.";
  els.celebration.hidden = true;
  resetDeck();
  updateTrust();
  renderRound();
}

els.soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  els.soundButton.setAttribute("aria-pressed", soundOn);
  els.soundButton.setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
  els.soundButton.innerHTML = `<span aria-hidden="true">${soundOn ? "♪" : "×"}</span> Sound ${soundOn ? "on" : "off"}`;
});

if (document.modelContext?.registerTool) {
  document.modelContext.registerTool({
    name: "choose_item_for_miso",
    title: "Choose an item for Miso",
    description: "Choose one of the visible items to answer Miso's current request.",
    inputSchema: { type: "object", properties: { item: { type: "string" } }, required: ["item"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute({ item }) {
      const button = [...document.querySelectorAll(".choice")].find((candidate) => candidate.dataset.item?.toLowerCase() === String(item).toLowerCase());
      if (!button || button.disabled) throw new Error("Choose one of the available items.");
      button.click();
      return { selected: button.dataset.item, trust };
    }
  });
}

startGame();
