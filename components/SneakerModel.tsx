"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface SneakerModelProps {
  modelPath?: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  autoRotate?: boolean
  className?: string
}

export default function SneakerModel({
  modelPath,
  scale = 3,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = true,
  className = "",
}: SneakerModelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1
    controlsRef.current = controls

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xb026ff, 1)
    directionalLight1.position.set(1, 1, 1)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0x01ffc3, 1)
    directionalLight2.position.set(-1, -1, -1)
    scene.add(directionalLight2)

    // Create a fallback 3D object (sneaker-like shape)
    const createFallbackModel = () => {
      // Create a group to hold all parts of the sneaker
      const sneakerGroup = new THREE.Group()

      // Create the sole
      const soleGeometry = new THREE.BoxGeometry(2, 0.3, 4)
      const soleMaterial = new THREE.MeshPhongMaterial({
        color: 0xb026ff,
        shininess: 30,
      })
      const sole = new THREE.Mesh(soleGeometry, soleMaterial)
      sole.position.y = -0.5
      sneakerGroup.add(sole)

      // Create the upper part
      const upperGeometry = new THREE.BoxGeometry(1.8, 1, 3.5)
      const upperMaterial = new THREE.MeshPhongMaterial({
        color: 0x2176ff,
        shininess: 50,
      })
      const upper = new THREE.Mesh(upperGeometry, upperMaterial)
      upper.position.y = 0.1
      sneakerGroup.add(upper)

      // Create the ankle part
      const ankleGeometry = new THREE.CylinderGeometry(0.8, 0.9, 1, 32, 1, true, 0, Math.PI)
      const ankleMaterial = new THREE.MeshPhongMaterial({
        color: 0x01ffc3,
        shininess: 50,
        side: THREE.DoubleSide,
      })
      const ankle = new THREE.Mesh(ankleGeometry, ankleMaterial)
      ankle.rotation.x = Math.PI / 2
      ankle.position.set(0, 0.5, -1)
      sneakerGroup.add(ankle)

      // Create laces
      for (let i = 0; i < 4; i++) {
        const laceGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.2)
        const laceMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
        const lace = new THREE.Mesh(laceGeometry, laceMaterial)
        lace.position.set(0, 0.6, 0.5 - i * 0.4)
        sneakerGroup.add(lace)
      }

      // Apply scale and position
      sneakerGroup.scale.set(scale * 0.3, scale * 0.3, scale * 0.3)
      sneakerGroup.position.set(position[0], position[1], position[2])
      sneakerGroup.rotation.set(rotation[0], rotation[1], rotation[2])

      // Add to scene
      scene.add(sneakerGroup)
      modelRef.current = sneakerGroup
      setModelLoaded(true)
    }

    // Try to load the model if path is provided, otherwise use fallback
    if (modelPath) {
      try {
        // Import dynamically to avoid issues with SSR
        import("three/examples/jsm/loaders/GLTFLoader")
          .then(({ GLTFLoader }) => {
            const loader = new GLTFLoader()
            loader.load(
              modelPath,
              (gltf) => {
                const model = gltf.scene
                model.scale.set(scale, scale, scale)
                model.position.set(position[0], position[1], position[2])
                model.rotation.set(rotation[0], rotation[1], rotation[2])
                scene.add(model)
                modelRef.current = model
                setModelLoaded(true)
              },
              undefined,
              (error) => {
                console.error("An error occurred loading the model:", error)
                createFallbackModel()
              },
            )
          })
          .catch((err) => {
            console.error("Failed to load GLTFLoader:", err)
            createFallbackModel()
          })
      } catch (error) {
        console.error("Error in model loading setup:", error)
        createFallbackModel()
      }
    } else {
      createFallbackModel()
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (controlsRef.current) {
        controlsRef.current.update()
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && rendererRef.current && cameraRef.current) {
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        rendererRef.current.setSize(width, height)
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
      }
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [modelPath, scale, position, rotation, autoRotate])

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
        </div>
      )}
    </div>
  )
}

