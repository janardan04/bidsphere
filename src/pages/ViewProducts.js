// src/pages/ViewProducts.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import '../styles/view-product.css';

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const productRef = ref(database, 'auctions');
            try {
                const snapshot = await get(productRef);
                if (snapshot.exists()) {
                    const productsData = snapshot.val();
                    console.log('Fetched products in ViewProducts:', productsData);
                    const currentTime = new Date().getTime();
                    const productList = [];

                    Object.keys(productsData).forEach((productId) => {
                        const product = productsData[productId];
                        const startTime = product.startTime || 0;
                        const endTime = product.endTime || 0;
                        const status =
                            currentTime < startTime
                                ? 'Upcoming'
                                : currentTime >= startTime && currentTime < endTime
                                ? 'Active'
                                : 'Ended';

                        productList.push({
                            id: productId,
                            ...product,
                            status,
                        });
                    });

                    setProducts(productList);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError('Failed to load products: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="view-products-page" style={{ paddingTop: '80px' }}>
            <div className="container">
                <h2 className="text-center mb-4">Available Auctions</h2>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {products.length > 0 ? (
                    <div className="row">
                        {products.map((product) => {
                            const imageSources = product.images && product.images.length > 0 
                                ? product.images 
                                : product.image 
                                ? [product.image] 
                                : [];
                            return (
                                <div key={product.id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        <img
                                            src={
                                                imageSources.length > 0
                                                    ? imageSources[0]
                                                    : 'https://via.placeholder.com/300'
                                            }
                                            className="card-img-top"
                                            alt={product.productName}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                console.error('ViewProducts image failed to load:', imageSources.length > 0 ? imageSources[0] : 'No image');
                                                e.target.src = 'https://via.placeholder.com/300';
                                            }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.productName}</h5>
                                            <p className="card-text">{product.description}</p>
                                            <p className="card-text">
                                                <strong>Current Bid:</strong> ₹{product.currentPrice}
                                            </p>
                                            <p className="card-text">
                                                <strong>Status:</strong>{' '}
                                                <span
                                                    className={`badge bg-${
                                                        product.status === 'Active'
                                                            ? 'success'
                                                            : product.status === 'Ended'
                                                            ? 'danger'
                                                            : 'secondary'
                                                    }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </p>
                                            <Link
                                                to={`/place-bid/${product.id}`}
                                                className="btn btn-primary w-100"
                                            >
                                                {product.status === 'Active' ? 'Place Bid' : 'View Details'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center">No products available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewProducts;