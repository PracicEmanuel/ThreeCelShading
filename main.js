import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import { LoopSubdivision } from 'three-subdivide';

import vertexShader from './shaders/vertexV2.glsl'
import fragmentShader from'./shaders/fragmentV2.glsl'


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./img/textures/body.png');

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
      lightSourcePosition: {value: PointLight.position}
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
    scene.add( object );
});

const sphereMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(), 
new THREE.ShaderMaterial({
  uniforms: {
    modelColor : {value: new THREE.Color(0xAAAAAA)},
    lighting: {value: new THREE.Color(0xFFFFFF)},
    ambient: {value: new THREE.Vector3(0.5,0.5,0.5)}
},
  vertexShader: vertexShader,
  fragmentShader: fragmentShader

}))
solidify(sphereMesh)

scene.add(sphereMesh)

function animate(){
  requestAnimationFrame(animate);

  //PointLight.rotation.x = camera.rotation.x
  //PointLight.rotation.y = camera.rotation.y
  //PointLight.rotation.z = camera.rotation.z

  //PointLight.position.set(camera.position.x, camera.position.y, camera.position.z)

  controls.update()

  renderer.render(scene, camera)
}

animate();