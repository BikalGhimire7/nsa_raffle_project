
//>>>>>>>>>>>>>> RAFFLE DRAW <<<<<<<<<<<<<<<<<<<

import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js'; // Three.js core
import anime from 'https://unpkg.com/animejs@3.2.1/lib/anime.es.js'; // Anime.js for animations (not used here yet, but loaded)

// -----------------------------------------------
//  Set Up Scene, Camera, and Renderer
// -----------------------------------------------
const scene = new THREE.Scene();

// Add some subtle fog for depth and atmosphere
scene.fog = new THREE.FogExp2(0x000000, 0.008);

// Set up the camera with a nice field of view and good starting position
const camera = new THREE.PerspectiveCamera(
  75,                                // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,                               // near clipping plane
  1000                               // far clipping plane
);
camera.position.z = 15; // Pull camera back a bit
camera.position.y = 2;  // Slightly above ground level

// Create a WebGL renderer and make it look good
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, // smooth edges
  alpha: true      // allow transparency
});
renderer.setPixelRatio(window.devicePixelRatio); // High-res rendering
renderer.outputEncoding = THREE.sRGBEncoding;    // Better color fidelity
renderer.setSize(window.innerWidth, window.innerHeight); // Fullscreen canvas
renderer.shadowMap.enabled = true;              // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);  // Add canvas to the page

// -----------------------------------------------
//  Make it Responsive: Handle Window Resize
// -----------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Update camera aspect
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------------------------
//  Lighting Setup
// -----------------------------------------------

// Ambient light: soft light everywhere, no shadows
const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // soft white light
scene.add(ambientLight);

// Directional light: like the sun, with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7); // nicely angled
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;  // high res shadows
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Point light #1: reddish tone from one side
const pointLight1 = new THREE.PointLight(0xff4b2b, 1, 50);
pointLight1.position.set(10, 5, 10);
scene.add(pointLight1);

// Point light #2: bluish tone from the other side
const pointLight2 = new THREE.PointLight(0x416cff, 1, 50);
pointLight2.position.set(-10, -5, 10);
scene.add(pointLight2);
// -----------------------------------------------
//  Load & Display Background Image
// -----------------------------------------------

// Initialize texture loader
const textureLoader = new THREE.TextureLoader();

// Load background texture from file
const backgroundTexture = textureLoader.load('st.jpg', (texture) => {
  // Tweak texture settings for better quality
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // make it crisp on all devices
  texture.encoding = THREE.sRGBEncoding;

  // Dynamically scale background based on window size
  backgroundPlane.scale.set(window.innerWidth / 850, window.innerHeight / 850, 1);
});

// Create a large flat plane to hold the background texture
const planeGeometry = new THREE.PlaneGeometry(100, 100); // base geometry
const planeMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,    // attach our loaded image
  side: THREE.DoubleSide,    // visible from both sides
  transparent: true,
  opacity: 0.8               // slightly see-through
});

const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
backgroundPlane.position.z = -40; // push it far behind the scene
scene.add(backgroundPlane);

// -----------------------------------------------
//  Responsive Background Rescaling
// -----------------------------------------------
window.addEventListener('resize', () => {
  // Adjust camera and renderer on window resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Also scale the background to match new window size
  backgroundPlane.scale.set(window.innerWidth / 100, window.innerHeight / 100, 1);
});

// -----------------------------------------------
//  Create a Starfield Using Particles
// -----------------------------------------------

// Define geometry and allocate space for positions
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 2000;
const posArray = new Float32Array(particleCount * 3); // x, y, z for each particle

// Fill the position array with random values to simulate stars
for (let i = 0; i < particleCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 100;     // x
  posArray[i + 1] = (Math.random() - 0.5) * 100; // y
  posArray[i + 2] = (Math.random() - 0.5) * 100; // z
}

// Attach positions to geometry
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material for the star particles
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffffff,       // white like stars
  transparent: true,
  opacity: 0.8
});

// Create the mesh and add to scene
const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

