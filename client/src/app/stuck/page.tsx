"use client";

export default function Stuck() {
    return (
        <main>
            <h1 className="page-title">I&#39;m stuck</h1>

            <p>
                You are stuck on the campus with no way out? Don&#39;t worry,
                we&#39;ll find a solution. Contact the AERs or directors of your
                campus.
            </p>

            <div>
                <h2>The AERs of your campus</h2>

                <div>
                    <h3>EPITECH</h3>
                    <p>
                        They are responsible for the guard, for opening and
                        closing the campus.
                    </p>
                    <p>
                        <b>Contact:</b>{" "}
                        <a href="mailto:aer-nice@epitech.eu">
                            aer-nice@epitech.eu
                        </a>
                    </p>
                </div>
            </div>

            <div>
                <h2>Directors of your campus</h2>

                <div>
                    <h3>EPITECH</h3>
                    <p>They are responsible for the campus and can help you.</p>
                    <p>
                        <b>Contact:</b>{" "}
                        <a href="mailto:dpr-nice@epitech.eu">
                            dpr-nice@epitech.eu
                        </a>{" "}
                        | <a href="tel:+330422133266">+33 04 22 13 32 66</a>
                    </p>
                </div>

                <div>
                    <h3>ISEGCOM</h3>
                    <p>They are responsible for the campus and can help you.</p>
                    <p>
                        <b>Contact:</b>{" "}
                        <a href="mailto:dpr-nice@isegcom.eu">
                            dpr-nice@isegcom.eu
                        </a>{" "}
                        | <a href="tel:+330422133266">+33 04 22 13 32 66</a>
                    </p>
                </div>

                <div>
                    <h3>E-ARTSUP</h3>
                    <p>They are responsible for the campus and can help you.</p>
                    <p>
                        <b>Contact:</b>{" "}
                        <a href="mailto:dpr-nice@eartsup.eu">
                            dpr-nice@eartsup.eu
                        </a>{" "}
                        | <a href="tel:+330422133266">+33 04 22 13 32 66</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
