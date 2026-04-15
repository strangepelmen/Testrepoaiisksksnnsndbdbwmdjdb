let co2 = 0;
const CO2_TO_VOLUME = 0.55;

const co2El = document.getElementById("co2");
const volumeEl = document.getElementById("volume");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene"),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 5;

let geometry = new THREE.BufferGeometry();
let count = 1000;
let positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

let material = new THREE.PointsMaterial({
  size: 0.05,
  transparent: true,
  opacity: 0.5
});

let points = new THREE.Points(geometry, material);
scene.add(points);

function addCO2(amount) {
  co2 += amount;
  updateUI();
  updateCloud();
  localStorage.setItem("co2", co2);
}

function updateUI() {
  co2El.innerText = co2.toFixed(2);
  volumeEl.innerText = (co2 * CO2_TO_VOLUME).toFixed(2);
}

function updateCloud() {
  let scale = 1 + (co2 / 50);
  points.scale.set(scale, scale, scale);
}

function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

(function load(){
  const saved = localStorage.getItem("co2");
  if (saved) {
    co2 = parseFloat(saved);
    updateUI();
    updateCloud();
  }
})();

function share() {
  const url = `${window.location.origin}?friend=${co2}`;
  navigator.clipboard.writeText(url);
  alert("Link copied!");
}

function download() {
  html2canvas(document.body).then(canvas => {
    let link = document.createElement("a");
    link.download = "ecovolume.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
