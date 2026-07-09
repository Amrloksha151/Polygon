import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg')
});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const loader = new HDRLoader();
const myhdri = await loader.loadAsync('./textures/fireplace_2k.hdr');
myhdri.mapping = THREE.EquirectangularReflectionMapping;
scene.background = myhdri;
scene.environment = myhdri;

const myPhotoTexture = new THREE.TextureLoader().load('./textures/amrloksha.jpeg');
const myPhoto = new THREE.Mesh(new THREE.SphereGeometry(3, 30, 30), new THREE.MeshStandardMaterial({ map: myPhotoTexture }));
scene.add(myPhoto);
myPhoto.position.set(0, 0, -25);

const myCubicPhoto = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshStandardMaterial({ map: myPhotoTexture }));
scene.add(myCubicPhoto);
myCubicPhoto.position.set(5, 0, -25);

function animate() {
    myPhoto.rotation.y += 0.05;
    myPhoto.rotation.x += 0.01;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = t * +0.03;
    camera.rotation.y = t * +0.002;
    myPhoto.position.x = t * 0.01;
    myCubicPhoto.rotation.y += 0.05;
}

document.body.onscroll = moveCamera;
moveCamera();

const up = document.getElementById('up');
const down = document.getElementById('down');
const left = document.getElementById('left');
const right = document.getElementById('right');

function movePhoto(event) {
    if (event.target === up || event.key === 'ArrowUp') {
        myCubicPhoto.rotation.x +=0.1;
    } else if (event.target === down || event.key === 'ArrowDown') {
        myCubicPhoto.rotation.x -= 0.1;
    } else if (event.target === left || event.key === 'ArrowLeft') {
        myCubicPhoto.rotation.y -= 0.1;
    } else if (event.target === right || event.key === 'ArrowRight') {
        myCubicPhoto.rotation.y += 0.1;
    }
}

up.addEventListener('click', movePhoto);
down.addEventListener('click', movePhoto);
left.addEventListener('click', movePhoto);
right.addEventListener('click', movePhoto);
document.body.addEventListener('keydown', movePhoto);