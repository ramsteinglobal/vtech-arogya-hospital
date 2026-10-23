import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* A DNA double helix built from primitives: no model file needed. */
export default function HeroScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Renderer, scene, camera
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.display = "block"; // removes the tiny gap canvases get under them
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 15);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 6, 8);
    scene.add(key);
    const rim = new THREE.PointLight(0x38bdf8, 60, 40);
    rim.position.set(-6, -2, 5);
    scene.add(rim);

    // Helix: pivot handles tilt + scroll, helix handles spin
    const pivot = new THREE.Group();
    const helix = new THREE.Group();
    pivot.rotation.z = 0.4;
    pivot.add(helix);
    scene.add(pivot);

    const ballGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const rungGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    const matA = new THREE.MeshPhysicalMaterial({ color: 0x1d4ed8, roughness: 0.25, clearcoat: 1 });
    const matB = new THREE.MeshPhysicalMaterial({ color: 0x60a5fa, roughness: 0.2, clearcoat: 1 });
    const rungMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 });

    const COUNT = 30, HEIGHT = 12, RADIUS = 1.7, TURNS = 2.2;
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      const y = (t - 0.5) * HEIGHT;
      const a = t * Math.PI * 2 * TURNS;
      const x = Math.cos(a) * RADIUS, z = Math.sin(a) * RADIUS;

      const s1 = new THREE.Mesh(ballGeo, matA); s1.position.set(x, y, z);
      const s2 = new THREE.Mesh(ballGeo, matB); s2.position.set(-x, y, -z);
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.scale.y = RADIUS * 2;
      rung.rotation.set(0, -a, Math.PI / 2);
      helix.add(s1, s2, rung);
    }

    // Soft floating particles
    const N = 220;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 22;
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dotsMat = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.06, transparent: true, opacity: 0.6 });
    const dots = new THREE.Points(dotsGeo, dotsMat);
    scene.add(dots);

    /* Sizing.
       The helix (plus a little margin) fits inside a sphere of this radius.
       On phones and tablets the camera is moved back just far enough that the
       whole sphere is visible in BOTH directions, whatever shape the box is,
       so the model can never be cropped at the top, bottom or sides. */
    const FIT_RADIUS = 6.8 * 1.08;
    const fitDistance = (aspect) => {
      const v = THREE.MathUtils.degToRad(camera.fov) / 2;
      const h = Math.atan(Math.tan(v) * aspect);
      return FIT_RADIUS / Math.sin(Math.min(v, h));
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      const aspect = w / h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 2));
      renderer.setSize(w, h);
      camera.aspect = aspect;
      // tall desktop column keeps the original close-up look; everything else auto-fits
      const tallDesktop = w >= 480 && aspect < 1.15;
      camera.position.z = tallDesktop ? 15 : fitDistance(aspect);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Mouse parallax (eased)
    const mouse = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    // GSAP: intro (always) ...
    const ctx = gsap.context(() => {
      gsap.from(helix.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 1.6, ease: "expo.out" });
      gsap.from(helix.rotation, { y: -Math.PI * 2, duration: 2.2, ease: "power3.out" });
    });

    // ... and scroll-linked motion, different for phones/tablets and desktop
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: 1 };
      gsap.to(pivot.rotation, { z: 1.2, scrollTrigger: st });
      gsap.to(pivot.position, { y: 3, scrollTrigger: st });
    });
    mm.add("(max-width: 767px)", () => {
      // stacked layout: the scene is below the text, so start as it enters the screen,
      // only tilt a little and never push the model upwards out of its box
      gsap.to(pivot.rotation, {
        z: 0.8,
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });

    // Render loop (paused when off-screen)
    let raf, visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = clock.getDelta();
      if (!reduceMotion) {
        helix.rotation.y += dt * 0.35;
        dots.rotation.y += dt * 0.02;
      }
      eased.x += (mouse.x - eased.x) * 0.05;
      eased.y += (mouse.y - eased.y) * 0.05;
      camera.position.x = eased.x * 1.2;
      camera.position.y = -eased.y * 0.8;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      mm.revert();
      ctx.revert();
      [ballGeo, rungGeo, dotsGeo, matA, matB, rungMat, dotsMat].forEach((o) => o.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}