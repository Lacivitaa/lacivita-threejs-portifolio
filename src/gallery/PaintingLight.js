import * as THREE from 'three';

export class PaintingLight extends THREE.Group {

    constructor() {

        super();

        this.createFixture();
        this.createLight();
    }

    createFixture() {

        /*
         * Braço que sai do topo da moldura.
         *
         * A luminária é filha do Painting,
         * portanto acompanha o quadro.
         */

        const armGeometry =
            new THREE.BoxGeometry(
                0.12,
                0.12,
                0.65
            );

        const armMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.7,
                metalness: 0.1
            });

        const arm =
            new THREE.Mesh(
                armGeometry,
                armMaterial
            );

        arm.position.set(
            0,
            0,
            0.30
        );

        arm.castShadow = true;

        this.add(arm);


        /*
         * Corpo da luminária.
         */

        const fixtureGeometry =
            new THREE.CylinderGeometry(
                0.13,
                0.13,
                0.55,
                16
            );

        const fixtureMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.6,
                metalness: 0.15
            });

        const fixture =
            new THREE.Mesh(
                fixtureGeometry,
                fixtureMaterial
            );

        fixture.rotation.z =
            Math.PI / 2;

        fixture.position.set(
            0,
            -0.05,
            0.62
        );

        fixture.castShadow = true;

        this.add(fixture);
    }


    createLight() {

        /*
         * SpotLight:
         *
         * A ideia é iluminar praticamente
         * somente a área do quadro.
         */

        const light =
            new THREE.SpotLight(
                0xffffff,
                60,
                14,
                THREE.MathUtils.degToRad(80),
                0.75,
                1.5
            );


        /*
         * Posição da luz.
         *
         * Como o PaintingLight é filho
         * do quadro, isso é relativo ao quadro.
         */

        light.position.set(
            0,
            -0.25,
            0.65
        );


        /*
         * Centro do quadro.
         *
         * O SpotLight aponta para o target.
         */

        light.target.position.set(
            0,
            -3,
            0
        );


        this.add(light);

        this.add(
            light.target
        );


        /*
         * Sombras.
         */

        light.castShadow = true;

        light.shadow.mapSize.width =
            1024;

        light.shadow.mapSize.height =
            1024;

        light.shadow.camera.near =
            0.1;

        light.shadow.camera.far =
            10;

        light.shadow.bias =
            -0.0005;

        light.shadow.normalBias =
            0.02;
    }
}