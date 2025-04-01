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
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        User Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller-login">
                                        Seller Login
                                    </Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="#" onClick={handleLogout}>
                                        Logout
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <form className="d-flex search-form" onSubmit={handleSearch}>
                        <input type="search" className="form-control search-input" placeholder="Search..." />
                        <button className="btn btn-search" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    {user && (
                        <span className="navbar-text ms-3">
                            <b>{user.displayName || user.email}</b>
                        </span>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;