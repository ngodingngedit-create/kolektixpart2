import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Jakarta Music Festival 2026",
    dateRange: "14 Mei 2026 – 16 Mei 2026",
    location: "Jiexpo Kemayoran, Jakarta",
    image: "/images/trending-1.png",
    trending: true,
    day: "14",
    month: "MEI",
    dayName: "KAM",
  },
  {
    id: 2,
    title: "Indonesia Stand Up Festival",
    dateRange: "14 Mei 2026",
    location: "The Kasablanka Hall, Jakarta",
    image: "/images/trending-2.png",
    trending: false,
    day: "14",
    month: "MEI",
    dayName: "KAM",
  },
  {
    id: 3,
    title: "Art Jakarta 2026",
    dateRange: "14 Mei 2026 – 18 Mei 2026",
    location: "JCC Senayan, Jakarta",
    image: "/images/trending-3.png",
    trending: false,
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
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    dots: true,
    arrows: false,
    customPaging: (i: number) => (
      <div
        className={`mt-6 h-2.5 rounded-full transition-all duration-300 ${activeSlide === i ? "w-8 bg-blue-600" : "w-3 bg-gray-300 hover:bg-gray-400"
          }`}
      />
    ),
  };

  return (
    <div className="w-full bg-slate-50 py-12 px-0 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-4 px-4 md:px-8 lg:px-24">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-gray-900">Event Trending</h2>
              <div className="bg-blue-100 text-blue-600 p-1 rounded-full flex items-center justify-center">
                <Icon icon="lucide:trending-up" className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-500 mt-2">Event populer yang sedang ramai dibicarakan</p>
          </div>
          <Link href="/events" className="flex items-center gap-2 text-blue-700 font-semibold text-sm hover:text-blue-800 transition-colors group">
            Lihat Semua
            <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors">
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Carousel Section */}
        <div className="w-full relative pb-10 lg:pl-24">
          <Slider {...settings}>
            {MOCK_EVENTS.map((event, index) => {
              // We rely heavily on .slick-current in CSS for scaling
              return (
                <div key={event.id} className="event-slide outline-none px-2 lg:px-4">
                  <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-center md:items-stretch h-full w-full justify-center">

                    {/* Date Indicator */}
                    <div className="flex md:flex-col items-center shrink-0 relative w-auto md:w-14 lg:w-16 mt-2 md:mt-0">
                      <div className="bg-white border border-gray-300 rounded-xl p-2 text-center shadow-sm z-10 w-full flex md:flex-col gap-1 md:gap-0.5 items-center date-card">
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{event.month}</div>
                        <div className="text-xl lg:text-2xl font-black text-gray-800 leading-none my-0.5">{event.day}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{event.dayName}</div>
                      </div>
                      {/* Dashed line */}
                      <div className="hidden md:block w-px border-l-2 border-dashed border-gray-300 absolute top-16 bottom-[-30px] left-1/2 transform -translate-x-1/2 dashed-line"></div>
                    </div>

                    {/* Banner Card */}
                    <div className="relative overflow-hidden group cursor-pointer flex-1 w-full rounded-2xl shadow-sm hover:shadow-md transition-shadow banner-card">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                      {/* Trending Badge */}
                      {event.trending && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm badge-trending">
                          <Icon icon="lucide:flame" className="text-blue-600 w-4 h-4" />
                          <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">Trending</span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="absolute left-0 w-full text-white bottom-0 p-5 lg:p-6 card-content">
                        <h3 className="text-xl lg:text-2xl font-bold mb-3 line-clamp-2 leading-tight">
                          {event.title}
                        </h3>

                        <div className="flex flex-col gap-2 text-sm text-gray-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:calendar" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                            <span>{event.dateRange}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon icon="lucide:map-pin" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="absolute bottom-5 right-5 lg:bottom-6 lg:right-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/40 flex items-center justify-center text-white backdrop-blur-sm hover:bg-white/20 transition-all action-btn">
                        <Icon icon="lucide:arrow-right" className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

      </div>

      {/* Global styles for slick-carousel dynamic scaling effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .left-slider .slick-track {
          display: flex !important;
          align-items: center !important;
        }
        
        .left-slider .slick-slide {
          opacity: 0.6;
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          filter: grayscale(20%);
          width: 85vw !important; /* Default for mobile */
        }

        .left-slider .slick-slide.slick-current {
          opacity: 1;
          filter: grayscale(0%);
          z-index: 10;
        }

        /* Adjust heights for banner with smooth scale-transition */
        .banner-card {
          aspect-ratio: 16/9;
          height: auto;
          width: 100%;
          transform: scale(0.96);
          transform-origin: left center;
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .left-slider .slick-slide.slick-current .banner-card {
          transform: scale(1);
        }
        
        @media (min-width: 768px) {
           .left-slider .slick-slide {
              width: 380px !important;
           }
           .left-slider .slick-slide.slick-current {
              width: 500px !important;
           }
           .banner-card {
              aspect-ratio: auto;
              height: 200px;
           }
           .left-slider .slick-slide.slick-current .banner-card {
              height: 260px;
           }
        }
        
        @media (min-width: 1024px) {
           .left-slider .slick-slide {
              /* Inactive width: 280px (banner) + 64px (date) + 24px (gap) + 16px (padding) = 384px */
              width: 384px !important;
           }
           .left-slider .slick-slide.slick-current {
              /* Active width: 1092px (banner) + 64px (date) + 24px (gap) + 16px (padding) = 1092px */
              width: 1092x !important; 
           }

           .banner-card {
              height: 180px;
              width: 280px !important;
              flex: none;
              max-width: 100%;
           }
           .left-slider .slick-slide.slick-current .banner-card {
              width: 1100px !important;
              height: 190px !important;
           }
        }

        /* Fix slick dots layout */
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

