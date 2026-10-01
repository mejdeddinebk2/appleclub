'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type * as ThreeNS from 'three';
import { asset } from '@/lib/utils';

/**
 * A glossy 3D "app icon" (Three.js) that floats, breathes and leans toward the pointer.
 * Lazy-loaded, paused when off-screen, and replaced by a flat logo tile when WebGL is
 * unavailable or the visitor prefers reduced motion.
 */
export function FloatingIcon3D({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvasTest = document.createElement('canvas');
    const hasGl = !!(canvasTest.getContext('webgl2') || canvasTest.getContext('webgl'));
    if (reduced || !hasGl) {
      setFallback(true);
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed || !hostRef.current) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      host.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 7.2);

      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim().split(/\s+/).map(Number);
      const accentColor = new THREE.Color(accent[0] / 255, accent[1] / 255, accent[2] / 255);

      const group = new THREE.Group();
      scene.add(group);

      // Body: a glossy squircle slab, like an app icon.
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(2.6, 2.6, 0.55, 8, 0.55),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#0b0b10'),
          metalness: 0.55,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          iridescence: 0.7,
          iridescenceIOR: 1.4,
        }),
      );
      group.add(body);

      // Rim light ring in the accent color.
      const rim = new THREE.Mesh(
        new RoundedBoxGeometry(2.72, 2.72, 0.3, 8, 0.6),
        new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.22 }),
      );
      rim.position.z = -0.18;
      group.add(rim);

      // Logo on the front face.
      const loader = new THREE.TextureLoader();
      const logoTex = await loader.loadAsync(asset('/images/logo-apple-club.png'));
      if (disposed) {
        renderer.dispose();
        return;
      }
      logoTex.colorSpace = THREE.SRGBColorSpace;
      logoTex.anisotropy = 8;
      const aspect = logoTex.image.width / logoTex.image.height;
      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 1.7 / aspect),
        new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }),
      );
      logo.position.z = 0.285;
      group.add(logo);

      // Orbiting glass beads for depth.
      const beadMat = new THREE.MeshPhysicalMaterial({
        color: accentColor,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1,
        emissive: accentColor,
        emissiveIntensity: 0.25,
      });
      const beads: Array<{ mesh: ThreeNS.Mesh; r: number; s: number; o: number; y: number }> = [];
      for (let i = 0; i < 5; i += 1) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1 + (i % 3) * 0.05, 24, 24), beadMat);
        scene.add(mesh);
        beads.push({ mesh, r: 2.2 + i * 0.28, s: 0.35 + i * 0.09, o: (i / 5) * Math.PI * 2, y: (i - 2) * 0.35 });
      }

      const key = new THREE.DirectionalLight('#ffffff', 2.2);
      key.position.set(3, 4, 5);
      scene.add(key);
      const fill = new THREE.PointLight(accentColor, 18, 12);
      fill.position.set(-3, -2, 3);
      scene.add(fill);

      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;
      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      // Gyroscope tilt where available without a permission prompt (most Android devices).
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        tx = Math.max(-1, Math.min(1, e.gamma / 30));
        ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      };
      const needsPermission = typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function';
      if (!needsPermission) window.addEventListener('deviceorientation', onTilt);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);

      const clock = new THREE.Clock();
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        group.rotation.y = Math.sin(t * 0.6) * 0.35 + cx * 0.5;
        group.rotation.x = Math.cos(t * 0.5) * 0.12 + cy * 0.35;
        group.position.y = Math.sin(t * 0.9) * 0.1;
        beads.forEach((b) => {
          const a = t * b.s + b.o;
          b.mesh.position.set(Math.cos(a) * b.r, b.y + Math.sin(a * 1.3) * 0.25, Math.sin(a) * b.r * 0.55 - 0.2);
        });
        renderer.render(scene, camera);
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('deviceorientation', onTilt);
        scene.traverse((obj) => {
          const mesh = obj as ThreeNS.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
        });
        logoTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => setFallback(true));

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      {fallback && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="glass squircle flex h-3/4 w-3/4 items-center justify-center rounded-[2rem]">
            <Image src={asset('/images/logo-apple-club.png')} alt="" width={96} height={96} className="h-2/3 w-2/3 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
