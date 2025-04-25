import { useEffect, useRef } from "react";
import bunnySprite from "../../public/assets/characters/bunny/adventurer-run3-sword-Sheet.png";
import bg1 from "../../public/assets/background/1.png";
import bg2 from "../../public/assets/background/2.png";
import bg3 from "../../public/assets/background/3.png";
import bg4 from "../../public/assets/background/4.png";
import bg5 from "../../public/assets/background/5.png";
import jumpSprite0 from "../../public/assets/characters/bunny/adventurer-jump-00.png";
import jumpSprite1 from "../../public/assets/characters/bunny/adventurer-jump-01.png";
import jumpSprite2 from "../../public/assets/characters/bunny/adventurer-jump-02.png";
import jumpSprite3 from "../../public/assets/characters/bunny/adventurer-jump-03.png";

// ...existing imports...
import attackSprite0 from "../../public/assets/characters/bunny/adventurer-attack3-00.png";
import attackSprite1 from "../../public/assets/characters/bunny/adventurer-attack3-01.png";
import attackSprite2 from "../../public/assets/characters/bunny/adventurer-attack3-02.png";
import attackSprite3 from "../../public/assets/characters/bunny/adventurer-attack3-03.png";
import attackSprite4 from "../../public/assets/characters/bunny/adventurer-attack3-04.png";
import attackSprite5 from "../../public/assets/characters/bunny/adventurer-attack3-05.png";

//Enemy sprites
import batSprite from "../../public/assets/characters/bat/Bat-IdleFly.png";

interface Layer {
  image: HTMLImageElement;
  x: number;
  speed: number;
}

