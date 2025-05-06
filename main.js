// // Importing necessary libraries from a CDN (Content Delivery Network)
// // THREE.js handles 3D graphics, anime.js handles animations
// import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// import anime from 'https://unpkg.com/animejs@3.2.1/lib/anime.es.js';

// // Create a 3D scene
// const scene = new THREE.Scene();

// // Set up the camera to view the scene from a certain distance and angle
// const camera = new THREE.PerspectiveCamera(
//   75, // Field of view (how wide the camera sees)
//   window.innerWidth / window.innerHeight, // Aspect ratio
//   0.1, // Near clipping plane
//   1000 // Far clipping plane
// );
// camera.position.z = 10; // Move the camera backwards along the Z-axis

// // Create the renderer that draws the 3D scene onto the screen
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement); // Add the canvas to the HTML body

// // Load a background image texture
// const textureLoader = new THREE.TextureLoader();
// const backgroundTexture = textureLoader.load('st.jpg', (texture) => {
//   texture.minFilter = THREE.LinearFilter;
//   texture.magFilter = THREE.LinearFilter;
//   texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//   texture.encoding = THREE.sRGBEncoding;
// });

// // Create a flat plane (rectangle) for the background image
// const imgAspectRatio = 1920 / 1080;
// const planeHeight = 80;
// const planeWidth = planeHeight * imgAspectRatio;
// const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
// const planeMaterial = new THREE.MeshBasicMaterial({
//   map: backgroundTexture,
//   side: THREE.DoubleSide,
//   transparent: true,
//   opacity: 1
// });
// const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
// backgroundPlane.position.z = -35; // Push background further away so it's behind other objects
// scene.add(backgroundPlane); // Add it to the scene

// // Function to create a square texture with a number and the text "Nepal"
// function createNumberTexture(number) {
//   const size = 128; // Canvas size in pixels
//   const canvas = document.createElement('canvas');
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext('2d');

//   // Draw black background
//   ctx.fillStyle = 'black';
//   ctx.fillRect(0, 0, size, size);

//   // Draw large white number
//   ctx.fillStyle = 'white';
//   ctx.font = 'bold 64px Arial';
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText(number.toString(), size / 2, size / 2); 

//   // Draw small red "Nepal" below the number
//   ctx.fillStyle = 'red';
//   ctx.font = 'bold 16px Arial';
//   ctx.fillText("Nepal", size / 2, size - 20);

//   // Convert canvas to texture
//   const texture = new THREE.CanvasTexture(canvas);
//   return texture;
// }

// // Shader (custom color logic) for linear gradient from left to right
// const linearGradientShader = {
//   uniforms: {
//     color1: { value: new THREE.Color(0xff0000) }, // Red
//     color2: { value: new THREE.Color(0x0000ff) }, // Blue
//   },
//   vertexShader: `
//     varying vec3 vPosition;
//     void main() {
//       vPosition = position;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   fragmentShader: `
//     uniform vec3 color1;
//     uniform vec3 color2;
//     varying vec3 vPosition;

//     void main() {
//       float gradient = (vPosition.x + 1.0) / 2.0;
//       vec3 color = mix(color1, color2, gradient);
//       gl_FragColor = vec4(color, 1.0);
//     }
//   `
// };

// // Create 6 cubes with gradient color and number/label
// const cubes = [];
// const cubeSize = 1;
// const spacing = 3; // Not used here, since we animate positions

// for (let i = 0; i < 6; i++) {
//   const randomNum = Math.floor(Math.random() * 10); // Random number 0-9
//   const numberTexture = createNumberTexture(randomNum); // Make texture

//   const gradientMaterial = new THREE.ShaderMaterial(linearGradientShader); // Gradient color material
//   const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize); // Create cube geometry
//   const cube = new THREE.Mesh(cubeGeometry, gradientMaterial);
//   cube.visible = false; // Hide cube at start

