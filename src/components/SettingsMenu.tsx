import React from "react";

interface SettingsMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-menu">
        <h2 className="settings-title">SETTINGS</h2>

        <div className="settings-option">
          <span>Music:</span>
          <button className="toggle-button active">ON</button>
          <button className="toggle-button">OFF</button>
        </div>

        <div className="settings-option">
          <span>Sound Effects:</span>
          <button className="toggle-button active">ON</button>
          <button className="toggle-button">OFF</button>
        </div>

        <div className="settings-option">
          <span>Difficulty:</span>
          <button className="toggle-button">Easy</button>
          <button className="toggle-button active">Normal</button>
          <button className="toggle-button">Hard</button>
        </div>

        <button className="back-button" onClick={onClose}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;
