//css
import '/css/style.css';
import '/assets/WEB/css/switzer.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'lenis/dist/lenis.css'
//js
import * as THREE from 'three';
import Lenis from 'lenis';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

function smoothScroll() {
  // Initialize Lenis
  const lenis = new Lenis({
    autoRaf: true,
  });

  // Auto scroll for links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: 0,
          duration: 2,
        });
      }
    });
  });
}

function navMenu(menu) {
  let btn = document.querySelector('.navbar-toggler');
  btn.addEventListener("click", function () {
    menu.classList.toggle("is-active");
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992 && menu.classList.contains("is-active")) {
      menu.classList.remove("is-active");
    }
  });

  return menu;
}

let menuItems = document.getElementsByClassName('navbar-item');
// items must be mapped outside the function to avoid resetting the text on every resize
let menuItemsBackup = Array.from(menuItems).map((item) => item.innerHTML); // Backup the original text

function menuText() {
  let i = 0;
  let size = menuItems.length;

  if (window.innerWidth < 992) {
    menuItems[0].innerHTML = "About";
    menuItems[1].innerHTML = "Experience";
    menuItems[2].innerHTML = "Projects";
    menuItems[3].innerHTML = "Contact";
  } else {
    for (i = 0; i < size; i++) {
      menuItems[i].innerHTML = menuItemsBackup[i];
    }
  }
}

/* This function observes changes in the specified attribute of the target
  element(s) and executes the provided callback
  function when a change is detected. */
function observer(filter, target, fn) {
  // Options for the observer (which mutations to observe)
  const config = { attributes: true, attributeFilter: [`${filter}`] };

  // Callback function to execute when mutations are observed
  const callback = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes" && mutation.attributeName === `${filter}`) {
        fn();
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Check if target is a single element or an array/NodeList
  if (Array.isArray(target) || NodeList.prototype.isPrototypeOf(target)) {
    let size = target.length;
    for (let i = 0; i < size; i++) {
      observer.observe(target[i], config); // Start observing the target node for configured mutations
    }
  } else {
    observer.observe(target, config);
  }

  return observer;
}

// ThreeJS Points orb
(function () {
  let scene, camera, renderer, orb;

  function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    const fov = 50;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 100;
    camera.position.y = 25;
    scene.add(camera);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);
    document.getElementById("orb-canvas").appendChild(renderer.domElement);

    // Pivot object for tilt
    let pivot = new THREE.Object3D();
    scene.add(pivot);

    // Earth's axial tilt
    pivot.rotation.z = THREE.MathUtils.degToRad(23.5);

    // 3D Object
    orb = new THREE.Object3D();
    pivot.add(orb);

    // Geometry and Material
    const geometry = new THREE.SphereGeometry(5, 64, 32);
    const material = new THREE.PointsMaterial({
      size: 0.3,
    });

    // Points Orb
    const pointsOrb = new THREE.Points(geometry, material);
    // set color of orb based on theme
    const html = document.querySelector('html');
    let setColour = () => {
      let dark = html.getAttribute("data-theme") === "dark";
      if (dark) {
        pointsOrb.material.color.setHex(0xf8f9fa);
      } else {
        pointsOrb.material.color.setHex(0x000000);
      }
    }
    observer('data-theme', html, setColour);
    pointsOrb.scale.set(10, 10, 10);
    orb.add(pointsOrb);

    animate();
    window.addEventListener("resize", onWindowResize, false);
  }

  function animate() {
    requestAnimationFrame(animate);
    orb.rotation.y += 0.001;
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.onload = init;
})();

// Get current time and weather
async function getTime() {
  let time = new Date().toLocaleTimeString([],
    { hour: '2-digit', minute: '2-digit', hour12: true }
  );
  let localTime = time.replace(/ ?[APap][Mm]$/,''); // Remove AM/PM from time using regex
  document.querySelector('.local-time').innerHTML = localTime;
}

async function getWeather() {
  const url =
    "http://api.weatherapi.com/v1/current.json?key=d2fbb4e7f0a64445943195304250406";
  if ("geolocation" in navigator) { //The geolocation API is present in modern browsers
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`${url}&q=${lat},${lon}&aqi=no`)
          .then((response) => response.json())
          .then((data) => {
            let w = document.createTextNode(
              `${data.current.temp_c}°, ${data.current.condition.text}`
            );
            document.querySelector(".weather").appendChild(w);
          })
          .catch((error) => {
            document.querySelector(".weather").innerHTML =
              "Failed to get weather data.";
            console.error(error);
          });
      },
      (error) => {
        document.querySelector(".weather").innerHTML =
          "Somewhere in the world";
        console.warn("Geolocation error:", error);
      }
    );
  } else {
    document.getElementById("weather").textContent =
      "Geolocation not supported.";
  }
}

