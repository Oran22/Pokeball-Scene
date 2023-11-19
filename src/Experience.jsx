import { shaderMaterial, Sky, RandomizedLight, AccumulativeShadows, Float, OrbitControls, useGLTF, Sparkles } from '@react-three/drei'
//import { Perf } from 'r3f-perf'
import { useState, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import Pokeball from './Pokeball.jsx'
import grassVertexShader from './floor/vertex.glsl'
import grassFragmentShader from './floor/fragment.glsl'
import { Physics, RigidBody } from '@react-three/rapier'
import Snorlax from './Snorlax.jsx'

export default function Experience()
{
    /**
     * Refs
     */
    const ball = useRef()
    const ballSparks = useRef()

    /**
     * Music
     */
    const [music] = useState(() => new Audio('./Sounds/1-07 Lake.mp3'))
    music.volume = 0.04
    const [air] = useState(() => new Audio('./Sounds/air.wav'))
    air.volume = 0.2

    useFrame(() =>
    {
        music.play()
        
    },[])

    /**
     * Loaders
     */
    const cubone = useGLTF('./Models/Cubone.glb')
    const charmander = useGLTF('./Models/charmander.glb')
    const pokeball = useGLTF('./Models/pokeball.glb')
    const pikachu = useGLTF('./Models/pikachu_halloween.glb')

    /**
     * Shadows of models
     */
    cubone.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    pokeball.scene.traverse((mesh) =>
    {
        mesh.castShadow = true
    })


    // Floor Shader
    const GrassMaterial = shaderMaterial(
        {
            uTime: 0,
            uColorStart: new THREE.Color('#ACDA34'),
            uColorEnd: new THREE.Color('white')
        },
        grassVertexShader,
        grassFragmentShader
    )
    
    extend({ GrassMaterial })

    /**
     * ball Animation
     */
    const ballAnimation = () => 
    {
        gsap.to(ball.current.rotation, { y: ball.current.rotation.y + Math.PI * 2})
        air.play()
    }

    /**
     * Debug
     */
    const directionalLight = useRef()
    // useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    return <>
        {/* <Perf position="top-left" /> */}
        <OrbitControls 
            maxPolarAngle={Math.PI/2 - 0.1}
            maxAzimuthAngle={Math.PI/2 + 0.25}
            minAzimuthAngle={-Math.PI/2 - 0.25}
            enablePan={false}
        />

        <Sky sunPosition={[1.0, 2.00, 3.0]}/>

        <directionalLight ref={directionalLight} position={ [ 1.0, 2.00, 3.0 ] } intensity={ 1.5 } shadow-mapSize={[1024, 1024]} />
        <ambientLight intensity={ 0.5 } />
        {/* Pokeballs Background */}
        { [...Array(125)].map((value, index) =>
            <Pokeball
                material={new THREE.MeshStandardMaterial({color: `hsl(${Math.random() * 360}, ${Math.random() * 100}%, ${Math.random() * 60}%)`})}
                key={index}
                position=
                { [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.2) * 20,
                (Math.random() - 0.5) * 20
                ] }
                scale={ 0.1 + Math.random() * 0.2 }
                rotation=
                { [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
                ] }
            />
        ) }
        
        {/* Cubone */}
        <primitive object={cubone.scene} scale={ 2 } rotation-y={ 4.6 } position={[ -2.4, -0.06, 3.4]} />

        {/* Charmander */}
        <primitive object={charmander.scene} scale={ 1.6 } rotation-y={ 2.19 } position={[ 2.0, -0.48, 3.0]} />

        {/* Pickachu Halloween */}
        <Float floatIntensity={ 1.4 } rotationIntensity={ 1 } speed={ 2 }>
        <primitive object={pikachu.scene} scale={ 2 } rotation={[ 0.2, 0.4, 0 ]} position={[ -2.6, 1, 0.4]} />
        </Float>

        {/* Pokeball */}
        <Float scale={0.6} floatIntensity={ 1.2 } rotationIntensity={ 0.8 } speed={ 3 }>
            <Sparkles ref={ ballSparks } color={'#B1FF16'} size={ 15 } scale={[ 2.3, 2.5, 2 ]} position-y={1.1} />
            <primitive
                ref={ball}
                object={pokeball.scene}
                scale={ 1.3 }
                position={[0, -0.24, 0]}
                onPointerEnter={ () => { document.body.style.cursor = 'pointer'}}
                onPointerLeave={ () => { document.body.style.cursor = 'default'}}
                onClick={(event) =>
                {
                    ballAnimation()      
                    event.stopPropagation()
                }}
            />        
        </Float>  

        {/* Shadows */}
        <AccumulativeShadows
            position={[ 0, -0.89, 0]}
            scale={[10, 10, 0.2]}
            color="#316d39"
        >
            <RandomizedLight 
                position={[1.0, 2.00, 3.0]}
                amount={ 8 }
                radius={ 1 }
                ambient={ 0.2 }
                intensity={ 1 }
                bias={ 0.001 }
            />
        </AccumulativeShadows>

        {/* Floor&Snorlax */}
        <Physics>
            <Snorlax />

            <RigidBody type="fixed">
                <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ [10, 10, 0.2] }>
                    <boxGeometry />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>
        </Physics>
        
            <mesh receiveShadow position-y={ -0.899 } rotation-x={ -Math.PI * 0.5 }>
                <planeGeometry args={[10, 10, 10]}/>
                <grassMaterial />
            </mesh>
    </>
}