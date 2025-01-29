import * as THREE from 'three';
import {
    RenderPass,
    ShaderPass,
    UnrealBloomPass,
    EffectComposer,
} from 'three/addons/Addons.js';

import GUI from 'lil-gui';

import vertexShader from '../shaders/finalpass/vertex.glsl';
import fragmentShader from '../shaders/finalpass/fragment.glsl';

class Postprocessing {
    constructor(renderer, camera, scene, sizes, layers) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.size = sizes;

        this.originalMaterials = {};

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(layers.BLOOM);

        this.gui = new GUI();

        this.nonBloomMaterial = this.createMaterial("basic", 0x000000);

        this.bloomComposer = null;
        this.finalComposer = null;

        this.settings();

        this.initialize();
    }

    settings = () => {
        this.params = {
            threshold: 0,
            strength: 1.5,
            radius: 1,
            exposure: 1
        };

        const bloomFolder = this.gui.addFolder("Bloom Settings")

        bloomFolder.add(this.params, "threshold", 0.0, 1.0, 0.1).onChange((value) => {
            this.bloomPass.threshold = Number(value);
        })

        bloomFolder.add(this.params, "strength", 0.0, 3.0, 0.1).onChange((value) => {
            this.bloomPass.strength = Number(value);
        })

        bloomFolder.add(this.params, "radius", 0.0, 3.0, 0.01).onChange((value) => {
            this.bloomPass.radius = Number(value);
        })

        const toneMappingFolder = this.gui.addFolder('tone mapping');

        toneMappingFolder.add(this.params, 'exposure', 0.1, 2).onChange((value) => {
            this.renderer.toneMappingExposure = Math.pow(value, 4.0);
        });
    }

    initialize = () => {
        const renderScene = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.size.width, this.size.height),
            1.5,
            0.4,
            0.85
        );

        this.bloomPass.threshold = this.params.threshold;
        this.bloomPass.strength = this.params.strength;
        this.bloomPass.radius = this.params.radius;

        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.setSize(
            this.size.width,
            this.size.height
        );

        this.bloomComposer.addPass(renderScene);
        this.bloomComposer.addPass(this.bloomPass);

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader,
                fragmentShader,
                defines: {}
            }),
            "baseTexture"
        );
        finalPass.needsSwap = true;
        this.finalComposer = new EffectComposer(this.renderer);
        this.finalComposer.setSize(
            this.size.width,
            this.size.height
        );
        this.finalComposer.addPass(renderScene);
        this.finalComposer.addPass(finalPass);
    }

    resize = (sizes) => {
        this.size = sizes;
        this.bloomComposer.setSize(this.size.width, this.size.height);
        this.finalComposer.setSize(this.size.width, this.size.height);
    }

    render = () => {
        this.renderBloom();
        this.finalComposer.render();
    }

    renderBloom = () => {
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
    }

    darkenNonBloomed = (obj) => {
        if(obj.userData && obj.userData.isObject && this.bloomLayer.test(obj.layers) === false) {
            this.originalMaterials[obj.uuid] = obj.material;
            obj.material = this.nonBloomMaterial;
        }
        this.renderer.setClearColor(0x000000);
    }

    restoreMaterial = (obj) => {
        if(this.originalMaterials[obj.uuid]) {
            obj.material = this.originalMaterials[obj.uuid];
            delete this.originalMaterials[obj.uuid];
        }
        this.renderer.setClearColor(0x000000);
    }

    createMaterial = (type, color) => {
        const mat = 
            type === "basic" 
            ? new THREE.MeshBasicMaterial()
            : new THREE.MeshStandardMaterial();

        mat.color = new THREE.Color(color);

        if(mat === 'standard') {
            mat.metalness = 0.75;
            mat.roughness = 0.25;
        }

        return mat;
    }
}

export { Postprocessing };