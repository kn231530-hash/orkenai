/**
 * Generates and updates a dynamic 2D canvas texture for the Orken AI robot's face visor.
 * Renders glowing electric blue smiling eyes (`⌒ ⌒`), blinking, looking around,
 * and audio-reactive glow.
 */
import * as THREE from 'three';

export interface FaceState {
  blinkProgress: number; // 0 = open, 1 = closed
  lookX: number; // -1 to 1
  lookY: number; // -1 to 1
  glowIntensity: number; // 0 to 1
  isTalking: boolean;
  eyeShape: 'smile' | 'wide' | 'focused' | 'wink';
}

export class FaceTextureManager {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;

  private state: FaceState = {
    blinkProgress: 0,
    lookX: 0,
    lookY: 0,
    glowIntensity: 0.8,
    isTalking: false,
    eyeShape: 'smile',
  };

  private nextBlinkTime: number = 2.0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d')!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.render();
  }

  public update(time: number, audioLevel: number, cameraLookX = 0, cameraLookY = 0) {
    // Handle blinking
    if (time > this.nextBlinkTime) {
      this.state.blinkProgress = Math.min(1, this.state.blinkProgress + 0.25);
      if (this.state.blinkProgress >= 1) {
        this.nextBlinkTime = time + 2.5 + Math.random() * 2.5;
        this.state.blinkProgress = 0;
      }
    } else {
      this.state.blinkProgress = Math.max(0, this.state.blinkProgress - 0.2);
    }

    // Audio-reactive glow
    this.state.glowIntensity = 0.75 + audioLevel * 0.5 + Math.sin(time * 3) * 0.1;
    this.state.lookX = THREE.MathUtils.lerp(this.state.lookX, cameraLookX * 0.4, 0.1);
    this.state.lookY = THREE.MathUtils.lerp(this.state.lookY, cameraLookY * 0.3, 0.1);

    this.render();
    this.texture.needsUpdate = true;
  }

  public setEyeShape(shape: 'smile' | 'wide' | 'focused' | 'wink') {
    this.state.eyeShape = shape;
  }

  private render() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // Dark glossy visor background
    ctx.fillStyle = '#050a18';
    ctx.fillRect(0, 0, w, h);

    // Subtle radial visor sheen
    const visorGradient = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.5, w * 0.5);
    visorGradient.addColorStop(0, 'rgba(10, 26, 60, 0.6)');
    visorGradient.addColorStop(1, 'rgba(2, 6, 18, 0.95)');
    ctx.fillStyle = visorGradient;
    ctx.fillRect(0, 0, w, h);

    // Specular gloss reflection at top-right (matching the original artwork)
    const specGrad = ctx.createRadialGradient(w * 0.68, h * 0.28, 5, w * 0.68, h * 0.28, 80);
    specGrad.addColorStop(0, 'rgba(120, 220, 255, 0.35)');
    specGrad.addColorStop(0.5, 'rgba(60, 160, 255, 0.1)');
    specGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.arc(w * 0.68, h * 0.28, 80, 0, Math.PI * 2);
    ctx.fill();

    // Eye positioning
    const eyeSpacing = 82;
    const eyeY = h * 0.52 + this.state.lookY * 20;
    const leftEyeX = w * 0.5 - eyeSpacing + this.state.lookX * 25;
    const rightEyeX = w * 0.5 + eyeSpacing + this.state.lookX * 25;

    const scaleY = Math.max(0.05, 1 - this.state.blinkProgress);

    this.drawGlowingEye(leftEyeX, eyeY, scaleY, false);
    this.drawGlowingEye(rightEyeX, eyeY, scaleY, this.state.eyeShape === 'wink');
  }

  private drawGlowingEye(x: number, y: number, scaleY: number, isWink: boolean) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, isWink ? 0.15 : scaleY);

    // Glowing cyan/electric blue halo
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 24 * this.state.glowIntensity;

    ctx.strokeStyle = '#60e6ff';
    ctx.fillStyle = '#60e6ff';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';

    // The iconic crescent smiling eye from the original image: `⌒`
    ctx.beginPath();
    const radius = 34;
    // Draw an upward curved crescent arch
    ctx.arc(0, 12, radius, Math.PI * 1.15, Math.PI * 1.85, false);
    ctx.stroke();

    // Inner bright white-cyan core
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 12, radius, Math.PI * 1.2, Math.PI * 1.8, false);
    ctx.stroke();

    ctx.restore();
  }

  public dispose() {
    this.texture.dispose();
  }
}
