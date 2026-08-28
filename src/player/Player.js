import * as THREE from 'three';

import {
    PointerLockControls
} from 'three/addons/controls/PointerLockControls.js';


export class Player {

    constructor(
        camera,
        domElement,
        scene
    ) {

        this.camera = camera;

        this.scene = scene;

        this.controls =
            new PointerLockControls(
                camera,
                domElement
            );


        /*
         * =====================================================
         * MOVIMENTO
         * =====================================================
         */

        this.velocity =
            new THREE.Vector3();

        this.direction =
            new THREE.Vector3();

        this.keys = {

            forward: false,

            backward: false,

            left: false,

            right: false,

            shift: false

        };

        this.speed = 5;

        this.runSpeed = 13;


        /*
         * =====================================================
         * ALTURA DO JOGADOR
         * =====================================================
         */

        this.camera.position.y = 1.7;


        /*
         * =====================================================
         * TAMANHO DE SEGURANÇA
         * =====================================================
         *
         * O jogador é tratado como uma esfera/círculo
         * no plano X/Z.
         */

        this.radius = 0.5;


        /*
         * =====================================================
         * COLLIDERS
         * =====================================================
         *
         * Cada collider possui:
         *
         *     minX
         *     maxX
         *     minZ
         *     maxZ
         *
         * Esses valores representam uma caixa de colisão
         * no plano do chão.
         */

        this.colliders = [];


        /*
         * =====================================================
         * LIMITES DA GALERIA
         * =====================================================
         */

        this.bounds = {

            minX: -49.3,

            maxX: 49.3,

            minZ: -49.3,

            maxZ: 49.3

        };


        /*
         * =====================================================
         * PASSOS
         * =====================================================
         */

        this.footstepTimer = 0;

        this.footstepInterval = 0.4;

        this.footstepVolume = 1;

        this.footstepAudio =
            new Audio(
                '/assets/audio/footstep.mp3'
            );

        this.footstepAudio.volume =
            this.footstepVolume;

        this.footstepAudio.preload =
            'auto';


        /*
         * =====================================================
         * ECO DOS PASSOS
         * =====================================================
         */

        this.audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        this.footstepSource =
            this.audioContext.createMediaElementSource(
                this.footstepAudio
            );


        /*
         * =====================================================
         * SOM ORIGINAL
         * =====================================================
         */

        this.footstepDryGain =
            this.audioContext.createGain();

        this.footstepDryGain.gain.value =
            0.85;


        /*
         * =====================================================
         * ECO
         * =====================================================
         */

        this.footstepDelay =
            this.audioContext.createDelay(
                1.0
            );

        this.footstepDelay.delayTime.value =
            0.18;


        /*
         * =====================================================
         * VOLUME DO ECO
         * =====================================================
         */

        this.footstepEchoGain =
            this.audioContext.createGain();

        this.footstepEchoGain.gain.value =
            0.18;


        /*
         * =====================================================
         * FILTRO DO ECO
         * =====================================================
         */

        this.footstepEchoFilter =
            this.audioContext.createBiquadFilter();

        this.footstepEchoFilter.type =
            'lowpass';

        this.footstepEchoFilter.frequency.value =
            1800;


        /*
         * =====================================================
         * CONEXÕES
         * =====================================================
         */


        /*
         * Som original
         */

        this.footstepSource.connect(
            this.footstepDryGain
        );

        this.footstepDryGain.connect(
            this.audioContext.destination
        );


        /*
         * Caminho do eco:
         *
         * passo
         *   ↓
         * delay
         *   ↓
         * filtro
         *   ↓
         * volume baixo
         *   ↓
         * saída
         */

        this.footstepSource.connect(
            this.footstepDelay
        );

        this.footstepDelay.connect(
            this.footstepEchoFilter
        );

        this.footstepEchoFilter.connect(
            this.footstepEchoGain
        );

        this.footstepEchoGain.connect(
            this.audioContext.destination
        );


        /*
         * =====================================================
         * SOMBRA DO JOGADOR
         * =====================================================
         */

        this.createPlayerShadow();


        /*
         * =====================================================
         * TECLADO
         * =====================================================
         */

        this.setupKeyboard();

    }


    /*
     * =====================================================
     * ADICIONA COLLIDER
     * =====================================================
     *
     * Recebe um objeto THREE.Group ou THREE.Mesh e calcula
     * automaticamente sua área ocupada no mundo.
     */
    addCollider(
        collider
    ) {

        if (!collider) {

            return;

        }


        this.colliders.push(
            collider
        );

    }

    /*
     * =====================================================
     * ADICIONA COLLIDER MANUAL
     * =====================================================
     *
     * Útil caso futuramente você queira criar uma área
     * de colisão manualmente.
     */

    addBoxCollider({

        minX,

        maxX,

        minZ,

        maxZ,

        padding = 0

    }) {

        this.colliders.push({

            minX:
                minX -
                padding,

            maxX:
                maxX +
                padding,

            minZ:
                minZ -
                padding,

            maxZ:
                maxZ +
                padding

        });

    }


