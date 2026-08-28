import * as THREE from 'three';

import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';


export class Sculpture extends THREE.Group {

    constructor({

        model,

        position = {
            x: 0,
            y: 0,
            z: 0
        },

        scale = 1,

        lookAtX = 0,

        /*
         * Rotação adicional da escultura.
         *
         * Valor em graus.
         */
        rotationY = 0,

        /*
         * =====================================================
         * CONFIGURAÇÃO DA PLACA
         * =====================================================
         */

        signPosition = {
            x: 0,
            y: 0.4,
            z: 1.8
        },

        signWidth = 1.5,

        signHeight = 0.6,

        signText = '',

        signRotationX = 0,

        signRotationY = 0,

        signRotationZ = 0,

        signTextRotationY = 0,

        pedestalHeight = 1.2,

        pedestalWidth = 3.5,

        pedestalDepth = 3.5

    }) {

        super();


        this.modelPath =
            model;


        /*
         * =====================================================
         * CONFIGURAÇÃO
         * =====================================================
         */

        this.modelScale =
            scale;

        this.lookAtX =
            lookAtX;

        this.rotationY =
            rotationY;

        this.pedestalHeight =
            pedestalHeight;

        this.pedestalWidth =
            pedestalWidth;

        this.pedestalDepth =
            pedestalDepth;

        this.signText =
            signText;

        this.signTextRotationY =
            signTextRotationY;


        /*
         * =====================================================
         * CONFIGURAÇÃO DA PLACA
         * =====================================================
         */

        this.signPosition =
            signPosition;

        this.signWidth =
            signWidth;

        this.signHeight =
            signHeight;

        this.signRotationX =
            signRotationX;

        this.signRotationY =
            signRotationY;

        this.signRotationZ =
            signRotationZ;


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
         * PEDESTAL
         * =====================================================
         */

        this.createPedestal();


        /*
         * =====================================================
         * PLACA
         * =====================================================
         */

        this.createSign();


        /*
         * =====================================================
         * ILUMINAÇÃO
         * =====================================================
         */

        this.createStatueLight();


        /*
         * =====================================================
         * CARREGAMENTO DO MODELO
         * =====================================================
         */

        this.loadModel();

    }


    /*
     * =====================================================
     * PEDESTAL
     * =====================================================
     */

