import React from 'react';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/FooterComponent';

const MicrositeDetail = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Head>
        <title>Microsite Solution | Kolektix Partner</title>
        <meta name="description" content="Tingkatkan branding event Anda dengan Microsite eksklusif dari Kolektix." />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#F8FAFF]">
        <div className="max-w-[1210px] mx-auto px-4 text-center">
          <div className="text-[#1C41D6] text-xs font-black uppercase tracking-[0.2em] mb-6">Layanan Microsite</div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Landing Page Eksklusif <br /> Untuk Event Anda</h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto font-medium mb-12">
            Tingkatkan konversi penjualan dan kredibilitas event dengan halaman khusus yang dipersonalisasi sesuai identitas brand Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://wa.me/628123456789" className="px-8 py-4 bg-[#1C41D6] text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              Hubungi Sales
            </Link>
            <Link href="/partner" className="px-8 py-4 bg-white text-[#1C41D6] border border-blue-100 rounded-2xl font-bold hover:bg-blue-50 transition-all">
              Kembali ke Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 bg-white">
        <div className="max-w-[1210px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'solar:web-programming-bold-duotone', title: 'Custom Domain', desc: 'Gunakan domain sendiri untuk meningkatkan kepercayaan pelanggan.' },
              { icon: 'solar:paint-roller-bold-duotone', title: 'Full Branding', desc: 'Sesuaikan warna, font, dan elemen visual dengan brand identity Anda.' },
              { icon: 'solar:smartphone-bold-duotone', title: 'Mobile First', desc: 'Desain responsif yang optimal diakses dari berbagai jenis perangkat.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-6 p-8 rounded-[32px] border border-[rgb(227,227,227)] hover:border-blue-200 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon icon={item.icon} className="text-blue-600 w-9 h-9" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-[#F8FAFF]">
        <div className="max-w-[1210px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-black leading-tight">Analitik & Tracking <br /> Terintegrasi</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Pantau setiap kunjungan dan perilaku pengunjung dengan integrasi tools analitik terbaik untuk mengoptimalkan strategi marketing Anda.
            </p>
            <div className="space-y-4">
              {['Google Analytics 4', 'Facebook Pixel', 'TikTok Pixel', 'Google Tag Manager'].map((tool, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon icon="solar:check-circle-bold" className="text-blue-600 w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-700">{tool}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square bg-white rounded-[40px] border border-[rgb(227,227,227)] shadow-2xl p-10 flex items-center justify-center">
            <Icon icon="solar:chart-bold-duotone" className="text-blue-600 w-1/2 h-1/2 opacity-20 absolute" />
            <div className="relative z-10 w-full space-y-6">
              {[70, 45, 90].map((w, i) => (
                <div key={i} className="h-4 bg-blue-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${w}%` }}></div>
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
              <h2 className="text-3xl md:text-5xl font-black mb-8">Siap Memulai?</h2>
              <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-medium">
                Konsultasikan kebutuhan microsite event Anda dengan tim ahli kami sekarang juga.
              </p>
              <Link href="https://wa.me/628123456789" className="inline-flex px-10 py-4 bg-white text-[#0A1D36] rounded-2xl font-bold hover:bg-blue-50 transition-all">
                Hubungi Kami Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MicrositeDetail;
