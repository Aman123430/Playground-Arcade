// Theme Switcher
(function () {
  const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
  const body = document.body;

  // Load saved theme or default to purple
  const savedTheme = localStorage.getItem('arcade-theme') || 'purple';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    
    // Update active state
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Save to localStorage
    localStorage.setItem('arcade-theme', theme);
  }

  // Add click handlers
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      if (theme) applyTheme(theme);
    });
  });
})();

// Game Menu Navigation
(function () {
  const gameMenu = document.getElementById('game-menu');
  const gameContainer = document.getElementById('game-container');
  const activeGameEl = document.getElementById('active-game');
  const currentGameTitle = document.getElementById('current-game-title');
  const backBtn = document.getElementById('back-to-menu');
  const menuCards = Array.from(document.querySelectorAll('.menu-card'));

  const gameMap = {
    'tic-tac-toe': { title: 'Tic Tac Toe', card: 'tic-tac-toe-card' },
    'rps': { title: 'Rock Paper Scissors', card: 'rps-card' },
    'memory': { title: 'Memory Match', card: 'memory-card' },
    'guess-number': { title: 'Guess the Number', card: 'guess-number-card' },
    'color-match': { title: 'Color Match', card: 'color-match-card' },
    'reaction': { title: 'Reaction Time', card: 'reaction-card' },
    'simon': { title: 'Simon Says', card: 'simon-card' },
    'word-scramble': { title: 'Word Scramble', card: 'word-scramble-card' },
    'dice': { title: 'Dice Roller', card: 'dice-card' },
    'whack': { title: 'Whack-a-Mole', card: 'whack-card' },
    'math': { title: 'Math Quiz', card: 'math-card' },
    'snake': { title: 'Snake', card: 'snake-card' },
    'typing': { title: 'Typing Speed Test', card: 'typing-card' },
    'connect': { title: 'Connect Four', card: 'connect-card' },
    'hangman': { title: 'Hangman', card: 'hangman-card' },
    'quiz': { title: 'Quiz Trivia', card: 'quiz-card' },
    'pong': { title: 'Pong', card: 'pong-card' },
    'clicker': { title: 'Clicker Game', card: 'clicker-card' },
    't2048': { title: '2048', card: 't2048-card' }
  };

  function showGame(gameKey) {
    const game = gameMap[gameKey];
    if (!game) return;

    const gameCard = document.getElementById(game.card);
    if (!gameCard) return;

    // Clone the game card
    const gameClone = gameCard.cloneNode(true);
    
    // Clear active game area and add the clone
    activeGameEl.innerHTML = '';
    activeGameEl.appendChild(gameClone);

    // Update title
    if (currentGameTitle) currentGameTitle.textContent = game.title;

    // Hide menu, show game
    if (gameMenu) gameMenu.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'flex';

    // Reinitialize the game logic for the cloned elements
    reinitializeGame(gameKey, gameClone);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToMenu() {
    // Show menu, hide game
    if (gameMenu) gameMenu.style.display = 'block';
    if (gameContainer) gameContainer.style.display = 'none';
    
    // Clear active game
    if (activeGameEl) activeGameEl.innerHTML = '';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reinitializeGame(gameKey, gameClone) {
    // Simple reinitialization - just reinitialize event listeners on cloned elements
    // The original game logic in IIFEs will handle the initial setup
    // For cloned games, we add a small delay to ensure DOM is ready
    setTimeout(() => {
      switch(gameKey) {
        case 'tic-tac-toe':
          initTicTacToe(gameClone);
          break;
        case 'rps':
          initRPS(gameClone);
          break;
        case 'memory':
          initMemory(gameClone);
          break;
        case 'guess-number':
          initGuessNumber(gameClone);
          break;
        case 'color-match':
          initColorMatch(gameClone);
          break;
        case 'reaction':
          initReaction(gameClone);
          break;
        case 'simon':
          initSimon(gameClone);
          break;
        case 'word-scramble':
          initWordScramble(gameClone);
          break;
        case 'dice':
          initDice(gameClone);
          break;
        case 'whack':
          initWhack(gameClone);
          break;
        case 'math':
          initMath(gameClone);
          break;
        case 'snake':
          initSnake(gameClone);
          break;
        case 'typing':
          initTyping(gameClone);
          break;
        case 'connect':
          initConnect(gameClone);
          break;
        case 'hangman':
          initHangman(gameClone);
          break;
        case 'quiz':
          initQuiz(gameClone);
          break;
        case 'pong':
          initPong(gameClone);
          break;
        case 'clicker':
          initClicker(gameClone);
          break;
        case 't2048':
          init2048(gameClone);
          break;
      }
    }, 100);
  }

  // Event listeners for menu cards
  menuCards.forEach(card => {
    card.addEventListener('click', () => {
      const gameKey = card.getAttribute('data-game');
      if (gameKey) showGame(gameKey);
    });
  });

  // Event listener for back button
  if (backBtn) {
    backBtn.addEventListener('click', backToMenu);
  }
})();

// Tic Tac Toe
function initTicTacToe(container) {
  const cells = Array.from(container.querySelectorAll('.ttt-cell'));
  const statusEl = container.querySelector('#ttt-status');
  const restartBtn = container.querySelector('#ttt-restart');

  let board;
  let currentPlayer;
  let gameOver;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function init() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.classList.remove('winner');
    });
    setStatus("Player X's turn");
  }

  function checkWinner() {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        combo.forEach((idx) => cells[idx].classList.add('winner'));
        return board[a];
      }
    }
    if (board.every((v) => v)) return 'draw';
    return null;
  }

  function handleCellClick(e) {
    if (gameOver) return;
    const index = Number(e.currentTarget.getAttribute('data-index'));
    if (!Number.isInteger(index)) return;
    if (board[index]) return;

    board[index] = currentPlayer;
    e.currentTarget.textContent = currentPlayer;

    const result = checkWinner();
    if (result === 'X' || result === 'O') {
      setStatus(`Player ${result} wins!`);
      gameOver = true;
      return;
    }
    if (result === 'draw') {
      setStatus("It's a draw. Hit restart to play again.");
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(`Player ${currentPlayer}'s turn`);
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', init);
  }

  init();
}

(function () {
  const card = document.getElementById('tic-tac-toe-card');
  if (card && card.parentElement.classList.contains('games-storage')) {
    initTicTacToe(card);
  }
})();

// Rock Paper Scissors
(function () {
  const buttons = Array.from(document.querySelectorAll('#rps-card .chip-btn'));
  const statusEl = document.getElementById('rps-status');
  const playerMoveEl = document.getElementById('rps-player-move');
  const computerMoveEl = document.getElementById('rps-computer-move');
  const scoreEl = document.getElementById('rps-score');
  const restartBtn = document.getElementById('rps-restart');

  const moves = ['rock', 'paper', 'scissors'];
  let playerScore = 0;
  let computerScore = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function moveLabel(move) {
    return move ? move.charAt(0).toUpperCase() + move.slice(1) : '-';
  }

  function playRound(playerMove) {
    const computerMove = moves[Math.floor(Math.random() * moves.length)];

    if (playerMoveEl) playerMoveEl.textContent = moveLabel(playerMove);
    if (computerMoveEl) computerMoveEl.textContent = moveLabel(computerMove);

    if (playerMove === computerMove) {
      setStatus("It's a tie. Try again!");
    } else if (
      (playerMove === 'rock' && computerMove === 'scissors') ||
      (playerMove === 'paper' && computerMove === 'rock') ||
      (playerMove === 'scissors' && computerMove === 'paper')
    ) {
      playerScore += 1;
      setStatus('You win this round!');
    } else {
      computerScore += 1;
      setStatus('Computer wins this round.');
    }

    if (scoreEl) scoreEl.textContent = `${playerScore} : ${computerScore}`;
  }

  function init() {
    playerScore = 0;
    computerScore = 0;
    if (playerMoveEl) playerMoveEl.textContent = '-';
    if (computerMoveEl) computerMoveEl.textContent = '-';
    if (scoreEl) scoreEl.textContent = '0 : 0';
    setStatus('Choose your move.');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const move = btn.getAttribute('data-move');
      if (!move) return;
      playRound(move);
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', init);
  }

  init();
})();

