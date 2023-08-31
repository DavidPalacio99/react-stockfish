class Engine {
  constructor() {
    this.stockfish = new Worker("./stockfish.js");
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        const bestMoveMatch = e.data?.match(/bestmove\s+(\S+)/);
        if (bestMoveMatch) {
          const bestMove = bestMoveMatch[1];
          callback({ bestMove });
        }
      });
    };
    // Init engine
    this.sendMessage("uci");
    this.sendMessage("isready");
  }

  sendMessage(message) {
    this.stockfish.postMessage(message);
  }

  evaluatePosition(fen, depth) {
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`go depth ${depth}`);
  }

  stop() {
    this.sendMessage("stop"); // Run when changing positions
  }

  quit() {
    this.sendMessage("quit"); // Good to run this before unmounting.
  }
}

export default Engine;
