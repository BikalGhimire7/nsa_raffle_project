// Create a function to resize the background plane
function resizeBackgroundPlane() {
  // Get current window dimensions
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowAspect = windowWidth / windowHeight;
  
  // Get texture aspect ratio (original image dimensions)
  const imgAspectRatio = 1920 / 1080; // Replace with your image's actual ratio
  
  // Determine dimensions to cover entire screen
  let planeWidth, planeHeight;
  
  if (windowAspect > imgAspectRatio) {
    // Window is wider than image
    planeWidth = 2 * camera.position.z * Math.tan(camera.fov * Math.PI / 360) * windowAspect;
    planeHeight = planeWidth / imgAspectRatio;
  } else {
    // Window is taller than image
    planeHeight = 2 * camera.position.z * Math.tan(camera.fov * Math.PI / 360);
    planeWidth = planeHeight * imgAspectRatio;
  }
  
  // Update background plane size
  backgroundPlane.geometry.dispose();
  backgroundPlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  
  // Ensure background plane is far enough back to be visible
  backgroundPlane.position.z = -40;
}