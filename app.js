document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("start__button");
  const width = 10;
  let timerId;
  let nextRandom = 0;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  for (let i = 0; i < squares.length; i++) {
    squares[i].setAttribute("id", i);
  }

  //* The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;
  let randomNum = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[randomNum][currentRotation];

  console.log(theTetrominoes);
  console.log(randomNum, currentRotation);
  console.log(current);

  //* draw the Tetromino
  function draw() {
    current.forEach((i) => {
      console.log(squares[currentPosition + i]);
      squares[currentPosition + i].classList.add("tetromino");
      squares[currentPosition + i].style.backgroundColor = colors[randomNum];
    });
  }

  function undraw() {
    current.forEach((i) => {
      squares[currentPosition + i].classList.remove("tetromino");
      squares[currentPosition + i].style.backgroundColor = "";
    });
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function freeze() {
    if (
      current.some((i) =>
        squares[currentPosition + i + width].classList.contains("taken")
      )
    ) {
      current.forEach((i) =>
        squares[currentPosition + i].classList.add("taken")
      );
      randomNum = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[randomNum][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (i) => (currentPosition + i) % width === 0
    );
    if (!isAtLeftEdge) {
      return (currentPosition -= 1);
    }
    if (
      current.some((i) =>
        squares[currentPosition + i].classList.contains("taken")
      )
    ) {
      return (currentPosition += 1);
    }

    draw();
  }

  function moveRight() {
    undraw();

    const isAtRightEdge = current.some(
      (i) => (currentPosition + i) % width === width - 1
    );

    if (!isAtRightEdge) {
      return (currentPosition += 1);
    }

    if (
      current.some((i) =>
        squares[currentPosition + i].classList.contains("taken")
      )
    ) {
      return (currentPosition -= 1);
    }

    draw();
  }

  const rotate = () => {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[randomNum][currentRotation];
    draw();
  };

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  const displayShape = () => {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    upNextTetrominoes[nextRandom].forEach((i) => {
      displaySquares[displayIndex + i].classList.add("tetromino");
      displaySquares[displayIndex + i].style.backgroundColor =
        colors[nextRandom];
    });
  };

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  const addScore = () => {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((i) => squares[i].classList.contains("taken"))) {
        score = +10;
        scoreDisplay.innerHTML = score;
        row.forEach((r) => {
          squares[r].classList.remove("taken");
          squares[r].classList.remove("tetromino");
          squares[r].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  };

  const gameOver = () => {
    if (
      current.some((i) => {
        squares[currentPosition + i].classList.contains("taken");
      })
    ) {
      scoreDisplay.innerHTML = "END";
      clearInterval(timerId);
    }
  };
});