// -----------------------------------------------
//  Function to Generate Number + "Nepal" Texture
// -----------------------------------------------
function createNumberTexture(number) {
  const size = 256;

  // Set up canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Create background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#ff416c');  // pinkish-red
  gradient.addColorStop(1, '#ff4b2b');  // deep red
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add glow effect to text
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 15;

  // Draw the main number
  ctx.fillStyle = 'white';
  ctx.font = 'bold 128px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number.toString(), size / 2, size / 2);

  // Add "Nepal" label below the number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic bold 28px Arial';
  ctx.fillText("Nepal", size / 2, size - 40);

  // Convert the canvas into a texture usable in 3D
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// -----------------------------------------------
//  Custom Shader for Gradient Animation
// -----------------------------------------------

const enhancedGradientShader = {
  uniforms: {
    color1: { value: new THREE.Color(0xff416c) }, // Starting color (reddish)
    color2: { value: new THREE.Color(0x416cff) }, // Ending color (bluish)
    time: { value: 0 },                           // For animated transitions
    opacity: { value: 1.0 }                       // 👈 Add this for fading
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    uniform float opacity; // 👈 Add this to control alpha
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      // Animate gradient across x-axis with a subtle sine wave
      float gradient = (vUv.x + sin(time * 2.0) * 0.1) * 0.8 + 0.1;
      vec3 color = mix(color1, color2, gradient); // Smooth transition between colors
      gl_FragColor = vec4(color, opacity);        // 👈 Use animated opacity here
    }
  `
};

// -----------------------------------------------
//  Create Cubes with Gradient Shader & Number Textures
// -----------------------------------------------

const cubes = [];
const cubeSize = 1.2; // Dimensions for each cube
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

// Fetch random numbers from CSV (raffle ticket numbers)
const response = await fetch('raffle_tickets.csv');
const data = await response.text();
const rows = data.trim().split('\n');
const array = rows.map(row => row.split(',').map(Number));

// Pick a random row of numbers
var index = Math.floor(Math.random() * array.length);
var numberRandom = array[index];
var numberRandomArray = numberRandom.toString(); // Convert to string for digit access

console.log(numberRandom); // For debugging / verification

// Loop to generate 6 cubes with textures
for (let i = 0; i < 6; i++) {
  var randomNum = numberRandomArray[i];

  // Create canvas-based texture with number and "Nepal"
  const numberTexture = createNumberTexture(randomNum);

  // Create cube material using custom gradient shader
  const gradientMaterial = new THREE.ShaderMaterial({
    ...enhancedGradientShader,
    transparent: true,
    opacity: 0.9
  });

  // Create the cube mesh
  const cube = new THREE.Mesh(cubeGeometry, gradientMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.visible = false; // Initially invisible; can toggle later
  cube.position.set(0, 0, 0);
  cube.userData.number = randomNum; // Store number with cube for later use

  // Add front face label with number texture
  const numberPlaneGeometry = new THREE.PlaneGeometry(cubeSize * 0.9, cubeSize * 0.9);
  const numberPlaneMaterial = new THREE.MeshBasicMaterial({ 
    map: numberTexture, 
    transparent: true,
    opacity: 0.95
  });
  const numberPlane = new THREE.Mesh(numberPlaneGeometry, numberPlaneMaterial);
  numberPlane.position.z = cubeSize / 2 + 0.01;
  cube.add(numberPlane);

  // Add same texture to back face (mirrored)
  const backPlane = numberPlane.clone();
  backPlane.position.z = -(cubeSize / 2 + 0.01);
  backPlane.rotation.y = Math.PI;
  cube.add(backPlane);

  // Right face
  const rightPlane = numberPlane.clone();
  rightPlane.position.z = 0;
  rightPlane.position.x = cubeSize / 2 + 0.01;
  rightPlane.rotation.y = Math.PI / 2;
  cube.add(rightPlane);

  // Left face
  const leftPlane = numberPlane.clone();
  leftPlane.position.z = 0;
  leftPlane.position.x = -(cubeSize / 2 + 0.01);
  leftPlane.rotation.y = -Math.PI / 2;
  cube.add(leftPlane);

  // Push cube to list and add to scene
  cubes.push(cube);
  scene.add(cube);
}
// -----------------------------------------------
// Create Final Big Display Number 
// -----------------------------------------------

const createFinalNumberDisplay = () => {
  const finalNumber = numberRandom; // This is the chosen number (e.g. graduation year)

  // Create a group to hold all the number digits
  const numberGroup = new THREE.Group();
  numberGroup.position.set(0, 0, 20); // Start off-screen, can animate later
  scene.add(numberGroup);

  // Convert the number into individual digits
  const digits = finalNumber.toString().split('');

  // Loop through each digit and create a textured plane for it
  digits.forEach((digit, index) => {
    const digitTexture = createNumberTexture(digit); // Make canvas texture with number

    // Create a larger plane for final display digits
    const digitGeometry = new THREE.PlaneGeometry(3, 3);
    const digitMaterial = new THREE.MeshBasicMaterial({
      map: digitTexture,
      transparent: true,
      opacity: 0 // Start invisible — can fade in later
    });

    const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);

    // Spread digits horizontally across the center
    digitMesh.position.x = (index - (digits.length - 1) / 2) * 3.5;

    numberGroup.add(digitMesh);
  });

  return numberGroup;
};

// Create the final number display group (starts hidden/off-screen)
const finalNumberDisplay = createFinalNumberDisplay();


// -----------------------------------------------
// Create Welcome Text Overlay (HTML Elements)
// -----------------------------------------------

// Container to hold all welcome lines (positioned in center of screen)
const welcomeTextContainer = document.createElement('div');
welcomeTextContainer.style.position = 'absolute';
welcomeTextContainer.style.top = '40%';
welcomeTextContainer.style.left = '50%';
welcomeTextContainer.style.transform = 'translate(-50%, -50%)';
welcomeTextContainer.style.textAlign = 'center';
welcomeTextContainer.style.zIndex = '100'; // Make sure it's on top

// --------- Line 1: "WELCOME TO NSA-" ---------
const welcomeTextLine1 = document.createElement('div');
welcomeTextLine1.style.fontSize = '50px';
welcomeTextLine1.style.fontWeight = 'bold';
welcomeTextLine1.style.color = '#ffffff';
welcomeTextLine1.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 75, 43, 0.8)';
welcomeTextLine1.innerHTML = "WELCOME TO NSA-";
welcomeTextContainer.appendChild(welcomeTextLine1);

// --------- Line 2: "Graduating Students'" ---------
const welcomeTextLine2 = document.createElement('div');
welcomeTextLine2.style.fontSize = '70px';
welcomeTextLine2.style.fontWeight = 'bold';
welcomeTextLine2.style.background = 'linear-gradient(90deg, gold, red)';
welcomeTextLine2.style.WebkitBackgroundClip = 'text'; // Fancy gradient effect
welcomeTextLine2.style.WebkitTextFillColor = 'transparent';
// Optional text shadow if needed:
// welcomeTextLine2.style.textShadow = '2px 2px 10px rgba(255, 65, 108, 0.5)';
welcomeTextLine2.style.marginTop = '10px';
welcomeTextLine2.innerHTML = "Graduating Students'";
welcomeTextContainer.appendChild(welcomeTextLine2);

// --------- Line 3: "Farewell Event" ---------
const welcomeTextLine3 = document.createElement('div');
welcomeTextLine3.style.fontSize = '60px';
welcomeTextLine3.style.fontWeight = 'bold';
welcomeTextLine3.style.color = '#ffffff';
welcomeTextLine3.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(65, 108, 255, 0.8)';
welcomeTextLine3.style.marginTop = '10px';
welcomeTextLine3.innerHTML = "Farewell Event";
welcomeTextContainer.appendChild(welcomeTextLine3);

// Finally, add the full container to the webpage
document.body.appendChild(welcomeTextContainer);

// -----------------------------------------------
//  Create the Start Button (with Nepali Text)
// -----------------------------------------------

const startButton = document.createElement('button');
startButton.style.position = 'absolute';
startButton.style.top = '65%';
startButton.style.left = '50%';
startButton.style.transform = 'translateX(-50%)';
startButton.style.padding = '18px 45px';
startButton.style.fontSize = '24px';
startButton.style.fontWeight = 'bold';
startButton.style.borderRadius = '12px';
startButton.style.border = '2px solid rgba(255, 255, 255, 0.3)';
startButton.style.cursor = 'pointer';
startButton.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
startButton.style.color = 'white';
startButton.style.boxShadow = '0 8px 25px rgba(255, 65, 108, 0.6)';
startButton.style.transition = 'all 0.3s ease';
startButton.style.zIndex = '100';
startButton.innerHTML = 'सुरु गरौँ है त'; // Nepali for "Let's begin!"

// -----------------------------------------------
//  Add Hover Animation to Button
// -----------------------------------------------
startButton.addEventListener('mouseover', () => {
  startButton.style.transform = 'translateX(-50%) scale(1.08)';
  startButton.style.boxShadow = '0 12px 30px rgba(255, 75, 43, 0.7)';
  startButton.style.background = 'linear-gradient(135deg, #ff5e85, #ff634f)';
});

startButton.addEventListener('mouseout', () => {
  startButton.style.transform = 'translateX(-50%)';
  startButton.style.boxShadow = '0 8px 25px rgba(255, 65, 108, 0.6)';
  startButton.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
});

document.body.appendChild(startButton);

// ===============================
//  Classy, Muted Replay Button (Gold + Wine + Navy)
// ===============================
//  Create the Replay Button
const replayButton = document.createElement('button');

// Text: ↻ Replay Draw
replayButton.innerHTML = `&#x21bb;&nbsp;<strong>Replay Draw</strong>`;

// Position it bottom-right
replayButton.style.position = 'fixed';
replayButton.style.bottom = '30px';
replayButton.style.right = '30px';
replayButton.style.transform = 'none';

// Size and shape
replayButton.style.padding = '18px 44px';
replayButton.style.fontSize = '20px';
replayButton.style.fontWeight = '600';
replayButton.style.borderRadius = '48px';
replayButton.style.letterSpacing = '0.5px';
replayButton.style.border = '1px solid rgba(255,255,255,0.08)';

//  Muted yellow-wine gradient background
replayButton.style.background = 'linear-gradient(135deg, #c1a471, #7b3f61)';
replayButton.style.color = '#f9f5ef';
replayButton.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.3)';

//  Subtle shadow (not eye-hurting)
replayButton.style.boxShadow = `
  0 4px 16px rgba(62, 76, 97, 0.4),
  0 0 8px rgba(123, 63, 97, 0.25)
`;

// Font and smooth look
replayButton.style.fontFamily = `'Poppins', 'Segoe UI', sans-serif`;
replayButton.style.cursor = 'pointer';
replayButton.style.zIndex = '100';
replayButton.style.opacity = '0';
replayButton.style.transition = 'all 0.3s ease, transform 0.2s ease';

//  Soft hover glow
replayButton.addEventListener('mouseenter', () => {
  replayButton.style.transform = 'scale(1.05)';
  replayButton.style.boxShadow = `
    0 6px 20px rgba(62, 76, 97, 0.5),
    0 0 10px rgba(123, 63, 97, 0.3)
  `;
});
replayButton.addEventListener('mouseleave', () => {
  replayButton.style.transform = 'scale(1)';
  replayButton.style.boxShadow = `
    0 4px 16px rgba(62, 76, 97, 0.4),
    0 0 8px rgba(123, 63, 97, 0.25)
  `;
});

// ✅ On click → smooth refresh
replayButton.addEventListener('click', () => {
  smoothRefresh(); // fixed call
});

document.body.appendChild(replayButton);


// -----------------------------------------------
// Reload animation
// -----------------------------------------------

// Code to create smooth animation while reloading the page


function smoothRefresh() {
  // Create fullscreen overlay for refresh animation
  const fadeOverlay = document.createElement('div');
  fadeOverlay.style.position = 'fixed';
  fadeOverlay.style.top = 0;
  fadeOverlay.style.left = 0;
  fadeOverlay.style.width = '100%';
  fadeOverlay.style.height = '100%';
  fadeOverlay.style.background = 'linear-gradient(135deg, #7b3f61, #c1a471)';
  fadeOverlay.style.opacity = 0;
  fadeOverlay.style.transition = 'opacity 1.2s ease';
  fadeOverlay.style.zIndex = '9999';
  fadeOverlay.style.display = 'flex';
  fadeOverlay.style.flexDirection = 'column';
  fadeOverlay.style.justifyContent = 'center';
  fadeOverlay.style.alignItems = 'center';
  fadeOverlay.style.overflow = 'hidden';

  // Container for animated symbols
  const particleContainer = document.createElement('div');
  particleContainer.style.position = 'absolute';
  particleContainer.style.top = 0;
  particleContainer.style.left = 0;
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.pointerEvents = 'none';
  fadeOverlay.appendChild(particleContainer);

  // Floating decorative characters
  const symbols = ['॥', '॰', '☸', '🕉️', '🙏', '🪔'];
  const colors = ['#FFD700', '#FF6D60', '#F8F8FF', '#FFC87C', '#EDBB99', '#FFCCCB'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.position = 'absolute';
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.fontSize = `${Math.random() * 24 + 12}px`;
    particle.style.opacity = (Math.random() * 0.6 + 0.3).toFixed(2);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animation = `float-${i} ${Math.random() * 10 + 10}s ease-in-out infinite`;
    particle.style.textShadow = `0 0 8px ${particle.style.color}80`;

    const keyframes = `
      @keyframes float-${i} {
        0% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 40 - 20}deg); }
        66% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 40 - 20}deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    particleContainer.appendChild(particle);
  }

  // Mandala animation setup
  const mandalaContainer = document.createElement('div');
  mandalaContainer.style.position = 'absolute';
  mandalaContainer.style.width = '250px';
  mandalaContainer.style.height = '250px';
  mandalaContainer.style.borderRadius = '50%';
  mandalaContainer.style.display = 'flex';
  mandalaContainer.style.justifyContent = 'center';
  mandalaContainer.style.alignItems = 'center';
  mandalaContainer.style.transform = 'scale(0)';
  mandalaContainer.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

  const mandalaSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mandalaSVG.setAttribute('viewBox', '0 0 200 200');
  mandalaSVG.style.width = '100%';
  mandalaSVG.style.height = '100%';

  for (let i = 0; i < 8; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '100');
    circle.setAttribute('cy', '100');
    circle.setAttribute('r', (40 + i * 10).toString());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', `rgba(255, 255, 255, ${0.8 - i * 0.1})`);
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('stroke-dasharray', (12 + i * 4).toString());

    const animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
    animateTransform.setAttribute('attributeName', 'transform');
    animateTransform.setAttribute('type', 'rotate');
    animateTransform.setAttribute('from', '0 100 100');
    animateTransform.setAttribute('to', `${i % 2 === 0 ? 360 : -360} 100 100`);
    animateTransform.setAttribute('dur', `${10 + i * 2}s`);
    animateTransform.setAttribute('repeatCount', 'indefinite');
    circle.appendChild(animateTransform);

    mandalaSVG.appendChild(circle);
  }

  // Petals
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45) * Math.PI / 180;
    const x1 = 100 + 30 * Math.cos(angle);
    const y1 = 100 + 30 * Math.sin(angle);
    const x2 = 100 + 80 * Math.cos(angle);
    const y2 = 100 + 80 * Math.sin(angle);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.7)');
    line.setAttribute('stroke-width', '2');
    mandalaSVG.appendChild(line);
  }

  const centralSymbol = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centralSymbol.setAttribute('x', '100');
  centralSymbol.setAttribute('y', '108');
  centralSymbol.setAttribute('text-anchor', 'middle');
  centralSymbol.setAttribute('font-size', '24');
  centralSymbol.setAttribute('fill', '#FFFFFF');
  centralSymbol.textContent = '🇳🇵';
  mandalaSVG.appendChild(centralSymbol);

  mandalaContainer.appendChild(mandalaSVG);
  fadeOverlay.appendChild(mandalaContainer);

  // Goodbye text
  const goodbyeText = document.createElement('div');
  goodbyeText.innerHTML = `
    <div style="font-size: 36px; font-weight: bold; color: #fff9e9; text-align: center;
      text-shadow: 0 0 16px rgba(255, 240, 220, 0.4); margin-bottom: 12px;
      transform: translateY(20px); opacity: 0; transition: opacity 1s ease, transform 1s ease;">
      Rewinding... See you again! 🌀
    </div>
    <div style="font-size: 22px; font-weight: 500; color: #fff;
      text-shadow: 0 0 10px rgba(255,255,255,0.3); transform: translateY(20px);
      opacity: 0; transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;">
      धेरै धेरै शुभकामना 🙏 — With love, NSA 🇳🇵
    </div>
  `;

  fadeOverlay.appendChild(goodbyeText);
  document.body.appendChild(fadeOverlay);

  // Trigger fade in and scale sequence
  setTimeout(() => {
    fadeOverlay.style.opacity = 1;
    setTimeout(() => {
      mandalaContainer.style.transform = 'scale(1)';
      setTimeout(() => {
        const textElements = goodbyeText.children;
        for (let i = 0; i < textElements.length; i++) {
          textElements[i].style.opacity = 1;
          textElements[i].style.transform = 'translateY(0)';
        }
      }, 300);
    }, 200);
  }, 50);

  // Mandala pulse
  // ⏳ Pulse animation before reload
  setTimeout(() => {
    mandalaContainer.style.animation = 'pulse 1s ease-in-out';
    const pulseKeyframes = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = pulseKeyframes;
    document.head.appendChild(pulseStyle);
  }, 2000);

  // 🚀 Final smooth reload with no flicker
  setTimeout(() => {
    fadeOverlay.style.transition = 'transform 0.7s ease-in, opacity 0.7s ease-in';
    fadeOverlay.style.transform = 'scale(1.2)';
    fadeOverlay.style.opacity = 0;

    // Add full black overlay to cover screen and avoid flicker
    const hardOverlay = document.createElement('div');
    hardOverlay.style.position = 'fixed';
    hardOverlay.style.top = 0;
    hardOverlay.style.left = 0;
    hardOverlay.style.width = '100%';
    hardOverlay.style.height = '100%';
    hardOverlay.style.background = '#0a0a0a'; // Adjust if needed
    hardOverlay.style.zIndex = '10000';
    hardOverlay.style.transition = 'opacity 0.3s ease';
    hardOverlay.style.opacity = '0';
    document.body.appendChild(hardOverlay);

    // Fade in and then reload
    requestAnimationFrame(() => {
      hardOverlay.style.opacity = '1';

      setTimeout(() => {
        location.reload(); // Clean reload
      }, 200); // Wait for overlay to fully cover
    });
  }, 5000);
}

// -----------------------------------------------
//  Animation Control Variables
// -----------------------------------------------
let rotationSpeed = -1.2;         // Cube spinning speed
let revolveStartTime = null;      // When spinning begins
let transitionStartTime = null;   // For future transitions
let animationStage = 0;           // Tracks current animation phase

// Timeline setup for multi-stage animation sequence
let animationTimeline = {
  initialDelay: 0,
  revolvingDuration: 6000,       // Time spent revolving in circle
  lineFormationDuration: 2000,   // Time it takes to align into line
  finalNumberDelay: 2000         // Delay before final number appears
};

// -----------------------------------------------
//  Start Animation on Button Click
// -----------------------------------------------
startButton.addEventListener('click', () => {
  // Play a click sound for feedback
  const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3');
  clickSound.volume = 0.5;
  clickSound.play().catch(e => console.log("Audio play failed:", e));

  // Animate welcome text out of view (with fade and slide)
  anime({
    targets: welcomeTextContainer,
    translateY: '-200px',
    opacity: 0,
    scale: 0.8,
    duration: 1500,
    easing: 'easeInOutQuad',
    complete: () => {
      welcomeTextContainer.style.display = 'none';
    }
  });

  // Animate start button disappearing too
  anime({
    targets: startButton,
    translateY: '200px',
    opacity: 0,
    scale: 0.5,
    duration: 1500,
    easing: 'easeInOutQuad',
    complete: () => {
      startButton.style.display = 'none';

      //  Reveal the cubes!
      cubes.forEach(cube => cube.visible = true);

      // Animate cubes flying out in a circle
      anime({
        targets: cubes.map(c => c.position),
        x: (el, i) => Math.cos(i * Math.PI / 3) * 5,
        y: (el, i) => Math.sin(i * Math.PI / 3) * 5,
        z: [
          { value: -10, duration: 300, easing: 'easeOutQuad' },
          { value: 0, duration: 1000, easing: 'easeOutElastic(1, 0.5)' }
        ],
        delay: anime.stagger(150), // Stagger the animations for effect
        duration: 2000,
        easing: 'easeInOutSine',
        complete: () => {
          // Start tracking time for revolve logic
          revolveStartTime = performance.now();

          //  Make stars/particles twinkle while cubes revolve
          anime({
            targets: particleMesh.material,
            opacity: [
              { value: 0.3, duration: 1000 },
              { value: 0.8, duration: 1000 }
            ],
            size: [
              { value: 0.05, duration: 1000 },
              { value: 0.15, duration: 1000 }
            ],
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
          });
        }
      });

      //  Spin each cube once as they fly out
      cubes.forEach((cube, i) => {
        anime({
          targets: cube.rotation,
          x: Math.PI * 2,
          y: Math.PI * 2,
          duration: 1000,
          delay: i * 100, // Slight delay between each spin
          easing: 'easeInOutSine',
        });
      });
    }
  });
});

// -----------------------------------------------
//  Create Progress Counter (Hidden Initially)
// -----------------------------------------------

let progressCounter = 0;
const progressCounterDiv = document.createElement('div');
progressCounterDiv.style.position = 'absolute';
progressCounterDiv.style.bottom = '40px';
progressCounterDiv.style.left = '50%';
progressCounterDiv.style.transform = 'translateX(-50%)';
progressCounterDiv.style.fontSize = '90px';
progressCounterDiv.style.fontWeight = 'bold';
progressCounterDiv.style.color = '#ffffff';
progressCounterDiv.style.textShadow = '0 0 20px rgba(255, 65, 108, 0.8)';
progressCounterDiv.style.opacity = '0'; // Hidden until it's triggered
progressCounterDiv.style.zIndex = '100';
progressCounterDiv.innerHTML = progressCounter + '%';
document.body.appendChild(progressCounterDiv);

// -----------------------------------------------
// Create Winner Display Area (for latest & previous)
// -----------------------------------------------
const winnerDisplay = document.createElement('div');
winnerDisplay.style.position = 'fixed';
winnerDisplay.style.bottom = '60px'; // Just above the button
winnerDisplay.style.left = '20px';   // Align with button
winnerDisplay.style.color = 'white';
winnerDisplay.style.fontSize = '18px';
winnerDisplay.style.fontFamily = 'monospace';
winnerDisplay.style.padding = '10px';
winnerDisplay.style.background = 'rgba(0,0,0,0.6)';
winnerDisplay.style.borderRadius = '10px';
winnerDisplay.style.maxWidth = '300px';
winnerDisplay.style.display = 'none'; // hide it until clicked
winnerDisplay.style.zIndex = '100';
document.body.appendChild(winnerDisplay);

// -----------------------------------------------
// Create Show Last Winner Button
// -----------------------------------------------
const showWinnerButton = document.createElement('button');
showWinnerButton.innerText = 'Show Last Winner';

// Position & size
showWinnerButton.style.position = 'fixed';
showWinnerButton.style.bottom = '20px';
showWinnerButton.style.left = '20px';
showWinnerButton.style.padding = '8px 16px';
showWinnerButton.style.fontSize = '13px';
showWinnerButton.style.borderRadius = '10px';

// Colors & background
showWinnerButton.style.background = 'linear-gradient(135deg, #2c2c2c, #1a1a1a)';
showWinnerButton.style.color = '#f0f0f0';
showWinnerButton.style.border = '1px solid rgba(255, 255, 255, 0.15)';
showWinnerButton.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.4)';
showWinnerButton.style.opacity = '0.7';

// Cursor & layering
showWinnerButton.style.cursor = 'pointer';
showWinnerButton.style.zIndex = '100';
showWinnerButton.style.transition = 'all 0.3s ease';

// Hover effect
showWinnerButton.addEventListener('mouseover', () => {
  showWinnerButton.style.opacity = '1';
  showWinnerButton.style.transform = 'scale(1.05)';
  showWinnerButton.style.background = 'linear-gradient(135deg, #4e54c8, #8f94fb)';
  showWinnerButton.style.color = '#fff';
});

showWinnerButton.addEventListener('mouseout', () => {
  showWinnerButton.style.opacity = '0.7';
  showWinnerButton.style.transform = 'scale(1)';
  showWinnerButton.style.background = 'linear-gradient(135deg, #2c2c2c, #1a1a1a)';
  showWinnerButton.style.color = '#f0f0f0';
});

// Append to page
document.body.appendChild(showWinnerButton);


// -----------------------------------------------
// When button is clicked, show latest & previous winner
// -----------------------------------------------
showWinnerButton.addEventListener('click', () => {
  const latest = localStorage.getItem('latestWinner');
  const prev = localStorage.getItem('previousWinner');

  if (latest) {
    winnerDisplay.innerHTML = `
    <div style="
    padding: 14px 16px;
    background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.2));
    border-radius: 12px;
    margin-bottom: 14px;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 4px 25px rgba(255, 215, 0, 0.3);
    backdrop-filter: blur(4px);
  ">
    <div style="
      font-size: 16px;
      color: #FFD700;
      margin-bottom: 6px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    ">
      🥇 Latest Winner
    </div>
    <div style="
      font-size: 30px;
      font-weight: bold;
      color: #fffbe0;
      text-shadow: 0 0 12px #FFD700;
      text-align: center;
    ">
      ${latest}
    </div>
  </div>
  
    ${prev ? `
    <div style="
      padding: 14px 16px;
      background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.15));
      border-radius: 12px;
      margin-top: 14px;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 4px 20px rgba(176,196,222,0.2);
      backdrop-filter: blur(4px);
    ">
      <div style="
        font-size: 16px;
        color: #dcdcdc;
        margin-bottom: 6px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      ">
        🥈 Previous Winner
      </div>
      <div style="
        font-size: 26px;
        font-weight: bold;
        color: #cbd6e2;
        text-shadow: 0 0 10px rgba(200,220,255,0.4);
        text-align: center;
      ">
        ${prev}
      </div>
    </div>
  ` : ''}  
  `;
  
  } else {
    winnerDisplay.innerHTML = `⚠️ No winner data found yet.`;
  }

  // Toggle visibility
  winnerDisplay.style.display = winnerDisplay.style.display === 'none' ? 'block' : 'none';
});

// -----------------------------------------------
//  Create Quote Box (hidden initially)
// -----------------------------------------------
const quoteBox = document.createElement('div');
quoteBox.style.position = 'absolute';
quoteBox.style.top = '56%';
quoteBox.style.left = '50%';
quoteBox.style.transform = 'translate(-50%, -50%)';
quoteBox.style.textAlign = 'center';
quoteBox.style.opacity = '0';
quoteBox.style.zIndex = '100';
quoteBox.style.transition = 'opacity 1.5s ease';
quoteBox.style.pointerEvents = 'none';

quoteBox.innerHTML = `
  <div style="font-size: 36px; font-weight: bold; line-height: 1.5;">
  
    <div style="
      background: linear-gradient(90deg, #f0f0f0, #ffd6e8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
      margin-bottom: 18px;
      letter-spacing: 0.5px;
      white-space: nowrap;
    ">
      "One lucky ticket. One unforgettable moment."
    </div>

    <div style="
      font-size: 34px;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 0 16px rgba(160, 210, 255, 0.4);
      margin-bottom: 22px;
    ">
      Thanks for sharing this journey with NSA.
    </div>

    <div style="
      font-size: 22px;
      color: #ffffff;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(65, 108, 255, 0.8);
    ">
      — With love, NSA 🇳🇵
    </div>

  </div>
`;

document.body.appendChild(quoteBox);

// ==============
// TIMER BUTTON 
// ==============

// Create & measure message in hidden div
const measureText = document.createElement('div');
measureText.innerText = 'We will draw a raffle winner in:';
Object.assign(measureText.style, {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  fontSize: '18px',
  fontWeight: '600',
  fontFamily: 'Poppins, Arial, sans-serif',
  whiteSpace: 'nowrap',
  visibility: 'hidden',
});
document.body.appendChild(measureText);
const messageWidth = measureText.offsetWidth;
document.body.removeChild(measureText);

// Fixed timer button aligned over message
const timerButton = document.createElement('button');
timerButton.innerText = 'Start Timer';
Object.assign(timerButton.style, {
  position: 'fixed',
  top: '20px',
  left: `${20 + messageWidth / 2 - 80}px`, // center based on estimated button width (160px)
  zIndex: '300',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: '600',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.2))',
  color: '#FFD700',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  fontFamily: 'Poppins, Arial, sans-serif',
  transition: 'all 0.3s ease, opacity 0.8s ease',
  cursor: 'pointer',
});
document.body.appendChild(timerButton);

// Hover
timerButton.addEventListener('mouseenter', () => {
  timerButton.style.transform = 'scale(1.05)';
  timerButton.style.background = 'linear-gradient(135deg, #4e54c8, #8f94fb)';
  timerButton.style.color = '#fff';
});
timerButton.addEventListener('mouseleave', () => {
  timerButton.style.transform = 'scale(1)';
  timerButton.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.2))';
  timerButton.style.color = '#FFD700';
});

// ===============================
// Message + Timer Section 
// ===============================
const timerSection = document.createElement('div');
Object.assign(timerSection.style, {
  position: 'fixed',
  top: '80px',
  left: '20px',
  display: 'none',
  flexDirection: 'column',
  alignItems: 'flex-start',
  zIndex: '200',
});
document.body.appendChild(timerSection);

// Message
const infoText = document.createElement('div');
infoText.innerText = 'We will draw a raffle winner in:';
Object.assign(infoText.style, {
  fontSize: '18px',
  fontWeight: '700',
  fontFamily: 'Poppins, Arial, sans-serif',
  background: 'linear-gradient(90deg, #00C9FF, #92FE9D)', // teal to light green
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '1px 1px 6px rgba(0, 200, 255, 0.3), 0 0 10px rgba(146, 254, 157, 0.25)',
  marginBottom: '12px',
});

timerSection.appendChild(infoText);

// Timer Display
const timerDisplayContainer = document.createElement('div');
Object.assign(timerDisplayContainer.style, {
  background: 'linear-gradient(135deg, #111, #1e1e1e)',
  borderRadius: '10px',
  padding: '8px 18px',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 0 12px rgba(255,255,255,0.1)',
  alignSelf: 'center',
});
timerSection.appendChild(timerDisplayContainer);

const timerDisplay = document.createElement('div');
Object.assign(timerDisplay.style, {
  fontSize: '40px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: '#00FFAA',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(0,255,170,0.8)',
  fontFamily: 'monospace',
});
timerDisplay.innerText = '00:00';
timerDisplayContainer.appendChild(timerDisplay);

// ===============================
//  Timer Logic
// ===============================
let timerInterval;
let isTimerRunning = false;
let remainingTime = 900;
let lastClickTime = 0;
const doubleClickDelay = 300;

function updateTimer() {
  const mins = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const secs = (remainingTime % 60).toString().padStart(2, '0');
  timerDisplay.innerText = `${mins}:${secs}`;
}

function createTimerBurst() {
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '999',
  });
  document.body.appendChild(container);

  const emojis = ['🎉', '✨', '🕉️', '🪔', '🎊', '🙏'];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    Object.assign(el.style, {
      position: 'absolute',
      fontSize: `${Math.random() * 32 + 18}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: 'translate(-50%, -50%)',
      animation: `float-away-${i} 2s ease-out forwards`,
      textShadow: '0 0 8px rgba(255,255,255,0.8)',
    });
    container.appendChild(el);

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float-away-${i} {
        to {
          transform: translate(-50%, -150px) rotate(${Math.random() * 360}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 2500);
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  remainingTime = 900;
  updateTimer();
  isTimerRunning = true;

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimer();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      createTimerBurst();

      let flash = 0;
      const f = setInterval(() => {
        timerDisplay.style.color = flash % 2 ? 'white' : '#FF4B2B';
        flash++;
        if (flash > 6) clearInterval(f);
      }, 300);
    }
  }, 1000);
}

