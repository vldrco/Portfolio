// CSS
import '/css/style.css'
import 'lenis/dist/lenis.css'
// JS
import * as THREE from 'three'
import Lenis from 'lenis'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Lenis
// Initialize Lenis
const lenis = new Lenis();

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", () => {
  (function () {
    var camera, scene, renderer;
    var geometry, material, mesh;

    function init() {
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 3;

      scene = new THREE.Scene();

      geometry = new THREE.IcosahedronGeometry(1, 1);
      material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const canvasContainer = document.getElementById("canvas-container");
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
      renderer.setClearColor(0x000000, 0.0);
      canvasContainer.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      const canvasContainer = document.getElementById("canvas-container");

      // Update camera aspect ratio and projection matrix
      camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
      camera.updateProjectionMatrix();

      // Update size of the renderer to fit the container
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }

    function animate(time) {
      mesh.rotation.x = time * 0.0005;
      mesh.rotation.y = time * 0.001;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    init();
    requestAnimationFrame(animate);
  })();

  /* source: https://codepen.io/ragunath/pen/Exmgpjg */
  (function () {
    //global Variables
    let scene;
    let camera;
    let renderer;
    let edges;
    let skeleton;
    let particle;

    //function
    function init() {
      //scene
      scene = new THREE.Scene();

      //camera Variables
      const fov = 100;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 10000;

      // camera
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 500;
      scene.add(camera);

      //renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.autoClear = false;
      renderer.setClearColor(0x000000, 0.0);
      document.getElementById("canvas").appendChild(renderer.domElement);

      //3d object
      skeleton = new THREE.Object3D();
      edges = new THREE.Object3D();
      particle = new THREE.Object3D();

      scene.add(skeleton);
      scene.add(edges);
      scene.add(particle);

      //adding Geomentry
      let geometry = new THREE.TetrahedronGeometry(1, 0);
      let geomet2 = new THREE.IcosahedronGeometry(15, 4);
      let edge = new THREE.EdgesGeometry(geomet2);

      //Material
      let material = new THREE.LineBasicMaterial({
        color: 0x000000,
      });

      let mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: false,
        flatShading: true,
      });

      let mat2 = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        wireframe: true,
      });

      //Particle
      for (let i = 0; i < 1000; i++) {
        let mesh = new THREE.Mesh(geometry, mat2);
        mesh.position.set(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        );
        mesh.position.multiplyScalar(360 + Math.random() * 3600);
        mesh.rotation.set(
          Math.random() * 3,
          Math.random() * 3,
          Math.random() * 3
        );
        particle.add(mesh);
      }

      //outerPlanet
      let outerPlanet = new THREE.Mesh(geomet2, mat);
      outerPlanet.scale.x = outerPlanet.scale.y = outerPlanet.scale.z = 10;
      skeleton.add(outerPlanet);

      //edges
      let planetEdges = new THREE.LineSegments(edge, material);
      edges.scale.x = edges.scale.y = edges.scale.z = 10;
      edges.add(planetEdges);

      //ambientLight
      let ambientLight = new THREE.AmbientLight(0x222222, 0.5);
      scene.add(ambientLight);

      // directional light
      let dLight = [];
      dLight[0] = new THREE.DirectionalLight(0xffffff, 1);
      dLight[0].position.set(1, 0, 0);
      dLight[1] = new THREE.DirectionalLight(0x888888, 0.5);
      dLight[1].position.set(0.75, 1, 0.5);
      dLight[2] = new THREE.DirectionalLight(0x444444, 0.3);
      dLight[2].position.set(-0.75, -1, 0.5);
      scene.add(dLight[0]);
      scene.add(dLight[1]);
      scene.add(dLight[2]);

      animate();
      window.addEventListener("resize", onWindowResize, false);
    }

    function animate() {
      requestAnimationFrame(animate);

      particle.rotation.x += 0.0;
      particle.rotation.y -= 0.0005;
      particle.rotation.z -= 0.0015;

      skeleton.rotation.x += 0.001;
      skeleton.rotation.y += 0.001;

      edges.rotation.x += 0.001;
      edges.rotation.y += 0.001;

      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.onload = init;
  })();

  (function () {
    const horizontal = document.getElementById("scroll-container");
    let horizontal_items = gsap.utils.toArray(".horizontal-item");

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(horizontal_items, {
      xPercent: -100 * (horizontal_items.length - 1),
      ease: "sine.out",
      scrollTrigger: {
        trigger: horizontal,
        scrub: 1.5,
        pin: true,
        snap: 1 / (horizontal_items.length - 1),
        end: "+=" + horizontal.offsetWidth
      }
    });

    gsap.ticker.lagSmoothing(0);
  })();

  // get the element
  const text = document.querySelector('.typing-text');

  // get word from the element's text content
  const word = "Let's talk";

  // start typing effect
  setTyper(text, word);

  function setTyper(element, word) {
    const LETTER_TYPE_DELAY = 75;
    let letterIndex = 0;

    // Start typing forward
    const wordTypeInterval = setInterval(() => {
      letterIndex++;

      if (letterIndex === word.length) {
        // Stop when the word is fully typed
        clearInterval(wordTypeInterval);
      }

      // Update typed part
      const textToType = word.substring(0, letterIndex);
      element.innerHTML = `${textToType}<span class="cursor">!</span>`;
    }, LETTER_TYPE_DELAY);
  }

  // GSAP ScrollTrigger to activate typing effect when in view
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: text,
    // Start animation when 75% of the element is in view
    start: "top 75%",
    onEnter: () => setTyper(text, word),
    onEnterBack: () => setTyper(text, word),
    // Restart the animation each time in view
    toggleActions: "restart none none none"
  });

  const textElements = document.querySelectorAll('.type');

  textElements.forEach((textElement) => {
    ScrollTrigger.create({
      trigger: textElement,
      start: "top 80%",
      // Add animation class on enter
      onEnter: () => textElement.classList.add('animate-typing'),
      // Remove class on scroll
      onLeaveBack: () => textElement.classList.remove('animate-typing')
    });
  });
});