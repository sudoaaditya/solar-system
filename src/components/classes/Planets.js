import * as THREE from 'three';
import { TextureLoader } from "three";


class Planet {

    constructor(props) {

        this.name = props.name;
        this.radius = props.radius;

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
            map: this.texture
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // place them according to idx and diameter of last planet
        this.mesh.position.x = this.idx * 2 + 1;


        this.mesh.userData["isObject"] = true;
    }

    update = (time) => {
        //update rotation
    }
}

export { Planet };