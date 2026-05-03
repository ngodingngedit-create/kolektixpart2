import React, { useState, useRef } from 'react';
import { Container, Title, Text, SimpleGrid, Flex, Button, Card } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Footer from './index';

const paymentMethodData = [
  {
    id: 'E-wallets',
    title: 'E-wallets',
    description: 'Beri pelangganmu lebih banyak pilihan untuk membayar dengan e-wallet lokal populer seperti OVO, DANA, ShopeePay, dan lainnya.',
    icon: 'solar:wallet-bold-duotone',
    illustration: '/paymentmethod/illustrations/ewallet.png',
    logos: [
      { src: '/paymentmethod/Ewallets/ovo.png', alt: 'OVO' },
      { src: '/paymentmethod/Ewallets/linkaja.png', alt: 'LinkAja' },
      { src: '/paymentmethod/Ewallets/shopeepay.png', alt: 'ShopeePay' },
      { src: '/paymentmethod/Ewallets/dana.png', alt: 'DANA' },
      { src: '/paymentmethod/Ewallets/astrapay.png', alt: 'AstraPay' },
      { src: '/paymentmethod/Ewallets/jenius.png', alt: 'Jenius' },
    ],
  },
  {
    id: 'Virtual Accounts',
    title: 'Virtual Accounts (Bank Transfers)',
    description: 'Otomatis kenali dan terima pembayaran transfer bank dari berbagai bank besar tanpa perlu rekening terpisah.',
    icon: 'solar:bank-bold-duotone',
    illustration: '/paymentmethod/illustrations/virtual_account.png',
    logos: [
      { src: '/paymentmethod/TFBANK/bca.png', alt: 'BCA' },
      { src: '/paymentmethod/TFBANK/bni.png', alt: 'BNI' },
      { src: '/paymentmethod/TFBANK/bri.png', alt: 'BRI' },
      { src: '/paymentmethod/TFBANK/bjb.png', alt: 'bank bjb' },
      { src: '/paymentmethod/TFBANK/bsi.png', alt: 'BSI' },
      { src: '/paymentmethod/TFBANK/mandiri.png', alt: 'Mandiri' },
      { src: '/paymentmethod/TFBANK/cimb.png', alt: 'CIMB' },
      { src: '/paymentmethod/TFBANK/permata.png', alt: 'Permata' },
    ],
  },
  {
    id: 'Direct Debit',
    title: 'Direct Debit',
    description: 'Tarik dana secara langsung dari rekening bank pelanggan secara real-time melalui sistem Kolektix yang aman.',
    icon: 'solar:card-transfer-bold-duotone',
    illustration: '/paymentmethod/illustrations/direct_debit.png',
    logos: [
      { src: '/paymentmethod/debit/mandiri.png', alt: 'Mandiri' },
      { src: '/paymentmethod/debit/bridirectdebit.png', alt: 'BRI' },
    ],
  },
  {
    id: 'Cards',
    title: 'Kartu Kredit & Debit',
    description: 'Terima semua kartu kredit dan debit utama secara global dengan tingkat persetujuan terbaik dan perlindungan penuh.',
    icon: 'solar:card-bold-duotone',
    illustration: '/paymentmethod/illustrations/cards.png',
    logos: [
      { src: '/paymentmethod/CARDCREDIT/VISA.webp', alt: 'Visa' },
      { src: '/paymentmethod/CARDCREDIT/mastercard.png', alt: 'Mastercard' },
      { src: '/paymentmethod/CARDCREDIT/americanexpress.png', alt: 'Amex' },
      { src: '/paymentmethod/CARDCREDIT/jcb.png', alt: 'JCB' },
    ],
  },
  {
    id: 'QR Codes',
    title: 'QR Code (QRIS)',
    description: 'Terima pembayaran via QRIS dan kode QR standar lainnya secara instan dengan notifikasi settlement real-time.',
    icon: 'solar:qr-code-bold-duotone',
    illustration: '/paymentmethod/illustrations/qris.png',
    logos: [
      { src: '/paymentmethod/qris/qris.jpg', alt: 'QRIS' },
    ],
  },
  {
    id: 'Retail Outlets/ OTC',
    title: 'Retail Outlets / OTC',
    description: 'Terima pembayaran tunai di ribuan gerai retail dan minimarket di seluruh Indonesia.',
    icon: 'solar:shop-bold-duotone',
    illustration: '/paymentmethod/illustrations/retail.png',
    logos: [
      { src: 'paymentmethod/retail/indomaret.jpg', alt: 'Indomaret' },
      { src: 'paymentmethod/retail/alfamart.jpg', alt: 'Alfamart' },
    ],
  },
  {
    id: 'PayLater',
    title: 'PayLater / Cicilan',
    description: 'Tingkatkan daya beli pelanggan dengan opsi beli sekarang bayar nanti yang lebih fleksibel dari kartu kredit.',
    icon: 'solar:clock-circle-bold-duotone',
    illustration: '/paymentmethod/illustrations/paylater.png',
    logos: [
      { src: 'paymentmethod/paylater/kredivo.webp', alt: 'Kredivo' },
      { src: 'paymentmethod/paylater/logoakulaku.png', alt: 'Akulaku' },
      { src: 'paymentmethod/paylater/indodana.png', alt: 'Indodana' },
      { src: 'paymentmethod/paylater/atome.png', alt: 'Atome' },
    ],
  },
];

