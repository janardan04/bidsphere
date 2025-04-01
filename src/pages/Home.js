// src/pages/Home.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css'; // Assuming you have this CSS file

const Home = () => {
    useEffect(() => {
        // Typing animation for hero-lead
        const heroLead = document.querySelector('.hero-lead');
        if (heroLead) {
            const text = heroLead.textContent;
            heroLead.textContent = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    heroLead.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                }
            };
            type();
        }
    }, []);

    return (
        <div>
            {/* Floating shapes and particles */}
            <div className="floating-shape shape1"></div>
            <div className="floating-shape shape2"></div>
            <div className="floating-shape shape3"></div>
            <div className="floating-shape shape4"></div>
            <div className="floating-shape shape5"></div>
            <div className="particle" style={{ left: '10%', animationDelay: '0s' }}></div>
            <div className="particle" style={{ left: '30%', animationDelay: '2s' }}></div>
            <div className="particle" style={{ left: '50%', animationDelay: '4s' }}></div>
            <div className="particle" style={{ left: '70%', animationDelay: '6s' }}></div>
            <div className="particle" style={{ left: '90%', animationDelay: '8s' }}></div>

            <div className="container main-container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <div className="hero-card text-center animate__animated ">
                    <h1 className="hero-title">
                        <i className="bi bi-hammer"></i> Welcome to BidSphere!
                    </h1>
                    <p className="hero-lead">
                        Discover unique items & exciting auctions. Buy, sell, and bid with confidence on our trusted platform!
                        <br />
                        <small>
                            Currently <span id="activeAuctions">0</span> active auctions!
                        </small>
                    </p>

                    <div className="cta-button-container">
                        <Link to="/login" className="btn btn-success cta-button">
                            <i className="bi bi-box-arrow-in-right"></i> Login
                        </Link>
                        <Link to="/register" className="btn btn-success cta-button">
                            <i className="bi bi-person-plus"></i> Register
                        </Link>
                    </div>

                    <div className="feature-section mt-5">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-shield-check feature-icon"></i>
                                    <h4>Secure Bidding</h4>
                                    <p>Safe and encrypted transactions for peace of mind</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-clock-history feature-icon"></i>
                                    <h4>Real-time Updates</h4>
                                    <p>Instant bid notifications and auction alerts</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-trophy feature-icon"></i>
                                    <h4>Win Amazing Items</h4>
                                    <p>Unique collectibles & rare finds at great prices</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="how-it-works-section mt-5">
                        <h2 className="text-center mb-4">How It Works</h2>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="step-item">
                                    <i className="bi bi-person-plus step-icon"></i>
                                    <h4>Register</h4>
                                    <p>Create an account to start bidding or selling.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="step-item">
                                    <i className="bi bi-search step-icon"></i>
                                    <h4>Find Items</h4>
                                    <p>Browse or search for items you're interested in.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="step-item">
                                    <i className="bi bi-hammer step-icon"></i>
                                    <h4>Bid or Sell</h4>
                                    <p>Place bids on items or list your own for auction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;