import * as THREE from 'three';


export class Envelope extends THREE.Group {

    constructor({

        position = {

            x: 0,

            y: 4,

            z: 49

        }

    }) {

        super();


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.width =
            1.6;

        this.height =
            1.0;

        this.depth =
            0.08;


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
         * ESTADO
         * =====================================================
         */

        this.isAnimating =
            false;

        this.phase =
            'idle';


        this.velocity =
            new THREE.Vector3();


        this.gravity =
            11;


        /*
         * =====================================================
         * ROTAÇÃO
         * =====================================================
         */

        this.rotationVelocity =
            new THREE.Vector3();


        /*
         * =====================================================
         * CRIA ENVELOPE
         * =====================================================
         */

        this.createEnvelope();

        this.userData.type =
            'envelope';

    }


    /*
     * =====================================================
     * CORPO DO ENVELOPE
     * =====================================================
     */

    createEnvelope() {

        /*
         * =================================================
         * BORDA
         * =================================================
         */

        const borderGeometry =
            new THREE.BoxGeometry(

                this.width + 0.06,

                this.height + 0.06,

                this.depth + 0.04

            );


        const borderMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x000000,

                roughness: 0.8,

                metalness: 0

            });


        const border =
            new THREE.Mesh(

                borderGeometry,

                borderMaterial

            );


        border.castShadow =
            true;

        border.receiveShadow =
            true;


        this.add(
            border
        );


        /*
         * =================================================
         * PAPEL
         * =================================================
         */

        const paperGeometry =
            new THREE.BoxGeometry(

                this.width,

                this.height,

                this.depth

            );


        const paperMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                roughness: 0.85,

                metalness: 0

            });


        const paper =
            new THREE.Mesh(

                paperGeometry,

                paperMaterial

            );


        paper.position.z =
            -0.015;


        paper.castShadow =
            true;

        paper.receiveShadow =
            true;


        this.add(
            paper
        );


        /*
         * =================================================
         * ABA DO ENVELOPE
         * =================================================
         */

        const flapShape =
            new THREE.Shape();


        flapShape.moveTo(

            -this.width / 2,

            this.height / 2

        );


        flapShape.lineTo(

            0,

            0

        );


        flapShape.lineTo(

            this.width / 2,

            this.height / 2

        );


        flapShape.lineTo(

            -this.width / 2,

            this.height / 2

        );


        const flapGeometry =
            new THREE.ShapeGeometry(

                flapShape

            );


        const flapMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                side: THREE.DoubleSide,

                roughness: 0.85,

                metalness: 0

            });


        const flap =
            new THREE.Mesh(

                flapGeometry,

                flapMaterial

            );


        flap.position.z =
            -0.07;


        flap.position.y =
            0;


        flap.castShadow =
            true;

        flap.receiveShadow =
            true;


        this.add(
            flap
        );

    }


    /*
     * =====================================================
     * INICIA ANIMAÇÃO
     * =====================================================
     */

    startAnimation() {

        this.isAnimating =
            true;

        this.phase =
            'emerging';


        /*
         * =================================================
         * VELOCIDADE INICIAL
         * =================================================
         *
         * Sai da parede para dentro da galeria.
         */

        this.velocity.set(

            0,

            0.8,

            -2.2

        );


        /*
         * =================================================
         * ROTAÇÃO INICIAL
         * =================================================
         */

        this.rotation.set(

            0,
            0,
            0

        );


        this.rotationVelocity.set(

            1.8,
            0.4,
            1.2

        );

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta) {

        if (
            !this.isAnimating
        ) {

            return;

        }


        /*
         * =================================================
         * SAINDO DA PAREDE
         * =================================================
         */

        if (
            this.phase ===
            'emerging'
        ) {

            this.position.x +=

                this.velocity.x *
                delta;


            this.position.y +=

                this.velocity.y *
                delta;


            this.position.z +=

                this.velocity.z *
                delta;


            this.rotation.x +=

                this.rotationVelocity.x *
                delta;


            this.rotation.y +=

                this.rotationVelocity.y *
                delta;


            this.rotation.z +=

                this.rotationVelocity.z *
                delta;


            /*
             * Depois de sair da parede,
             * começa a queda.
             */

            if (
                this.position.z <
                48.3
            ) {

                this.phase =
                    'falling';

            }


            return;

        }


        /*
         * =================================================
         * QUEDA
         * =================================================
         */

        if (
            this.phase ===
            'falling'
        ) {

            /*
             * Gravidade.
             */

            this.velocity.y -=

                this.gravity *
                delta;


            /*
             * Movimento.

             */

            this.position.x +=

                this.velocity.x *
                delta;


            this.position.y +=

                this.velocity.y *
                delta;


            this.position.z +=

                this.velocity.z *
                delta;


            /*
             * Rotação durante a queda.
             */

            this.rotation.x +=

                this.rotationVelocity.x *
                delta;


            this.rotation.y +=

                this.rotationVelocity.y *
                delta;


            this.rotation.z +=

                this.rotationVelocity.z *
                delta;


            /*
             * =================================================
             * COLISÃO COM O CHÃO
             * =================================================
             */

            const floorHeight =
                this.depth / 2;


            if (
                this.position.y <=
                floorHeight
            ) {

                this.position.y =
                    floorHeight;


                /*
                 * Pequeno quique.
                 */

                if (
                    Math.abs(
                        this.velocity.y
                    ) > 1
                ) {

                    this.velocity.y =

                        Math.abs(
                            this.velocity.y
                        ) * 0.25;


                } else {

                    this.velocity.y =
                        0;

                    this.velocity.x =
                        0;

                    this.velocity.z =
                        0;


                    /*
                     * =================================================
                     * PARA A ROTAÇÃO
                     * =================================================
                     */

                    this.rotationVelocity.set(

                        0,
                        0,
                        0

                    );


                    /*
                     * =================================================
                     * ESTABILIZA NO CHÃO
                     * =================================================
                     *
                     * Não importa em que ângulo ele caiu.
                     *
                     * Agora ele vai suavemente para:
                     *
                     * rotation.x = 0
                     * rotation.y = 0
                     * rotation.z = 0
                     *
                     * ficando completamente chapado.
                     */

                    this.startLandingAnimation();

                }

            }

        }


        /*
         * =================================================
         * ESTABILIZAÇÃO
         * =================================================
         */

        if (
            this.phase ===
            'landing'
        ) {

            this.updateLanding(
                delta
            );

        }

    }


    /*
     * =====================================================
     * ANIMAÇÃO DE ATERRISSAGEM
     * =====================================================
     */

    startLandingAnimation() {

        this.phase =
            'landing';


        this.landingProgress =
            0;


        this.landingDuration =
            0.35;


        /*
        * =================================================
        * GUARDA A ROTAÇÃO EXATA DO MOMENTO DA QUEDA
        * =================================================
        *
        * Y e Z permanecem exatamente como estavam
        * quando o envelope bateu no chão.
        *
        * Apenas X será corrigido para 90 graus.
        */

        this.landingStartRotation =
            this.rotation.clone();


        this.landingTargetRotation =
            new THREE.Euler(

                Math.PI / 1.95,

                -0.05,

                this.rotation.z

            );

    }


    /*
     * =====================================================
     * UPDATE DA ATERRISSAGEM
     * =====================================================
     */

    updateLanding(delta) {

        this.landingProgress +=

            delta /
            this.landingDuration;


        const progress =
            Math.min(

                this.landingProgress,

                1

            );


        /*
        * Ease-out suave.
        */

        const eased =
            1 -
            Math.pow(

                1 - progress,
                3

            );


        /*
        * =================================================
        * ROTAÇÃO X
        * =================================================
        *
        * Corrige somente o eixo X para que o envelope
        * termine tombado 90 graus para trás.
        */

        this.rotation.x =
            THREE.MathUtils.lerp(

                this.landingStartRotation.x,

                this.landingTargetRotation.x,

                eased

            );


        /*
        * =================================================
        * ROTAÇÃO Y
        * =================================================
        *
        * Mantém exatamente o ângulo que ele tinha
        * quando bateu no chão.
        */

        this.rotation.y =
            THREE.MathUtils.lerp(

                this.landingStartRotation.y,

                this.landingTargetRotation.y,

                eased

            );


        /*
        * =================================================
        * ROTAÇÃO Z
        * =================================================
        *
        * Mantém exatamente o ângulo que ele tinha
        * quando bateu no chão.
        */

        this.rotation.z =
            THREE.MathUtils.lerp(

                this.landingStartRotation.z,

                this.landingTargetRotation.z,

                eased

            );


        /*
        * =================================================
        * FINAL
        * =================================================
        */

        if (
            progress >= 1
        ) {

            this.rotation.set(

                this.landingTargetRotation.x,

                this.landingTargetRotation.y,

                this.landingTargetRotation.z

            );


            this.velocity.set(

                0,
                0,
                0

            );


            this.rotationVelocity.set(

                0,
                0,
                0

            );


            this.phase =
                'finished';


            this.isAnimating =
                false;

        }

    }

}