// Add interface for bat enemy
interface Bat {
  x: number;
  y: number;
  frameIndex: number;
  speed: number;
  width: number;
  height: number;
  waveFactor: number; // Adicionar fator de ondulação para movimento vertical
  waveOffset: number; // Offset inicial para movimento ondulado
}

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bunnyImage = useRef<HTMLImageElement | null>(null);
  const attackImages = useRef<HTMLImageElement[]>([]);
  const jumpImages = useRef<HTMLImageElement[]>([]);
  const layersRef = useRef<Layer[]>([]);

  // Add bat sprites and enemies references
  const batImages = useRef<HTMLImageElement[]>([]);
  const batEnemies = useRef<Bat[]>([]);
  const lastBatSpawnTime = useRef<number>(0);

  // Add movement state
  const movementState = useRef({
    movingLeft: false,
    movingRight: false,
    speed: 5,
    positionX: 100, // Initial X position
  });

  // Add jump state variables
  const jumpState = useRef({
    isJumping: false,
    jumpFrame: 0,
    jumpY: 0,
    initialY: 0,
    jumpHeight: 150,
    jumpSpeed: 8,
  });

  const attackState = useRef({
    isAttacking: false,
    attackFrame: 0,
    attackDuration: 300, // Adjust timing as needed
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;

    // Bunny sprite config
    const FRAME_WIDTH = 50;
    const FRAME_HEIGHT = 37;
    const TOTAL_FRAMES = 6;
    let frameIndex = 0;
    let frameTimer = 0;
    const FRAME_DURATION = 100;

    // Bunny position
    const bunnyX = 100;
    const groundY = height - 100;
    const bunnyY = groundY - FRAME_HEIGHT * 2;

    jumpState.current.jumpY = bunnyY;
    jumpState.current.initialY = bunnyY;

    // Load attack sprites
    const attackSprites = [attackSprite0, attackSprite1, attackSprite2, attackSprite3, attackSprite4, attackSprite5];

    attackImages.current = attackSprites.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Load background layers
    const backgroundLayers = [
      { src: bg1, speed: 0.5 }, // Slowest - furthest back
      { src: bg2, speed: 1 },
      { src: bg3, speed: 1.5 },
      { src: bg4, speed: 2 },
      { src: bg5, speed: 2.5 }, // Fastest - closest to viewer
    ];

    // Initialize layers
    layersRef.current = backgroundLayers.map(({ src, speed }) => {
      const img = new Image();
      img.src = src;
      return {
        image: img,
        x: 0,
        speed,
      };
    });

    // Load jump sprites
    const jumpSprites = [jumpSprite0, jumpSprite1, jumpSprite2, jumpSprite3];
    jumpImages.current = jumpSprites.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Handle keyboard input
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !jumpState.current.isJumping) {
        jumpState.current.isJumping = true;
        jumpState.current.jumpFrame = 0;
        jumpState.current.initialY = jumpState.current.jumpY;
      }

      if (e.code === "KeyW" && !attackState.current.isAttacking) {
        attackState.current.isAttacking = true;
        attackState.current.attackFrame = 0;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Load bunny sprite
    const bunny = new Image();
    bunny.src = bunnySprite;
    bunnyImage.current = bunny;

    let lastTime = performance.now();
    let animationFrameId: number;

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !jumpState.current.isJumping) {
        jumpState.current.isJumping = true;
        jumpState.current.jumpFrame = 0;
        jumpState.current.initialY = jumpState.current.jumpY;
      }

      if (e.code === "KeyW" && !attackState.current.isAttacking) {
        attackState.current.isAttacking = true;
        attackState.current.attackFrame = 0;
      }

      // Handle movement keys
      if (e.code === "KeyA") {
        movementState.current.movingLeft = true;
      }
      if (e.code === "KeyD") {
        movementState.current.movingRight = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Stop movement when keys are released
      if (e.code === "KeyA") {
        movementState.current.movingLeft = false;
      }
      if (e.code === "KeyD") {
        movementState.current.movingRight = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Load bat sprites
    const batImg = new Image();
    batImg.src = batSprite;
    batImages.current = [batImg]; // Store the bat sprite image

    // Initialize bat enemies array
    batEnemies.current = [];

    // Bat configuration
    const BAT_FRAME_WIDTH = 62; // Width of each frame in the sprite sheet
    const BAT_FRAME_HEIGHT = 62; // Height of each frame
    const BAT_FRAMES = 7; // Number of animation frames in the sprite sheet
    const BAT_FRAME_DURATION = 100; // Faster animation for bat wings
    const BAT_DISPLAY_WIDTH = 90; // Increased display size
    const BAT_DISPLAY_HEIGHT = 90; // Increased display height
    const BAT_SPAWN_INTERVAL = 3000; // Spawn a new bat every 3 seconds

    // Track bat animation timing separately from bunny animation
    let batFrameTimer = 0;

    const draw = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Draw background layers
      layersRef.current.slice(0, 3).forEach((layer) => {
        if (layer.image.complete) {
          // Move the layer
          layer.x -= layer.speed;

          // Reset position when image goes off screen
          if (layer.x <= -width) {
            layer.x = 0;
          }

          // Draw two copies of the image for seamless scrolling
          ctx.drawImage(layer.image, layer.x, 0, width, height);
          ctx.drawImage(layer.image, layer.x + width, 0, width, height);
        }
      });

      // Update bunny position based on movement state
      if (movementState.current.movingLeft) {
        movementState.current.positionX -= movementState.current.speed;
        // Prevent moving off left edge
        if (movementState.current.positionX < 0) {
          movementState.current.positionX = 0;
        }
      }
      if (movementState.current.movingRight) {
        movementState.current.positionX += movementState.current.speed;
        // Prevent moving off right edge
        if (movementState.current.positionX > width - FRAME_WIDTH * 2) {
          movementState.current.positionX = width - FRAME_WIDTH * 2;
        }
      }

      // Update bunny animation
      frameTimer += deltaTime;
      if (frameTimer > FRAME_DURATION) {
        frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
        frameTimer = 0;
      }

      // Draw character
      if (attackState.current.isAttacking) {
        // Calculate attack animation frame
        const attackProgress = Math.min(attackState.current.attackFrame / 18, 1);
        const attackIndex = Math.min(Math.floor(attackProgress * 6), 5);

        if (attackImages.current[attackIndex]?.complete) {
          ctx.drawImage(
            attackImages.current[attackIndex],
            0,
            0,
            FRAME_WIDTH,
            FRAME_HEIGHT,
            movementState.current.positionX, // Changed from bunnyX to dynamic position
            jumpState.current.jumpY,
            FRAME_WIDTH * 2,
            FRAME_HEIGHT * 2
          );
        }

        attackState.current.attackFrame += 1;

        // End attack when animation is complete
        if (attackProgress >= 1) {
          attackState.current.isAttacking = false;
        }
      }
      // Draw bunny with jumping or running animation
      else if (jumpState.current.isJumping) {
        // Calculate jump height using sine wave for smooth up/down motion
        const jumpProgress = Math.min(jumpState.current.jumpFrame / 30, 1);
        const jumpCurve = Math.sin(jumpProgress * Math.PI);
        jumpState.current.jumpY = jumpState.current.initialY - jumpCurve * jumpState.current.jumpHeight;

        // Draw jump animation frames
        const jumpIndex = Math.min(Math.floor(jumpProgress * 4), 3);
        if (jumpImages.current[jumpIndex]?.complete) {
          ctx.drawImage(
            jumpImages.current[jumpIndex],
            0,
            0,
            FRAME_WIDTH,
            FRAME_HEIGHT,
            movementState.current.positionX, // Use dynamic X position
            jumpState.current.jumpY,
            FRAME_WIDTH * 2,
            FRAME_HEIGHT * 2
          );
        }

        jumpState.current.jumpFrame += 1;

        // End jump when animation is complete
        if (jumpProgress >= 1) {
          jumpState.current.isJumping = false;
          jumpState.current.jumpY = jumpState.current.initialY;
        }
      } else {
        // Draw running animation
        if (bunnyImage.current?.complete) {
          ctx.drawImage(
            bunnyImage.current,
            frameIndex * FRAME_WIDTH,
            0,
            FRAME_WIDTH,
            FRAME_HEIGHT,
            movementState.current.positionX, // Use dynamic X position
            jumpState.current.jumpY,
            FRAME_WIDTH * 2,
            FRAME_HEIGHT * 2
          );
        }
      }

      // Handle bat spawning
      if (time - lastBatSpawnTime.current > BAT_SPAWN_INTERVAL) {
        // Spawn a new bat
        const bat: Bat = {
          x: width, // Start from right side
          y: Math.random() * (height / 2) + 50, // Random height (upper half of screen)
          frameIndex: 0,
          speed: 3 + Math.random() * 2, // Random speed between 3-5
          width: BAT_FRAME_WIDTH,
          height: BAT_FRAME_HEIGHT,
          waveFactor: Math.random() * 0.5 + 0.5, // Fator de ondulação entre 0.5 e 1
          waveOffset: Math.random() * Math.PI * 2, // Offset aleatório para variar movimento
        };
        batEnemies.current.push(bat);
        lastBatSpawnTime.current = time;
      }
      // Update bat animation timer separately
      batFrameTimer += deltaTime;

      // Update and draw bats
      batEnemies.current = batEnemies.current.filter((bat) => {
        // Update bat position
        bat.x -= bat.speed;

        // Calcular movimento vertical ondulado
        const waveHeight = 8; // Altura máxima da onda (pixels)
        const waveFrequency = 0.01; // Frequência da oscilação
        const verticalOffset = Math.sin(bat.x * waveFrequency + bat.waveOffset) * waveHeight * bat.waveFactor;

        // Update bat animation frame with separate timing
        if (batFrameTimer > BAT_FRAME_DURATION) {
          bat.frameIndex = (bat.frameIndex + 1) % BAT_FRAMES;
        }

        // Draw bat if it's still on screen
        if (bat.x > -BAT_DISPLAY_WIDTH) {
          if (batImages.current[0]?.complete) {
            // Draw the bat with the correct frame
            ctx.save(); // Save the current context state

            // Get the current frame index for this bat
            const currentFrame = bat.frameIndex % BAT_FRAMES;

            // Draw the bat sprite
            ctx.drawImage(
              batImages.current[0],
              currentFrame * BAT_FRAME_WIDTH,
              0,
              BAT_FRAME_WIDTH,
              BAT_FRAME_HEIGHT,
              bat.x,
              bat.y + verticalOffset, // Aplicar movimento ondulado na coordenada Y
              BAT_DISPLAY_WIDTH,
              BAT_DISPLAY_HEIGHT
            );

            ctx.restore(); // Restore the context state
          }
          return true;
        }
        return false; // Remove bat if it's off-screen
      });

      // Reset bat animation timer after updating all bats
      if (batFrameTimer > BAT_FRAME_DURATION) {
        batFrameTimer = 0; // Reset the timer
        // Atualiza todos os frames de uma só vez
        batEnemies.current.forEach((bat) => {
          bat.frameIndex = (bat.frameIndex + 1) % BAT_FRAMES;
        });
      }

      // Draw foreground layers 4-5
      layersRef.current.slice(3).forEach((layer) => {
        if (layer.image.complete) {
          // Move the layer
          layer.x -= layer.speed;

          // Reset position when image goes off screen
          if (layer.x <= -width) {
            layer.x = 0;
          }

          // Draw two copies of the image for seamless scrolling
          ctx.drawImage(layer.image, layer.x, 0, width, height);
          ctx.drawImage(layer.image, layer.x + width, 0, width, height);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        width: "100vw",
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{
          border: "2px solid #000",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

export default GameCanvas;
