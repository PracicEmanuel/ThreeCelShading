import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./img/toneMaps/three-tone.jpg');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);



const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101114)

camera.position.setZ(30);

//const Knot = new THREE.Mesh(new THREE.MeshStandardMaterial({color: 0x00FFFF})); scene.add(Knot)

const controls = new OrbitControls(camera, renderer.domElement)

let composer = new EffectComposer(renderer)

const PointLight = new THREE.PointLight(0xFFFFFF)
PointLight.position.set(10,10,10)
scene.add(PointLight)
const PointHelper = new THREE.PointLightHelper(PointLight);
scene.add(PointHelper)


const sphereMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 128, 128, 2, 3), 
new THREE.ShaderMaterial({
  uniforms: {
    modelColor : {value: new THREE.Color(0xFFFF00)},
    lighting: {value: new THREE.Color(0xFFFFFF)},
    ambient: {value: new THREE.Vector3(0.0,1.0,0.0)},
    lightSourcePosition: {value: PointLight.position}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}))


sphereMesh.scale.set(10,10,10)

scene.add(sphereMesh)

const orbitRadius = 50;
let angle = 0;

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );


function animate(){
  requestAnimationFrame(animate);

  PointLight.position.x = Math.cos(angle) * orbitRadius;
  PointLight.position.z = Math.sin(angle) * orbitRadius;
  //camera.position.x = Math.cos(angle) * orbitRadius;
  //camera.position.z = Math.sin(angle) * orbitRadius;

    // Rotate cube
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    angle += 0.01; // Increment angle for next frame

  controls.update()

  composer.render()
}

animate();