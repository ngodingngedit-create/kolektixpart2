import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Art Jakarta 2026",
    dateRange: "14 Mei 2026 – 18 Mei 2026",
    location: "JCC Senayan, Jakarta",
    image: "/images/trending-3.png",
    trending: true,
    day: "14",
    month: "MEI",
    dayName: "KAM",
  },
  {
    id: 2,
    title: "Jakarta Music Festival 2026",
    dateRange: "14 Mei 2026 – 16 Mei 2026",
    location: "Jiexpo Kemayoran, Jakarta",
    image: "/images/trending-3.png",
    trending: true,
    day: "14",
    month: "MEI",
    dayName: "KAM",
  },
  {
    id: 3,
    title: "Indonesia Startup Summit 2026",
    dateRange: "14 Mei 2026 – 15 Mei 2026",
    location: "The Kasablanka Hall, Jakarta",
    image: "/images/trending-3.png",
    trending: true,
    day: "14",
    month: "MEI",
    dayName: "KAM",
  }
];

const TrendingEvent = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    className: "left-slider",
    centerMode: false,
    infinite: true,
    variableWidth: true,
    speed: 800,
    cssEase: "cubic-bezier(0.25, 1, 0.5, 1)",
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    dots: true,
    arrows: false,
    customPaging: (i: number) => (
      <div
        className={`mt-6 h-1.5 rounded-full transition-all duration-300 ${activeSlide === i ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
          }`}
      />
    ),
  };

  return (
    <div className="w-full py-10 md:py-14 px-10 overflow-hidden" style={{ backgroundColor: '#02255af5' }}>
      <div className="max-w-[1440px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-4 px-4 md:px-8 lg:pl-10 lg:pr-24">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-white">Event Trending</h2>
              <div className="bg-white/10 text-white p-1 rounded-full flex items-center justify-center">
                <Icon icon="lucide:trending-up" className="w-4 h-4" />
              </div>
            </div>
            <p className="text-sm text-blue-100/80 mt-1.5">Event populer yang sedang ramai dibicarakan</p>
          </div>
          <Link href="/events" className="flex items-center gap-2 text-white font-semibold text-sm hover:text-blue-200 transition-colors group">
            Lihat Semua
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Carousel Section */}
        <div className="w-full relative pb-1 pl-1 pr-4 md:pl-4 md:pr-8 lg:pl-4 lg:pr-24">
          <div className="w-full max-w-[100%] md:max-w-[936px] lg:max-w-[1332px] overflow-visible pl-3 md:pl-4 lg:pl-4">
            <Slider {...settings}>
              {MOCK_EVENTS.map((event, index) => {
                return (
                  <div key={event.id} className="event-slide outline-none px-2 lg:px-2">
                    <div className="flex flex-col md:flex-row gap-0 items-center md:items-stretch h-full w-full justify-start slide-inner-wrapper">

                      {/* Date Indicator wrapper (Beside the banner card) */}
                      <div className="flex md:flex-col items-center shrink-0 relative w-auto md:w-10 lg:w-12 mt-2 md:mt-0 z-20 mr-1 md:mr-2">
                        {/* Date Card */}
                        <div className="bg-white border rounded-[8px] pb-3 pt-0 text-center shadow-lg w-full flex flex-col items-center date-card overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
                          {/* Bookmark Ribbon for Rank */}
                          <div className="w-full bg-blue-800 text-white bookmark-shape flex items-center justify-center pt-2 pb-3.5 mb-1.5">
                            <span className="text-xs md:text-sm lg:text-base font-extrabold leading-none">{event.id}</span>
                          </div>
                          <div className="text-[8px] lg:text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-1">{event.month}</div>
                          <div className="text-sm lg:text-base font-black text-gray-800 leading-none my-0.5 md:my-1">{event.day}</div>
                          <div className="text-[8px] lg:text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">{event.dayName}</div>
                        </div>
                      </div>

                      {/* Banner Card */}
                      <div className="relative group cursor-pointer rounded-[8px] shadow-md hover:shadow-lg banner-card shrink-0 z-10">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[8px]"
                        />

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none rounded-[8px]"></div>

                        {/* Trending Badge */}
                        {event.trending && (
                          <div className="absolute bg-blue-600 text-white rounded-full flex items-center shadow-sm badge-trending">
                            <Icon icon="lucide:flame" className="text-white badge-icon shrink-0" />
                            <span className="font-bold text-white tracking-wide uppercase badge-text">Trending</span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute left-0 w-full text-white bottom-0 card-content">
                          <h3 className="font-black line-clamp-2 leading-tight event-title">
                            {event.title}
                          </h3>

                          <div className="flex text-gray-200 font-medium event-meta">
                            <div className="flex items-center gap-1.5">
                              <Icon icon="lucide:calendar" className="shrink-0 meta-icon" />
                              <span>{event.dateRange}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Icon icon="lucide:map-pin" className="shrink-0 meta-icon" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="absolute rounded-full border border-white/40 bg-transparent flex items-center justify-center text-white hover:bg-white/10 action-btn shadow-md">
                          <Icon icon="lucide:arrow-right" className="arrow-icon" />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        /* 1. Atur overflow dengan benar agar card yang membesar tidak ter-clip */
        .left-slider .slick-list {
          overflow: visible !important;
        }

        .left-slider .slick-track {
          display: flex !important;
          align-items: center !important;
          overflow: visible !important;
        }
        
        .left-slider .slick-slide {
          opacity: 0.6;
          filter: grayscale(20%);
          width: 85vw !important; /* Default for mobile */
          will-change: width, opacity;
          z-index: 1;
          /* Optimalkan transition agar sinkron dengan translate carousel */
          transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .left-slider .slick-slide.slick-current {
          opacity: 1;
          filter: grayscale(0%);
          /* Tambahkan z-index lebih tinggi pada active card */
          z-index: 50 !important;
        }

        /* 2. Gunakan transform: scale() untuk efek membesar dengan halus */
        .banner-card {
          aspect-ratio: 16/9;
          height: auto;
          width: 100%;
          transform: scale(0.96);
          transform-origin: left center;
          transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.8s ease !important;
          will-change: width, height, transform, opacity;
          max-width: none !important;
          box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.45), 0 8px 12px -6px rgba(0, 0, 0, 0.3);
        }

        /* Card active langsung tampil normal tanpa kepotong */
        .left-slider .slick-slide.slick-current .banner-card {
          transform: scale(1);
          box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.65), 0 15px 20px -5px rgba(0, 0, 0, 0.45);
        }

        /* Bookmark shape for trending rank with drop-shadow for clipped elements */
        .bookmark-shape {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
          filter: drop-shadow(0 4px 5px rgba(0, 0, 0, 0.25));
        }
        
        @media (min-width: 768px) {
           .left-slider .slick-slide {
              width: 220px !important;
           }
           .left-slider .slick-slide.slick-current {
              width: 480px !important;
           }
           .banner-card {
              aspect-ratio: auto;
              width: 160px !important;
              height: 180px !important;
           }
           .left-slider .slick-slide.slick-current .banner-card {
              width: 420px !important;
              height: 220px !important;
           }
        }
        
        @media (min-width: 1024px) {
           .left-slider .slick-slide {
              width: 306px !important;
           }
           .left-slider .slick-slide.slick-current {
              width: 720px !important;
           }

           .banner-card {
              height: 220px !important;
              width: 236px !important;
              flex: none;
              max-width: 100%;
           }
           .left-slider .slick-slide.slick-current .banner-card {
              width: 640px !important;
              height: 260px !important;
           }
        }

        /* ------------------ Dynamic styling for elements based on active current slide ------------------ */

        .action-btn {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          transition: opacity 0.4s ease, transform 0.4s ease !important;
        }
        .action-btn .arrow-icon {
          width: 16px;
          height: 16px;
        }
        .left-slider .slick-slide.slick-current .action-btn {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
          transition-delay: 200ms !important;
        }
        @media (min-width: 768px) {
          .action-btn {
            bottom: 16px;
            right: 16px;
            width: 36px;
            height: 36px;
          }
          .action-btn .arrow-icon {
            width: 18px;
            height: 18px;
          }
        }
        @media (min-width: 1024px) {
          .action-btn {
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
          }
          .action-btn .arrow-icon {
            width: 24px;
            height: 24px;
          }
        }

        .card-content {
          padding: 12px !important;
        }
        .left-slider .slick-slide.slick-current .card-content {
          padding: 20px lg:24px !important;
        }

        .event-title {
          font-size: 10px !important;
          font-weight: 600 !important;
          color: #f3f4f6 !important;
          margin-bottom: 4px !important;
          transition: font-size 0.4s ease !important;
        }
        @media (min-width: 1024px) {
          .event-title {
            font-size: 11px !important;
          }
        }
        .left-slider .slick-slide.slick-current .event-title {
          font-size: 18px !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          margin-bottom: 8px !important;
          transition: font-size 0.8s cubic-bezier(0.25, 1, 0.5, 1), color 0.8s ease, margin-bottom 0.8s ease !important;
          transition-delay: 150ms !important;
        }
        @media (min-width: 768px) {
          .left-slider .slick-slide.slick-current .event-title {
            font-size: 20px !important;
          }
        }
        @media (min-width: 1024px) {
          .left-slider .slick-slide.slick-current .event-title {
            font-size: 24px !important;
          }
        }

        .event-meta {
          flex-direction: column !important;
          gap: 4px !important;
          font-size: 8px !important;
          color: #d1d5db !important;
          transition: gap 0.4s ease, font-size 0.4s ease !important;
        }
        .event-meta .meta-icon {
          width: 12px;
          height: 12px;
        }
        @media (min-width: 1024px) {
          .event-meta {
            font-size: 9px !important;
          }
        }
        .left-slider .slick-slide.slick-current .event-meta {
          flex-direction: row !important;
          gap: 16px !important;
          font-size: 10px !important;
          color: #e5e7eb !important;
          transition: gap 0.8s ease, font-size 0.8s ease !important;
          transition-delay: 150ms !important;
        }
        .left-slider .slick-slide.slick-current .event-meta .meta-icon {
          width: 16px;
          height: 16px;
        }
        @media (min-width: 768px) {
          .left-slider .slick-slide.slick-current .event-meta {
            gap: 20px !important;
          }
        }
        @media (min-width: 1024px) {
          .left-slider .slick-slide.slick-current .event-meta {
            gap: 24px !important;
            font-size: 12px !important;
          }
        }

        .badge-trending {
          top: 10px !important;
          left: 10px !important;
          padding: 3px 8px !important;
          gap: 4px !important;
          transition: all 0.4s ease !important;
        }
        .badge-trending .badge-icon {
          width: 12px;
          height: 12px;
        }
        .badge-trending .badge-text {
          font-size: 7px;
        }
        .left-slider .slick-slide.slick-current .badge-trending {
          top: 12px !important;
          left: 12px !important;
          padding: 4px 10px !important;
          gap: 6px !important;
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
          transition-delay: 150ms !important;
        }
        @media (min-width: 768px) {
          .left-slider .slick-slide.slick-current .badge-trending {
            top: 14px !important;
            left: 14px !important;
            padding: 5px 11px !important;
          }
        }
        @media (min-width: 1024px) {
          .left-slider .slick-slide.slick-current .badge-trending {
            top: 16px !important;
            left: 16px !important;
            padding: 6px 12px !important;
          }
          .left-slider .slick-slide.slick-current .badge-trending .badge-icon {
            width: 16px;
            height: 16px;
          }
          .left-slider .slick-slide.slick-current .badge-trending .badge-text {
            font-size: 10px;
          }
        }

        .date-card {
          border: 1px solid #cbd5e1 !important;
        }

        .left-slider .slick-dots {
          bottom: -30px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          list-style: none;
        }
        .left-slider .slick-dots li {
          width: auto;
          height: auto;
          margin: 0 4px;
        }
      `}} />
    </div>
  );
};

export default TrendingEvent;
