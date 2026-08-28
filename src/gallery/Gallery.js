import * as THREE from 'three';

import {
    Painting
} from './Painting.js';

import {
    InformationPedestal
} from './InformationPedestal.js';

import {
    PaintingLight
} from './PaintingLight.js';

import {
    Sculpture
} from './Sculpture.js';

import {
    Bench
} from './Bench.js';

import {
    FloatingText
} from './FloatingText.js';

import {
    SecretButton
} from './SecretButton.js';


export class Gallery {

    constructor(scene, player) {

        this.scene = scene;

        this.player = player;

        this.paintings = [];

        this.pedestals = [];


        /*
         * GALERIA MONUMENTAL
         */

        this.width = 100;

        this.depth = 100;

        this.height = 20;


        this.createFloor();

        this.createFloorGuide();

        this.createWalls();

        this.createCeiling();

        this.createPaintings();

        this.createSculptures();

        this.createBenches();

        this.createFloatingText();
        
        this.createSecretButton();
    }


    createFloor() {

        const geometry =
            new THREE.PlaneGeometry(
                this.width,
                this.depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF
            });

        const floor =
            new THREE.Mesh(
                geometry,
                material
            );

        floor.rotation.x =
            -Math.PI / 2;

        floor.position.y =
            0;

        floor.receiveShadow = true;

