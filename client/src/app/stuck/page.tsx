/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

export default function Stuck() {
    return (
        <main className="page-wrapper">
            <div className="page-container-md" style={{ margin: '0 auto' }}>
                <div className="page-header">
                    <div className="page-header-left">
                        <h1 className="page-title">I&#39;m Stuck</h1>
                        <p className="page-subtitle">Locked on campus? Contact the right people.</p>
                    </div>
                </div>

                <div className="alert-info" style={{ marginBottom: '2rem' }}>
                    You are stuck on campus with no way out? Don&#39;t worry — contact the AERs or directors below.
                </div>

                {/* AERs Section */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 className="section-title">AERs</h2>
                    <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
                        They are responsible for the guard, opening and closing the campus.
                    </p>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="contact-school-name">EPITECH</div>
                            <p className="contact-description">Responsible for the guard and access.</p>
                            <a href="mailto:aer-nice@epitech.eu" className="contact-link">
                                ✉ aer-nice@epitech.eu
                            </a>
                        </div>
                    </div>
                </section>

                {/* Directors Section */}
                <section>
                    <h2 className="section-title">Campus Directors</h2>
                    <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
                        Responsible for the campus — they can help in any situation.
                    </p>
                    <div className="contact-grid">
                        <div className="contact-card">
                            <div className="contact-school-name">EPITECH</div>
                            <p className="contact-description">Responsible for the campus and students.</p>
                            <a href="mailto:dpr-nice@epitech.eu" className="contact-link">
                                ✉ dpr-nice@epitech.eu
                            </a>
                            <a href="tel:+330422133266" className="contact-link">
                                📞 +33 04 22 13 32 66
                            </a>
                        </div>

                        <div className="contact-card">
                            <div className="contact-school-name">ISEGCOM</div>
                            <p className="contact-description">Responsible for the campus and students.</p>
                            <a href="mailto:dpr-nice@isegcom.eu" className="contact-link">
                                ✉ dpr-nice@isegcom.eu
                            </a>
                            <a href="tel:+330422133266" className="contact-link">
                                📞 +33 04 22 13 32 66
                            </a>
                        </div>

                        <div className="contact-card">
                            <div className="contact-school-name">E-ARTSUP</div>
                            <p className="contact-description">Responsible for the campus and students.</p>
                            <a href="mailto:dpr-nice@eartsup.eu" className="contact-link">
                                ✉ dpr-nice@eartsup.eu
                            </a>
                            <a href="tel:+330422133266" className="contact-link">
                                📞 +33 04 22 13 32 66
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
