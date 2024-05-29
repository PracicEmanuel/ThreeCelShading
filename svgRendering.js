import * as THREE from 'three';


import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'

const renderer = new SVGRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFFFF)
document.body.appendChild( renderer.domElement );


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.setZ(30);
const controls = new OrbitControls(camera, renderer.domElement)

const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 20, 28, 2, 3), 
  new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    wireframe:true
  })
)
scene.add(torusKnot)

const ambient = new THREE.AmbientLight( 0x80ffff );
				scene.add( ambient );

function animate(){
    requestAnimationFrame(animate);
  
    //light orbit
    /*PointLight.position.x = Math.cos(angle) * orbitRadius;
    PointLight.position.z = Math.sin(angle) * orbitRadius;
      angle += 0.01;*/
  
  
  
    //control and renderer updates per frame
    controls.update()
  
    renderer.render(scene, camera)
  }
  
  animate();