const PaymentMethode = () => {
  const [activeTab, setActiveTab] = useState('E-wallets');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (id: string) => {
    setActiveTab(id);
    const container = scrollRef.current;
    if (!container) return;
    const card = container.querySelector(`[data-id="${id}"]`) as HTMLElement;
    if (card) {
      const containerLeft = container.getBoundingClientRect().left;
      const cardLeft = card.getBoundingClientRect().left;
      const offset = cardLeft - containerLeft + container.scrollLeft;
      container.scrollTo({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen font-inter text-gray-900 overflow-x-hidden">
      <Head>
        <title>Payment Methods - Kolektix</title>
      </Head>

      {/* Hero Section */}
      <div className="pt-16 md:pt-20 lg:pt-28 pb-6 md:pb-10 px-4 bg-[#F8FAFF] overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10 -translate-x-1/3 -translate-y-1/4"></div>

        {/* Dotted Pattern - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.15] pointer-events-none -z-10"
          style={{
            backgroundImage: 'radial-gradient(#1C41D6 2px, transparent 2px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
          }}>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Left Side: Content */}
            <div className="lg:col-span-6 flex flex-col pt-4">
              <Title order={1} fw={800} className="text-[26px] sm:text-5xl lg:text-[72px] mb-8 md:mb-16 lg:mb-20 tracking-tighter text-[#0A1D36] leading-[1.1] max-w-lg">
                Bayar Tiket Jadi Mudah & Aman <br />
                <span className="text-[#1C41D6]">Di Kolektix Aja</span>
              </Title>

              <div className="text-base sm:text-lg xl:text-xl text-gray-500 leading-relaxed font-medium mt-2 mb-4 max-w-xl">
                Beragam metode pembayaran tersedia untuk kenyamananmu. Pilih cara bayar favoritmu dan nikmati pengalaman transaksi yang cepat & aman.
              </div>

              <div className="flex flex-col gap-8 mt-4 mb-10">
                {[
                  {
                    title: "Aman & Terpercaya",
                    desc: "Transaksi terenkripsi dan diawasi sistem keamanan terbaik.",
                    icon: "solar:shield-check-bold-duotone",
                    bg: "bg-blue-50",
                    iconColor: "text-[#1C41D6]"
                  },
                  {
                    title: "Cepat & Praktis",
                    desc: "Proses instan, tanpa ribet, dan hemat waktu.",
                    icon: "solar:bolt-circle-bold-duotone",
                    bg: "bg-blue-50",
                    iconColor: "text-[#1C41D6]"
                  },
                  {
                    title: "Banyak Pilihan",
                    desc: "Dukung berbagai metode pembayaran populer di Indonesia.",
                    icon: "solar:card-2-bold-duotone",
                    bg: "bg-blue-50",
                    iconColor: "text-[#1C41D6]"
                  }
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-5 group">
                    <div className={`w-16 h-16 rounded-2xl ${point.bg} flex items-center justify-center shrink-0 transition-all group-hover:scale-105`}>
                      <Icon icon={point.icon} className={`${point.iconColor} w-8 h-8`} />
                    </div>
                    <div className="pt-1">
                      <Text fw={700} className="text-[#0A1D36] text-[22px] mb-1 leading-tight">{point.title}</Text>
                      <Text fw={400} className="text-gray-500 text-[16px] leading-relaxed max-w-md">{point.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-10 mt-14">
              </div>
            </div>

            {/* Right Side: Payment Methods Card */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-start pt-4">
              {/* Extra soft glow around the card */}
              <div className="absolute -inset-10 bg-blue-100/10 rounded-full blur-[80px] -z-10"></div>

              <div className="w-full max-w-[500px] bg-white rounded-[24px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] p-5 md:p-6 relative overflow-hidden">
                <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">

                  {/* Bank Transfer */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:bank-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">BANK TRANSFER</Text>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { src: "/paymentmethod/TFBANK/mandiri.png", alt: "Mandiri" },
                        { src: "/paymentmethod/TFBANK/bri.png", alt: "BRI" },
                        { src: "/paymentmethod/TFBANK/bni.png", alt: "BNI" },
                        { src: "/paymentmethod/TFBANK/cimb.png", alt: "CIMB" },
                        { src: "/paymentmethod/TFBANK/bjb.png", alt: "BJB" },
                        { src: "/paymentmethod/TFBANK/bsi.png", alt: "BSI" },
                        { src: "/paymentmethod/TFBANK/permata.png", alt: "Permata" },
                        { src: "/paymentmethod/TFBANK/sampoerna.png", alt: "Sampoerna" },
                        { src: "/paymentmethod/TFBANK/bca.png", alt: "BCA" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-1.5 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-16 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Debit */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:card-transfer-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">DIRECT DEBIT</Text>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { src: "/paymentmethod/debit/mandiri.png", alt: "Mandiridebit" },
                        { src: "/paymentmethod/debit/bridirectdebit.png", alt: "BRIDirectdebit" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-1.5 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-16 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* E-Wallets */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:wallet-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">E-WALLETS</Text>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[
                        { src: "/paymentmethod/Ewallets/ovo.png", alt: "OVO" },
                        { src: "/paymentmethod/Ewallets/dana.png", alt: "DANA" },
                        { src: "/paymentmethod/Ewallets/shopeepay.png", alt: "ShopeePay" },
                        { src: "/paymentmethod/Ewallets/linkaja.png", alt: "LinkAja" },
                        { src: "/paymentmethod/Ewallets/astrapay.png", alt: "Astra Pay" },
                        { src: "/paymentmethod/Ewallets/jenius.png", alt: "Jenius" },
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-1.5 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-9 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:qr-code-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">QR CODE</Text>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[
                        { src: "/paymentmethod/qris/qris.jpg", alt: "QR" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-1.5 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-9 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Retail Outlets */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:shop-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">RETAIL</Text>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { src: "paymentmethod/retail/indomaret.jpg", alt: "Indomaret" },
                        { src: "paymentmethod/retail/alfamart.jpg", alt: "Alfamart" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-2 flex items-center justify-center w-20 h-9 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-20 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Paylater */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:clock-circle-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">PAYLATER</Text>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { src: "paymentmethod/paylater/kredivo.webp", alt: "Kredivo" },
                        { src: "paymentmethod/paylater/logoakulaku.png", alt: "Akulaku" },
                        { src: "paymentmethod/paylater/indodana.png", alt: "Indodana" },
                        { src: "paymentmethod/paylater/atome.png", alt: "Atome" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-2 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-16 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Debit Cards */}
                  <div className="bg-slate-50/60 rounded-[12px] p-4 shadow-sm mb-1 bg-[#F7FAFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:card-bold-duotone" className="text-[#1C41D6] w-6 h-6" />
                      </div>
                      <Text fw={600} className="text-[8px] text-[#0A1D36] uppercase tracking-[0.1em]">DEBIT CARDS</Text>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { src: "paymentmethod/CARDCREDIT/VISA.webp", alt: "Visa" },
                        { src: "paymentmethod/CARDCREDIT/americanexpress.png", alt: "American Express" },
                        { src: "paymentmethod/CARDCREDIT/mastercard.png", alt: "Mastercard" },
                        { src: "paymentmethod/CARDCREDIT/jcb.png", alt: "JCB" }
                      ].map((logo, idx) => (
                        <div key={idx} className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-lg p-2 flex items-center justify-center h-9 w-full hover:shadow-md hover:-translate-y-0.5 transition-all group">
                          <img src={logo.src} alt={logo.alt} className="max-h-9 max-w-[100%] object-contain transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section — Keunggulan Pembayaran di Kolektix */}
      <div className="pb-8 md:pb-10 bg-[#F8FAFF]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-24">
          {/* Section label */}
          <div className="mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-[#1C41D6] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              {/* <Icon icon="solar:star-bold-duotone" className="w-4 h-4" /> */}
              Kenapa Pilih Kolektix?
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A1D36] tracking-tight">Transaksi Lebih Mudah, Aman, &amp; Lokal</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'Konfirmasi Instan',
                desc: 'Tiketmu langsung terbit setelah pembayaran berhasil.',
                icon: 'solar:flash-bold-duotone',
                color: 'text-[#1C41D6]',
                bg: 'bg-blue-50'
              },
              {
                title: 'Transaksi Aman',
                desc: 'Semua transaksi dienkripsi dengan standar industri.',
                icon: 'solar:shield-check-bold-duotone',
                color: 'text-[#1C41D6]',
                bg: 'bg-blue-50'
              },
              {
                title: 'Dukung Dompet Lokal',
                desc: 'OVO, DANA, ShopeePay, GoPay, dan banyak lagi.',
                icon: 'solar:wallet-money-bold-duotone',
                color: 'text-[#1C41D6]',
                bg: 'bg-blue-50'
              }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}>
                  <Icon icon={feat.icon} width="24" className={feat.color} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#0A1D36]">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Coverage Section */}
      <div className="pt-6 md:pt-10 pb-12 md:pb-20 px-4 bg-white">
        <div className="max-w-[1270px] mx-auto px-4 md:px-6 lg:px-8">

          {/* Header */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-[#1C41D6] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-blue-100">
              Payment Coverage
            </div>
            <Title order={2} className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-[#0A1D36] leading-[1.1]">
              Choose the payment method that works for you
            </Title>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
              We support over <span className="text-[#1C41D6] font-bold">100+ payment options</span> to make your ticket purchase seamless.
            </p>
          </div>

          {/* Tab Pills — no border on inactive */}
          <div className="flex overflow-x-auto gap-2 pb-6 no-scrollbar">
            {paymentMethodData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToCard(tab.id)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-[#1C41D6] text-white shadow-md shadow-blue-200/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-[#1C41D6]'
                  }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Square Cards — responsive horizontal scroll */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory"
          >
            {paymentMethodData.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  data-id={tab.id}
                  onClick={() => scrollToCard(tab.id)}
                  className={`snap-start shrink-0 cursor-pointer rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 bg-white ${isActive
                    ? 'shadow-2xl shadow-blue-100/80 scale-[1.02]'
                    : 'shadow-md hover:shadow-xl hover:scale-[1.01]'
                    }`}
                  style={{ width: 'clamp(220px, 22vw, 280px)', height: 'clamp(220px, 22vw, 280px)' }}
                >
                  {/* Illustration — top 62% */}
                  <div className="relative overflow-hidden" style={{ height: '62%', flexShrink: 0 }}>
                    {tab.illustration ? (
                      <img
                        src={tab.illustration}
                        alt={tab.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F0F4FF] flex items-center justify-center">
                        <Icon icon={tab.icon} className="text-[#1C41D6] w-16 h-16 opacity-30" />
                      </div>
                    )}
                    {/* Active indicator overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-[#1C41D6]/5 pointer-events-none" />
                    )}
                  </div>

                  {/* Text — bottom 38% */}
                  <div className="flex-1 px-4 pt-3 pb-3 flex flex-col justify-start bg-white">
                    <h3 className={`text-sm font-bold mb-1 leading-tight ${isActive ? 'text-[#1C41D6]' : 'text-[#0A1D36]'
                      }`}>{tab.title}</h3>
                    <p className="text-gray-400 text-[11px] leading-snug line-clamp-2">{tab.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* CSS for no-scrollbar */}
      <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

      {/* Call To Action */}
      <div className="mt-8 md:mt-16 mb-20 md:mb-28 px-4" id="all-methods">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1D36] via-[#112D5E] to-[#1C41D6] rounded-[28px] md:rounded-[40px] p-8 md:p-16 lg:p-20 shadow-[0_40px_80px_-20px_rgba(10,29,54,0.4)]">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px]"></div>
              <div className="absolute -bottom-1/3 -right-1/4 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              {/* Left: Text */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
                  <Icon icon="solar:ticket-star-bold-duotone" className="w-3.5 h-3.5 text-blue-300" />
                  Mulai Sekarang
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                  Siap Beli Tiket <br />
                  <span className="text-blue-300">Event Favoritmu?</span>
                </h2>
                <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed max-w-md">
                  Ribuan event tersedia di Kolektix. Bayar dengan metode favoritmu — cepat, aman, dan tanpa ribet.
                </p>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                <Button
                  size="lg"
                  radius="xl"
                  className="bg-white text-[#1C41D6] hover:bg-blue-50 px-10 font-bold transition-all h-14 shadow-lg hover:-translate-y-0.5 group flex items-center gap-3 text-base w-full md:w-auto justify-center"
                >
                  Jelajahi Event Sekarang
                  <Icon icon="solar:arrow-right-bold" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* Trust row — simple & clean */}
                <div className="flex flex-wrap items-center gap-4 mt-1">
                  {[
                    { icon: 'solar:shield-check-bold-duotone', label: 'SSL Aman' },
                    { icon: 'solar:clock-circle-bold-duotone', label: '24/7 Support' },
                    { icon: 'solar:flash-bold-duotone', label: 'Tiket Instan' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
                      <Icon icon={badge.icon} className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PaymentMethode;