// Memory Match
(function () {
  const gridEl = document.getElementById('memory-grid');
  const statusEl = document.getElementById('memory-status');
  const movesEl = document.getElementById('memory-moves');
  const restartBtn = document.getElementById('memory-restart');

  const symbols = ['🍉', '🍋', '🍓', '🍇', '🍍', '🥝'];

  let deck;
  let firstCard;
  let secondCard;
  let lockBoard;
  let moves;
  let matchedCount;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createDeck() {
    deck = shuffle([...symbols, ...symbols]);
  }

  function renderGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    deck.forEach((symbol, index) => {
      const tile = document.createElement('button');
      tile.className = 'memory-card-tile';
      tile.setAttribute('data-symbol', symbol);
      tile.setAttribute('data-index', String(index));

      const inner = document.createElement('div');
      inner.className = 'memory-inner';

      const front = document.createElement('div');
      front.className = 'memory-face memory-front';
      front.textContent = '✦';

      const back = document.createElement('div');
      back.className = 'memory-face memory-back';
      back.textContent = symbol;

      inner.appendChild(front);
      inner.appendChild(back);
      tile.appendChild(inner);

      tile.addEventListener('click', onTileClick);
      gridEl.appendChild(tile);
    });
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function updateMoves() {
    if (movesEl) movesEl.textContent = String(moves);
  }

  function onTileClick(e) {
    const tile = e.currentTarget;
    if (!(tile instanceof HTMLElement)) return;
    if (lockBoard) return;
    if (tile.classList.contains('matched')) return;

    if (tile === firstCard) return;

    tile.classList.add('flipped');

    if (!firstCard) {
      firstCard = tile;
      return;
    }

    secondCard = tile;
    moves += 1;
    updateMoves();

    const firstSymbol = firstCard.getAttribute('data-symbol');
    const secondSymbol = secondCard.getAttribute('data-symbol');

    if (firstSymbol === secondSymbol) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedCount += 1;
      resetTurn();
      if (matchedCount === symbols.length) {
        setStatus(`Nice! You found all pairs in ${moves} moves. Hit restart to play again.`);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
      }, 700);
    }
  }

  function init() {
    createDeck();
    renderGrid();
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedCount = 0;
    updateMoves();
    setStatus('Find all the pairs in as few moves as possible.');
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', init);
  }

  init();
})();

// Scroll to Top Button
(function () {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  function toggleScrollButton() {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.addEventListener('scroll', toggleScrollButton);
  scrollBtn.addEventListener('click', scrollToTop);

  toggleScrollButton();
})();

// Guess the Number
(function () {
  const input = document.getElementById('guess-input');
  const submitBtn = document.getElementById('guess-submit');
  const statusEl = document.getElementById('guess-status');
  const attemptsEl = document.getElementById('guess-attempts');
  const restartBtn = document.getElementById('guess-restart');

  let targetNumber;
  let attempts;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function init() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    if (attemptsEl) attemptsEl.textContent = '0';
    if (input) input.value = '';
    setStatus("I'm thinking of a number between 1 and 100.");
  }

  function makeGuess() {
    if (!input) return;
    const guess = Number(input.value);
    if (!guess || guess < 1 || guess > 100) {
      setStatus('Please enter a number between 1 and 100.');
      return;
    }

    attempts += 1;
    if (attemptsEl) attemptsEl.textContent = String(attempts);

    if (guess === targetNumber) {
      setStatus(`🎉 Correct! You guessed it in ${attempts} attempt${attempts > 1 ? 's' : ''}!`);
    } else if (guess < targetNumber) {
      setStatus('📈 Too low! Try a higher number.');
    } else {
      setStatus('📉 Too high! Try a lower number.');
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', makeGuess);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') makeGuess();
    });
  }
  if (restartBtn) restartBtn.addEventListener('click', init);

  init();
})();

// Color Match
(function () {
  const colorBtns = Array.from(document.querySelectorAll('#color-match-card .color-btn'));
  const wordEl = document.getElementById('color-word');
  const statusEl = document.getElementById('color-status');
  const scoreEl = document.getElementById('color-score');
  const restartBtn = document.getElementById('color-restart');

  const colors = ['red', 'blue', 'green', 'yellow'];
  const colorNames = { red: 'RED', blue: 'BLUE', green: 'GREEN', yellow: 'YELLOW' };
  const colorStyles = { red: '#ff6b6b', blue: '#4ecdc4', green: '#95e1d3', yellow: '#ffe66d' };

  let targetColor;
  let score;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function newRound() {
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];

    if (wordEl) {
      wordEl.textContent = colorNames[targetColor];
      wordEl.style.color = colorStyles[displayColor];
    }
    setStatus('Click the color that matches the text!');
  }

  function handleClick(e) {
    const clickedColor = e.currentTarget.getAttribute('data-color');
    if (clickedColor === targetColor) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      setStatus('✅ Correct!');
      setTimeout(newRound, 500);
    } else {
      setStatus('❌ Wrong! Try again.');
    }
  }

  function init() {
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    newRound();
  }

  colorBtns.forEach((btn) => btn.addEventListener('click', handleClick));
  if (restartBtn) restartBtn.addEventListener('click', init);

  init();
})();

// Reaction Time
(function () {
  const box = document.getElementById('reaction-box');
  const statusEl = document.getElementById('reaction-status');
  const bestEl = document.getElementById('reaction-best');
  const startBtn = document.getElementById('reaction-start');

  let startTime;
  let timeout;
  let bestTime = Infinity;
  let waiting = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function startGame() {
    if (!box) return;
    waiting = true;
    box.className = 'reaction-box waiting';
    box.textContent = 'Wait...';
    setStatus('Wait for green, then click!');

    const delay = Math.random() * 3000 + 1000;
    timeout = setTimeout(() => {
      box.className = 'reaction-box ready';
      box.textContent = 'Click now!';
      startTime = Date.now();
    }, delay);
  }

  function handleClick() {
    if (!box) return;

    if (box.classList.contains('ready')) {
      const reactionTime = Date.now() - startTime;
      setStatus(`Your time: ${reactionTime}ms`);

      if (reactionTime < bestTime) {
        bestTime = reactionTime;
        if (bestEl) bestEl.textContent = `${bestTime} ms`;
      }

      box.className = 'reaction-box';
      box.textContent = 'Click Start!';
      waiting = false;
    } else if (box.classList.contains('waiting')) {
      clearTimeout(timeout);
      box.className = 'reaction-box';
      box.textContent = 'Too early!';
      setStatus('❌ Too early! Click Start to try again.');
      waiting = false;
    }
  }

  if (box) box.addEventListener('click', handleClick);
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!waiting) startGame();
    });
  }

  if (box) box.textContent = 'Click Start!';
})();

// Simon Says
(function () {
  const buttons = Array.from(document.querySelectorAll('#simon-card .simon-btn'));
  const statusEl = document.getElementById('simon-status');
  const levelEl = document.getElementById('simon-level');
  const startBtn = document.getElementById('simon-start');

  let sequence = [];
  let playerSequence = [];
  let level = 0;
  let playingSequence = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  async function playSequence() {
    playingSequence = true;
    setStatus('Watch the pattern...');

    for (const index of sequence) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      buttons[index].classList.add('active');
      await new Promise((resolve) => setTimeout(resolve, 400));
      buttons[index].classList.remove('active');
    }

    playingSequence = false;
    setStatus('Now repeat it!');
  }

  function nextRound() {
    level += 1;
    if (levelEl) levelEl.textContent = String(level);
    const randomIndex = Math.floor(Math.random() * 4);
    sequence.push(randomIndex);
    playerSequence = [];
    playSequence();
  }

  function handleClick(e) {
    if (playingSequence) return;
    const index = Number(e.currentTarget.getAttribute('data-index'));

    e.currentTarget.classList.add('active');
    setTimeout(() => e.currentTarget.classList.remove('active'), 200);

    playerSequence.push(index);

    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
      setStatus(`❌ Wrong! You reached level ${level}. Click Start to try again.`);
      sequence = [];
      level = 0;
      if (levelEl) levelEl.textContent = '0';
      return;
    }

    if (playerSequence.length === sequence.length) {
      setStatus('✅ Correct! Next level...');
      setTimeout(nextRound, 1000);
    }
  }

  function init() {
    sequence = [];
    playerSequence = [];
    level = 0;
    if (levelEl) levelEl.textContent = '0';
    nextRound();
  }

  buttons.forEach((btn) => btn.addEventListener('click', handleClick));
  if (startBtn) startBtn.addEventListener('click', init);
})();