// Swiper sections
let swiperExp = new Swiper(".experience-swiper", {
  modules: [Pagination, Autoplay],
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    type: "progressbar",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});

let swiperProj = new Swiper(".projects-swiper", {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Set height of parent dinamically based on absolutely positioned child's height
function setHeight() {
  let arrowHeight = document.querySelector(".swiper-button-next");
  let rect = arrowHeight.getBoundingClientRect();
  let cButtons = document.getElementsByClassName("swiper-custom-buttons");
  let size = cButtons.length;

  for (let i = 0; i < size; i++) {
    cButtons[i].style.height = `${rect.height}px`;
  }
}

// Remove disabled swiper button
function remButton(button) {
  let i = 0;
  let size = button.length;

  for (i = 0; i < size; i++) {
    if (
      window.innerWidth >= 768 &&
      button[i].classList.contains("swiper-button-disabled")
    ) {
      button[i].style.display = "none";
    } else {
      button[i].style.display = "";
    }
  }

  return button;
}

// Set theme based on system preference
function darkMode() {
  // Check if dark mode is preferred by the user
  let dark = window.matchMedia("(prefers-color-scheme: dark)");
  let html = document.querySelector('html');

  if (dark.matches) { // If dark mode is preferred
    html.setAttribute("data-theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
  }
}

// Toggle dark mode on button click
function toggleDarkMode() {
  // Dark mode toggle
  let toggler = document.querySelector('.theme-toggler');

  toggler.addEventListener('click', function () {
    let html = document.querySelector('html');
    if (html.getAttribute("data-theme") === "dark") {
      html.setAttribute("data-theme", "light");
    } else {
      html.setAttribute("data-theme", "dark");
    }
  });
}

// Dynamically change icons based on theme
function dinamicIcons() {
  let html = document.querySelector('html');
  let toggler = document.querySelector('.theme-toggler');
  let icon;

  if (html.getAttribute("data-theme") === "dark") {
    toggler.innerHTML = ''; // Clear previous icon
    icon = document.createElement('i');
    icon.classList.add('bi', 'bi-sun');
    toggler.appendChild(icon);
  } else {
    toggler.innerHTML = ''; // Clear previous icon
    icon = document.createElement('i');
    icon.classList.add('bi', 'bi-moon-fill');
    toggler.appendChild(icon);
  }
}

// Change navbar background color based on theme and screen width
function navColor() {
  let navMenu = document.querySelector('.navbar-menu');
  let html = document.querySelector('html');
  let dark = html.getAttribute("data-theme") === "dark";

  if (window.innerWidth > 992) {
    navMenu.style.backgroundColor = "transparent";
  } else if (dark && window.innerWidth < 992) {
    navMenu.style.backgroundColor = "#212529";
  } else {
    navMenu.style.backgroundColor = "#f8f9fa";
  }
}

function main() {
  smoothScroll();
  let menu = document.querySelector('.navbar-menu');
  navMenu(menu);
  menuText();
  window.addEventListener("resize", menuText);
  getTime();
  setInterval(getTime, 1000); // update time
  document.querySelector('.date').innerHTML = new Date().toLocaleDateString([],
    { weekday: 'short', month: 'short', day: 'numeric' }
  );
  let year = document.querySelector('.year');
  year.innerHTML = new Date().getFullYear();
  getWeather();
  setHeight();
  toggleDarkMode();
  setTimeout(darkMode, 500); // Set initial dark mode based on system preference

  // nodes that will be observed for mutations
  // querySelectorAll returns a NodeList, which is similar to an array
  let swiperButtons = document.querySelectorAll('.swiper-button-prev, .swiper-button-next');
  let html = document.querySelector('html');
  let nav_menu = document.querySelector('.navbar-menu');
  let backupMenu = document.querySelector('.navbar-toggler').innerHTML; // Backup the original menu text

  // storing the function in a variable to avoid calling it immediately
  // only this one because it takes a parameter and will be called in the observer
  let remButtons = () => remButton(swiperButtons);
  
  // call functions on DOMContentLoaded
  // this creates an initial state and the observer will take care of future changes
  document.addEventListener("DOMContentLoaded", remButton(swiperButtons));
  document.addEventListener("DOMContentLoaded", dinamicIcons);
  // this function is called on resize to change the nav color
  document.addEventListener("resize", navColor);

  // filtered attribute, target to watch, and function to execute
  observer('class', swiperButtons, remButtons);
  observer('data-theme', html, dinamicIcons);
  observer('data-theme', html, navColor);
  observer('class', nav_menu, () => {
    if (nav_menu.classList.contains("is-active")) {
      let nav_toggler = document.querySelector('.navbar-toggler');
      nav_toggler.innerHTML = "CLOSE";
    } else {
      let nav_toggler = document.querySelector('.navbar-toggler');
      nav_toggler.innerHTML = backupMenu; // Restore the original menu text
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
