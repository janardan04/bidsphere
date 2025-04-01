import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is included
import "../styles/header.css"; // Assuming you have a CSS file for styling

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchQuery = e.target.querySelector(".search-input").value;
        console.log("Search query:", searchQuery);
        navigate(`/auctions?search=${searchQuery}`);
    };

    return (
        <header>
            <nav className="custom-header navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/">
                    BidSphere
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about-us">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/auctions">
                                Auctions
                            </Link>
                        </li>
                    </ul>
                    <form className="d-flex search-form" onSubmit={handleSearch}>
                        <input type="search" className="form-control search-input" placeholder="Search..." />
                        <button className="btn btn-search" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    <div className="d-flex gap-2">
                        {user ? (
                            <>
                                <span className="navbar-text">
                                    <b>{user.displayName || user.email}</b>
                                </span>
                                <Link to="/profile" className="btn btn-outline-primary">
                                    Profile
                                </Link>
                                <button className="btn btn-outline-danger logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-primary dropdown-toggle"
                                    type="button"
                                    id="loginDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Login
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
                                    <li style={{ listStyle: "none", marginBottom: "8px" }}>
                                        <Link
                                            to="/login"
                                            className="dropdown-item"
                                            style={{
                                                display: "block",
                                                padding: "10px 15px",
                                                textDecoration: "none",
                                                color: "#333",
                                                background: "linear-gradient(to right, rgba(135, 206, 235, 0.6), rgba(93, 173, 226, 0.6))",
                                                borderRadius: "5px",
                                                transition: "all 0.3s ease-in-out",
                                                textAlign: "center",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = "linear-gradient(to right, rgba(135, 206, 235, 1), rgba(93, 173, 226, 1))";
                                                e.target.style.transform = "scale(1.05)";
                                                e.target.style.color = "#fff";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = "linear-gradient(to right, rgba(135, 206, 235, 0.6), rgba(93, 173, 226, 0.6))";
                                                e.target.style.transform = "scale(1)";
                                                e.target.style.color = "#333";
                                            }}
                                        >
                                            User Login
                                        </Link>
                                    </li>

                                    <li style={{ listStyle: "none" }}>
                                        <Link
                                            to="/seller-login"
                                            className="dropdown-item"
                                            style={{
                                                display: "block",
                                                padding: "10px 15px",
                                                textDecoration: "none",
                                                color: "#333",
                                                background: "linear-gradient(to right, rgba(135, 206, 235, 0.6), rgba(93, 173, 226, 0.6))",
                                                borderRadius: "5px",
                                                transition: "all 0.3s ease-in-out",
                                                textAlign: "center",
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.background = "linear-gradient(to right, rgba(135, 206, 235, 1), rgba(93, 173, 226, 1))";
                                                e.target.style.transform = "scale(1.05)";
                                                e.target.style.color = "#fff";
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.background = "linear-gradient(to right, rgba(135, 206, 235, 0.6), rgba(93, 173, 226, 0.6))";
                                                e.target.style.transform = "scale(1)";
                                                e.target.style.color = "#333";
                                            }}
                                        >
                                            Seller Login
                                        </Link>
                                    </li>


                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;