//   cube.position.set(0, 0, 0); // All cubes start from center
//   cubes.push(cube);
//   scene.add(cube);

//   // Add number and "Nepal" texture as a floating label on the cube
//   const numberPlaneGeometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
//   const numberPlaneMaterial = new THREE.MeshBasicMaterial({ map: numberTexture, transparent: true });
//   const numberPlane = new THREE.Mesh(numberPlaneGeometry, numberPlaneMaterial);
//   numberPlane.position.z = 0.51; // Slightly in front of cube
//   cube.add(numberPlane);
// }

// // HTML elements for welcome text
// const welcomeTextContainer = document.createElement('div');
// welcomeTextContainer.style.position = 'absolute';
// welcomeTextContainer.style.top = '40%';
// welcomeTextContainer.style.left = '50%';
// welcomeTextContainer.style.transform = 'translate(-50%, -50%)';
// welcomeTextContainer.style.textAlign = 'center';

// // First line: "WELCOME TO NSA-"
// const welcomeTextLine1 = document.createElement('div');
// welcomeTextLine1.style.fontSize = '50px';
// welcomeTextLine1.style.fontWeight = 'bold';
// welcomeTextLine1.style.color = '#ffffff';
// welcomeTextLine1.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5)';
// welcomeTextLine1.innerHTML = "WELCOME TO NSA-";
// welcomeTextContainer.appendChild(welcomeTextLine1);

// // Second line: "Graduating Students'"
// // Create a second line: "Graduating Students'"
// const welcomeTextLine2 = document.createElement('div');
// welcomeTextLine2.style.fontSize = '70px';
// welcomeTextLine2.style.fontWeight = 'bold';
// welcomeTextLine2.style.color = '#ffffff';
// welcomeTextLine2.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5)';
// welcomeTextLine2.style.marginTop = '10px';
// welcomeTextLine2.innerHTML = "Graduating Students'";
// welcomeTextContainer.appendChild(welcomeTextLine2);

// // Third line: "Farewell Event"
// const welcomeTextLine3 = document.createElement('div');
// welcomeTextLine3.style.fontSize = '60px';
// welcomeTextLine3.style.fontWeight = 'bold';
// welcomeTextLine3.style.color = '#ffffff';
// welcomeTextLine3.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5)';
// welcomeTextLine3.style.marginTop = '10px';
// welcomeTextLine3.innerHTML = "Farewell Event";
// welcomeTextContainer.appendChild(welcomeTextLine3);

// document.body.appendChild(welcomeTextContainer); // Add to page

// // Create start button
// const startButton = document.createElement('button');
// startButton.style.position = 'absolute';
// startButton.style.top = '60%';
// startButton.style.left = '50%';
// startButton.style.transform = 'translateX(-50%)';
// startButton.style.padding = '15px 40px';
// startButton.style.fontSize = '22px';
// startButton.style.fontWeight = 'bold';
// startButton.style.borderRadius = '10px';
// startButton.style.border = 'none';
// startButton.style.cursor = 'pointer';
// startButton.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
// startButton.style.color = 'white';
// startButton.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
// startButton.style.transition = 'all 0.3s ease';
// startButton.innerHTML = 'सुरु गरौँ है त'; // Nepali for “Let’s begin”

// // Hover effects for button
// startButton.addEventListener('mouseover', () => {
//   startButton.style.transform = 'translateX(-50%) scale(1.05)';
//   startButton.style.boxShadow = '0 12px 20px rgba(255, 75, 43, 0.5)';
// });
// startButton.addEventListener('mouseout', () => {
//   startButton.style.transform = 'translateX(-50%)';
//   startButton.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
// });
// document.body.appendChild(startButton); // Add button to page

// // ==== CONTROL ANIMATION SPEED HERE ====
// let rotationSpeed = -5; // <== CHANGE THIS VALUE to control how fast the cubes revolve (e.g. 0.5 for slower, 2 for faster)