// Word Scramble
(function () {
  const wordEl = document.getElementById('scramble-word');
  const input = document.getElementById('scramble-input');
  const submitBtn = document.getElementById('scramble-submit');
  const statusEl = document.getElementById('scramble-status');
  const scoreEl = document.getElementById('scramble-score');
  const skipBtn = document.getElementById('scramble-skip');

  const words = ['APPLE', 'ORANGE', 'BANANA', 'GRAPE', 'MANGO', 'PEACH', 'CHERRY', 'MELON', 'LEMON', 'BERRY'];
  let currentWord;
  let score;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function shuffle(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    let scrambled = shuffle(currentWord);
    while (scrambled === currentWord && currentWord.length > 3) {
      scrambled = shuffle(currentWord);
    }
    if (wordEl) wordEl.textContent = scrambled;
    if (input) input.value = '';
    setStatus('Unscramble the letters!');
  }

  function checkAnswer() {
    if (!input) return;
    const answer = input.value.trim().toUpperCase();

    if (answer === currentWord) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      setStatus('✅ Correct!');
      setTimeout(newWord, 500);
    } else {
      setStatus('❌ Wrong! Try again or skip.');
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });
  }
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      setStatus(`The word was: ${currentWord}`);
      setTimeout(newWord, 1000);
    });
  }

  score = 0;
  newWord();
})();

// Dice Roller
(function () {
  const dice1 = document.getElementById('dice-1');
  const dice2 = document.getElementById('dice-2');
  const totalEl = document.getElementById('dice-total');
  const highEl = document.getElementById('dice-high');
  const rollBtn = document.getElementById('dice-roll');
  const statusEl = document.getElementById('dice-status');

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  let highScore = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function rollDice() {
    if (!dice1 || !dice2) return;

    dice1.classList.add('rolling');
    dice2.classList.add('rolling');

    setTimeout(() => {
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;
      const total = roll1 + roll2;

      dice1.textContent = diceFaces[roll1 - 1];
      dice2.textContent = diceFaces[roll2 - 1];

      if (totalEl) totalEl.textContent = String(total);

      if (total > highScore) {
        highScore = total;
        if (highEl) highEl.textContent = String(highScore);
        setStatus('🎉 New high score!');
      } else if (total === 12) {
        setStatus('🎲 Double sixes! Maximum roll!');
      } else if (total === 2) {
        setStatus('Snake eyes! Unlucky roll.');
      } else {
        setStatus(`You rolled ${total}!`);
      }

      dice1.classList.remove('rolling');
      dice2.classList.remove('rolling');
    }, 500);
  }

  if (rollBtn) rollBtn.addEventListener('click', rollDice);
})();

// Whack-a-Mole
(function () {
  const grid = document.getElementById('whack-grid');
  const holes = Array.from(document.querySelectorAll('#whack-card .whack-hole'));
  const statusEl = document.getElementById('whack-status');
  const scoreEl = document.getElementById('whack-score');
  const timeEl = document.getElementById('whack-time');
  const startBtn = document.getElementById('whack-start');

  let score = 0;
  let timeLeft = 30;
  let gameActive = false;
  let moleInterval;
  let timerInterval;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function showMole() {
    holes.forEach(h => h.classList.remove('active'));
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.classList.add('active');
    randomHole.textContent = '🐹';
    
    setTimeout(() => {
      if (randomHole.classList.contains('active')) {
        randomHole.classList.remove('active');
        randomHole.textContent = '';
      }
    }, 800);
  }

  function whackMole(e) {
    if (!gameActive) return;
    const hole = e.currentTarget;
    if (hole.classList.contains('active')) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      hole.classList.remove('active');
      hole.textContent = '💥';
      setTimeout(() => { hole.textContent = ''; }, 200);
    }
  }

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    timeLeft = 30;
    if (scoreEl) scoreEl.textContent = '0';
    if (timeEl) timeEl.textContent = '30s';
    setStatus('Whack the moles!');
    
    moleInterval = setInterval(showMole, 1000);
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      if (timeEl) timeEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    gameActive = false;
    clearInterval(moleInterval);
    clearInterval(timerInterval);
    holes.forEach(h => {
      h.classList.remove('active');
      h.textContent = '';
    });
    setStatus(`Game over! You scored ${score} points!`);
  }

  holes.forEach(h => h.addEventListener('click', whackMole));
  if (startBtn) startBtn.addEventListener('click', startGame);
})();

// Math Quiz
(function () {
  const questionEl = document.getElementById('math-question');
  const input = document.getElementById('math-input');
  const submitBtn = document.getElementById('math-submit');
  const statusEl = document.getElementById('math-status');
  const scoreEl = document.getElementById('math-score');
  const streakEl = document.getElementById('math-streak');
  const restartBtn = document.getElementById('math-restart');

  let score = 0;
  let streak = 0;
  let currentAnswer = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let question = '';
    if (op === '+') {
      currentAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else if (op === '-') {
      const bigger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      currentAnswer = bigger - smaller;
      question = `${bigger} - ${smaller} = ?`;
    } else {
      currentAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
    }
    
    if (questionEl) questionEl.textContent = question;
    if (input) input.value = '';
    setStatus('Solve the equation!');
  }

  function checkAnswer() {
    if (!input) return;
    const answer = Number(input.value);
    
    if (answer === currentAnswer) {
      score += 1;
      streak += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      if (streakEl) streakEl.textContent = String(streak);
      setStatus('✅ Correct! Keep going!');
      setTimeout(generateQuestion, 500);
    } else {
      streak = 0;
      if (streakEl) streakEl.textContent = '0';
      setStatus('❌ Wrong! Try the next one.');
      setTimeout(generateQuestion, 1000);
    }
  }

  function init() {
    score = 0;
    streak = 0;
    if (scoreEl) scoreEl.textContent = '0';
    if (streakEl) streakEl.textContent = '0';
    generateQuestion();
  }

  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });
  }
  if (restartBtn) restartBtn.addEventListener('click', init);

  init();
})();

// Snake Game
(function () {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const statusEl = document.getElementById('snake-status');
  const scoreEl = document.getElementById('snake-score');
  const highEl = document.getElementById('snake-high');
  const startBtn = document.getElementById('snake-start');

  if (!canvas || !ctx) return;

  const gridSize = 20;
  const tileCount = 12;
  let snake = [{ x: 6, y: 6 }];
  let food = { x: 10, y: 10 };
  let dx = 0;
  let dy = 0;
  let score = 0;
  let highScore = 0;
  let gameRunning = false;
  let gameLoop;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4ecdc4' : '#95e1d3';
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
  }

  function moveSnake() {
    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      endGame();
      return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      placeFood();
    } else {
      snake.pop();
    }
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  }

  function gameUpdate() {
    moveSnake();
    drawGame();
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    if (score > highScore) {
      highScore = score;
      if (highEl) highEl.textContent = String(highScore);
    }
    setStatus(`Game Over! Score: ${score}. Press Start to play again.`);
    dx = 0;
    dy = 0;
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    snake = [{ x: 6, y: 6 }];
    dx = 1;
    dy = 0;
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    placeFood();
    setStatus('Use arrow keys to move!');
    gameLoop = setInterval(gameUpdate, 150);
  }

  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (dy === 0) { dx = 0; dy = -1; }
        break;
      case 'ArrowDown':
        if (dy === 0) { dx = 0; dy = 1; }
        break;
      case 'ArrowLeft':
        if (dx === 0) { dx = -1; dy = 0; }
        break;
      case 'ArrowRight':
        if (dx === 0) { dx = 1; dy = 0; }
        break;
    }
  });

  if (startBtn) startBtn.addEventListener('click', startGame);
  drawGame();
})();

