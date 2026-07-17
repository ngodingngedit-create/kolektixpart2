import React, { useEffect, useMemo, useState } from 'react';
import foto from '../../assets/images/Banner-amis.png';
import CreatorTitle from '@/components/Creator/CreatorTitle';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Chip, DateInput } from '@nextui-org/react';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import InputField from '@/components/Input';
import { useRouter } from 'next/router';
import fetch from '@/utils/fetch';
import { EventListResponse } from '../../dashboard/my-event/type';
import { useClickOutside, useListState, useSetState } from '@mantine/hooks';
import { ActionIcon, AspectRatio, Box, Button as ButtonM, Card, Flex, Image as ImageM, Modal, NumberFormatter, Stack, Text, UnstyledButton, Tooltip } from '@mantine/core';
import { VenueListResponse } from '../../dashboard/venue/type';
import useLoggedUser from '@/utils/useLoggedUser';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';
import Chat from '@/components/chat';
import { DateInput as DateInputM, DatePickerInput } from '@mantine/dates';
import moment from 'moment';
import Cookies from 'js-cookie';
import { VenueBookingOrder } from '../../venue-order';
import { Icon } from '@iconify/react/dist/iconify.js';
import AuthModal from '@/components/AuthModal';
import { toast } from 'react-toastify';

const facility = ['Free Wifi', 'Toilet', 'Ruangan Full AC', 'Kursi', 'Lighting', 'Stage', 'Parking Area', 'Rest Area', 'Sound System', 'Back Stage'];

export type FacilitiesList = { facility_name: string; facility_description: string };

// --- Generate 7-day date strip starting today ---
const generateDateStrip = () => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
};

// --- Generate time slots for a court (Google Calendar Style) ---
const generateTimeSlots = (courtNum: number) => {
    const booked = courtNum === 1
        ? [6, 7, 8, 9, 10, 11, 12, 13]
        : courtNum === 2
            ? [8, 9, 14, 15]
            : [10, 11, 12];
    const slots = [];
    for (let h = 0; h < 24; h++) {
        const start = `${String(h).padStart(2, '0')}:00`;
        const end = `${String(h + 1 < 24 ? h + 1 : 0).padStart(2, '0')}:00`;
        const isBooked = booked.includes(h);
        const isOffHours = h < 6 || h >= 22;
        slots.push({ start, end, isBooked, isOffHours, price: 95000 + (courtNum - 1) * 20000 });
    }
    return slots;
};

const dateStrip = generateDateStrip();

const daysIdShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthsIdShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