    /*
     * =====================================================
     * SOMBRA
     * =====================================================
     */

    createPlayerShadow() {

        /*
         * Criamos uma pequena textura radial
         * diretamente em Canvas.
         */

        const canvas =
            document.createElement(
                'canvas'
            );

        canvas.width = 128;

        canvas.height = 128;


        const context =
            canvas.getContext(
                '2d'
            );


        const gradient =
            context.createRadialGradient(

                64,
                64,
                5,

                64,
                64,
                64

            );


        /*
         * Centro mais escuro.
         */

        gradient.addColorStop(
            0,
            'rgba(0, 0, 0, 0.42)'
        );


        /*
         * Meio da sombra.
         */

        gradient.addColorStop(
            0.35,
            'rgba(0, 0, 0, 0.25)'
        );


        /*
         * Borda completamente suave.
         */

        gradient.addColorStop(
            1,
            'rgba(0, 0, 0, 0)'
        );


        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            128,
            128
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        texture.colorSpace =
            THREE.SRGBColorSpace;


        /*
         * =====================================================
         * GEOMETRIA
         * =====================================================
         */

        const geometry =
            new THREE.PlaneGeometry(
                1.4,
                1.4
            );


        /*
         * =====================================================
         * MATERIAL
         * =====================================================
         */

        const material =
            new THREE.MeshBasicMaterial({

                map: texture,

                transparent: true,

                depthWrite: false,

                depthTest: true,

                opacity: 0.9

            });


        /*
         * =====================================================
         * MESH
         * =====================================================
         */

        this.shadow =
            new THREE.Mesh(
                geometry,
                material
            );


        /*
         * Deixa o plano deitado
         * sobre o chão.
         */

        this.shadow.rotation.x =
            -Math.PI / 2;


        /*
         * Coloca um pouquinho acima
         * do chão para evitar z-fighting.
         */

        this.shadow.position.y =
            0.012;


        /*
         * A sombra deve aparecer
         * antes de outros elementos.
         */

        this.shadow.renderOrder =
            1;


        /*
         * Não precisamos que ela
         * receba ou projete sombra.
         */

        this.shadow.castShadow =
            false;

        this.shadow.receiveShadow =
            false;


        this.scene.add(
            this.shadow
        );

    }


    /*
     * =====================================================
     * TECLADO
     * =====================================================
     */

    setupKeyboard() {

        document.addEventListener(
            'keydown',
            (event) => {

                switch (
                    event.code
                ) {

                    case 'KeyW':

                        this.keys.forward =
                            true;

                        break;


                    case 'KeyS':

                        this.keys.backward =
                            true;

                        break;


                    case 'KeyA':

                        this.keys.left =
                            true;

                        break;


                    case 'KeyD':

                        this.keys.right =
                            true;

                        break;

                    case 'ShiftLeft':

                        this.keys.shift =
                            true;

                        break;

                }

            }
        );


        document.addEventListener(
            'keyup',
            (event) => {

                switch (
                    event.code
                ) {

                    case 'KeyW':

                        this.keys.forward =
                            false;

                        break;


                    case 'KeyS':

                        this.keys.backward =
                            false;

                        break;


                    case 'KeyA':

                        this.keys.left =
                            false;

                        break;


                    case 'KeyD':

                        this.keys.right =
                            false;

                        break;

                    case 'ShiftLeft':

                        this.keys.shift =
                            false;

                        break;

                }

            }
        );

    }


    /*
     * =====================================================
     * VERIFICA COLISÃO
     * =====================================================
     */

    checkCollision(
        x,
        z
    ) {

        for (
            const collider of this.colliders
        ) {

            /*
             * Verifica se o círculo do jogador
             * está tocando a caixa.
             */

            const closestX =
                THREE.MathUtils.clamp(

                    x,

                    collider.minX,

                    collider.maxX

                );


            const closestZ =
                THREE.MathUtils.clamp(

                    z,

                    collider.minZ,

                    collider.maxZ

                );


            const dx =
                x -
                closestX;


            const dz =
                z -
                closestZ;


            const distanceSquared =
                dx * dx +
                dz * dz;


            if (
                distanceSquared <
                this.radius *
                this.radius
            ) {

                return true;

            }

        }


        return false;

    }


    /*
     * =====================================================
     * MOVIMENTO COM COLISÃO
     * =====================================================
     *
     * Tentamos movimentar X e Z separadamente.
     *
     * Isso permite que o jogador deslize pela lateral
     * dos objetos em vez de ficar completamente preso.
     */

