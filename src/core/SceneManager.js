import * as THREE from 'three';

import {
    EffectComposer
} from 'three/addons/postprocessing/EffectComposer.js';

import {
    RenderPass
} from 'three/addons/postprocessing/RenderPass.js';

import {
    ShaderPass
} from 'three/addons/postprocessing/ShaderPass.js';

import {
    OutputPass
} from 'three/addons/postprocessing/OutputPass.js';

import {
    ObraDinnShader
} from '../shaders/ObraDinnShader.js';


export class SceneManager {

    constructor(container) {

        this.container = container;

        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(
                0x111111
            );


        /*
         * =====================================================
         * CÂMERA
         * =====================================================
         */

        this.camera =
            new THREE.PerspectiveCamera(
                75,
                window.innerWidth /
                window.innerHeight,
                0.1,
                1000
            );

        this.camera.position.set(
            0,
            1.7,
            5
        );


        /*
         * =====================================================
         * RENDERER
         * =====================================================
         */

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true
            });

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        /*
         * =====================================================
         * SOMBRAS
         * =====================================================
         */

        this.renderer.shadowMap.enabled =
            true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        /*
         * =====================================================
         * COLOR MANAGEMENT
         * =====================================================
         */

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.container.appendChild(
            this.renderer.domElement
        );


        /*
         * =====================================================
         * ILUMINAÇÃO
         * =====================================================
         */

        this.setupLights();


        /*
         * =====================================================
         * POST PROCESSING
         * =====================================================
         */

        this.setupPostProcessing();


        /*
         * =====================================================
         * RESIZE
         * =====================================================
         */

        window.addEventListener(
            'resize',
            () => this.onResize()
        );
    }


    setupLights() {

        const ambientLight =
            new THREE.AmbientLight(
                0xffffff,
                0.25
            );

        this.scene.add(
            ambientLight
        );
    }


    setupPostProcessing() {

        /*
         * =====================================================
         * COMPOSER
         * =====================================================
         */

        this.composer =
            new EffectComposer(
                this.renderer
            );


        /*
         * =====================================================
         * RENDER PASS
         * =====================================================
         */

        this.renderPass =
            new RenderPass(
                this.scene,
                this.camera
            );

        this.composer.addPass(
            this.renderPass
        );


        /*
         * =====================================================
         * SHADER
         * =====================================================
         */

        this.shaderPass =
            new ShaderPass(
                ObraDinnShader
            );


        /*
         * Resolução utilizada pelo shader.
         */

        if (
            this.shaderPass.uniforms.resolution
        ) {

            this.shaderPass.uniforms
                .resolution.value = {

                    x: window.innerWidth,

                    y: window.innerHeight

                };
        }


        this.composer.addPass(
            this.shaderPass
        );


        /*
         * =====================================================
         * OUTPUT
         * =====================================================
         */

        this.outputPass =
            new OutputPass();

        this.composer.addPass(
            this.outputPass
        );
    }


    onResize() {

        /*
         * Câmera
         */

        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;

        this.camera.updateProjectionMatrix();


        /*
         * Renderer
         */

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        /*
         * Composer
         */

        this.composer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        /*
         * Shader
         */

        if (
            this.shaderPass &&
            this.shaderPass.uniforms.resolution
        ) {

            this.shaderPass.uniforms
                .resolution.value = {

                    x: window.innerWidth,

                    y: window.innerHeight

                };
        }
    }


    render() {

        this.composer.render();

    }

}