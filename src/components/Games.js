import React, { useCallback, useMemo, useState } from "react";


function Square({ onClick, value }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
  const renderSquare = useCallback(
    (i) => {
      return <Square value={squares[i]} onClick={() => onClick(i)} />;
    },
    [squares, onClick]
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default function TicTacToe() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = useCallback(
    (i) => {
      const sliceHistory = history.slice(0, stepNumber + 1);
      const current = sliceHistory[sliceHistory.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = xIsNext ? "x" : "o";
      setHistory([...sliceHistory, { squares }]);
      setStepNumber(sliceHistory.length);
      setXIsNext(!xIsNext);
    },
    [history, stepNumber, xIsNext]
  );

  const jumpTo = useCallback((move) => {
    setStepNumber(move);
    setXIsNext(move % 2 === 0);
  }, []);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const moves = useMemo(() => {
    return history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  }, [history, jumpTo]);
  const status = useMemo(() => {
    return winner
      ? "Winner: " + winner
      : "Next player: " + (xIsNext ? "x" : "o");
  }, [winner, xIsNext]);

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

