const MINIMUM_ADDITIONAL_ITERATION_COUNT = 2;

const config = {
  additionalIterationCount: Math.max(MINIMUM_ADDITIONAL_ITERATION_COUNT, 3),
  transitionDuration: 3000,
  prize: 4560000,
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  balance: 10000000,
  prizeToDeduct: 5000000,
  prizeToAdd: 700000,
};

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const getPrizeText = () => document.getElementById("prize-text"),
  getTracks = () => document.querySelectorAll(".digit > .digit-track");

const getFormattedPrize = () => USD.format(config.prize),
  getPrizeDigitByIndex = (index) => parseInt(config.prize.toString()[index]),
  determineIterations = (index) => index + config.additionalIterationCount;

const createElement = (type, className, text) => {
  const element = document.createElement(type);
  element.className = className;
  if (text !== undefined) element.innerText = text;
  return element;
};

const createCharacter = (character) => createElement("span", "character", character);

const createDigit = (digit, trackIndex) => {
  const digitElement = createElement("span", "digit"),
    trackElement = createElement("span", "digit-track");

  let digits = [],
    iterations = determineIterations(trackIndex);

  for (let i = 0; i < iterations; i++) {
    digits = [...digits, ...config.digits];
  }

  trackElement.innerText = digits.join(" ");

  trackElement.style.transitionDuration = `${config.transitionDuration}ms`;

  digitElement.appendChild(trackElement);

  return digitElement;
};

const generateRandomPrize = () => Math.floor(Math.random() * 10000000);

const setup = () => {
  let index = 0;

  const prizeText = getPrizeText();

  for (const character of getFormattedPrize()) {
    const element = isNaN(character) ? createCharacter(character) : createDigit(character, index++);

    prizeText.appendChild(element);
  }
};

const animate = () => {
  getTracks().forEach((track, index) => {
    const digit = getPrizeDigitByIndex(index),
      iterations = determineIterations(index),
      activeDigit = (iterations > 1 ? iterations - 1 : 0) * 10 + digit;

    track.style.transition = `transform ${config.transitionDuration}ms cubic-bezier(.1,.67,0,1)`;
    track.style.transform = `translate(0rem, ${activeDigit * -10}rem)`;
  });
};

const resetTrackPosition = (track) => {
  track.style.transitionDuration = "0ms";
  track.style.transform = "translate(0rem, 0rem)";
  track.offsetHeight;
  track.style.transitionDuration = `${config.transitionDuration}ms`;
};

const resetAnimation = () => {
  for (const track of getTracks()) resetTrackPosition(track);
};

window.onload = () => {
  setup();
  config.prize = generateRandomPrize();
  setTimeout(animate);
};

const handleRedo = () => {
  if (config.balance >= config.prizeToDeduct) {
    config.balance -= config.prizeToDeduct;
    config.prize = generateRandomPrize();

    if (config.balance >= config.prizeToAdd) {
      config.balance += config.prizeToAdd;
    }

    resetAnimation();
    animate();
  } else {
    alert("Saldo insuficiente. Recarregue sua conta!");
  }
};

const updateTheme = (theme) => {
  document.documentElement.style.setProperty("--theme-rgb", `var(--${theme})`);

  for (const button of document.querySelectorAll(".theme-button")) {
    button.dataset.selected = theme === button.dataset.theme;
  }
};

const handleChangeTheme = (e) => updateTheme(e.currentTarget.dataset.theme);

updateTheme("green");
