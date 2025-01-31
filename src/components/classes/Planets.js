import { TextureLoader } from "three";


class Planet {

    constructor(props) {

        this.name = props.name;
        this.radius = props.radius;

        this.texImg = props.texture;

        this.texLoader = new TextureLoader();


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
        this.mesh.userData["isObject"] = true;
    }

    update = (time) => {
        //update rotation
    }
}

export { Planet };