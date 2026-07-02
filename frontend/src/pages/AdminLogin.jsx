import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as THREE from 'three';

// ─────────────────────────────────────
// 3D Animated Scene Component
// ─────────────────────────────────────
const TechScene3D = () => {
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const groupRefs = useRef({
    central: null,
    rings: [],
    orbiters: [],
    particles: null,
  });

  const setupScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Scene ──────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── Camera ─────────────────────────
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 30);
    camera.position.set(0, 0.5, 11);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── Renderer ───────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lighting ───────────────────────
    const ambient = new THREE.AmbientLight(0x334466, 0.7);
    scene.add(ambient);

    const pointLight1 = new THREE.PointLight(0x0055ff, 1.2, 18);
    pointLight1.position.set(4, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4488ff, 0.7, 14);
    pointLight2.position.set(-4, -2, -3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x88bbff, 0.5, 10);
    pointLight3.position.set(0, 4, -4);
    scene.add(pointLight3);

    // ── Main Group ─────────────────────
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── Central Icosahedron (wireframe) ──
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x88bbff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    mainGroup.add(icoMesh);

    // Inner solid core
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x001133,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    groupRefs.current.central = { ico: icoMesh, core: coreMesh };

    // ── Orbital Rings ──────────────────
    const ringConfigs = [
      { radius: 2.5, tube: 0.025, tiltX: Math.PI * 0.35, tiltY: 0, color: 0x3388dd, speed: 0.25 },
      { radius: 3.1, tube: 0.022, tiltX: -Math.PI * 0.4, tiltY: Math.PI * 0.15, color: 0x5599ee, speed: -0.3 },
      { radius: 3.7, tube: 0.028, tiltX: Math.PI * 0.55, tiltY: -Math.PI * 0.1, color: 0x2277cc, speed: 0.18 },
    ];

    const ringGroups = [];
    ringConfigs.forEach((config) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = config.tiltX;
      ringGroup.rotation.y = config.tiltY;

      const torusGeo = new THREE.TorusGeometry(config.radius, config.tube, 20, 140);
      const torusMat = new THREE.MeshBasicMaterial({
        color: config.color,
        wireframe: false,
        transparent: true,
        opacity: 0.45,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      ringGroup.add(torusMesh);
      mainGroup.add(ringGroup);
      ringGroups.push({ group: ringGroup, speed: config.speed });
    });
    groupRefs.current.rings = ringGroups;

    // ── Orbiting Small Shapes ──────────
    const orbiterData = [
      { geo: new THREE.BoxGeometry(0.22, 0.22, 0.22), orbitR: 2.7, speed: 0.5, tiltX: 0.3, tiltY: 0, color: 0xffffff },
      { geo: new THREE.OctahedronGeometry(0.18), orbitR: 3.3, speed: -0.38, tiltX: -0.5, tiltY: 0.6, color: 0xaaccff },
      { geo: new THREE.BoxGeometry(0.18, 0.18, 0.18), orbitR: 2.9, speed: 0.42, tiltX: 0.7, tiltY: -0.4, color: 0xffffff },
      { geo: new THREE.TetrahedronGeometry(0.16), orbitR: 3.5, speed: -0.33, tiltX: -0.6, tiltY: 0.3, color: 0x88bbff },
      { geo: new THREE.OctahedronGeometry(0.2), orbitR: 3.1, speed: 0.55, tiltX: 0.9, tiltY: -0.7, color: 0xffffff },
      { geo: new THREE.BoxGeometry(0.16, 0.16, 0.16), orbitR: 3.8, speed: -0.28, tiltX: -0.35, tiltY: 0.85, color: 0xaaddff },
      { geo: new THREE.TetrahedronGeometry(0.19), orbitR: 2.55, speed: 0.6, tiltX: 0.15, tiltY: -0.55, color: 0xffffff },
    ];

    const orbiters = [];
    orbiterData.forEach((data) => {
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.25,
        metalness: 0.5,
        emissive: data.color === 0xffffff ? 0x111122 : 0x000822,
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(data.geo, mat);
      const pivot = new THREE.Group();
      pivot.rotation.x = data.tiltX;
      pivot.rotation.y = data.tiltY;
      mesh.position.set(data.orbitR, 0, 0);
      pivot.add(mesh);
      mainGroup.add(pivot);
      orbiters.push({
        pivot,
        mesh,
        orbitR: data.orbitR,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
      });
    });
    groupRefs.current.orbiters = orbiters;

    // ── Particle Field ─────────────────
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3.5 + Math.random() * 3.5;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Blue-tinted colors with some white
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.3 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.35;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      }
      sizes[i] = Math.random() * 0.04 + 0.015;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);
    groupRefs.current.particles = { points: particles, mainGroup };

    // Store main group for animation
    groupRefs.current.mainGroup = mainGroup;
  }, []);

  // ── Animation Loop ────────────────────
  const animate = useCallback(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!scene || !camera || !renderer) return;

    const time = performance.now() * 0.001;
    const { central, rings, orbiters, particles, mainGroup } = groupRefs.current;

    // Smooth mouse parallax
    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.04;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.04;

    if (mainGroup) {
      mainGroup.rotation.y += 0.001;
      mainGroup.rotation.x += mouseRef.current.y * 0.015 - mainGroup.rotation.x * 0.01;
      mainGroup.rotation.y += mouseRef.current.x * 0.001;
    }

    // Central icosahedron rotation
    if (central) {
      central.ico.rotation.y += 0.005;
      central.ico.rotation.x += 0.002;
      central.ico.rotation.z += 0.003;
      central.core.rotation.y -= 0.008;
      central.core.rotation.x += 0.004;
    }

    // Orbital rings
    rings.forEach((ring) => {
      ring.group.rotation.z += ring.speed * 0.01;
    });

    // Orbiting shapes
    orbiters.forEach((orb) => {
      orb.angle += orb.speed * 0.01;
      orb.pivot.rotation.z = orb.angle;
      // Subtle bobbing
      orb.mesh.position.y = Math.sin(time * orb.speed * 0.7 + orb.angle) * 0.25;
    });

    // Particle drift
    if (particles && particles.points) {
      particles.points.rotation.y += 0.0006;
      particles.points.rotation.x += 0.0003;
    }

    // Subtle camera sway
    camera.position.x += (mouseRef.current.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouseRef.current.y * 0.4 + 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  // ── Resize Handler ────────────────────
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }, []);

  // ── Mouse Move Handler ────────────────
  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    targetMouseRef.current.x = x;
    targetMouseRef.current.y = y;
  }, []);

  // ── Setup & Cleanup ───────────────────
  useEffect(() => {
    setupScene();
    animationIdRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      // Dispose Three.js resources
      const scene = sceneRef.current;
      const renderer = rendererRef.current;
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [setupScene, animate, handleResize, handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'default' }}
    />
  );
};

