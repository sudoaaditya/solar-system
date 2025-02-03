
import * as THREE from 'three';

import { PlanetInfo } from '../utils/PlanetInfo';
import { Planet } from './Planets';

class SolarSystem {
    constructor(props) {

        this.scene = props.scene;
        this.layers = props.layers;

        this.planets = [];
        this.orbits = [];

        this.createPlanets();
        // this.createOrbits();
    }

    createPlanets = () => {
        for (let key in PlanetInfo) {
            const planet = PlanetInfo[key];

            const planetClass = new Planet({...planet, layers: this.layers});
            
            this.planets.push(planetClass);
            this.scene.add(planetClass.mesh);
            this.scene.add(planetClass.orbit);
        }
    }

    update = (time) => {
        const uTime = time * 0.2;
        this.planets.forEach(planet => {
            planet.update(uTime);
        });
    }

}

export { SolarSystem };