    createPedestal() {

        const geometry =
            new THREE.BoxGeometry(

                this.pedestalWidth,
                this.pedestalHeight,
                this.pedestalDepth

            );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x777777,

                roughness: 1,

                metalness: 0

            });


        this.pedestal =
            new THREE.Mesh(

                geometry,
                material

            );


        this.pedestal.position.y =
            this.pedestalHeight / 2;


        this.pedestal.castShadow =
            true;

        this.pedestal.receiveShadow =
            true;


        this.add(
            this.pedestal
        );

    }


    /*
     * =====================================================
     * PLACA DA ESCULTURA
     * =====================================================
     */

    createSign() {

        /*
        * =================================================
        * CONFIGURAÇÃO
        * =================================================
        */

        const borderThickness = 0.12;

        const borderDepth = 0.10;


        /*
        * =================================================
        * IDENTIFICA O LADO
        * =================================================
        */

        const isLeftSide =
            this.position.x < 0;


        /*
        * =================================================
        * GRUPO DE ORIENTAÇÃO
        * =================================================
        */

        this.signOrientation =
            new THREE.Group();


        this.signOrientation.position.set(

            this.signPosition.x,
            this.signPosition.y,
            this.signPosition.z

        );


        /*
        * =================================================
        * ROTAÇÃO LATERAL
        * =================================================
        */

        this.signOrientation.rotation.y =
            THREE.MathUtils.degToRad(
                this.signRotationY
            );


        /*
        * =================================================
        * GRUPO DE TOMBAMENTO
        * =================================================
        */

        this.signTilt =
            new THREE.Group();


        this.signTilt.rotation.x =
            THREE.MathUtils.degToRad(
                this.signRotationX
            );


        this.signOrientation.add(
            this.signTilt
        );


        /*
        * =================================================
        * BORDA PRETA
        * =================================================
        */

        const borderGeometry =
            new THREE.BoxGeometry(

                this.signWidth + borderThickness,
                this.signHeight + borderThickness,
                borderDepth

            );


        const borderMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x000000,

                roughness: 0.8,

                metalness: 0

            });


        this.signBorder =
            new THREE.Mesh(

                borderGeometry,
                borderMaterial

            );


        this.signBorder.castShadow =
            true;

        this.signBorder.receiveShadow =
            true;


        /*
        * =================================================
        * PLACA BRANCA
        * =================================================
        */

        const geometry =
            new THREE.BoxGeometry(

                this.signWidth,
                this.signHeight,
                0.08

            );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0xeeeeee,

                roughness: 0.8,

                metalness: 0

            });


        this.sign =
            new THREE.Mesh(

                geometry,
                material

            );


        /*
        * =================================================
        * POSIÇÃO DA PLACA BRANCA
        * =================================================
        *
        * Esquerda:
        *   +0.03
        *
        * Direita:
        *   -0.03
        */

        const whiteOffset =
            isLeftSide
                ? 0.03
                : -0.03;


        this.sign.position.set(

            0,
            0,
            whiteOffset

        );


        this.sign.castShadow =
            true;

        this.sign.receiveShadow =
            true;


        /*
        * =================================================
        * TEXTO
        * =================================================
        */

        this.createSignText(
            isLeftSide
        );


        /*
        * =================================================
        * ADICIONA BORDA E PLACA
        * =================================================
        */

        this.signTilt.add(
            this.signBorder
        );

        this.signTilt.add(
            this.sign
        );


        /*
        * =================================================
        * ADICIONA À ESCULTURA
        * =================================================
        */

        this.add(
            this.signOrientation
        );

    }

    createSignText(isLeftSide) {

        /*
        * =================================================
        * CANVAS
        * =================================================
        */

        const canvas =
            document.createElement('canvas');

        canvas.width = 1024;
        canvas.height = 512;


        const context =
            canvas.getContext('2d');


        /*
        * =================================================
        * TEXTO
        * =================================================
        */

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.textAlign =
            'center';

        context.textBaseline =
            'middle';


        /*
        * =================================================
        * TÍTULO
        * =================================================
        */

        context.fillStyle =
            '#FFFFFF';

        context.font =
            'bold 95px "IBM Plex Mono", monospace';

        context.fillText(

            this.signText.title,

            canvas.width / 2,

            190

        );


        /*
        * =================================================
        * SUBTÍTULO
        * =================================================
        */

        context.font =
            '70px "IBM Plex Mono", monospace';

        context.fillText(

            this.signText.subtitle,

            canvas.width / 2,

            300

        );


        /*
        * =================================================
        * TEXTURE
        * =================================================
        */

        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        texture.needsUpdate =
            true;


        /*
        * =================================================
        * MATERIAL
        * =================================================
        */

        const material =
            new THREE.MeshBasicMaterial({

                map: texture,

                transparent: true,

                side: THREE.DoubleSide,

                depthWrite: false

            });


        /*
        * =================================================
        * GEOMETRIA
        * =================================================
        */

        const geometry =
            new THREE.PlaneGeometry(

                this.signWidth * 0.85,

                this.signHeight * 0.70

            );


        this.signTextMesh =
            new THREE.Mesh(

                geometry,

                material

            );


        /*
        * =================================================
        * POSIÇÃO DO TEXTO NA PLACA
        * =================================================
        *
        * A placa branca já está deslocada:
        *
        * ESQUERDA:
        *     +0.03
        *
        * DIREITA:
        *     -0.03
        *
        * Como o texto é filho da placa branca,
        * precisamos apenas colocá-lo na face
        * correspondente da placa.
        */

        const textOffset =
            isLeftSide
                ? 0.045
                : -0.045;


        this.signTextMesh.position.set(

            0,
            0,
            textOffset

        );


        /*
        * =================================================
        * ROTAÇÃO
        * =================================================
        *
        * Não rotacionamos o texto individualmente.
        *
        * Ele acompanha a rotação da placa.
        */

        this.signTextMesh.rotation.set(
            0,
            THREE.MathUtils.degToRad(
                this.signTextRotationY
            ),
            THREE.MathUtils.degToRad(
                this.signTextRotationY
            ),
        );

        /*
        * =================================================
        * RENDER
        * =================================================
        */

        this.signTextMesh.renderOrder =
            10;


        /*
        * =================================================
        * ADICIONA À PLACA
        * =================================================
        */

        this.sign.add(
            this.signTextMesh
        );

    }

    /*
     * =====================================================
     * LUZ DA ESCULTURA
     * =====================================================
     */

    createStatueLight() {

        /*
        * =================================================
        * IDENTIFICA O LADO
        * =================================================
        */

        const isLeftSide =
            this.position.x < 0;


        /*
        * =================================================
        * POSIÇÃO X DA LUZ
        * =================================================
        */

        const lightX =
            isLeftSide

                ? this.pedestalWidth / 2 - 0.3

                : -this.pedestalWidth / 2 + 0.3;


        /*
        * =================================================
        * SPOTLIGHT
        * =================================================
        */

        this.statueLight =
            new THREE.SpotLight(

                0xffffff,

                10,

                15,

                THREE.MathUtils.degToRad(70),

                0.6,

                1

            );


        this.statueLight.position.set(

            lightX,

            this.pedestalHeight,

            this.pedestalDepth / 2 - 0.5

        );


        /*
        * =================================================
        * SOMBRAS
        * =================================================
        */

        this.statueLight.castShadow =
            true;


        this.statueLight.shadow.mapSize.width =
            1024;

        this.statueLight.shadow.mapSize.height =
            1024;


        this.statueLight.shadow.camera.near =
            0.1;

        this.statueLight.shadow.camera.far =
            15;


        /*
        * =================================================
        * ALVO
        * =================================================
        */

        this.statueLightTarget =
            new THREE.Object3D();


        this.statueLightTarget.position.set(

            0,

            this.pedestalHeight + 3,

            0

        );


        this.add(
            this.statueLightTarget
        );


        this.statueLight.target =
            this.statueLightTarget;


        /*
        * =================================================
        * ADICIONA A LUZ
        * =================================================
        */

        this.add(
            this.statueLight
        );

    }


    /*
     * =====================================================
     * MODELO
     * =====================================================
     */

    loadModel() {

        const loader =
            new GLTFLoader();


        loader.load(

            this.modelPath,


            (gltf) => {

                this.model =
                    gltf.scene;


                /*
                 * ==============================
                 * ESCALA
                 * ==============================
                 */

                this.model.scale.setScalar(
                    this.modelScale
                );


                /*
                 * ==============================
                 * SOMBRAS
                 * ==============================
                 */

                this.model.traverse(

                    (child) => {

                        if (child.isMesh) {

                            child.castShadow =
                                true;

                            child.receiveShadow =
                                true;


                            child.material =
                                new THREE.MeshStandardMaterial({

                                    color: 0x555555,

                                    roughness: 0.75,

                                    metalness: 0

                                });

                        }

                    }

                );


                /*
                 * ==============================
                 * POSIÇÃO SOBRE O PEDESTAL
                 * ==============================
                 */

                this.model.position.y =
                    this.pedestalHeight;


                /*
                 * ==============================
                 * ORIENTAÇÃO
                 * ==============================
                 */

                const target =
                    new THREE.Vector3(

                        this.lookAtX,

                        this.pedestalHeight,

                        0

                    );


                this.model.lookAt(
                    target
                );


                /*
                 * ==============================
                 * ROTAÇÃO ADICIONAL
                 * ==============================
                 */

                this.model.rotation.y +=
                    THREE.MathUtils.degToRad(
                        this.rotationY
                    );


                /*
                 * ==============================
                 * ADICIONA MODELO
                 * ==============================
                 */

                this.add(
                    this.model
                );


                /*
                 * ==============================
                 * AJUSTE AUTOMÁTICO
                 * ==============================
                 */

                this.fitModel();

            },


            undefined,


            (error) => {

                console.error(

                    'Erro ao carregar escultura:',

                    this.modelPath,

                    error

                );

            }

        );

    }


    /*
     * =====================================================
     * AJUSTA A ESCULTURA AO PEDESTAL
     * =====================================================
     */

    fitModel() {

        if (!this.model) {
            return;
        }


        const box =
            new THREE.Box3()
                .setFromObject(
                    this.model
                );


        const size =
            new THREE.Vector3();


        box.getSize(
            size
        );


        /*
         * Limite aproximado da escultura.
         */

        const maxHeight =
            7;


        if (
            size.y >
            maxHeight
        ) {

            const factor =
                maxHeight /
                size.y;


            this.model.scale.multiplyScalar(
                factor
            );

        }


        /*
         * Recalcula a caixa.
         */

        const adjustedBox =
            new THREE.Box3()
                .setFromObject(
                    this.model
                );


        /*
         * Faz o modelo encostar
         * no topo do pedestal.
         */

        const bottom =
            adjustedBox.min.y;


        this.model.position.y +=
            this.pedestalHeight -
            bottom;

    }

        /*
     * =====================================================
     * COLLIDER DA BASE DA ESCULTURA
     * =====================================================
     */

    getPedestalCollider(
        padding = 0.02
    ) {

        /*
         * Metade das dimensões do pedestal.
         */

        const halfWidth =
            this.pedestalWidth / 2;

        const halfDepth =
            this.pedestalDepth / 2;


        /*
         * A escultura não possui rotação
         * no eixo Y no Group principal.
         *
         * Portanto, o pedestal permanece
         * alinhado com os eixos X/Z.
         */

        return {

            minX:
                this.position.x -
                halfWidth -
                padding,

            maxX:
                this.position.x +
                halfWidth +
                padding,

            minZ:
                this.position.z -
                halfDepth -
                padding,

            maxZ:
                this.position.z +
                halfDepth +
                padding

        };

    }
}