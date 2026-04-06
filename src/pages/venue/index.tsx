import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import VenueCard from '@/components/Card/VenueCard';
import { Get } from '@/utils/REST';
import { VenueProps } from '@/utils/globalInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Container, Divider, Flex, SimpleGrid, Stack, Text, Title, UnstyledButton, Input, Collapse } from '@mantine/core';
import _ from 'lodash';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

const dummyVenues = [
  {
    id: 2,
    slug: "jakarta-convention-center",
    name: "Jakarta Convention Center (JCC)",
    location_name: "Senayan, Jakarta Pusat",
    starting_price: 25000000,
    has_venue_category: { name: "Convention Hall", icon_menu: "mdi:domain" },
    venue_gallery: [
      { image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop" },
    ],
    description: "Pusat konvensi terbesar di Jakarta dengan fasilitas lengkap untuk pameran, konferensi, dan acara internasional berskala besar."
  },
  {
    id: 3,
    slug: "tengah-tengah-namroom",
    name: "Tengah Tengah by NamRoom",
    location_name: "Kebayoran Baru, Jakarta Selatan",
    starting_price: 3500000,
    has_venue_category: { name: "Meeting Room", icon_menu: "fluent:conference-room-20-regular" },
    venue_gallery: [
      { image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=600&auto=format&fit=crop" },
    ],
    description: "Ruang meeting modern dan dinamis di Jakarta Selatan, sangat cocok untuk workshop, gathering, atau presentasi bisnis profesional."
  },
  {
    id: 4,
    slug: "cornerstone-auditorium",
    name: "Cornerstone Auditorium",
    location_name: "Paskal, Bandung",
    starting_price: 12500000,
    has_venue_category: { name: "Auditorium", icon_menu: "material-symbols:theater-comedy-outline" },
    venue_gallery: [
      { image_url: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1478147427282-58a87a5c5d48?q=80&w=600&auto=format&fit=crop" },
    ],
    description: "Auditorium eksklusif di pusat kota Bandung dengan sistem akustik premium, ideal untuk seminar, konser musik, atau pertunjukan seni."
  },
  {
    id: 5,
    slug: "cbn-hall-jakarta",
    name: "CBN Hall Jakarta",
    location_name: "Kuningan, Jakarta Selatan",
    starting_price: 30000000,
    has_venue_category: { name: "Hall", icon_menu: "lucide:building" },
    venue_gallery: [
      { image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop" },
    ],
    description: "Serbaguna dan mewah, CBN Hall menawarkan fleksibilitas untuk berbagai acara mulai dari resepsi pernikahan hingga peluncuran produk."
  },
  {
    id: 6,
    slug: "venue-premium-jakarta",
    name: "Venue Premium Jakarta",
    location_name: "SCBD, Jakarta Selatan",
    starting_price: 18000000,
    has_venue_category: { name: "Convention Hall", icon_menu: "mdi:domain" },
    venue_gallery: [
      { image_url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=600&auto=format&fit=crop" },
      { image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop" },
    ],
    description: "Terletak di kawasan bisnis SCBD yang elit, venue ini memberikan kesan eksklusif dan profesional untuk tamu undangan Anda."
  }
];

const PriceOptions = ['Semua', '< 1 Juta', '1 - 5 Juta', '> 5 Juta'];

const Venue = () => {
  const router = useRouter();
  const [_data, setData] = useState<VenueProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Semua']);
  const [selectedPrice, setSelectedPrice] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Rekomendasi');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const getVenue = () => {
    Get('venue', {})
      .then((res: any) => {
        if (res?.data && res.data.length > 0) {
          setData(res.data);
        } else {
          setData(dummyVenues as any);
        }
      })
      .catch((err: any) => {
        setData(dummyVenues as any);
      });
  };

  useEffect(() => {
    getVenue();
  }, []);

  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    } else {
      setSelectedCategory('Semua');
    }

    if (router.query.sort) {
      setSortBy(router.query.sort as string);
    } else {
      setSortBy('Rekomendasi');
    }

    if (router.query.show_filters === 'true') {
      setShowFilters(true);
    } else {
      setShowFilters(false);
    }

    if (router.query.city) {
      setSelectedCities((router.query.city as string).split(','));
    } else {
      setSelectedCities(['Semua']);
    }

    if (router.query.price) {
      setSelectedPrice(router.query.price as string);
    } else {
      setSelectedPrice('Semua');
    }
  }, [router.query.category, router.query.sort, router.query.show_filters, router.query.city, router.query.price]);

  const data = useMemo(() => {
    let filtered = _data;

    if (selectedCategory !== 'Semua' && selectedCategory !== undefined) {
      filtered = filtered.filter((item) => item.has_venue_category?.name === selectedCategory);
    }

    if (selectedCities.length > 0 && !selectedCities.includes('Semua')) {
      filtered = filtered.filter((item) =>
        selectedCities.some(city => item.location_name?.toLowerCase().includes(city.toLowerCase()))
      );
    }

    if (selectedPrice !== 'Semua') {
      if (selectedPrice === '< 1 Juta') {
        filtered = filtered.filter((item) => item.starting_price < 1000000);
      } else if (selectedPrice === '1 - 5 Juta') {
        filtered = filtered.filter((item) => item.starting_price >= 1000000 && item.starting_price <= 5000000);
      } else if (selectedPrice === '> 5 Juta') {
        filtered = filtered.filter((item) => item.starting_price > 5000000);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.location_name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'Harga Terendah') {
      filtered = filtered.sort((a, b) => a.starting_price - b.starting_price);
    } else if (sortBy === 'Harga Tertinggi') {
      filtered = filtered.sort((a, b) => b.starting_price - a.starting_price);
    }

    return filtered;
  }, [_data, selectedCategory, selectedCities, selectedPrice, searchQuery, sortBy]);

  return (
    <Container mih="90vh" mt={{ base: 10, md: 60 }} size="xl" className="px-4 md:px-8 pb-10">
      <Stack className="gap-4 md:gap-8">

        <Stack className="gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-0 md:mt-12 relative z-20">
            <Stack gap={1}>
              <Title size="h2" fw={800} className="text-gray-900 tracking-tight text-xl md:text-3xl">Pilihan Venue</Title>
              <Text size="sm" c="dimmed" fw={500} className="md:text-md">Temukan ruang acara, convention hall, meeting room, auditorium, dan lainnya.</Text>
            </Stack>
          </div>

          <Flex align="center" gap={16} className={`overflow-x-auto pb-4 scrollbar-hide px-1`}>
            {[
              { name: 'Semua', icon_menu: 'solar:widget-3-bold-duotone' },
              { name: 'Convention Hall', icon_menu: 'solar:buildings-bold-duotone' },
              { name: 'Meeting Room', icon_menu: 'solar:presentation-graph-bold-duotone' },
              { name: 'Auditorium', icon_menu: 'solar:mask-hapai-bold-duotone' },
              { name: 'Hall', icon_menu: 'solar:home-2-bold-duotone' },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(item.name as string)}
                className={`
                flex items-center justify-center gap-2.5 px-4 py-2.5 md:px-6 md:py-3.5 rounded-full transition-all duration-300 min-w-max outline-none
                ${item.name === selectedCategory
                    ? 'bg-[#194e9e] text-white shadow-[0_10px_20px_-5px_rgba(25,78,158,0.4)]'
                    : 'bg-white text-gray-800 hover:bg-slate-50 font-bold border border-transparent'
                  }
              `}
              >
                <Icon
                  icon={item.icon_menu ?? ''}
                  className={`text-[18px] md:text-[20px] ${item.name === selectedCategory ? 'text-white' : 'text-gray-900'}`}
                />
                <span className={`text-[12px] md:text-[13px] tracking-wide ${item.name === selectedCategory ? 'font-bold' : 'font-bold'}`}>
                  {item.name}
                </span>
              </button>
            ))}
          </Flex>
        </Stack>

        {data.length > 0 ? (
          <SimpleGrid className={`!grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4`} spacing={{ base: 'xs', md: 'lg' }} verticalSpacing={{ base: 'md', md: 'xl' }}>
            {data.map((item) => (
              <VenueCard
                id={item.id}
                key={item.id}
                slug={item.slug}
                title={item.name}
                location={item?.location_name ?? ''}
                price={Math.round(item.starting_price)}
                image={item.venue_gallery.map(e => e.image_url)}
                category={item.has_venue_category?.name}
                description={item.description}
              />
            ))}
          </SimpleGrid>
        ) : (
          <div className='min-h-[80vh] flex flex-col gap-3 items-center justify-center'>
            <FontAwesomeIcon icon={faLocationDot} className='text-primary-base' size='2x' />
            <h3 className='text-grey'>Belum ada venue</h3>
          </div>
        )}

      </Stack>
    </Container>
  );
};

export default Venue;