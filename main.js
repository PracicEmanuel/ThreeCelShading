import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./img/toneMaps/three-tone.jpg');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);


const params = {
  split:          true,       // optional, default: true
  uvSmooth:       false,      // optional, default: false
  preserveEdges:  false,      // optional, default: false
  flatOnly:       false,      // optional, default: false
  maxTriangles:   Infinity,   // optional, default: Infinity
};


const solidify = (mesh) =>{
  const Thickness = 0.05
  const geometry = mesh.geometry
  const mat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
    void main(){
      vec3 NewPosition = position + normal * ${Thickness};
      gl_Position = projectionMatrix * modelViewMatrix * vec4(NewPosition, 1);
    }
    `,
    fragmentShader: /* glsl */ `
    void main(){
      gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    }
    `,
    side: THREE.BackSide

  })

  const outline = new THREE.Mesh(geometry, mat)
  scene.add(outline)
}


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101114)

camera.position.setZ(30);

//const Knot = new THREE.Mesh(new THREE.MeshStandardMaterial({color: 0x00FFFF})); scene.add(Knot)

const controls = new OrbitControls(camera, renderer.domElement)

const PointLight = new THREE.PointLight(0xFFFFFF)
PointLight.position.set(10,10,10)
scene.add(PointLight)
const PointHelper = new THREE.PointLightHelper(PointLight);
scene.add(PointHelper)

const loader = new OBJLoader();

const mat = new THREE.ShaderMaterial({
  uniforms: {
    textureMap: { value: texture }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
})

const CelShader = {
  uniforms: {
      modelColor : {value: new THREE.Color(0xAAFF00)},
      lighting: {value: new THREE.Color(0xFFFFFF)},
      ambient: {value: new THREE.Vector3(0.5,0.5,0.5)},
      lightSourcePosition: {value: PointLight.position},
      toneMap: texture
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
};

// load a resource
new OBJLoader( ).load( './models/Teapot.obj', function ( object ) {

    // Now we find each Mesh...
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {

            // const geometry = LoopSubdivision.modify(new THREE.BoxGeometry(), iterations, params);
            //let geometry = child.geometry;
            //geometry = LoopSubdivision.modify(geometry, 2, params);
            //child.geometry = geometry
            child.material = new THREE.ShaderMaterial(CelShader)

        }
    });
    solidify(object);
    //scene.add( object );
});

const sphereMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 128, 128, 2, 3), 
new THREE.ShaderMaterial({
  uniforms: {
    modelColor : {value: new THREE.Color(0xFFFF00)},
    lighting: {value: new THREE.Color(0xFFFFFF)},
    ambient: {value: new THREE.Vector3(0.0,1.0,0.0)},
    lightSourcePosition: {value: PointLight.position}
},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide
}))

sphereMesh.scale.set(10,10,10)

scene.add(sphereMesh)

const orbitRadius = 50;
let angle = 0;

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

  renderer.render(scene, camera)
}

animate();