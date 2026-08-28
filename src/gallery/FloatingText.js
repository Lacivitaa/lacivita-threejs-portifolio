import * as THREE from 'three';

import {
    FontLoader
} from 'three/addons/loaders/FontLoader.js';

import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry.js';


export class FloatingText extends THREE.Group {

    constructor({

        text = 'WELCOME TO MY HISTORY',

        position = {
            x: 0,
            y: 12,
            z: -27
        },

        /*
         * Tamanho real da letra branca.
         */
        size = 1.8,

        /*
         * Profundidade 3D das letras.
         */
        depth = 0.18,

        /*
         * Espessura do contorno preto.
         *
         * IMPORTANTE:
         * Isso NÃO aumenta o tamanho da letra branca.
         *
         * Ele aumenta a "nuvem" preta ao redor
         * da frase inteira.
         */
        outlineSize = 0.28,

        /*
         * Quantidade de cópias usadas para formar
         * a silhueta preta.
         *
         * Quanto maior, mais suave fica o contorno.
         */
        outlineSteps = 32

    }) {

        super();


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.text =
            text;

        this.textSize =
            size;

        this.textDepth =
            depth;

        this.outlineSize =
            outlineSize;

        this.outlineSteps =
            outlineSteps;


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
         * CARREGA A FONTE
         * =====================================================
         */

        this.loadFont();

    }


    /*
     * =====================================================
     * CARREGAMENTO DA FONTE
     * =====================================================
     */

    loadFont() {

        const loader =
            new FontLoader();


        loader.load(

            '/assets/fonts/Cinzel.json',

            (font) => {

                this.createText(
                    font
                );

            },

            undefined,

            (error) => {

                console.error(

                    'Erro ao carregar MedievalSharp:',

                    error

                );

            }

        );

    }


    /*
     * =====================================================
     * CRIA TEXTO
     * =====================================================
     */

    createText(font) {

        /*
         * =================================================
         * GEOMETRIA DO TEXTO
         * =================================================
         *
         * Criamos UMA geometria.
         *
         * Ela será utilizada tanto pelo contorno
         * quanto pelo texto branco.
         *
         * Isso garante que os dois tenham exatamente
         * o mesmo tamanho e o mesmo alinhamento.
         */

        const geometry =
            new TextGeometry(

                this.text,

                {

                    font,

                    size:
                        this.textSize,

                    depth:
                        this.textDepth,

                    curveSegments: 8,

                    bevelEnabled: true,

                    bevelThickness: 0.025,

                    bevelSize: 0.02,

                    bevelSegments: 3

                }

            );


        /*
         * =================================================
         * CENTRALIZAÇÃO
         * =================================================
         */

        geometry.computeBoundingBox();


        const box =
            geometry.boundingBox;


        const centerX =
            (
                box.min.x +
                box.max.x
            ) / 2;


        const centerY =
            (
                box.min.y +
                box.max.y
            ) / 2;


        geometry.translate(

            -centerX,

            -centerY,

            0

        );


        /*
         * =================================================
         * MATERIAL PRETO
         * =================================================
         */

        const outlineMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x000000,

                roughness: 0.8,

                metalness: 0

            });


        /*
         * =================================================
         * SILHUETA / CONTORNO
         * =================================================
         *
         * Criamos várias cópias do texto ao redor
         * da posição original.
         *
         * Quando essas cópias ficam próximas umas
         * das outras, elas formam uma área preta
         * contínua.
         *
         * É isso que cria o efeito de "balão"
         * ao redor da palavra.
         */

        /*
         * Centro preto atrás da letra.
         *
         * Essa cópia garante que toda a região
         * imediatamente atrás do texto seja preta.
         */

        const centerOutline =
            new THREE.Mesh(

                geometry,
                outlineMaterial

            );


        centerOutline.position.z =
            -0.025;


        centerOutline.castShadow =
            true;

        centerOutline.receiveShadow =
            true;


        this.add(
            centerOutline
        );


        /*
         * =================================================
         * CÓPIAS AO REDOR
         * =================================================
         *
         * Distribuímos as cópias em círculos.
         *
         * Isso deixa o contorno muito mais suave
         * do que usar apenas 8 direções.
         */

        const rings = [

            /*
             * Primeiro anel.
             */
            {
                radius:
                    this.outlineSize * 0.35,

                steps:
                    this.outlineSteps
            },

            /*
             * Segundo anel.
             */
            {
                radius:
                    this.outlineSize * 0.70,

                steps:
                    this.outlineSteps
            },

            /*
             * Terceiro anel.
             */
            {
                radius:
                    this.outlineSize,

                steps:
                    this.outlineSteps
            }

        ];


        for (
            const ring of rings
        ) {

            for (
                let i = 0;
                i < ring.steps;
                i++
            ) {

                const angle =
                    (
                        i /
                        ring.steps
                    ) *
                    Math.PI *
                    2;


                const x =
                    Math.cos(angle) *
                    ring.radius;


                const y =
                    Math.sin(angle) *
                    ring.radius;


                const outline =
                    new THREE.Mesh(

                        geometry,
                        outlineMaterial

                    );


                outline.position.set(

                    x,

                    y,

                    -0.025

                );


                outline.castShadow =
                    true;

                outline.receiveShadow =
                    true;


                this.add(
                    outline
                );

            }

        }


        /*
         * =================================================
         * TEXTO BRANCO
         * =================================================
         *
         * Agora colocamos a letra original exatamente
         * no centro.
         *
         * O tamanho NÃO foi alterado.
         */

        const textMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                roughness: 0.7,

                metalness: 0

            });


        const textMesh =
            new THREE.Mesh(

                geometry,
                textMaterial

            );


        /*
         * O branco fica um pouco à frente
         * da silhueta preta.
         */

        textMesh.position.set(

            0,

            0,

            0.01

        );


        textMesh.castShadow =
            true;

        textMesh.receiveShadow =
            true;


        /*
         * =================================================
         * ADICIONA O TEXTO BRANCO
         * =================================================
         */

        this.add(
            textMesh
        );

    }

}