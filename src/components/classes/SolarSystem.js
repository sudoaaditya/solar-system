
import * as THREE from 'three';

import { PlanetInfo } from '../utils/PlanetInfo';
import { Planet } from './Planets';

class SolarSystem {
    constructor(props) {

        this.scene = props.scene;

        this.planets = [];
        this.orbits = [];

        this.createPlanets();
        // this.createOrbits();
    }

    createPlanets = () => {
        let i = 0;
        for (let key in PlanetInfo) {
            const planet = PlanetInfo[key];

            const planetClass = new Planet({...planet, idx: i++});
            
            this.planets.push(planet);
            // this.scene.add(planetClass.mesh);
        }
    }

}

export { SolarSystem };