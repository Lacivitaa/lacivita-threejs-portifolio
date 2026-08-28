import * as THREE from 'three';

import {
    Envelope
} from './Envelope.js';


export class SecretButton extends THREE.Group {

    constructor({

        scene,

        position = {
            x: 0,
            y: 1.8,
            z: 49.7
        },

        interactionDistance = 3

    }) {

        super();


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.scene =
            scene;

        this.interactionDistance =
            interactionDistance;

        this.activated =
            false;

        this.animating =
            false;


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
         * ÁUDIO DA PORTA
         * =====================================================
         *
         * Coloque o arquivo em:
         *
         * /public/assets/audio/door-open.mp3
         *
         * Se estiver usando /assets/... normalmente,
         * o caminho abaixo será:
         *
         * /assets/audio/door-open.mp3
         */

        this.doorSound =
            new Audio(
                '/assets/audio/door.mp3'
            );

        this.doorSound.preload =
            'auto';

        this.doorSound.volume =
            0.5;


        /*
         * =====================================================
         * CRIA COMPONENTES
         * =====================================================
         */

        this.createButton();

        this.createOpening();


        /*
         * =====================================================
         * USER DATA
         * =====================================================
         */

        this.userData.type =
            'secret-button';

    }


    /*
     * =====================================================
     * BOTÃO
     * =====================================================
     */

