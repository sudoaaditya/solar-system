
// create json file with planet data

const PlanetInfo = {
    sun: {
        name: "Sun",
        radius: 696340 / 10000,
        texture: "/textures/planets/sun.jpg",
    },
    mercury: {
        name: "Mercury",
        radius: 2439.7 / 10000,
        texture: "/textures/planets/mercury.jpg",
    },
    venus: {
        name: "Venus",
        radius: 6051.8 / 10000,
        texture: "/textures/planets/venus_surface.jpg",
    },
    earth: {
        name: "Earth",
        radius: 6371 / 10000,
        texture: "/textures/planets/earth.jpg",
    },
    mars: {
        name: "Mars",
        radius: 3389.5 / 10000,
        texture: "/textures/planets/mars.jpg",
    },
    jupiter: {
        name: "Jupiter",
        radius: 69911 / 10000,
        texture: "/textures/planets/jupiter.jpg",
    },
    saturn: {
        name: "Saturn",
        radius: 58232 / 10000,
        texture: "/textures/planets/saturn.jpg",
        ringTexture: "/textures/planets/saturn_ring_alpha.png",
    },
    uranus: {
        name: "Uranus",
        radius: 25362 / 10000,
        texture: "/textures/planets/uranus.jpg",
    },
    neptune: {
        name: "Neptune",
        radius: 24622 / 10000,
        texture: "/textures/planets/neptune.jpg",
    }
}

export { PlanetInfo };