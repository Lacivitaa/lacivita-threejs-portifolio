export class Modal {

    constructor(onOpen, onClose) {

        this.element =
            document.getElementById('modal');

        this.title =
            document.getElementById('modal-title');

        this.sectionNumber =
            document.getElementById(
                'modal-section-number'
            );

        this.body =
            document.getElementById('modal-body');

        this.closeButton =
            document.getElementById('modal-close');

        this.onOpen =
            onOpen;

        this.onClose =
            onClose;

        this.closeButton.addEventListener(
            'click',
            () => this.close()
        );

        document.addEventListener(
            'keydown',
            (event) => {

                if (event.code === 'Escape') {
                    this.close();
                }

            }
        );
    }


    open(painting) {

        this.title.textContent =
            painting.userData.title;

        this.body.innerHTML =
            painting.userData.description;

        const sectionNumbers = {
            'ABOUT ME': '01',
            'EXPERIENCES': '02',
            'SKILLS': '03',
            'CONTACT': '04'
        };

        if (this.sectionNumber) {

            this.sectionNumber.textContent =
                sectionNumbers[
                    painting.userData.title
                ] || '00';
        }

        this.element.classList.toggle(
            'about-modal',
            painting.userData.title === 'ABOUT ME'
        );

        this.element.classList.toggle(
            'experience-modal',
            painting.userData.title === 'EXPERIENCES'
        );

        this.element.classList.toggle(
            'skills-modal',
            painting.userData.title === 'SKILLS'
        );

        this.element.classList.toggle(
            'contact-modal',
            painting.userData.title === 'CONTACT'
        );

        const portrait =
            document.getElementById('about-portrait');
        if (portrait && painting.userData.title === 'ABOUT ME') {
                portrait.src ='/assets/igor-pixel.png';
        }

        this.element.classList.remove(
            'hidden'
        );

        if (this.onOpen) {
            this.onOpen();
        }
    }


    /*
     * =====================================================
     * EXPERIENCES
     * =====================================================
     */

    renderExperiences() {

        this.body.innerHTML = `

            <div class="experience-list">


                <!-- IBM -->
                <article class="experience-item">

                    <div class="experience-header">

                        <div>

                            <h2>
                                Application Developer Regular
                            </h2>

                            <div class="experience-company">
                                IBM
                            </div>

                        </div>

                        <div class="experience-date">
                            Feb 2024 — Present
                        </div>

                    </div>


                    <div class="experience-role">
                        FullStack Developer — Java & Adobe AEM
                    </div>


                    <p>
                        Development and maintenance of web
                        applications using Adobe Experience
                        Manager (AEM) in international projects.
                    </p>

                    <p>
                        Responsible for creating customized
                        components using Java and HTL (Sightly),
                        integrating backend services through REST
                        APIs, configuring workflows and supporting
                        content management.
                    </p>

                    <p>
                        Active participation in agile teams,
                        collaborating with multidisciplinary
                        squads across different countries to
                        deliver scalable solutions aligned with
                        business requirements.
                    </p>


                    <div class="experience-tags">

                        <span>Java</span>
                        <span>Adobe AEM</span>
                        <span>HTL</span>
                        <span>REST APIs</span>
                        <span>JavaScript</span>

                    </div>

                </article>



                <!-- IBM -->
                <article class="experience-item">

                    <div class="experience-header">

                        <div>

                            <h2>
                                Application Developer Junior
                            </h2>

                            <div class="experience-company">
                                IBM
                            </div>

                        </div>

                        <div class="experience-date">
                            Dec 2022 — Jan 2024
                        </div>

                    </div>


                    <div class="experience-role">
                        FullStack Developer — Java & Angular
                    </div>


                    <p>
                        Worked as a FullStack Developer directly
                        for a banking client, developing and
                        maintaining applications used by the
                        bank's customers.
                    </p>

                    <p>
                        Developed new features and functionalities
                        using Java on the backend and Angular on
                        the frontend, focusing on reliability,
                        security and performance.
                    </p>

                    <p>
                        Worked collaboratively across frontend
                        and backend development to deliver a
                        consistent and efficient user experience.
                    </p>


                    <div class="experience-tags">

                        <span>Java</span>
                        <span>Angular</span>
                        <span>TypeScript</span>
                        <span>Azure</span>

                    </div>

                </article>



                <!-- IBM -->
                <article class="experience-item">

                    <div class="experience-header">

                        <div>

                            <h2>
                                Application Developer
                            </h2>

                            <div class="experience-company">
                                IBM
                            </div>

                        </div>

                        <div class="experience-date">
                            Apr 2021 — Nov 2022
                        </div>

                    </div>


                    <div class="experience-role">
                        Java Developer
                    </div>


                    <p>
                        Worked as a Java Developer directly for a
                        banking client, focusing on the development,
                        maintenance and support of mobile banking
                        applications.
                    </p>

                    <p>
                        Worked primarily on the support area,
                        investigating and resolving issues found
                        in the application's code while maintaining
                        reliability, security and performance.
                    </p>

                    <p>
                        Participated in an initiative that helped
                        reverse a period of task overload within
                        the team, improving workflow organization
                        and contributing to a more balanced
                        operation.
                    </p>


                    <div class="experience-tags">

                        <span>Java</span>
                        <span>Mobile Development</span>
                        <span>Azure</span>

                    </div>

                </article>



                <!-- IBM -->
                <article class="experience-item">

                    <div class="experience-header">

                        <div>

                            <h2>
                                GBS Associate Intern
                            </h2>

                            <div class="experience-company">
                                IBM
                            </div>

                        </div>

                        <div class="experience-date">
                            Dec 2020 — Mar 2021
                        </div>

                    </div>


                    <div class="experience-role">
                        Internship
                    </div>


                    <p>
                        Internship program focused on learning
                        IBM technologies, development practices
                        and corporate guidelines.
                    </p>

                    <p>
                        Completed more than 200 hours of courses
                        and professional certifications during
                        the program.
                    </p>

                </article>



                <!-- NXT -->
                <article class="experience-item">

                    <div class="experience-header">

                        <div>

                            <h2>
                                Intern in IT Support
                            </h2>

                            <div class="experience-company">
                                NXT IT Solutions
                            </div>

                        </div>

                        <div class="experience-date">
                            Oct 2020 — Nov 2020
                        </div>

                    </div>


                    <div class="experience-role">
                        IT Support Intern
                    </div>


                    <p>
                        Internship focused on form creation and
                        file management within a proprietary
                        platform serving the medical sector.
                    </p>

                </article>


            </div>
        `;
    }

    openDog() {

        /*
        * =====================================================
        * MODAL DA FOTO DO JORIS
        * =====================================================
        */

        this.element.classList.remove(
            'about-modal',
            'experience-modal',
            'skills-modal',
            'contact-modal'
        );


        this.element.classList.add(
            'dog-photo-modal'
        );


        this.body.innerHTML = `

            <div class="dog-photo-container">

                <img
                    src="/assets/family.png"
                    alt="Family"
                    class="dog-photo"
                />

            </div>

        `;


        /*
        * Não utiliza título,
        * número ou conteúdo da modal normal.
        */

        this.title.textContent = '';

        this.body.classList.add(
            'dog-photo-body'
        );


        this.element.classList.remove(
            'hidden'
        );


        if (this.onOpen) {

            this.onOpen();

        }

    }

    /*
     * =====================================================
     * CLOSE
     * =====================================================
     */

    close() {

        this.element.classList.add(
            'hidden'
        );


        this.element.classList.remove(
            'dog-photo-modal'
        );


        this.body.classList.remove(
            'dog-photo-body'
        );


        if (this.onClose) {

            this.onClose();

        }

    }
}