// Typing Speed Test
(function () {
  const textEl = document.getElementById('typing-text');
  const input = document.getElementById('typing-input');
  const statusEl = document.getElementById('typing-status');
  const wpmEl = document.getElementById('typing-wpm');
  const accuracyEl = document.getElementById('typing-accuracy');
  const restartBtn = document.getElementById('typing-restart');

  const texts = [
    'The quick brown fox jumps over the lazy dog',
    'Programming is the art of telling another human what one wants the computer to do',
    'Practice makes perfect when it comes to typing speed',
    'JavaScript is a versatile and powerful programming language',
    'Learning to type faster will boost your productivity'
  ];

  let startTime = null;
  let currentText = '';

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function newTest() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    if (textEl) textEl.textContent = currentText;
    if (input) input.value = '';
    if (wpmEl) wpmEl.textContent = '0';
    if (accuracyEl) accuracyEl.textContent = '100%';
    startTime = null;
    setStatus('Type the text below!');
  }

  function checkTyping() {
    if (!input || !textEl) return;
    
    if (!startTime) {
      startTime = Date.now();
    }

    const typed = input.value;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = typed.split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === currentText[i]) correct++;
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

    if (wpmEl) wpmEl.textContent = String(wpm);
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

    if (typed === currentText) {
      setStatus(`✅ Complete! WPM: ${wpm}, Accuracy: ${accuracy}%`);
    }
  }

  if (input) input.addEventListener('input', checkTyping);
  if (restartBtn) restartBtn.addEventListener('click', newTest);

  newTest();
})();

// Connect Four
(function () {
  const gridEl = document.getElementById('connect-grid');
  const statusEl = document.getElementById('connect-status');
  const restartBtn = document.getElementById('connect-restart');

  const ROWS = 6;
  const COLS = 7;
  let board = [];
  let currentPlayer = 'red';
  let gameOver = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    if (!gridEl) return;
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = document.createElement('div');
        cell.className = 'connect-cell';
        cell.setAttribute('data-col', String(col));
        cell.addEventListener('click', () => dropPiece(col));
        gridEl.appendChild(cell);
      }
    }
  }

  function dropPiece(col) {
    if (gameOver) return;
    
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        board[row][col] = currentPlayer;
        updateCell(row, col, currentPlayer);
        
        if (checkWin(row, col)) {
          setStatus(`${currentPlayer.toUpperCase()} wins! 🎉`);
          gameOver = true;
          return;
        }
        
        if (board.every(row => row.every(cell => cell))) {
          setStatus("It's a draw!");
          gameOver = true;
          return;
        }
        
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        setStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`);
        return;
      }
    }
  }

  function updateCell(row, col, player) {
    if (!gridEl) return;
    const cells = Array.from(gridEl.children);
    const index = row * COLS + col;
    cells[index].classList.add('filled', player);
  }

  function checkWin(row, col) {
    const directions = [
      [[0, 1], [0, -1]],   // horizontal
      [[1, 0], [-1, 0]],   // vertical
      [[1, 1], [-1, -1]],  // diagonal /
      [[1, -1], [-1, 1]]   // diagonal \
    ];

    for (const [dir1, dir2] of directions) {
      let count = 1;
      count += countDirection(row, col, dir1[0], dir1[1]);
      count += countDirection(row, col, dir2[0], dir2[1]);
      if (count >= 4) return true;
    }
    return false;
  }

  function countDirection(row, col, dRow, dCol) {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;
    
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
      count++;
      r += dRow;
      c += dCol;
    }
    return count;
  }

  function init() {
    currentPlayer = 'red';
    gameOver = false;
    createBoard();
    setStatus("Red's turn");
  }

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
})();

// Hangman
(function () {
  const wordEl = document.getElementById('hangman-word');
  const lettersEl = document.getElementById('hangman-letters');
  const statusEl = document.getElementById('hangman-status');
  const livesEl = document.getElementById('hangman-lives');
  const restartBtn = document.getElementById('hangman-restart');

  const words = ['JAVASCRIPT', 'PYTHON', 'COMPUTER', 'KEYBOARD', 'MONITOR', 'PROGRAM', 'FUNCTION', 'VARIABLE', 'ALGORITHM', 'DATABASE'];
  let currentWord = '';
  let guessedLetters = [];
  let lives = 6;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createLetterButtons() {
    if (!lettersEl) return;
    lettersEl.innerHTML = '';
    
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'hangman-letter-btn';
      btn.textContent = letter;
      btn.addEventListener('click', () => guessLetter(letter, btn));
      lettersEl.appendChild(btn);
    }
  }

  function updateDisplay() {
    if (!wordEl) return;
    const display = currentWord.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
    wordEl.textContent = display;

    if (livesEl) {
      livesEl.textContent = '❤️'.repeat(lives);
    }

    if (!display.includes('_')) {
      setStatus('🎉 You won! The word was ' + currentWord);
    }
  }

  function guessLetter(letter, btn) {
    if (guessedLetters.includes(letter) || lives === 0) return;
    
    guessedLetters.push(letter);
    btn.disabled = true;

    if (currentWord.includes(letter)) {
      setStatus('✅ Good guess!');
    } else {
      lives -= 1;
      setStatus('❌ Wrong letter!');
      
      if (lives === 0) {
        setStatus(`💀 Game Over! The word was ${currentWord}`);
        if (wordEl) wordEl.textContent = currentWord;
      }
    }

    updateDisplay();
  }

  function init() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    lives = 6;
    createLetterButtons();
    updateDisplay();
    setStatus('Guess a letter!');
  }

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
})();

// Quiz Trivia
(function () {
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const statusEl = document.getElementById('quiz-status');
  const scoreEl = document.getElementById('quiz-score');
  const nextBtn = document.getElementById('quiz-next');

  const questions = [
    { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2 },
    { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1 },
    { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: 1 },
    { q: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Monet'], answer: 1 },
    { q: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
    { q: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
    { q: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: 2 },
    { q: 'Which language is used for web development?', options: ['Python', 'JavaScript', 'C++', 'Java'], answer: 1 }
  ];

  let currentQuestion = 0;
  let score = 0;
  let total = 0;
  let answered = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) {
      currentQuestion = 0;
    }

    const q = questions[currentQuestion];
    if (questionEl) questionEl.textContent = q.q;
    if (!optionsEl) return;

    optionsEl.innerHTML = '';
    answered = false;

    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = option;
      btn.addEventListener('click', () => checkAnswer(index, btn));
      optionsEl.appendChild(btn);
    });

    setStatus('Choose the correct answer!');
  }

  function checkAnswer(index, btn) {
    if (answered) return;
    answered = true;
    total += 1;

    const q = questions[currentQuestion];
    const options = Array.from(optionsEl.children);

    if (index === q.answer) {
      score += 1;
      btn.classList.add('correct');
      setStatus('✅ Correct!');
    } else {
      btn.classList.add('wrong');
      options[q.answer].classList.add('correct');
      setStatus('❌ Wrong!');
    }

    if (scoreEl) scoreEl.textContent = `${score} / ${total}`;
  }

  function nextQuestion() {
    currentQuestion += 1;
    loadQuestion();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
  loadQuestion();
})();

// Pong
(function () {
  const canvas = document.getElementById('pong-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const statusEl = document.getElementById('pong-status');
  const scoreEl = document.getElementById('pong-score');
  const startBtn = document.getElementById('pong-start');

  if (!canvas || !ctx) return;

  let gameRunning = false;
  let player1Y = 80;
  let player2Y = 80;
  const paddleHeight = 40;
  const paddleWidth = 8;
  let ballX = 150;
  let ballY = 100;
  let ballDX = 3;
  let ballDY = 2;
  let score1 = 0;
  let score2 = 0;
  let keys = {};

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function draw() {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(10, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 18, player2Y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw center line
    ctx.strokeStyle = '#ddd';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function update() {
    if (!gameRunning) return;

    // Move paddles
    if (keys['w'] && player1Y > 0) player1Y -= 4;
    if (keys['s'] && player1Y < canvas.height - paddleHeight) player1Y += 4;
    if (keys['ArrowUp'] && player2Y > 0) player2Y -= 4;
    if (keys['ArrowDown'] && player2Y < canvas.height - paddleHeight) player2Y += 4;

    // Move ball
    ballX += ballDX;
    ballY += ballDY;

    // Ball collision with top/bottom
    if (ballY <= 6 || ballY >= canvas.height - 6) {
      ballDY = -ballDY;
    }

    // Ball collision with paddles
    if (ballX <= 18 && ballY >= player1Y && ballY <= player1Y + paddleHeight) {
      ballDX = -ballDX;
      ballX = 18;
    }
    if (ballX >= canvas.width - 24 && ballY >= player2Y && ballY <= player2Y + paddleHeight) {
      ballDX = -ballDX;
      ballX = canvas.width - 24;
    }

    // Scoring
    if (ballX < 0) {
      score2 += 1;
      resetBall();
    }
    if (ballX > canvas.width) {
      score1 += 1;
      resetBall();
    }

    if (scoreEl) scoreEl.textContent = `${score1} : ${score2}`;
    draw();
  }

  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = -ballDX;
    ballDY = Math.random() * 4 - 2;
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score1 = 0;
    score2 = 0;
    if (scoreEl) scoreEl.textContent = '0 : 0';
    resetBall();
    setStatus('Game started!');
    setInterval(update, 1000 / 60);
  }

  document.addEventListener('keydown', (e) => { keys[e.key] = true; });
  document.addEventListener('keyup', (e) => { keys[e.key] = false; });

  if (startBtn) startBtn.addEventListener('click', startGame);
  draw();
})();

// Clicker Game
(function () {
  const button = document.getElementById('clicker-button');
  const countEl = document.getElementById('clicker-count');
  const bestEl = document.getElementById('clicker-best');
  const statusEl = document.getElementById('clicker-status');
  const startBtn = document.getElementById('clicker-start');

  let clicks = 0;
  let best = 0;
  let gameActive = false;
  let timeLeft = 10;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function handleClick() {
    if (!gameActive) return;
    clicks += 1;
    if (countEl) countEl.textContent = String(clicks);
  }

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    clicks = 0;
    timeLeft = 10;
    if (countEl) countEl.textContent = '0';
    if (button) button.disabled = false;
    setStatus(`Click as fast as you can! ${timeLeft}s`);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setStatus(`Click as fast as you can! ${timeLeft}s`);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameActive = false;
        if (button) button.disabled = true;
        
        if (clicks > best) {
          best = clicks;
          if (bestEl) bestEl.textContent = String(best);
          setStatus(`🎉 New record! ${clicks} clicks!`);
        } else {
          setStatus(`Time's up! You got ${clicks} clicks!`);
        }
      }
    }, 1000);
  }

  if (button) button.addEventListener('click', handleClick);
  if (startBtn) startBtn.addEventListener('click', startGame);
  if (button) button.disabled = true;
})();

