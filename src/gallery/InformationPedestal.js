import * as THREE from 'three';

export class InformationPedestal extends THREE.Group {

    constructor({
        title,
        subtitle = '',
        description = ''
    }) {

        super();

        this.userData.type =
            'pedestal';

        this.userData.title =
            title;

        this.userData.subtitle =
            subtitle;

        this.userData.description =
            description;


        this.createBase();

        this.createPost();

        this.createPlate();
    }


    createBase() {

        /*
         * BASE
         *
         * Bem menor que a anterior.
         */

        const geometry =
            new THREE.CylinderGeometry(
                0.48,
                0.55,
                0.15,
                32
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.7,
                metalness: 0.1
            });

        const base =
            new THREE.Mesh(
                geometry,
                material
            );

        base.position.y =
            0.075;

        base.castShadow = true;

        base.receiveShadow = true;

        this.add(base);
    }

    createPost() {

        const postHeight = 1.15;

        const radiusBottom = 0.14;
        const radiusTop = 0.11;

        const segments = 16;

        /*
        * O topo do poste acompanha a inclinação
        * da placa.
        *
        * A placa está inclinada -40° no eixo X.
        */
        const angle = THREE.MathUtils.degToRad(-40);

        /*
        * Criamos um cilindro normalmente.
        */
        const geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            postHeight,
            segments
        );

        /*
        * Material do poste.
        */
        const material =
            new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.7,
                metalness: 0.1
            });

        const post =
            new THREE.Mesh(
                geometry,
                material
            );

        /*
        * Posicionamento vertical.
        */
        post.position.y =
            0.15 +
            postHeight / 2;

        post.castShadow = true;
        post.receiveShadow = true;

        this.add(post);

        /*
        * ==============================
        * ENCAIXE SUPERIOR
        * ==============================
        *
        * Pequena peça no topo do poste
        * acompanhando exatamente a inclinação
        * da placa.
        */

        const topConnector =
            new THREE.CylinderGeometry(
                radiusTop,
                radiusTop,
                0.16,
                segments
            );

        const connector =
            new THREE.Mesh(
                topConnector,
                material
            );

        /*
        * O conector fica no topo do poste.
        */
        connector.position.y =
            0.12 +
            postHeight +
            0.02;

        /*
        * Inclinação igual à placa.
        */
        connector.rotation.z = 0;

        connector.rotation.x =
            angle;

        connector.castShadow = true;
        connector.receiveShadow = true;

        this.add(connector);
    }

    createPlate() {

        const width = 1.8;

        const height = 0.9;

        const thickness = 0.10;


        /*
         * GRUPO DA PLACA
         *
         * Colocamos a placa e o texto
         * dentro do mesmo Group para que
         * ambos tenham exatamente a mesma
         * inclinação.
         */

        const plateGroup =
            new THREE.Group();


        /*
         * Posicionamento no topo do poste.
         */

        plateGroup.position.y =
            0.15 +
            1.25;


        /*
         * Inclinação para trás.
         *
         * 40 graus.
         */

        plateGroup.rotation.x =
            THREE.MathUtils.degToRad(
                -40
            );


        this.add(
            plateGroup
        );


        /*
         * PLACA FÍSICA
         */

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                thickness
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.6,
                metalness: 0.1
            });

        const plate =
            new THREE.Mesh(
                geometry,
                material
            );

        plate.castShadow = true;

        plate.receiveShadow = true;

        plateGroup.add(
            plate
        );


        /*
         * TEXTO
         */

        const texture =
            this.createLabelTexture();

        const textMaterial =
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false
            });

        const text =
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    width * 0.82,
                    height * 0.72
                ),
                textMaterial
            );


        /*
         * O texto fica um pouco à frente
         * da superfície da placa.
         */

        text.position.z = (thickness / 2) + 0.002;


        /*
         * Como o texto é filho do plateGroup,
         * ele herda automaticamente os 40°.
         */

        plateGroup.add(
            text
        );
    }

    createLabelTexture() {

        const canvas =
            document.createElement('canvas');

        canvas.width = 1024;
        canvas.height = 512;

        const context =
            canvas.getContext('2d');

        /*
        * ==============================
        * FUNDO
        * ==============================
        */

        context.fillStyle =
            '#333333';

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        /*
        * ==============================
        * TEXTO
        * ==============================
        *
        * IBM Plex Mono
        */

        context.fillStyle =
            '#FFFFFF';

        context.font =
            '700 90px "IBM Plex Mono", monospace';

        context.textAlign =
            'center';

        context.textBaseline =
            'middle';

        context.fillText(
            this.userData.title,
            canvas.width / 2,
            canvas.height / 2
        );

        /*
        * ==============================
        * TEXTURE
        * ==============================
        */

        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        texture.colorSpace =
            THREE.SRGBColorSpace;

        texture.needsUpdate = true;

        return texture;
    }

        /*
     * =====================================================
     * COLLIDER
     * =====================================================
     *
     * Retorna uma caixa de colisão em X/Z
     * baseada no tamanho da placa.
     *
     * padding permite aumentar ou diminuir
     * a área de segurança ao redor.
     */

    getCollider(

        padding = 0.02

    ) {

        const width =
            1.8;

        const depth =
            0.10;


        /*
         * =================================================
         * RETORNA O RETÂNGULO DE COLISÃO
         * =================================================
         */

        return {

            minX:
                this.position.x -
                width / 2 -
                padding,

            maxX:
                this.position.x +
                width / 2 +
                padding,

            minZ:
                this.position.z -
                depth / 2 -
                padding,

            maxZ:
                this.position.z +
                depth / 2 +
                padding

        };

    }
}