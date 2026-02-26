import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// Credit card images
const defaultCardImages = [
  'https://images.squarespace-cdn.com/content/v1/5e29bacbc3249f265aa08f37/ee1a80cd-4e72-4ef3-bf08-89fa94639136/Amex+social.jpg?format=2500w',
  'https://u.cubeupload.com/fearthez/b5achasesapphireprefere.png',
  'https://ck-content.imgix.net/pcm/content/8f4884309e047202f572-4cea87334ad20639f1d9-VentureNew500x315.png?auto=compress,format',
  'https://cdn.wallethub.com/common/product/images/creditcards/500/bank-of-america-cash-rewards-credit-card-1515128c.jpeg',
];

const ASCII_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

function generateCode(width, height) {
  let text = '';
  for (let i = 0; i < width * height; i++) {
    text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }
  let out = '';
  for (let i = 0; i < height; i++) {
    out += text.substring(i * width, (i + 1) * width) + '\n';
  }
  return out;
}

const CARD_W = 400;
const CARD_H = 250;
const ASCII_COLS = Math.floor(CARD_W / 6.5);
const ASCII_ROWS = Math.floor(CARD_H / 13);

export default function ScannerCardStream({
  initialSpeed = 150,
  direction = -1,
  cardImages = defaultCardImages,
  repeat = 6,
  cardGap = 60,
  friction = 0.95,
  scanEffect = 'scramble',
}) {
  const [isScanning, setIsScanning] = useState(false);

  // Ref so animation loop always reads current pause state (no stale closure)
  const isPausedRef = useRef(false);

  const containerRef = useRef(null);
  const cardLineRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);
  const originalAscii = useRef(new Map());

  const cards = useMemo(() => {
    const total = cardImages.length * repeat;
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      image: cardImages[i % cardImages.length],
      ascii: generateCode(ASCII_COLS, ASCII_ROWS),
    }));
  }, [cardImages, repeat]);

  // Stream state stored in a ref so the animation loop reads fresh values
  const stream = useRef({
    position: 0,
    velocity: initialSpeed,
    direction,
    isDragging: false,
    lastMouseX: 0,
    lastTime: performance.now(),
    cardLineWidth: (CARD_W + cardGap) * cards.length,
    friction,
    minVelocity: 30,
  });

  const scannerStateRef = useRef({ isScanning: false });

  useEffect(() => {
    const container = containerRef.current;
    const cardLine = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    if (!container || !cardLine || !particleCanvas || !scannerCanvas) return;

    const W = container.offsetWidth || 1200;
    const H = CARD_H;

    // Pre-cache original ASCII per card
    cards.forEach((card) => originalAscii.current.set(card.id, card.ascii));

    let rafId;

    // ── Three.js particle field ─────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W / 2, W / 2, 125, -125, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    // Radial gradient texture for particles
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 100;
    texCanvas.height = 100;
    const texCtx = texCanvas.getContext('2d');
    const half = 50;
    const grad = texCtx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.025, '#fff7aa');
    grad.addColorStop(0.1, 'hsl(25, 100%, 52%)');
    grad.addColorStop(0.25, 'hsl(5, 90%, 18%)');
    grad.addColorStop(1, 'transparent');
    texCtx.fillStyle = grad;
    texCtx.arc(half, half, half, 0, Math.PI * 2);
    texCtx.fill();
    const texture = new THREE.CanvasTexture(texCanvas);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * W * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * H;
      velocities[i] = Math.random() * 60 + 30;
      alphas[i] = (Math.random() * 8 + 2) / 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 15.0;
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(1.0, 0.42, 0.08, vAlpha) * texture2D(pointTexture, gl_PointCoord);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleMesh = new THREE.Points(geometry, material);
    scene.add(particleMesh);

    // ── 2-D scanner beam canvas ────────────────────────────────────────────
    const ctx2d = scannerCanvas.getContext('2d');
    scannerCanvas.width = W;
    scannerCanvas.height = 300;

    const baseMaxParts = 800;
    const scanMaxParts = 2500;
    let currentMaxParts = baseMaxParts;
    let scannerParts = [];

    const newScanPart = () => ({
      x: W / 2 + (Math.random() - 0.5) * 3,
      y: Math.random() * 300,
      vx: Math.random() * 0.8 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.6,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.005,
      color: `hsl(${Math.floor(Math.random() * 40 + 8)}, 100%, ${Math.floor(Math.random() * 25 + 55)}%)`,
    });
    for (let i = 0; i < baseMaxParts; i++) scannerParts.push(newScanPart());

    // ── ASCII scramble ────────────────────────────────────────────────────
    const runScramble = (element, cardId) => {
      if (element.dataset.scrambling === 'true') return;
      element.dataset.scrambling = 'true';
      const original = originalAscii.current.get(cardId) || '';
      let count = 0;
      const max = 10;
      const timer = setInterval(() => {
        element.textContent = generateCode(ASCII_COLS, ASCII_ROWS);
        count++;
        if (count >= max) {
          clearInterval(timer);
          element.textContent = original;
          delete element.dataset.scrambling;
        }
      }, 30);
    };

    // ── Card clip-path effects relative to scanner line ──────────────────
    const updateCardEffects = () => {
      // Scanner line is at the horizontal center of the container (viewport coords)
      const cRect = container.getBoundingClientRect();
      const scannerX = cRect.left + W / 2;
      const halfBeam = 4;
      const scanLeft = scannerX - halfBeam;
      const scanRight = scannerX + halfBeam;
      let anyScanning = false;

      cardLine.querySelectorAll('.scs-card-wrapper').forEach((wrapper, idx) => {
        const rect = wrapper.getBoundingClientRect();
        const normalEl = wrapper.querySelector('.scs-card-normal');
        const asciiEl = wrapper.querySelector('.scs-card-ascii');
        const preEl = asciiEl?.querySelector('pre');

        if (rect.left < scanRight && rect.right > scanLeft) {
          anyScanning = true;
          if (scanEffect === 'scramble' && wrapper.dataset.scanned !== 'true' && preEl) {
            runScramble(preEl, idx);
          }
          wrapper.dataset.scanned = 'true';
          const iLeft = Math.max(scanLeft - rect.left, 0);
          const iRight = Math.min(scanRight - rect.left, rect.width);
          normalEl?.style.setProperty('--clip-right', `${(iLeft / rect.width) * 100}%`);
          asciiEl?.style.setProperty('--clip-left', `${(iRight / rect.width) * 100}%`);
        } else {
          delete wrapper.dataset.scanned;
          if (rect.right < scanLeft) {
            normalEl?.style.setProperty('--clip-right', '100%');
            asciiEl?.style.setProperty('--clip-left', '100%');
          } else {
            normalEl?.style.setProperty('--clip-right', '0%');
            asciiEl?.style.setProperty('--clip-left', '0%');
          }
        }
      });

      setIsScanning(anyScanning);
      scannerStateRef.current.isScanning = anyScanning;
    };

    // ── Event handlers ────────────────────────────────────────────────────
    const getClientX = (e) =>
      e.touches ? e.touches[0].clientX : e.clientX;

    const handleMouseDown = (e) => {
      stream.current.isDragging = true;
      stream.current.lastMouseX = getClientX(e);
    };

    const handleMouseMove = (e) => {
      if (!stream.current.isDragging) return;
      const x = getClientX(e);
      const delta = x - stream.current.lastMouseX;
      stream.current.position += delta;
      // Estimate velocity from pixel delta (assume ~60fps frame)
      stream.current.velocity = Math.min(Math.abs(delta / 0.016), 800);
      stream.current.direction = delta < 0 ? -1 : 1;
      stream.current.lastMouseX = x;
    };

    const handleMouseUp = () => {
      stream.current.isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      stream.current.velocity = Math.min(Math.abs(e.deltaY) * 2, 500);
      stream.current.direction = e.deltaY > 0 ? -1 : 1;
    };

    cardLine.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    cardLine.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);
    cardLine.addEventListener('wheel', handleWheel, { passive: false });

    // ── Animation loop ────────────────────────────────────────────────────
    const animate = (now) => {
      const dt = (now - stream.current.lastTime) / 1000;
      stream.current.lastTime = now;

      if (!isPausedRef.current && !stream.current.isDragging) {
        if (stream.current.velocity > stream.current.minVelocity) {
          stream.current.velocity *= stream.current.friction;
        }
        stream.current.position +=
          stream.current.velocity * stream.current.direction * dt;
      }

      const cw = container.offsetWidth;
      const { position, cardLineWidth } = stream.current;
      if (position < -cardLineWidth) stream.current.position = cw;
      else if (position > cw) stream.current.position = -cardLineWidth;
      cardLine.style.transform = `translateX(${stream.current.position}px)`;

      updateCardEffects();

      // Three.js particles
      const t = now * 0.001;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i] * 0.016;
        if (positions[i * 3] > W / 2 + 100) positions[i * 3] = -W / 2 - 100;
        positions[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.5;
        alphas[i] = Math.max(0.1, Math.min(1, alphas[i] + (Math.random() - 0.5) * 0.05));
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);

      // 2-D scanner beam
      ctx2d.clearRect(0, 0, W, 300);
      const targetParts = scannerStateRef.current.isScanning ? scanMaxParts : baseMaxParts;
      currentMaxParts += (targetParts - currentMaxParts) * 0.05;
      while (scannerParts.length < currentMaxParts) scannerParts.push(newScanPart());
      while (scannerParts.length > currentMaxParts) scannerParts.pop();

      scannerParts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.x > W) Object.assign(p, newScanPart());
        ctx2d.globalAlpha = p.alpha * p.life;
        ctx2d.fillStyle = p.color;
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx2d.fill();
      });
      ctx2d.globalAlpha = 1;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      cardLine.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cardLine.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      cardLine.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [cards, cardGap, friction, scanEffect]);

  return (
    <div ref={containerRef} className="relative w-full h-[260px] overflow-hidden">
      {/* Keyframe styles injected inline — no styled-jsx needed */}
      <style>{`
        @keyframes t2g-glitch {
          0%, 16%, 50%, 100% { opacity: 1; }
          15%, 99% { opacity: 0.9; }
          49% { opacity: 0.8; }
        }
        .scs-glitch { animation: t2g-glitch 0.1s infinite linear alternate-reverse; }

        @keyframes t2g-scan-pulse {
          0%   { opacity: 0.75; transform: translateX(-50%) translateY(-50%) scaleY(1); }
          100% { opacity: 1;    transform: translateX(-50%) translateY(-50%) scaleY(1.03); }
        }
        .scs-scan-pulse {
          animation: t2g-scan-pulse 1.5s infinite alternate ease-in-out;
        }
      `}</style>

      {/* Three.js particle field */}
      <canvas
        ref={particleCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none"
      />

      {/* 2-D scanner beam */}
      <canvas
        ref={scannerCanvasRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none"
      />

      {/* Scanner line — T2G teal glow */}
      <div
        className={`scs-scan-pulse absolute top-1/2 left-1/2 h-[280px] w-px rounded-full z-20 pointer-events-none transition-opacity duration-300 ${
          isScanning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, transparent, #FF6B1A, transparent)',
          boxShadow: '0 0 10px #FF6B1A, 0 0 22px #FF4500, 0 0 40px #CC2200, 0 0 60px rgba(255,107,26,0.3)',
        }}
      />

      {/* Left / right fades — blend into the navy section background */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-t2g-navy to-transparent z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-t2g-navy to-transparent z-30 pointer-events-none" />

      {/* Card stream */}
      <div className="absolute inset-0 flex items-center">
        <div
          ref={cardLineRef}
          className="flex items-center whitespace-nowrap cursor-grab active:cursor-grabbing select-none will-change-transform"
          style={{ gap: `${cardGap}px` }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="scs-card-wrapper relative shrink-0"
              style={{ width: CARD_W, height: CARD_H }}
            >
              {/* Normal photo layer — clipped from right as scanner approaches */}
              <div
                className="scs-card-normal absolute inset-0 rounded-[15px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-[2]"
                style={{ clipPath: 'inset(0 0 0 var(--clip-right,0%))' }}
              >
                <img
                  src={card.image}
                  alt="T2G furnished property"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-[15px] brightness-110 contrast-110 hover:brightness-125 transition-all duration-300"
                />
              </div>

              {/* ASCII layer — revealed from left as scanner passes */}
              <div
                className="scs-card-ascii absolute inset-0 rounded-[15px] overflow-hidden z-[1]"
                style={{ clipPath: 'inset(0 calc(100% - var(--clip-left,0%)) 0 0)' }}
              >
                <pre
                  className="scs-glitch absolute inset-0 m-0 p-0 font-mono text-[11px] leading-[13px] overflow-hidden whitespace-pre text-left"
                  style={{
                    color: 'rgba(100, 220, 200, 0.65)',
                    WebkitMaskImage:
                      'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%)',
                    maskImage:
                      'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%)',
                  }}
                >
                  {card.ascii}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
