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
    </div>
  );
};

export default GameControls;
