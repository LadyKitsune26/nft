import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import AuthorBannerFallback from "../images/author_banner.jpg";
import AuthorImageFallback from "../images/author_thumbnail.jpg";

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthor(res.data);
      } catch (err) {
        console.error("Error fetching author:", err);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
    window.scrollTo(0, 0);
  }, [authorId]);

  if (loading) return <div className="text-center mt-4">Loading author...</div>;
  if (!author) return <div className="text-center mt-4">Author not found.</div>;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        {/* Dynamic Banner */}
        <section
          id="profile_banner"
          className="text-light"
          data-aos="zoom-in"
          data-aos-delay="50"
          style={{
            background: `url(${author.nftCollection?.[0]?.nftImage || AuthorBannerFallback}) top`,
          }}
        ></section>

        {/* Author Info */}
        <section aria-label="section" data-aos="fade-up" data-aos-delay="200">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {/* Profile Box */}
                <div
                  className="d_profile de-flex"
                  data-aos="fade-down"
                  data-aos-delay="300"
                >
                  <div className="de-flex-col">
                    {/* Avatar */}
                    <div
                      className="profile_avatar"
                      data-aos="zoom-in-up"
                      data-aos-delay="400"
                    >
                      <img
                        src={author.authorImage || AuthorImageFallback}
                        alt={author.authorName}
                      />
                      <i className="fa fa-check"></i>

                      {/* Profile Name */}
                      <div
                        className="profile_name"
                        data-aos="fade-left"
                        data-aos-delay="500"
                      >
                        <h4>
                          {author.authorName}
                          <span className="profile_username">@{author.tag}</span>

                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>

                          <button
                            id="btn_copy"
                            title="Copy Text"
                            onClick={() => navigator.clipboard.writeText(author.address)}
                          >
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Follow Section */}
                  <div
                    className="profile_follow de-flex"
                    data-aos="fade-left"
                    data-aos-delay="600"
                  >
                    <div className="de-flex-col">
                      <div className="profile_follower">{author.followers} followers</div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author NFTs */}
              <div className="col-md-12" data-aos="fade-up" data-aos-delay="700">
                <div className="author-nft-grid">
                  {author.nftCollection?.map((nft) => (
                    <div key={nft.nftId} className="nft__item">
                      {/* Small round author icon in top-left */}
                      <div className="author_icon_top_left">
                        <img
                          src={author.authorImage || AuthorImageFallback}
                          alt={author.authorName}
                        />
                      </div>

                      {/* NFT Image */}
                      <Link to={`/new-item-details/${nft.nftId}`}>
                        <img
                          src={nft.nftImage}
                          alt={nft.title}
                          onError={(e) => (e.currentTarget.src = AuthorBannerFallback)}
                        />
                      </Link>

                      {/* NFT Info */}
                      <div className="nft__item_info">
                        <h6>{nft.title}</h6>
                        <div className="nft__item_price">{nft.price || "N/A"} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{nft.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;












