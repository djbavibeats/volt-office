import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Spector JS
 */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()


/**
 * Base
 */
// Debug
// const gui = new dat.GUI({
//     width: 400
// })


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('office-baked-v3.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// const directionalLight = new THREE.DirectionalLight(0xe7e7e7, .25)
// directionalLight.position.set(3, 4.5, 2.5)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)

// scene.add(directionalLight)
// scene.add(directionalLightHelper)
/**
 * Model
 */
gltfLoader.load(
    'office.glb',
    (gltf) => {
        gltf.scene.children.find(child => {
            child.material = bakedMaterial
            // if (child.name === 'Ground') {
            //     child.material.side = THREE.DoubleSide
            // }
        })
        scene.add(gltf.scene)
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100)
camera.position.x = - 0.0
camera.position.y = 5.7
camera.position.z = - 9.125
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(0xc92228)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()