timerButton.addEventListener('click', (e) => {
  const now = Date.now();
  const diff = now - lastClickTime;

  if (diff < doubleClickDelay) {
    startTimer();
    timerSection.style.display = 'flex';
    lastClickTime = 0;
  } else {
    timerSection.style.display = timerSection.style.display === 'none' ? 'flex' : 'none';
    lastClickTime = now;
  }
});

// ===============================
// Fade On Main Start Click
// ===============================
const mainStartButton = document.querySelector('button');
mainStartButton.addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    isTimerRunning = false;
  }

  timerButton.style.opacity = '0';
  setTimeout(() => {
    timerButton.style.display = 'none';
  }, 800);

  timerSection.style.display = 'none';
});

// -----------------------------------------------
//  Main Animation Loop — Runs Every Frame
// -----------------------------------------------

function animateScene(timestamp) {
  requestAnimationFrame(animateScene); // Keep the loop going

  //  Update time uniform in shader material
  cubes.forEach(cube => {
    if (cube.material.uniforms && cube.material.uniforms.time) {
      cube.material.uniforms.time.value = timestamp * 0.001;
    }
  });

  //  Animate background particles to slowly rotate
  particleMesh.rotation.x += 0.0002;
  particleMesh.rotation.y += 0.0001;

  // -----------------------------------------------
  //  STAGE 0: Cubes Revolving in a Circle
  // -----------------------------------------------
  if (revolveStartTime !== null) {
    const elapsed = timestamp - revolveStartTime;

    if (animationStage === 0) {
      cubes.forEach((cube, i) => {
        const radius = 5;
        const angleOffset = i * (Math.PI / 3);
        const angle = angleOffset + (elapsed * 0.003) * rotationSpeed;

        cube.position.x = Math.cos(angle) * radius;
        cube.position.y = Math.sin(angle) * radius;

        // Gradually slow the rotation after some time
        if (elapsed > animationTimeline.revolvingDuration * 5) {
          rotationSpeed *= 0.999;
        }
      });

      // Transition to next stage after revolving duration
      if (elapsed >= animationTimeline.revolvingDuration) {
        animationStage = 1;
        transitionStartTime = timestamp;

        // Start the background music with fade-in
        bgMusic.play().catch(e => console.log("Music play failed:", e));

        let fadeInInterval = setInterval(() => {
          if (bgMusic.volume < 0.3) {
            bgMusic.volume += 0.05;
         } else {
            clearInterval(fadeInInterval);
         }
       }, 200);


        // Animate cubes forming a straight line, one by one
        cubes.forEach((cube, i) => {
          anime({
            targets: cube.position,
            x: (i - 2.5) * 2, // Line them up centered
            y: 0,
            z: 0,
            easing: 'easeInOutQuart',
            duration: animationTimeline.lineFormationDuration,
            delay: i * 200,
            complete: () => {
              // Stop each cube's rotation after lining up
              anime({
                targets: cube.rotation,
                x: 0,
                y: 0,
                z: 0,
                duration: 500,
                easing: 'easeOutQuad',
              });
            }
          });
        });
      }
    }

    // -----------------------------------------------
    //  STAGE 1: Line Formation Complete — Prepare Final
    // -----------------------------------------------
    else if (animationStage === 1) {
      const transitionElapsed = timestamp - transitionStartTime;

      if (transitionElapsed >= animationTimeline.lineFormationDuration + animationTimeline.finalNumberDelay) {
        animationStage = 2;

             // --------------------
            // Store winner to localStorage
            // --------------------
        let prev = localStorage.getItem("latestWinner");
        if (prev) {
          localStorage.setItem("previousWinner", prev); // Move previous to slot 2
        }
        localStorage.setItem("latestWinner", numberRandom); // Save current to slot 1


        // Animate cubes jumping up and fading out to reveal final number
        cubes.forEach((cube, i) => {
          anime({
            targets: cube.position,
            y: {
              value: 5,
              duration: 1500,
              easing: 'easeOutQuad'
            },
            z: {
              value: 0,
              duration: 2000,
              easing: 'easeInOutQuad'
            },
            opacity: {
              value: 0,
              duration: 1000,
              easing: 'linear'
            },
            delay: i * 100,
            complete: () => {
              // Only trigger final number animation once (after last cube)
              if (i === cubes.length - 1) {
                animateFinalNumber(); // 🎉 Trigger final number display
                cancelAnimationFrame(cubes); // (possibly not needed here, but in code)
              }
            }
          });
        });

        // -----------------------------------------------
        //  Animate Progress Counter From 0% to 100%
        // -----------------------------------------------

        // Fade-in the counter UI
        anime({
          targets: progressCounterDiv,
          opacity: 1,
          duration: 1000,
          easing: 'easeInOutQuad'
        });

        // Animate the counter value from 0 → 100
        anime({
          targets: { count: 0 },
          count: 100,
          duration: 3000,
          easing: 'easeInOutQuad',
          round: 1,
          update: function(anim) {
            progressCounterDiv.innerHTML = Math.round(anim.animations[0].currentValue) + '%';
          },
          complete: function() {
            // 🎊 After 100%, change text to "Congratulations Raffle Winner"
            setTimeout(() => {
              anime({
                targets: progressCounterDiv,
                opacity: 0,
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: function() {
                  progressCounterDiv.innerHTML = "Congratulations Raffle Winner";
                  progressCounterDiv.style.fontSize = '50px';

                  // Fade in the new message
                  anime({
                    targets: progressCounterDiv,
                    opacity: 1,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                    complete: function() {
                      anime({
                        targets: replayButton,
                        opacity: 1,
                        scale: [0.8, 1],
                        duration: 800,
                        easing: 'easeOutBack'
                      });
                    }
                  });
                }
              });
            }, 1000); // Wait 1 sec after reaching 100%
          }
        });
      }
    }
  }

  // -----------------------------------------------
  //  Render Final Scene
  // -----------------------------------------------
  renderer.render(scene, camera);
}
// -----------------------------------------------
// Background Music Setup (starts silent)
// -----------------------------------------------
const bgMusic = new Audio('relaxing-145038.mp3');
bgMusic.volume = 0.0; // Start muted for a gentle fade-in
bgMusic.loop = true; // Loop the track continuously

