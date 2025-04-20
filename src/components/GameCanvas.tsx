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

interface Layer {
  image: HTMLImageElement;
  x: number;
  speed: number;
}

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bunnyImage = useRef<HTMLImageElement | null>(null);
  const jumpImages = useRef<HTMLImageElement[]>([]);
  const layersRef = useRef<Layer[]>([]);

  // Add jump state variables
  const jumpState = useRef({
    isJumping: false,
    jumpFrame: 0,
    jumpY: 0,
    initialY: 0,
    jumpHeight: 150,
    jumpSpeed: 8,
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
    };

    window.addEventListener("keydown", handleKeyPress);

    // Load bunny sprite
    const bunny = new Image();
    bunny.src = bunnySprite;
    bunnyImage.current = bunny;

    let lastTime = performance.now();
    let animationFrameId: number;

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

      // Update bunny animation
      frameTimer += deltaTime;
      if (frameTimer > FRAME_DURATION) {
        frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
        frameTimer = 0;
      }

      // Draw bunny with jumping or running animation
      if (jumpState.current.isJumping) {
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
            bunnyX,
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
            bunnyX,
            jumpState.current.jumpY,
            FRAME_WIDTH * 2,
            FRAME_HEIGHT * 2
          );
        }
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
      window.removeEventListener("keydown", handleKeyPress);
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
