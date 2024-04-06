//all imports
import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'


//textures & tonemaps
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./img/textures/fur.jpg');
const toneMap = textureLoader.load('./img/toneMap/three-tone.jpg');

//scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101114)

//effects
let composer = new EffectComposer(renderer)
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

//orbit controls
const controls = new OrbitControls(camera, renderer.domElement)

//point ligth
const PointLight = new THREE.PointLight(0xFFFFFF)
PointLight.position.set(10,10,10)
scene.add(PointLight)
const PointHelper = new THREE.PointLightHelper(PointLight);
scene.add(PointHelper)

//torus knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 128, 128, 2, 3), 
  new THREE.ShaderMaterial({
    uniforms: {
      textured: {value: true},
      textureMap: {value: texture},
      modelColor : {value: new THREE.Color(0xFFFF00)},
      lightSourcePosition: {value: PointLight.position},
      toneMap: {value: toneMap}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
)

scene.add(torusKnot)

//light orbit parameters
const orbitRadius = 50;
let angle = 0;



function animate(){
  requestAnimationFrame(animate);

  //light orbit
  PointLight.position.x = Math.cos(angle) * orbitRadius;
  PointLight.position.z = Math.sin(angle) * orbitRadius;

    angle += 0.01;


  //control and renderer updates per frame
  controls.update()

  composer.render()
}

animate();