// -----------------------------------------------
// Animate Final Number Display
// -----------------------------------------------
function animateFinalNumber() {
  //  Pull the camera back a little for a wider shot
  anime({
    targets: camera.position,
    z: 19,
    duration: 2000,
    easing: 'easeInOutQuad'
  });

  //  Bring the final number toward the camera
  anime({
    targets: finalNumberDisplay.position,
    z: 0,
    duration: 2000,
    easing: 'easeOutElastic(1, 0.5)'
  });

  // Ensure final number renders above cubes
  finalNumberDisplay.renderOrder = 999;
  finalNumberDisplay.children.forEach((digit) => {
    digit.renderOrder = 999;
  });

  // ✨ Animate each digit: fade in + pop effect
  finalNumberDisplay.children.forEach((digit, i) => {
    anime({
      targets: digit.material,
      opacity: 1,
      duration: 1000,
      delay: 500 + i * 300,
      easing: 'easeInOutQuad'
    });

    anime({
      targets: digit.scale,
      x: [0, 1.2, 1],
      y: [0, 1.2, 1],
      z: [0, 1.2, 1],
      duration: 2000,
      delay: 500 + i * 300,
      easing: 'easeOutElastic(1, 0.3)'
    });
  });

  // 🌠 Add particle burst after digits pop in
  setTimeout(() => {
    createParticleBurst();
  }, 3000);

  // -----------------------------------------------
  //  Animate Final Number Floating Up
  // -----------------------------------------------
  setTimeout(() => {
    anime({
      targets: finalNumberDisplay.position,
      y: 8,
      duration: 3000,
      easing: 'easeInOutQuad'
    });

    // -----------------------------------------------
    //  Fade out all cubes while they drift backward + dissolve
    // -----------------------------------------------
    cubes.forEach((cube) => {
      let driftSpeed = 0.02;
      let fadeSpeed = 0.005;

      // Manual fading for shader + cube textures
      let fadeAndDrift = () => {
        // Drift the cube backward
        cube.position.z -= driftSpeed;

        // Fade the shader cube body
        if (cube.material.uniforms && cube.material.uniforms.opacity) {
          const currentOpacity = cube.material.uniforms.opacity.value;
          if (currentOpacity > 0) {
            cube.material.uniforms.opacity.value = currentOpacity - fadeSpeed;
          }
        }

        // Fade the number textures on the cube
        cube.children.forEach(child => {
          if (child.material.opacity > 0) {
            child.material.opacity -= fadeSpeed;
          }
        });

        // Keep fading until all are invisible
        if (
          cube.material.uniforms?.opacity?.value > 0 ||
          cube.children.some(child => child.material.opacity > 0)
        ) {
          requestAnimationFrame(fadeAndDrift);
        } else {
          cube.visible = false;
        }
      };

      fadeAndDrift();
    });

    // -----------------------------------------------
    //  Fade in the Final Quote
    // -----------------------------------------------
    setTimeout(() => {
      quoteBox.style.opacity = '1';
    }, 2500); // after the number starts floating

  }, 4000); // after particle burst
}