// 2048 Game
(function () {
  const gridEl = document.getElementById('t2048-grid');
  const statusEl = document.getElementById('t2048-status');
  const scoreEl = document.getElementById('t2048-score');
  const bestEl = document.getElementById('t2048-best');
  const restartBtn = document.getElementById('t2048-restart');

  let grid = [];
  let score = 0;
  let best = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createGrid() {
    grid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile();
    addNewTile();
  }

  function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 't2048-cell';
        const value = grid[i][j];
        if (value > 0) {
          cell.textContent = String(value);
          cell.setAttribute('data-value', String(value));
        }
        gridEl.appendChild(cell);
      }
    }
    
    if (scoreEl) scoreEl.textContent = String(score);
  }

  function move(direction) {
    let moved = false;
    const oldGrid = JSON.stringify(grid);

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(val => val !== 0);
        if (direction === 'right') row.reverse();
        
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            score += row[j];
            row.splice(j + 1, 1);
          }
        }
        
        while (row.length < 4) row.push(0);
        if (direction === 'right') row.reverse();
        grid[i] = row;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) {
          if (grid[i][j] !== 0) col.push(grid[i][j]);
        }
        if (direction === 'down') col.reverse();
        
        for (let i = 0; i < col.length - 1; i++) {
          if (col[i] === col[i + 1]) {
            col[i] *= 2;
            score += col[i];
            col.splice(i + 1, 1);
          }
        }
        
        while (col.length < 4) col.push(0);
        if (direction === 'down') col.reverse();
        
        for (let i = 0; i < 4; i++) {
          grid[i][j] = col[i];
        }
      }
    }

    if (JSON.stringify(grid) !== oldGrid) {
      moved = true;
      addNewTile();
    }

    renderGrid();
    
    if (score > best) {
      best = score;
      if (bestEl) bestEl.textContent = String(best);
    }

    if (grid.some(row => row.includes(2048))) {
      setStatus('🎉 You won! You reached 2048!');
    }
  }

  function init() {
    score = 0;
    createGrid();
    renderGrid();
    setStatus('Use arrow keys to slide!');
  }

  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const direction = e.key.replace('Arrow', '').toLowerCase();
      move(direction);
    }
  });

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
})();

