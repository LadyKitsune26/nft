import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { nftId } = useParams();
  const navigate = useNavigate();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const res = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        setNft(res.data);
      } catch (err) {
        console.error("Error fetching NFT:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
    window.scrollTo(0, 0);
  }, [nftId]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!nft) return <div className="text-center mt-5">NFT not found.</div>;

  return (
    <div className="container" style={{ paddingTop: "120px" }}>
      {/* Page Title */}
      <h2 className="text-center mb-5">{nft.title}</h2>

      <div className="row align-items-start">
        {/* NFT Image Column */}
        <div className="col-lg-4 d-flex justify-content-center mb-4">
          <img
            src={nft.nftImage}
            alt={nft.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        </div>

        {/* Middle Column (Price, Views, Likes, Tags) */}
        <div className="col-lg-4 mb-4">
          <div className="p-3 rounded shadow-sm" style={{ background: "#f8f8f8" }}>
            <h4 className="mb-3">Details</h4>

            <p><strong>Price:</strong> {nft.price} ETH</p>
            <p><strong>Views:</strong> {nft.views}</p>
            <p><strong>Likes:</strong> {nft.likes}</p>

            <p><strong>Tags:</strong></p>
            <div>
              {nft.tags?.map((tag, i) => (
                <span key={i} className="badge bg-primary me-2">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Owner & Creator Column (NEW) */}
        <div className="col-lg-4 mb-4">
          <div className="p-3 rounded shadow-sm" style={{ background: "#f1f1f1" }}>
            <h4 className="mb-3">People</h4>

            {/* Creator */}
            <div className="mb-3">
              <p className="mb-1"><strong>Creator:</strong></p>
              <Link
                to={`/author/${nft.creatorId}`}
                className="d-flex align-items-center text-decoration-none"
              >
                <img
                  src={nft.creatorImage}
                  alt="Creator"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <span>{nft.creatorName}</span>
              </Link>
            </div>

            {/* Owner */}
            <div>
              <p className="mb-1"><strong>Owner:</strong></p>
              <Link
                to={`/author/${nft.ownerId}`}
                className="d-flex align-items-center text-decoration-none"
              >
                <img
                  src={nft.ownerImage}
                  alt="Owner"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <span>{nft.ownerName}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Back Button */}
      <div className="text-center mt-5 mb-5">
        <button className="btn btn-primary px-4 py-2" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;