// ─────────────────────────────────────
// Admin Login Page Component
// ─────────────────────────────────────
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  const error = authError;

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel – 3D Scene + Brand Info ── */}
      <div className="hidden lg:flex w-[45%] bg-gray-900 flex-col justify-between p-14 relative overflow-hidden">
        {/* 3D Animated Scene Background */}
        <TechScene3D />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/75 via-gray-900/35 to-gray-900/80 pointer-events-none z-[1]" />

        {/* Content overlaid on top of 3D scene */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            {/* Logo container  */}
            <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" stroke="#0055FF" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-white">AI Solutions</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Admin<br />Portal
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Secure access to manage customer enquiries, track submissions, and monitor platform activity.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              'Manage customer enquiries',
              'Search, filter and sort submissions',
              'Update enquiry statuses',
              'Bulk actions and data export',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0055FF] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-t border-gray-600/50 pt-8">
          <p className="text-xs text-gray-500">
            © 2026 AI Solutions. All rights reserved. Authorised personnel only.
          </p>
        </div>
      </div>

      {/* ── Right Panel – Login Form ── */}
      <div className="flex-1 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-md -mt-[70px]">
          {/* Mobile logo (visible on small screens) */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 border-2 border-gray-900 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="0.5" y="0.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
                <rect x="6.5" y="0.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
                <rect x="0.5" y="6.5" width="5" height="5" stroke="#0055FF" strokeWidth="1" />
                <rect x="6.5" y="6.5" width="5" height="5" stroke="#111827" strokeWidth="1" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase">AI Solutions</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">Admin Access</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-10">Enter your credentials to access the admin panel.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#0055FF] transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password field with toggle visibility */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#0055FF] transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055FF] text-white py-3.5 text-sm font-bold hover:bg-[#0044CC] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;