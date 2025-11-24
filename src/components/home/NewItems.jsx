import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewItemsSkeleton = () => {
  return (
    <div className="d-flex gap-3 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "250px",
            height: "350px",
            backgroundColor: "#eee",
            borderRadius: "12px",
          }}
        ></div>
      ))}
    </div>
  );
};

// ---------------------------
// FORMAT COUNTDOWN DISPLAY
// ---------------------------
const formatCountdown = (ms) => {
  if (ms <= 0) return "Expired";

  const totalSeconds = Math.floor(ms / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
};

const NewItemsCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({}); // Store countdown per item

  const paginationRef = useRef(null);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(res.data);

        // Initialize timers
        const initial = {};
        res.data.forEach((item) => {
          if (item.expiryDate) {
            initial[item.nftId] =
              new Date(item.expiryDate).getTime() - Date.now();
          }
        });

        setTimers(initial);
      } catch (err) {
        console.error("Failed to fetch new items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  // ---------------------------
  // Countdown interval (updates every second)
  // ---------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = {};
        Object.keys(prev).forEach((id) => {
          updated[id] = prev[id] - 1000;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <NewItemsSkeleton />;

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{
              el: paginationRef.current,
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className}"></span>`,
            }}
            autoplay={{ delay: 4000 }}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            onBeforeInit={(swiper) => {
              swiper.params.pagination.el = paginationRef.current;
            }}
          >
            {items.map((item) => {
              const timeLeft = timers[item.nftId] ?? null;

              return (
                <SwiperSlide key={item.nftId}>
                  <div className="nft__item" data-aos="fade-up" data-aos-duration="600">
                    
                    {/* Author */}
                    <div className="author_list_pp">
                      <Link to={`/author/${item.authorId}`}>
                        <img
                          className="lazy"
                          src={item.authorImage}
                          alt={item.authorName}
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={`/author/${item.authorId}`}>
                        {item.authorName}
                      </Link>
                    </div>

                    {/* LIVE COUNTDOWN */}
                    {item.expiryDate && (
                      <div className="de_countdown">
                        {formatCountdown(timeLeft)}
                      </div>
                    )}

                    {/* NFT Thumbnail */}
                    <div className="nft__item_wrap">
                      <Link to={`/new-item-details/${item.nftId}`}>
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt={item.title}
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-nft.png")
                          }
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="nft__item_info">
                      <Link to={`/new-item-details/${item.nftId}`}>
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Pagination container */}
          {/* <div className="external-swiper-pagination text-center mt-4"></div> */}
        </div>
      </div>
    </section>
  );
};

export default NewItemsCarousel;



