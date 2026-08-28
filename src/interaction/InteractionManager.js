import * as THREE from 'three';


export class InteractionManager {

    constructor(

        camera,

        pedestals,

        modal,

        secretButton = null

    ) {

        this.camera =
            camera;

        this.pedestals =
            pedestals;

        this.modal =
            modal;

        this.secretButton =
            secretButton;


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.interactionDistance =
            3;

        this.currentPedestal =
            null;

        this.currentSecretButton =
            null;

        this.currentEnvelope =
            null;


        /*
         * =====================================================
         * INTERACTION ELEMENT
         * =====================================================
         */

        this.interactionElement =
            document.getElementById(
                'interaction'
            );


        /*
         * =====================================================
         * KEYBOARD
         * =====================================================
         */

        this.setupKeyboard();

    }


    /*
     * =====================================================
     * KEYBOARD
     * =====================================================
     */

    setupKeyboard() {

        document.addEventListener(

            'keydown',

            (event) => {

                if (
                    event.code !==
                    'KeyE'
                ) {

                    return;

                }


                /*
                 * =================================================
                 * ENVELOPE
                 * =================================================
                 *
                 * O envelope tem prioridade.
                 *
                 * Mas ele só será colocado aqui pelo update()
                 * depois que a animação terminar.
                 */

                if (
                    this.currentEnvelope
                ) {

                    this.openEnvelope();

                    return;

                }


                /*
                 * =================================================
                 * BOTÃO SECRETO
                 * =================================================
                 */

                if (
                    this.currentSecretButton
                ) {

                    this.currentSecretButton.press();

                    this.hideInteraction();

                    return;

                }


                /*
                 * =================================================
                 * PEDESTAL
                 * =================================================
                 */

                if (
                    this.currentPedestal
                ) {

                    this.open();

                }

            }

        );

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta = 0) {

        if (!this.camera) {

            return;

        }


        /*
         * =====================================================
         * ANIMAÇÃO DO BOTÃO
         * =====================================================
         *
         * NÃO remover isso.
         *
         * O SecretButton é responsável por atualizar
         * o próprio envelope.
         */

        if (
            this.secretButton
        ) {

            this.secretButton.update(
                delta
            );

        }


        /*
         * =====================================================
         * RESET
         * =====================================================
         */

        this.currentPedestal =
            null;

        this.currentSecretButton =
            null;

        this.currentEnvelope =
            null;


        let closestObject =
            null;

        let closestDistance =
            Infinity;

        let objectType =
            null;


        /*
         * =====================================================
         * PEDESTAIS
         * =====================================================
         */

        if (
            this.pedestals
        ) {

            for (
                const pedestal of this.pedestals
            ) {

                if (
                    !pedestal
                ) {

                    continue;

                }


                const pedestalPosition =
                    pedestal.getWorldPosition(

                        new THREE.Vector3()

                    );


                const distance =
                    this.camera.position.distanceTo(

                        pedestalPosition

                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closestObject =
                        pedestal;

                    objectType =
                        'pedestal';

                }

            }

        }


        /*
         * =====================================================
         * BOTÃO SECRETO
         * =====================================================
         */

        if (
            this.secretButton &&
            !this.secretButton.activated
        ) {

            const buttonPosition =
                this.secretButton.getWorldPosition(

                    new THREE.Vector3()

                );


            const distance =
                this.camera.position.distanceTo(

                    buttonPosition

                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestObject =
                    this.secretButton;

                objectType =
                    'secret-button';

            }

        }


        /*
         * =====================================================
         * ENVELOPE
         * =====================================================
         */

        if (
            this.secretButton &&
            this.secretButton.envelope
        ) {

            const envelope =
                this.secretButton.envelope;


            /*
             * =================================================
             * IMPORTANTE
             * =================================================
             *
             * Só considera o envelope depois que a animação
             * terminou completamente.
             *
             * Enquanto ele estiver:
             *
             * emerging
             * falling
             * landing
             *
             * ele NÃO existe para fins de interação.
             */

            if (
                envelope.phase ===
                'finished'
            ) {

                const envelopePosition =
                    envelope.getWorldPosition(

                        new THREE.Vector3()

                    );


                const distance =
                    this.camera.position.distanceTo(

                        envelopePosition

                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closestObject =
                        envelope;

                    objectType =
                        'envelope';

                }

            }

        }


        /*
         * =====================================================
         * NADA PRÓXIMO
         * =====================================================
         */

        if (
            !closestObject ||
            closestDistance >
                this.interactionDistance
        ) {

            this.hideInteraction();

            return;

        }


        /*
         * =====================================================
         * PEDESTAL
         * =====================================================
         */

        if (
            objectType ===
            'pedestal'
        ) {

            this.currentPedestal =
                closestObject;

            this.showInteraction();

            return;

        }


        /*
         * =====================================================
         * BOTÃO
         * =====================================================
         */

        if (
            objectType ===
            'secret-button'
        ) {

            this.currentSecretButton =
                closestObject;

            this.showInteraction();

            return;

        }


        /*
         * =====================================================
         * ENVELOPE
         * =====================================================
         */

        if (
            objectType ===
            'envelope'
        ) {

            this.currentEnvelope =
                closestObject;

            this.showEnvelopeInteraction();

        }

    }


    /*
     * =====================================================
     * SHOW — PEDESTAL / BOTÃO
     * =====================================================
     */

    showInteraction() {

        if (
            !this.interactionElement
        ) {

            return;

        }


        this.interactionElement.innerHTML = `

            <span class="interaction-text">

                PRESS

            </span>

            <span class="interaction-key">

                E

            </span>

        `;


        this.interactionElement.classList.add(
            'visible'
        );

    }


    /*
     * =====================================================
     * SHOW — ENVELOPE
     * =====================================================
     */

    showEnvelopeInteraction() {

        if (
            !this.interactionElement
        ) {

            return;

        }


        this.interactionElement.innerHTML = `

            <span class="interaction-text">

                OPEN

            </span>

            <span class="interaction-key">

                E

            </span>

        `;


        this.interactionElement.classList.add(
            'visible'
        );

    }


    /*
     * =====================================================
     * HIDE
     * =====================================================
     */

    hideInteraction() {

        if (
            !this.interactionElement
        ) {

            return;

        }


        this.interactionElement.classList.remove(
            'visible'
        );

    }


    /*
     * =====================================================
     * OPEN — PEDESTAL
     * =====================================================
     */

    open() {

        if (
            !this.currentPedestal
        ) {

            return;

        }


        this.modal.open(

            this.currentPedestal

        );


        this.hideInteraction();

    }


    /*
     * =====================================================
     * OPEN — ENVELOPE
     * =====================================================
     */

    openEnvelope() {

        if (
            !this.currentEnvelope
        ) {

            return;

        }


        /*
         * Segurança:
         *
         * mesmo que alguém tente apertar E durante
         * a animação, nada acontece.
         */

        if (
            this.currentEnvelope.phase !==
            'finished'
        ) {

            return;

        }


        /*
         * Abre o modal especial do cachorro.
         */

        this.modal.openDog();


        this.hideInteraction();

    }

}