// Initialize functions for all other games (stub functions that work with cloned elements)
function initRPS(container) {
  const buttons = Array.from(container.querySelectorAll('.chip-btn'));
  const statusEl = container.querySelector('#rps-status');
  const playerMoveEl = container.querySelector('#rps-player-move');
  const computerMoveEl = container.querySelector('#rps-computer-move');
  const scoreEl = container.querySelector('#rps-score');
  const restartBtn = container.querySelector('#rps-restart');

  const moves = ['rock', 'paper', 'scissors'];
  let playerScore = 0;
  let computerScore = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function moveLabel(move) {
    return move ? move.charAt(0).toUpperCase() + move.slice(1) : '-';
  }

  function playRound(playerMove) {
    const computerMove = moves[Math.floor(Math.random() * moves.length)];
    if (playerMoveEl) playerMoveEl.textContent = moveLabel(playerMove);
    if (computerMoveEl) computerMoveEl.textContent = moveLabel(computerMove);

    if (playerMove === computerMove) {
      setStatus("It's a tie. Try again!");
    } else if (
      (playerMove === 'rock' && computerMove === 'scissors') ||
      (playerMove === 'paper' && computerMove === 'rock') ||
      (playerMove === 'scissors' && computerMove === 'paper')
    ) {
      playerScore += 1;
      setStatus('You win this round!');
    } else {
      computerScore += 1;
      setStatus('Computer wins this round.');
    }
    if (scoreEl) scoreEl.textContent = `${playerScore} : ${computerScore}`;
  }

  function init() {
    playerScore = 0;
    computerScore = 0;
    if (playerMoveEl) playerMoveEl.textContent = '-';
    if (computerMoveEl) computerMoveEl.textContent = '-';
    if (scoreEl) scoreEl.textContent = '0 : 0';
    setStatus('Choose your move.');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const move = btn.getAttribute('data-move');
      if (!move) return;
      playRound(move);
    });
  });

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initMemory(container) {
  const gridEl = container.querySelector('#memory-grid');
  const statusEl = container.querySelector('#memory-status');
  const movesEl = container.querySelector('#memory-moves');
  const restartBtn = container.querySelector('#memory-restart');

  const symbols = ['🍉', '🍋', '🍓', '🍇', '🍍', '🥝'];
  let deck, firstCard, secondCard, lockBoard, moves, matchedCount;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    deck.forEach((symbol, index) => {
      const tile = document.createElement('button');
      tile.className = 'memory-card-tile';
      tile.setAttribute('data-symbol', symbol);
      tile.setAttribute('data-index', String(index));
      const inner = document.createElement('div');
      inner.className = 'memory-inner';
      const front = document.createElement('div');
      front.className = 'memory-face memory-front';
      front.textContent = '✦';
      const back = document.createElement('div');
      back.className = 'memory-face memory-back';
      back.textContent = symbol;
      inner.appendChild(front);
      inner.appendChild(back);
      tile.appendChild(inner);
      tile.addEventListener('click', onTileClick);
      gridEl.appendChild(tile);
    });
  }

  function onTileClick(e) {
    const tile = e.currentTarget;
    if (lockBoard || tile.classList.contains('matched') || tile === firstCard) return;
    tile.classList.add('flipped');
    if (!firstCard) {
      firstCard = tile;
      return;
    }
    secondCard = tile;
    moves += 1;
    if (movesEl) movesEl.textContent = String(moves);
    const firstSymbol = firstCard.getAttribute('data-symbol');
    const secondSymbol = secondCard.getAttribute('data-symbol');
    if (firstSymbol === secondSymbol) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedCount += 1;
      firstCard = null;
      secondCard = null;
      if (matchedCount === symbols.length) {
        setStatus(`Nice! You found all pairs in ${moves} moves.`);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 700);
    }
  }

  function init() {
    deck = shuffle([...symbols, ...symbols]);
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedCount = 0;
    if (movesEl) movesEl.textContent = '0';
    renderGrid();
    setStatus('Find all the pairs!');
  }

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initGuessNumber(container) {
  const input = container.querySelector('#guess-input');
  const submitBtn = container.querySelector('#guess-submit');
  const statusEl = container.querySelector('#guess-status');
  const attemptsEl = container.querySelector('#guess-attempts');
  const restartBtn = container.querySelector('#guess-restart');

  let targetNumber, attempts;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function init() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    if (attemptsEl) attemptsEl.textContent = '0';
    if (input) input.value = '';
    setStatus("I'm thinking of a number between 1 and 100.");
  }

  function makeGuess() {
    if (!input) return;
    const guess = Number(input.value);
    if (!guess || guess < 1 || guess > 100) {
      setStatus('Please enter a number between 1 and 100.');
      return;
    }
    attempts += 1;
    if (attemptsEl) attemptsEl.textContent = String(attempts);
    if (guess === targetNumber) {
      setStatus(`🎉 Correct! You guessed it in ${attempts} attempt${attempts > 1 ? 's' : ''}!`);
    } else if (guess < targetNumber) {
      setStatus('📈 Too low! Try a higher number.');
    } else {
      setStatus('📉 Too high! Try a lower number.');
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', makeGuess);
  if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') makeGuess(); });
  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initColorMatch(container) {
  const colorBtns = Array.from(container.querySelectorAll('.color-btn'));
  const wordEl = container.querySelector('#color-word');
  const statusEl = container.querySelector('#color-status');
  const scoreEl = container.querySelector('#color-score');
  const restartBtn = container.querySelector('#color-restart');

  const colors = ['red', 'blue', 'green', 'yellow'];
  const colorNames = { red: 'RED', blue: 'BLUE', green: 'GREEN', yellow: 'YELLOW' };
  const colorStyles = { red: '#ff6b6b', blue: '#4ecdc4', green: '#95e1d3', yellow: '#ffe66d' };
  let targetColor, score;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function newRound() {
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    if (wordEl) {
      wordEl.textContent = colorNames[targetColor];
      wordEl.style.color = colorStyles[displayColor];
    }
    setStatus('Click the color that matches the text!');
  }

  function handleClick(e) {
    const clickedColor = e.currentTarget.getAttribute('data-color');
    if (clickedColor === targetColor) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      setStatus('✅ Correct!');
      setTimeout(newRound, 500);
    } else {
      setStatus('❌ Wrong! Try again.');
    }
  }

  function init() {
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    newRound();
  }

  colorBtns.forEach((btn) => btn.addEventListener('click', handleClick));
  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initReaction(container) {
  const box = container.querySelector('#reaction-box');
  const statusEl = container.querySelector('#reaction-status');
  const bestEl = container.querySelector('#reaction-best');
  const startBtn = container.querySelector('#reaction-start');

  let startTime, timeout, bestTime = Infinity, waiting = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function startGame() {
    if (!box) return;
    waiting = true;
    box.className = 'reaction-box waiting';
    box.textContent = 'Wait...';
    setStatus('Wait for green, then click!');
    const delay = Math.random() * 3000 + 1000;
    timeout = setTimeout(() => {
      box.className = 'reaction-box ready';
      box.textContent = 'Click now!';
      startTime = Date.now();
    }, delay);
  }

  function handleClick() {
    if (!box) return;
    if (box.classList.contains('ready')) {
      const reactionTime = Date.now() - startTime;
      setStatus(`Your time: ${reactionTime}ms`);
      if (reactionTime < bestTime) {
        bestTime = reactionTime;
        if (bestEl) bestEl.textContent = `${bestTime} ms`;
      }
      box.className = 'reaction-box';
      box.textContent = 'Click Start!';
      waiting = false;
    } else if (box.classList.contains('waiting')) {
      clearTimeout(timeout);
      box.className = 'reaction-box';
      box.textContent = 'Too early!';
      setStatus('❌ Too early! Click Start to try again.');
      waiting = false;
    }
  }

  if (box) {
    box.addEventListener('click', handleClick);
    box.textContent = 'Click Start!';
  }
  if (startBtn) startBtn.addEventListener('click', () => { if (!waiting) startGame(); });
}

function initSimon(container) {
  const buttons = Array.from(container.querySelectorAll('.simon-btn'));
  const statusEl = container.querySelector('#simon-status');
  const levelEl = container.querySelector('#simon-level');
  const startBtn = container.querySelector('#simon-start');

  let sequence = [], playerSequence = [], level = 0, playingSequence = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  async function playSequence() {
    playingSequence = true;
    setStatus('Watch the pattern...');
    for (const index of sequence) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      buttons[index].classList.add('active');
      await new Promise((resolve) => setTimeout(resolve, 400));
      buttons[index].classList.remove('active');
    }
    playingSequence = false;
    setStatus('Now repeat it!');
  }

  function nextRound() {
    level += 1;
    if (levelEl) levelEl.textContent = String(level);
    const randomIndex = Math.floor(Math.random() * 4);
    sequence.push(randomIndex);
    playerSequence = [];
    playSequence();
  }

  function handleClick(e) {
    if (playingSequence) return;
    const index = Number(e.currentTarget.getAttribute('data-index'));
    e.currentTarget.classList.add('active');
    setTimeout(() => e.currentTarget.classList.remove('active'), 200);
    playerSequence.push(index);
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== sequence[currentStep]) {
      setStatus(`❌ Wrong! You reached level ${level}.`);
      sequence = [];
      level = 0;
      if (levelEl) levelEl.textContent = '0';
      return;
    }
    if (playerSequence.length === sequence.length) {
      setStatus('✅ Correct! Next level...');
      setTimeout(nextRound, 1000);
    }
  }

  function init() {
    sequence = [];
    playerSequence = [];
    level = 0;
    if (levelEl) levelEl.textContent = '0';
    nextRound();
  }

  buttons.forEach((btn) => btn.addEventListener('click', handleClick));
  if (startBtn) startBtn.addEventListener('click', init);
}

function initWordScramble(container) {
  const wordEl = container.querySelector('#scramble-word');
  const input = container.querySelector('#scramble-input');
  const submitBtn = container.querySelector('#scramble-submit');
  const statusEl = container.querySelector('#scramble-status');
  const scoreEl = container.querySelector('#scramble-score');
  const skipBtn = container.querySelector('#scramble-skip');

  const words = ['APPLE', 'ORANGE', 'BANANA', 'GRAPE', 'MANGO', 'PEACH', 'CHERRY', 'MELON'];
  let currentWord, score = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function shuffle(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    let scrambled = shuffle(currentWord);
    while (scrambled === currentWord && currentWord.length > 3) {
      scrambled = shuffle(currentWord);
    }
    if (wordEl) wordEl.textContent = scrambled;
    if (input) input.value = '';
    setStatus('Unscramble the letters!');
  }

  function checkAnswer() {
    if (!input) return;
    const answer = input.value.trim().toUpperCase();
    if (answer === currentWord) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      setStatus('✅ Correct!');
      setTimeout(newWord, 500);
    } else {
      setStatus('❌ Wrong! Try again.');
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
  if (skipBtn) skipBtn.addEventListener('click', () => {
    setStatus(`The word was: ${currentWord}`);
    setTimeout(newWord, 1000);
  });
  newWord();
}

function initDice(container) {
  const dice1 = container.querySelector('#dice-1');
  const dice2 = container.querySelector('#dice-2');
  const totalEl = container.querySelector('#dice-total');
  const highEl = container.querySelector('#dice-high');
  const rollBtn = container.querySelector('#dice-roll');
  const statusEl = container.querySelector('#dice-status');

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  let highScore = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function rollDice() {
    if (!dice1 || !dice2) return;
    dice1.classList.add('rolling');
    dice2.classList.add('rolling');
    setTimeout(() => {
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;
      const total = roll1 + roll2;
      dice1.textContent = diceFaces[roll1 - 1];
      dice2.textContent = diceFaces[roll2 - 1];
      if (totalEl) totalEl.textContent = String(total);
      if (total > highScore) {
        highScore = total;
        if (highEl) highEl.textContent = String(highScore);
        setStatus('🎉 New high score!');
      } else {
        setStatus(`You rolled ${total}!`);
      }
      dice1.classList.remove('rolling');
      dice2.classList.remove('rolling');
    }, 500);
  }

  if (rollBtn) rollBtn.addEventListener('click', rollDice);
}

function initWhack(container) {
  const holes = Array.from(container.querySelectorAll('.whack-hole'));
  const statusEl = container.querySelector('#whack-status');
  const scoreEl = container.querySelector('#whack-score');
  const timeEl = container.querySelector('#whack-time');
  const startBtn = container.querySelector('#whack-start');

  let score = 0, timeLeft = 30, gameActive = false, moleInterval, timerInterval;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function showMole() {
    holes.forEach(h => h.classList.remove('active'));
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.classList.add('active');
    randomHole.textContent = '🐹';
    setTimeout(() => {
      if (randomHole.classList.contains('active')) {
        randomHole.classList.remove('active');
        randomHole.textContent = '';
      }
    }, 800);
  }

  function whackMole(e) {
    if (!gameActive) return;
    const hole = e.currentTarget;
    if (hole.classList.contains('active')) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      hole.classList.remove('active');
      hole.textContent = '💥';
      setTimeout(() => { hole.textContent = ''; }, 200);
    }
  }

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    timeLeft = 30;
    if (scoreEl) scoreEl.textContent = '0';
    if (timeEl) timeEl.textContent = '30s';
    setStatus('Whack the moles!');
    moleInterval = setInterval(showMole, 1000);
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      if (timeEl) timeEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        gameActive = false;
        clearInterval(moleInterval);
        clearInterval(timerInterval);
        holes.forEach(h => { h.classList.remove('active'); h.textContent = ''; });
        setStatus(`Game over! Score: ${score}`);
      }
    }, 1000);
  }

  holes.forEach(h => h.addEventListener('click', whackMole));
  if (startBtn) startBtn.addEventListener('click', startGame);
}

