import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebaseConfig';
import { Button, Alert } from 'react-bootstrap';
// import '../styles/receipt.css'; // Create this CSS file for styling

const Receipt = () => {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const auctionId = queryParams.get('auctionId');

  useEffect(() => {
    if (auctionId) {
      const auctionRef = ref(database, `auctions/${auctionId}`);
      get(auctionRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setAuction({
              id: auctionId,
              productName: data.productName,
              currentPrice: data.currentPrice,
              seller: data.seller,
              description: data.description,
              endTime: new Date(data.endTime).toLocaleString(),
              paymentStatus: data.paymentStatus || 'Pending',
            });
          } else {
            setError('Auction not found.');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching receipt details: ' + err.message);
          setLoading(false);
        });
    } else {
      setError('No auction ID provided.');
      setLoading(false);
    }
  }, [auctionId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="container py-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Payment Receipt</h2>
      <div className="card p-4">
        <h4>Thank you for your purchase!</h4>
        <p><strong>Product Name:</strong> {auction.productName}</p>
        <p><strong>Amount Paid:</strong> ₹{auction.currentPrice.toFixed(2)}</p>
        <p><strong>Seller Email:</strong> {auction.seller}</p>
        <p><strong>Auction ID:</strong> {auction.id}</p>
        <p><strong>Description:</strong> {auction.description}</p>
        <p><strong>Auction End Time:</strong> {auction.endTime}</p>
        <p><strong>Payment Status:</strong> {auction.paymentStatus}</p>

        <Button variant="primary" onClick={() => navigate('/profile')}>
          Back to Profile
        </Button>
      </div>
    </div>
  );
};

export default Receipt;