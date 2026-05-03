import React from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/FooterComponent';

const CampaignDetail = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Head>
        <title>Marketing Campaign | Kolektix Partner</title>
        <meta name="description" content="Jangkau lebih banyak audiens dan tingkatkan penjualan tiket dengan Campaign marketing terpadu." />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#F8FAFF]">
        <div className="max-w-[1210px] mx-auto px-4 text-center">
          <div className="text-[#1C41D6] text-xs font-black uppercase tracking-[0.2em] mb-6">Layanan Campaign</div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Jangkau Audiens Tepat <br /> Tingkatkan Penjualan</h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto font-medium mb-12">
            Strategi pemasaran digital yang terintegrasi untuk memastikan event Anda dikenal luas dan mencapai target penjualan maksimal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.me/628123456789" className="px-8 py-4 bg-[#1C41D6] text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              Mulai Campaign
            </Link>
            <Link href="/partner" className="px-8 py-4 bg-white text-[#1C41D6] border border-blue-100 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              Kembali ke Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Marketing Channels */}
      <section className="py-24 bg-white">
        <div className="max-w-[1210px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'solar:letter-bold-duotone', title: 'Blast Email', desc: 'Kirim penawaran eksklusif langsung ke inbox ribuan database pengguna Kolektix.' },
              { icon: 'solar:chat-round-dots-bold-duotone', title: 'Push Notification', desc: 'Notifikasi real-time di aplikasi untuk mengingatkan audiens tentang event Anda.' },
              { icon: 'solar:share-circle-bold-duotone', title: 'Social Media', desc: 'Promosi terpadu di kanal Instagram, TikTok, dan Facebook resmi Kolektix.' },
              { icon: 'solar:shop-2-bold-duotone', title: 'Marketplace', desc: 'Penempatan banner strategis di halaman utama dan kategori relevan.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-6 p-8 rounded-[32px] border border-[rgb(227,227,227)] hover:border-blue-200 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon icon={item.icon} className="text-blue-600 w-8 h-8" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Showcase */}
      <section className="py-24 bg-[#F8FAFF]">
        <div className="max-w-[1210px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative aspect-video bg-white rounded-[40px] border border-[rgb(227,227,227)] shadow-2xl p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="font-black text-lg text-[#0A1D36]">Campaign Stats</div>
              <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">+24% conversion</div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                    <div className="h-2 bg-gray-50 rounded-full w-1/4"></div>
                  </div>
                  <div className="h-2 bg-blue-600 rounded-full w-12"></div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-around">
              {[
                { label: 'Reach', val: '1.2M' },
                { label: 'Clicks', val: '85K' },
                { label: 'Sales', val: '4.2K' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.label}</div>
                  <div className="text-xl font-black text-[#1C41D6]">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-black leading-tight">Pantau Performa <br /> Secara Real-time</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Dapatkan laporan lengkap mengenai efektivitas setiap kanal marketing yang digunakan, mulai dari impresi hingga konversi penjualan tiket.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Optimasi ROI', desc: 'Maksimalkan hasil dari setiap Rupiah yang Anda keluarkan.' },
                { title: 'Targeting Tepat', desc: 'Jangkau audiens berdasarkan minat dan lokasi.' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="font-black text-[#1C41D6]">{b.title}</div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 pb-32">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="bg-[#0A1D36] rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-8">Tingkatkan Sales Anda</h2>
              <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-medium">
                Jangan biarkan event Anda sepi. Mulai campaign terpadu bersama Kolektix hari ini.
              </p>
              <Link href="https://wa.me/628123456789" className="inline-flex px-10 py-4 bg-white text-[#0A1D36] rounded-2xl font-bold hover:bg-blue-50 transition-all">
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CampaignDetail;
