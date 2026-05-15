import React, { useEffect, useRef } from 'react';
import Logo from '@images/logo.png';
import Image from 'next/image';
import Link from 'next/link';

interface FooterItem {
  id: number;
  name: string;
  link?: string;
}

interface FooterSection {
  id: number;
  title: string;
  item: FooterItem[];
  isPayment?: boolean;
}

const FooterData: FooterSection[] = [
  {
    id: 1,
    title: 'Tentang Kolektix',
    item: [
      { id: 1, name: 'Masuk', link: '/auth' },
      { id: 2, name: 'Biaya', link: '/pricing' },
      { id: 3, name: 'Event', link: '/event' },
      { id: 4, name: 'Kebijakan Privasi', link: '/privacy' },
      { id: 5, name: 'Syarat & Ketentuan', link: '/terms' },
      { id: 6, name: 'Prosedur Pembatalan', link: '/terms/return-policy' },
      { id: 7, name: 'Syarat Pengembalian Dana', link: '/terms/refund' },
      { id: 8, name: 'Tiket Gelang', link: '/wristband' },
      { id: 9, name: 'Cara Menjadi Partner', link: '/partner' },
      { id: 10, name: 'Laporan', link: '/' },
      { id: 11, name: 'Setting', link: '/' },
    ],
  },
  {
    id: 2,
    title: 'Rayakan Event Kamu',
    item: [
      { id: 1, name: 'Cara Membuat Event', link: '/panduan/cara-membuat-event' },
      { id: 2, name: 'How to Publish an Event', link: '/panduan/cara-mempublikasikan-event' },
      { id: 3, name: 'Cara Mencari Lowongan', link: '/panduan/cara-mencari-lowongan' },
      { id: 4, name: 'Cara Menjadi Talent', link: '/panduan/cara-menjadi-talent' },
      { id: 5, name: 'Syarat & Ketentuan' },
      { id: 6, name: 'Cara Mempromosikan' },
      { id: 7, name: 'Metode Pembayaran', link: '/metode-pembayaran' },
    ],
  },
  {
    id: 3,
    title: 'Lokasi Event',
    item: [
      { id: 1, name: 'Jakarta' },
      { id: 2, name: 'Bandung' },
      { id: 3, name: 'Yogyakarta' },
      { id: 4, name: 'Semarang' },
      { id: 5, name: 'Solo' },
      { id: 6, name: 'Bali' },
      { id: 7, name: 'Yogyakarta' },
      { id: 8, name: 'Medan' },
    ],
  },
  {
    id: 4,
    title: 'Metode Pembayaran',
    isPayment: true,
    item: [],
  },
];

const paymentLogos = [
  // TFBANK
  { src: '/paymentmethod/TFBANK/bca.png', alt: 'BCA' },
  { src: '/paymentmethod/TFBANK/mandiri.png', alt: 'Mandiri' },
  { src: '/paymentmethod/TFBANK/bni.png', alt: 'BNI' },
  { src: '/paymentmethod/TFBANK/bri.png', alt: 'BRI' },
  { src: '/paymentmethod/TFBANK/cimb.png', alt: 'CIMB Niaga' },
  { src: '/paymentmethod/TFBANK/permata.png', alt: 'PermataBank' },
  { src: '/paymentmethod/TFBANK/bjb.png', alt: 'BJB' },
  { src: '/paymentmethod/TFBANK/bsi.png', alt: 'BSI' },
  { src: '/paymentmethod/TFBANK/sampoerna.png', alt: 'Bank Sampoerna' },
  
  // Ewallets
  { src: '/paymentmethod/Ewallets/dana.png', alt: 'DANA' },
  { src: '/paymentmethod/Ewallets/ovo.png', alt: 'OVO' },
  { src: '/paymentmethod/Ewallets/shopeepay.png', alt: 'ShopeePay' },
  { src: '/paymentmethod/Ewallets/linkaja.png', alt: 'LinkAja!', scale: 0.8 },
  { src: '/paymentmethod/Ewallets/astrapay.png', alt: 'AstraPay', scale: 0.8 },
  { src: '/paymentmethod/Ewallets/Jenius.png', alt: 'Jenius Pay', scale: 0.7 },
  
  // QRIS
  { src: '/paymentmethod/qris/qris.jpg', alt: 'QRIS' },
  
  // Cards
  { src: '/paymentmethod/CARDCREDIT/VISA.webp', alt: 'VISA' },
  { src: '/paymentmethod/CARDCREDIT/mastercard.png', alt: 'Mastercard' },
  { src: '/paymentmethod/CARDCREDIT/jcb.png', alt: 'JCB' },
  { src: '/paymentmethod/CARDCREDIT/americanexpress.png', alt: 'Amex' },
  
  // Debit
  { src: '/paymentmethod/debit/bridirectdebit.png', alt: 'BRI Direct Debit', scale: 0.8 },
  { src: '/paymentmethod/debit/mandiri.png', alt: 'Mandiri Direct Debit' },
  
  // Retail
  { src: '/paymentmethod/retail/alfamart.jpg', alt: 'Alfamart' },
  { src: '/paymentmethod/retail/indomaret.jpg', alt: 'Indomaret', scale: 0.7 },
  
  // Paylater
  { src: '/paymentmethod/paylater/atome.png', alt: 'Atome' },
  { src: '/paymentmethod/paylater/indodana.png', alt: 'Indodana' },
  { src: '/paymentmethod/paylater/kredivo.webp', alt: 'Kredivo' },
  { src: '/paymentmethod/paylater/logoakulaku.png', alt: 'Akulaku', scale: 0.8 },
];

const Footer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ top: 100, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='px-4 sm:px-8 md:px-16 lg:px-32 py-12 md:py-16 bg-[#02255a] text-white' style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div className='flex flex-col items-center md:items-start'>
        <Image src={Logo} alt='logo' className='w-1/2 md:w-1/4 lg:w-1/6' />
        <p className='mt-2 text-center md:text-left text-sm font-medium opacity-80'>Masa Depan Tongkrongan</p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-12 md:mt-16 mb-8 md:mb-14'>
        {FooterData.map((el) => (
          <div key={el.id} className='flex flex-col gap-2'>
            <h3 className='mb-4 text-lg md:text-xl font-bold'>{el.title}</h3>
            
            {el.isPayment ? (
              <div className="flex flex-col gap-4">
                {/* Scroll Container */}
                <div 
                  ref={scrollRef}
                  className="max-h-[220px] overflow-y-auto no-scrollbar pr-1"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
                    {paymentLogos.map((logo, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white rounded-lg p-0 flex items-center justify-center h-8 md:h-9 w-full overflow-hidden transition-transform hover:scale-105"
                      >
                        <img 
                          src={logo.src} 
                          alt={logo.alt} 
                          className="w-full h-full object-contain"
                          style={{ transform: `scale(${logo.scale || 1.3})` }}
                          onError={(e) => {
                            (e.target as any).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              el.item.map((items) => {
                return (
                  <Link 
                    key={items.id} 
                    href={items.link ?? '#'} 
                    className='text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity'
                  >
                    {items.name}
                  </Link>
                );
              })
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
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

export default Footer;