function initMath(container) {
  const questionEl = container.querySelector('#math-question');
  const input = container.querySelector('#math-input');
  const submitBtn = container.querySelector('#math-submit');
  const statusEl = container.querySelector('#math-status');
  const scoreEl = container.querySelector('#math-score');
  const streakEl = container.querySelector('#math-streak');
  const restartBtn = container.querySelector('#math-restart');

  let score = 0, streak = 0, currentAnswer = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let question = '';
    if (op === '+') {
      currentAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else if (op === '-') {
      const bigger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      currentAnswer = bigger - smaller;
      question = `${bigger} - ${smaller} = ?`;
    } else {
      currentAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
    }
    if (questionEl) questionEl.textContent = question;
    if (input) input.value = '';
    setStatus('Solve the equation!');
  }

  function checkAnswer() {
    if (!input) return;
    const answer = Number(input.value);
    if (answer === currentAnswer) {
      score += 1;
      streak += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      if (streakEl) streakEl.textContent = String(streak);
      setStatus('✅ Correct!');
      setTimeout(generateQuestion, 500);
    } else {
      streak = 0;
      if (streakEl) streakEl.textContent = '0';
      setStatus('❌ Wrong!');
      setTimeout(generateQuestion, 1000);
    }
  }

  function init() {
    score = 0;
    streak = 0;
    if (scoreEl) scoreEl.textContent = '0';
    if (streakEl) streakEl.textContent = '0';
    generateQuestion();
  }

  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initSnake(container) {
  const canvas = container.querySelector('#snake-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const statusEl = container.querySelector('#snake-status');
  const scoreEl = container.querySelector('#snake-score');
  const highEl = container.querySelector('#snake-high');
  const startBtn = container.querySelector('#snake-start');

  if (!canvas || !ctx) return;

  const gridSize = 20, tileCount = 12;
  let snake = [{ x: 6, y: 6 }], food = { x: 10, y: 10 }, dx = 0, dy = 0, score = 0, highScore = 0, gameRunning = false, gameLoop;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function drawGame() {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4ecdc4' : '#95e1d3';
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
  }

  function moveSnake() {
    if (dx === 0 && dy === 0) return;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameRunning = false;
      clearInterval(gameLoop);
      if (score > highScore) {
        highScore = score;
        if (highEl) highEl.textContent = String(highScore);
      }
      setStatus(`Game Over! Score: ${score}`);
      dx = 0;
      dy = 0;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      if (scoreEl) scoreEl.textContent = String(score);
      do {
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
      } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    } else {
      snake.pop();
    }
  }

  function gameUpdate() {
    moveSnake();
    drawGame();
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    snake = [{ x: 6, y: 6 }];
    dx = 1;
    dy = 0;
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    food = { x: 10, y: 10 };
    setStatus('Use arrow keys!');
    gameLoop = setInterval(gameUpdate, 150);
  }

  const keyHandler = (e) => {
    if (!gameRunning) return;
    switch (e.key) {
      case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
      case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
      case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
      case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
    }
  };

  document.addEventListener('keydown', keyHandler);
  if (startBtn) startBtn.addEventListener('click', startGame);
  drawGame();
}

function initTyping(container) {
  const textEl = container.querySelector('#typing-text');
  const input = container.querySelector('#typing-input');
  const statusEl = container.querySelector('#typing-status');
  const wpmEl = container.querySelector('#typing-wpm');
  const accuracyEl = container.querySelector('#typing-accuracy');
  const restartBtn = container.querySelector('#typing-restart');

  const texts = [
    'The quick brown fox jumps over the lazy dog',
    'Programming is fun and rewarding',
    'Practice makes perfect'
  ];
  let startTime = null, currentText = '';

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function newTest() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    if (textEl) textEl.textContent = currentText;
    if (input) input.value = '';
    if (wpmEl) wpmEl.textContent = '0';
    if (accuracyEl) accuracyEl.textContent = '100%';
    startTime = null;
    setStatus('Type the text below!');
  }

  function checkTyping() {
    if (!input) return;
    if (!startTime) startTime = Date.now();
    const typed = input.value;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = typed.split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === currentText[i]) correct++;
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    if (wpmEl) wpmEl.textContent = String(wpm);
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
    if (typed === currentText) {
      setStatus(`✅ Complete! WPM: ${wpm}`);
    }
  }

  if (input) input.addEventListener('input', checkTyping);
  if (restartBtn) restartBtn.addEventListener('click', newTest);
  newTest();
}

