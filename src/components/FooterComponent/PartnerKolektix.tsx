import React from 'react';
import { Title, Text, Button, Avatar, Card } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from './index';
import { useRef, useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { motion, useAnimationControls } from 'framer-motion';

const DashboardMockup = ({ title = "Dashboard", stats = [], events = [] }: any) => (
  <div className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[600px] aspect-[16/10] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[rgb(227,227,227)] overflow-hidden flex animate-in fade-in slide-in-from-right duration-500">
    {/* Sidebar */}
    <div className="w-[18%] bg-[#0A1D36] p-1.5 md:p-4 flex flex-col gap-2 md:gap-6 h-full">
      <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
        <div className="w-3 h-3 md:w-6 md:h-6 bg-blue-500 rounded flex items-center justify-center text-[5px] md:text-[10px] text-white font-bold italic">k</div>
        <span className="text-white text-[5px] md:text-[10px] font-bold">kolektix</span>
      </div>
      <div className="space-y-1.5 md:space-y-3">
        {[
          { icon: 'solar:home-2-bold', label: 'Overview', active: true },
          { icon: 'solar:calendar-bold', label: 'Events' },
          { icon: 'solar:ticket-bold', label: 'Orders' },
          { icon: 'solar:users-group-rounded-bold', label: 'Attendees' },
          { icon: 'solar:chart-bold', label: 'Analytics' },
          { icon: 'solar:wallet-bold', label: 'Payouts' },
          { icon: 'solar:settings-bold', label: 'Settings' },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-1 md:gap-2 px-1 py-0.5 md:px-2 md:py-1.5 rounded transition-colors cursor-pointer ${item.active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}>
            <Icon icon={item.icon} className="w-1.5 h-1.5 md:w-2.5 md:h-2.5" />
            <span className="text-[5px] md:text-[8px] font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 bg-[#F8FAFF] p-2 md:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-2 md:mb-6">
        <h4 className="text-[8px] md:text-sm font-bold text-[#0A1D36] leading-tight">{title}</h4>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-6 md:h-6 bg-white rounded-full border border-gray-100 flex items-center justify-center">
            <Icon icon="solar:bell-bold" className="text-gray-400 w-1.5 h-1.5 md:w-2.5 md:h-2.5" />
          </div>
          <Avatar size="xs" md-size="sm" radius="xl" className="w-3 h-3 md:w-6 md:h-6" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 mb-2 md:mb-6">
        {(stats.length > 0 ? stats : [
          { label: 'Total Events', val: '128', change: '+12%' },
          { label: 'Total Tickets', val: '24.560', change: '+18%' },
          { label: 'Total Revenue', val: 'Rp 256.800.000', change: '+23%' },
        ]).map((stat: any, i: number) => (
          <div key={i} className="bg-white p-1.5 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-[rgb(227,227,227)] flex flex-col gap-0.5 md:gap-1">
            <span className="text-[5px] md:text-[8px] text-gray-400 font-medium truncate">{stat.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-[7px] md:text-sm font-bold text-[#0A1D36]">{stat.val}</span>
              <span className="text-[4px] md:text-[7px] text-green-500 font-bold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent */}
      <div className="grid grid-cols-12 gap-2 md:gap-4">
        <div className="col-span-8 bg-white p-1.5 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-[rgb(227,227,227)]">
          <div className="flex justify-between items-center mb-1 md:mb-4">
            <span className="text-[6px] md:text-[9px] font-bold text-[#0A1D36]">Penjualan Tiket</span>
            <div className="px-1 py-0.5 bg-gray-50 border border-[rgb(227,227,227)] rounded-[2px] text-[4px] md:text-[7px] text-gray-400 flex items-center gap-0.5">
              7 Hari <Icon icon="solar:alt-arrow-down-bold" className="w-1 md:w-1.5 h-1 md:h-1.5" />
            </div>
          </div>
          <div className="h-12 md:h-28 flex items-end gap-1.5 relative px-2">
            {/* Simple Line Chart Visualization */}
            <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full p-1 md:p-2">
              <path d="M0,80 Q50,20 100,50 T200,30 T300,60 T400,20" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <path d="M0,80 Q50,20 100,50 T200,30 T300,60 T400,20 V100 H0 Z" fill="url(#grad)" opacity="0.1" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="col-span-4 bg-white p-1.5 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-[rgb(227,227,227)] flex flex-col">
          <span className="text-[6px] md:text-[9px] font-bold text-[#0A1D36] mb-1 md:mb-4">Events</span>
          <div className="space-y-1 md:space-y-3 flex-1">
            {(events.length > 0 ? events : [
              { name: 'Indie Fest', date: '24 Mei', img: 'solar:music-notes-bold' },
              { name: 'Creative Talk', date: '30 Mei', img: 'solar:chat-round-bold' },
            ]).map((ev: any, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-3 h-3 md:w-6 md:h-6 rounded-[2px] bg-blue-50 flex items-center justify-center text-blue-500">
                  <Icon icon={ev.img} className="w-1.5 md:w-2.5 h-1.5 md:h-2.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[4px] md:text-[7px] font-bold text-[#0A1D36] leading-none truncate">{ev.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const REVIEWS = [
  {
    name: "Andi Pratama",
    role: "Founder, Creative Event",
    quote: "Kolektix sangat membantu kami mengelola event dengan lebih profesional. Dashboard-nya lengkap dan tim support-nya responsif!",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    rating: 5
  },
  {
    name: "Sarah Wijaya",
    role: "CEO, Music Horizon",
    quote: "Sistem ticketing yang sangat handal. Penjualan tiket kami naik 40% sejak pindah ke Kolektix. Proses payout-nya juga sangat cepat.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop",
    rating: 5
  },
  {
    name: "Budi Santoso",
    role: "Event Director, Tech Summit",
    quote: "Dashboard analitiknya sangat membantu kami memahami audiens secara real-time. Support timnya juara, selalu siap sedia 24/7!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    rating: 4
  },
  {
    name: "Linda Kusuma",
    role: "Project Manager, Art & Culture",
    quote: "Kolektix memberikan kemudahan yang luar biasa dalam manajemen gate. Proses scanning tiket sangat cepat dan tidak ada kendala sama sekali.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2574&auto=format&fit=crop",
    rating: 5
  }
];

const HERO_SLIDES = [
  {
    title: "Dashboard Overview",
    stats: [
      { label: 'Total Events', val: '128', change: '+12%' },
      { label: 'Total Tickets', val: '24.560', change: '+18%' },
      { label: 'Total Revenue', val: 'Rp 256.800.000', change: '+23%' },
    ],
    events: [
      { name: 'Jakarta Music Fest', date: '24 Mei 2024', img: 'solar:music-notes-bold' },
      { name: 'Creative Talk 2024', date: '30 Mei 2024', img: 'solar:chat-round-bold' },
      { name: 'Art & Culture Expo', date: '5 Jun 2024', img: 'solar:paint-brush-bold' },
    ]
  },
  {
    title: "Analytics Insight",
    stats: [
      { label: 'Active Visitors', val: '1.240', change: '+45%' },
      { label: 'Conversion Rate', val: '8.4%', change: '+5%' },
      { label: 'Unique Buyers', val: '12.800', change: '+15%' },
    ],
    events: [
      { name: 'Tech Summit 2024', date: '12 Jun 2024', img: 'solar:code-bold' },
      { name: 'Food Festival', date: '18 Jun 2024', img: 'solar:cup-bold' },
      { name: 'Startup Pitch', date: '22 Jun 2024', img: 'solar:lightbulb-bold' },
    ]
  },
  {
    title: "Finance & Payouts",
    stats: [
      { label: 'Pending Payout', val: 'Rp 45.000.000', change: 'Check' },
      { label: 'Total Settled', val: 'Rp 1.2B', change: '+30%' },
      { label: 'Platform Fee', val: 'Rp 12.500.000', change: '-2%' },
    ],
    events: [
      { name: 'Indie Concert', date: '28 Jun 2024', img: 'solar:music-notes-bold-duotone' },
      { name: 'E-Sports Tourney', date: '02 Jul 2024', img: 'solar:gamepad-bold' },
      { name: 'Charity Run', date: '10 Jul 2024', img: 'solar:running-bold' },
    ]
  }
];

const PartnerKolektix = () => {
  const [emblaHero, setEmblaHero] = useState<any>(null);
  const [isHoveredHero, setIsHoveredHero] = useState(false);
  const controls = useAnimationControls();
  const [isHoveredMarquee, setIsHoveredMarquee] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowSubNav(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['kenapa', 'langkah', 'partner', 'layanan', 'keuntungan'];
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaHero && !isHoveredHero) {
        emblaHero.scrollNext();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaHero, isHoveredHero]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for main header + sub-nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Framer Motion Marquee Logic
  useEffect(() => {
    if (!isHoveredMarquee) {
      controls.start({
        x: '-50%',
        transition: {
          duration: 15, // Even faster duration
          ease: 'linear',
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isHoveredMarquee, controls]);

  return (
    <div className="bg-white min-h-screen font-inter text-[#0A1D36] overflow-x-hidden">
      <Head>
        <title>Cara Menjadi Partner Kolektix</title>
      </Head>


      {/* Sub-Navbar */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-white shadow-lg shadow-blue-900/5 hidden md:block transition-all duration-500 ${showSubNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="max-w-[1210px] mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-10">
            {[
              { label: 'Kenapa Kolektix', href: '#kenapa' },
              { label: 'Cara Daftar', href: '#langkah' },
              { label: 'Partner Kami', href: '#partner' },
              { label: 'Layanan', href: '#layanan' },
              { label: 'Keuntungan', href: '#keuntungan' },
            ].map((link, i) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a 
                  key={i} 
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href.replace('#', ''))}
                  className={`relative text-[13px] font-bold transition-all duration-300 py-1 ${isActive ? 'text-[#1C41D6]' : 'text-gray-500 hover:text-[#1C41D6]'} cursor-pointer group`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#1C41D6] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-4 md:pb-6 px-1 overflow-hidden">
        <div className="max-w-[1210px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="flex flex-col animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-[#1C41D6] text-[11px] font-bold uppercase tracking-[0.2em] mb-6 w-fit">
              Kemitraan Strategis
            </div>
            <div className="text-3xl md:text-5xl lg:text-[40px] font-black leading-[1.1] mb-10 tracking-tight">
              Kembangkan Event Anda <br />
              Bersama <span className="text-[#1C41D6]">Kolektix</span>
            </div>
            <div className="text-lg md:text-xl text-gray-500 font-medium mb-8 max-w-xl leading-relaxed">
              Bergabunglah dengan jaringan mitra global kami dan manfaatkan teknologi ticketing tercanggih untuk menghadirkan pengalaman tak terlupakan bagi pelanggan Anda.
            </div>

            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
              {[
                { icon: 'solar:shield-check-bold-duotone', title: 'Aman & Terpercaya', desc: 'Sistem keamanan berstandar tinggi' },
                { icon: 'solar:bolt-bold-duotone', title: 'Cepat & Efisien', desc: 'Proses instan, hemat waktu & tenaga' },
                { icon: 'solar:users-group-rounded-bold-duotone', title: 'Dukungan Penuh', desc: 'Tim profesional siap membantu Anda' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon icon={item.icon} className="text-blue-600 w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-[13px] font-bold leading-tight mb-0.5 whitespace-nowrap">{item.title}</h5>
                    <p className="text-[11px] text-gray-400 font-medium leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Mockup with Carousel */}
          <div className="relative flex justify-center lg:justify-end w-full">
            <Carousel
              withControls={false}
              withIndicators={false}
              loop
              getEmblaApi={setEmblaHero}
              className="w-full"
              onMouseEnter={() => setIsHoveredHero(true)}
              onMouseLeave={() => setIsHoveredHero(false)}
              styles={{
                root: {
                  transition: 'transform 2000ms ease-in-out'
                }
              }}
            >
              {HERO_SLIDES.map((slide, i) => (
                <Carousel.Slide key={i} className="flex justify-center lg:justify-end">
                  <DashboardMockup title={slide.title} stats={slide.stats} events={slide.events} />
                </Carousel.Slide>
              ))}
            </Carousel>

            {/* Floating Steps Card */}
            <div className="relative md:absolute mt-8 md:mt-0 md:-bottom-10 mx-auto md:mx-0 md:right-10 w-full max-w-[280px] md:max-w-[340px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 border border-[rgb(227,227,227)] animate-in fade-in zoom-in duration-700 delay-300">
              <h5 className="text-[10px] md:text-[12px] font-black mb-4">Langkah Mudah</h5>
              <div className="flex items-center justify-between relative">
                {[
                  { icon: 'solar:add-circle-bold-duotone', label: 'Buat Event' },
                  { icon: 'solar:ticket-sale-bold-duotone', label: 'Jual Tiket' },
                  { icon: 'solar:chart-square-bold-duotone', label: 'Pantau & Kelola' },
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon icon={step.icon} className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500">{step.label}</span>
                    </div>
                    {i < 2 && <Icon icon="solar:arrow-right-bold" className="text-gray-200 w-3 h-3" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kolektix Section */}
      <section id="kenapa" className="pt-24 md:pt-10 pb-16 bg-white scroll-mt-32">
        <div className="max-w-[1210px] mx-auto px-1">
          <div className="text-center text-2xl md:text-3xl font-black mb-[60px]">Kenapa Harus Kolektix?</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'solar:rocket-bold-duotone', title: 'Penjualan Cepat & Mudah', desc: 'Buat event dan mulai jual tiket dalam hitungan menit.' },
              { icon: 'solar:chart-bold-duotone', title: 'Dashboard Analitik Lengkap', desc: 'Pantau performa event Anda dengan data real-time.' },
              { icon: 'solar:card-bold-duotone', title: 'Sistem Pembayaran Lengkap', desc: 'Dukung berbagai metode bayar aman dan terpercaya.' },
              { icon: 'solar:megaphone-bold-duotone', title: 'Tools Promosi Event', desc: 'Tingkatkan jangkauan event dengan tools promosi kami.' },
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-white border border-[rgb(227,227,227)] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 group flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon icon={card.icon} className="text-blue-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{card.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[220px]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="langkah" className="py-12 bg-[#F8FAFF] scroll-mt-32">
        <div className="max-w-[1300px] mx-auto px-1">
          <div className="text-center text-2xl md:text-3xl font-black mb-[80px]">Cara Menjadi Partner</div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-8 lg:pl-24">
            {[
              { num: '01', icon: 'solar:user-plus-bold-duotone', title: 'Daftar sebagai Partner', desc: 'Isi data diri dan verifikasi akun Anda dengan mudah.' },
              { num: '02', icon: 'solar:calendar-add-bold-duotone', title: 'Buat & Kelola Event', desc: 'Buat event Anda, atur detail, dan kelola tiket dengan praktis.' },
              { num: '03', icon: 'solar:ticket-bold-duotone', title: 'Mulai Jual Tiket', desc: 'Publikasikan event dan mulai jual tiket untuk audiens Anda.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col lg:flex-row items-center flex-1 w-full max-w-sm lg:max-w-none">
                <div className="flex flex-col items-center text-center px-6 gap-4">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl md:text-5xl font-black text-blue-100 leading-none">{step.num}</span>
                    <div className="w-14 h-14 rounded-full bg-blue-50 border border-[rgb(227,227,227)] flex items-center justify-center">
                      <Icon icon={step.icon} className="text-blue-600 w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[220px]">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:flex flex-1 items-center justify-center px-4">
                    <div className="h-[2px] w-full border-t-2 border-dashed border-blue-200 relative">
                      <Icon icon="solar:alt-arrow-right-bold" className="absolute top-1/2 -right-2 -translate-y-1/2 text-blue-200 w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section id="partner" className="py-12 bg-white scroll-mt-32">
        <div className="max-w-[1210px] mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16 px-4">
            <div className="text-[#1C41D6] text-xs font-black uppercase tracking-[0.2em] mb-4">Partner Terpercaya</div>
            <div className="text-2xl md:text-3xl font-black mb-4 max-w-3xl leading-tight">Dipercaya oleh Ribuan Partner di Seluruh Indonesia</div>
            <p className="text-gray-500 font-medium max-w-2xl text-sm md:text-base">
              Kolektix telah membantu berbagai jenis event untuk tumbuh dan berkembang melalui teknologi ticketing yang inovatif.
            </p>
          </div>

          <div className="mb-20 flex flex-wrap justify-center items-center -space-x-2 md:-space-x-4 gap-y-8 px-4">
            {[
              { src: '/partner/JUS.png', alt: 'JUS' },
              { src: '/partner/luviland.png', alt: 'Luviland' },
              { src: '/partner/silaturahmi.png', alt: 'Silaturahmi' },
              { src: '/partner/soundwavee.png', alt: 'Soundwavee' },
            ].map((logo, i) => (
              <div key={i} className="relative w-40 md:w-72 h-20 md:h-36 hover:scale-110 transition-transform duration-500">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { val: '50.000+', label: 'Partner Aktif', icon: 'solar:users-group-rounded-bold-duotone', desc: 'EO & Promotor yang telah mempercayakan event mereka kepada Kolektix.' },
              { val: '2.5M+', label: 'Tiket Terjual', icon: 'solar:ticket-bold-duotone', desc: 'Total tiket yang telah didistribusikan secara aman melalui sistem kami.' },
              { val: '25.000+', label: 'Event Sukses', icon: 'solar:calendar-check-bold-duotone', desc: 'Jumlah event yang telah terlaksana dengan sukses bersama tim kami.' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col gap-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon icon={stat.icon} className="text-blue-600 w-4 h-4" />
                  </div>
                  <div className="text-lg font-black">{stat.label}</div>
                </div>

                <div className="text-sm text-gray-400 font-medium leading-relaxed min-h-[60px]">
                  {stat.desc}
                </div>

                <div className="pt-6 border-t border-[rgb(227,227,227)]">
                  <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Total Capaian</div>
                  <div className="text-2xl md:text-3xl font-black text-[#0A1D36]">{stat.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div 
            className="w-full overflow-hidden py-10 relative cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsHoveredMarquee(true)}
            onMouseLeave={() => setIsHoveredMarquee(false)}
          >
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block" />
            
            <motion.div 
              className="flex gap-4 md:gap-8 w-fit"
              animate={controls}
              drag="x"
              dragConstraints={{ left: -2000, right: 0 }}
              onDragStart={() => setIsHoveredMarquee(true)}
              onDragEnd={() => setIsHoveredMarquee(false)}
            >
              {/* Duplicate reviews for seamless loop */}
              {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
                <div key={i} className="bg-white rounded-[24px] p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.05)] flex flex-col w-[280px] md:w-[350px] shrink-0 min-h-[260px] md:min-h-[280px] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-400 group relative">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <Avatar
                      src={review.avatar}
                      size="md"
                      radius="xl"
                      className="border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                    />
                    <div className="flex flex-col">
                      <div className="text-[13px] md:text-[15px] font-black text-[#0A1D36] leading-tight group-hover:text-[#1C41D6] transition-colors">{review.name}</div>
                      <div className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{review.role}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon="solar:star-bold"
                            className={`w-2 md:w-3 h-2 md:h-3 ${i < review.rating ? 'text-[#FFD700]' : 'text-gray-100'}`}
                          />
                      ))}
                    </div>
                  </div>
                  <div className="text-[13px] md:text-[15px] font-medium leading-relaxed text-gray-500 flex-1">
                    &quot;{review.quote}&quot;
                  </div>
                  <div className="absolute top-6 md:top-8 right-6 md:right-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <Icon icon="solar:quote-bold" className="w-6 md:w-10 h-6 md:h-10" />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
          </div>

          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="md"
              radius="xl"
              leftSection={<Icon icon="solar:pen-new-square-bold" className="w-3 h-3" />}
              className="border-[#1C41D6] text-[#1C41D6] hover:bg-[#1C41D6] hover:text-white transition-all font-bold"
            >
              Berikan Review
            </Button>
          </div>

        </div>
      </section>

      {/* Additional Services Section */}
      <section id="layanan" className="py-12 bg-[#F8FAFF] scroll-mt-32">
        <div className="max-w-[1210px] mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="text-1xl md:text-3xl font-black mb-6 max-w-3xl leading-tight">Tingkatkan Jangkauan & Penjualan Event Anda</div>
            <p className="text-gray-500 font-medium max-w-2xl text-sm md:text-base">
              Pilih layanan tambahan dari Kolektix untuk membuat event Anda lebih profesional dan menjangkau lebih banyak audiens.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[950px] mx-auto">
            {/* Microsite Card */}
            <div className="bg-white rounded-[24px] p-5 md:p-8 border border-[rgb(227,227,227)] shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon icon="solar:globus-bold-duotone" className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-black">Microsite</div>
              </div>

              <div className="text-sm text-gray-400 font-medium leading-relaxed">
                Layanan pembuatan landing page eksklusif dengan branding penuh untuk meningkatkan kredibilitas dan konversi penjualan tiket event Anda.
              </div>

              <div className="pt-6 border-t border-[rgb(227,227,227)]">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Mulai Dari</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-black">Rp 500.000</span>
                  <span className="text-[10px] md:text-xs font-bold text-gray-300">/ event</span>
                </div>
              </div>

              <div className="flex flex-col">
                {['Custom Domain', 'SEO Optimized', 'Mobile Friendly'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-[rgb(227,227,227)] last:border-0">
                    <Icon icon="solar:check-circle-bold" className="text-blue-500 w-4 h-4" />
                    <span className="text-sm font-bold text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Link href="/partner/microsite" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm cursor-pointer hover:bg-blue-600 hover:text-white border border-blue-100 transition-all duration-300">
                  Pelajari Selengkapnya <Icon icon="solar:arrow-right-bold" className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Campaign Card */}
            <div className="bg-white rounded-[24px] p-5 md:p-8 border border-[rgb(227,227,227)] shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-5 hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon icon="solar:megaphone-bold-duotone" className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-xl md:text-2xl font-black">Biaya Campaign</div>
              </div>

              <div className="text-sm text-gray-400 font-medium leading-relaxed">
                Optimalkan jangkauan pasar dengan strategi kampanye digital yang terintegrasi melalui kanal distribusi dan media sosial Kolektix.
              </div>

              <div className="pt-6 border-t border-[rgb(227,227,227)]">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Mulai Dari</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-black">Rp 1.000.000</span>
                  <span className="text-[10px] md:text-xs font-bold text-gray-300">/ campaign</span>
                </div>
              </div>

              <div className="flex flex-col">
                {['Blast Email', 'Push Notification', 'Media Sosial'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-[rgb(227,227,227)] last:border-0">
                    <Icon icon="solar:check-circle-bold" className="text-blue-500 w-4 h-4" />
                    <span className="text-sm font-bold text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Link href="/partner/campaign" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm cursor-pointer hover:bg-blue-600 hover:text-white border border-blue-100 transition-all duration-300">
                  Pelajari Selengkapnya <Icon icon="solar:arrow-right-bold" className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 text-[11px] md:text-[13px] text-gray-400 font-medium">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Icon icon="solar:info-circle-bold" className="w-3 h-3" />
            </div>
            Harga dapat berubah sewaktu-waktu. Hubungi tim kami untuk informasi lebih lanjut.
          </div>
        </div>
      </section>

      {/* Benefits List Section */}
      <section id="keuntungan" className="pt-6 pb-12 bg-white scroll-mt-32">
        <div className="max-w-[1210px] mx-auto px-4">
          <div className="text-center text-3xl font-black mb-14">Keuntungan Bermitra dengan Kolektix</div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-12">
            {[
              { icon: 'solar:percent-bold-duotone', title: 'Fee Transparan', desc: 'Struktur biaya jelas tanpa biaya tersembunyi.' },
              { icon: 'solar:bank-bold-duotone', title: 'Payout Cepat', desc: 'Dana hasil penjualan dicairkan tepat waktu.' },
              { icon: 'solar:shield-check-bold-duotone', title: 'Keamanan Terjamin', desc: 'Sistem aman dan patuh terhadap regulasi.' },
              { icon: 'solar:global-bold-duotone', title: 'Jangkauan Luas', desc: 'Akses ke jutaan pengguna di seluruh Indonesia.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 p-4 md:p-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-[rgb(227,227,227)]">
                  <Icon icon={item.icon} className="text-blue-600 w-6 h-6" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-lg font-black leading-tight">{item.title}</div>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[200px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 px-4">
        <div className="max-w-[1210px] mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0A1D36] to-[#1C41D6] rounded-[24px] md:rounded-[32px] p-8 md:p-10 shadow-2xl">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col text-center lg:text-left">
                <div className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight">
                  Siap Mengembangkan <br /> Event Anda?
                </div>
                <p className="text-white/70 text-sm md:text-lg font-medium mb-8">
                  Bergabunglah sekarang dan jadilah bagian dari ekosistem event terbesar di Indonesia bersama Kolektix.
                </p>
              </div>

              <div className="relative hidden lg:flex justify-end pr-10">
                <div className="w-64 aspect-[9/18] bg-[#0A1D36] rounded-[40px] border-[8px] border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/20 flex flex-col items-center justify-center p-6 text-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon icon="solar:ticket-bold" className="w-5 h-5" />
                    </div>
                    <div className="text-white font-black text-xl leading-tight">EVENT TICKET</div>
                    <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-2">
                      <Icon icon="solar:qr-code-bold" className="text-black w-full h-full" />
                    </div>
                  </div>
                </div>
                {/* Stage Lights mockup */}
                <div className="absolute -bottom-10 left-0 w-full flex justify-center gap-4 opacity-20">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-20 bg-white blur-md origin-top rotate-12"></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-left {
          from { transform: translateX(-50px); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-from-right {
          from { transform: translateX(50px); }
          to { transform: translateX(0); }
        }
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-in {
          animation-fill-mode: forwards;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-left {
          animation-name: slide-in-from-left;
        }
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
        .duration-700 {
          animation-duration: 700ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default PartnerKolektix;
