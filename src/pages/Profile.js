import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/user-profile.css';

const Profile = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [auctionsWon, setAuctionsWon] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const auctionsRef = ref(database, 'auctions');
    const unsubscribe = onValue(
      auctionsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const auctions = snapshot.val();
          const won = Object.entries(auctions)
            .filter(([_, auction]) => auction.highestBidder === user.email && !auction.isActive)
            .map(([id, auction]) => ({
              id,
              name: auction.productName,
              price: auction.currentPrice,
              seller: auction.seller,
              description: auction.description,
              endTime: new Date(auction.endTime).toLocaleString(),
              paymentStatus: auction.paymentStatus || 'Pending',
            }));
          setAuctionsWon(won);
        } else {
          setAuctionsWon([]);
        }
        setLoading(false);
      },
      (err) => {
        setError('Failed to load auctions: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingAuth, navigate]);

  const showReceipt = (auction) => {
    setSelectedAuction(auction);
  };

  const goToPayment = (auctionId) => {
    navigate(`/payment?auctionId=${auctionId}`);
  };

  if (loading || loadingAuth) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorAuth) {
    return (
      <div className="container py-5">
        <Alert variant="danger">Authentication error: {errorAuth.message}</Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container py-5 flex-grow-1">
      <header className="profile-header mb-4">
        <h1 className="display-5 fw-bold">
          Welcome, {user.displayName || user.email.split('@')[0]}
        </h1>
        <p className="text-muted">View and manage your won auctions</p>
      </header>

      <div className="card profile-bid-table">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-trophy me-2"></i> Auctions Won
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Seller Email</th>
                  <th>Payment Status</th>
                  <th>Receipt</th> {/* New column for receipt */}
                  <th>Payment</th> {/* New column for payment */}
                </tr>
              </thead>
              <tbody>
                {auctionsWon.length > 0 ? (
                  auctionsWon.map((auction) => (
                    <tr key={auction.id}>
                      <td>{auction.name}</td>
                      <td>₹{auction.price.toFixed(2)}</td>
                      <td>{auction.seller}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            auction.paymentStatus === 'Completed' ? 'success' : 'warning'
                          }`}
                        >
                          {auction.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => showReceipt(auction)}
                        >
                          <i className="bi bi-receipt"></i> View Receipt
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => goToPayment(auction.id)}
                          disabled={auction.paymentStatus === 'Completed'} // Disable if paid
                        >
                          <i className="bi bi-credit-card"></i> Make Payment
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No auctions won yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedAuction && (
        <Modal show={!!selectedAuction} onHide={() => setSelectedAuction(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Auction Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Product Name:</strong> {selectedAuction.name}</p>
            <p><strong>Winning Bid:</strong> ₹{selectedAuction.price}</p>
            <p><strong>Seller Email:</strong> {selectedAuction.seller}</p>
            <p><strong>Auction ID:</strong> {selectedAuction.id}</p>
            <p><strong>Description:</strong> {selectedAuction.description}</p>
            <p><strong>End Time:</strong> {selectedAuction.endTime}</p>
            <p><strong>Payment Status:</strong> {selectedAuction.paymentStatus}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedAuction(null)}>
              Close
            </Button>
            {selectedAuction.paymentStatus === 'Pending' && (
              <Button variant="success" onClick={() => goToPayment(selectedAuction.id)}>
                Make Payment
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Profile;