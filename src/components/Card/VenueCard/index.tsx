import { NumberFormatter, AspectRatio, Box } from '@mantine/core';
import Link from 'next/link';
import notFoundImage from '../../../assets/images/icon-notfound.png';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useRef } from 'react';
import useLoggedUser from '@/utils/useLoggedUser';
import { useDidUpdate, useListState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import fetch from '@/utils/fetch';
import { BookmarkListResponse, BookmarkRequest } from '@/types/bookmark';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import styles from './index.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faBookmark as bookmarkSolidIcon } from '@fortawesome/free-solid-svg-icons';

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
}

const ImageSlider = ({ images, title }: ImageSliderProps) => {
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50 flex-shrink-0">
      {/* Scrollable image strip */}
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

  // Dynamic icon based on category
  let iconFasilitas = "solar:cup-star-bold-duotone";
  if (category === 'Olahraga') iconFasilitas = "solar:volleyball-bold-duotone";
  else if (category === 'Meeting Room' || category === 'Auditorium') iconFasilitas = "solar:projector-bold-duotone";
  else if (category === 'Convention Hall' || category === 'Hall') iconFasilitas = "solar:buildings-bold-duotone";

  return (
    <div className={`mx-auto w-full ${styles.cardContainer}`}>
      {/* Image Slider Wrapper */}
      <Link href={`/venue/${slug}`}>
        <div className={styles.shineContainer}>
          <Box pos="relative">
            <AspectRatio ratio={1062 / 520}>
              <ImageSlider images={image} title={title} />
            </AspectRatio>
          </Box>
        </div>
      </Link>

      <div className="p-3 md:p-4">
        {/* Title */}
        <Link href={`/venue/${slug}`}>
          <h5 className="mb-2 text-base md:text-lg font-semibold tracking-tight text-dark truncate max-w-full hover:text-primary-base transition-colors">
            {title}
          </h5>
        </Link>

        {/* Location Row (replaces Date row in EventCard) */}
        <p className="mb-3 font-normal text-xs md:text-sm flex items-center">
          <FontAwesomeIcon icon={faLocationDot} className="mr-3 text-primary-base text-sm" />
          <span className="text-dark-grey font-medium truncate max-w-[220px] md:max-w-[240px]">{location}</span>
        </p>

        {/* Description Row (highly readable text-dark-grey, max 2 lines) */}
        {description && (
          <p className="mb-3 text-xs md:text-sm font-normal text-dark-grey line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Price & Bookmark Row */}
        <div className="flex justify-between text-dark items-center font-semibold text-sm md:text-base">
          <p className="truncate">
            <span className="text-[10px] md:text-xs text-dark-grey font-medium mr-1">Mulai:</span>
            {price === 0 ? "Free" : `Rp${price?.toLocaleString("id-ID")}`}
          </p>
          {users?.name && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark();
              }}
              disabled={loading.includes('bookmark')}
              className="inline-flex items-center py-2 text-base font-medium text-center text-dark rounded-lg hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={bookmark || bookmark_id ? bookmarkSolidIcon : faBookmark}
                className="text-dark hover:text-red-500 transition-colors text-base md:text-lg"
              />
            </button>
          )}
        </div>
      </div>

      {/* Bottom category & rating block, styled like EventCard's creator info */}
      <div className={`border-t ${styles.cardDivider}`}>
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center">
            <div className="w-7 h-7 md:w-8 md:h-8 border border-primary-light-200 rounded-full flex items-center justify-center bg-primary-light text-primary-base">
              <Icon icon={iconFasilitas} className="text-sm md:text-base text-primary-base" />
            </div>
            <p className="ml-2 text-dark text-xs md:text-sm font-semibold truncate max-w-[150px] md:max-w-[180px]">{category || 'Venue'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon icon="solar:star-fall-bold" className="text-yellow-400 text-[14px] drop-shadow-sm" />
            <span className="text-[12px] font-bold text-dark">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