// -----------------------------------------------
//  Particle Burst Effect from Final Number
// -----------------------------------------------
function createParticleBurst() {
  const burstGeometry = new THREE.BufferGeometry();
  const burstCount = 300;

  const burstPositions = new Float32Array(burstCount * 3);
  const burstColors = new Float32Array(burstCount * 3);

  // 🎨 Initialize all particles at center with random color
  for (let i = 0; i < burstCount * 3; i += 3) {
    burstPositions[i] = 0;
    burstPositions[i + 1] = 0;
    burstPositions[i + 2] = 0;

    burstColors[i] = Math.random();                    // R
    burstColors[i + 1] = 0.3 + Math.random() * 0.3;    // G
    burstColors[i + 2] = Math.random();                // B
  }

  burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
  burstGeometry.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));

  const burstMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 1
  });

  const burstParticles = new THREE.Points(burstGeometry, burstMaterial);
  finalNumberDisplay.add(burstParticles);

  // 🚀 Animate each particle flying outward in a random direction
  for (let i = 0; i < burstCount; i++) {
    const i3 = i * 3;

    // Random spherical direction and speed
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI * 2;
    const targetX = Math.sin(angle1) * Math.cos(angle2) * (5 + Math.random() * 10);
    const targetY = Math.sin(angle1) * Math.sin(angle2) * (5 + Math.random() * 10);
    const targetZ = Math.cos(angle1) * (5 + Math.random() * 10);

    anime({
      targets: { x: 0, y: 0, z: 0 },
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1500 + Math.random() * 1000,
      easing: 'easeOutCubic',
      update: function(anim) {
        const obj = anim.animatables[0].target;
        burstGeometry.attributes.position.array[i3] = obj.x;
        burstGeometry.attributes.position.array[i3 + 1] = obj.y;
        burstGeometry.attributes.position.array[i3 + 2] = obj.z;
        burstGeometry.attributes.position.needsUpdate = true;
      }
    });
  }

  // 🕊️ Fade out the burst effect smoothly after delay
  anime({
    targets: burstMaterial,
    opacity: 0,
    duration: 3000,
    easing: 'easeInQuad',
    delay: 1500
  });
}

// -----------------------------------------------
//  Subtle Idle Camera Animation Loop
// -----------------------------------------------
function animateCamera() {
  anime({
    targets: camera.position,
    x: [0, 1, -1, 0],
    y: [2, 2.5, 1.5, 2],
    duration: 20000,
    easing: 'easeInOutSine',
    loop: true // Keeps the camera moving softly forever
  });
}

// -----------------------------------------------
//  Start the Scene + Camera Animation
// -----------------------------------------------
animateScene();   // Start full scene render loop
animateCamera();  // Begin gentle camera motion









