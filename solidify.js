import * as THREE from 'three';

export const solidify = (mesh, THREE.scene scene) =>{
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
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
      }
      `,
      side: THREE.BackSide
  
    })
  
    const outline = new THREE.Mesh(geometry, mat)
    scene.add(outline)
  }

