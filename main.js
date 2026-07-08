import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // manipulate later based on the models
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg')
});
const pmremGenerator = new THREE.PMREMGenerator( renderer );
const hdriLoader = new RGBELoader()
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const GLBLoader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer = [];


GLBLoader.load( '/animated_butterfly.glb', function ( gltf ) {
    const butterFly = gltf.scene;
    butterFly.scale.set(0.3, 0.3, 0.3);
    butterFly.position.set(5, 1, -10);
    scene.add(butterFly);

    for (let i = 0; i < 10; i++) {
        const clone = butterFly.clone(true);
        clone.scale.set(0.3, 0.3, 0.3);
        clone.position.set(Math.random() * 5, Math.random() * 5, -10 + Math.random() * 5);
        scene.add(clone);
        mixer.push(new THREE.AnimationMixer(clone));
    }

    mixer.push(new THREE.AnimationMixer(butterFly));
    const animation = gltf.animations[0];
    for (let i = 0; i < mixer.length; i++) {
        mixer[i].clipAction(animation).play();
    }
})

function animate() {
    const delta = clock.getDelta();
    for (let i = 0; i < mixer.length; i++) {
        mixer[i].update(delta);
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

hdriLoader.load( '/fireplace_2k.hdr', function ( texture ) {
  const hdri = pmremGenerator.fromEquirectangular( texture ).texture;
  texture.dispose(); 
  scene.environment = hdri;
  scene.background = hdri;
  renderer.render(scene, camera);
} );

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = t * +0.01;
    camera.rotation.y = t * +0.001;
}

document.body.onscroll = moveCamera;
moveCamera();