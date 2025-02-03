import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


// components
import StarField from './effects/StarField';
import { Postprocessing } from './classes/Postprocessing';
import { SolarSystem } from './classes/SolarSystem';
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

        this.layers = {
            BLOOM: 1,
            DEFAULT: 0
        }

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
        this.addLights();
        this.setupComposer();
        this.addContents();

        // wramup calls
        this.resize();
        this.render();

        // start animation loop
        this.start();
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

        this.camera.position.set(0, 0, 40);

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

        this.postprocessing?.resize(this.sizes);
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
        this.scene.add(new THREE.AmbientLight(0xffffff, 2));

        const pointLight = new THREE.PointLight(0xffffff, 100);
        this.camera.add(pointLight);
    }

    getSunColor = (bNess) => {
        bNess *= 0.25;

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

        /* const geo = new THREE.SphereGeometry(1, 32, 32);
        const color = this.getSunColor(3);
        const material = new THREE.MeshStandardMaterial({
            color,
            map: new THREE.TextureLoader().load('/textures/planets/sun.jpg')
        });
        const sphere = new THREE.Mesh(geo, material);
        sphere.userData["isObject"] = true;
        sphere.layers.enable(this.layers.BLOOM);
        this.scene.add(sphere); */

        // solar system init
        this.solarSystem = new SolarSystem({scene: this.scene, layers: this.layers})
    }

    setupComposer = () => {
        this.postprocessing = new Postprocessing(
            this.renderer,
            this.camera,
            this.scene,
            this.sizes,
            this.layers
        );
    }

    update = () => {
        this.elpasedTime = this.clock.getElapsedTime();

        this.controls.update();
        this.starField.update(this.elpasedTime);
        this.solarSystem.update(this.elpasedTime);

        this.render();

        this.frameId = window.requestAnimationFrame(this.update);
    }

    render = () => {
        this.postprocessing.render();
    }
}

export { Sketch };