    moveWithCollision(
        deltaX,
        deltaZ
    ) {

        const position =
            this.camera.position;


        /*
         * =================================================
         * MOVIMENTO X
         * =================================================
         */

        const nextX =
            position.x +
            deltaX;


        if (
            !this.checkCollision(
                nextX,
                position.z
            )
        ) {

            position.x =
                nextX;

        }


        /*
         * =================================================
         * MOVIMENTO Z
         * =================================================
         */

        const nextZ =
            position.z +
            deltaZ;


        if (
            !this.checkCollision(
                position.x,
                nextZ
            )
        ) {

            position.z =
                nextZ;

        }

    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */

    update(delta) {

        /*
         * Se o mouse não está
         * controlando a câmera,
         * não movimenta o jogador.
         */

        if (
            !this.controls.isLocked
        ) {

            this.stopFootsteps();

            return;

        }


        /*
         * =====================================================
         * DIREÇÃO
         * =====================================================
         */

        this.direction.z =
            Number(
                this.keys.forward
            ) -
            Number(
                this.keys.backward
            );


        this.direction.x =
            Number(
                this.keys.right
            ) -
            Number(
                this.keys.left
            );


        if (
            this.direction.lengthSq() > 0
        ) {

            this.direction.normalize();

        }


        /*
         * =====================================================
         * MOVIMENTO
         * =====================================================
         */

        const currentSpeed =
            this.keys.shift
                ? this.runSpeed
                : this.speed;

        const speed =
            currentSpeed *
            delta;


        const moving =
            this.direction.lengthSq() > 0;


        /*
         * Calcula o movimento desejado
         * usando a orientação atual da câmera.
         */

        if (moving) {

            const forward =
                new THREE.Vector3();


            const right =
                new THREE.Vector3();


            /*
             * Vetor forward da câmera.
             */

            this.camera.getWorldDirection(
                forward
            );


            /*
             * Não queremos movimento vertical.
             */

            forward.y =
                0;


            forward.normalize();


            /*
             * Vetor right perpendicular ao forward.
             */

            right.crossVectors(

                forward,

                new THREE.Vector3(
                    0,
                    1,
                    0
                )

            );


            right.normalize();


            /*
             * Movimento final.
             */

            const movement =
                new THREE.Vector3();


            movement.addScaledVector(

                forward,

                this.direction.z *
                speed

            );


            movement.addScaledVector(

                right,

                this.direction.x *
                speed

            );


            this.moveWithCollision(

                movement.x,

                movement.z

            );

        }


        /*
         * =====================================================
         * LIMITES
         * =====================================================
         */

        this.applyBounds();


        /*
         * =====================================================
         * PASSOS
         * =====================================================
         */

        if (moving) {

            this.updateFootsteps(
                delta
            );

        } else {

            this.stopFootsteps();

        }


        /*
         * =====================================================
         * SOMBRA
         * =====================================================
         */

        this.updateShadow();

    }


    /*
     * =====================================================
     * PASSOS
     * =====================================================
     */

    updateFootsteps(delta) {

        this.footstepTimer +=
            delta;


        if (
            this.footstepTimer >=
            this.footstepInterval
        ) {

            this.footstepTimer = 0;

            this.playFootstep();

        }

    }


    async playFootstep() {

        if (
            !this.footstepAudio
        ) {

            return;

        }


        /*
         * Garante que o AudioContext
         * esteja funcionando.
         */

        if (
            this.audioContext &&
            this.audioContext.state === 'suspended'
        ) {

            await this.audioContext.resume();

        }


        /*
         * Reinicia o áudio.
         */

        this.footstepAudio.currentTime =
            0;


        /*
         * Pequena variação de velocidade.
         */

        this.footstepAudio.playbackRate =
            0.95 +
            Math.random() *
            0.1;


        /*
         * Toca o passo.
         */

        try {

            await this.footstepAudio.play();

        } catch (error) {

            console.warn(
                'Unable to play footstep audio:',
                error
            );

        }

    }


    stopFootsteps() {

        this.footstepTimer =
            0;

    }


    /*
     * =====================================================
     * SOMBRA
     * =====================================================
     */

    updateShadow() {

        if (
            !this.shadow
        ) {

            return;

        }


        this.shadow.position.x =
            this.camera.position.x;


        this.shadow.position.z =
            this.camera.position.z;

    }


    /*
     * =====================================================
     * LIMITES
     * =====================================================
     */

    applyBounds() {

        const position =
            this.camera.position;


        position.x =
            THREE.MathUtils.clamp(

                position.x,

                this.bounds.minX,

                this.bounds.maxX

            );


        position.z =
            THREE.MathUtils.clamp(

                position.z,

                this.bounds.minZ,

                this.bounds.maxZ

            );


        /*
         * Mantém o jogador
         * sempre na altura correta.
         */

        position.y =
            1.7;

    }


    /*
     * =====================================================
     * LOCK
     * =====================================================
     */

    lock() {

        this.controls.lock();

    }


    /*
     * =====================================================
     * UNLOCK
     * =====================================================
 */

    unlock() {

        this.controls.unlock();

        this.stopFootsteps();

    }

}