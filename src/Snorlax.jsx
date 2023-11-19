import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { Text, Float, useGLTF } from '@react-three/drei'

export default function Snorlax()
{
    const model = useGLTF('./Models/snorlax.glb')

    model.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    const body = useRef()

    const { rapier, world } = useRapier()
    const rapierWorld = world
    
    const [squeak] = useState(() => new Audio('./Sounds/squeak.wav'))

    const jump = (event) =>
    {
        event.stopPropagation()
        const origin = body.current.translation()
        origin.y -= 0.25
        const direction = { x: 0, y: -0.1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = rapierWorld.castRay(ray, 10, true)

        if(hit.toi < 0.15)
        {
            body.current.applyImpulse({ x: 0, y: 20, z: 0 })
            squeak.volume = Math.random() * 0.1
            squeak.play()  
        }
    }

    return <>
            <RigidBody ref={body} colliders={false} canSleep={false} position-y={-0.69}>
                <primitive
                object={model.scene}
                rotation={[ - Math.PI * 0.5, 0, 2 ]}
                position-x={-1.4}
                onClick={jump}
                scale={0.8}
                onPointerEnter={ () => { document.body.style.cursor = 'pointer'}}
                onPointerLeave={ () => { document.body.style.cursor = 'default'}}
            />
            <Float rotationIntensity={ 0.3 } floatIntensity={2.2} speed={0.9} >
                <Text
                    scale={0.3}
                    position={[-3, 0.8, 0.3]}
                    rotation={[-0.1, 0.5, 0.2]}
                    maxWidth={1}
                    color={"#2E2E2E"}
                >
                    Z z z
                </Text>
            </Float>
                <CuboidCollider args={[ 1.1, 0.5, 1.1 ]} position={[-2, 0.4, 0.4]}/>
            </RigidBody>
    </>
}