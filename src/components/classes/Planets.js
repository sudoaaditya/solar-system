import * as THREE from 'three';
import { TextureLoader } from "three";


class Planet {

    constructor(props) {

        this.name = props.name;
        this.radius = props.radius;
        this.isBloomLayer = props.isBloomLayer;
        this.position = new THREE.Vector3().fromArray(props.position);
        this.color = props.color;
        this.distance = props.distance;
        this.timeMultiplier = props.timeMultiplier;
        this.rotationMultiplier = props.rotationMultiplier;

        this.layers = props.layers;

        this.texImg = props.texture;

        this.texLoader = new TextureLoader();
        this.idx = props.idx;

        this.createShape();
    }

    createShape = () => {
        //create sphere with radius
        this.texture = this.texLoader.load(this.texImg);

        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture,
            // color: this.color,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // place them according to idx and diameter of last planet
        this.mesh.position.copy(this.position);


        this.mesh.userData["isObject"] = true;

        if(this.isBloomLayer) {
            this.mesh.layers.enable(this.layers.BLOOM);
        } else {
            this.mesh.scale.set(1.5, 1.5, 1.5);
        }

        if(this.distance) {
            this.orbit = this.createOrbit();
        }
    }

    createOrbit = () => {
        const curve = new THREE.EllipseCurve(
            0, 0,
            this.distance, this.distance,
            0, 2 * Math.PI,
            false,
            0
        );

        const points = curve.getPoints(1000);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const orbit = new THREE.Line(geometry, material);

        orbit.rotation.x = Math.PI / 2;
        orbit.userData["isObject"] = true;

        // orbit.layers.enable(this.layers.BLOOM);

        return orbit;
    }

    update = (time) => {
        //update rotation

        if(this.timeMultiplier) {
            this.mesh.position.x = this.distance * Math.cos(time * this.timeMultiplier);
            this.mesh.position.z = this.distance * Math.sin(time * this.timeMultiplier);
        }

        if(this.rotationMultiplier) {
            this.mesh.rotation.y = time * this.rotationMultiplier;
        }

    }
}

export { Planet };