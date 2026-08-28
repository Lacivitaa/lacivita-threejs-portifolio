import * as THREE from 'three';


export class Bench extends THREE.Group {

    constructor({

        position = {
            x: 0,
            y: 0,
            z: 0
        },

        rotationY = 0,

        /*
         * =====================================================
         * TAMANHO
         * =====================================================
         */

        width = 3,

        depth = 0.9,

        seatHeight = 1.1,

        seatThickness = 0.18,

        /*
         * =====================================================
         * ESTRUTURA
         * =====================================================
         */

        legWidth = 0.25,

        legDepth = 1.1,

        legHeight = 0.9

    }) {

        super();


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.width =
            width;

        this.depth =
            depth;

        this.seatHeight =
            seatHeight;

        this.seatThickness =
            seatThickness;

        this.legWidth =
            legWidth;

        this.legDepth =
            legDepth;

        this.legHeight =
            legHeight;


        /*
         * =====================================================
         * POSIÇÃO
         * =====================================================
         */

        this.position.set(

            position.x,
            position.y,
            position.z

        );


        /*
         * =====================================================
         * ROTAÇÃO
         * =====================================================
         */

        this.rotation.y =
            THREE.MathUtils.degToRad(
                rotationY
            );


        /*
         * =====================================================
         * CRIA BANCO
         * =====================================================
         */

        this.createLegs();

        this.createSeat();

    }


    /*
     * =====================================================
     * PERNAS
     * =====================================================
     *
     * Dois suportes retangulares nas laterais.
     */

    createLegs() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x222222,

                roughness: 0.8,

                metalness: 0

            });


        const geometry =
            new THREE.BoxGeometry(

                this.legWidth,

                this.legHeight,

                this.legDepth

            );


        /*
         * =================================================
         * PERNA ESQUERDA
         * =================================================
         */

        const leftLeg =
            new THREE.Mesh(

                geometry,
                material

            );


        leftLeg.position.set(

            -this.width / 2 +
            this.legWidth / 2,

            this.legHeight / 2,

            0

        );


        leftLeg.castShadow =
            true;

        leftLeg.receiveShadow =
            true;


        this.add(
            leftLeg
        );


        /*
         * =================================================
         * PERNA DIREITA
         * =================================================
         */

        const rightLeg =
            new THREE.Mesh(

                geometry,
                material

            );


        rightLeg.position.set(

            this.width / 2 -
            this.legWidth / 2,

            this.legHeight / 2,

            0

        );


        rightLeg.castShadow =
            true;

        rightLeg.receiveShadow =
            true;


        this.add(
            rightLeg
        );

    }


    /*
     * =====================================================
     * ASSENTO
     * =====================================================
     *
     * Três chapas de madeira.
     *
     * Cada chapa possui:
     *
     *     borda preta
     *     interior branco
     */

    createSeat() {

        /*
        * =================================================
        * CONFIGURAÇÃO
        * =================================================
        */

        const plankCount =
            3;

        const gap =
            0.12;

        const borderThickness =
            0.01;

        const plankDepth =
            (
                this.depth -
                gap * (plankCount - 1)
            ) /
            plankCount;


        /*
        * =================================================
        * MATERIAIS
        * =================================================
        */

        const borderMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x000000,

                roughness: 0.8,

                metalness: 0

            });


        const woodMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xeeeeee,

                roughness: 0.8,

                metalness: 0

            });


        /*
        * =================================================
        * CRIA AS 3 TÁBUAS
        * =================================================
        */

        for (
            let i = 0;
            i < plankCount;
            i++
        ) {

            /*
            * =================================================
            * POSIÇÃO Z
            * =================================================
            *
            * Mantemos a largura inteira do banco
            * no eixo X e dividimos apenas a profundidade.
            */

            const z =
                (
                    -this.depth / 2
                ) +

                (
                    plankDepth / 2
                ) +

                i *
                (
                    plankDepth +
                    gap
                );


            /*
            * =================================================
            * BORDA PRETA
            * =================================================
            */

            const borderGeometry =
                new THREE.BoxGeometry(

                    this.width +
                    borderThickness,

                    this.seatThickness +
                    borderThickness,

                    plankDepth +
                    borderThickness

                );


            const border =
                new THREE.Mesh(

                    borderGeometry,

                    borderMaterial

                );


            border.position.set(

                0,

                this.seatHeight,

                z

            );


            border.castShadow =
                true;

            border.receiveShadow =
                true;


            /*
            * =================================================
            * INTERIOR BRANCO
            * =================================================
            */

            const plankGeometry =
                new THREE.BoxGeometry(

                    this.width - 0.02,

                    this.seatThickness,

                    plankDepth

                );


            const plank =
                new THREE.Mesh(

                    plankGeometry,

                    woodMaterial

                );


            plank.position.set(

                0,

                this.seatHeight +
                0.01,

                z

            );


            plank.castShadow =
                true;

            plank.receiveShadow =
                true;


            /*
            * =================================================
            * ADICIONA AO BANCO
            * =================================================
            */

            this.add(
                border
            );

            this.add(
                plank
            );

        }

    }

    /*
     * =====================================================
     * COLLIDER
     * =====================================================
     */

    getCollider(
        padding = 0.05
    ) {

        const halfWidth =
            this.width / 2;

        const halfDepth =
            this.depth / 2;


        /*
         * =================================================
         * CONSIDERA A ROTAÇÃO DO BANCO
         * =================================================
         */

        const angle =
            this.rotation.y;


        const cos =
            Math.abs(
                Math.cos(angle)
            );


        const sin =
            Math.abs(
                Math.sin(angle)
            );


        const rotatedHalfWidth =
            halfWidth * cos +
            halfDepth * sin;


        const rotatedHalfDepth =
            halfWidth * sin +
            halfDepth * cos;


        /*
         * =================================================
         * RETORNA O RETÂNGULO DE COLISÃO
         * =================================================
         */

        return {

            minX:
                this.position.x -
                rotatedHalfWidth -
                padding,

            maxX:
                this.position.x +
                rotatedHalfWidth +
                padding,

            minZ:
                this.position.z -
                rotatedHalfDepth -
                padding,

            maxZ:
                this.position.z +
                rotatedHalfDepth +
                padding

        };

    }
}