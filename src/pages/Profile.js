import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Firebase authentication hook
import { auth, database } from '../firebase/firebaseConfig'; // Corrected import path for Firebase config
import { ref, onValue } from 'firebase/database'; // Firebase Realtime Database methods
import { Modal, Button } from 'react-bootstrap'; // Bootstrap components for modal
import '../styles/user-profile.css'; // Corrected CSS import path

const Profile = () => {
  const [user] = useAuthState(auth); // Get the current authenticated user
  const [auctionsWon, setAuctionsWon] = useState([]); // State for auctions won by the user
  const [selectedAuction, setSelectedAuction] = useState(null); // State for the selected auction

  // Fetch auctions won by the user
  useEffect(() => {
    if (user) {
      const auctionsRef = ref(database, 'auctions'); // Reference to the auctions in the database
      onValue(auctionsRef, (snapshot) => {
        if (snapshot.exists()) {
          const auctions = snapshot.val();
          const won = Object.entries(auctions)
            .filter(([_, auction]) => auction.highestBidder === user.email && !auction.isActive) // Filter won auctions
            .map(([id, auction]) => ({
              id,
              name: auction.productName,
              price: auction.currentPrice,
              seller: auction.seller,
              description: auction.description,
              endTime: new Date(auction.endTime).toLocaleString(),
              paymentStatus: auction.paymentStatus || 'pending', // Default payment status
            }));
          setAuctionsWon(won);
        } else {
          setAuctionsWon([]); // No auctions found
        }
      });
    }
  }, [user]);

  // Show receipt modal for the selected auction
  const showReceipt = (auction) => {
    setSelectedAuction(auction);
  };

  // Redirect to payment page
  const goToPayment = () => {
    window.location.href = `/payment?auctionId=${selectedAuction.id}`;
  };

  return (
    <div className="container py-5 flex-grow-1">
      {/* Profile Header */}
      <header className="profile-header mb-4">
        <h1 className="display-5 fw-bold">
          Welcome, {user ? user.displayName || user.email.split('@')[0] : 'Loading...'}
        </h1>
        <p className="text-muted">View and manage your won auctions</p>
      </header>

      {/* Auctions Won Table */}
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
                  <th>Action</th>
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
                        <button
                          className="btn btn-outline-primary btn-sm proceed-btn"
                          onClick={() => showReceipt(auction)}
                        >
                          <i className="bi bi-receipt"></i> Proceed
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      No auctions won yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Auction Receipt Modal */}
      {selectedAuction && (
        <Modal show={!!selectedAuction} onHide={() => setSelectedAuction(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Auction Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Product Name:</strong> {selectedAuction.name}
            </p>
            <p>
              <strong>Winning Bid:</strong> ₹{selectedAuction.price}
            </p>
            <p>
              <strong>Seller Email:</strong> {selectedAuction.seller}
            </p>
            <p>
              <strong>Auction ID:</strong> {selectedAuction.id}
            </p>
            <p>
              <strong>Description:</strong> {selectedAuction.description}
            </p>
            <p>
              <strong>End Time:</strong> {selectedAuction.endTime}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedAuction.paymentStatus}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedAuction(null)}>
              Close
            </Button>
            {selectedAuction.paymentStatus === 'pending' && (
              <Button variant="success" onClick={goToPayment}>
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