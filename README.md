# Pixel Runner

## Overview
Pixel Runner is an action-packed side-scrolling game built with React and TypeScript, featuring fluid animations, parallax backgrounds, and engaging combat mechanics. Play as a brave bunny warrior slashing through flying bat enemies while navigating through a beautifully rendered forest environment.

![Pixel Runner Game](screenshot.png)

## Features

### Dynamic Combat System
- Attack flying bats with your sword using the W key
- Smooth attack animations with precise hit detection
- Satisfying death animations for defeated enemies
- Gain points for each enemy slain

### Character Movement
- Run left and right using A/D keys
- Jump over obstacles with Space
- Fluid character animations for running, jumping, and attacking

### Damage System
- Take damage when enemies collide with you
- Visual health bar that changes color based on remaining health
- Temporary invincibility after taking damage
- Character flashing effect when invincible

### Visual Effects
- Parallax scrolling with 5 depth layers for immersive environments
- Pixel art sprites with fluid animations
- Death animations for enemies
- Damage animations for player character

### Game Mechanics
- Score tracking with persistent high score system
- Health management
- Game over state with restart option
- Wave-based enemy spawning

## Controls
- **A/D**: Move left/right
- **Space**: Jump
- **W**: Attack with sword
- **Space**: Restart game after game over

## Technical Details

The game is built using modern web technologies:

- **React**: For component-based architecture
- **TypeScript**: For type-safe development
- **Canvas API**: For smooth rendering and animations
- **RequestAnimationFrame**: For consistent animation timing
- **Local Storage**: For persistent high scores

### Implementation Highlights

- **Collision Detection**: Precise hitbox system for attacks and damage
- **Animation System**: Frame-based animation for characters and enemies
- **Parallax Scrolling**: Multi-layered backgrounds with different scroll speeds
- **Game State Management**: Using React refs for efficient state updates
- **Wave Movement**: Enemies follow sinusoidal movement patterns for varied difficulty

## Development

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/pixel-runner.git

# Navigate to the project directory
cd pixel-runner

# Install dependencies
npm install

# Start the development server
npm start
```

## Future Enhancements
- Additional enemy types
- Power-up items
- Multiple levels with increasing difficulty
- Boss battles
- Sound effects and music
- Mobile touch controls
- Character progression system

## Credits
- Character sprites: Adventurer asset pack
- Background art: Parallax Forest
- Bat enemy sprites: Enemy Pack

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Feel free to contribute to this project by submitting pull requests or opening issues for bugs and feature requests


![image](https://github.com/user-attachments/assets/53314cb3-34c8-4a47-8732-5be35f402c31)