    createButton() {

        /*
         * =================================================
         * CÍRCULO EXTERNO
         * =================================================
         */

        const outerGeometry =
            new THREE.CylinderGeometry(

                0.42,
                0.42,
                0.10,
                48

            );


        const blackMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x000000,

                roughness: 0.7,

                metalness: 0

            });


        this.outerButton =
            new THREE.Mesh(

                outerGeometry,
                blackMaterial

            );


        this.outerButton.rotation.x =
            Math.PI / 2;


        /*
         * =================================================
         * POSIÇÃO
         * =================================================
         *
         * O botão NÃO será movimentado durante
         * a animação.
         */

        this.outerButton.position.z =
            -0.08;


        this.outerButton.castShadow =
            true;

        this.outerButton.receiveShadow =
            true;


        this.add(
            this.outerButton
        );


        /*
         * =================================================
         * CÍRCULO INTERNO
         * =================================================
         */

        const innerGeometry =
            new THREE.CylinderGeometry(

                0.27,
                0.27,
                0.12,
                48

            );


        const whiteMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                roughness: 0.7,

                metalness: 0

            });


        this.innerButton =
            new THREE.Mesh(

                innerGeometry,
                whiteMaterial

            );


        this.innerButton.rotation.x =
            Math.PI / 2;


        this.innerButton.position.z =
            -0.15;


        this.innerButton.castShadow =
            true;

        this.innerButton.receiveShadow =
            true;


        this.add(
            this.innerButton
        );

    }

    /*
     * =====================================================
     * ABERTURA RETANGULAR
     * =====================================================
     */

    createOpening() {

        /*
         * =================================================
         * DIMENSÕES
         * =================================================
         */

        this.openingWidth =
            1.9;

        this.openingHeight =
            1.15;


        /*
         * =================================================
         * FUNDO PRETO
         * =================================================
         *
         * É o interior escuro da parede.
         */

        const openingGeometry =
            new THREE.BoxGeometry(

                this.openingWidth - 0.02,
                this.openingHeight - 0.02,
                0.04

            );


        const openingMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x020202

            });


        this.opening =
            new THREE.Mesh(

                openingGeometry,
                openingMaterial

            );


        /*
         * Fica abaixo do botão.
         */

        this.opening.position.set(

            0,
            -1.15,
            0.015

        );


        this.add(
            this.opening
        );


        /*
         * =================================================
         * PORTINHAS
         * =================================================
         *
         * Duas folhas pretas fecham a abertura.
         *
         * Quando abre:
         *
         *       | | 
         *       ↓ ↓
         *
         * elas deslizam para os lados.
         */

        const doorWidth =
            this.openingWidth / 2;

        const doorHeight =
            this.openingHeight;


        const doorGeometry =
            new THREE.BoxGeometry(

                doorWidth,
                doorHeight,
                0.06

            );


        const doorMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xFFFFFF,

                roughness: 0.8,

                metalness: 0

            });


        this.leftDoor =
            new THREE.Mesh(

                doorGeometry,
                doorMaterial

            );


        this.rightDoor =
            new THREE.Mesh(

                doorGeometry,
                doorMaterial

            );


        /*
         * Posicionamento inicial.
         *
         * Fechadas formam um único retângulo.
         */

        this.leftDoor.position.set(

            -doorWidth / 2,
            -1.15,
            -0.01

        );


        this.rightDoor.position.set(

            doorWidth / 2,
            -1.15,
            -0.01

        );


        this.leftDoor.castShadow =
            true;

        this.rightDoor.castShadow =
            true;


        this.add(
            this.leftDoor
        );

        this.add(
            this.rightDoor
        );


        /*
         * =================================================
         * ESTADO DA PORTA
         * =================================================
         */

        this.doorAnimationProgress =
            0;

        this.doorAnimationDuration =
            1000;


        this.leftDoorStartX =
            this.leftDoor.position.x;

        this.rightDoorStartX =
            this.rightDoor.position.x;


        this.leftDoorTargetX =
            -this.openingWidth;

        this.rightDoorTargetX =
            this.openingWidth;


    }


    /*
     * =====================================================
     * PRESSIONAR
     * =====================================================
     */

    press() {

        if (
            this.activated ||
            this.animating
        ) {

            return;

        }


        this.activated =
            true;

        this.animating =
            true;


        /*
         * =================================================
         * ÁUDIO
         * =================================================
         */

        this.doorSound.currentTime =
            0;


        this.doorSound.play()
            .catch(
                (error) => {

                    console.warn(

                        'Não foi possível reproduzir o som da porta:',

                        error

                    );

                }
            );


        /*
         * =================================================
         * ABERTURA
         * =================================================
         */

        this.doorAnimationStart =
            performance.now();


        /*
         * =================================================
         * CRIA ENVELOPE
         * =================================================
         *
         * O envelope só começa a sair depois que
         * a abertura começa.
         */

        setTimeout(

            () => {

                this.createEnvelope();

            },
            500
        );
    }


    /*
     * =====================================================
     * ENVELOPE
     * =====================================================
     */

    createEnvelope() {

        this.envelope =
            new Envelope({

                position: {

                    x:
                        this.position.x,

                    y:
                        this.position.y - 1.65,

                    z:
                        this.position.z - 0.15

                }

            });


        this.scene.add(
            this.envelope
        );


        /*
         * Começa atrás da parede.
         */

        this.envelope.startAnimation();

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta) {

        /*
         * =================================================
         * ABERTURA DA PORTA
         * =================================================
         */

        if (
            this.animating
        ) {

            const elapsed =
                performance.now() -
                this.doorAnimationStart;


            const progress =
                Math.min(

                    elapsed /
                    this.doorAnimationDuration,

                    1

                );


            /*
             * Ease-out.
             */

            const eased =
                1 -
                Math.pow(

                    1 - progress,
                    3

                );


            /*
             * =================================================
             * PORTA ESQUERDA
             * =================================================
             */

            this.leftDoor.position.x =
                THREE.MathUtils.lerp(

                    this.leftDoorStartX,

                    this.leftDoorTargetX,

                    eased

                );


            /*
             * =================================================
             * PORTA DIREITA
             * =================================================
             */

            this.rightDoor.position.x =
                THREE.MathUtils.lerp(

                    this.rightDoorStartX,

                    this.rightDoorTargetX,

                    eased

                );


            if (
                progress >= 1
            ) {

                this.animating =
                    false;

            }

        }


        /*
         * =================================================
         * ENVELOPE
         * =================================================
         */

        if (
            this.envelope
        ) {

            this.envelope.update(
                delta
            );

        }

    }

}