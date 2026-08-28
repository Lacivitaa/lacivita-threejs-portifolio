import * as THREE from 'three';

export class InkTransition {

    constructor(container) {

        this.container =
            container || document.body;

        this.active = false;

        this.progress = 0;

        /*
         * =====================================================
         * CANVAS
         * =====================================================
         */

        this.canvas =
            document.createElement('canvas');

        this.canvas.style.position =
            'fixed';

        this.canvas.style.left =
            '0';

        this.canvas.style.top =
            '0';

        this.canvas.style.width =
            '100vw';

        this.canvas.style.height =
            '100vh';

        this.canvas.style.zIndex =
            '10000';

        this.canvas.style.pointerEvents =
            'none';

        this.canvas.style.display =
            'none';

        this.container.appendChild(
            this.canvas
        );


        /*
         * =====================================================
         * RENDERER
         * =====================================================
         */

        this.renderer =
            new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        this.renderer.setClearColor(
            0x000000,
            0
        );


        /*
         * =====================================================
         * SCENE
         * =====================================================
         */

        this.scene =
            new THREE.Scene();


        /*
         * =====================================================
         * CAMERA
         * =====================================================
         */

        this.camera =
            new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0,
                1
            );


        /*
         * =====================================================
         * SHADER
         * =====================================================
         */

        this.material =
            new THREE.ShaderMaterial({

                transparent: true,

                depthTest: false,

                depthWrite: false,

                uniforms: {

                    progress: {
                        value: 0
                    },

                    resolution: {
                        value:
                            new THREE.Vector2(
                                window.innerWidth,
                                window.innerHeight
                            )
                    }
                },

                vertexShader: `

                    varying vec2 vUv;

                    void main() {

                        vUv = uv;

                        gl_Position =
                            vec4(
                                position,
                                1.0
                            );
                    }

                `,

                fragmentShader: `

                    uniform float progress;

                    uniform vec2 resolution;

                    varying vec2 vUv;


                    /*
                     * =================================================
                     * RANDOM
                     * =================================================
                     */

                    float random(vec2 st) {

                        return fract(
                            sin(
                                dot(
                                    st,
                                    vec2(
                                        12.9898,
                                        78.233
                                    )
                                )
                            )
                            *
                            43758.5453123
                        );
                    }


                    /*
                     * =================================================
                     * NOISE
                     * =================================================
                     */

                    float noise(vec2 st) {

                        vec2 i =
                            floor(st);

                        vec2 f =
                            fract(st);

                        float a =
                            random(i);

                        float b =
                            random(
                                i +
                                vec2(
                                    1.0,
                                    0.0
                                )
                            );

                        float c =
                            random(
                                i +
                                vec2(
                                    0.0,
                                    1.0
                                )
                            );

                        float d =
                            random(
                                i +
                                vec2(
                                    1.0,
                                    1.0
                                )
                            );

                        vec2 u =
                            f *
                            f *
                            (
                                3.0 -
                                2.0 *
                                f
                            );

                        return mix(
                            a,
                            b,
                            u.x
                        )
                        +
                        (
                            c - a
                        )
                        *
                        u.y
                        *
                        (
                            1.0 - u.x
                        )
                        +
                        (
                            d - b
                        )
                        *
                        u.x
                        *
                        u.y;
                    }


                    /*
                     * =================================================
                     * FBM
                     * =================================================
                     */

                    float fbm(vec2 st) {

                        float value =
                            0.0;

                        float amplitude =
                            0.5;

                        for (
                            int i = 0;
                            i < 5;
                            i++
                        ) {

                            value +=
                                amplitude *
                                noise(st);

                            st *=
                                2.0;

                            amplitude *=
                                0.5;
                        }

                        return value;
                    }


                    /*
                     * =================================================
                     * MAIN
                     * =================================================
                     */

                    void main() {

                        vec2 uv =
                            vUv;


                        /*
                         * Corrige proporção da tela.
                         */

                        float aspect =
                            resolution.x /
                            resolution.y;

                        vec2 centered =
                            uv -
                            0.5;

                        centered.x *=
                            aspect;


                        /*
                         * Distância do centro.
                         */

                        float distanceFromCenter =
                            length(
                                centered
                            );


                        /*
                         * Noise grande.
                         */

                        float largeNoise =
                            fbm(
                                uv * 3.0
                            );


                        /*
                         * Noise pequeno.
                         */

                        float smallNoise =
                            noise(
                                uv * 12.0
                            );


                        /*
                         * Mistura os noises.
                         */

                        float distortion =
                            largeNoise *
                            0.75
                            +
                            smallNoise *
                            0.25;


                        /*
                         * =================================================
                         * CRESCIMENTO
                         * =================================================
                         *
                         * A mancha começa pequena
                         * e cresce até ultrapassar
                         * completamente a tela.
                         */

                        float radius =
                            progress *
                            1.8;


                        /*
                         * Deformação da borda.
                         */

                        float irregularRadius =
                            radius
                            +
                            (
                                distortion -
                                0.5
                            )
                            *
                            0.65;


                        /*
                         * Borda da tinta.
                         */

                        float edge =
                            0.07;


                        float mask =
                            smoothstep(
                                irregularRadius,
                                irregularRadius -
                                edge,
                                distanceFromCenter
                            );


                        /*
                         * Preto.
                         */

                        gl_FragColor =
                            vec4(
                                0.0,
                                0.0,
                                0.0,
                                mask
                            );
                    }

                `
            });


