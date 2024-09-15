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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { ShaderPass } from 'three/examples/jsm/Addons.js';



let depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight, THREE.RGBAFormat)
//textures & tonemaps
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./img/textures/123.png');
const toneMap = textureLoader.load('./img/toneMap/three-tone.jpg');
const SecurityTexture = textureLoader.load("./img/secGraph2.jpg")

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


const solidify = (mesh, thickness, color, position, scale) =>{
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
  outline.scale.set(scale.x, scale.y, scale.z)
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
      modelColor : {value: new THREE.Color(0xFF0000)},
      lightSourcePosition: {value: PointLight.position},
      toneMap: {value: toneMap}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
)

const characterShader = new THREE.ShaderMaterial({
  uniforms: {
    textured: {value: true},
    textureMap: {value: texture},
    modelColor : {value: new THREE.Color(0xFF0000)},
    lightSourcePosition: {value: PointLight.position},
    toneMap: {value: toneMap}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
})

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/ramooona.fbx',
    (object) => {
         object.traverse(function (child) {
          console.log(child.name)   
          if(child.name == "Merged_dm1"){
            child.material = characterShader
            solidify(child, 0.008, new THREE.Vector4(0,0,0,1), child.position, child.scale)
            scene.add(child)
          }
        })
        
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
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

const exportButton = document.getElementById("exportButton");

exportButton.addEventListener("click", () => {
    // Ensure all WebGL rendering is completed
    renderer.render(scene, camera);

    // Export canvas to JPEG
    const dataURL = document.getElementById("bg").toDataURL("image/png", 3.0);

    // Create a link element
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "threejs-scene.";

    // Trigger the download by simulating a click
    link.click();
});

document.getElementById('call').addEventListener('click', async () => {
  composer.render(scene, camera);
  const canvas = document.getElementsByTagName("canvas")[0]
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  //console.log(dataUrl)
  /*const link = document.createElement("a")
  link.href = dataUrl
  link.download = "threeScene."
  link.click()*/
  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: dataUrl })
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'uploaded_image.svg';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    //console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('Error fetching data') ;
  }
});
