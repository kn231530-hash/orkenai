import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FaceTextureManager } from '../utils/faceTexture';
import { CHAPTERS, StoryChapter } from '../types/video';

interface OrkenHeroSceneProps {
  currentTime: number;
  currentChapter: StoryChapter;
  isCinematicCam: boolean;
  audioLevel: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onOrbClick?: () => void;
}

export const OrkenHeroScene: React.FC<OrkenHeroSceneProps> = ({
  currentTime,
  currentChapter,
  isCinematicCam,
  audioLevel,
  onCanvasReady,
  onOrbClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for animation state
  const stateRef = useRef({
    currentTime,
    currentChapter,
    isCinematicCam,
    audioLevel,
    isInteracting: false,
    mousePos: { x: 0, y: 0 },
    orbitAngles: { yaw: 0, pitch: 0 },
  });

  stateRef.current.currentTime = currentTime;
  stateRef.current.currentChapter = currentChapter;
  stateRef.current.isCinematicCam = isCinematicCam;
  stateRef.current.audioLevel = audioLevel;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: true, // For canvas recording and screenshots
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;
    if (onCanvasReady) {
      onCanvasReady(renderer.domElement);
    }

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020716, 0.08);

    const camera = new THREE.PerspectiveCamera(44, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    // Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x081b3a, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x020612, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x0066ff, 4.5, 12);
    rimLight.position.set(-2, 1, -2);
    scene.add(rimLight);

    const floorLight = new THREE.PointLight(0x00e5ff, 3.5, 6);
    floorLight.position.set(0, -0.8, 0);
    scene.add(floorLight);

    // ==========================================
    // 1. THE 3D ROBOT ORB (HERO)
    // ==========================================
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Faceplate manager with dynamic smiling eyes texture
    const faceManager = new FaceTextureManager();

    // Visor Sphere (Dark glossy inner shell with smiling eyes texture)
    const visorGeo = new THREE.SphereGeometry(0.78, 48, 48);
    const visorMat = new THREE.MeshPhysicalMaterial({
      map: faceManager.texture,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0x0044aa),
      emissiveMap: faceManager.texture,
      emissiveIntensity: 0.45,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    robotGroup.add(visorMesh);

    // Outer Translucent Glass Plasma Shell
    const glassGeo = new THREE.SphereGeometry(0.85, 48, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      roughness: 0.05,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.7,
      ior: 1.45,
      reflectivity: 0.9,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    robotGroup.add(glassMesh);

    // Orbital Plasma Ring 1 (tilted ~25 degrees, matching the image)
    const ring1Geo = new THREE.TorusGeometry(1.15, 0.045, 24, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d2ff,
      emissiveIntensity: 2.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI * 0.42;
    ring1Mesh.rotation.y = 0.28;
    robotGroup.add(ring1Mesh);

    // Orbital Plasma Ring 2 (outer counter-swirl)
    const ring2Geo = new THREE.TorusGeometry(1.3, 0.03, 24, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.8,
      roughness: 0.3,
      metalness: 0.7,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI * 0.38;
    ring2Mesh.rotation.z = 0.35;
    robotGroup.add(ring2Mesh);

    // Outer plasma swirl ribbons (curved tube geometry)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, -0.3, 0.4),
      new THREE.Vector3(-0.8, 0.6, 0.7),
      new THREE.Vector3(0.5, 0.8, 0.2),
      new THREE.Vector3(1.0, 0.1, -0.5),
      new THREE.Vector3(0.3, -0.7, -0.6),
      new THREE.Vector3(-0.9, -0.4, 0.2),
    ], true);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 80, 0.025, 12, true);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x00e5ff,
      emissiveIntensity: 2.2,
      roughness: 0.25,
      metalness: 0.8,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    robotGroup.add(ribbonMesh);

    // ==========================================
    // 2. FLOOR & CONCENTRIC HOLOGRAPHIC RIPPLES
    // ==========================================
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.15,
      metalness: 0.85,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.25;
    scene.add(floorMesh);

    // Concentric holographic floor rings
    const floorRingsGroup = new THREE.Group();
    floorRingsGroup.position.y = -1.23;
    scene.add(floorRingsGroup);

    const ringRadii = [0.65, 1.05, 1.5, 2.05, 2.7];
    const floorRingMeshes: THREE.Mesh[] = [];
    ringRadii.forEach((rad, idx) => {
      const ringG = new THREE.RingGeometry(rad - 0.015, rad + 0.015, 64);
      const ringM = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00f0ff : 0x0284c7,
        transparent: true,
        opacity: 0.4 - idx * 0.06,
        side: THREE.DoubleSide,
      });
      const ringMsh = new THREE.Mesh(ringG, ringM);
      ringMsh.rotation.x = -Math.PI / 2;
      floorRingsGroup.add(ringMsh);
      floorRingMeshes.push(ringMsh);
    });

    // Radial floor light flare
    const flareGeo = new THREE.CircleGeometry(0.8, 32);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5,
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    flareMesh.rotation.x = -Math.PI / 2;
    flareMesh.position.y = -1.24;
    scene.add(flareMesh);

    // ==========================================
    // 3. BACKGROUND PARTICLES & CYBER FIELD
    // ==========================================
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.2) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.004;
      particleVelocities[i * 3 + 1] = Math.random() * 0.008 + 0.002;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ==========================================
    // 4. DYNAMIC 3D HOLOGRAPHIC PROJECTION RIGS
    // ==========================================
    const hologramsGroup = new THREE.Group();
    scene.add(hologramsGroup);

    // Helper to create holographic glowing wireframes
    // Hologram Act 2: Neural Synapse Cluster (Conversational Intelligence)
    const neuralGroup = new THREE.Group();
    neuralGroup.position.set(1.5, 0.4, -0.5);
    const nodeCount = 18;
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    for (let i = 0; i < nodeCount; i++) {
      const nm = new THREE.Mesh(nodeGeo, nodeMat);
      nm.position.set((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.2);
      neuralGroup.add(nm);
      nodes.push(nm);
    }

    // Connect some lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45 });
    for (let i = 0; i < nodeCount; i += 2) {
      if (i + 1 < nodeCount) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          nodes[i].position,
          nodes[i + 1].position,
        ]);
        const line = new THREE.Line(lineGeo, lineMat);
        neuralGroup.add(line);
      }
    }
    hologramsGroup.add(neuralGroup);

    // Hologram Act 3: Autonomous Web Dev Wireframe Panel
    const webdevGroup = new THREE.Group();
    webdevGroup.position.set(-1.6, 0.5, -0.2);
    const windowFrameGeo = new THREE.BoxGeometry(1.8, 1.2, 0.02);
    const windowFrameMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    webdevGroup.add(windowFrame);

    // Floating UI code bars inside
    for (let i = 0; i < 5; i++) {
      const barG = new THREE.BoxGeometry(1.4 - (i % 3) * 0.3, 0.05, 0.01);
      const barM = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
      const bar = new THREE.Mesh(barG, barM);
      bar.position.set(-0.1 + (i % 2) * 0.1, 0.35 - i * 0.16, 0.01);
      webdevGroup.add(bar);
    }
    hologramsGroup.add(webdevGroup);

    // Hologram Act 4: Generative Video Filmstrip & Image Beam
    const mediaGroup = new THREE.Group();
    mediaGroup.position.set(0, 1.4, -0.8);
    for (let i = -2; i <= 2; i++) {
      const frameGeo = new THREE.PlaneGeometry(0.65, 0.45);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(i * 0.8, Math.sin(i) * 0.15, 0);
      mediaGroup.add(frame);
    }
    hologramsGroup.add(mediaGroup);

    // Hologram Act 5: Enterprise Automation Grid
    const automationGroup = new THREE.Group();
    automationGroup.position.set(1.4, -0.1, 0.2);
    const autoGrid = new THREE.GridHelper(2, 6, 0x00f0ff, 0x0284c7);
    autoGrid.rotation.x = 0.4;
    automationGroup.add(autoGrid);
    hologramsGroup.add(automationGroup);

    // Grand Finale Shockwave Ring (Act 6)
    const shockwaveGeo = new THREE.RingGeometry(0.8, 1.0, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, 0, 0);
    scene.add(shockwaveMesh);

    // ==========================================
    // INTERACTION HANDLING (MOUSE / TOUCH)
    // ==========================================
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mousePos = { x: normX, y: normY };

      if (isDragging && !stateRef.current.isCinematicCam) {
        const deltaX = clientX - prevMouse.x;
        const deltaY = clientY - prevMouse.y;
        prevMouse = { x: clientX, y: clientY };

        stateRef.current.orbitAngles.yaw -= deltaX * 0.008;
        stateRef.current.orbitAngles.pitch = Math.max(
          -0.5,
          Math.min(0.6, stateRef.current.orbitAngles.pitch - deltaY * 0.008)
        );
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(visorMesh, true);
      if (intersects.length > 0) {
        faceManager.setEyeShape('wink');
        setTimeout(() => faceManager.setEyeShape('smile'), 800);
        if (onOrbClick) onOrbClick();
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    domElement.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('touchstart', handlePointerDown);
    domElement.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    domElement.addEventListener('click', handleClick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // ==========================================
    // ANIMATION TICK LOOP
    // ==========================================
    let frameId = 0;
    const clock = new THREE.Clock();

    // Smooth camera damping vectors
    const targetCamPos = new THREE.Vector3(0, 0.4, 4.4);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const { currentTime: vidTime, currentChapter: ch, isCinematicCam: cine, audioLevel: aud, mousePos, orbitAngles } = stateRef.current;

      // 1. Robot floating physics
      const floatY = Math.sin(time * 2.2) * 0.07;
      const floatTiltX = Math.sin(time * 1.5) * 0.05;
      const floatTiltZ = Math.cos(time * 1.8) * 0.04;
      robotGroup.position.y = floatY;
      robotGroup.rotation.x = floatTiltX;
      robotGroup.rotation.z = floatTiltZ;

      // 2. Orbital Plasma Rings rotation
      ring1Mesh.rotation.z += delta * 1.1;
      ring2Mesh.rotation.y += delta * 0.9;
      ribbonMesh.rotation.y -= delta * 0.6;
      ribbonMesh.rotation.x = Math.sin(time * 0.8) * 0.2;

      // 3. Update face visor (smiling eyes, blink, track, voice pulse)
      faceManager.update(vidTime, aud, mousePos.x, mousePos.y);

      // 4. Floor ring ripple dynamics
      floorRingMeshes.forEach((mesh, idx) => {
        const ringTime = time * 0.8 + idx * 0.5;
        const scale = 1.0 + Math.sin(ringTime) * 0.03;
        mesh.scale.set(scale, scale, 1);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(ringTime * 2) * 0.15 + aud * 0.2;
      });

      // 5. Update background particle float
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleVelocities[i * 3 + 1];
        if (posArray[i * 3 + 1] > 6) {
          posArray[i * 3 + 1] = -2;
        }
      }
      posAttr.needsUpdate = true;

      // 6. Act-based holographic visibility & transitions
      const act = ch.focusFeature;

      // Neural hologram (Act 2)
      neuralGroup.visible = act === 'chat';
      if (neuralGroup.visible) {
        neuralGroup.rotation.y += delta * 0.5;
        neuralGroup.position.y = 0.3 + Math.sin(time * 3) * 0.05;
      }

      // Web dev hologram (Act 3)
      webdevGroup.visible = act === 'webdev';
      if (webdevGroup.visible) {
        webdevGroup.rotation.y = 0.25 + Math.sin(time * 2) * 0.08;
      }

      // Media filmstrip hologram (Act 4)
      mediaGroup.visible = act === 'media';
      if (mediaGroup.visible) {
        mediaGroup.position.x = Math.sin(time * 1.2) * 0.1;
      }

      // Enterprise automation hologram (Act 5)
      automationGroup.visible = act === 'automation';
      if (automationGroup.visible) {
        automationGroup.rotation.z += delta * 0.4;
      }

      // Act 6 Finale Shockwave
      if (act === 'finale') {
        const finaleProgress = (vidTime - 25.0) / 5.0; // 0 to 1
        const waveScale = 1.0 + finaleProgress * 3.5;
        shockwaveMesh.scale.set(waveScale, waveScale, 1);
        shockwaveMat.opacity = Math.max(0, (1 - finaleProgress) * 0.8);
        shockwaveMesh.visible = shockwaveMat.opacity > 0.01;

        // Radiant glow burst
        visorMat.emissiveIntensity = 0.8 + Math.sin(time * 10) * 0.4;
        ring1Mat.emissiveIntensity = 4.0;
      } else {
        shockwaveMesh.visible = false;
        visorMat.emissiveIntensity = 0.45;
        ring1Mat.emissiveIntensity = 2.5;
      }

      // 7. Camera Choreography
      if (cine) {
        // Scripted cinematic camera for current chapter
        const [cx, cy, cz] = ch.camera.position;
        const [tx, ty, tz] = ch.camera.target;

        // Subtle handheld organic breathing motion
        const breatheX = Math.sin(time * 0.9) * 0.06;
        const breatheY = Math.cos(time * 0.7) * 0.04;

        targetCamPos.set(cx + breatheX, cy + breatheY, cz);
        targetLookAt.set(tx, ty, tz);

        camera.position.lerp(targetCamPos, 0.05);
        currentLookAt.lerp(targetLookAt, 0.05);
        camera.lookAt(currentLookAt);
        camera.fov = THREE.MathUtils.lerp(camera.fov, ch.camera.fov, 0.05);
        camera.updateProjectionMatrix();
      } else {
        // Free user inspection orbit mode
        const radius = 4.2;
        const cy = Math.sin(orbitAngles.pitch) * radius + 0.3;
        const cx = Math.sin(orbitAngles.yaw) * Math.cos(orbitAngles.pitch) * radius;
        const cz = Math.cos(orbitAngles.yaw) * Math.cos(orbitAngles.pitch) * radius;

        targetCamPos.set(cx, cy, cz);
        camera.position.lerp(targetCamPos, 0.1);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      domElement.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      domElement.removeEventListener('click', handleClick);

      faceManager.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onCanvasReady, onOrbClick]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
};
