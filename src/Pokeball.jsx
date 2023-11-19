import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Pokeball(props) 
{
  const { nodes, materials } = useGLTF("./Models/pokeball.glb")
  const material = new THREE.MeshStandardMaterial({color:"#27A369"})

  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.999, 0]} rotation={[Math.PI, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.bottom.geometry}
          material={materials.pokeballWhite}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.center.geometry}
          material={materials.pokeballBlack}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.top.geometry}
          material={props.material}
        />
      </group>
    </group>
  )
}

useGLTF.preload("/pokeball.glb")