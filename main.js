//all imports
import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'


import vertexShader from './shaders/vertex.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'
import sobel from './shaders/effects/sobel.glsl'
import sobelVertex from './shaders/effects/sobelVertex.glsl'
import depthFrag from "./shaders/effects/depth.glsl"
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { depthPass } from 'three/examples/jsm/nodes/Nodes.js';


let depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, THREE.RGBAFormat)
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
renderer.setClearColor(0xFFFFFF)
console.log(window.devicePixelRatio)
//effects
let composer = new EffectComposer(renderer)
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );



const sobelPass = new ShaderPass(new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: {value: null},
    resX: {value: window.innerWidth}, 
    resY: {value: window.innerHeight},
    outlineColor: {value: new THREE.Vector3(0.0,0.0,0.0)}
  },
  fragmentShader: sobel,
  vertexShader: sobelVertex
}))
//composer.addPass(sobelPass)

const depth = new ShaderPass(new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: {value: depthTexture},
  },
  fragmentShader: depthFrag,
  vertexShader: sobelVertex
}))
//composer.addPass(depth)



/*const nextSobelPass = new ShaderPass(new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: {value: null},
    resX: {value: window.innerWidth}, 
    resY: {value: window.innerHeight}
  },
  fragmentShader: sobel,
  vertexShader: nextSobel,
}))
composer.addPass(nextSobelPass)*/




const solidify = (mesh, thickness, color, position) =>{
  const geometry = mesh.geometry
  const material = new THREE.ShaderMaterial({
    uniforms: {
      outlineColor: {value: color}
    },
    vertexShader: /* glsl */ `
    void main(){
      vec3 newPosition = position + normal * ${thickness};
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
    `,
    fragmentShader: /* glsl */ `
    uniform vec4 outlineColor;
    void main(){
      gl_FragColor = outlineColor;
    }
    `,
    side: THREE.BackSide
  })

  const outline = new THREE.Mesh(geometry, material)
  outline.position.set(position.x, position.y, position.z)
  scene.add(outline) 
}


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
      textured: {value: false},
      textureMap: {value: texture},
      modelColor : {value: new THREE.Color(0x00FF00)},
      lightSourcePosition: {value: PointLight.position},
      toneMap: {value: toneMap}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
)


torusKnot.position.set(5,0,0)
//solidify(torusKnot, 0.03, new THREE.Vector4(0.0,0.0,0.0,1.0), torusKnot.position)
scene.add(torusKnot)

//light orbit parameters
const orbitRadius = 50;
let angle = 90;


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