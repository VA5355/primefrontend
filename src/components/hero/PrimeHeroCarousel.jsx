import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCreative,
  Navigation,
  Pagination,
} from "swiper/modules";

import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock3,
  ShoppingBag,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

import "./PrimeHeroCarousel.css";
import {
 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";



const fallbackSlides = [
  {
    id: "prime-delivery",
    eyebrow: "PRIME METRO DELIVERY",
    title: "Your favourite products, delivered faster.",
    description:
      "A smarter local delivery experience built around speed, reliability and convenience.",
    image: "/complete-services-banner-optimized.jpg",
    badge: "Fast & Reliable",
  },
  {
    id: "shop-smart",
    eyebrow: "SHOP SMART",
    title: "From your favourite store to your doorstep.",
    description:
      "Discover products, place your order and let Prime Metro handle the journey.",
    image: "/tech-solutions-banner-optimized-short.jpg",
    badge: "Easy Ordering",
  },
  {
    id: "local-delivery",
    eyebrow: "LOCAL DELIVERY",
    title: "Built for customers who value their time.",
    description:
      "Reliable delivery with a smoother experience from order to doorstep.",
    image: "/rog-50-series-banner-optimized-short.jpg",
    badge: "Customer First",
  },
];

export default function PrimeHeroCarousel({
  products = [],
  onOrderClick,
  onExploreClick,
}) {
  const slides =
    Array.isArray(products) && products.length > 0
      ? products.slice(0, 3).map((product, index) => ({
          id: String(product.id),
          eyebrow:
            index === 0
              ? "PRIME METRO DELIVERY"
              : String(product.category || "FEATURED").toUpperCase(),
          title: product.title,
          description:
            product.description ||
            "Discover great products with a smoother delivery experience.",
          image: product.image,
          badge:
            index === 0
              ? "Featured Product"
              : "Available for Delivery",
        }))
      : fallbackSlides;

  const handleOrderClick = (event, slide) => {
    if (onOrderClick) {
      event.preventDefault();
      onOrderClick(slide);
    }
  };

  const handleExploreClick = (event, slide) => {
    if (onExploreClick) {
      event.preventDefault();
      onExploreClick(slide);
    }
  };

  return (
    <section className="prime-hero-section">
      <div className="prime-hero-container">
        <Swiper
          modules={[
            Autoplay,
            EffectCreative,
            Navigation,
            Pagination,
          ]}
          loop={slides.length > 1}
          grabCursor={true}
          speed={850}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
           navigation={{
            prevEl: ".prime-custom-prev",
            nextEl: ".prime-custom-next",
          }} 
          pagination={{
            clickable: true,
          }}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: false,
              translate: ["-100%", 0, 0],
            },
            next: {
              shadow: false,
              translate: ["100%", 0, 0],
            },
          }}
          className="prime-metro-swiper"
        >
          {/* Custom Navigation Buttons */}
          <button className="prime-custom-prev swiper-button-prev " aria-label="Previous slide">
            <ChevronLeft size={22} color="#ea580c" />
          </button>
          <button className="prime-custom-next swiper-button-next " aria-label="Next slide">
            <ChevronRight size={22} color="#ea580c" />
          </button>
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <article className="prime-slide">
                <div className="prime-slide-glow prime-slide-glow-right" />
                <div className="prime-slide-glow prime-slide-glow-left" />

                <div className="prime-slide-grid">
                  {/* LEFT CONTENT */}
                  <div className="prime-slide-content">
                    {/* Badge */}
                    <div className="prime-slide-badge">
                      <Truck size={15} />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Eyebrow */}
                    <div className="prime-slide-eyebrow">
                      {slide.eyebrow}
                    </div>

                    {/* Title */}
                    <h2 className="prime-slide-title">{slide.title}</h2>

                    {/* Description */}
                    <p className="prime-slide-description">
                      {slide.description}
                    </p>

                    {/* Trust Indicators */}
                    <div className="prime-slide-trust">
                      <span className="prime-trust-item">
                        <Clock3 size={14} />
                        Fast
                      </span>
                      <span className="prime-trust-item">
                        <ShieldCheck size={14} />
                        Reliable
                      </span>
                      <span className="prime-trust-item">
                        <ShoppingBag size={14} />
                        Easy Ordering
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="prime-slide-actions">
                      <a
                        href="#"
                        className="prime-primary-button"
                        onClick={(event) => handleOrderClick(event, slide)}
                      >
                        Explore Products
                        <ArrowRight size={16} />
                      </a>

                      <a
                        href="#"
                        className="prime-secondary-button"
                        onClick={(event) => handleExploreClick(event, slide)}
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="prime-slide-image-wrapper">
                    <div className="prime-slide-image-overlay" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="prime-slide-image"
                    /> 
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
