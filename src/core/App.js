import * as THREE from 'three';

import {
    SceneManager
} from './SceneManager.js';

import {
    Player
} from '../player/Player.js';

import {
    Gallery
} from '../gallery/Gallery.js';

import {
    InteractionManager
} from '../interaction/InteractionManager.js';

import {
    Modal
} from '../ui/Modal.js';

import {
    InkTransition
} from '../transitions/InkTransition.js';


export class App {

    constructor(container) {

        this.container =
            container;

        this.sceneManager =
            new SceneManager(
                container
            );

        this.player =
            new Player(
                this.sceneManager.camera,
                this.sceneManager.renderer.domElement,
                this.sceneManager.scene
            );

        this.gallery =
            new Gallery(
                this.sceneManager.scene,
                this.player
            );

        this.modal =
            new Modal(
                () => {
                    this.player.unlock();
                },
                () => {
                    this.player.lock();
                }
            );


        this.interaction =
            new InteractionManager(
                this.sceneManager.camera,
                this.gallery.pedestals,
                this.modal,
                this.gallery.secretButton
            );


        /*
         * =====================================================
         * TRANSIÇÃO
         * =====================================================
         */

        this.inkTransition =
            new InkTransition(
                document.body
            );


        this.clock =
            new THREE.Clock();


        /*
         * =====================================================
         * AUDIO
         * =====================================================
         */

        this.welcomeSound =
            new Audio(
                 `${import.meta.env.BASE_URL}/assets/audio/welcome.mp3`
            );

        this.galleryMusic =
            new Audio(
                `${import.meta.env.BASE_URL}/assets/audio/gallery-loop.mp3`
            );


        /*
         * Som do clique
         */

        this.welcomeSound.volume =
            1;


        /*
         * Música ambiente
         */

        this.galleryMusic.loop =
            true;


        /*
         * Pré-carrega os arquivos
         */

        this.welcomeSound.preload =
            'auto';

        this.galleryMusic.preload =
            'auto';


        this.setupStartScreen();

        this.setupPointerLock();

        this.animate();

    }


    /*
     * =====================================================
     * START SCREEN
     * =====================================================
     */

    setupStartScreen() {

        const startScreen =
            document.getElementById(
                'start-screen'
            );

        const startButton =
            document.getElementById(
                'start-button'
            );


        if (
            !startScreen ||
            !startButton
        ) {

            console.error(
                'Tela inicial ou botão START não encontrados.'
            );

            return;

        }


        startButton.addEventListener(
            'click',
            () => {

                startButton.disabled =
                    true;


                /*
                 * =====================================================
                 * AUDIO
                 * =====================================================
                 */

                /*
                 * Som do clique
                 */

                this.welcomeSound.currentTime =
                    0;


                this.welcomeSound.play()
                    .catch(
                        (error) => {

                            console.warn(
                                'Não foi possível reproduzir o som de welcome:',
                                error
                            );

                        }
                    );


                /*
                 * Música ambiente
                 */

                this.startGalleryMusic();


                /*
                 * =====================================================
                 * TRANSIÇÃO
                 * =====================================================
                 */

                this.inkTransition.start(

                    1400,

                    () => {

                        startScreen.style.display =
                            'none';

                        startButton.disabled =
                            false;

                        this.player.lock();

                    }

                );

            }
        );

    }


    /*
     * =====================================================
     * POINTER LOCK
     * =====================================================
     */

    setupPointerLock() {

        const canvas =
            this.sceneManager.renderer.domElement;


        if (!canvas) {

            console.error(
                'Canvas do Three.js não encontrado.'
            );

            return;

        }


        /*
         * =====================================================
         * RECUPERA POINTER LOCK AO CLICAR NO CANVAS
         * =====================================================
         */

        canvas.addEventListener(
            'click',
            () => {

                const startScreen =
                    document.getElementById(
                        'start-screen'
                    );


                /*
                 * Não tenta assumir o controle
                 * enquanto a tela inicial estiver aberta.
                 */

                if (
                    startScreen &&
                    startScreen.style.display !== 'none'
                ) {

                    return;

                }


                /*
                 * Não tenta recuperar o mouse
                 * se algum modal estiver aberto.
                 */

                const modal =
                    document.getElementById(
                        'modal'
                    );


                if (
                    modal &&
                    !modal.classList.contains('hidden')
                ) {

                    return;

                }


                this.player.lock();

            }
        );


        /*
         * =====================================================
         * POINTER LOCK PERDIDO
         * =====================================================
         */

        this.player.controls.addEventListener(
            'unlock',
            () => {

                console.log(
                    'Pointer Lock perdido.'
                );

            }
        );


        /*
         * =====================================================
         * RECUPERA AO VOLTAR PARA A JANELA
         * =====================================================
         */

        document.addEventListener(
            'pointerlockchange',
            () => {

                const locked =
                    document.pointerLockElement ===
                    canvas;


                if (locked) {

                    console.log(
                        'Pointer Lock ativo.'
                    );

                } else {

                    console.log(
                        'Pointer Lock desativado.'
                    );

                }

            }
        );


        /*
         * =====================================================
         * QUANDO A JANELA VOLTA A TER FOCO
         * =====================================================
         */

        window.addEventListener(
            'focus',
            () => {

                const startScreen =
                    document.getElementById(
                        'start-screen'
                    );

                const modal =
                    document.getElementById(
                        'modal'
                    );


                if (
                    startScreen &&
                    startScreen.style.display !== 'none'
                ) {

                    return;

                }


                if (
                    modal &&
                    !modal.classList.contains('hidden')
                ) {

                    return;

                }


                /*
                 * Pequeno delay para garantir que
                 * o navegador terminou de recuperar o foco.
                 */

                setTimeout(
                    () => {

                        this.player.lock();

                    },
                    100
                );

            }
        );

    }


    /*
     * =====================================================
     * ANIMAÇÃO
     * =====================================================
     */

    animate() {

        requestAnimationFrame(
            () =>
                this.animate()
        );


        const delta =
            this.clock.getDelta();


        this.player.update(
            delta
        );


        this.interaction.update(
            delta
        );


        this.sceneManager.render();

    }


    /*
     * =====================================================
     * MÚSICA DA GALERIA
     * =====================================================
     */

    startGalleryMusic() {

        this.galleryMusic.currentTime =
            0;

        this.galleryMusic.volume =
            0;

        this.galleryMusic.loop =
            true;


        this.galleryMusic.play()
            .then(
                () => {

                    const targetVolume =
                        0.2;

                    const fadeDuration =
                        6000;

                    const startTime =
                        performance.now();


                    const fadeIn =
                        (currentTime) => {

                            const elapsed =
                                currentTime -
                                startTime;


                            const progress =
                                Math.min(
                                    elapsed /
                                    fadeDuration,
                                    1
                                );


                            /*
                             * Ease suave
                             */

                            const eased =
                                progress *
                                progress *
                                (3 - 2 * progress);


                            this.galleryMusic.volume =
                                targetVolume *
                                eased;


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    fadeIn
                                );

                            } else {

                                this.galleryMusic.volume =
                                    targetVolume;

                            }

                        };


                    requestAnimationFrame(
                        fadeIn
                    );

                }
            )
            .catch(
                (error) => {

                    console.warn(
                        'Não foi possível reproduzir a música:',
                        error
                    );

                }
            );

    }

}