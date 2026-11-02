export interface StoryChapter {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  focusFeature: 'genesis' | 'chat' | 'webdev' | 'media' | 'automation' | 'finale';
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  captions: {
    headline: string;
    description: string;
    stat: string;
  };
}

export const VIDEO_DURATION = 30.0; // 30 seconds

export const CHAPTERS: StoryChapter[] = [
  {
    id: 'act-1',
    startTime: 0,
    endTime: 5.0,
    title: 'ACT I: THE AWAKENING',
    subtitle: 'Neural Core Online',
    tagline: 'Orken AI awakens with ultra-low latency cognition',
    badge: 'POWERED BY GROQ LPU™',
    focusFeature: 'genesis',
    camera: {
      position: [0, 0.4, 4.4],
      target: [0, 0, 0],
      fov: 44,
    },
    captions: {
      headline: 'Meet Orken AI',
      description: 'The sentient neural assistant built for instantaneous reasoning and multi-modal empathy.',
      stat: '0.04s First Token Latency',
    },
  },
  {
    id: 'act-2',
    startTime: 5.0,
    endTime: 10.0,
    title: 'ACT II: INTELLIGENT ASSISTANTS',
    subtitle: 'Conversational Hyper-Intelligence',
    tagline: 'Context-aware dialogue across billions of parameters',
    badge: '1,200+ TOKENS / SEC SPEED',
    focusFeature: 'chat',
    camera: {
      position: [-0.9, 0.3, 3.8],
      target: [-0.2, 0.1, 0],
      fov: 42,
    },
    captions: {
      headline: 'Next-Gen Conversational Engine',
      description: 'Zero hesitation dialogue, deep context awareness, and natural voice interaction.',
      stat: 'Groq LPUs • Instant Inference',
    },
  },
  {
    id: 'act-3',
    startTime: 10.0,
    endTime: 15.0,
    title: 'ACT III: AUTONOMOUS WEBSITE DEV',
    subtitle: 'Instant Full-Stack Synthesis',
    tagline: 'From natural thought to deployed modern architecture in seconds',
    badge: 'FULL-STACK SYNTHESIS',
    focusFeature: 'webdev',
    camera: {
      position: [1.2, 0.5, 3.9],
      target: [0.3, 0.2, 0],
      fov: 46,
    },
    captions: {
      headline: 'Autonomous Code & Web Engineering',
      description: 'Generates production React, backend APIs, responsive UIs, and cloud deployments automatically.',
      stat: '100% Autonomous Compilation',
    },
  },
  {
    id: 'act-4',
    startTime: 15.0,
    endTime: 20.0,
    title: 'ACT IV: GENERATIVE VIDEO & VISION',
    subtitle: '4K AI Neural Cinema & Image Creation',
    tagline: 'Synthesizing cinema-grade visuals and photorealistic diffusion art',
    badge: 'NEURAL DIFFUSION & MOTION',
    focusFeature: 'media',
    camera: {
      position: [0, 0.7, 3.7],
      target: [0, 0.2, 0],
      fov: 40,
    },
    captions: {
      headline: 'AI Video Creation & Visual Engines',
      description: 'Real-time motion rendering, 4K visual synthesis, and generative video at cinema scale.',
      stat: '60 FPS Neural Generation',
    },
  },
  {
    id: 'act-5',
    startTime: 20.0,
    endTime: 25.0,
    title: 'ACT V: BUSINESS AUTOMATION',
    subtitle: 'Autonomous Enterprise Orchestration',
    tagline: 'Connecting databases, APIs, workflows, and automated intelligence',
    badge: 'ENTERPRISE WORKFLOW ENGINE',
    focusFeature: 'automation',
    camera: {
      position: [-1.1, 0.4, 4.0],
      target: [0.1, 0, 0],
      fov: 44,
    },
    captions: {
      headline: 'Global Business Automation',
      description: 'Autonomous agents handle customer operations, data workflows, and complex enterprise logic 24/7.',
      stat: '10x Productivity Multiplier',
    },
  },
  {
    id: 'act-6',
    startTime: 25.0,
    endTime: 30.0,
    title: 'FINALE: BEYOND LIMITS',
    subtitle: 'ORKEN AI',
    tagline: 'Intelligence Beyond Limits',
    badge: 'POWERED BY GROQ',
    focusFeature: 'finale',
    camera: {
      position: [0, 0.2, 4.2],
      target: [0, 0, 0],
      fov: 42,
    },
    captions: {
      headline: 'ORKEN AI – Intelligence Beyond Limits',
      description: 'Empowering humanity with sovereign intelligence, speed, and boundless creative capability.',
      stat: 'The Future Starts Now',
    },
  },
];
