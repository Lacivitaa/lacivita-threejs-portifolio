export const ObraDinnShader = {

    uniforms: {

        tDiffuse: {
            value: null
        },

        resolution: {
            value: {
                x: 1920,
                y: 1080
            }
        }

    },


    vertexShader: `

        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                    position,
                    1.0
                );

        }

    `,


    fragmentShader: `

        uniform sampler2D tDiffuse;

        uniform vec2 resolution;

        varying vec2 vUv;


        void main() {

            /*
             * =================================================
             * PIXEL
             * =================================================
             */

            vec2 pixel =
                floor(
                    vUv * resolution
                );


            /*
             * =================================================
             * IMAGEM ORIGINAL
             * =================================================
             */

            vec4 color =
                texture2D(
                    tDiffuse,
                    vUv
                );


            /*
             * =================================================
             * LUMINÂNCIA
             * =================================================
             *
             * Convertendo a imagem para grayscale.
             */

            float gray =
                dot(
                    color.rgb,
                    vec3(
                        0.299,
                        0.587,
                        0.114
                    )
                );


            /*
             * =================================================
             * BAYER 4x4
             * =================================================
             */

            float x =
                mod(
                    pixel.x,
                    4.0
                );

            float y =
                mod(
                    pixel.y,
                    4.0
                );

            float bayer = 0.0;


            /*
             * Linha 0
             */

            if (y < 1.0) {

                if (x < 1.0)
                    bayer = 0.0;

                else if (x < 2.0)
                    bayer = 8.0;

                else if (x < 3.0)
                    bayer = 2.0;

                else
                    bayer = 10.0;
            }


            /*
             * Linha 1
             */

            else if (y < 2.0) {

                if (x < 1.0)
                    bayer = 12.0;

                else if (x < 2.0)
                    bayer = 4.0;

                else if (x < 3.0)
                    bayer = 14.0;

                else
                    bayer = 6.0;
            }


            /*
             * Linha 2
             */

            else if (y < 3.0) {

                if (x < 1.0)
                    bayer = 3.0;

                else if (x < 2.0)
                    bayer = 11.0;

                else if (x < 3.0)
                    bayer = 1.0;

                else
                    bayer = 9.0;
            }


            /*
             * Linha 3
             */

            else {

                if (x < 1.0)
                    bayer = 15.0;

                else if (x < 2.0)
                    bayer = 7.0;

                else if (x < 3.0)
                    bayer = 13.0;

                else
                    bayer = 5.0;
            }


            /*
             * =================================================
             * NORMALIZAÇÃO
             * =================================================
             */

            float threshold =
                (bayer + 0.5) / 16.0;


            /*
             * =================================================
             * DITHER
             * =================================================
             */

            float result =
                step(
                    threshold,
                    gray
                );


            /*
             * =================================================
             * OUTPUT
             * =================================================
             */

            gl_FragColor =
                vec4(
                    vec3(result),
                    1.0
                );

        }

    `
};