// let revolveStartTime = null; // Track when revolution started
// let transitionStartTime = null; // Track when transition to linear arrangement starts

// // When button is clicked, hide welcome text and animate cubes
// startButton.addEventListener('click', () => {
//   // Animate welcome text to fade and move up
//   anime({
//     targets: welcomeTextContainer,
//     translateY: '-200px',
//     opacity: 0,
//     duration: 2000,
//     easing: 'easeInOutQuad',
//     complete: () => {
//       welcomeTextContainer.style.display = 'none';
//     }
//   });

//   // Animate button to fade and move up
//   anime({
//     targets: startButton,
//     translateY: '-200px',
//     opacity: 0,
//     duration: 2000,
//     easing: 'easeInOutQuad',
//     complete: () => {
//       startButton.style.display = 'none';

//       // Show cubes
//       cubes.forEach(cube => cube.visible = true);

//       // Animate cubes spreading out in a circle
//       anime({
//         targets: cubes.map(c => c.position),
//         x: (el, i) => Math.cos(i * Math.PI / 3) * 5,
//         y: (el, i) => Math.sin(i * Math.PI / 3) * 5,
//         scale: [0, 1],
//         duration: 2000,
//         easing: 'easeInOutSine',
//         complete: () => {
//           // Start revolving animation after spread completes
//           revolveStartTime = performance.now();
//         }
//       });
//     }
//   });
// });

// // Animation loop that runs every frame
// function animateScene(timestamp) {
//     requestAnimationFrame(animateScene);
  
//     // If revolution has started, rotate cubes around the center
//     if (revolveStartTime !== null) {
//       const elapsed = (timestamp - revolveStartTime) / 1000; // Time in seconds
//       cubes.forEach((cube, i) => {
//         const radius = 5;
//         const angleOffset = i * (Math.PI / 3);
//         const angle = angleOffset + elapsed * rotationSpeed;
//         cube.position.x = Math.cos(angle) * radius;
//         cube.position.y = Math.sin(angle) * radius;
//       });
  
//       // Check if 5 seconds have passed, then start transition to linear arrangement
//       if (!transitionStartTime && elapsed >= 5) {
//         transitionStartTime = elapsed; // Record the transition start time
  
//         // Start the transition to linear arrangement one cube at a time
//         cubes.forEach((cube, i) => {
//           anime({
//             targets: cube.position,
//             x: i, // Spread cubes in a line along the X-axis
//             y: 0, // Keep cubes on the same horizontal plane
//             z: 0, // Optional: keep cubes flat
//             easing: 'easeInOutQuad',
//             duration: 2000, // Transition duration
//             delay: i * 300, // Stagger the movement of each cube by 300ms
//             complete: () => {
//               // Make cubes face forward after transition completes
//               cube.rotation.x = Math.PI / 2; // Cube faces forward
//               cube.rotation.y = 0; // Cube faces forward
//               cube.rotation.z = 0; // Cube faces forward
//             }
//           });
//         });
  
//         // Stop the rotation after transition completes
//         revolveStartTime = null;
//       }
//     }
  
//     renderer.render(scene, camera); // Draw everything
// }

// animateScene(); // Start animation loop





// claude code 


// Importing necessary libraries from CDN
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import anime from 'https://unpkg.com/animejs@3.2.1/lib/anime.es.js';

// Create a 3D scene
const scene = new THREE.Scene();

// Add subtle fog for depth
scene.fog = new THREE.FogExp2(0x000000, 0.008);

// Set up the camera with improved positioning
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;
camera.position.y = 2;

// Create the renderer with improved settings
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// Add directional light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Add point lights for dramatic effect
const pointLight1 = new THREE.PointLight(0xff4b2b, 1, 50);
pointLight1.position.set(10, 5, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x416cff, 1, 50);
pointLight2.position.set(-10, -5, 10);
scene.add(pointLight2);

