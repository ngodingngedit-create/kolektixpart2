import { NumberFormatter } from '@mantine/core';
import Link from 'next/link';
import notFoundImage from '../../../assets/images/icon-notfound.png';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useRef } from 'react';
import useLoggedUser from '@/utils/useLoggedUser';
import { useDidUpdate, useListState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { BookmarkListResponse, BookmarkRequest } from '@/types/bookmark';
import fetch from '@/utils/fetch';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface VenueCardProps {
  id?: number;
  title: string;
  image: string[];
  location: string;
  price: number;
  slug: string;
  bookmark_id?: number;
  category?: string;
  description?: string;
}

// ---------- Image Slider Sub-component ----------
interface ImageSliderProps {
  images: string[];
  title: string;
  shortCity: string;
}

const ImageSlider = ({ images, title, shortCity }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgs = images && images.length > 0 ? images : [notFoundImage.src];
  const total = imgs.length;

  const onScroll = () => {
    if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    }
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % total;
        scrollRef.current.scrollTo({ left: nextIndex * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
        const prevIndex = (currentIndex - 1 + total) % total;
        scrollRef.current.scrollTo({ left: prevIndex * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const goTo = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative aspect-[4/5] md:aspect-[4/3] w-full overflow-hidden bg-slate-50 flex-shrink-0">
      {/* Scrollable image strip - Scrollbar is hidden by making this taller than parent and cropping with overflow-hidden */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-[calc(100%+40px)] w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-[40px]"
      >
        {imgs.map((src, i) => (
          <div key={i} className="h-full w-full flex-shrink-0 snap-center">
            <img
              src={src || notFoundImage.src}
              alt={`${title} - ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay bottom - Removed by user request */}

      {/* Location badge bottom-left (desktop only) */}
      <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full items-center gap-1.5 shadow-xl hidden md:flex">
        <Icon icon="solar:map-point-bold" className="text-white text-[13px]" />
        <span className="mb-[1px]">{shortCity}</span>
      </div>

      {/* Image counter badge top-left (mobile, only when multiple) */}
      {total > 1 && (
        <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold rounded-full md:hidden">
          {currentIndex + 1}/{total}
        </div>
      )}

      {/* Prev Arrow */}
      {total > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-[24px] h-[24px] md:w-[28px] md:h-[28px] flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 active:scale-90 transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Icon icon="tabler:chevron-left" className="text-[11px] md:text-[13px] text-gray-800" />
        </button>
      )}

      {/* Next Arrow */}
      {total > 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-[24px] h-[24px] md:w-[28px] md:h-[28px] flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 active:scale-90 transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Icon icon="tabler:chevron-right" className="text-[11px] md:text-[13px] text-gray-800" />
        </button>
      )}

      {/* Dot indicators - Removed by user request */}
    </div>
  );
};

// ---------- Main VenueCard Component ----------
const VenueCard = ({ id, bookmark_id, slug, title, image, location, price, category, description }: VenueCardProps) => {
  const [bookmark, setBookmark] = useState<boolean>(false);
  const [loading, setLoading] = useListState<string>();
  const users = useLoggedUser();
  
  useDidUpdate(() => {
      if (users) {
        const bookmarked = (users?.bookmarked ?? [])?.find(e => e.venue_id == id);
        if (bookmarked != undefined) setBookmark(true);
      }
    }, [users]);

    const toggleBookmark = () => {
        if (!bookmark && !bookmark_id) {
          toggleBookmarkFetch();
          setBookmark(true);
        } else {
          modals.openConfirmModal({
            centered: true,
            title: 'Hapus dari bookmark',
            children: 'Apakah kamu yakin ingin menghapus venue ini dari bookmark?',
            labels: { cancel: 'Batal', confirm: 'Hapus' },
            onConfirm: () => {
              toggleBookmarkFetch(false);
              setBookmark(false);
            }
          })
        }
      }

      const toggleBookmarkFetch = async (status: boolean = true) => {
        if (!status) {
          const bookid = users?.bookmarked?.find(e => e?.venue_id == id)?.id;
          if (!bookid) {
            toast.error('Gagal Menghapus');
            return;
          }
    
          await fetch<any, any>({
            url: 'bookmark/' + (bookmark_id ?? bookid),
            method: 'DELETE',
            before: () => setLoading.append('bookmark'),
            success: () => {
              const data = JSON.parse(Cookies.get('bookmarked') ?? '[]') as BookmarkListResponse[];
              Cookies.set('bookmarked', JSON.stringify(data.filter(e => e.venue_id != id)));
              toast.info('Berhasil menghapus dari bookmark');
            },
            complete: () => setLoading.filter(e => e != 'bookmark'),
            error: () => toast.error('Gagal Menghapus')
          });
          return;
        }
    
        await fetch<BookmarkRequest, BookmarkListResponse>({
          url: 'bookmark-user',
          method: 'POST',
          data: {
            module_id: 5,
            type: 'Venue',
            venue_id: id as number
          },
          before: () => setLoading.append('bookmark'),
          success: ({ data: newData }) => {
            const data = JSON.parse(Cookies.get('bookmarked') ?? '[]') as BookmarkListResponse[];
            Cookies.set('bookmarked', JSON.stringify([...data, newData]));
            toast.info('Berhasil menambahkan ke bookmark')
          },
          complete: () => setLoading.filter(e => e != 'bookmark'),
        });
      }

  // Get short city name for the image overlay
  const shortCity = (location || '').split(',')[1]?.trim() || (location || '').split(',')[0] || 'Unknown';

  // Dynamic facility text based on category
  let fasilitasText = 'Multifungsi & Serbaguna';
  if (category === 'Olahraga') {
    const t = title.toLowerCase();
    if (t.includes('padel')) fasilitasText = 'Papan Padel & Fasilitas';
    else if (t.includes('futsal')) fasilitasText = 'Lapangan Futsal Terbaik';
    else if (t.includes('stadium') || t.includes('gelora')) fasilitasText = 'Stadion Sepak Bola & Atletik';
    else fasilitasText = 'Padel, Futsal, Badminton, dll.';
  } else if (category === 'Convention Hall' || category === 'Hall') {
    fasilitasText = 'Wedding, Concert & Event Serbaguna';
  } else if (category === 'Auditorium') {
    fasilitasText = 'Seminar, Teater & Conference';
  } else if (category === 'Meeting Room') {
    fasilitasText = 'Meeting, Workshop & Gathering';
  }

  // Dynamic icon based on category
  let iconFasilitas = "solar:cup-star-bold-duotone";
  if (category === 'Olahraga') iconFasilitas = "solar:volleyball-bold-duotone";
  else if (category === 'Meeting Room' || category === 'Auditorium') iconFasilitas = "solar:projector-bold-duotone";
  else if (category === 'Convention Hall' || category === 'Hall') iconFasilitas = "solar:buildings-bold-duotone";

  return (
    <div className="group relative flex flex-col bg-white rounded-md md:rounded-[32px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 h-full">
      {/* Invisible link overlay for the whole card */}
      <Link href={`/venue/${slug}`} className="absolute inset-0 z-10" />

      {/* Image Slider */}
      <ImageSlider images={image} title={title} shortCity={shortCity} />

      {/* Top-left category tag (Desktop ONLY) */}
      {category && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-base text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-md hidden md:block">
          {category}
        </div>
      )}

      {/* Bookmark Button (z-30 so it's always clickable) */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark();
        }}
        disabled={loading.includes('setbookmark')}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-[30px] h-[30px] md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-xl text-gray-400 hover:text-red-500 hover:scale-110 transition-all disabled:opacity-50"
      >
        <Icon icon={bookmark ? "famicons:bookmark" : "famicons:bookmark-outline"} className="text-[16px] md:text-[20px] transition-colors" />
      </button>

      <div className="flex flex-col p-2.5 md:p-6 flex-1 relative z-20 pointer-events-none">
        {/* Mobile Category & Rating Row */}
        <div className="flex items-center justify-between gap-1 mb-1 md:hidden">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded-md text-[8px] font-extrabold text-primary-base uppercase tracking-tight">
            {category || 'Venue'}
          </div>
          <div className="flex items-center gap-1 text-gray-800">
            <Icon icon="solar:star-fall-bold" className="text-yellow-400 text-[10px]" />
            <span className="text-[9px] font-black">4.8</span>
          </div>
        </div>

        {/* Rating & Title */}
        <div className="mb-1 md:mb-4">
          <div className="hidden md:flex items-center gap-1.5 mb-2.5">
            <Icon icon="solar:star-fall-bold" className="text-yellow-400 text-[14px] drop-shadow-sm" />
            <span className="text-[12px] font-bold text-gray-800 tracking-wide">4.8</span>
            <span className="text-[11px] font-medium text-gray-400 tracking-tight">(120)</span>
          </div>
          <h3 className="font-black text-gray-900 text-[12.5px] md:text-[19px] leading-snug md:leading-tight group-hover:text-primary-base transition-colors line-clamp-2 title-tight">
            {title}
          </h3>
        </div>

        {/* Details Row */}
        <div className="flex flex-col gap-1 md:gap-2 mb-1 md:mb-2 mt-1 md:mt-0">
            {description && (
                <p className="text-[11px] md:text-[12px] font-medium text-gray-400 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            )}
        </div>

        {/* Footer Pricing & Button (BORDERLESS DIVIDER) */}
        <div className="mt-auto bg-slate-50/50 -mx-2.5 -mb-2.5 md:-mx-6 md:-mb-6 px-2.5 py-2.5 md:px-6 md:py-5 flex items-center justify-between gap-1.5 md:gap-2">
          <div className="flex flex-col min-w-[0] overflow-hidden">
            <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-0.5 opacity-80 md:text-[10px]">Mulai dari</p>
            <p className={`font-extrabold text-gray-900 leading-none truncate ${price >= 1000000 ? 'text-[11.5px] md:text-[16.5px]' : 'text-[12px] md:text-[20px]'}`}>
              <NumberFormatter value={price} prefix="Rp" thousandSeparator="." decimalSeparator="," />
            </p>
          </div>
          <button className="hidden bg-primary-base text-white px-2 py-1.5 rounded-[8px] text-[9px] font-black shadow-lg shadow-primary-base/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 items-center gap-1 md:flex md:px-5 md:py-3 md:rounded-xl md:text-[12px]">
             Booking <Icon icon="solar:arrow-right-line-duotone" className="text-[11px] md:text-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
