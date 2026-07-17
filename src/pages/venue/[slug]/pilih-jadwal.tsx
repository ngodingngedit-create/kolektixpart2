import React, { useEffect, useMemo, useRef, useState } from 'react';
import foto from '../../../assets/images/Banner-amis.png';
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
import { ActionIcon, AspectRatio, Box, Button as ButtonM, Card, Flex, Image as ImageM, Modal, NumberFormatter, Stack, Text, UnstyledButton, Tooltip, Popover, Drawer } from '@mantine/core';
import { VenueListResponse } from '../../dashboard/venue/type';
import useLoggedUser from '@/utils/useLoggedUser';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';
import Chat from '@/components/chat';
import { DateInput as DateInputM, DatePickerInput, DatePicker } from '@mantine/dates';
import moment from 'moment';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react/dist/iconify.js';
import AuthModal from '@/components/AuthModal';

const facility = ['Free Wifi', 'Toilet', 'Ruangan Full AC', 'Kursi', 'Lighting', 'Stage', 'Parking Area', 'Rest Area', 'Sound System', 'Back Stage'];

export type FacilitiesList = { facility_name: string; facility_description: string };

// --- Generate all days for the current month of baseDate ---
const generateDateStrip = (baseDate: Date) => {
    const days: Date[] = [];
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

// --- Generate time slots for a court (Google Calendar Style) ---
const generateTimeSlots = (courtNum: number, date: Date) => {
    // Basic variability: use the date to shift the booked slots
    const dayShift = date.getDate() % 3;
    const booked = courtNum === 1
        ? [6, 7, 8, 9, 10, 11, 12, 13].map(h => (h + dayShift) % 24)
        : courtNum === 2
            ? [8, 9, 14, 15].map(h => (h + dayShift) % 24)
            : [10, 11, 12].map(h => (h + dayShift) % 24);

    // Some courts might be "Closed" or "Fully Booked" on certain dates for simulation
    const isFullyBooked = (date.getDay() === 0 && courtNum === 3); // Sunday, Court 3 is closed

    const slots = [];
    for (let h = 0; h < 24; h++) {
        const start = `${String(h).padStart(2, '0')}:00`;
        const end = `${String(h + 1 < 24 ? h + 1 : 0).padStart(2, '0')}:00`;
        const isBooked = isFullyBooked || booked.includes(h);
        const isOffHours = h < 6 || h >= 22;
        slots.push({ start, end, isBooked, isOffHours, price: 95000 + (courtNum - 1) * 20000 });
    }
    return slots;
};

const daysIdShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthsIdShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

// ── Day Detail Content Panel ──────────────────────────────────────────────────
type DayDetailStatus = 'available' | 'limited' | 'full' | 'promo' | 'past';
interface DayDetailProps {
    data: any; // Venue data
    selectedCalDate: Date | null;
    selectedDuration: 'half' | 'full' | 'custom';
    setSelectedDuration: (d: 'half' | 'full' | 'custom') => void;
    durationPricing: { half: number; full: number; custom: number };
    status: DayDetailStatus;
    customStartTime: string;
    setCustomStartTime: (t: string) => void;
    customEndTime: string;
    setCustomEndTime: (t: string) => void;
    onConfirm: () => void;
    onClose: () => void;
    isMobile?: boolean;
}

// ── TimePickerDropdown Sub-component ──
const TimePickerDropdown: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    disabledOptions?: string[];
    icon?: string;
}> = ({ label, value, onChange, options, disabledOptions = [], icon = "solar:clock-circle-bold" }) => {
    const [opened, setOpened] = useState(false);
    return (
        <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[10px] font-medium tracking-widest text-gray-400 pl-1">{label}</span>
            <div className="relative">
                <button
                    onClick={() => setOpened(o => !o)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left bg-white
                        ${opened ? 'border-[#194e9e] shadow-[0_8px_20px_-6px_rgba(25,78,158,0.12)]' : 'border-[rgb(224,224,224)] hover:border-[#194e9e]/40'}
                    `}
                >
                    <div className="flex items-center gap-2.5">
                        <Icon icon={icon} className={`text-[18px] ${opened ? 'text-[#194e9e]' : 'text-gray-400'}`} />
                        <span className="text-[14px] font-semibold text-gray-900 tracking-tight">{value}</span>
                    </div>
                    <Icon icon="solar:alt-arrow-down-bold" className={`text-[14px] transition-transform duration-300 ${opened ? 'rotate-180 text-[#194e9e]' : 'text-gray-300'}`} />
                </button>

                {opened && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setOpened(false)} />
                        <div className="absolute top-full left-0 right-0 mt-2 z-[70] bg-white rounded-xl shadow-2xl border border-[rgb(224,224,224)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-[220px] overflow-y-auto py-2 pr-1 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-[rgb(224,224,224)] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                                {options.map(time => {
                                    const isDisabled = disabledOptions.includes(time);
                                    const isActive = value === time;
                                    return (
                                        <button
                                            key={time}
                                            disabled={isDisabled}
                                            onClick={() => {
                                                onChange(time);
                                                setOpened(false);
                                            }}
                                            className={`w-full px-6 py-2.5 text-left text-[14px] font-bold transition-all flex items-center justify-between
                                                ${isDisabled ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' :
                                                    isActive ? 'text-[#194e9e] bg-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                            `}
                                        >
                                            <div className="flex flex-col">
                                                <span>{time}</span>
                                                {isDisabled && <span className="text-[9px] text-red-300 font-medium leading-none">Sudah dibooking</span>}
                                            </div>
                                            {isActive && <Icon icon="solar:check-circle-bold" className="text-[16px] text-[#194e9e]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Availability Timeline Sub-component ──
const AvailabilityTimeline: React.FC<{ bookedHours: string[] }> = ({ bookedHours }) => {
    const hours = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`); // 08:00 to 22:00
    const markers = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

    return (
        <div className="flex flex-col gap-5 mb-8">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold tracking-[0.15em] text-gray-900 leading-none">Ikhtisar Ketersediaan</span>
                    <span className="text-[10px] font-medium text-gray-400">Pengecekan slot waktu yang tersedia hari ini.</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                        <span className="text-[9px] font-medium text-gray-500 tracking-widest">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
                        <span className="text-[9px] font-medium text-gray-500 tracking-widest">Sudah dibooking</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="flex items-stretch h-10 w-full bg-gray-50 rounded-xl overflow-hidden border border-[rgb(224,224,224)] shadow-inner">
                    {hours.map((h, i) => {
                        const isBooked = bookedHours.includes(h);
                        return (
                            <Tooltip key={h} label={h} position="top" withArrow transitionProps={{ transition: 'fade', duration: 200 }}>
                                <div className={`flex-1 transition-all duration-500 border-r border-white/30 last:border-0 relative ${isBooked ? 'bg-red-500' : 'bg-green-500'}`}>
                                    {/* Sub-divider for half hour */}
                                    <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10"></div>
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
                {/* Visual grid lines overlay for better readability */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-[3.3%]">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="h-full w-px bg-black/5 last:hidden"></div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between px-0.5">
                {markers.map(m => (
                    <span key={m} className="text-[10px] font-black text-gray-400 tabular-nums">
                        {m}
                    </span>
                ))}
            </div>
        </div>
    );
};

const DayDetailContent: React.FC<DayDetailProps> = ({
    data, selectedCalDate, selectedDuration, setSelectedDuration, durationPricing, status,
    customStartTime, setCustomStartTime, customEndTime, setCustomEndTime,
    onConfirm, onClose, isMobile
}) => {
    const dateKey = selectedCalDate ? moment(selectedCalDate).format('YYYY-MM-DD') : '';
    const bookedHours = data?.has_booked_venue
        ?.filter((e: any) => e?.start_date?.startsWith(dateKey))
        ?.map((e: any) => e.start_date.split('T')[1]?.substring(0, 5) || e.start_date.split(' ')[1]?.substring(0, 5)) || [];

    // Duration availability checks
    const checkAvailability = (startH: number, endH: number) => {
        for (let h = startH; h < endH; h++) {
            if (bookedHours.includes(`${String(h).padStart(2, '0')}:00`)) return false;
        }
        return true;
    };

    const halfDayAvailable = checkAvailability(8, 12);
    const fullDayAvailable = checkAvailability(8, 16);

    // Calculate custom duration and availability
    // Calculate custom duration and availability
    const startH = parseInt(customStartTime.split(':')[0]);
    const endH = parseInt(customEndTime.split(':')[0]);
    const customHours = Math.max(0, endH - startH);
    const customAvailable = checkAvailability(startH, endH);
    const isWeekend = selectedCalDate && (selectedCalDate.getDay() === 0 || selectedCalDate.getDay() === 6);

    const durations: { key: 'half' | 'full' | 'custom'; label: string; sub: string; range: string; available: boolean }[] = [
        { key: 'half', label: 'Setengah Hari', sub: 'Ideal untuk acara singkat', range: '08:00 – 12:00', available: halfDayAvailable },
        { key: 'full', label: 'Satu Hari Penuh', sub: 'Paling banyak dipilih', range: '08:00 – 16:00', available: fullDayAvailable },
        { key: 'custom', label: 'Pilih Jam Sendiri', sub: 'Fleksibel sesuai keinginan', range: 'Custom', available: customAvailable },
    ];

    // Price calculation
    const currentBasePrice = isWeekend ? 250000 : (data?.starting_price ?? 150000);
    const hourlyPrice = currentBasePrice / 8;
    const customPrice = customHours * hourlyPrice;

    const currentOption = durations.find(d => d.key === selectedDuration);
    const isCurrentAvailable = currentOption?.available ?? false;
    const totalPrice = selectedDuration === 'custom' ? customPrice : durationPricing[selectedDuration];

    return (
        <div className="flex flex-col gap-0 px-2 md:px-10 pt-4 md:pt-6 pb-6">
            {/* 2. Time Selection Section */}
            <div className="mb-5 md:mb-6 px-1">
                <h3 className="text-[15px] md:text-[17px] font-semibold text-gray-900 tracking-tight leading-none">Pilih waktu penggunaan</h3>
                <p className="text-[10px] md:text-[11px] font-medium text-gray-400 tracking-widest mt-2">Sesuaikan durasi dengan rencana acara Anda.</p>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-10">
                {durations.map(dur => (
                    <div key={dur.key} className="flex flex-col gap-3">
                        <button
                            onClick={() => setSelectedDuration(dur.key)}
                            className={`flex items-center justify-between px-3.5 py-4 md:px-6 md:py-5 rounded-2xl border-2 transition-all w-full text-left bg-white
                                ${selectedDuration === dur.key
                                    ? 'border-[#194e9e] shadow-[0_12px_30px_-6px_rgba(25,78,158,0.1)] ring-4 ring-[#194e9e]/5'
                                    : 'border-[rgb(224,224,224)]/80 hover:border-[#194e9e]/20'
                                }
                                ${!dur.available ? 'opacity-70 bg-gray-50/10' : ''}
                            `}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 md:gap-0">
                                <div className="flex items-start md:items-center gap-4 group-hover:translate-x-1 transition-transform duration-500">
                                    {/* Radio Circle */}
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 md:mt-0 ${selectedDuration === dur.key ? (dur.available ? 'border-[#194e9e] bg-white' : 'border-red-500 bg-white') : 'border-gray-200'}`}>
                                        {selectedDuration === dur.key && <div className={`w-3 h-3 rounded-full ${dur.available ? 'bg-[#194e9e]' : 'bg-red-500'}`} />}
                                    </div>
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-[15px] md:text-[17px] font-semibold tracking-tight leading-none ${selectedDuration === dur.key ? 'text-gray-900' : 'text-gray-700'}`}>{dur.label}</span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {!dur.available && (
                                                    <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-100 text-red-500 text-[8px] font-semibold tracking-widest leading-none">Terbatas</span>
                                                )}
                                                {dur.available && dur.key !== 'custom' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-green-50 border border-green-100 text-green-600 text-[8px] font-semibold tracking-widest leading-none">Tersedia</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[11px] md:text-[12px] font-medium text-gray-400 line-clamp-1">{dur.sub}</span>
                                    </div>
                                </div>

                                {/* Slot Info - Vertical Divider only on Desktop */}
                                <div className="flex items-center md:items-end justify-between md:justify-center md:flex-col md:shrink-0 md:pl-5 md:border-l border-gray-100 md:ml-4 pt-3 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0">
                                    <div className="flex flex-col items-start md:items-end md:mb-1">
                                        <span className={`text-[13px] md:text-[16px] font-semibold tracking-tight ${selectedDuration === dur.key ? (dur.available ? 'text-[#194e9e]' : 'text-red-500') : 'text-gray-900'}`}>
                                            {dur.range}
                                        </span>
                                    </div>
                                    {dur.key !== 'custom' && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[12px] md:text-[14px] font-medium text-gray-900 whitespace-nowrap">Rp{durationPricing[dur.key].toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* 3. Custom Time Input (Conditional) */}
                        {dur.key === 'custom' && selectedDuration === 'custom' && (
                            <div className="mx-1 mt-1 mb-2 animate-in slide-in-from-top-3 fade-in duration-500 fill-mode-forwards">
                                <div className="bg-[#fcfdff] rounded-2xl border border-[rgb(224,224,224)] p-4 md:p-8 shadow-sm">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-5">
                                        <TimePickerDropdown
                                            label="Waktu Mulai"
                                            value={customStartTime}
                                            onChange={setCustomStartTime}
                                            options={['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']}
                                            disabledOptions={bookedHours}
                                        />
                                        <div className="hidden sm:flex self-end mb-4 h-px w-6 bg-gray-200"></div>
                                        <TimePickerDropdown
                                            label="Waktu Selesai"
                                            value={customEndTime}
                                            onChange={setCustomEndTime}
                                            options={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']}
                                            disabledOptions={[
                                                ...bookedHours,
                                                ...['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].filter(t => t <= customStartTime)
                                            ]}
                                        />
                                    </div>
                                    <p className="mt-3 text-[9px] font-bold text-gray-400 italic">* Pilih jam mulai dan selesai. Jam yang sudah dibooking tidak tersedia.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 4. Summary & Button Section */}
            <div className="mt-2 pt-8 md:pt-10 border-t border-[rgb(224,224,224)] flex flex-col gap-8 md:gap-10">
                <div className="flex flex-col sm:flex-row-reverse items-stretch sm:items-center justify-between gap-5 md:gap-6 px-1">
                    {/* 1. Durasi & Tanggal (Top on mobile) */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pb-4 md:pb-0">
                        <div className="flex flex-col items-start md:items-end md:pr-5">
                            <span className="text-[9px] md:text-[10px] font-medium tracking-widest text-gray-400 leading-none mb-1.5">Durasi</span>
                            <span className="text-[14px] md:text-[15px] font-semibold text-gray-900 leading-none">
                                {selectedDuration === 'half' ? '4 Jam' : selectedDuration === 'full' ? '8 Jam' : `${customHours} Jam`}
                            </span>
                        </div>
                        {/* Summary Divider */}
                        <div className="w-px h-8 bg-[rgb(214,214,214)] mx-2" />
                        <div className="flex flex-col items-end md:pl-5">
                            <span className="text-[9px] md:text-[10px] font-medium tracking-widest text-gray-400 leading-none mb-1.5">Tanggal</span>
                            <span className="text-[14px] md:text-[15px] font-semibold text-[#194e9e] leading-none whitespace-nowrap">
                                {selectedCalDate ? moment(selectedCalDate).format('DD MMM YYYY') : '-'}
                            </span>
                        </div>
                    </div>

                    {/* 2. Ringkasan Estimasi (Bottom on mobile) */}
                    <div className="flex flex-col gap-1 border-t md:border-t-0 border-[rgb(214,214,214)] pt-5 md:pt-0">
                        <span className="text-[9px] md:text-[10px] font-semibold tracking-widest text-black leading-none">Ringkasan estimasi</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[18px] md:text-[22px] font-bold text-gray-900 tracking-tighter leading-none">
                                Rp{totalPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[11px] md:text-[12px] font-medium text-gray-400">Total biaya</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CustomCalendarProps {
    value: Date;
    onChange: (d: Date) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ value, onChange }) => {
    const [viewDate, setViewDate] = useState<Date>(new Date(value));
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        setViewDate(new Date(value));
    }, [value]);

    const days = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        let startDay = firstDay.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        startDay = startDay === 0 ? 6 : startDay - 1; // Mon = 0, ..., Sun = 6

        const cells = [];
        const prevMonthLast = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            cells.push({
                date: new Date(year, month - 1, prevMonthLast - i),
                isCurrent: false,
            });
        }

        const currentMonthLast = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= currentMonthLast; i++) {
            cells.push({
                date: new Date(year, month, i),
                isCurrent: true,
            });
        }

        const remaining = 42 - cells.length;
        for (let i = 1; i <= remaining; i++) {
            cells.push({
                date: new Date(year, month + 1, i),
                isCurrent: false,
            });
        }
        return cells;
    }, [viewDate]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    return (
        <div className="w-[280px] bg-white p-3 flex flex-col font-sans select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <button 
                    onClick={handlePrevMonth} 
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center justify-center border-0 bg-transparent cursor-pointer"
                >
                    <Icon icon="solar:alt-arrow-left-outline" className="text-[16px]" />
                </button>
                <span className="font-semibold text-[15px] text-gray-800">
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button 
                    onClick={handleNextMonth} 
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center justify-center border-0 bg-transparent cursor-pointer"
                >
                    <Icon icon="solar:alt-arrow-right-outline" className="text-[16px]" />
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-y-1 mb-2 text-center text-[12px] font-semibold text-gray-400">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span className="text-red-400">Sa</span>
                <span className="text-red-400">Su</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {days.map((cell, idx) => {
                    const isSelected = cell.date.getDate() === value.getDate() &&
                        cell.date.getMonth() === value.getMonth() &&
                        cell.date.getFullYear() === value.getFullYear();
                    const isWeekend = (idx % 7 === 5) || (idx % 7 === 6);

                    let textColor = "text-gray-800";
                    if (!cell.isCurrent) {
                        textColor = "text-gray-300";
                    } else if (isWeekend) {
                        textColor = "text-red-500";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => onChange(cell.date)}
                            className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center text-[13px] font-medium transition-all border-0 outline-none
                                ${isSelected
                                    ? 'bg-[#194e9e] text-white font-bold'
                                    : cell.isCurrent
                                        ? 'hover:bg-gray-100 cursor-pointer'
                                        : 'cursor-pointer'
                                } ${isSelected ? '' : textColor}
                            `}
                        >
                            {cell.date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

const PilihJadwal = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [galleryIndex, setGalleryIndex] = useState(0);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
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
        booking: React.useRef<HTMLDivElement>(null),
        ulasan: React.useRef<HTMLDivElement>(null),
        lokasi: React.useRef<HTMLDivElement>(null),
    };
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showMobileDetail, setShowMobileDetail] = useState(false);
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
    const dateStripRef = React.useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // --- NEW: Calendar booking state ---
    const [selectedCalDate, setSelectedCalDate] = useState<Date>(new Date());
    const [showDayDetail, setShowDayDetail] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState<'half' | 'full' | 'custom'>('full');
    const [customStartTime, setCustomStartTime] = useState('09:00');
    const [customEndTime, setCustomEndTime] = useState('13:00');
    const [isEditingSidebar, setIsEditingSidebar] = useState(false);
    const [popoverOpened, setPopoverOpened] = useState(false);

    // Detect mobile on mount and resize
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Court/Schedule state (kept for right sidebar & order flow)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const dateStrip = useMemo(() => generateDateStrip(selectedDate), [selectedDate.toDateString()]);

    // --- Effect: Auto-scroll date strip to selectedCalDate ---
    useEffect(() => {
        if (!selectedCalDate) return;
        const targetId = `date-item-${selectedCalDate.getDate()}-${selectedCalDate.getMonth()}`;

        // Use a short timeout to ensure the dateStrip has finished rendering (if the month changed)
        const timeoutId = setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [selectedCalDate, dateStrip]);
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    // selectedSlots persists across dates/months — key format: "YYYY-MM-DD-courtNum-HH:MM"
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const currentSelectionSlots = useMemo(() => {
        if (!selectedCalDate) return [];
        const dateKey = moment(selectedCalDate).format('YYYY-MM-DD');
        const slots: string[] = [];
        if (selectedDuration === 'custom') {
            const startH = parseInt(customStartTime.split(':')[0]);
            const endH = parseInt(customEndTime.split(':')[0]);
            for (let h = startH; h < endH; h++) {
                slots.push(`${dateKey}-1-${String(h).padStart(2, '0')}:00`);
            }
        } else {
            const hours = selectedDuration === 'half' ? 4 : 8;
            for (let h = 9; h < 9 + hours; h++) {
                slots.push(`${dateKey}-1-${String(h).padStart(2, '0')}:00`);
            }
        }
        return slots;
    }, [selectedCalDate, selectedDuration, customStartTime, customEndTime]);

    const isCurrentSelectionAdded = useMemo(() => {
        if (currentSelectionSlots.length === 0) return false;
        return currentSelectionSlots.every(slot => selectedSlots.includes(slot));
    }, [currentSelectionSlots, selectedSlots]);

    const isCurrentAvailable = useMemo(() => {
        if (!selectedCalDate || !data) return false;
        const dateKey = moment(selectedCalDate).format('YYYY-MM-DD');
        const bookedHours = data?.has_booked_venue
            ?.filter((e: any) => e?.start_date?.startsWith(dateKey))
            ?.map((e: any) => e.start_date.split('T')[1]?.substring(0, 5) || e.start_date.split(' ')[1]?.substring(0, 5)) || [];

        const checkAvailability = (startH: number, endH: number) => {
            for (let h = startH; h < endH; h++) {
                if (bookedHours.includes(`${String(h).padStart(2, '0')}:00`)) return false;
            }
            return true;
        };

        if (selectedDuration === 'half') {
            return checkAvailability(8, 12);
        } else if (selectedDuration === 'full') {
            return checkAvailability(8, 16);
        } else {
            const startH = parseInt(customStartTime.split(':')[0]);
            const endH = parseInt(customEndTime.split(':')[0]);
            return checkAvailability(startH, endH);
        }
    }, [selectedCalDate, selectedDuration, customStartTime, customEndTime, data]);
    const [expandedCourts, setExpandedCourts] = useState<number[]>([1, 2, 3]);
    const carouselApi = React.useRef<any>(null);

    const toggleCourt = (courtNum: number) => {
        setExpandedCourts(prev =>
            prev.includes(courtNum)
                ? prev.filter(c => c !== courtNum)
                : [...prev, courtNum]
        );
    };

    const toggleSlot = (slotKey: string) => {
        setSelectedSlots(prev =>
            prev.includes(slotKey)
                ? prev.filter(s => s !== slotKey)
                : [...prev, slotKey]
        );
    };

    // --- Calendar availability helpers ---
    type DayStatus = 'available' | 'limited' | 'full' | 'promo' | 'past';

    const getDateStatus = (d: Date): DayStatus => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d < today) return 'past';
        const dateStr = moment(d).format('YYYY-MM-DD');
        const isBooked = data?.has_booked_venue?.some(e => e?.start_date?.startsWith(dateStr));
        if (isBooked) return 'full';
        if (d.getDay() === 0) return 'limited'; // Sundays are limited
        if (d.getDate() % 7 === 0) return 'promo'; // every 7th
        return 'available';
    };

    const dayStatusConfig: Record<DayStatus, { bg: string; dot: string; label: string; labelColor: string; border: string }> = {
        available: { bg: 'bg-white', dot: 'bg-[#d1d1d1]', label: 'Tersedia', labelColor: 'text-gray-400', border: 'border-[#d1d1d1]' },
        limited: { bg: 'bg-white', dot: 'bg-[#d1d1d1]', label: 'Tersedia', labelColor: 'text-gray-400', border: 'border-[#d1d1d1]' },
        full: { bg: 'bg-[#f5f5f5]', dot: 'bg-[#9ca3af]', label: 'Booked', labelColor: 'text-[#bababa]', border: 'border-[#d1d1d1]' },
        promo: { bg: 'bg-white', dot: 'bg-[#d1d1d1]', label: 'Tersedia', labelColor: 'text-gray-400', border: 'border-[#d1d1d1]' },
        past: { bg: 'bg-transparent', dot: 'bg-[#eeeeee]', label: 'Booked', labelColor: 'text-[#bababa]', border: 'border-transparent' },
    };

    // Build calendar grid for currentMonth/currentYear
    const calendarGrid = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const cells: (Date | null)[] = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(currentYear, currentMonth, d));
        // Pad end to complete last row
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [currentMonth, currentYear]);

    // Pricing based on duration and weekend/weekday
    const durationPricing = useMemo(() => {
        const isWeekend = selectedCalDate && (selectedCalDate.getDay() === 0 || selectedCalDate.getDay() === 6);

        // Base Rates
        const baseWeekday = data?.starting_price ?? 150000;
        const baseWeekend = 250000; // Premium weekend rate

        if (isWeekend) {
            return {
                half: 150000,
                full: baseWeekend,
                custom: baseWeekend,
            };
        }
        return {
            half: 90000,
            full: baseWeekday,
            custom: baseWeekday,
        };
    }, [selectedCalDate, data?.starting_price]);

    // Confirm booking from detail panel → updates sidebar, does NOT navigate away
    const handleCalendarOrder = () => {
        if (!selectedCalDate || !data?.id) return;
        const dateKey = moment(selectedCalDate).format('YYYY-MM-DD');
        const newSlots: string[] = [];

        if (selectedDuration === 'custom') {
            const startH = parseInt(customStartTime.split(':')[0]);
            const endH = parseInt(customEndTime.split(':')[0]);
            // Generate slots for each hour in the range
            for (let h = startH; h < endH; h++) {
                newSlots.push(`${dateKey}-1-${String(h).padStart(2, '0')}:00`);
            }
        } else {
            const hours = selectedDuration === 'half' ? 4 : 8;
            for (let h = 9; h < 9 + hours; h++) {
                newSlots.push(`${dateKey}-1-${String(h).padStart(2, '0')}:00`);
            }
        }

        setSelectedSlots(prev => {
            const existing = new Set(prev);
            const filtered = newSlots.filter(s => !existing.has(s));
            return [...prev, ...filtered];
        });

        setSelectedDate(selectedCalDate);
        setShowDayDetail(false);
        // Scroll to the right sidebar (VENUE & JADWAL TERPILIH)
        setTimeout(() => {
            sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Auto-scroll the slot list to the bottom to show latest selection
            setTimeout(() => {
                if (sidebarScrollRef.current) {
                    sidebarScrollRef.current.scrollTo({ top: sidebarScrollRef.current.scrollHeight, behavior: 'smooth' });
                }
            }, 350);
        }, 200);
    };

    // Group selected slots by date string first, then court number
    // Structure: Record<dateString, Record<courtNum, slotKeys[]>>
    const groupedSlotsByDate = useMemo(() => {
        return selectedSlots.reduce<Record<string, Record<number, string[]>>>((acc, key) => {
            const parts = key.split('-');
            const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`; // YYYY-MM-DD
            const courtNum = parseInt(parts[3]);

            if (!acc[dateStr]) acc[dateStr] = {};
            if (!acc[dateStr][courtNum]) acc[dateStr][courtNum] = [];

            acc[dateStr][courtNum].push(key);
            return acc;
        }, {});
    }, [selectedSlots]);

    const clickOutsideChat = useClickOutside(() => {
        if (Boolean(user?.id) && openChat) {
            setTimeout(() => {
                setOpenChat(false);
            }, 500);
        }
    });

    // --- Removed Scroll/Sticky Logic for Simplified View ---
    useEffect(() => {
        setSubNavSticky(true); // Always true now as we are directly in booking
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
        return data?.has_booked_venue?.filter((e) => e?.start_date.slice(0, 7) == `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);
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
        const dummyName = (slug as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Nama Venue';
        const isPadel = dummyName.toLowerCase().includes('padel');

        const dummyVenue = {
            id: 999,
            slug: slug as string,
            name: dummyName,
            location: isPadel ? "Jl. KH. Ahmad Dahlan, Purwokerto" : "Jalan Pahlawan No. 45, Senayan, Jakarta",
            location_detail: "Lokasi persis di belakang area utama, area parkir sangat memadai.",
            description: isPadel
                ? "BEST PADEL COURT IN PURWOKERTO #1. Fasilitas premium dengan standar internasional. Dilengkapi dengan area tunggu yang nyaman, loker, dan kamar bilas yang bersih. Cocok untuk bermain bersama teman atau pertandingan kompetitif. Kami menyediakan penyewaan raket dan bola padel berkualitas tinggi. Ayo segera booking jadwalmu dan rasakan pengalaman bermain padel terbaik!"
                : "Gelora Bung Karno Main Stadium adalah venue olahraga ikonik bertaraf internasional yang menawarkan fasilitas premium untuk semua kebutuhan acara Anda. \n\nDilengkapi dengan rumput standar FIFA, sistem pencahayaan modern 3500 lux, dan tribun penonton megah berkapasitas puluhan ribu jiwa, venue ini sangat ideal untuk pertandingan olahraga maupun event berskala besar. Setiap area dirancang dengan cermat untuk memberikan kenyamanan maksimal bagi para atlet dan kepuasan visual bagi penonton.\n\nSelain itu, venue ini terintegrasi dengan akses transportasi umum yang sangat mudah, halte TransJakarta dan stasiun MRT berada tepat di seberang kawasan. Fasilitas pendukung seperti ruang ganti VVIP, ruang konferensi pers, dan area komersial menjadikan stadion ini pilihan utama penyelenggara acara profesional.",
            starting_price: isPadel ? 30000 : 150000,
            max_capacity: 50,
            seat_capacity: 50,
            venue_gallery: [
                { image_url: isPadel ? "https://images.unsplash.com/photo-1622396345638-3dc682ae12aa?q=80&w=1200" : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" },
                { image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200" },
                { image_url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200" }
            ],
            facility: ["Opsi pembayaran DP (Down Payment)", "Reschedule jadwal booking", "Lebih banyak promo & voucher", "Kamar Mandi / Shower", "Parkir Luas"],
            creator: {
                name: "Gelora Bung Karno",
                image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200"
            },
            has_booked_venue: [
                // Today's Bookings (Show timeline in action)
                { start_date: `${moment().format('YYYY-MM-DD')}T09:00:00`, event_name: "Latihan Pagi", event_banner: "" },
                { start_date: `${moment().format('YYYY-MM-DD')}T10:00:00`, event_name: "Latihan Pagi", event_banner: "" },
                { start_date: `${moment().format('YYYY-MM-DD')}T14:00:00`, event_name: "Private Match", event_banner: "" },
                { start_date: `${moment().format('YYYY-MM-DD')}T15:00:00`, event_name: "Private Match", event_banner: "" },

                // Tomorrow's Bookings (Show full day booked)
                { start_date: `${moment().add(1, 'days').format('YYYY-MM-DD')}T08:00:00`, event_name: "Full Day Event", event_banner: "" },
                { start_date: `${moment().add(1, 'days').format('YYYY-MM-DD')}T09:00:00`, event_name: "Full Day Event", event_banner: "" },
                { start_date: `${moment().add(1, 'days').format('YYYY-MM-DD')}T10:00:00`, event_name: "Full Day Event", event_banner: "" },
                { start_date: `${moment().add(1, 'days').format('YYYY-MM-DD')}T11:00:00`, event_name: "Full Day Event", event_banner: "" },
                { start_date: `${moment().add(1, 'days').format('YYYY-MM-DD')}T12:00:00`, event_name: "Full Day Event", event_banner: "" },

                { start_date: "2026-10-07T08:00:00", event_name: "Booking Rutin", event_banner: "" },
                { start_date: "2026-10-15T10:00:00", event_name: "Match Persahabatan", event_banner: "" },
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
        if (data?.id && selectedSlots.length > 0) {
            Cookies.set('venue_order_data', JSON.stringify({
                id: data?.id,
                slug: data?.slug,
                selected_slots: selectedSlots
            }));
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
            <style jsx global>{`
                .thin-scrollbar::-webkit-scrollbar {
                    height: 1px;
                }
                .thin-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .thin-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 20px;
                }
                .thin-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
                .thin-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #E5E7EB transparent;
                }
            `}</style>

            {/* PAGE BODY – Dark Blue Hero like Screenshot */}
            <div className="min-h-screen bg-white">
                <div ref={clickOutsideChat} className={`${openChat ? '' : 'hidden'}`}>
                    <Chat toggleOpenTab={() => setOpenChat(!openChat)} openTab={openChat} creatorIdOpen={data?.creator_id} />
                    <AuthModal visible={openChat && !user?.id} onClose={() => setOpenChat(false)} />
                </div>
                {/* ── SUB-NAVBAR TABS ── */}
                <div className="fixed top-[64px] left-0 right-0 w-full bg-white z-40 border-b border-[rgb(224, 224, 224)] shadow-sm md:block">
                    <div className="max-w-7xl mx-auto md:px-6">
                        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide px-4 md:px-0 scroll-smooth">
                            {[
                                { id: 'info', label: 'Deskripsi', href: `/venue/${slug}` },
                                { id: 'booking', label: 'Booking', href: `/venue/${slug}/pilih-jadwal` },
                                { id: 'ulasan', label: 'Ulasan', href: `/venue/${slug}?section=ulasan` },
                                { id: 'lokasi', label: 'Lokasi', href: `/venue/${slug}?section=lokasi` },
                                { id: 'faq', label: 'FaQ', href: `/venue/${slug}?section=faq` },
                            ].map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href as string}
                                    className={`pb-4 pt-4 text-[13px] md:text-[14px] transition-all relative whitespace-nowrap shrink-0 ${tab.id === 'booking'
                                        ? 'text-[#194e9e] font-semibold'
                                        : 'text-gray-400 hover:text-gray-600 font-medium'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.id === 'booking' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#194e9e] rounded-t-lg" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── MAIN BOOKING INTERFACE ── */}
                <div className="w-full max-w-[1550px] mx-auto px-2 md:px-3 pt-24 md:pt-32 pb-20 mt-[48px] md:mt-0">
                    <div ref={sectionRefs.booking} className="flex flex-col md:flex-row items-start gap-2 md:gap-2 w-full">
                        {/* LEFT COLUMN: Date Strip & Booking UI (Separate Section Cards) */}
                        <div className="flex-[1.8] w-full flex flex-col gap-2.5 md:gap-3 min-w-0">
                            <div className="w-full bg-[#F3F4F6] rounded-[8px] p-2 md:p-3 sticky top-[115px] z-20">
                                <div className="w-full bg-white rounded-[8px] shadow-sm px-4 py-2 sm:px-6 sm:py-3.5 flex flex-col justify-center">
                                    <div className="flex items-center w-full">
                                        {/* Scrollable Date Strip */}
                                        <div className="flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto py-1 px-1 thin-scrollbar">
                                            {dateStrip.map((d, i) => {
                                                const isSelected = selectedCalDate && d.toDateString() === selectedCalDate.toDateString();
                                                const status = getDateStatus(d);
                                                const isPast = status === 'past';

                                                return (
                                                    <button
                                                        key={i}
                                                        id={`date-item-${d.getDate()}-${d.getMonth()}`}
                                                        disabled={isPast}
                                                        onClick={() => {
                                                            setSelectedCalDate(d);
                                                            setSelectedDate(d);
                                                            setSelectedDuration('full');
                                                            setShowDayDetail(true);
                                                        }}
                                                        className={`flex flex-col items-center justify-center transition-all bg-transparent border-0 outline-none p-1
                                                            ${isPast ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
                                                        `}
                                                    >
                                                        {/* Inner pill — gets blue bg when selected */}
                                                        <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-[10px] transition-all
                                                            ${isSelected
                                                                ? 'bg-[#194e9e] shadow-[0_6px_16px_-4px_rgba(25,78,158,0.4)]'
                                                                : 'bg-transparent'
                                                            }
                                                        `}>
                                                            <span className={`text-[9px] sm:text-[10px] font-semibold tracking-wider mb-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                                {daysIdShort[d.getDay()]}
                                                            </span>
                                                            <span className={`text-[13px] sm:text-[14px] font-bold leading-none whitespace-nowrap ${isSelected ? 'text-white' : isPast ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                {d.getDate()} {monthsIdShort[d.getMonth()]}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Thin gray vertical divider line */}
                                        <div className="h-10 w-px bg-gray-200 self-center mx-3 md:mx-4 shrink-0" />

                                        {/* Fixed Calendar Icon Button */}
                                        <div className="shrink-0 flex items-center justify-center">
                                            <Popover opened={popoverOpened} onChange={setPopoverOpened} position={isMobile ? "bottom" : "bottom-end"} shadow="xl" radius="24px" width={isMobile ? 260 : 320} offset={10}>
                                                <Popover.Target>
                                                    <button
                                                        onClick={() => setPopoverOpened(o => !o)}
                                                        className="w-[44px] sm:w-[50px] h-[44px] sm:h-[50px] rounded-xl transition-all flex items-center justify-center bg-transparent border-0 outline-none shadow-none hover:bg-gray-50/50"
                                                    >
                                                        <Icon icon="solar:calendar-bold" className={`text-[22px] sm:text-[24px] transition-colors ${popoverOpened ? 'text-[#194e9e]' : 'text-gray-400 hover:text-[#194e9e]'}`} />
                                                    </button>
                                                </Popover.Target>
                                                <Popover.Dropdown p={0} className="border-0 shadow-xl rounded-[16px] overflow-hidden">
                                                    <CustomCalendar
                                                        value={selectedCalDate}
                                                        onChange={(val) => {
                                                            setSelectedCalDate(val);
                                                            setSelectedDate(val);
                                                            setSelectedDuration('full');
                                                            setShowDayDetail(true);
                                                            setPopoverOpened(false);
                                                        }}
                                                    />
                                                </Popover.Dropdown>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Venue & Jadwal Accordion Section (Separate Card) */}
                            {selectedCalDate && (
                                <div className="w-full bg-[#F3F4F6] rounded-[8px] p-2 md:p-3 flex flex-col">
                                    <div className="w-full bg-white rounded-[8px] shadow-sm overflow-hidden flex flex-col">
                                        <div className="w-full animate-in backdrop-blur-sm fade-in slide-in-from-top-2 duration-500">
                                    <button
                                        onClick={() => setShowDayDetail(v => !v)}
                                        className="w-full px-5 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#fcfdff] transition-all group gap-4 md:gap-0"
                                    >
                                        <div className="flex items-center md:items-center gap-4 sm:gap-6">
                                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-blue-50 border-2 border-blue-100/50 flex items-center justify-center text-[#194e9e] shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                <Icon icon="solar:buildings-bold" className="text-[20px] md:text-[22px]" />
                                            </div>
                                            <div className="flex items-center md:items-center gap-2.5 md:gap-2.0 w-full min-w-0">
                                                <div className="flex flex-col items-start min-w-0">
                                                    <h3 className="text-[13px] sm:text-[18px] font-semibold text-gray-900 tracking-tight leading-tight md:leading-none mb-1 group-hover:text-[#194e9e] transition-colors truncate w-full max-w-[150px] sm:max-w-none">{data?.name || 'Jakarta Convention Center'}</h3>
                                                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2.5">
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 border border-green-100/50">
                                                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                                                            <span className="text-[7px] md:text-[9px] font-medium text-green-700 tracking-widest leading-none">
                                                                Tersedia
                                                            </span>
                                                        </div>
                                                        <span className="text-[7px] md:text-[9px] font-medium text-gray-400 tracking-widest translate-y-[0.5px]">
                                                            {(() => {
                                                                if (!selectedCalDate || !data) return 0;
                                                                const dateKey = moment(selectedCalDate).format('YYYY-MM-DD');
                                                                const bookedHours = data?.has_booked_venue
                                                                    ?.filter((e: any) => e?.start_date?.startsWith(dateKey))
                                                                    ?.map((e: any) => e.start_date.split('T')[1]?.substring(0, 5) || e.start_date.split(' ')[1]?.substring(0, 5)) || [];
                                                                const businessHours = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
                                                                const available = businessHours.filter(h => !bookedHours.includes(h));
                                                                return available.length;
                                                            })()} Jadwal Tersedia
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Inline Arrow Button for Mobile */}
                                                <div className="flex md:hidden items-center justify-center ml-auto">
                                                    <Icon icon="solar:alt-arrow-down-bold" className={`text-[16px] text-gray-400 transition-all duration-300 ${showDayDetail ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center md:w-auto">
                                            <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#194e9e] group-hover:bg-blue-50 transition-all duration-500 ${showDayDetail ? 'rotate-180 bg-blue-50 text-[#194e9e]' : ''}`}>
                                                <Icon icon="solar:alt-arrow-down-bold" className="text-[14px]" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Accordion Content - Animated Expansion */}
                                    <div
                                        className="overflow-hidden transition-all duration-700 ease-in-out"
                                        style={{
                                            maxHeight: showDayDetail ? '1200px' : '0px',
                                            opacity: showDayDetail ? 1 : 0,
                                            transform: showDayDetail ? 'translateY(0)' : 'translateY(-20px)'
                                        }}
                                    >
                                        <div className="border-t border-[rgb(224,224,224)] px-0 sm:px-0">
                                            <DayDetailContent
                                                data={data}
                                                selectedCalDate={selectedCalDate}
                                                selectedDuration={selectedDuration}
                                                setSelectedDuration={setSelectedDuration}
                                                durationPricing={durationPricing}
                                                status={selectedCalDate ? getDateStatus(selectedCalDate) : 'available'}
                                                customStartTime={customStartTime}
                                                setCustomStartTime={setCustomStartTime}
                                                customEndTime={customEndTime}
                                                setCustomEndTime={setCustomEndTime}
                                                onConfirm={() => {
                                                    handleCalendarOrder();
                                                    setShowDayDetail(false);
                                                }}
                                                onClose={() => setShowDayDetail(false)}
                                                isMobile={isMobile}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            )}
                        </div> {/* End Left Column Parent Card */}

                        {/* RIGHT COLUMN: Summary Card */}
                        <div className="hidden md:flex md:w-[340px] lg:w-[380px] shrink-0 flex-col bg-[#F3F4F6] rounded-[8px] p-2 md:p-3 min-w-0 sticky top-[115px] self-start">
                            <div ref={sidebarRef} className="w-full bg-white rounded-[8px] shadow-sm overflow-hidden flex flex-col">
                                <div className="px-6 py-5 border-b border-[rgb(224,224,224)] flex items-center justify-between bg-[#fcfdff]">
                                    <h3 className="text-[11px] font-bold text-[#000000] tracking-widest">Jadwal Venue Terpilih</h3>
                                    {selectedSlots.length > 0 && (
                                        <button
                                            onClick={() => setIsEditingSidebar(!isEditingSidebar)}
                                            className="text-[11px] font-bold text-[#194e9e] tracking-wider hover:text-[#123e80] transition-colors"
                                        >
                                            {isEditingSidebar ? 'Selesai Edit' : 'Edit'}
                                        </button>
                                    )}
                                </div>

                                <div className="p-6">
                                    {selectedSlots.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
                                            <div className="w-20 h-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-300">
                                                <Icon icon="solar:calendar-date-bold" className="text-[40px]" />
                                            </div>
                                            <p className="text-[14px] font-bold text-gray-400 max-w-[180px] leading-relaxed">
                                                Pilih jadwal untuk memulai booking venue Anda
                                            </p>
                                        </div>
                                    ) : (
                                        <div ref={sidebarScrollRef} className="flex flex-col gap-8 max-h-[calc(100vh-340px)] overflow-y-auto stylish-scrollbar pr-1 scroll-smooth">
                                            {Object.keys(groupedSlotsByDate).sort().map((dateStr) => {
                                                const dateObj = new Date(dateStr);
                                                const courtGroups = groupedSlotsByDate[dateStr];
                                                return (
                                                    <div key={dateStr} className="flex flex-col gap-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-1.5 h-6 rounded-full bg-[#194e9e]"></div>
                                                                <span className="text-[14px] font-semibold text-gray-900 tracking-tight">
                                                                    {daysIdShort[dateObj.getDay()]}, {dateObj.getDate()} {monthsIdShort[dateObj.getMonth()]} {dateObj.getFullYear()}
                                                                </span>
                                                            </div>
                                                            {isEditingSidebar && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedSlots(prev => prev.filter(s => !s.startsWith(dateStr)));
                                                                    }}
                                                                    className="w-7 h-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all border border-red-100"
                                                                    title="Hapus Semua"
                                                                >
                                                                    <Icon icon="solar:close-circle-bold" className="text-[16px]" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {Object.keys(courtGroups).map((courtStr) => {
                                                            const courtNum = parseInt(courtStr);
                                                            const slots = courtGroups[courtNum];
                                                            // Derive duration label from number of hourly slots
                                                            const slotCount = slots.length;
                                                            const durationLabel = slotCount <= 4
                                                                ? 'Setengah Hari'
                                                                : slotCount <= 8
                                                                    ? 'Satu Hari Penuh'
                                                                    : 'Custom';
                                                            return (
                                                                <div key={courtNum} className="flex flex-col gap-3 pl-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#194e9e] shrink-0">
                                                                            <Icon icon="solar:buildings-bold" className="text-[15px]" />
                                                                        </div>
                                                                        <span className="text-[11px] font-bold text-gray-700 tracking-widest uppercase">{durationLabel}</span>
                                                                    </div>

                                                                    <div className="flex flex-col gap-2">
                                                                        {slots.map(slotKey => {
                                                                            const parts = slotKey.split('-');
                                                                            const time = parts[4];
                                                                            const hour = parseInt(time.split(':')[0]);
                                                                            const eHour = hour + 1;
                                                                            const eTime = `${eHour.toString().padStart(2, '0')}:00`;
                                                                            return (
                                                                                <div key={slotKey} className="group relative flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50/60 border border-[rgb(228,228,228)] hover:border-[#194e9e]/30 hover:bg-blue-50/20 transition-all">
                                                                                    {/* Left: time stacked above price */}
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <div className="flex items-center gap-1.5">
                                                                                            <Icon icon="solar:clock-circle-bold" className="text-gray-400 text-[13px]" />
                                                                                            <span className="text-[12px] font-medium text-gray-600">{time} - {eTime} WIB</span>
                                                                                        </div>
                                                                                        <span className="text-[13px] font-bold text-gray-900 pl-[19px]">Rp{(data?.starting_price ?? 95000).toLocaleString('id')}</span>
                                                                                    </div>
                                                                                    {/* Right: delete button */}
                                                                                    {isEditingSidebar && (
                                                                                        <button
                                                                                            onClick={() => toggleSlot(slotKey)}
                                                                                            className="w-7 h-7 rounded-full bg-white text-red-500 hover:bg-red-50 border border-red-100 flex items-center justify-center transition-all shadow-sm shrink-0"
                                                                                        >
                                                                                            <Icon icon="solar:trash-bin-trash-bold" className="text-[14px] text-red-500" />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Summary Footer inside card removed */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div ref={sectionRefs.lokasi} className="pb-2 bg-[#F7F8FA]"></div>
            </div>{/* end min-h-screen */}
            {/* ── BOTTOM BOOKING BAR ── */}
            {/* MOBILE layout: stacked rows  |  DESKTOP: horizontal row */}
            <div className="w-full fixed bottom-0 bg-white z-50 border-t border-[#d1d1d1] transition-all duration-500">

                {/* ── MOBILE ── */}
                <div className="flex flex-col sm:hidden px-4 pt-3 pb-4 gap-2.5">
                    {/* Row 1: Total Harga (left) + Detail button (right) */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col leading-tight">
                            <span className="text-[10px] font-medium text-gray-400 tracking-widest">Total Harga</span>
                            <span className="text-[16px] font-bold text-gray-900 leading-none mt-0.5">
                                {selectedSlots.length > 0
                                    ? `Rp${(selectedSlots.length * (data?.starting_price ?? 95000)).toLocaleString('id')}`
                                    : `Rp${(data?.starting_price ?? 95000).toLocaleString('id')}`
                                }
                            </span>
                        </div>
                        <button
                            onClick={() => setShowMobileDetail(true)}
                            className="flex items-center gap-1 py-1 active:scale-95 transition-all"
                        >
                            <span className="text-[11px] font-semibold text-[#194e9e]">
                                {selectedSlots.length > 0 ? `(${selectedSlots.length}) Detail` : 'Detail'}
                            </span>
                            <Icon icon="solar:alt-arrow-up-bold" className="text-[11px] text-[#194e9e]" />
                        </button>
                    </div>

                    {/* Row 2: Booking button (flex-1) + Chat button (square) */}
                    <div className="flex items-center gap-2">
                        {!isCurrentSelectionAdded ? (
                            <button
                                disabled={!isCurrentAvailable}
                                onClick={handleCalendarOrder}
                                className={`flex-1 h-[38px] rounded-[10px] font-bold text-[13px] tracking-wide transition-all active:scale-[0.98] ${
                                    isCurrentAvailable
                                        ? 'bg-[#194e9e] text-white hover:bg-[#123e80]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Pilih Jadwal
                            </button>
                        ) : (
                            <button
                                disabled={selectedSlots.length === 0}
                                onClick={handleOrder}
                                className={`flex-1 h-[38px] rounded-[10px] font-bold text-[13px] tracking-wide transition-all active:scale-[0.98] ${
                                    selectedSlots.length > 0
                                        ? 'bg-[#194e9e] text-white hover:bg-[#123e80]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Booking
                            </button>
                        )}
                        {/* Chat button */}
                        <button
                            onClick={() => setOpenChat(true)}
                            className="w-[40px] h-[40px] flex items-center justify-center shrink-0 rounded-xl bg-[#194e9e] text-white border border-[#194e9e] hover:bg-[#123e80] active:scale-95 transition-all"
                        >
                            <Icon icon="solar:chat-round-dots-bold" className="text-[18px]" />
                        </button>
                    </div>
                </div>

                {/* ── DESKTOP (sm+): original horizontal layout ── */}
                <div className="hidden sm:flex items-center justify-between gap-3 md:gap-4 py-4 px-6 md:px-12">
                    {/* Left: price info */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                        {selectedSlots.length > 0 ? (
                            <div className="flex flex-col leading-tight min-w-0">
                                <span className="text-[11px] font-medium text-[#ABABAB] tracking-widest mb-1">Total {selectedSlots.length} jadwal</span>
                                <span className="text-[18px] font-bold text-gray-900 leading-none block whitespace-nowrap">
                                    Rp{(selectedSlots.length * (data?.starting_price ?? 95000)).toLocaleString('id')}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col leading-tight">
                                <span className="text-[11px] font-medium text-[#ABABAB] tracking-widest mb-1">Mulai dari</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[20px] font-bold text-gray-900 leading-none">
                                        {`Rp${(data?.starting_price ?? 95000).toLocaleString('id')}`}
                                    </span>
                                    <span className="text-[12px] font-medium text-gray-400 self-end">/sesi</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Detail + CTA */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {selectedSlots.length > 0 && (
                            <button
                                onClick={() => setShowMobileDetail(true)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#194e9e]/30 bg-blue-50/60 transition-all hover:bg-blue-50 active:scale-95"
                            >
                                <span className="text-[13px] font-bold text-[#194e9e]">({selectedSlots.length}) Detail</span>
                                <Icon icon="solar:alt-arrow-up-bold" className="text-[13px] text-[#194e9e]" />
                            </button>
                        )}
                        {!isCurrentSelectionAdded ? (
                            <button
                                disabled={!isCurrentAvailable}
                                onClick={handleCalendarOrder}
                                className={`h-[48px] px-8 rounded-xl font-semibold text-[13px] tracking-wide transition-all shrink-0 ${
                                    isCurrentAvailable
                                        ? 'bg-[#194e9e] text-white shadow-xl shadow-[#194e9e]/30 hover:bg-[#123e80] active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                Pilih Jadwal
                            </button>
                        ) : (
                            <button
                                disabled={selectedSlots.length === 0}
                                onClick={handleOrder}
                                className={`h-[48px] px-8 rounded-xl font-semibold text-[13px] tracking-wide transition-all shrink-0 ${
                                    selectedSlots.length > 0
                                        ? 'bg-[#194e9e] text-white shadow-xl shadow-[#194e9e]/30 hover:bg-[#123e80] active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Jadwal Detail Bottom Sheet */}
            <Drawer
                opened={showMobileDetail}
                onClose={() => setShowMobileDetail(false)}
                position="bottom"
                size="auto"
                radius="24px 24px 0 0"
                padding="xl"
                withCloseButton={false}
                zIndex={999}
                styles={{
                    content: { maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
                    body: { flex: 1, display: 'flex', flexDirection: 'column', padding: '0px 24px 24px 24px', overflow: 'hidden' }
                }}
            >
                {/* Header with Title and Edit toggle */}
                <div className="flex items-center justify-between pt-6 pb-4 mb-4 border-b border-[#D1D1D1]">
                    <h3 className="text-[17px] font-bold text-gray-800 tracking-tight">Jadwal dipilih</h3>
                    <div className="flex items-center gap-4">
                        {selectedSlots.length > 0 && (
                            <button
                                onClick={() => setIsEditingSidebar(!isEditingSidebar)}
                                className="text-[11px] font-bold text-[#194e9e] tracking-wider flex items-center gap-1.5"
                            >
                                {isEditingSidebar ? 'Selesai Edit' : 'Edit'}
                                {!isEditingSidebar && <Icon icon="solar:pen-new-square-bold" className="text-[14px]" />}
                            </button>
                        )}
                        <button onClick={() => setShowMobileDetail(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Icon icon="solar:close-circle-bold" className="text-[24px]" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                    <div className="flex-1 overflow-y-auto stylish-scrollbar pr-1 pb-4">
                        {selectedSlots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                                <Icon icon="solar:calendar-broken" className="text-5xl text-gray-300" />
                                <p className="text-[13px] font-medium text-gray-400">Belum ada jadwal yang dipilih</p>
                            </div>
                        ) : (
                            Object.keys(groupedSlotsByDate).sort().map((dateStr) => {
                                const dateObj = new Date(dateStr);
                                const courtGroups = groupedSlotsByDate[dateStr];
                                return (
                                    <div key={dateStr} className="flex flex-col gap-4 mb-2">
                                        {/* DATE HEADER */}
                                        <div className="flex items-center gap-2.5 py-1.5 px-3 bg-gray-50/50 rounded-xl border border-[#d1d1d1]">
                                            <Icon icon="solar:calendar-bold" className="text-[14px] text-[#194e9e]" />
                                            <span className="text-[12px] font-semibold text-[#194e9e]">
                                                {daysIdShort[dateObj.getDay()]}, {dateObj.getDate()} {monthsIdShort[dateObj.getMonth()]} {dateObj.getFullYear()}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-5 pl-1">
                                            {Object.keys(courtGroups).map((courtStr) => {
                                                const courtNum = parseInt(courtStr);
                                                const slots = courtGroups[courtNum];
                                                return (
                                                    <div key={courtNum} className="flex flex-col gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#194e9e]">
                                                                <Icon icon="solar:buildings-bold" className="text-[18px]" />
                                                            </div>
                                                            {(() => {
                                                                const slotCount = slots.length;
                                                                const durationLabel = slotCount <= 4 ? 'Setengah Hari' : slotCount <= 8 ? 'Satu Hari Penuh' : 'Custom';
                                                                return (
                                                                    <span className="text-[13px] font-semibold text-gray-800 tracking-wide">{durationLabel}</span>
                                                                );
                                                            })()}
                                                            {isEditingSidebar && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedSlots(prev => prev.filter(s => !s.includes(`-${courtNum}-`) || !s.startsWith(dateStr)));
                                                                    }}
                                                                    className="ml-auto w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center transition-all shadow-sm active:scale-90"
                                                                    title="Hapus Semua"
                                                                >
                                                                    <Icon icon="solar:close-circle-bold" className="text-[16px]" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className={`flex flex-col gap-4 pl-1 pr-1 stylish-scrollbar ${slots.length > 3 ? 'max-h-[220px] overflow-y-auto' : ''}`}>
                                                            {slots.map(slotKey => {
                                                                const parts = slotKey.split('-');
                                                                const time = parts[4];
                                                                const hour = parseInt(time.split(':')[0]);
                                                                const eHour = hour + 1;
                                                                const eTime = `${eHour.toString().padStart(2, '0')}:00`;
                                                                return (
                                                                    <div key={slotKey} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <div className="flex items-center gap-2">
                                                                                <Icon icon="solar:clock-circle-bold" className="text-gray-400 text-[13px]" />
                                                                                <span className="text-[13px] font-semibold text-gray-600">{time} - {eTime} WIB</span>
                                                                            </div>
                                                                            <span className="text-[13px] font-semibold text-gray-800 pl-[19px]">Rp{(data?.starting_price ?? 95000).toLocaleString('id')}</span>
                                                                        </div>
                                                                        {isEditingSidebar && (
                                                                            <button
                                                                                onClick={() => toggleSlot(slotKey)}
                                                                                className="text-red-500 hover:text-red-600 transition-colors p-1 active:scale-90"
                                                                            >
                                                                                <Icon icon="solar:trash-bin-trash-bold" className="text-[18px]" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="pt-8 border-t border-[#D1D1D1] bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[14px] font-medium text-gray-600 tracking-tight">Total ({selectedSlots.length} jadwal)</span>
                            <span className="text-[19px] font-bold text-gray-800 tracking-tighter">
                                Rp{(selectedSlots.length * (data?.starting_price ?? 95000)).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                setShowMobileDetail(false);
                                handleOrder();
                            }}
                            className="w-full h-[48px] rounded-[12px] bg-[#194e9e] text-white font-semibold text-[15px] tracking-widest active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            Booking
                        </button>
                    </div>
                </div>
            </Drawer>

            {/* Booking Modal removed */}

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

            {/* ── TENTANG VENUE MODAL ── */}
            <Modal
                opened={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={<Text fw={700} className="text-[20px] text-gray-900 tracking-tight">Tentang Venue</Text>}
                centered
                size="600px"
                radius={isMobile ? 0 : 16}
                fullScreen={isMobile}
                withCloseButton
                closeButtonProps={{ iconSize: 24, className: "text-gray-900 hover:bg-gray-100" }}
                styles={{
                    inner: isMobile ? { padding: '0 !important' } : undefined,
                    content: { boxShadow: isMobile ? 'none' : '0 10px 40px -10px rgba(0, 0, 0, 0.2)' },
                    header: { padding: '24px 24px 16px 24px' },
                    title: { width: '100%' },
                    body: { padding: '0px 24px 32px 24px' }
                }}
            >
                <div className={`flex flex-col gap-6 overflow-y-auto stylish-scrollbar pr-2 mt-2 ${isMobile ? 'flex-1 h-full' : 'max-h-[75vh]'}`}>

                    {/* DESKRIPSI */}
                    <div>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-3">Deskripsi</h3>
                        <p className="text-[14px] text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                            {data?.description || 'Tidak ada deskripsi tersedia.'}
                        </p>
                    </div>

                    {/* ATURAN VENUE */}
                    <div>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-3">Aturan Venue</h3>
                        <ol className="list-decimal pl-4 space-y-2.5 text-[14px] text-gray-700 mt-1">
                            <li>Gunakan sepatu olahraga indoor yang bersih saat di lapangan</li>
                            <li>Jaga kebersihan area lapangan ruang olahraga</li>
                            <li>Harap datang 15 menit sebelum jadwal dimulai</li>
                            <li>Dilarang merokok, membawa minuman keras, atau obat-obatan terlarang</li>
                            <li>Perubahan jadwal maksimal dilakukan 24 jam sebelumnya</li>
                            <li>Lapangan hanya digunakan sesuai dengan aktivitas yang dipesan</li>
                        </ol>
                    </div>

                    {/* FASILITAS VENUE */}
                    <div>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-3 mt-1">Fasilitas</h3>
                        <div className="flex flex-col gap-3">
                            {data?.facility?.map((f, i) => {
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
                                    <div key={i} className="flex items-center gap-4 w-full">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                                            <Icon icon={icon ? facilityIcons[icon] : 'solar:check-circle-bold'} className="text-gray-600 text-[18px]" />
                                        </div>
                                        <span className="text-[14px] font-medium text-gray-700">{f}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PilihJadwal;