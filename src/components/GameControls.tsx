import React from "react";

interface GameControlsProps {
  toggleSettings: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ toggleSettings }) => {
  return (
    <div className="game-controls">
      <div className="settings-button" onClick={toggleSettings}>
        <div className="gear-icon">⚙️</div>
        <div className="key-hint">ESC</div>
      </div>

      <div className="controls-panel">
        <h3 className="controls-title">CONTROLS:</h3>
        <ul className="controls-list">
          <li>A - Move Left</li>
          <li>D - Move Right</li>
          <li>W - Attack</li>
          <li>SPACE - Jump</li>
          <li>ESC - Settings</li>
        </ul>
      </div>

      <style jsx>{`
        .game-controls {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .settings-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.7);
          border: 2px solid white;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
        }

        .gear-icon {
          font-size: 20px;
        }

        .key-hint {
          font-size: 8px;
          margin-top: 2px;
          font-family: "Press Start 2P", cursive;
        }

        .controls-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          border: 2px solid white;
          border-radius: 4px;
          padding: 10px 15px;
          color: white;
          font-family: "Press Start 2P", cursive;
          pointer-events: none;
        }

        .controls-title {
          font-size: 12px;
          margin: 0 0 10px 0;
        }

        .controls-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .controls-list li {
          font-size: 10px;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default GameControls;