const VenueDetail = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [data, setData] = useState<VenueListResponse>();
    const [facilities, setFacilities] = useState<FacilitiesList[]>();
    const [loading, setLoading] = useListState<string>();
    const user = useLoggedUser();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [openChat, setOpenChat] = useState(false);
    const [modalBooking, setModalBooking] = useState(false);
    const [date, setDate] = useSetState({
        start: '',
        end: ''
    });
    const subNavRef = React.useRef<HTMLDivElement>(null);
    const heroNavRef = React.useRef<HTMLDivElement>(null);
    const sectionRefs = {
        info: React.useRef<HTMLDivElement>(null),
        lapangan: React.useRef<HTMLDivElement>(null),
        ulasan: React.useRef<HTMLDivElement>(null),
        lokasi: React.useRef<HTMLDivElement>(null),
        faq: React.useRef<HTMLDivElement>(null),
    };
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [galleryActiveIdx, setGalleryActiveIdx] = useState(0);
    const [activeSection, setActiveSection] = useState('info');
    const [subNavSticky, setSubNavSticky] = useState(false);
    const [subNavOffsetTop, setSubNavOffsetTop] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([50000, 500000]);
    const [filterSport, setFilterSport] = useState<string[]>([]);
    const calendarRef = React.useRef<HTMLDivElement>(null);
    const filterRef = React.useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [reviewInput, setReviewInput] = useState("");
    const [reviewStars, setReviewStars] = useState(0);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const toggleExpand = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Court/Schedule state
    const [selectedDate, setSelectedDate] = useState<Date>(dateStrip[0]);
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    // selectedSlots persists across courts — key format: "{courtNum}-{HH:MM}"
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const carouselApi = React.useRef<any>(null);

    const toggleSlot = (slotKey: string) => {
        setSelectedSlots(prev =>
            prev.includes(slotKey)
                ? prev.filter(s => s !== slotKey)
                : [...prev, slotKey]
        );
    };

    // Group selected slots by court number
    const groupedSlots = selectedSlots.reduce<Record<number, string[]>>((acc, key) => {
        const courtNum = parseInt(key.split('-')[0]);
        if (!acc[courtNum]) acc[courtNum] = [];
        acc[courtNum].push(key);
        return acc;
    }, {});

    // Group facilities by categories – High-Precision Technical Specs
    const groupedFacilities = useMemo(() => {
        const facs = data?.facility || [];
        const groups: Record<string, string[]> = {
            'Venue Capacity': [],
            'Sound & Audio': [],
            'Stage & Lighting': [],
            'General Facilities': [],
        };

        facs.forEach((f: string) => {
            const low = f.toLowerCase();
            // Capacity / Space
            if (low.includes('pax') || low.includes('kapasitas') || low.includes('chairs') || low.includes('table') || low.includes('stage') || low.includes('backstage')) {
                groups['Venue Capacity'].push(f);
            } 
            // Audio System
            else if (low.includes('sound') || low.includes('mic') || low.includes('speaker') || low.includes('mixer') || low.includes('audio')) {
                groups['Sound & Audio'].push(f);
            } 
            // Lighting & Visuals (Fixed 'par' matching bug)
            else if (low.includes('light') || low.includes('led') || low.includes('beam') || low.includes('fresnel') || low.includes('leko') || low.includes('st ranger') || low.includes('videotron') || low.includes('screen') || (low.includes(' par ') || low.endsWith(' par') || low.startsWith('par '))) {
                groups['Stage & Lighting'].push(f);
            } 
            // Others (Parkir, WC, etc.)
            else {
                groups['General Facilities'].push(f);
            }
        });

        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [data?.facility]);

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Venue Capacity': return 'solar:users-group-rounded-bold-duotone';
            case 'Sound & Audio': return 'solar:volume-loud-bold-duotone';
            case 'Stage & Lighting': return 'solar:lightbulb-bold-duotone';
            case 'General Facilities': return 'solar:buildings-bold-duotone';
            default: return 'solar:check-circle-bold-duotone';
        }
    };

    const clickOutsideChat = useClickOutside(() => {
        if (Boolean(user?.id) && openChat) {
            setTimeout(() => {
                setOpenChat(false);
            }, 500);
        }
    });

    // Detect mobile on mount and resize
    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Handle scroll to section on mount (deep linking)
    useEffect(() => {
        if (mounted && router.isReady && router.query.section) {
            const section = router.query.section as string;
            // Short delay to ensure elements are rendered and layout is ready
            const timer = setTimeout(() => {
                const ref = sectionRefs[section as keyof typeof sectionRefs];
                if (ref?.current) {
                    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [mounted, router.isReady, router.query.section]);

    // Sub-navbar sticky: becomes sticky after scrolling past hero section
    useEffect(() => {
        const updateOffset = () => {
            if (subNavRef.current) {
                setSubNavOffsetTop(subNavRef.current.offsetTop);
            }
        };
        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (heroNavRef.current) {
                const trigger = heroNavRef.current.offsetTop - 64;
                setSubNavSticky(window.scrollY > trigger);
            }

            // Detect active section
            const sections = [
                { id: 'info', ref: sectionRefs.info },
                { id: 'lapangan', ref: sectionRefs.lapangan },
                { id: 'ulasan', ref: sectionRefs.ulasan },
                { id: 'faq', ref: sectionRefs.faq },
            ];
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = sections[i].ref.current;
                if (el && el.getBoundingClientRect().top <= 120) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close calendar/filter on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false);
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleArrowClick = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((prevYear) => prevYear - 1);
            } else {
                setCurrentMonth((prevMonth) => prevMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((prevYear) => prevYear + 1);
            } else {
                setCurrentMonth((prevMonth) => prevMonth + 1);
            }
        }
    };

    const eventList = useMemo(() => {
        return data?.has_booked_venue?.filter((e: { event_name: string; event_banner: string; start_date: string; end_date: string }) => e?.start_date?.slice(0, 7) == `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);
    }, [currentMonth]);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    useEffect(() => {
        if (Boolean(slug)) getData();
    }, [slug]);

    const getData = async () => {
        setLoading.append('getdata');

        // --- DUMMY FALLBACK DATA (Mirrors AYO.co.id Aesthetics) ---
        const isCornerstone = slug === 'cornerstone-auditorium';
        const dummyName = isCornerstone ? 'Cornerstone Auditorium' : (slug as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Nama Venue';
        const isPadel = dummyName.toLowerCase().includes('padel');

        const dummyVenue = {
            id: isCornerstone ? 4 : 999,
            slug: slug as string,
            name: dummyName,
            location: isCornerstone ? "Paskal Hyper Square, Jl. Pasir Kaliki No. 25-27, Bandung" : (isPadel ? "Jl. KH. Ahmad Dahlan, Purwokerto" : "Jalan Pahlawan No. 45, Senayan, Jakarta"),
            location_detail: isCornerstone ? "Strategic Business District, Paskal Hyper Square" : "Lokasi persis di belakang area utama, area parkir sangat memadai.",
            description: isCornerstone 
                ? "Cornerstone Auditorium adalah venue acara premium dan modern yang didirikan pada tahun 2020. Didesain untuk mengakomodasi berbagai acara mulai dari pertemuan kecil hingga pertunjukan skala besar, dilengkapi dengan teknologi audio-visual canggih di kawasan bisnis strategis Paskal Hyper Square, Bandung." 
                : (isPadel ? "BEST PADEL COURT IN PURWOKERTO #1. WE COME. WE PLAY. WE WIN.... NO TIME TO LOSE" : "Venue olahraga premium terbaik di kelasnya. Memiliki fasilitas yang sangat lengkap dengan standarisasi profesional."),
            starting_price: isCornerstone ? 12500000 : (isPadel ? 30000 : 150000),
            max_capacity: isCornerstone ? 800 : 50,
            seat_capacity: isCornerstone ? 800 : 50,
            venue_gallery: isCornerstone ? [
                { image_url: "https://www.cornerstoneauditorium.com/img/logo.png" },
                { image_url: "https://images.unsplash.com/photo-1507676184212-d0330a15233c?q=80&w=1200" },
                { image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" }
            ] : [
                { image_url: isPadel ? "https://images.unsplash.com/photo-1622396345638-3dc682ae12aa?q=80&w=1200" : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" },
                { image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200" },
                { image_url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200" }
            ],
            facility: isCornerstone ? [
                "600 pax (Main Auditorium)",
                "350 pax (Balcony)",
                "Full AC Central",
                "800 Premium Theater Chairs",
                "2 Guest Registration Tables",
                "3 Wireless Shure SLX Microphones",
                "4 Wired Shure SM58 Microphones",
                "Speaker FOH Meyer Melodia System",
                "Midas M32 Live Digital Mixer",
                "L’acoustics A10i Premium Sound System",
                "16 Unit PAR LED 54x3W",
                "6 Unit ST Ranger Beam 230",
                "4 Unit Moving Head Beam",
                "4 Unit Fresnel 200W LED",
                "2 Unit Leko Profile Spot",
                "DMX Lighting Controller Console",
                "Main LED Videotron 8x5m Unilum P3.9",
                "2 Side LED Screens 2x3m P3.9",
                "Music Instruments: Pearl Drum, Fender Bass, Roland Keyboard",
                "Motorized Stage Curtains",
                "Spacious Backstage & Private Changing Room",
                "High-Speed Wi-Fi (Up to 100 Mbps)",
                "Underground Parking Area & VIP Drop-off",
                "Loading Dock for Production Sets",
                "24/7 Security & CCTV Surveillance"
            ] : [
                "Opsi pembayaran DP (Down Payment)", 
                "Reschedule jadwal booking", 
                "Lebih banyak promo & voucher", 
                "Kamar Mandi / Shower Bersih", 
                "Area Parkir Luas & Aman",
                "CCTV Area Olahraga",
                "Standard Sports Lighting",
                "Standard First Aid Kit"
            ],
            venue_rules: isCornerstone ? [
                "Koordinasi teknis dengan tim profesional diperlukan untuk sistem AV",
                "Dilarang membawa makanan & minuman dari luar ke dalam hall utama",
                "Registrasi & koordinasi loading barang minimal 2 jam sebelum acara",
                "Menjaga kebersihan dan ketertiban di seluruh area Paskal Hyper Square",
                "Penggunaan daya listrik di atas 10.000W wajib konfirmasi sebelumnya"
            ] : [
                'Dilarang membawa makanan dari luar',
                'Menggunakan sepatu olahraga yang sesuai',
                'Check-in 15 menit sebelum waktu mulai',
                'Menjaga kebersihan area lapangan',
                'Dilarang merokok di area olahraga',
                'Jaga dan amankan barang bawaan masing-masing',
            ],
            creator: {
                name: isCornerstone ? "Cornerstone Management" : "Gelora Bung Karno",
                image_url: isCornerstone ? "https://www.cornerstoneauditorium.com/img/logo.png" : "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200"
            },
            has_booked_venue: [
                { start_date: "2026-03-29", event_name: "Turnamen Regional", event_banner: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=400" },
            ]
        };

        setData(dummyVenue as any); // Display dummy data instantly for UX

        await fetch<any>({
            url: `venue/${slug}`,
            method: 'GET',
            success: (res) => {
                if (res?.data) {
                    setData(res.data);
                    res['dataFacilities'] && setFacilities(res['dataFacilities'] as FacilitiesList[]);
                }
            },
            complete: () => setLoading.filter((e) => e != 'getdata')
        });
    };

    const handleOrder = () => {
        if (data?.id) {
            Cookies.set('venue_order_data', JSON.stringify({
                id: data?.id,
                slug: data?.slug,
                selected_slots: selectedSlots
            } as VenueBookingOrder));
            setLoading.append('submit');
            router.push('/venue-order');
        }
    };

    const galleryImages = [
        data?.venue_gallery?.[0]?.image_url,
        data?.venue_gallery?.[1]?.image_url || data?.venue_gallery?.[0]?.image_url,
        data?.venue_gallery?.[2]?.image_url || data?.venue_gallery?.[0]?.image_url,
        data?.creator?.image_url || data?.venue_gallery?.[0]?.image_url,
    ].filter(Boolean) as string[];

    return (
        <>
            <div className="min-h-screen bg-white text-dark w-full font-inter">
                <div ref={clickOutsideChat} className={`${openChat ? '' : 'hidden'}`}>
                    <Chat toggleOpenTab={() => setOpenChat(!openChat)} openTab={openChat} creatorIdOpen={data?.creator_id} />
                    <AuthModal visible={openChat && !user?.id} onClose={() => setOpenChat(false)} />
                </div>

                {!isMobile ? (
                    <React.Fragment>
                        {/* ── DESKTOP HERO SECTION ── */}
                        <div className="pt-24 pb-16 bg-primary-dark transition-all duration-500">
                            <div className="w-full mx-auto max-w-[1550px] px-2 md:px-3">
                                <Flex justify="space-between" align="end" className="px-4 md:px-6">
                                    <div>
                                        <p className="text-white/70 mb-[-10px] text-xs uppercase tracking-widest">
                                            {data?.has_venue_category?.name || 'Sewa Venue'}
                                        </p>
                                        <h3 className="text-white font-bold my-4 text-2xl tracking-tight leading-tight uppercase">
                                            {data?.name || 'Loading Venue...'}
                                        </h3>
                                    </div>
                                </Flex>

                                <div className="flex justify-between gap-5 h-full items-stretch px-4 md:px-6">
                                    <Stack w="100%">
                                        <Box pos="relative">
                                            {/* Photo Collage Grid */}
                                            <div className="relative group rounded-[12px] overflow-hidden shadow-2xl border border-white/10 bg-white/5 h-[200px] md:h-[280px] shrink-0">
                                                <div className="flex gap-1 h-[200px] md:h-[280px]">
                                                    {/* Main large image */}
                                                    <div className="relative flex-[1.6] overflow-hidden">
                                                        <div className="absolute inset-0">
                                                            <ImageM
                                                                src={data?.venue_gallery?.[0]?.image_url || ''}
                                                                h="100%" w="100%" fit="cover"
                                                                className="transition-transform duration-500 hover:scale-105 cursor-pointer"
                                                                onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Right 2x2 grid */}
                                                    <div className="flex flex-col gap-1 flex-1">
                                                        <div className="flex gap-1 flex-1 min-h-0">
                                                            <div className="relative flex-1 overflow-hidden">
                                                                <div className="absolute inset-0">
                                                                    <ImageM src={data?.venue_gallery?.[1]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="transition-transform duration-500 hover:scale-105 cursor-pointer" onClick={() => { setGalleryActiveIdx(1); setShowGallery(true); }} />
                                                                </div>
                                                            </div>
                                                            <div className="relative flex-1 overflow-hidden">
                                                                <div className="absolute inset-0">
                                                                    <ImageM src={data?.venue_gallery?.[2]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="transition-transform duration-500 hover:scale-105 cursor-pointer" onClick={() => { setGalleryActiveIdx(2); setShowGallery(true); }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1 flex-1 min-h-0">
                                                            <div className="relative flex-1 overflow-hidden">
                                                                <div className="absolute inset-0">
                                                                    <ImageM src={data?.creator?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="transition-transform duration-500 hover:scale-105 cursor-pointer" onClick={() => { setGalleryActiveIdx(3); setShowGallery(true); }} />
                                                                </div>
                                                            </div>
                                                            <div className="relative group/photo flex-1 overflow-hidden">
                                                                <div className="absolute inset-0">
                                                                    <ImageM src={data?.venue_gallery?.[3]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="transition-transform duration-500 hover:scale-105 group-hover/photo:brightness-[0.7] cursor-pointer" onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }} />
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                                                                            <Icon icon="solar:gallery-wide-bold" className="text-white text-[14px]" />
                                                                            <span className="text-white text-[11px] font-bold tracking-wide">Lihat Foto</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Floating see all photos button */}
                                                <button
                                                    onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }}
                                                    className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl hover:scale-105 transition-all"
                                                    style={{ background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.18)', outline: '1px solid #e2e8f0' }}
                                                >
                                                    <Icon icon="solar:gallery-minimalistic-bold" style={{ color: '#194e9e', fontSize: '16px' }} />
                                                    <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 900 }}>Lihat semua {galleryImages.length} foto</span>
                                                </button>
                                            </div>
                                        </Box>
                                    </Stack>

                                    {/* Desktop Sidebar Card */}
                                    <Stack className="w-full md:max-w-[300px] h-[280px] justify-between" gap={12}>
                                        <div className="bg-white/10 backdrop-blur-md rounded-md md:rounded-lg lg:rounded-xl border border-white/20 p-4 shadow-xl text-white flex flex-col justify-center flex-1">
                                            <Stack gap={12}>
                                                <Stack gap={2}>
                                                    <Text c="white" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                                                        HARGA MULAI DARI
                                                    </Text>
                                                    <Flex align="baseline" gap={6} className="text-white">
                                                        <Text className="text-[24px] md:text-[28px] font-black leading-none tracking-tight">
                                                            Rp{(data?.starting_price ?? 95000).toLocaleString('id')}
                                                        </Text>
                                                        <Text size="xs" className="font-bold opacity-70">/ sesi</Text>
                                                    </Flex>
                                                </Stack>
                                                <div className="h-[1px] bg-white/10 w-full my-0.5" />
                                                <div className="flex flex-col gap-2">
                                                    <Text c="white" className="text-[11px] opacity-75 tracking-wider font-semibold">
                                                        Penyelenggara
                                                    </Text>
                                                    <Flex align="center" gap={12}>
                                                        {data?.creator?.image_url ? (
                                                            <ImageM src={data.creator.image_url} alt="image" radius="full" w={44} h={44} className="border-2 border-white/30 object-contain bg-white/10 shrink-0" />
                                                        ) : (
                                                            <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10 shrink-0 flex items-center justify-center">
                                                                <Icon icon="solar:user-bold" className="text-white/50 text-[20px]" />
                                                            </div>
                                                        )}
                                                        <Text c="white" className="font-bold text-[15px] truncate max-w-[170px]">{data?.creator?.name}</Text>
                                                    </Flex>
                                                </div>
                                            </Stack>
                                        </div>

                                        <div className="w-full bg-white/10 backdrop-blur-md rounded-md md:rounded-lg lg:rounded-xl border border-white/20 p-1.5 flex items-center gap-3 shadow-xl relative">
                                            <button
                                                onClick={() => {
                                                    if (typeof navigator !== "undefined" && navigator.share) {
                                                        navigator.share({
                                                            title: data?.name || document.title,
                                                            url: window.location.href
                                                        }).catch(err => console.log(err));
                                                    } else {
                                                        const url = window.location.href;
                                                        navigator.clipboard.writeText(url)
                                                            .then(() => toast.info("Tautan berhasil disalin!"))
                                                            .catch(err => console.error(err));
                                                    }
                                                }}
                                                className="flex-1 bg-[#0b387c] hover:bg-[#0b387c]/90 text-white p-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                                                title="Share"
                                            >
                                                <Icon icon="solar:share-bold" className="text-white text-[20px]" />
                                            </button>
                                            <button
                                                onClick={() => setOpenChat(!openChat)}
                                                className="flex-1 bg-[#0b387c] hover:bg-[#0b387c]/90 text-white p-2.5 rounded-lg transition-all flex items-center justify-center"
                                                title="Chat Host"
                                            >
                                                <Icon icon="fluent:chat-12-filled" className="text-white text-[22px]" />
                                            </button>
                                        </div>
                                    </Stack>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP STICKY NAV TAB BAR */}
                        <div className="w-full bg-white border-b border-light-grey sticky top-[64px] z-30">
                            <div className="w-full mx-auto max-w-[1250px] px-4 md:px-6">
                                <div className="flex items-center gap-3 md:gap-8 overflow-x-auto scrollbar-hide">
                                    {[
                                        { id: "info", label: "Deskripsi" },
                                        { id: "lapangan", label: "Booking" },
                                        { id: "ulasan", label: "Ulasan" },
                                        { id: "lokasi", label: "Lokasi" },
                                        { id: "faq", label: "FaQ" },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                if (tab.id === "lapangan") {
                                                    router.push(`/venue/${slug}/pilih-jadwal`);
                                                } else {
                                                    setActiveSection(tab.id);
                                                    const ref = sectionRefs[tab.id as "info" | "ulasan" | "lokasi" | "faq"];
                                                    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                                }
                                            }}
                                            className={`pb-4 pt-4 text-[13px] md:text-[14px] transition-all relative whitespace-nowrap shrink-0 ${activeSection === tab.id ? "text-[#194e9e] font-semibold" : "text-grey font-medium"
                                                }`}
                                        >
                                            {tab.label}
                                            {activeSection === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#194e9e] rounded-t-lg" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP BODY CONTENT */}
                        <div className="w-full bg-white">
                        <div className="max-w-[1250px] mx-auto w-full flex flex-col gap-10 px-4 md:px-6 pt-8 pb-40">

                            {/* SECTION DESKRIPSI */}
                            <div ref={sectionRefs.info} className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon icon="solar:document-text-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                    <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">Deskripsi</h3>
                                </div>
                                <div className="w-full pl-8">
                                    {/* Collapsible text only */}
                                    <div
                                        className="overflow-hidden transition-all duration-500 ease-in-out"
                                        style={{ maxHeight: expandedSections['deskripsi'] ? '600px' : '72px' }}
                                    >
                                        <p className="font-normal text-[13px] text-gray-600 leading-relaxed">
                                            {data?.description || 'Venue ini merupakan pilihan sempurna untuk berbagai jenis acara, mulai dari pesta pernikahan, resepsi formal, gathering perusahaan, konser musik, hingga seminar skala besar. Dengan luas area lebih dari 1.500 m², venue kami mampu menampung hingga 600 tamu dalam suasana yang nyaman dan elegan. Fasilitas modern tersedia lengkap, termasuk sistem tata cahaya profesional dengan moving light dan LED, sistem suara berdaya tinggi menggunakan speaker FOH Meyer Melodia dan wireless microphone, serta layar LED Videotron berukuran besar untuk visual yang memukau. Tim profesional kami siap mendampingi Anda dari tahap perencanaan hingga hari-H untuk memastikan setiap acara berjalan lancar dan berkesan.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleExpand('deskripsi')}
                                        className="text-[#194e9e] text-[12px] font-semibold flex items-center gap-1 mt-2 hover:underline transition-all"
                                    >
                                        {expandedSections['deskripsi'] ? 'Sembunyikan' : 'Baca Selengkapnya'}
                                        <Icon
                                            icon="solar:alt-arrow-down-linear"
                                            className={`text-[12px] transition-transform duration-300 ${expandedSections['deskripsi'] ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {/* Contact Person — card */}
                                    <div className="mt-4 flex flex-col gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <span className="text-[11px] text-[#194e9e] font-bold uppercase tracking-wider">Contact Person</span>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <a href={`tel:${data?.contact_person_phone || ''}`} className="flex items-center gap-1.5 text-[12px] text-black hover:text-[#194e9e] transition-colors whitespace-nowrap">
                                                <Icon icon="solar:phone-linear" className="text-[#194e9e] text-[13px] shrink-0" />
                                                <span className="font-semibold">{data?.contact_person_phone || '-'}</span>
                                            </a>
                                            <a href={`mailto:${data?.contact_person_email || ''}`} className="flex items-center gap-1.5 text-[12px] text-black hover:text-[#194e9e] transition-colors whitespace-nowrap">
                                                <Icon icon="solar:letter-linear" className="text-[#194e9e] text-[13px] shrink-0" />
                                                <span className="font-semibold">{data?.contact_person_email || '-'}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION ATURAN VENUE */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon icon="solar:clipboard-list-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                    <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">Aturan Venue</h3>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pl-8">
                                    {(data?.venue_rules && data.venue_rules.length > 0 ? data.venue_rules : [
                                        'Dilarang membawa makanan dari luar',
                                        'Check-in 15 menit sebelum waktu mulai',
                                        'Dilarang merokok di area olahraga',
                                        'Menggunakan sepatu olahraga yang sesuai',
                                        'Menjaga kebersihan area lapangan',
                                        'Jaga dan amankan barang bawaan masing-masing',
                                    ]).map((rule: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-[13px] text-gray-700 font-medium">
                                            <Icon icon="solar:check-circle-outline" className="text-[#194e9e] text-[18px] shrink-0" />
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* SECTION FASILITAS */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon icon="solar:widget-2-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                    <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">Fasilitas Venue</h3>
                                </div>
                                <div className="pl-8">
                                    <div className="relative">
                                        <div
                                            className="overflow-hidden transition-all duration-500 ease-in-out"
                                            style={{ maxHeight: expandedSections['fasilitas'] ? '2000px' : '165px' }}
                                        >
                                            <div className="flex flex-col gap-6 pb-2">
                                                {(groupedFacilities.length > 0 ? groupedFacilities : [
                                                    ['Capacity', ['600 pax (Main Auditorium)', '350 pax (Balcony)', 'Full AC', 'Chairs (According to Number of Pax)', '2 Guest Registration Table']],
                                                    ['Sound System', ['3 wireless mic shure SLX', '4 wired mic shure SM 58', 'Speaker FOH Meyer Melodia', 'Speaker Monitor', 'Mixer']],
                                                    ['Moving Light', ['16 unit PAR LED', '2 unit ST Ranger', '4 unit Beam', '4 unit Fresnel', '2 unit Leko']],
                                                    ['Additional', ['LED Videotron 8×5 Unilum', '2 LED Screen 2×3s', 'Music instruments: Drum, Guitar, Bass, Keyboard']],
                                                ] as [string, string[]][]).map(([category, items]) => {
                                                    const iconMap: Record<string, string> = {
                                                        'capacity': 'solar:users-group-two-rounded-outline',
                                                        'sound': 'solar:volume-loud-outline',
                                                        'moving': 'solar:lightbulb-bolt-outline',
                                                        'light': 'solar:lightbulb-bolt-outline',
                                                        'additional': 'solar:add-square-outline',
                                                    };
                                                    const catLower = category.toLowerCase();
                                                    const iconKey = Object.keys(iconMap).find(k => catLower.includes(k)) || 'capacity';
                                                    return (
                                                        <div key={category} className="flex flex-col gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <Icon icon={iconMap[iconKey]} className="text-[#194e9e] text-[18px] shrink-0" />
                                                                <h4 className="text-[15px] font-bold text-gray-800">{category}</h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {items.map((item: string, i: number) => (
                                                                    <div key={i} className="px-3.5 py-1.5 rounded-full bg-white border border-white text-[12px] font-medium text-gray-700 shadow-[0_0_0_1px_#d1d5db] hover:shadow-[0_0_0_1.5px_#194e9e] hover:text-[#194e9e] transition-all">
                                                                        {item}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* No fade mask - plain cutoff */}
                                    </div>
                                    <button
                                        onClick={() => toggleExpand('fasilitas')}
                                        className="text-[#194e9e] text-[12px] font-semibold flex items-center gap-1 mt-3 transition-all"
                                    >
                                        {expandedSections['fasilitas'] ? 'Sembunyikan' : 'Baca Selengkapnya'}
                                        <Icon
                                            icon="solar:alt-arrow-down-linear"
                                            className={`text-[12px] transition-transform duration-300 ${expandedSections['fasilitas'] ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* SECTION ULASAN */}
                            <div ref={sectionRefs.ulasan} className="w-full">
                                {/* Header row */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:star-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                        <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">Review</h3>
                                    </div>
                                    <button className="text-[#194e9e] text-[12px] font-semibold hover:underline">Lihat semua</button>
                                </div>
                                <div className="pl-8">
                                    {/* Rating summary row with nav arrows */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-end gap-1 leading-none">
                                                <span className="text-[42px] font-black text-gray-900 leading-none">4,8</span>
                                                <span className="text-[16px] font-bold text-gray-400 mb-1">/5</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5 pt-1">
                                                <p className="text-[14px] font-black text-gray-900">Sangat Bagus</p>
                                                <p className="text-[12px] text-gray-400 font-medium">Dari 154 review</p>
                                            </div>
                                        </div>
                                        {/* Nav arrows */}
                                        <div className="flex items-center gap-2">
                                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all">
                                                <Icon icon="solar:alt-arrow-left-linear" className="text-gray-600 text-[14px]" />
                                            </button>
                                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all">
                                                <Icon icon="solar:alt-arrow-right-linear" className="text-gray-600 text-[14px]" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Review cards — horizontal scroll, fixed card size */}
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {[
                                            { name: 'Daniel Lim', initial: 'DL', avatarBg: 'bg-purple-500', date: '14 Jun 2026', stars: 5, review: 'Sangat megah! Acara pernikahan keluarga kami berjalan dengan lancar dan semua tamu memuji keindahan hall ini.', tag: 'Tes Venue Rules' },
                                            { name: 'Putri Ayu', initial: 'PA', avatarBg: 'bg-orange-500', date: '10 Jun 2026', stars: 5, review: 'Dekorasi dan lighting-nya sudah sangat bagus dari bawaan venue. Hemat budget dekorasi ekstra!', tag: 'Tes Venue Rules' },
                                            { name: 'Kevin Tan', initial: 'KT', avatarBg: 'bg-cyan-500', date: '5 Jun 2026', stars: 4, review: 'Acara gathering perusahaan kami sangat sukses di sini. Staff sangat helpful dan responsif.', tag: 'Tes Venue Rules' },
                                            { name: 'Nurul Hidayah', initial: 'NH', avatarBg: 'bg-green-500', date: '1 Jun 2026', stars: 5, review: 'Ruangan banquet yang mewah dengan harga yang masuk akal. Sangat merekomendasikan untuk resepsi pernikahan.', tag: 'Tes Venue Rules' },
                                        ].map((rv, i) => (
                                            <div key={i} className="bg-white rounded-[14px] p-4 border border-light-grey flex flex-col gap-2 w-[230px] aspect-square flex-shrink-0 overflow-hidden">
                                                {/* Card header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className={`w-9 h-9 rounded-full ${rv.avatarBg} flex items-center justify-center font-black text-[12px] text-white shrink-0`}>
                                                            {rv.initial}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <p className="text-[12px] font-bold text-gray-900 truncate">{rv.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium truncate">{rv.tag}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-1">{rv.date}</span>
                                                </div>
                                                {/* Stars + score */}
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Icon key={s} icon={s <= rv.stars ? 'solar:star-bold' : 'solar:star-linear'} className={`text-[13px] ${s <= rv.stars ? 'text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                    <span className="text-[11px] text-gray-500 font-bold ml-0.5">{rv.stars}.0/5</span>
                                                </div>
                                                {/* Review text */}
                                                <p className="text-[12px] text-gray-600 font-normal leading-relaxed">{rv.review}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Tulis Ulasan button */}
                                    <button onClick={() => setShowReviewModal(true)} className="mt-4 px-4 py-2 bg-[#194e9e] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#123e80] shadow-sm transition-all">Tulis Ulasan</button>
                                </div>
                            </div>

                            {/* SECTION LOKASI */}
                            <div ref={sectionRefs.lokasi} className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon icon="solar:map-point-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                    <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">Lokasi Venue</h3>
                                </div>
                                <div className="w-full pl-8">
                                    <div className="flex items-center justify-between p-4 bg-white border border-light-grey rounded-[12px] shadow-sm">
                                        <div>
                                            <p className="text-[13px] font-bold text-gray-800">{data?.name || 'Lokasi Venue'}</p>
                                            <p className="text-[12px] text-gray-500 mt-0.5 font-medium">
                                                {data?.location && !data.location.startsWith('http') ? data.location : 'Jl. Gatot Subroto No. 45, Jakarta Raya'}
                                            </p>
                                        </div>
                                        <a
                                            href={data?.location?.startsWith('http') ? data.location : `https://maps.google.com/?q=${encodeURIComponent(data?.location || '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#194e9e] text-white text-[11px] font-bold rounded-full hover:bg-[#123e80] transition-all whitespace-nowrap shrink-0 ml-4"
                                        >
                                            <Icon icon="solar:map-point-outline" className="text-[13px]" />
                                            BUKA PETA
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION FAQ */}
                            <div ref={sectionRefs.faq} className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <Icon icon="solar:question-circle-outline" className="text-[#194e9e] text-[24px] shrink-0" />
                                    <h3 className="text-[20px] font-black text-[#194e9e] tracking-tight">FAQ</h3>
                                </div>
                                <div className="w-full flex flex-col pl-8 gap-4">
                                    {[
                                        { q: 'Berapa kapasitas maksimal Banquet Hall ini?', a: 'Venue ini memiliki kapasitas hingga 600 orang untuk layout theater, 400 orang untuk layout klasik meja bundar, dan 350 orang untuk layout gala dinner.' },
                                        { q: 'Apakah venue menyediakan katering?', a: 'Ya, kami bekerja sama dengan beberapa vendor katering terpercaya. Anda juga dapat menggunakan katering eksternal dengan koordinasi terlebih dahulu.' },
                                        { q: 'Bagaimana kebijakan pembatalan booking?', a: 'Pembatalan lebih dari 7 hari sebelum acara mendapat refund penuh. Pembatalan 3-7 hari dikenakan biaya 50%. Pembatalan kurang dari 3 hari tidak mendapat refund.' },
                                        { q: 'Apakah ada fasilitas parkir?', a: 'Ya, tersedia area parkir luas yang dapat menampung hingga 200 kendaraan roda empat dan 100 sepeda motor.' },
                                        { q: 'Apakah bisa melakukan survei venue sebelum booking?', a: 'Tentu saja. Anda dapat menghubungi kami untuk mengatur jadwal kunjungan survei venue secara gratis sebelum melakukan booking.' }
                                    ].map((faq, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-light-grey overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                                className="w-full flex items-center justify-between p-4 text-left transition-all"
                                            >
                                                <h6 className="text-[13px] font-semibold text-gray-800 pr-4">{faq.q}</h6>
                                                <Icon
                                                    icon="solar:alt-arrow-down-linear"
                                                    className={`text-gray-400 text-[16px] shrink-0 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <p className="text-[12px] text-gray-500 leading-relaxed px-4 pb-4">{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {/* ── MOBILE HERO SECTION ── */}
                        <Box className="!relative px-5 pb-4 pt-4 mt-16">
                            <div className="relative group rounded-[12px] overflow-hidden border border-[#d1d1d1] bg-white/5 h-[165px]">
                                <div className="flex gap-1 h-[165px]">
                                    {/* Main large image */}
                                    <div className="relative flex-[1.6] overflow-hidden">
                                        <div className="absolute inset-0">
                                            <ImageM
                                                src={data?.venue_gallery?.[0]?.image_url || ''}
                                                h="100%" w="100%" fit="cover"
                                                className="cursor-pointer"
                                                onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }}
                                            />
                                        </div>
                                    </div>
                                    {/* Right 2x2 grid */}
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="flex gap-1 flex-1 min-h-0">
                                            <div className="relative flex-1 overflow-hidden">
                                                <div className="absolute inset-0">
                                                    <ImageM src={data?.venue_gallery?.[1]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="cursor-pointer" onClick={() => { setGalleryActiveIdx(1); setShowGallery(true); }} />
                                                </div>
                                            </div>
                                            <div className="relative flex-1 overflow-hidden">
                                                <div className="absolute inset-0">
                                                    <ImageM src={data?.venue_gallery?.[2]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="cursor-pointer" onClick={() => { setGalleryActiveIdx(2); setShowGallery(true); }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 flex-1 min-h-0">
                                            <div className="relative flex-1 overflow-hidden">
                                                <div className="absolute inset-0">
                                                    <ImageM src={data?.creator?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="cursor-pointer" onClick={() => { setGalleryActiveIdx(3); setShowGallery(true); }} />
                                                </div>
                                            </div>
                                            <div className="relative flex-1 overflow-hidden">
                                                <div className="absolute inset-0">
                                                    <ImageM src={data?.venue_gallery?.[3]?.image_url || data?.venue_gallery?.[0]?.image_url || ''} h="100%" w="100%" fit="cover" className="cursor-pointer" onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setGalleryActiveIdx(0); setShowGallery(true); }}
                                    className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-md border border-slate-100"
                                >
                                    <Icon icon="solar:gallery-minimalistic-bold" style={{ color: '#194e9e', fontSize: '14px' }} />
                                    <span style={{ color: '#0f172a', fontSize: '10px', fontWeight: 900 }}>{galleryImages.length} foto</span>
                                </button>
                            </div>
                        </Box>

                        {/* Mobile Details */}
                        <div className="px-5 pb-5 pt-3">
                            <Flex gap={8} justify="space-between" mb={3} align="center">
                                <p className="opacity-70 text-xs uppercase tracking-widest">{data?.has_venue_category?.name || 'Sewa Venue'}</p>
                            </Flex>
                            <h3 className="mb-2 text-[14px] font-black text-gray-900 leading-tight uppercase tracking-tight">{data?.name}</h3>

                            <p className="mb-2 font-normal text-[11px] flex items-center gap-1.5">
                                <Icon icon="solar:wallet-bold-duotone" className="text-gray-400 text-[14px]" />
                                <span className="text-dark">Mulai Dari Rp{(data?.starting_price ?? 95000).toLocaleString('id')} / sesi</span>
                            </p>

                            <p className="font-normal text-[11px] flex items-center gap-1.5">
                                <Icon icon="solar:users-group-rounded-bold-duotone" className="text-gray-400 text-[14px] shrink-0" />
                                <span className="text-dark">Kapasitas {data?.max_capacity || 50} pax</span>
                            </p>
                        </div>

                        {/* Mobile Host Row */}
                        <div className="px-5 py-3 flex items-center gap-3">
                            {data?.creator?.image_url ? (
                                <img src={data.creator.image_url} alt="image" className="w-10 h-10 border border-grey rounded-full object-contain" />
                            ) : (
                                <div className="w-10 h-10 border border-grey rounded-full flex items-center justify-center bg-gray-100">
                                    <Icon icon="solar:user-bold" className="text-gray-400 text-[20px]" />
                                </div>
                            )}
                            <div className="w-full flex flex-col">
                                <p className="text-xs text-gray-500">Diselenggarakan Oleh</p>
                                <p className="font-semibold text-sm text-gray-950">{data?.creator?.name}</p>
                            </div>
                            <ActionIcon
                                color="#0B387C"
                                variant="transparent"
                                size="lg"
                                onClick={() => {
                                    if (typeof navigator !== "undefined" && navigator.share) {
                                        navigator.share({
                                            title: data?.name || document.title,
                                            url: window.location.href
                                        }).catch(err => console.log(err));
                                    } else {
                                        const url = window.location.href;
                                        navigator.clipboard.writeText(url)
                                            .then(() => toast.info("Tautan berhasil disalin!"))
                                            .catch(err => console.error(err));
                                    }
                                }}
                            >
                                <Icon icon="solar:share-linear" className="!text-[26px]" />
                            </ActionIcon>
                        </div>

                        {/* Mobile Navigation Tabs */}
                        <div className="flex bg-white items-center justify-center sticky mb-3 top-16 z-20">
                            <div className="flex gap-3 w-full border-2 text-grey border-primary-light-200 border-x-0 border-t-0 px-7 overflow-x-auto scrollbar-hide">
                                {[
                                    { id: 'info', label: 'Deskripsi' },
                                    { id: 'lapangan', label: 'Booking' },
                                    { id: 'ulasan', label: 'Ulasan' },
                                    { id: 'lokasi', label: 'Lokasi' },
                                    { id: 'faq', label: 'FaQ' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            if (tab.id === 'lapangan') {
                                                router.push(`/venue/${slug}/pilih-jadwal`);
                                            } else {
                                                setActiveSection(tab.id);
                                                const ref = sectionRefs[tab.id as "info" | "ulasan" | "lokasi" | "faq"];
                                                ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                            }
                                        }}
                                        className={`py-3 cursor-pointer whitespace-nowrap text-[12px] ${activeSection === tab.id ? "font-semibold text-[#194e9e] border-b-2 border-primary-base py-3" : "text-grey"}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Body Content */}
                        <div className="w-full text-dark flex flex-col gap-8 pt-2 pb-32 bg-white">
                            {/* MOBILE SECTION DESKRIPSI */}
                            <div ref={sectionRefs.info} className="mx-5 mb-2">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Icon icon="solar:notes-linear" className="text-[#0b387c] text-[16px] shrink-0" />
                                    <h3 className="text-[14px] font-black text-[#0b387c] tracking-tight">Deskripsi Venue</h3>
                                </div>
                                <div className="w-full bg-transparent pl-0 pr-0 text-gray-600 leading-normal text-[12px] font-medium">
                                    <p className="whitespace-pre-line leading-relaxed">{data?.description}</p>
                                </div>

                                {data?.venue_rules && data.venue_rules.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-[12px] font-bold text-gray-900 mb-1.5">Aturan Venue</h4>
                                        <ul className="flex flex-col gap-2">
                                            {data.venue_rules.map((rule: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-600 font-medium leading-relaxed">
                                                    <span className="w-3.5 h-3.5 rounded-full border border-[#d1d1d1] bg-[#194e9e]/5 flex items-center justify-center shrink-0 mt-0.5">
                                                        <span className="w-1 h-1 rounded-full bg-[#194e9e]/60"></span>
                                                    </span>
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>


                            {/* MOBILE SECTION FASILITAS */}
                            <div className="mx-5 mb-2">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Icon icon="solar:tea-cup-linear" className="text-[#0b387c] text-[16px] shrink-0" />
                                    <h3 className="text-[14px] font-black text-[#0b387c] tracking-tight">Fasilitas Venue</h3>
                                </div>
                                <div
                                    className="overflow-hidden transition-all duration-500 ease-in-out"
                                    style={{ maxHeight: expandedSections['fasilitas'] ? '2000px' : '120px' }}
                                >
                                    <div className="flex flex-col gap-4 pb-2">
                                        {(groupedFacilities.length > 0 ? groupedFacilities : [
                                            ['Capacity', ['600 pax (Main Auditorium)', '350 pax (Balcony)', 'Full AC', 'Chairs (According to Number of Pax)', '2 Guest Registration Table']],
                                            ['Sound System', ['3 wireless mic shure SLX', '4 wired mic shure SM 58', 'Speaker FOH Meyer Melodia', 'Speaker Monitor', 'Mixer']],
                                            ['Moving Light', ['16 unit PAR LED', '2 unit ST Ranger', '4 unit Beam', '4 unit Fresnel', '2 unit Leko']],
                                            ['Additional', ['LED Videotron 8×5 Unilum', '2 LED Screen 2×3s', 'Music instruments: Drum, Guitar, Bass, Keyboard']],
                                        ] as [string, string[]][]).map(([category, items]) => (
                                            <div key={category} className="flex flex-col gap-2">
                                                <h4 className="text-[12px] font-bold text-gray-900 uppercase">{category}</h4>
                                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                                    {items.map((item, i) => (
                                                        <div key={i} className="px-3 py-1.5 rounded-full bg-white border border-[#d1d1d1] text-[11px] font-semibold text-gray-700 whitespace-nowrap shrink-0">
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleExpand('fasilitas')}
                                    className="text-[#194e9e] text-[10px] font-semibold flex items-center gap-1 mt-1 hover:underline transition-all"
                                >
                                    {expandedSections['fasilitas'] ? 'Sembunyikan' : 'Baca Selengkapnya'}
                                    <Icon
                                        icon="solar:alt-arrow-down-linear"
                                        className={`text-[10px] transition-transform duration-300 ${expandedSections['fasilitas'] ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            </div>


                            {/* MOBILE SECTION ULASAN */}
                            <div ref={sectionRefs.ulasan} className="mx-5 mb-2">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Icon icon="solar:star-linear" className="text-[#0b387c] text-[16px] shrink-0" />
                                    <h3 className="text-[14px] font-black text-[#0b387c] tracking-tight">Ulasan Pengunjung</h3>
                                </div>
                                <div className="flex items-center justify-start gap-2 mb-4">
                                    <button onClick={() => setShowReviewModal(true)} className="px-3 py-1.5 bg-[#194e9e] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#123e80]">Tulis Ulasan</button>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {[
                                        { name: "Rizky Pratama", initial: 'R', color: 'bg-red-100 text-red-600', date: "12 Mar 2026", stars: 5, review: "Fasilitas lengkap, AC dingin, dan pencahayaan lapangan oke banget. Recommended!" },
                                        { name: "Ayu Lestari", initial: 'A', color: 'bg-blue-100 text-blue-600', date: "8 Mar 2026", stars: 5, review: "Tempatnya bersih, staffnya ramah, dan booking-nya gampang banget lewat Kolektix. 10/10!" }
                                    ].map((rv, i) => (
                                        <div key={i} className="bg-white rounded-[16px] p-4 border border-light-grey w-[200px] aspect-square flex-shrink-0 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-8 h-8 rounded-full ${rv.color} flex items-center justify-center font-black text-[11px] shrink-0`}>
                                                    {rv.initial}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <p className="text-[11px] font-bold text-gray-800 truncate">{rv.name}</p>
                                                    <p className="text-[9px] text-gray-400">{rv.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 mb-2">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Icon key={s} icon={s <= rv.stars ? 'solar:star-bold' : 'solar:star-linear'} className="text-[10px] text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-[12px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                                                {rv.review}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* MOBILE SECTION LOKASI */}
                            <div ref={sectionRefs.lokasi} className="w-full">
                                <div className="flex items-center gap-1.5 mb-1 mx-5">
                                    <Icon icon="solar:map-point-linear" className="text-[#0b387c] text-[16px] shrink-0" />
                                    <h3 className="text-[14px] font-black text-[#0b387c] tracking-tight">Lokasi Venue</h3>
                                </div>
                                <div className="mx-5 bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-light-grey">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <h4 className="text-[13px] font-bold text-black tracking-tight">{data?.name}</h4>
                                        <p className="text-[11px] text-gray-500 leading-normal line-clamp-2 break-words">{data?.location}</p>
                                    </div>
                                    <button
                                        onClick={() => window.open(`https://google.com/maps/search/${encodeURIComponent((data?.name || '') + ' ' + (data?.location || ''))}`, '_blank')}
                                        className="w-full py-2.5 bg-primary-base hover:bg-primary-dark text-white rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                                    >
                                        <Icon icon="solar:map-point-bold" className="text-[14px]" />
                                        Buka Peta
                                    </button>
                                </div>
                            </div>


                            {/* MOBILE SECTION FAQ */}
                            <div ref={sectionRefs.faq} className="mx-5 mb-10 pt-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Icon icon="solar:info-circle-linear" className="text-[#0b387c] text-[16px] shrink-0" />
                                    <h3 className="text-[14px] font-black text-[#0b387c] tracking-tight">Pertanyaan Umum</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { q: 'Apakah bisa menyewa raket atau bola di lokasi?', a: 'Ya, kami menyediakan penyewaan alat dengan harga terjangkau.' },
                                        { q: 'Bagaimana jika hujan saat jadwal main saya?', a: 'Sebagian besar lapangan kami semi-indoor/indoor. Jika outdoor tidak dapat digunakan, Anda dapat meminta reschedule.' },
                                        { q: 'Apakah ada fasilitas kamar mandi & loker?', a: 'Tentu. Tersedia toilet, kamar bilas, dan loker gratis.' },
                                    ].map((faq, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-light-grey overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                                className="w-full flex items-center justify-between p-4 text-left transition-all"
                                            >
                                                <h6 className="text-[12px] font-black text-gray-900 pr-4">{faq.q}</h6>
                                                <Icon
                                                    icon="solar:alt-arrow-down-linear"
                                                    className={`text-gray-400 text-[14px] shrink-0 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <p className="text-[11px] text-gray-500 leading-normal px-4 pb-4">{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {/* ── BOTTOM BOOKING BAR – Mobile ── */}
                <div className="md:hidden w-full fixed bottom-0 bg-white z-50 border-t border-[#d1d1d1] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                    <div className="flex flex-col gap-2 px-4 py-2.5 max-w-lg mx-auto">
                        {/* Top: Price */}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Mulai</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-base font-black text-gray-900 leading-none">
                                    {(data?.starting_price ?? 95000) >= 10000000 ? (
                                        <>
                                            Rp{((data?.starting_price ?? 95000) / 1000).toLocaleString('id')}
                                            <span className="ml-1 text-[7px] font-black tracking-widest uppercase bg-green-50 text-green-600 px-1.5 py-[2px] rounded-md border border-green-200/50 leading-none">
                                                MILLION
                                            </span>
                                        </>
                                    ) : (
                                        `Rp${(data?.starting_price ?? 95000).toLocaleString('id')}`
                                    )}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400">/sesi</span>
                            </div>
                        </div>
                        {/* Right: Button + Chat */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push(`/venue/${slug}/pilih-jadwal`)}
                                className="flex-1 h-[40px] rounded-xl font-black text-[11px] uppercase tracking-widest bg-[#194e9e] text-white hover:bg-[#123e80] active:scale-95 transition-all shadow-lg shadow-[#194e9e]/20"
                            >
                                Pilih Jadwal
                            </button>
                            {/* Chat button */}
                            <button
                                onClick={() => setOpenChat(true)}
                                className="w-[40px] h-[40px] flex items-center justify-center shrink-0 rounded-xl bg-[#194e9e] text-white border border-[#194e9e] hover:bg-[#123e80] active:scale-95 transition-all"
                            >
                                <Icon icon="solar:chat-round-dots-bold" className="text-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BOOKING BAR – Desktop ── */}
                <div className="hidden md:block w-full fixed bottom-0 bg-white z-50 border-t border-[#d1d1d1] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between px-6 md:px-16 py-4 max-w-none w-full">
                        {/* Left: Price details */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-semibold text-gray-400">
                                Mulai dari
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-gray-900 leading-none">
                                    {(data?.starting_price ?? 95000) >= 10000000 ? (
                                        <>
                                            Rp{((data?.starting_price ?? 95000) / 1000).toLocaleString('id')}
                                            <span className="ml-1 text-[8px] font-black tracking-widest uppercase bg-green-50 text-green-600 px-1.5 py-[2px] rounded-md border border-green-200/50 leading-none">
                                                MILLION
                                            </span>
                                        </>
                                    ) : (
                                        `Rp${(data?.starting_price ?? 95000).toLocaleString('id')}`
                                    )}
                                </span>
                                <span className="text-[11px] font-normal text-gray-900">/sesi</span>
                            </div>
                        </div>
                        {/* Right: Booking CTA */}
                        <div>
                            <button
                                onClick={() => router.push(`/venue/${slug}/pilih-jadwal`)}
                                className="h-[46px] px-8 rounded-lg font-bold text-xs uppercase tracking-[0.1em] bg-[#7294cf] text-white hover:bg-[#6183be] active:scale-95 transition-all shadow-md shadow-[#7294cf]/20"
                            >
                                {activeSection === 'info' ? 'PILIH JADWAL' : 'BOOKING'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Modal */}
                <Modal opened={modalBooking} onClose={() => setModalBooking(false)} title="Pilih Tanggal Booking" centered radius="lg">
                    <Stack gap={15}>
                        <DatePickerInput
                            type="range"
                            label="Tanggal Sewa"
                            placeholder="Pilih Tanggal Booking Berupa Kalender"
                            value={[date.start ? new Date(date.start) : null, date.end ? new Date(date.end) : null]}
                            onChange={(val) => setDate({
                                start: val[0] ? moment(val[0]).format('YYYY-MM-DD') : '',
                                end: val[1] ? moment(val[1]).format('YYYY-MM-DD') : ''
                            })}
                            minDate={new Date()}
                            valueFormat="DD MMMM YYYY"
                            w="100%"
                            size="md"
                            leftSection={<Icon icon="solar:calendar-bold" className="text-gray-500 text-lg" />}
                        />
                        <ButtonM
                            loading={loading.includes('submit')}
                            disabled={!date.start || !date.end}
                            onClick={handleOrder}
                            color="#194e9e"
                            radius="xl"
                            fullWidth
                            size="lg"
                            className="!font-extrabold"
                        >
                            Booking Sekarang
                        </ButtonM>
                    </Stack>
                </Modal>

                {/* ── GALLERY LIGHTBOX ── fullscreen overlay, no card border ── */}
                {showGallery && (
                    <div className="fixed inset-0 z-[9999] bg-black flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) setShowGallery(false); }}>
                        {/* Counter top center */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white text-[13px] font-bold bg-black/40 px-3 py-1 rounded-full">
                            {galleryActiveIdx + 1} / {galleryImages.length}
                        </div>
                        {/* Close button top right */}
                        <button
                            onClick={() => setShowGallery(false)}
                            className="absolute top-4 right-5 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        {/* Main Image */}
                        <div className="flex-1 flex items-center justify-center relative px-16">
                            <img
                                src={galleryImages[galleryActiveIdx]}
                                alt={`Foto ${galleryActiveIdx + 1}`}
                                className="max-h-full max-w-full object-contain select-none"
                                draggable={false}
                            />
                            {/* Prev button */}
                            <button
                                onClick={() => setGalleryActiveIdx(i => (i - 1 + galleryImages.length) % galleryImages.length)}
                                className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
                            >
                                <Icon icon="solar:alt-arrow-left-bold" className="text-[22px]" />
                            </button>
                            {/* Next button */}
                            <button
                                onClick={() => setGalleryActiveIdx(i => (i + 1) % galleryImages.length)}
                                className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all"
                            >
                                <Icon icon="solar:alt-arrow-right-bold" className="text-[22px]" />
                            </button>
                        </div>
                        {/* Thumbnail strip bottom */}
                        <div className="flex items-center justify-center gap-2.5 py-4 bg-black/50">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setGalleryActiveIdx(idx)}
                                    className={`w-14 h-14 rounded-xl overflow-hidden transition-all ${idx === galleryActiveIdx ? 'ring-2 ring-white opacity-100 scale-105' : 'opacity-40 hover:opacity-70'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── DETAIL & ATURAN MODAL ── */}
                <Modal
                    opened={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title={<Text fw={900} className="uppercase tracking-[0.1em] text-primary-base">Detail & Aturan Venue</Text>}
                    radius={isMobile ? 0 : 16}
                    fullScreen={isMobile}
                    withCloseButton
                    closeButtonProps={{ iconSize: 24, className: "text-gray-900 hover:bg-gray-100" }}
                    styles={{
                        inner: isMobile ? { padding: '0 !important' } : undefined,
                        content: { boxShadow: isMobile ? 'none' : '0 10px 40px -10px rgba(0, 0, 0, 0.2)', overflow: 'hidden' },
                        header: { padding: '24px 24px 16px 24px' },
                        title: { width: '100%' },
                        body: { padding: '0px 24px 32px 24px' }
                    }}
                >
                    <div className="flex flex-col gap-6">
                        <div>
                            <Text fw={900} className="text-lg text-gray-900 mb-3">Fasilitas Venue</Text>
                            <div className="grid grid-cols-2 gap-3">
                                {data?.facility?.map((f: string, i: number) => {
                                    const facilityIcons: Record<string, string> = {
                                        'DP': 'solar:card-bold', 'Down Payment': 'solar:card-bold',
                                        'Reschedule': 'solar:calendar-date-bold',
                                        'promo': 'solar:tag-bold', 'voucher': 'solar:tag-bold',
                                        'Kamar Mandi': 'solar:bath-bold', 'Shower': 'solar:bath-bold',
                                        'Parkir': 'solar:parking-bold', 'Wifi': 'solar:wifi-bold',
                                        'AC': 'solar:wind-bold',
                                    };
                                    const icon = Object.keys(facilityIcons).find(k => f.toLowerCase().includes(k.toLowerCase()));
                                    return (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <Icon icon={icon ? facilityIcons[icon] : 'solar:check-circle-bold'} className="text-primary-base text-lg" />
                                            <Text size="sm" fw={700} className="text-gray-700">{f}</Text>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-black/5"></div>

                        <div>
                            <Text fw={900} className="text-lg text-gray-900 mb-3">Aturan Main</Text>
                            <Stack gap={10}>
                                {[
                                    { text: 'Gunakan sepatu olahraga indoor yang bersih', icon: 'solar:running-bold' },
                                    { text: 'Dilarang merokok di area lapangan', icon: 'solar:forbidden-circle-bold' },
                                    { text: 'Harap datang 15 menit sebelum jadwal dimulai', icon: 'solar:clock-circle-bold' },
                                    { text: 'Menjaga kebersihan dan ketertiban area', icon: 'solar:trash-bin-minimalistic-bold' },
                                    { text: 'Perubahan jadwal maksimal 24 jam sebelumnya', icon: 'solar:calendar-date-bold' },
                                ].map((rule, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <Icon icon={rule.icon} className="text-orange-400 text-[18px] mt-0.5 shrink-0" />
                                        <Text size="sm" fw={600} className="text-gray-600">{rule.text}</Text>
                                    </div>
                                ))}
                            </Stack>
                        </div>
                    </div>
                </Modal>

                {/* ── TULIS ULASAN MODAL ── */}
                <Modal
                    opened={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    title={<Text fw={900} className="uppercase tracking-[0.1em] text-primary-base">Berikan Ulasan</Text>}
                    centered
                    radius="24px"
                    styles={{
                        content: { overflow: 'hidden' },
                        body: { padding: '24px' }
                    }}
                >
                    <div className="flex flex-col gap-5">
                        <Text size="sm" c="dimmed">Bagaimana pengalaman Anda beraktivitas di venue ini? Penilaian Anda akan sangat membantu.</Text>
                        <div className="flex items-center justify-center gap-2 my-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewStars(star)} className="hover:scale-110 active:scale-90 transition-all">
                                    <Icon icon={star <= reviewStars ? "solar:star-bold" : "solar:star-linear"} className={`text-[40px] ${star <= reviewStars ? 'text-yellow-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                        <div>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[14px] outline-none focus:ring-2 focus:ring-[#194e9e]/20 focus:border-[#194e9e] transition-all"
                                rows={4}
                                placeholder="Ceritakan pengalaman Anda di sini (opsional)..."
                                value={reviewInput}
                                onChange={(e) => setReviewInput(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setShowReviewModal(false);
                                setReviewInput("");
                                setReviewStars(0);
                            }}
                            className="w-full py-3 rounded-xl font-black text-[13px] uppercase tracking-widest bg-[#194e9e] text-white shadow-lg shadow-[#194e9e]/30 hover:bg-[#123e80] active:scale-95 transition-all"
                        >
                            Kirim Ulasan
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default VenueDetail;