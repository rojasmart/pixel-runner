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
import hurtSprite0 from "../../public/assets/characters/bunny/adventurer-hurt-00.png";
import hurtSprite1 from "../../public/assets/characters/bunny/adventurer-hurt-01.png";
import hurtSprite2 from "../../public/assets/characters/bunny/adventurer-hurt-02.png";

// ...existing imports...
import attackSprite0 from "../../public/assets/characters/bunny/adventurer-attack3-00.png";
import attackSprite1 from "../../public/assets/characters/bunny/adventurer-attack3-01.png";
import attackSprite2 from "../../public/assets/characters/bunny/adventurer-attack3-02.png";
import attackSprite3 from "../../public/assets/characters/bunny/adventurer-attack3-03.png";
import attackSprite4 from "../../public/assets/characters/bunny/adventurer-attack3-04.png";
import attackSprite5 from "../../public/assets/characters/bunny/adventurer-attack3-05.png";

//Enemy sprites
import batSprite from "../../public/assets/characters/bat/Bat-IdleFly.png";
import batDieSprite from "../../public/assets/characters/bat/Bat-Die.png";

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
  isDying: boolean; // Flag para indicar se está morrendo
  deathFrame: number; // Frame atual da animação de morte
}

interface GameState {
  score: number;
  highScore: number;
  health: number; // Vida atual do jogador
  maxHealth: number; // Vida máxima do jogador
  invincibleTime: number; // Tempo de invencibilidade após levar dano
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
  const batDieImage = useRef<HTMLImageElement | null>(null); // Referência para sprite de morte
  const lastBatSpawnTime = useRef<number>(0);
  const hurtImages = useRef<HTMLImageElement[]>([]);

  const hurtState = useRef({
    isHurt: false,
    hurtFrame: 0,
    hurtDuration: 30, // Duração da animação de dano em frames
    lastHurtTime: 0, // Último momento em que o jogador levou dano
  });

  // Adicionar com as outras referências
  const gameState = useRef<GameState>({
    score: 0,
    highScore: 0,
    health: 100, // Vida inicial
    maxHealth: 100, // Vida máxima
    invincibleTime: 1000, // Invencível por 1 segundo após dano
  });

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

    // Load bat death sprite
    const batDieImg = new Image();
    batDieImg.src = batDieSprite;
    batDieImage.current = batDieImg;

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

    // Configuração da animação de morte do morcego
    const BAT_DIE_FRAMES = 5; // Número de frames na sprite de morte
    const BAT_DIE_FRAME_DURATION = 120; // Duração de cada frame de morte

    // Track bat animation timing separately from bunny animation
    let batFrameTimer = 0;
    let batDieFrameTimer = 0;

    // Load hurt sprites
    const hurtSprites = [hurtSprite0, hurtSprite1, hurtSprite2];
    hurtImages.current = hurtSprites.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

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

      // Verificar colisão entre personagem e morcegos
      const characterX = movementState.current.positionX;
      const characterY = jumpState.current.jumpY;
      const characterWidth = FRAME_WIDTH * 2;
      const characterHeight = FRAME_HEIGHT * 2;

      // Verificar se o tempo de invencibilidade passou
      const isInvincible = time - hurtState.current.lastHurtTime < gameState.current.invincibleTime;

      // Verificar colisão com morcegos apenas se não estiver invencível
      if (!isInvincible && !hurtState.current.isHurt) {
        batEnemies.current.forEach((bat) => {
          // Ignorar morcegos mortos
          if (bat.isDying) return;

          // Verificar colisão entre personagem e morcego
          if (
            characterX < bat.x + BAT_DISPLAY_WIDTH * 0.6 &&
            characterX + characterWidth * 0.6 > bat.x &&
            characterY < bat.y + BAT_DISPLAY_HEIGHT * 0.6 &&
            characterY + characterHeight * 0.6 > bat.y
          ) {
            // Colisão detectada - jogador leva dano
            hurtState.current.isHurt = true;
            hurtState.current.hurtFrame = 0;
            hurtState.current.lastHurtTime = time;

            // Reduzir pontos e vida
            gameState.current.score = Math.max(0, gameState.current.score - 50);
            gameState.current.health = Math.max(0, gameState.current.health - 20);
          }
        });
      }
      if (hurtState.current.isHurt) {
        // Animação de dano
        const hurtProgress = Math.min(hurtState.current.hurtFrame / hurtState.current.hurtDuration, 1);
        const hurtIndex = Math.min(Math.floor(hurtProgress * 3), 2);

        if (hurtImages.current[hurtIndex]?.complete) {
          ctx.drawImage(
            hurtImages.current[hurtIndex],
            0,
            0,
            FRAME_WIDTH,
            FRAME_HEIGHT,
            movementState.current.positionX,
            jumpState.current.jumpY,
            FRAME_WIDTH * 2,
            FRAME_HEIGHT * 2
          );
        }

        hurtState.current.hurtFrame += 1;

        // Fim da animação de dano
        if (hurtProgress >= 1) {
          hurtState.current.isHurt = false;
        }

        // Criar efeito visual de pulsação/flash durante invencibilidade
        if (isInvincible && Math.floor(time / 100) % 2 === 0) {
          ctx.globalAlpha = 0.7; // Tornar personagem semi-transparente
        }
      }

