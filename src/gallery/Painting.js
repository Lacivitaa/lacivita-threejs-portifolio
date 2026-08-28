import * as THREE from 'three';

export class Painting extends THREE.Group {

    constructor({
        title,
        description,
        color,
        width = 10,
        height = 6
    }) {

        super();

        this.userData.type = 'painting';
        this.userData.title = title;
        this.userData.description =
            description;

        this.width = width;
        this.height = height;

        this.frameWidth = 0.15;
        this.frameDepth = 0.15;
        this.bevel = 0.05;

        this.createFrame();
        this.createCanvas(color);
    }


    createFrame() {

        const outerWidth =
            this.width;

        const outerHeight =
            this.height;

        const innerWidth =
            outerWidth -
            this.frameWidth * 2;

        const innerHeight =
            outerHeight -
            this.frameWidth * 2;


        const shape =
            new THREE.Shape();

        shape.moveTo(
            -outerWidth / 2,
            -outerHeight / 2
        );

        shape.lineTo(
            outerWidth / 2,
            -outerHeight / 2
        );

        shape.lineTo(
            outerWidth / 2,
            outerHeight / 2
        );

        shape.lineTo(
            -outerWidth / 2,
            outerHeight / 2
        );

        shape.closePath();


        const hole =
            new THREE.Path();

        hole.moveTo(
            -innerWidth / 2,
            -innerHeight / 2
        );

        hole.lineTo(
            innerWidth / 2,
            -innerHeight / 2
        );

        hole.lineTo(
            innerWidth / 2,
            innerHeight / 2
        );

        hole.lineTo(
            -innerWidth / 2,
            innerHeight / 2
        );

        hole.closePath();

        shape.holes.push(hole);


        const geometry =
            new THREE.ExtrudeGeometry(
                shape,
                {
                    depth:
                        this.frameDepth,

                    bevelEnabled:
                        true,

                    bevelThickness:
                        this.bevel,

                    bevelSize:
                        this.bevel,

                    bevelSegments: 2,

                    curveSegments: 2
                }
            );


        geometry.translate(
            0,
            0,
            -this.frameDepth / 2
        );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x111111,

                roughness: 0.85,

                metalness: 0.0

            });


        const frame =
            new THREE.Mesh(
                geometry,
                material
            );

        frame.castShadow = true;
        frame.receiveShadow = true;

        this.add(frame);
    }


    createCanvas(color) {

        const canvasWidth =
            this.width -
            this.frameWidth * 2;

        const canvasHeight =
            this.height -
            this.frameWidth * 2;


        const geometry =
            new THREE.PlaneGeometry(
                canvasWidth,
                canvasHeight
            );


        /*
         * IMPORTANTE
         *
         * MeshBasicMaterial NÃO recebe luz.
         *
         * Agora usamos StandardMaterial.
         */

        const material =
            new THREE.MeshStandardMaterial({

                color: color,

                roughness: 1.0,

                metalness: 0.0

            });


        const canvas =
            new THREE.Mesh(
                geometry,
                material
            );


        /*
         * O quadro fica atrás
         * da moldura.
         */

        canvas.position.z =
            -this.frameDepth / 2 -
            0.02;


        canvas.castShadow = true;
        canvas.receiveShadow = true;


        this.add(canvas);
    }
}