function initConnect(container) {
  const gridEl = container.querySelector('#connect-grid');
  const statusEl = container.querySelector('#connect-status');
  const restartBtn = container.querySelector('#connect-restart');

  const ROWS = 6, COLS = 7;
  let board = [], currentPlayer = 'red', gameOver = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    if (!gridEl) return;
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = document.createElement('div');
        cell.className = 'connect-cell';
        cell.addEventListener('click', () => dropPiece(col));
        gridEl.appendChild(cell);
      }
    }
  }

  function dropPiece(col) {
    if (gameOver) return;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        board[row][col] = currentPlayer;
        const cells = Array.from(gridEl.children);
        cells[row * COLS + col].classList.add('filled', currentPlayer);
        if (checkWin(row, col)) {
          setStatus(`${currentPlayer.toUpperCase()} wins!`);
          gameOver = true;
          return;
        }
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        setStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`);
        return;
      }
    }
  }

  function checkWin(row, col) {
    const directions = [[[0, 1], [0, -1]], [[1, 0], [-1, 0]], [[1, 1], [-1, -1]], [[1, -1], [-1, 1]]];
    for (const [dir1, dir2] of directions) {
      let count = 1;
      count += countDirection(row, col, dir1[0], dir1[1]);
      count += countDirection(row, col, dir2[0], dir2[1]);
      if (count >= 4) return true;
    }
    return false;
  }

  function countDirection(row, col, dRow, dCol) {
    let count = 0, r = row + dRow, c = col + dCol;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
      count++;
      r += dRow;
      c += dCol;
    }
    return count;
  }

  function init() {
    currentPlayer = 'red';
    gameOver = false;
    createBoard();
    setStatus("Red's turn");
  }

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initHangman(container) {
  const wordEl = container.querySelector('#hangman-word');
  const lettersEl = container.querySelector('#hangman-letters');
  const statusEl = container.querySelector('#hangman-status');
  const livesEl = container.querySelector('#hangman-lives');
  const restartBtn = container.querySelector('#hangman-restart');

  const words = ['JAVASCRIPT', 'PYTHON', 'COMPUTER', 'KEYBOARD', 'PROGRAM'];
  let currentWord = '', guessedLetters = [], lives = 6;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createLetterButtons() {
    if (!lettersEl) return;
    lettersEl.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'hangman-letter-btn';
      btn.textContent = letter;
      btn.addEventListener('click', () => guessLetter(letter, btn));
      lettersEl.appendChild(btn);
    }
  }

  function updateDisplay() {
    if (!wordEl) return;
    const display = currentWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordEl.textContent = display;
    if (livesEl) livesEl.textContent = '❤️'.repeat(lives);
    if (!display.includes('_')) setStatus('🎉 You won!');
  }

  function guessLetter(letter, btn) {
    if (guessedLetters.includes(letter) || lives === 0) return;
    guessedLetters.push(letter);
    btn.disabled = true;
    if (currentWord.includes(letter)) {
      setStatus('✅ Good guess!');
    } else {
      lives -= 1;
      setStatus('❌ Wrong!');
      if (lives === 0) {
        setStatus(`💀 Game Over! Word: ${currentWord}`);
        if (wordEl) wordEl.textContent = currentWord;
      }
    }
    updateDisplay();
  }

  function init() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    lives = 6;
    createLetterButtons();
    updateDisplay();
    setStatus('Guess a letter!');
  }

  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}

function initQuiz(container) {
  const questionEl = container.querySelector('#quiz-question');
  const optionsEl = container.querySelector('#quiz-options');
  const statusEl = container.querySelector('#quiz-status');
  const scoreEl = container.querySelector('#quiz-score');
  const nextBtn = container.querySelector('#quiz-next');

  const questions = [
    { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: 1 },
    { q: 'Capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2 },
    { q: 'Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1 }
  ];
  let currentQuestion = 0, score = 0, total = 0, answered = false;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) currentQuestion = 0;
    const q = questions[currentQuestion];
    if (questionEl) questionEl.textContent = q.q;
    if (!optionsEl) return;
    optionsEl.innerHTML = '';
    answered = false;
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = option;
      btn.addEventListener('click', () => checkAnswer(index, btn));
      optionsEl.appendChild(btn);
    });
    setStatus('Choose the correct answer!');
  }

  function checkAnswer(index, btn) {
    if (answered) return;
    answered = true;
    total += 1;
    const q = questions[currentQuestion];
    const options = Array.from(optionsEl.children);
    if (index === q.answer) {
      score += 1;
      btn.classList.add('correct');
      setStatus('✅ Correct!');
    } else {
      btn.classList.add('wrong');
      options[q.answer].classList.add('correct');
      setStatus('❌ Wrong!');
    }
    if (scoreEl) scoreEl.textContent = `${score} / ${total}`;
  }

  function nextQuestion() {
    currentQuestion += 1;
    loadQuestion();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
  loadQuestion();
}

function initPong(container) {
  const canvas = container.querySelector('#pong-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const statusEl = container.querySelector('#pong-status');
  const scoreEl = container.querySelector('#pong-score');
  const startBtn = container.querySelector('#pong-start');

  if (!canvas || !ctx) return;

  let gameRunning = false, player1Y = 80, player2Y = 80, ballX = 150, ballY = 100, ballDX = 3, ballDY = 2, score1 = 0, score2 = 0;
  const keys = {};

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function draw() {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(10, player1Y, 8, 40);
    ctx.fillRect(canvas.width - 18, player2Y, 8, 40);
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  function update() {
    if (!gameRunning) return;
    if (keys['w'] && player1Y > 0) player1Y -= 4;
    if (keys['s'] && player1Y < 160) player1Y += 4;
    if (keys['ArrowUp'] && player2Y > 0) player2Y -= 4;
    if (keys['ArrowDown'] && player2Y < 160) player2Y += 4;
    ballX += ballDX;
    ballY += ballDY;
    if (ballY <= 6 || ballY >= 194) ballDY = -ballDY;
    if (ballX <= 18 && ballY >= player1Y && ballY <= player1Y + 40) { ballDX = -ballDX; ballX = 18; }
    if (ballX >= 282 && ballY >= player2Y && ballY <= player2Y + 40) { ballDX = -ballDX; ballX = 282; }
    if (ballX < 0) { score2 += 1; ballX = 150; ballY = 100; ballDX = -ballDX; }
    if (ballX > 300) { score1 += 1; ballX = 150; ballY = 100; ballDX = -ballDX; }
    if (scoreEl) scoreEl.textContent = `${score1} : ${score2}`;
    draw();
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score1 = 0;
    score2 = 0;
    if (scoreEl) scoreEl.textContent = '0 : 0';
    setStatus('Playing!');
    setInterval(update, 1000 / 60);
  }

  document.addEventListener('keydown', (e) => { keys[e.key] = true; });
  document.addEventListener('keyup', (e) => { keys[e.key] = false; });
  if (startBtn) startBtn.addEventListener('click', startGame);
  draw();
}

function initClicker(container) {
  const button = container.querySelector('#clicker-button');
  const countEl = container.querySelector('#clicker-count');
  const bestEl = container.querySelector('#clicker-best');
  const statusEl = container.querySelector('#clicker-status');
  const startBtn = container.querySelector('#clicker-start');

  let clicks = 0, best = 0, gameActive = false, timeLeft = 10;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function handleClick() {
    if (!gameActive) return;
    clicks += 1;
    if (countEl) countEl.textContent = String(clicks);
  }

  function startGame() {
    if (gameActive) return;
    gameActive = true;
    clicks = 0;
    timeLeft = 10;
    if (countEl) countEl.textContent = '0';
    if (button) button.disabled = false;
    setStatus(`Click fast! ${timeLeft}s`);
    const timer = setInterval(() => {
      timeLeft -= 1;
      setStatus(`Click fast! ${timeLeft}s`);
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameActive = false;
        if (button) button.disabled = true;
        if (clicks > best) {
          best = clicks;
          if (bestEl) bestEl.textContent = String(best);
          setStatus(`🎉 New record! ${clicks} clicks!`);
        } else {
          setStatus(`Time's up! ${clicks} clicks!`);
        }
      }
    }, 1000);
  }

  if (button) {
    button.addEventListener('click', handleClick);
    button.disabled = true;
  }
  if (startBtn) startBtn.addEventListener('click', startGame);
}

function init2048(container) {
  const gridEl = container.querySelector('#t2048-grid');
  const statusEl = container.querySelector('#t2048-status');
  const scoreEl = container.querySelector('#t2048-score');
  const bestEl = container.querySelector('#t2048-best');
  const restartBtn = container.querySelector('#t2048-restart');

  let grid = [], score = 0, best = 0;

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function createGrid() {
    grid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile();
    addNewTile();
  }

  function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 't2048-cell';
        const value = grid[i][j];
        if (value > 0) {
          cell.textContent = String(value);
          cell.setAttribute('data-value', String(value));
        }
        gridEl.appendChild(cell);
      }
    }
    if (scoreEl) scoreEl.textContent = String(score);
  }

  function move(direction) {
    const oldGrid = JSON.stringify(grid);
    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(val => val !== 0);
        if (direction === 'right') row.reverse();
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            score += row[j];
            row.splice(j + 1, 1);
          }
        }
        while (row.length < 4) row.push(0);
        if (direction === 'right') row.reverse();
        grid[i] = row;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) if (grid[i][j] !== 0) col.push(grid[i][j]);
        if (direction === 'down') col.reverse();
        for (let i = 0; i < col.length - 1; i++) {
          if (col[i] === col[i + 1]) {
            col[i] *= 2;
            score += col[i];
            col.splice(i + 1, 1);
          }
        }
        while (col.length < 4) col.push(0);
        if (direction === 'down') col.reverse();
        for (let i = 0; i < 4; i++) grid[i][j] = col[i];
      }
    }
    if (JSON.stringify(grid) !== oldGrid) addNewTile();
    renderGrid();
    if (score > best) {
      best = score;
      if (bestEl) bestEl.textContent = String(best);
    }
    if (grid.some(row => row.includes(2048))) setStatus('🎉 You won!');
  }

  function init() {
    score = 0;
    createGrid();
    renderGrid();
    setStatus('Use arrow keys!');
  }

  const keyHandler = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const direction = e.key.replace('Arrow', '').toLowerCase();
      move(direction);
    }
  };

  document.addEventListener('keydown', keyHandler);
  if (restartBtn) restartBtn.addEventListener('click', init);
  init();
}