      // Draw character
      else if (attackState.current.isAttacking) {
        // Calculate attack animation frame
        const attackProgress = Math.min(attackState.current.attackFrame / 18, 1);
        const attackIndex = Math.min(Math.floor(attackProgress * 6), 5);

        // Área de ataque (à frente do personagem)
        const attackAreaX = movementState.current.positionX + FRAME_WIDTH;
        const attackAreaWidth = FRAME_WIDTH * 2;
        const attackAreaY = jumpState.current.jumpY;
        const attackAreaHeight = FRAME_HEIGHT * 2;

        // Verificar colisão com morcegos - ADICIONA AQUI DENTRO
        batEnemies.current.forEach((bat) => {
          if (
            !bat.isDying && // Verificar apenas morcegos vivos
            bat.x < attackAreaX + attackAreaWidth &&
            bat.x + BAT_DISPLAY_WIDTH > attackAreaX &&
            bat.y < attackAreaY + attackAreaHeight &&
            bat.y + BAT_DISPLAY_HEIGHT > attackAreaY
          ) {
            // Colisão detectada, iniciar animação de morte
            bat.isDying = true;
            bat.deathFrame = 0;
            // Adicionar pontuação quando matar um morcego
            gameState.current.score += 100;

            // Atualizar high score se necessário
            if (gameState.current.score > gameState.current.highScore) {
              gameState.current.highScore = gameState.current.score;
              localStorage.setItem("pixelRunnerHighScore", gameState.current.highScore.toString());
            }
          }
        });

        if (attackImages.current[attackIndex]?.complete) {
          ctx.drawImage(
            attackImages.current[attackIndex],
            0,
            0,
            FRAME_WIDTH,
            FRAME_HEIGHT,
            movementState.current.positionX,
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

      // Adicionar depois de desenhar todas as camadas, antes do requestAnimationFrame
      // Renderizar pontuação na tela
      ctx.font = "20px 'Press Start 2P', cursive"; // Use uma fonte pixel art se possível
      ctx.fillStyle = "#FFFFFF"; // Cor branca para o texto
      ctx.strokeStyle = "#000000"; // Contorno preto para melhor visibilidade

      // Desenhar sombra para melhor contraste
      ctx.fillStyle = "#000000";
      ctx.fillText(`Score: ${gameState.current.score}`, 12, 32);
      ctx.fillText(`High Score: ${gameState.current.highScore}`, 12, 62);

      // Desenhar texto principal
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`Score: ${gameState.current.score}`, 10, 30);
      ctx.fillText(`High Score: ${gameState.current.highScore}`, 10, 60);

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
      batDieFrameTimer += deltaTime;

      // Update and draw bats

      batEnemies.current = batEnemies.current.filter((bat) => {
        // Morcegos morrendo têm velocidade reduzida
        if (!bat.isDying) {
          bat.x -= bat.speed;

          // Calcular movimento vertical ondulado para morcegos vivos
          const waveHeight = 8;
          const waveFrequency = 0.01;
          const verticalOffset = Math.sin(bat.x * waveFrequency + bat.waveOffset) * waveHeight * bat.waveFactor;

          // Update animation frame for living bats
          if (batFrameTimer > BAT_FRAME_DURATION) {
            bat.frameIndex = (bat.frameIndex + 1) % BAT_FRAMES;
          }

          // Draw living bat
          if (bat.x > -BAT_DISPLAY_WIDTH) {
            if (batImages.current[0]?.complete) {
              // Draw the bat with the correct frame
              ctx.save();

              const currentFrame = bat.frameIndex % BAT_FRAMES;

              ctx.drawImage(
                batImages.current[0],
                currentFrame * BAT_FRAME_WIDTH,
                0,
                BAT_FRAME_WIDTH,
                BAT_FRAME_HEIGHT,
                bat.x,
                bat.y + verticalOffset,
                BAT_DISPLAY_WIDTH,
                BAT_DISPLAY_HEIGHT
              );

              ctx.restore();
            }
            return true;
          }
          return false;
        } else {
          // Animação de morte
          if (batDieFrameTimer > BAT_DIE_FRAME_DURATION) {
            bat.deathFrame++;
          }

          // Desenhar animação de morte
          if (bat.deathFrame < BAT_DIE_FRAMES) {
            if (batDieImage.current?.complete) {
              ctx.save();

              ctx.drawImage(
                batDieImage.current,
                bat.deathFrame * BAT_FRAME_WIDTH,
                0,
                BAT_FRAME_WIDTH,
                BAT_FRAME_HEIGHT,
                bat.x,
                bat.y,
                BAT_DISPLAY_WIDTH,
                BAT_DISPLAY_HEIGHT
              );

              ctx.restore();
            }
            return true; // Manter o morcego na lista até terminar a animação
          }
          return false; // Remover o morcego após animação de morte concluída
        }
      });

      // Reset bat animation timer after updating all bats
      if (batFrameTimer > BAT_FRAME_DURATION) {
        batFrameTimer = 0; // Reset the timer
        // Atualiza todos os frames de uma só vez
        batEnemies.current.forEach((bat) => {
          bat.frameIndex = (bat.frameIndex + 1) % BAT_FRAMES;
        });
      }

      if (batDieFrameTimer > BAT_DIE_FRAME_DURATION) {
        batDieFrameTimer = 0;
      }

      if (time - lastBatSpawnTime.current > BAT_SPAWN_INTERVAL) {
        const bat: Bat = {
          x: width,
          y: Math.random() * (height / 2) + 50,
          frameIndex: 0,
          speed: 3 + Math.random() * 2,
          width: BAT_FRAME_WIDTH,
          height: BAT_FRAME_HEIGHT,
          waveFactor: Math.random() * 0.5 + 0.5,
          waveOffset: Math.random() * Math.PI * 2,
          isDying: false, // Inicialmente não está morrendo
          deathFrame: 0, // Frame inicial da animação de morte
        };
        batEnemies.current.push(bat);
        lastBatSpawnTime.current = time;
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

      ctx.globalAlpha = 1; // Reset alpha for next drawing

      // 1. Fundo da barra (cinza)
      ctx.fillStyle = "#444444";
      ctx.fillRect(10, 80, 200, 20);

      // 2. Barra de vida atual (verde ou amarela ou vermelha dependendo da quantidade)
      const healthPercentage = gameState.current.health / gameState.current.maxHealth;

      // Determinar cor baseado na vida restante
      if (healthPercentage > 0.6) {
        ctx.fillStyle = "#22CC22"; // Verde
      } else if (healthPercentage > 0.3) {
        ctx.fillStyle = "#CCCC22"; // Amarelo
      } else {
        ctx.fillStyle = "#CC2222"; // Vermelho
      }

      ctx.fillRect(10, 80, 200 * healthPercentage, 20);

      // 3. Borda da barra (preto)
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 80, 200, 20);

      // 4. Texto "HEALTH"
      ctx.font = "12px 'Press Start 2P', cursive";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("HEALTH", 15, 95);

      // Game Over se a vida chegar a zero
      if (gameState.current.health <= 0) {
        ctx.font = "36px 'Press Start 2P', cursive";
        ctx.fillStyle = "#CC0000";
        ctx.fillText("GAME OVER", width / 2 - 130, height / 2);

        ctx.font = "18px 'Press Start 2P', cursive";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Press SPACE to restart", width / 2 - 150, height / 2 + 40);

        // Parar o jogo aqui, ou implementar reinício
        // cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Carregar o high score salvo quando o componente for montado
  useEffect(() => {
    const savedHighScore = localStorage.getItem("pixelRunnerHighScore");
    if (savedHighScore) {
      gameState.current.highScore = parseInt(savedHighScore, 10);
    }
  }, []);

  // Adicionar uma função para reiniciar o jogo quando pressionar espaço após game over
  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState.current.health <= 0) {
        // Resetar o jogo
        gameState.current.health = gameState.current.maxHealth;
        gameState.current.score = 0;
        batEnemies.current = []; // Remover todos os morcegos
      }
    };

    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
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
