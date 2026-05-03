import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Footer from './index';
import Link from 'next/link';

const PricingKolektix = () => {
  // Calculator State
  const [calcTickets, setCalcTickets] = useState<number | string>(100);
  const [calcPrice, setCalcPrice] = useState<number | string>(50000);
  const [ticketName, setTicketName] = useState('General Admission');
  const [commissionPayer, setCommissionPayer] = useState('creator'); // 'creator' or 'customer'

  const priceNum = Number(calcPrice) || 0;
  const ticketsNum = Number(calcTickets) || 0;
  const grossSales = priceNum * ticketsNum;
  const commissionFee = grossSales * 0.035;
  const netReceived = commissionPayer === 'creator' ? grossSales - commissionFee : grossSales;

  const pricingPlans = [
    {
      name: 'Community',
      price: 'Rp 0',
      unit: '/ event',
      desc: 'Cocok untuk event skala kecil dan pemula.',
      features: ['Ticketing Dasar', 'Transaksi Standard', 'Customer Support Email'],
      buttonText: 'Mulai Sekarang',
      popular: false
    },
    {
      name: 'Pro',
      price: '3.5%',
      unit: '/ tiket',
      desc: 'Fitur lengkap untuk meningkatkan penjualan tiket.',
      features: ['Semua fitur di Community', 'Laporan Penjualan Detail', 'Integrasi Pembayaran', 'Export Data', 'Support Prioritas'],
      buttonText: 'Mulai Jualan',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      unit: '',
      desc: 'Solusi khusus untuk event berskala besar.',
      features: ['Semua fitur di Pro', 'Dedicated Manager', 'Custom Domain', 'Dukungan & Layanan Khusus'],
      buttonText: 'Hubungi Sales',
      popular: false
    }
  ];

  return (
    <div className="bg-white min-h-screen font-inter text-[#0A1D36] overflow-x-hidden">
      <Head>
        <title>Biaya & Paket - Kolektix</title>
      </Head>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-[1210px] mx-auto text-center">
          <div className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Satu Harga, <br />
            Beragam Kemudahan
          </div>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Temukan paket yang dirancang khusus untuk mendukung <br className="hidden md:block" />
            setiap tahap pertumbuhan dan kesuksesan event Anda.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 px-4">
        <div className="max-w-[1210px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 md:p-10 rounded-[32px] border flex flex-col h-full transition-all duration-300 ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-1 ring-blue-600' : 'border-[rgb(227,227,227)]'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                  Paling Populer
                </div>
              )}

              <div className="mb-8">
                <div className="text-xl font-black mb-6">{plan.name}</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-blue-600' : 'text-[#0A1D36]'}`}>{plan.price}</span>
                  <span className="text-gray-400 text-sm font-bold">{plan.unit}</span>
                </div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed pb-8 border-b border-[rgb(227,227,227)]">
                  {plan.desc}
                </div>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon icon="solar:check-circle-bold" className="text-blue-600 w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center flex items-center justify-center gap-3 text-sm text-gray-400 font-medium">
          <Icon icon="solar:info-circle-bold" className="text-blue-500 w-5 h-5" />
          Semua paket tanpa biaya tersembunyi. Biaya hanya dikenakan saat tiket terjual.
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 px-4 bg-[#F8FAFF]">
        <div className="max-w-[1210px] mx-auto">
          <div className="mb-12">
            <div className="text-2xl md:text-3xl font-black mb-2 text-[#0A1D36]">Hitung Potensi Sukses Event Anda</div>
            <p className="text-gray-500 font-medium text-sm">Gunakan kalkulator kami untuk mensimulasikan pendapatan bersih dengan skema biaya yang transparan.</p>
          </div>

          <div className="bg-white rounded-[24px] border border-[rgb(227,227,227)] p-5 md:p-12 shadow-sm mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Side: Inputs */}
              <div className="lg:col-span-7 space-y-10">
                {/* Kategori Tiket */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Icon icon="solar:ticket-bold" className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <div className="font-black text-base md:text-lg">Detail Penjualan Tiket</div>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium">Atur harga dan estimasi jumlah tiket terjual</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nama Tiket</label>
                      <input
                        type="text"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        className="w-full bg-white border border-[rgb(227,227,227)] rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Harga (IDR)</label>
                        <input
                          type="number"
                          value={calcPrice}
                          onChange={(e) => setCalcPrice(e.target.value)}
                          className="w-full bg-white border border-[rgb(227,227,227)] rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Jumlah</label>
                        <input
                          type="number"
                          value={calcTickets}
                          onChange={(e) => setCalcTickets(e.target.value)}
                          className="w-full bg-white border border-[rgb(227,227,227)] rounded-xl p-4 text-sm font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Komisi */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="font-black mb-2 text-[#0A1D36]">Skema Layanan</div>
                  <p className="text-xs text-gray-400 mb-8 font-medium leading-relaxed">
                    Tentukan bagaimana biaya layanan Kolektix akan dikelola dalam sistem transaksi event Anda.
                  </p>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      onClick={() => setCommissionPayer('creator')}
                      className="flex-1 flex items-start gap-4 cursor-pointer group"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${commissionPayer === 'creator' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {commissionPayer === 'creator' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                      </div>
                      <div>
                        <div className={`text-sm font-black mb-1 transition-colors ${commissionPayer === 'creator' ? 'text-blue-600' : 'text-gray-600'}`}>Dibayar oleh event creator</div>
                        <p className="text-[10px] text-gray-400 font-medium">Komisi 3,5% akan dikurangi dari pendapatan</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setCommissionPayer('customer')}
                      className="flex-1 flex items-start gap-4 cursor-pointer group"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${commissionPayer === 'customer' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {commissionPayer === 'customer' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                      </div>
                      <div>
                        <div className={`text-sm font-black mb-1 transition-colors ${commissionPayer === 'customer' ? 'text-blue-600' : 'text-gray-600'}`}>Dibayar oleh pelanggan</div>
                        <p className="text-[10px] text-gray-400 font-medium">Komisi 3,5% akan ditambahkan saat pembelian tiket</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Summary */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon icon="solar:wallet-money-bold" className="text-blue-600 w-5 h-5 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="font-black text-base md:text-xl text-[#0A1D36]">Proyeksi Pendapatan</div>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium">Estimasi hasil akhir yang akan Anda terima</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white border border-[rgb(227,227,227)] rounded-[20px] md:rounded-[24px] p-5 md:p-8 flex flex-col gap-1 md:gap-2">
                    <div className="text-[10px] font-black text-[#1C41D6] uppercase tracking-[0.2em]">Total Penjualan</div>
                    <div className="text-xl md:text-3xl font-black text-[#0A1D36]">Rp {grossSales.toLocaleString('id-ID')}</div>
                  </div>

                  <div className="bg-white border border-[rgb(227,227,227)] rounded-[20px] md:rounded-[24px] p-5 md:p-8 flex flex-col gap-3 md:gap-4">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee Platform (3.5%)</div>
                      <div className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase shrink-0">Ditanggung {commissionPayer === 'creator' ? 'Creator' : 'Pelanggan'}</div>
                    </div>
                    <div className="text-xl md:text-2xl font-black text-red-500">-Rp {commissionFee.toLocaleString('id-ID')}</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-[#0A1D36] rounded-[20px] md:rounded-[24px] p-5 md:p-8 text-white flex flex-col gap-1 md:gap-2 shadow-xl shadow-blue-200/50">
                    <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Pendapatan Bersih Anda</div>
                    <div className="text-2xl md:text-4xl font-black">Rp {netReceived.toLocaleString('id-ID')}</div>
                    <p className="text-[9px] text-white/40 font-medium italic mt-1 md:mt-2">Estimasi pendapatan setelah pemotongan biaya.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Kategori Tiket', val: '1', icon: 'solar:layers-bold-duotone' },
              { label: 'Jumlah Tiket', val: calcTickets, icon: 'solar:ticket-bold-duotone' },
              { label: 'Biaya Penjualan', val: '3.5%', icon: 'solar:percent-bold-duotone' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 border border-[rgb(227,227,227)] flex flex-col gap-6 hover:shadow-xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon icon={card.icon} className="text-blue-600 w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-black text-[#0A1D36]">{card.val}</div>
                  <div className="text-sm font-bold text-[#1C41D6] uppercase tracking-wide">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[1210px] mx-auto">
          <div className="bg-blue-50 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between gap-8 md:gap-10 border border-blue-100 shadow-sm text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-white border border-[rgb(227,227,227)] flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <Icon icon="solar:calendar-mark-bold-duotone" className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl md:text-2xl font-black mb-2 leading-tight">Wujudkan Event Impian Anda Sekarang</div>
                <p className="text-gray-500 font-medium text-xs md:text-sm">Bergabunglah dengan ribuan partner yang telah sukses bersama Kolektix.</p>
              </div>
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 shrink-0">
              Mulai Event Sekarang <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <div className="py-12 border-t border-[rgb(227,227,227)] text-center">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-400 font-medium">
          <Icon icon="solar:question-circle-bold" className="text-gray-300 w-5 h-5" />
          Masih ada pertanyaan? Hubungi tim kami untuk informasi lebih lanjut.
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default PricingKolektix;
