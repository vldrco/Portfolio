// CSS
import "/css/style.css";
import "lenis/dist/lenis.css";
import "aos/dist/aos.css";
// JS
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import AOS from "aos";

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    offset: 200,
    delay: 0,
    duration: 400,
  });
});

// Lenis
// Initialize Lenis
const lenis = new Lenis();

// Listen for the scroll event and log the event data
lenis.on("scroll", (e) => {
  console.log(e);
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ThreeJS Points orb
(function () {
  let scene, camera, renderer, orb, controls;

  function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    const fov = 25;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.set( 0, 20, 100 );
    camera.position.z = 100;
    scene.add(camera);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);
    document.getElementById("orb-canvas").appendChild(renderer.domElement);

    // Orbit Controls
    /*controls = new OrbitControls( camera, renderer.domElement );
    controls.keyPanSpeed = 100;
    controls.update(); */

    // 3D Object
    orb = new THREE.Object3D();
    scene.add(orb);

    // Geometry and Material
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });

    // Points Orb
    const pointsOrb = new THREE.Points(geometry, material);
    pointsOrb.scale.set(10, 10, 10);
    orb.add(pointsOrb);

    animate();
    window.addEventListener("resize", onWindowResize, false);
  }

  function animate() {
    requestAnimationFrame(animate);

    orb.rotation.x += 0.001;
    orb.rotation.y += 0.001;

    //controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.onload = init;
})();

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const splitTypes = document.querySelectorAll(".reveal-type");

  splitTypes.forEach((char, i) => {
    const bg = char.dataset.bgColor;
    const fg = char.dataset.fgColor;

    const text = new SplitType(char, { types: "chars" });

    gsap.fromTo(
      text.chars,
      {
        color: bg,
      },
      {
        color: fg,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: char,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          markers: false,
          toggleActions: "play play reverse reverse",
        },
      }
    );
  });

  const lenis = new Lenis({
    duration: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});