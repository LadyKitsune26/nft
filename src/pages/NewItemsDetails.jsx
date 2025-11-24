import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import EthImage from "../images/ethereum.svg";
import AuthorImageFallback from "../images/author_thumbnail.jpg";

// Skeleton Loader
const NewItemsDetailsSkeleton = () => {
  return (
    <div className="container my-5" data-aos="fade-in">
      <div className="row">
        <div className="col-md-6">
          <div style={{ width: "100%", height: "400px", background: "#eee" }}></div>
        </div>
        <div className="col-md-6">
          <div style={{ width: "80%", height: "30px", background: "#eee", marginBottom: "10px" }}></div>
          <div style={{ width: "60%", height: "20px", background: "#eee", marginBottom: "10px" }}></div>
          <div style={{ width: "100%", height: "200px", background: "#eee" }}></div>
        </div>
      </div>
    </div>
  );
};

const NewItemsDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Countdown state
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // Fetch item + author
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const nftRes = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        const foundItem = nftRes.data.find(
          (i) => Number(i.nftId) === Number(nftId)
        );

        setItem(foundItem || null);

        if (foundItem) {
          const authorRes = await axios.get(
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${foundItem.authorId}`
          );
          setAuthor(authorRes.data || null);
        }
      } catch (err) {
        console.error("Failed to fetch NFT or author details", err);
        setItem(null);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [nftId]);

  // Dynamic countdown
  useEffect(() => {
    if (!item?.expiryDate) return;

    const targetTime = new Date(item.expiryDate).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance <= 0) {
        setCountdown("EXPIRED");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [item]);

  if (loading) return <NewItemsDetailsSkeleton />;
  if (!item) return <p className="text-center mt-5">Item not found.</p>;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">

            <div className="row justify-content-center align-items-start">

              {/* NFT Image */}
              <div
                className="col-md-5 text-center mb-4"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded nft-image"
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.currentTarget.src = "/fallback-nft.png")}
                />
              </div>

              {/* NFT Info */}
              <div className="col-md-7" data-aos="fade-up" data-aos-delay="200">
                <div className="item_info">

                  <h2 data-aos="fade-right" data-aos-delay="300">
                    {item.title}
                  </h2>

                  {/* Views & Likes */}
                  <div
                    className="item_info_counts mb-3"
                    data-aos="fade-right"
                    data-aos-delay="400"
                  >
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {item.views || 0}
                    </div>
                    <div className="item_info_like ms-3">
                      <i className="fa fa-heart"></i> {item.likes || 0}
                    </div>
                  </div>

                  {/* Description */}
                  <p data-aos="fade-in" data-aos-delay="500">
                    {item.description || "No description available."}
                  </p>

                  <div
                    className="row mt-4"
                    data-aos="fade-up"
                    data-aos-delay="600"
                  >
                    {/* Owner */}
                    {author && (
                      <div className="col-md-6 mb-3">
                        <h6>Owner</h6>
                        <div className="item_author d-flex align-items-center">
                          <div className="author_list_pp">
                            <Link to={`/author/${author.authorId}`}>
                              <img
                                src={author.authorImage || AuthorImageFallback}
                                alt={author.authorName}
                                className="lazy"
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info ms-2">
                            <Link to={`/author/${author.authorId}`}>
                              {author.authorName}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Countdown */}
                    <div className="col-md-6 mb-3">
                      <h6>Time Left</h6>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: countdown === "EXPIRED" ? "red" : "#333",
                        }}
                      >
                        {countdown}
                      </div>
                    </div>

                    {/* Creator */}
                    {author && (
                      <div className="col-md-6 mb-4">
                        <h6>Creator</h6>
                        <div className="item_author d-flex align-items-center">
                          <div className="author_list_pp">
                            <Link to={`/author/${author.authorId}`}>
                              <img
                                src={author.authorImage || AuthorImageFallback}
                                alt={author.authorName}
                                className="lazy"
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info ms-2">
                            <Link to={`/author/${author.authorId}`}>
                              {author.authorName}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="col-md-6 mb-4">
                      <h6>Price</h6>
                      <div className="nft-item-price d-flex align-items-center">
                        <img src={EthImage} alt="ETH" style={{ width: "20px" }} />
                        <span className="ms-2">{item.price || "N/A"} ETH</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Back button */}
            <div className="text-center mt-5">
              <Link to="/new-items" className="btn btn-primary">
                Back
              </Link>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default NewItemsDetails;