        /*
         * =====================================================
         * QUAD
         * =====================================================
         */

        const geometry =
            new THREE.PlaneGeometry(
                2,
                2
            );

        const mesh =
            new THREE.Mesh(
                geometry,
                this.material
            );

        this.scene.add(
            mesh
        );


        /*
         * =====================================================
         * RESIZE
         * =====================================================
         */

        this.resize();

        window.addEventListener(
            'resize',
            () => {

                this.resize();

            }
        );
    }


    /*
     * =====================================================
     * RESIZE
     * =====================================================
     */

    resize() {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        this.renderer.setSize(
            width,
            height,
            false
        );


        this.material
            .uniforms
            .resolution
            .value.set(
                width,
                height
            );
    }


    /*
     * =====================================================
     * START
     * =====================================================
     */


    start(
        duration = 14000,
        onComplete = null
    ) {

        if (this.active) {
            return;
        }

        this.active = true;

        this.canvas.style.display = 'block';

        this.material.uniforms.progress.value = 0;

        const startTime = performance.now();

        /*
        * =====================================================
        * CONFIGURAÇÃO DA TRANSIÇÃO
        * =====================================================
        *
        * 70% do tempo:
        * a tinta cresce.
        *
        * 30% do tempo:
        * a tinta desaparece.
        */

        const growDuration =
            duration * 0.70;

        const revealDuration =
            duration * 0.30;


        let galleryRevealed = false;


        /*
        * =====================================================
        * ANIMAÇÃO
        * =====================================================
        */

        const animate = (currentTime) => {

            const elapsed =
                currentTime - startTime;


            /*
            * =================================================
            * FASE 1 — CRESCIMENTO
            * =================================================
            */

            if (elapsed < growDuration) {

                let progress =
                    elapsed /
                    growDuration;


                /*
                * Curva mais suave.
                *
                * Evita que a tinta dispare
                * logo no começo.
                */

                progress =
                    progress *
                    progress *
                    (
                        3.0 -
                        2.0 *
                        progress
                    );


                this.material
                    .uniforms
                    .progress
                    .value =
                    progress;


                this.renderer.render(
                    this.scene,
                    this.camera
                );

            }


            /*
            * =================================================
            * FASE 2 — TELA PRETA
            * =================================================
            */

            else {

                /*
                * Garante que a tinta está
                * completamente cobrindo a tela.
                */

                this.material
                    .uniforms
                    .progress
                    .value =
                    1.0;


                /*
                * Assim que a tela estiver
                * completamente preta,
                * mostramos a galeria por baixo.
                */

                if (!galleryRevealed) {

                    galleryRevealed = true;

                    if (onComplete) {
                        onComplete();
                    }
                }


                /*
                * =================================================
                * FASE 3 — DESAPARECIMENTO
                * =================================================
                */

                const revealElapsed =
                    elapsed -
                    growDuration;


                let revealProgress =
                    revealElapsed /
                    revealDuration;


                revealProgress =
                    Math.min(
                        revealProgress,
                        1
                    );


                /*
                * Curva suave.
                */

                revealProgress =
                    revealProgress *
                    revealProgress *
                    (
                        3.0 -
                        2.0 *
                        revealProgress
                    );


                /*
                * 1 = completamente preta
                *
                * 0 = completamente transparente
                */

                this.material
                    .uniforms
                    .progress
                    .value =
                    1.0 -
                    revealProgress;


                this.renderer.render(
                    this.scene,
                    this.camera
                );
            }


            /*
            * =====================================================
            * FINAL
            * =====================================================
            */

            if (
                elapsed <
                duration
            ) {

                requestAnimationFrame(
                    animate
                );

                return;
            }


            /*
            * =====================================================
            * LIMPA TUDO
            * =====================================================
            */

            this.material
                .uniforms
                .progress
                .value = 0;


            this.renderer.render(
                this.scene,
                this.camera
            );


            this.canvas.style.display =
                'none';


            this.active =
                false;
        };


        requestAnimationFrame(
            animate
        );
    }
}
