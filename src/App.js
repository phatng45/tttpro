import {Component} from "react";
import {createRoot} from "react-dom/client";
import './App.css';

function Square(props) {
  return (
      <button className={props.highlight ? "squareHighlight" : "square"} onClick={props.onClick}>
        {props.value}
      </button>
  );
}

class Board extends Component {
  renderSquare(i, highlight = false) {
    return (
        <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={highlight}
        />
    );
  }

  render() {
    const boardSize = 3;
    const board = [];

    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(this.renderSquare(i * boardSize + j, this.props.winLine ? this.props.winLine.some(v => v === i * boardSize + j) : false));
      }
      board.push(
          <div key={i} className="board-row">
            {row}
          </div>
      );
    }

    return <div>{board}</div>;
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortStepsAscending: true,
      move: -1,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const winLine = calculateWinner(current.squares);
    const winner = winLine == null? null: current.squares[winLine[0]];

    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleSortToggle(){
    this.setState({
      sortStepsAscending: !this.state.sortStepsAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winLine = calculateWinner(current.squares);
    const winner = winLine == null? null: current.squares[winLine[0]];

    let moves = history.map((step, move) => {
      const movePos = move < (history.length -1) ?'(' +Math.floor(history[move+1].move / 3)+',' + history[move+1].move % 3 +')' : ''

      const desc = move ?
          'Go to move #' + move :
          'Go to game start';
      if(move === this.state.stepNumber){
        return (
            <li key={move}>
              <text>{movePos} You are at move #{move}</text>
            </li>
        );
      }

      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{movePos + ' '+ desc}</button>
          </li>
      );
    });

    moves = this.state.sortStepsAscending ? moves : moves.reverse();

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                winLine={winLine}
            />
          </div>
          <div className="game-info">
            <div><text>19127505 - Trieu Nguyen Phat</text></div>
            <div> <button onClick={() => this.handleSortToggle()}>{"Sorting " + (this.state.sortStepsAscending ? "Ascending" : "Descending")}</button></div>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }
}

// ========================================

const root = createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return lines[i];
    }
  }
  return null;
}

export default Game;