// Load a background image texture
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('st.jpg', (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.encoding = THREE.sRGBEncoding;
});

// Create a flat plane for the background image
const imgAspectRatio = 1920 / 1080;
const planeHeight = 80;
const planeWidth = planeHeight * imgAspectRatio;
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8
});
const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
backgroundPlane.position.z = -40;
scene.add(backgroundPlane);

// Add particles for a starfield effect
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 2000;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  // Position stars in a spherical volume
  posArray[i] = (Math.random() - 0.5) * 100;     // x
  posArray[i + 1] = (Math.random() - 0.5) * 100; // y
  posArray[i + 2] = (Math.random() - 0.5) * 100; // z
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8
});

const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

// Function to create a more visually appealing texture with a number and the text "Nepal"
function createNumberTexture(number) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#ff416c');
  gradient.addColorStop(1, '#ff4b2b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add glow effect
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 15;
  
  // Draw large number
  ctx.fillStyle = 'white';
  ctx.font = 'bold 128px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(number.toString(), size / 2, size / 2);

  // Draw "Nepal" with stylish font
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic bold 28px Arial';
  ctx.fillText("Nepal", size / 2, size - 40);

  // Convert canvas to texture
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Enhanced shader material with better gradient and animation properties
const enhancedGradientShader = {
  uniforms: {
    color1: { value: new THREE.Color(0xff416c) },
    color2: { value: new THREE.Color(0x416cff) },
    time: { value: 0 }
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
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      float gradient = (vUv.x + sin(time * 2.0) * 0.1) * 0.8 + 0.1;
      vec3 color = mix(color1, color2, gradient);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Create cubes with enhanced materials
const cubes = [];
const cubeSize = 1.2;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

// Generate cubes with random numbers
for (let i = 0; i < 6; i++) {
  const randomNum = Math.floor(Math.random() * 10);
  const numberTexture = createNumberTexture(randomNum);

  // Create material with custom shader
  const gradientMaterial = new THREE.ShaderMaterial({
    ...enhancedGradientShader,
    transparent: true,
    opacity: 0.9
  });
  
  // Create cube
  const cube = new THREE.Mesh(cubeGeometry, gradientMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.visible = false;
  cube.position.set(0, 0, 0);
  cube.userData.number = randomNum; // Store the number for later use
  
  // Add number texture as a label
  const numberPlaneGeometry = new THREE.PlaneGeometry(cubeSize * 0.9, cubeSize * 0.9);
  const numberPlaneMaterial = new THREE.MeshBasicMaterial({ 
    map: numberTexture, 
    transparent: true,
    opacity: 0.95
  });
  const numberPlane = new THREE.Mesh(numberPlaneGeometry, numberPlaneMaterial);
  numberPlane.position.z = cubeSize / 2 + 0.01;
  cube.add(numberPlane);
  
  // Add a similar plane for the back
  const backPlane = numberPlane.clone();
  backPlane.position.z = -(cubeSize / 2 + 0.01);
  backPlane.rotation.y = Math.PI;
  cube.add(backPlane);

  // Add planes for other sides
  const rightPlane = numberPlane.clone();
  rightPlane.position.z = 0;
  rightPlane.position.x = cubeSize / 2 + 0.01;
  rightPlane.rotation.y = Math.PI / 2;
  cube.add(rightPlane);

  const leftPlane = numberPlane.clone();
  leftPlane.position.z = 0;
  leftPlane.position.x = -(cubeSize / 2 + 0.01);
  leftPlane.rotation.y = -Math.PI / 2;
  cube.add(leftPlane);

  cubes.push(cube);
  scene.add(cube);
}

// Create a final big display number (we'll use 2025 for the graduation year)
const createFinalNumberDisplay = () => {
  const finalNumber = 2025; // Graduation year
  
  // Create group to hold all digits
  const numberGroup = new THREE.Group();
  numberGroup.position.set(0, 0, 20); // Position it off-screen initially
  scene.add(numberGroup);
  
  // Convert number to array of digits
  const digits = finalNumber.toString().split('');
  
  // Create a mesh for each digit
  digits.forEach((digit, index) => {
    const digitTexture = createNumberTexture(digit);
    
    // Create larger geometry for the final number
    const digitGeometry = new THREE.PlaneGeometry(3, 3);
    const digitMaterial = new THREE.MeshBasicMaterial({
      map: digitTexture,
      transparent: true,
      opacity: 0
    });
    
    const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
    // Position digits next to each other
    digitMesh.position.x = (index - (digits.length - 1) / 2) * 3.5;
    
    numberGroup.add(digitMesh);
  });
  
  return numberGroup;
};

// Create the final number display but keep it hidden
const finalNumberDisplay = createFinalNumberDisplay();

// HTML elements for welcome text
const welcomeTextContainer = document.createElement('div');
welcomeTextContainer.style.position = 'absolute';
welcomeTextContainer.style.top = '40%';
welcomeTextContainer.style.left = '50%';
welcomeTextContainer.style.transform = 'translate(-50%, -50%)';
welcomeTextContainer.style.textAlign = 'center';
welcomeTextContainer.style.zIndex = '100';

// First line: "WELCOME TO NSA-"
const welcomeTextLine1 = document.createElement('div');
welcomeTextLine1.style.fontSize = '50px';
welcomeTextLine1.style.fontWeight = 'bold';
welcomeTextLine1.style.color = '#ffffff';
welcomeTextLine1.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 75, 43, 0.8)';
welcomeTextLine1.innerHTML = "WELCOME TO NSA-";
welcomeTextContainer.appendChild(welcomeTextLine1);

// Second line: "Graduating Students'"
const welcomeTextLine2 = document.createElement('div');
welcomeTextLine2.style.fontSize = '70px';
welcomeTextLine2.style.fontWeight = 'bold';
welcomeTextLine2.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
welcomeTextLine2.style.WebkitBackgroundClip = 'text';
welcomeTextLine2.style.WebkitTextFillColor = 'transparent';
welcomeTextLine2.style.textShadow = '2px 2px 10px rgba(255, 65, 108, 0.5)';
welcomeTextLine2.style.marginTop = '10px';
welcomeTextLine2.innerHTML = "Graduating Students'";
welcomeTextContainer.appendChild(welcomeTextLine2);

// Third line: "Farewell Event"
const welcomeTextLine3 = document.createElement('div');
welcomeTextLine3.style.fontSize = '60px';
welcomeTextLine3.style.fontWeight = 'bold';
welcomeTextLine3.style.color = '#ffffff';
welcomeTextLine3.style.textShadow = '2px 2px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(65, 108, 255, 0.8)';
welcomeTextLine3.style.marginTop = '10px';
welcomeTextLine3.innerHTML = "Farewell Event";
welcomeTextContainer.appendChild(welcomeTextLine3);

document.body.appendChild(welcomeTextContainer);

// Create start button with enhanced styling
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
startButton.innerHTML = 'सुरु गरौँ है त'; // Nepali for "Let's begin"

// Enhanced hover effects for button
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

// Animation control variables
let rotationSpeed = -1.2; // Slower rotation for more elegance
let revolveStartTime = null;
let transitionStartTime = null;
let animationStage = 0; // Track current animation stage

// Animation Timeline
let animationTimeline = {
  initialDelay: 0,
  revolvingDuration: 8000, // 8 seconds of revolving
  lineFormationDuration: 2000, // 2 seconds to form a line
  finalNumberDelay: 2000, // 2 seconds after line formation before showing final number
};

// When button is clicked, start the animation sequence
startButton.addEventListener('click', () => {
  // Play a click sound effect
  const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3');
  clickSound.volume = 0.5;
  clickSound.play().catch(e => console.log("Audio play failed:", e));

  // Animate welcome text with more dramatic effect
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

  // Animate button
  anime({
    targets: startButton,
    translateY: '200px',
    opacity: 0,
    scale: 0.5,
    duration: 1500,
    easing: 'easeInOutQuad',
    complete: () => {
      startButton.style.display = 'none';

      // Show cubes
      cubes.forEach(cube => cube.visible = true);

      // Animate cubes spreading out in a circle with cooler effects
      anime({
        targets: cubes.map(c => c.position),
        x: (el, i) => Math.cos(i * Math.PI / 3) * 5,
        y: (el, i) => Math.sin(i * Math.PI / 3) * 5,
        z: [
          {value: -10, duration: 300, easing: 'easeOutQuad'},
          {value: 0, duration: 1000, easing: 'easeOutElastic(1, 0.5)'}
        ],
        delay: anime.stagger(150),
        duration: 2000,
        easing: 'easeInOutSine',
        complete: () => {
          // Start revolving animation
          revolveStartTime = performance.now();
          
          // After cubes appear, make stars twinkle
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
      
      // Animate cubes rotation
      cubes.forEach((cube, i) => {
        anime({
          targets: cube.rotation,
          x: Math.PI * 2,
          y: Math.PI * 2,
          duration: 4000,
          delay: i * 100,
          easing: 'easeInOutSine',
          loop: true
        });
      });
    }
  });
});

// Create a "progress" counter to show at the end
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
progressCounterDiv.style.opacity = '0';
progressCounterDiv.style.zIndex = '100';
progressCounterDiv.innerHTML = progressCounter + '%';
document.body.appendChild(progressCounterDiv);

// Animation loop with enhanced effects
function animateScene(timestamp) {
  requestAnimationFrame(animateScene);
  
  // Update shader time uniform for all cubes
  cubes.forEach(cube => {
    if (cube.material.uniforms && cube.material.uniforms.time) {
      cube.material.uniforms.time.value = timestamp * 0.001;
    }
  });
  
  // Update particles rotation
  particleMesh.rotation.x += 0.0002;
  particleMesh.rotation.y += 0.0001;
  
  // If revolution has started, rotate cubes around the center
  if (revolveStartTime !== null) {
    const elapsed = timestamp - revolveStartTime;
    
    // Stage 1: Revolving in a circle
    if (animationStage === 0) {
      cubes.forEach((cube, i) => {
        const radius = 5;
        const angleOffset = i * (Math.PI / 3);
        const angle = angleOffset + (elapsed * 0.001) * rotationSpeed;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.y = Math.sin(angle) * radius;
        
        // Make the rotation speed gradually slow down
        if (elapsed > animationTimeline.revolvingDuration * 0.7) {
          rotationSpeed *= 0.999; // Gradually slow down
        }
      });
      
      // Check if revolving time has completed
      if (elapsed >= animationTimeline.revolvingDuration) {
        animationStage = 1; // Move to next stage
        transitionStartTime = timestamp;
        
        // Start the transition to linear arrangement one cube at a time
        cubes.forEach((cube, i) => {
          anime({
            targets: cube.position,
            x: (i - 2.5) * 2, // Center the line of cubes
            y: 0,
            z: 0,
            easing: 'easeInOutQuart',
            duration: animationTimeline.lineFormationDuration,
            delay: i * 200,
            complete: () => {
              // Stop cube rotation
              anime({
                targets: cube.rotation,
                x: 0,
                y: 0,
                z: 0,
                duration: 1000,
                easing: 'easeOutQuad'
              });
            }
          });
        });
      }
    }
    
    // Stage 2: Line formation and cube preparation
    else if (animationStage === 1) {
      const transitionElapsed = timestamp - transitionStartTime;
      
      // Check if line formation is complete
      if (transitionElapsed >= animationTimeline.lineFormationDuration + animationTimeline.finalNumberDelay) {
        animationStage = 2; // Move to next stage
        
        // Animate the cubes to jump up and reveal final number
        cubes.forEach((cube, i) => {
          anime({
            targets: cube.position,
            y: {
              value: 5,
              duration: 1500,
              easing: 'easeOutQuad'
            },
            z: {
              value: -15,
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
              if (i === cubes.length - 1) {
                // Show the final number after all cubes are gone
                animateFinalNumber();
              }
            }
          });
        });
        
        // Start the progress counter animation
        anime({
          targets: progressCounterDiv,
          opacity: 1,
          duration: 1000,
          easing: 'easeInOutQuad'
        });
        
        // Animate the counter from 0 to 100
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
            // Change text after reaching 100%
            setTimeout(() => {
              anime({
                targets: progressCounterDiv,
                opacity: 0,
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: function() {
                  progressCounterDiv.innerHTML = "Congratulations Class of 2025!";
                  progressCounterDiv.style.fontSize = '50px';
                  anime({
                    targets: progressCounterDiv,
                    opacity: 1,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                  });
                }
              });
            }, 1000);
          }
        });
      }
    }
  }
  
  renderer.render(scene, camera);
}

// Function to animate the final number display
function animateFinalNumber() {
  // Move camera back slightly for better view
  anime({
    targets: camera.position,
    z: 25,
    duration: 2000,
    easing: 'easeInOutQuad'
  });
  
  // Bring in the final number display from z-distance
  anime({
    targets: finalNumberDisplay.position,
    z: 0,
    duration: 2000,
    easing: 'easeOutElastic(1, 0.5)'
  });
  
  // Fade in and scale up each digit
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
  
  // Add particles bursting from the final number
  setTimeout(() => {
    createParticleBurst();
  }, 3000);
}

// Function to create a particle burst effect
function createParticleBurst() {
  const burstGeometry = new THREE.BufferGeometry();
  const burstCount = 300;
  const burstPositions = new Float32Array(burstCount * 3);
  const burstColors = new Float32Array(burstCount * 3);
  
  for (let i = 0; i < burstCount * 3; i += 3) {
    // Start positions (center)
    burstPositions[i] = 0;
    burstPositions[i + 1] = 0;
    burstPositions[i + 2] = 0;
    
    // Random colors (red to blue gradient)
    burstColors[i] = Math.random();
    burstColors[i + 1] = 0.3 + Math.random() * 0.3;
    burstColors[i + 2] = Math.random();
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
  
  // Animate particles outward
  for (let i = 0; i < burstCount; i++) {
    const i3 = i * 3;
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI * 2;
    const speed = 0.05 + Math.random() * 0.1;
    const targetX = Math.sin(angle1) * Math.cos(angle2) * (5 + Math.random() * 10);
    const targetY = Math.sin(angle1) * Math.sin(angle2) * (5 + Math.random() * 10);
    const targetZ = Math.cos(angle1) * (5 + Math.random() * 10);
    
    anime({
      targets: {x: 0, y: 0, z: 0},
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
  
  // Fade out particles gradually
  anime({
    targets: burstMaterial,
    opacity: 0,
    duration: 3000,
    easing: 'easeInQuad',
    delay: 1500
  });
}

// Add a subtle camera animation`
function animateCamera() {
  anime({
    targets: camera.position,
    x: [0, 1, -1, 0],
    y: [2, 2.5, 1.5, 2],
    duration: 20000,
    easing: 'easeInOutSine',
    loop: true
  });
}

// Start animations
animateScene();
animateCamera();

// Add background music (uncomment if needed)
/*
const bgMusic = new Audio('https://example.com/background-music.mp3');
bgMusic.volume = 0.3;
bgMusic.loop = true;
startButton.addEventListener('click', () => {
  bgMusic.play().catch(e => console.log("Music play failed:", e));
});
*/