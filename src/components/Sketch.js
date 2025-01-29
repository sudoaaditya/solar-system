import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

//Effect
import { RenderPass, EffectComposer, UnrealBloomPass, OutputPass, ShaderPass, FXAAShader, GLTFLoader } from 'three/examples/jsm/Addons.js';

import GUI from 'lil-gui';

// components
import StarField from './effects/StarField';

class Sketch {

    constructor(container) {
        this.container = container;

        // threejs vars
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;

        this.sizes = {};
        this.frameId = null;
        this.clock = null;
        this.gui = new GUI();

        this.starField = null;

        this.initialize();
    }

    initialize = () => {

        this.scene = new THREE.Scene();

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.container
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = Math.pow(4.0, 1.0);

        this.clock = new THREE.Clock();

        this.composer = null;
        this.starField = null;

        // camera & resize
        this.setupCamera();
        this.setupResize();

        // world setup
        this.settings();
        this.addLights();
        this.addContents();
        this.setupComposer();

        // wramup calls
        this.resize();
        this.render();

        // start animation loop
        this.start();
    }

    settings = () => {
        this.params = {
            threshold: 0,
            strength: 1,
            radius: 0,
            exposure: 1
        };

        const bloomFolder = this.gui.addFolder("Bloom Settings")

        bloomFolder.add(this.params, "threshold", 0.0, 1.0, 0.1).onChange((value) => {
            this.bloomPass.threshold = Number(value);
        })

        bloomFolder.add(this.params, "strength", 0.0, 3.0, 0.1).onChange((value) => {
            this.bloomPass.strength = Number(value);
        })

        bloomFolder.add(this.params, "radius", 0.0, 1.0, 0.01).onChange((value) => {
            this.bloomPass.radius = Number(value);
        })

        const toneMappingFolder = this.gui.addFolder('tone mapping');

        toneMappingFolder.add(this.params, 'exposure', 0.1, 2).onChange((value) => {
            this.renderer.toneMappingExposure = Math.pow(value, 4.0);
        });
    }

    changeTexture = (index) => {
        this.starField.updateStarMap(this.textures[index]);
    }

    setupCamera = () => {

        this.camera = new THREE.PerspectiveCamera(
            70,
            (this.sizes.width / this.sizes.height),
            0.01,
            10000
        );

        this.camera.position.set(0, 0, 4);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    setupResize = () => {
        window.addEventListener('resize', this.resize);
    }


    resize = () => {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.sizes.width, this.sizes.height);
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.update);
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    addLights = () => {
        this.scene.add(new THREE.AmbientLight(0xcccccc));

        const pointLight = new THREE.PointLight(0xffffff, 100);
        this.camera.add(pointLight);
    }

    getSunColor = (bNess) => {
        bNess *= 0.25;

        console.log(bNess)
        const colorVector = (new THREE.Vector3(bNess, bNess * bNess, bNess * bNess * bNess));
        colorVector.divideScalar(0.25)
        colorVector.multiplyScalar(0.8)

        return new THREE.Color().setFromVector3(colorVector)
    }

    addContents = /* async */ () => {
        // render base scene data!
        this.starField = new StarField({
            starNumbers: 1000,
            starTexIdx: 3,
            starSize: 15,
            radiusOffset: 80
        });
        this.scene.add(this.starField.stars);

        const geo = new THREE.SphereGeometry(1, 32, 32);
        const color = this.getSunColor(2);
        const material = new THREE.MeshStandardMaterial({
            color,
            map: new THREE.TextureLoader().load('/textures/planets/sun.jpg')
        });
        const sphere = new THREE.Mesh(geo, material);
        this.scene.add(sphere);
    }

    setupComposer = () => {
    }

    update = () => {
        this.elpasedTime = this.clock.getElapsedTime();

        this.controls.update();

        this.render();

        this.frameId = window.requestAnimationFrame(this.update);
    }

    render = () => {
        let {renderer, scene, camera } = this;
        if (renderer) {

            renderer.clear();

            renderer.render(scene, camera);

        }
    }
}

export { Sketch };