        this.scene.add(
            floor
        );
    }

    createFloorGuide() {

            /*
            * =====================================================
            * CONFIGURAÇÃO
            * =====================================================
            */

            const stoneMaterial =
                new THREE.MeshStandardMaterial({

                    color: 0x222222,

                    roughness: 0.2,

                    metalness: 0,

                    side: THREE.DoubleSide

                });


            /*
            * =====================================================
            * FUNÇÃO PARA CRIAR UMA PEDRA
            * =====================================================
            */

            const createStone = (
                x,
                z,
                radius
            ) => {

                const geometry =
                    new THREE.CircleGeometry(
                        radius,
                        12
                    );

                const stone =
                    new THREE.Mesh(
                        geometry,
                        stoneMaterial
                    );

                stone.rotation.x =
                    -Math.PI / 2;

                stone.position.set(
                    x,
                    0.026,
                    z
                );

                stone.receiveShadow = true;

                this.scene.add(
                    stone
                );

                return stone;
            };


            /*
            * =====================================================
            * GERADOR DE PEDRAS
            * =====================================================
            *
            * Cria pedras aleatórias dentro de um retângulo.
            *
            * As pedras nunca saem dos limites definidos.
            */

            const fillRectangleWithStones = ({
                minX,
                maxX,
                minZ,
                maxZ,
                amount,
                minRadius,
                maxRadius
            }) => {

                for (
                    let i = 0;
                    i < amount;
                    i++
                ) {

                    const radius =
                        THREE.MathUtils.randFloat(
                            minRadius,
                            maxRadius
                        );


                    /*
                    * Mantém a pedra completamente
                    * dentro do retângulo.
                    */

                    const x =
                        THREE.MathUtils.randFloat(
                            minX + radius,
                            maxX - radius
                        );

                    const z =
                        THREE.MathUtils.randFloat(
                            minZ + radius,
                            maxZ - radius
                        );


                    createStone(
                        x,
                        z,
                        radius
                    );
                }
            };


            /*
            * =====================================================
            * CÍRCULO INICIAL
            * =====================================================
            *
            * Área:
            *
            * centro = (0, 5)
            * raio = 3
            */

            const circleRadius = 3;

            const circleCenterX = 0;

            const circleCenterZ = 5;


            /*
            * Quantidade de pedras.
            */

            const circleStoneCount = 65;


            for (
                let i = 0;
                i < circleStoneCount;
                i++
            ) {

                const radius =
                    THREE.MathUtils.randFloat(
                        0.08,
                        0.28
                    );


                /*
                * Distribuição aleatória dentro
                * do círculo.
                */

                const angle =
                    Math.random() *
                    Math.PI *
                    2;


                const distance =
                    Math.sqrt(
                        Math.random()
                    ) *
                    (
                        circleRadius -
                        radius
                    );


                const x =
                    circleCenterX +
                    Math.cos(angle) *
                    distance;


                const z =
                    circleCenterZ +
                    Math.sin(angle) *
                    distance;


                createStone(
                    x,
                    z,
                    radius
                );
            }


            /*
            * =====================================================
            * CORREDOR CENTRAL
            * =====================================================
            *
            * Mesmo espaço que você já tinha:
            *
            * width  = 3.5
            * length = 45
            * center = -15.5
            */


            const corridorWidth = 3.5;

            const corridorLength = 45;

            const corridorCenterZ = -15.5;


            fillRectangleWithStones({

                minX:
                    -corridorWidth / 2,

                maxX:
                    corridorWidth / 2,

                minZ:
                    corridorCenterZ -
                    corridorLength / 2,

                maxZ:
                    corridorCenterZ +
                    corridorLength / 2,

                amount: 700,

                minRadius: 0.08,

                maxRadius: 0.25

            });


            /*
            * =====================================================
            * BARRA HORIZONTAL DO T
            * =====================================================
            *
            * Mesmo espaço que você já tinha:
            *
            * width = 72
            * depth = 3.5
            * center Z = -38
            */


            const tWidth = 72;

            const tDepth = 3.5;

            const tCenterZ = -38;


            fillRectangleWithStones({

                minX:
                    -tWidth / 2,

                maxX:
                    tWidth / 2,

                minZ:
                    tCenterZ -
                    tDepth / 2,

                maxZ:
                    tCenterZ +
                    tDepth / 2,

                amount: 890,

                minRadius: 0.08,

                maxRadius: 0.28

            });

            /*
            * =====================================================
            * CAMINHOS DAS ESCULTURAS
            * =====================================================
            *
            * Cria dois caminhos horizontais conectando
            * as esculturas da esquerda às esculturas da direita.
            *
            * FRENTE:
            *     esquerda (-10, -12)
            *              ↓
            *     direita  (10, -12)
            *
            * TRÁS:
            *     esquerda (-10, -27)
            *              ↓
            *     direita  (10, -27)
            */


            /*
            * =====================================================
            * CAMINHO DAS ESCULTURAS DA FRENTE
            * =====================================================
            */

            const sculpturePathWidth =
                20;

            const sculpturePathDepth =
                3.5;

            const frontSculpturePathZ =
                -12;


            fillRectangleWithStones({

                minX:
                    -sculpturePathWidth / 2,

                maxX:
                    sculpturePathWidth / 2,

                minZ:
                    frontSculpturePathZ -
                    sculpturePathDepth / 2,

                maxZ:
                    frontSculpturePathZ +
                    sculpturePathDepth / 2,

                amount:
                    350,

                minRadius:
                    0.08,

                maxRadius:
                    0.28

            });


            /*
            * =====================================================
            * CAMINHO DAS ESCULTURAS DE TRÁS
            * =====================================================
            */

            const backSculpturePathZ =
                -27;


            fillRectangleWithStones({

                minX:
                    -sculpturePathWidth / 2,

                maxX:
                    sculpturePathWidth / 2,

                minZ:
                    backSculpturePathZ -
                    sculpturePathDepth / 2,

                maxZ:
                    backSculpturePathZ +
                    sculpturePathDepth / 2,

                amount:
                    350,

                minRadius:
                    0.08,

                maxRadius:
                    0.28

            });
        }

    createWalls() {

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF
            });


        /*
         * ESQUERDA
         */

        const left =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.4,
                    this.height,
                    this.depth
                ),
                material
            );

        left.position.set(
            -this.width / 2,
            this.height / 2,
            0
        );

        left.receiveShadow = true;

        this.scene.add(
            left
        );


        /*
         * DIREITA
         */

        const right =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.4,
                    this.height,
                    this.depth
                ),
                material
            );

        right.position.set(
            this.width / 2,
            this.height / 2,
            0
        );

        right.receiveShadow = true;

        this.scene.add(
            right
        );


        /*
         * PAREDE TRASEIRA
         */

        const back =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    this.width,
                    this.height,
                    0.4
                ),
                material
            );

        back.position.set(
            0,
            this.height / 2,
            -this.depth / 2
        );

        back.receiveShadow = true;

        this.scene.add(
            back
        );


        /*
         * PAREDE FRONTAL
         */

        const front =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    this.width,
                    this.height,
                    0.4
                ),
                material
            );

        front.position.set(
            0,
            this.height / 2,
            this.depth / 2
        );

        front.receiveShadow = true;

        this.scene.add(
            front
        );
    }


    createCeiling() {

        const geometry =
            new THREE.PlaneGeometry(
                this.width,
                this.depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF
            });

        const ceiling =
            new THREE.Mesh(
                geometry,
                material
            );

        ceiling.rotation.x =
            Math.PI / 2;

        ceiling.position.y =
            this.height;

        ceiling.receiveShadow = true;

        this.scene.add(
            ceiling
        );
    }


    createPaintings() {

        const width = 10;

        const height = 6;

        const y = 7;

        const wallZ =
            -this.depth / 2 + 0.35;


        /*
         * POSIÇÕES
         */

        const positions = [
            -30,
            -10,
            10,
            30
        ];


        /*
         * SOBRE MIM
         */

        this.createGalleryItem({

            title: 'ABOUT ME',

            subtitle: 'Quem sou eu',

            description: `
                <p>
                    I'm <strong>Igor Lacivita</strong>, a software developer
                    based in São Paulo, Brazil.
                </p>

                <p>
                    I'm a full-stack developer focused on Adobe Experience Manager, Java, 
                    and modern web technologies. With over 5+ years of programming experience.
                </p>

                <p>
                    This portfolio is my attempt to take that further: 
                    turning a portfolio into an engaging experience 
                    rather than just another set of pages.
                </p>


                <div class="profile-grid">

                    <div class="profile-item">

                        <span class="profile-label">
                            NAME
                        </span>

                        <span class="profile-value">
                            Igor Lacivita
                        </span>

                    </div>


                    <div class="profile-item">

                        <span class="profile-label">
                            LOCATION
                        </span>

                        <span class="profile-value">
                            São Paulo, Brazil
                        </span>

                    </div>


                    <div class="profile-item">

                        <span class="profile-label">
                            ROLE
                        </span>

                        <span class="profile-value">
                            AEM / Full-Stack Developer
                        </span>

                    </div>


                    <div class="profile-item">

                        <span class="profile-label">
                            EXPERIENCE
                        </span>

                        <span class="profile-value">
                            6+ YEARS
                        </span>

                    </div>

                </div>
            `,

            position: positions[0],

            width,

            height,

            color: 0xFF0000
        });


        /*
         * EXPERIÊNCIAS
         */
        this.createGalleryItem({

            title: 'EXPERIENCES',

            subtitle: 'Professional Record',

            description: `

                <div class="experience-list">

                    <!-- IBM - CURRENT -->
                    <article class="experience-item">

                        <div class="experience-header">

                            <div>

                                <div class="experience-company">
                                    IBM
                                </div>

                                <h2 class="experience-role">
                                    Application Developer Mid-level
                                </h2>

                                <div class="experience-specialty">
                                    FullStack Developer — Java & React / Adobe AEM
                                </div>

                            </div>

                            <div class="experience-period">
                                FEB 2024 — PRESENT
                            </div>

                        </div>

                        <div class="experience-meta">
                            FULL TIME · SÃO PAULO, BRAZIL · REMOTE
                        </div>

                        <p>
                            Experience in the development and maintenance of
                            web applications using Adobe Experience Manager
                            (AEM) in international projects.
                        </p>

                        <p>
                            Responsible for creating customized components
                            with Java and HTL (Sightly), integrating backend
                            services through REST APIs, configuring workflows
                            and supporting content management.
                        </p>

                        <p>
                            Active participation in agile teams, collaborating
                            with multidisciplinary squads across different
                            countries to deliver scalable solutions aligned
                            with business needs.
                        </p>

                    </article>


                    <!-- IBM - JUNIOR -->
                    <article class="experience-item">

                        <div class="experience-header">

                            <div>

                                <div class="experience-company">
                                    IBM
                                </div>

                                <h2 class="experience-role">
                                    Application Developer Junior
                                </h2>

                                <div class="experience-specialty">
                                    FullStack Developer — Java & Angular
                                </div>

                            </div>

                            <div class="experience-period">
                                DEC 2022 — JAN 2024
                            </div>

                        </div>

                        <div class="experience-meta">
                            FULL TIME · SÃO PAULO, BRAZIL · REMOTE
                        </div>

                        <p>
                            Worked as a FullStack Developer directly for a
                            banking client, developing and maintaining
                            applications using Java, Angular and TypeScript.
                        </p>

                        <p>
                            Responsible for creating new features and
                            functionalities according to client requirements
                            and business strategies, working across both
                            backend and frontend layers.
                        </p>

                        <p>
                            Focused on reliability, security and performance,
                            ensuring a consistent experience across the
                            application's different layers.
                        </p>

                    </article>


                    <!-- IBM - JAVA -->
                    <article class="experience-item">

                        <div class="experience-header">

                            <div>

                                <div class="experience-company">
                                    IBM
                                </div>

                                <h2 class="experience-role">
                                    Application Developer Junior
                                </h2>

                                <div class="experience-specialty">
                                    Java Developer
                                </div>

                            </div>

                            <div class="experience-period">
                                APR 2021 — NOV 2022
                            </div>

                        </div>

                        <div class="experience-meta">
                            FULL TIME · SÃO PAULO, BRAZIL
                        </div>

                        <p>
                            Worked as a Java Developer directly for a banking
                            client, focusing on the development and maintenance
                            of mobile applications.
                        </p>

                        <p>
                            Worked primarily in the support area, analyzing
                            and resolving issues affecting the digital banking
                            application's reliability, security and performance.
                        </p>

                        <p>
                            Participated in an initiative that helped reverse
                            a significant task overload situation within the
                            banking team, contributing to improved workflow
                            and team collaboration.
                        </p>

                    </article>


                    <!-- IBM - INTERN -->
                    <article class="experience-item">

                        <div class="experience-header">

                            <div>

                                <div class="experience-company">
                                    IBM
                                </div>

                                <h2 class="experience-role">
                                    GBS Associate Intern
                                </h2>

                            </div>

                            <div class="experience-period">
                                DEC 2020 — MAR 2021
                            </div>

                        </div>

                        <div class="experience-meta">
                            INTERNSHIP · SÃO PAULO, BRAZIL
                        </div>

                        <p>
                            Internship program focused on learning IBM
                            technologies, development practices and
                            corporate guidelines.
                        </p>

                        <p>
                            Completed more than 200 hours of courses and
                            certifications as part of the program.
                        </p>

                    </article>


                    <!-- NXT -->
                    <article class="experience-item">

                        <div class="experience-header">

                            <div>

                                <div class="experience-company">
                                    NXT IT SOLUTIONS
                                </div>

                                <h2 class="experience-role">
                                    IT Support Intern
                                </h2>

                            </div>

                            <div class="experience-period">
                                OCT 2020 — NOV 2020
                            </div>

                        </div>

                        <div class="experience-meta">
                            INTERNSHIP · SÃO PAULO, BRAZIL
                        </div>

                        <p>
                            Internship focused on form creation and file
                            management within a proprietary platform
                            serving the medical sector.
                        </p>

                    </article>

                </div>
            `,

            position: positions[1],

            width,

            height,

            color: 0xFF0000
        });


        /*
        * =====================================================
        * SKILLS
        * =====================================================
        */

        this.createGalleryItem({

            title: 'SKILLS',

            subtitle: 'Technical Skills',

            description: `

                <div class="skills-grid">

                    <!-- AEM -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/aem.png"
                                alt="Adobe Experience Manager"
                            />
                        </div>

                        <div class="skill-name">
                            Adobe Experience Manager
                        </div>

                        <div class="skill-experience">
                            2+ YEARS
                        </div>

                    </div>


                    <!-- JAVA -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/java.png"
                                alt="Java"
                            />
                        </div>

                        <div class="skill-name">
                            Java
                        </div>

                        <div class="skill-experience">
                            5+ YEARS
                        </div>

                    </div>


                    <!-- REACT -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/react.png"
                                alt="React"
                            />
                        </div>

                        <div class="skill-name">
                            React
                        </div>

                        <div class="skill-experience">
                            2+ YEARS
                        </div>

                    </div>


                    <!-- ANGULAR -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/angular.png"
                                alt="Angular"
                            />
                        </div>

                        <div class="skill-name">
                            Angular
                        </div>

                        <div class="skill-experience">
                            1+ YEAR
                        </div>

                    </div>


                    <!-- JAVASCRIPT -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/javascript.png"
                                alt="JavaScript"
                            />
                        </div>

                        <div class="skill-name">
                            JavaScript
                        </div>

                        <div class="skill-experience">
                            5+ YEARS
                        </div>

                    </div>


                    <!-- TYPESCRIPT -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/typescript.png"
                                alt="TypeScript"
                            />
                        </div>

                        <div class="skill-name">
                            TypeScript
                        </div>

                        <div class="skill-experience">
                            3+ YEARS
                        </div>

                    </div>


                    <!-- NODE.JS -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/nodejs.png"
                                alt="Node.js"
                            />
                        </div>

                        <div class="skill-name">
                            Node.js
                        </div>

                        <div class="skill-experience">
                            2+ YEARS
                        </div>

                    </div>


                    <!-- GIT -->
                    <div class="skill-item">

                        <div class="skill-icon">
                            <img
                                src="/assets/skills/git.png"
                                alt="Git"
                            />
                        </div>

                        <div class="skill-name">
                            Git
                        </div>

                        <div class="skill-experience">
                            5+ YEARS
                        </div>

                    </div>

                </div>
            `,

            position: positions[2],

            width,

            height,

            color: 0xFF0000
        });


        /*
        * =====================================================
        * CONTACT
        * =====================================================
        */

        this.createGalleryItem({

            title: 'CONTACT',

            subtitle: 'Get in Touch',

            description: `

                <div class="contact-grid">

                    <!-- LINKEDIN -->
                    <a
                        class="contact-item"
                        href="https://www.linkedin.com/in/igorlacivitag/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <div class="contact-icon">

                            <img
                                src="/assets/contact/linkedin.svg"
                                alt="LinkedIn"
                            />

                        </div>

                        <div class="contact-name">
                            LinkedIn
                        </div>

                        <div class="contact-description">
                            PROFESSIONAL NETWORK
                        </div>

                    </a>


                    <!-- GITHUB -->
                    <a
                        class="contact-item"
                        href="https://github.com/Lacivitaa"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <div class="contact-icon">

                            <img
                                src="/assets/contact/github.svg"
                                alt="GitHub"
                            />

                        </div>

                        <div class="contact-name">
                            GitHub
                        </div>

                        <div class="contact-description">
                            CODE & PROJECTS
                        </div>

                    </a>


                    <!-- EMAIL -->
                    <a
                        class="contact-item"
                        href="mailto:igor.lacivita@hotmail.com"
                    >

                        <div class="contact-icon">

                            <img
                                src="/assets/contact/email.svg"
                                alt="Email"
                            />

                        </div>

                        <div class="contact-name">
                            Email
                        </div>

                        <div class="contact-description">
                            SEND A MESSAGE
                        </div>

                    </a>

                </div>
            `,

            position: positions[3],

            width,

            height,

            color: 0xFF0000
        });
    }


    createGalleryItem({

        title,

        subtitle,

        description,

        position,

        width,

        height,

        color

    }) {


        /*
         * ============================
         * QUADRO
         * ============================
         */

        const painting =
            new Painting({

                title,

                description,

                color,

                width,

                height

            });


        painting.position.set(

            position,

            7,

            -49.65

        );


        /*
         * O quadro está virado para
         * dentro da galeria.
         */

        painting.rotation.y =
            0;


        this.scene.add(
            painting
        );


        this.paintings.push(
            painting
        );


        /*
         * ============================
         * LUZ DO QUADRO
         * ============================
         *
         * A luminária é filha do quadro.
         */

        const paintingLight =
            new PaintingLight();


        /*
         * Topo da moldura.
         */

        paintingLight.position.set(

            0,

            height / 2 + 0.15,

            0.35

        );


        painting.add(
            paintingLight
        );


        /*
         * ============================
         * PEDESTAL
         * ============================
         */

        const pedestal =
            new InformationPedestal({

                title,

                subtitle,

                description

            });


        /*
         * O pedestal fica à frente
         * do quadro.
         */

        pedestal.position.set(

            position,

            0,

            -42

        );


        this.scene.add(
            pedestal
        );

        const collider =
            pedestal.getCollider(
                0.02
            );

        this.player.addCollider(
            collider
        );


        this.pedestals.push(
            pedestal
        );
    }

    createSculptures() {

        /*
        * =====================================================
        * ESCULTURAS
        * =====================================================
        *
        * As esculturas ficam nos corredores laterais.
        *
        * X negativo = lado esquerdo
        * X positivo = lado direito
        *
        * Todas ficam fora do caminho central.
        */


        const sculptures = [

            /*
            * ================================================
            * ESQUERDA - DISCÓBOLO
            * ================================================
            */

            {
                model:
                    `${import.meta.env.BASE_URL}/assets/sculptures/discobolus.glb`,

                position: {
                    x: -10,
                    y: 0,
                    z: -12
                },

                scale: 6,

                lookAtX: 0,

                rotationY: 45,

                signPosition: {
                    x: 1.8,
                    y: 0.3,
                    z: 0
                },

                signRotationY: 90,

                signRotationX: -25,

                signText: {
                    title: 'DISCOBOLUS',
                    subtitle: 'c. 460–450 BCE'
                },
            },


            /*
            * ================================================
            * ESQUERDA - APOLO
            * ================================================
            */

            {
                model:
                    `${import.meta.env.BASE_URL}/assets/sculptures/apollo.glb`,

                position: {
                    x: -10,
                    y: 0,
                    z: -27
                },

                scale: 6,

                lookAtX: 0,

                rotationY: 90,

                signPosition: {
                    x: 1.8,
                    y: 0.3,
                    z: 0
                },

                signRotationY: 90,

                signRotationX: -25,

                signText: {
                    title: 'APOLLO BELVEDERE',
                    subtitle: 'c. 120–140 CE'
                },
            },


            /*
            * ================================================
            * DIREITA - VENUS
            * ================================================
            */

            {
                model:
                    `${import.meta.env.BASE_URL}/assets/sculptures/venus.glb`,

                position: {
                    x: 10,
                    y: 0,
                    z: -12
                },

                scale: 6,

                lookAtX: 0,

                rotationY: -65,

                signPosition: {
                    x: -1.8,
                    y: 0.3,
                    z: 0
                },

                signRotationY: -90,

                signRotationX: 155, 

                signTextRotationY: 180,

                signText: {
                    title: 'VENUS DE MILO',
                    subtitle: 'c. 150–125 BCE'
                }
            },

            /*
            * ================================================
            * DIREITA - ZEUS / POSEIDON
            * ================================================
            */

            {
                model:
                    `${import.meta.env.BASE_URL}/assets/sculptures/zeus.glb`,

                position: {
                    x: 10,
                    y: 0,
                    z: -27
                },

                scale: 6,

                lookAtX: 0,

                rotationY: -45,

                signPosition: {
                    x: -1.8,
                    y: 0.3,
                    z: 0
                },

                signTextRotationY: 180,

                signRotationY: -90,

                signRotationX: 155,

                signText: {
                    title: 'DORYPHOROS',
                    subtitle: 'c. 440 BCE'
                },
            }

        ];


        /*
        * =====================================================
        * CRIA AS ESCULTURAS
        * =====================================================
        */

                for (
            const config of sculptures
        ) {

            const sculpture =
                new Sculpture(
                    config
                );


            this.scene.add(
                sculpture
            );


            /*
             * =================================================
             * COLLIDER DA BASE
             * =================================================
             */

            const pedestalCollider =
                sculpture.getPedestalCollider(
                    0.02
                );


            this.player.addCollider(
                pedestalCollider
            );
        }

    }

    createBenches() {

        /*
        * =====================================================
        * BANCOS DA GALERIA
        * =====================================================
        */

        const benches = [

            /*
            * =================================================
            * BANCOS DAS PINTURAS
            * =================================================
            */

            {
                position: {
                    x: -30,
                    y: 0,
                    z: -35
                },

                rotationY: 0
            },


            {
                position: {
                    x: -10,
                    y: 0,
                    z: -35
                },

                rotationY: 0
            },


            {
                position: {
                    x: 10,
                    y: 0,
                    z: -35
                },

                rotationY: 0
            },


            {
                position: {
                    x: 30,
                    y: 0,
                    z: -35
                },

                rotationY: 0
            },


            /*
            * =================================================
            * BANCO ENTRE DISCÓBOLOS E APOLO
            * =================================================
            */

            {
                position: {
                    x: -3,
                    y: 0,
                    z: -19.5
                },

                rotationY: 90
            },


            /*
            * =================================================
            * BANCO ENTRE VÊNUS E ZEUS
            * =================================================
            */

            {
                position: {
                    x: 3,
                    y: 0,
                    z: -19.5
                },

                rotationY: -90
            }

        ];


        /*
        * =====================================================
        * CRIA OS BANCOS
        * =====================================================
        */

        for (
            const config of benches
        ) {

            const bench =
                new Bench({

                    position:
                        config.position,

                    rotationY:
                        config.rotationY,

                    width:
                        3,

                    depth:
                        0.9,

                    seatHeight:
                        0.7,

                    seatThickness:
                        0.18

                });


            this.scene.add(
                bench
            );


            /*
             * =================================================
             * COLLIDER
             * =================================================
             */

            const collider =
                bench.getCollider(
                    0.02
                );


            this.player.addCollider(
                collider
            );

        }

    }

    addObjectCollider(
        object,
        padding = 0.15
    ) {

        if (
            !this.player ||
            !object
        ) {

            return;

        }


        object.updateMatrixWorld(
            true
        );


        const box =
            new THREE.Box3()
                .setFromObject(
                    object
                );


        this.player.addCollider({

            minX:
                box.min.x -
                padding,

            maxX:
                box.max.x +
                padding,

            minZ:
                box.min.z -
                padding,

            maxZ:
                box.max.z +
                padding

        });

    }

    createFloatingText() {

        const floatingTextBack =
        new FloatingText({

            text:
                'to my History',

            position: {
                x: 0,
                y: 12,
                z: -27
            },

            size:
                2.3,

            depth:
                0.18,

            outlineSize:
                0.32

        });

        const floatingTextFront =
        new FloatingText({

            text:
                'Welcome',

            position: {
                x: 0,
                y: 12,
                z: -15
            },

            size:
                2.3,

            depth:
                0.18,

            outlineSize:
                0.28

        });


        this.scene.add(
            floatingTextBack, floatingTextFront
        );

    }

    createSecretButton() {

        /*
        * =====================================================
        * BOTÃO SECRETO
        * =====================================================
        *
        * Fica no centro da parede oposta
        * aos quadros.
        *
        * Parede:
        *
        * Z = +50
        *
        * O botão fica ligeiramente para
        * dentro da parede.
        */

        this.secretButton =
            new SecretButton({

                scene:
                    this.scene,

                position: {

                    x:
                        0,

                    y:
                        2,

                    z:
                        49.7

                },

                interactionDistance:
                    3

            });


        this.scene.add(
            this.secretButton
        );

    }

    addPainting(painting) {

        this.scene.add(
            painting
        );

        this.paintings.push(
            painting
        );
    }
}