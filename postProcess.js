import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'

import {VerticalBlurShader} from 'three/examples/jsm/shaders/VerticalBlurShader'

import vertexShader from './shaders/gaussianVertex.glsl'
import fragmentShader from'./shaders/gaussian.glsl'

import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})

const ToonShader = {
  uniforms: {
      uDirLightPos: { value: new THREE.Vector3(10,10,10) },
      uDirLightColor: { value: new THREE.Color(0xffffff) },
      uAmbientLightColor: { value: new THREE.Color(0x050505) }
  },
  vertexShader: `
      varying vec3 vNormal;

      void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
  fragmentShader: `
      uniform vec3 uDirLightPos;
      uniform vec3 uDirLightColor;
      uniform vec3 uAmbientLightColor;

      varying vec3 vNormal;

      void main() {
          vec3 lightDirection = normalize(uDirLightPos);
          float intensity = dot(vNormal, lightDirection);

          // Customize the threshold values to control the number of shading levels
          float threshold = 0.4;
          float shade = step(threshold, intensity);

          vec3 finalColor = mix(uAmbientLightColor, uDirLightColor, shade);

          gl_FragColor = vec4(finalColor, 1.0);
      }
  `
};

const Pass = {
  uniforms: {
    textureSampler: { value: null },
    textureSize: { value: new THREE.Vector2(1920, 1080) }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement)
camera.position.setZ(30);

let composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
//composer.addPass(new ShaderPass(ToonShader))


const point = new THREE.PointLight(0xFFFFFF, 1000)
point.position.set(10,10,10)
scene.add(point)

const Knot = new THREE.Mesh(new THREE.TorusKnotGeometry(), new THREE.MeshStandardMaterial({
  color: 0xFF0000
}))

scene.add(Knot)

function animate(){
  requestAnimationFrame(animate);


  controls.update()

  composer.render()
}

animate();