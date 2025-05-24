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

      <style jsx>{`
        .settings-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .settings-menu {
          background-color: #333;
          border: 3px solid #aaa;
          width: 400px;
          padding: 20px;
          color: white;
          font-family: "Press Start 2P", cursive;
        }

        .settings-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }

        .settings-option {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .settings-option span {
          width: 180px;
          font-size: 14px;
        }

        .toggle-button {
          background-color: #555;
          color: white;
          border: 2px solid #888;
          margin: 0 5px;
          padding: 8px 12px;
          font-family: "Press Start 2P", cursive;
          font-size: 12px;
          cursor: pointer;
        }

        .toggle-button.active {
          background-color: #775511;
          border-color: #ffaa22;
        }

        .back-button {
          display: block;
          width: 140px;
          margin: 30px auto 0;
          padding: 10px;
          background-color: #555;
          color: white;
          border: 2px solid white;
          font-family: "Press Start 2P", cursive;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SettingsMenu;
