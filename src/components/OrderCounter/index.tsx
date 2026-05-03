import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ActionIcon, Badge, Box, Button, Card, Center, Divider, Drawer, Flex, LoadingOverlay, Modal, NumberFormatter, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { EventTicketPromo, TicketProps } from "@/utils/globalInterface";
import moment from "moment";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { randomId, useDidUpdate, useInterval } from "@mantine/hooks";
import { EventContext } from "@/pages/event/[slug]";
import { SeatmapData } from "@/utils/formInterface";
import chunk from "@/utils/chunk";
import { contrastColor } from "contrast-color";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

interface OrderCounterProps {
  count?: number | string[];
  setCount: (count: number | string) => void;
  isSoldOut?: boolean;
  isFinish?: boolean;
  isReady?: boolean;
  isFullbook?: boolean;
  title: string;
  price: number;
  isLogin: boolean;
  description?: string;
  ticketData: TicketProps;
  maxOrder?: number;
  index: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  onOrder?: () => void;
}

const OrderCounter = ({
  index,
  maxOrder,
  count: _count,
  ticketData: _ticketData,
  setCount,
  isSoldOut,
  isFullbook,
  title,
  price,
  isLogin,
  isFinish,
  isReady,
  description,
  isExpanded = false,
  onToggle,
  onOrder
}: OrderCounterProps) => {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const count = useMemo(() => {
    if (!_count) return 0;
    return typeof _count == "number" ? _count : _count.length;
  }, [_count]);

  const { seatmapData, seatmapOpen, setSeatmapOpen, ticket, eventData } = useContext(EventContext);

  const selectedSeat = useMemo(() => {
    return ticket?.map((e) => e.seat_number).reduce((c, n) => [...(c ?? []), ...(n ?? [])], []);
  }, [ticket]);

  const [timeoutHash, setTimeoutHash] = useState("");
  const interval = useInterval(() => {
    setTimeoutHash(randomId());
  }, 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  const ticketData = useMemo(() => _ticketData, [_ticketData, timeoutHash]);

  const bundlingEnabled = Number(ticketData?.is_bundling ?? 0) === 1;
  const bundlingQty = Number(ticketData?.bundling_qty ?? 0);
  const step = bundlingEnabled && bundlingQty > 0 ? bundlingQty : 1;
  const max = maxOrder ?? 9999;

  const getTicketStatus = () => {
    const now = moment();
    const eventStatus = eventData?.has_event_status?.name?.toLowerCase();

    // SPECIAL OVERRIDE: Ticket OTS & VIP should always be ongoing, Reguler & Triple should be Sold Out
    const ticketNameLower = ticketData?.name?.toLowerCase() || "";
    if (ticketNameLower.includes('ots') || ticketNameLower.includes('vip') || ticketNameLower.includes('presale')) {
      return {
        label: "Penjualan Berlangsung",
        status: "ongoing",
        color: "#52BE80",
        bg: "#E8F6EF",
      };
    }

    if (ticketNameLower.includes('reguler') || ticketNameLower.includes('triple')) {
      return {
        label: "TERJUAL HABIS",
        status: "ended",
        color: "#EF4444",
        bg: "#FDEDEC",
      };
    }

    const sDate = ticketData.start_date || ticketData.ticket_date;
    const sTime = ticketData.starting_time || "00:00:00";
    const eDate = ticketData.ticket_end || sDate;
    const eTime = ticketData.ending_time || "23:59:59";

    const start = moment(`${sDate} ${sTime}`, "YYYY-MM-DD HH:mm:ss");
    const end = moment(`${eDate} ${eTime}`, "YYYY-MM-DD HH:mm:ss");

    if (eventStatus === "ended" || eventStatus === "finish" || isFinish || now.isAfter(end)) {
      return {
        label: "Terjual Habis",
        color: "#7F8C8D",
        status: "finished"
      };
    }

    if (isSoldOut) return {
      label: "SOLD OUT",
      color: "#D00E17",
      status: "soldout"
    };
    if (isFullbook) return {
      label: "FULL BOOKED",
      color: "#E67E22",
      status: "fullbooked"
    };
    if (now.isBefore(start)) return {
      label: "BELUM DIMULAI",
      subLabel: `DIMULAI: ${start.format("DD MMM, HH:mm")}`,
      color: "#194E9E",
      status: "upcoming"
    };

    return {
      label: "PENJUALAN BERLANGSUNG",
      subLabel: `BERAKHIR: ${end.format("DD MMM, HH:mm")}`,
      color: "#27AE60",
      status: "ongoing"
    };
  };

  const status = getTicketStatus();

  const canDecrement = count - step >= 0;
  const canIncrement = status.status === "ongoing" && count + step <= max;

  const hasPromo = Number(ticketData?.is_promo ?? 0) > 0;

  // Formatting currency safely
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const cleanTicketName = (name: string) => {
    return name?.replace(/budling/gi, "Bundling").replace(/budnling/gi, "Bundling");
  };

  const isCurrentlySoldOut = status.status === 'soldout' || status.status === 'ended' || isSoldOut || isFullbook || (ticketData.is_fullbook === 1);

  return (
    <div className={`relative rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden mb-5 group transition-all duration-500 font-inter ${isCurrentlySoldOut ? 'bg-gray-50/50' : 'bg-white'}`}>
      {/* Side Notches - Left & Right (Enhanced with inset shadow for depth) */}
      <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fafbfc] z-10 shadow-[inset_-4px_0_6px_rgba(0,0,0,0.06)]" />
      <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fafbfc] z-10 shadow-[inset_4px_0_6px_rgba(0,0,0,0.06)]" />

      <div className="flex flex-col md:flex-row cursor-pointer" onClick={onToggle}>
        {/* Left Section: Ticket Main Info */}
        <div className={`flex-1 p-5 md:p-8 md:pr-12 border-b md:border-b-0 md:border-r border-dashed border-[rgb(227,227,227)] relative flex flex-col justify-center`}>
          <h3 className={`text-[16px] md:text-[20px] font-black tracking-tight mb-2 leading-tight ${isCurrentlySoldOut ? 'text-gray-400 opacity-40' : 'text-[#1e293b]'}`}>
            {cleanTicketName(ticketData.name)}
          </h3>

          {/* Status Badge moved to main row for better visibility when collapsed */}
          <div className="flex items-center gap-2 relative z-20">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-[6px] transition-all whitespace-nowrap"
              style={{
                backgroundColor: (status.status === 'ongoing' || status.status === 'live') ? '#E8F6EF' : (isCurrentlySoldOut || eventData?.slug?.includes('mobil-reuni')) ? '#FDEDEC' : '#f1f5f9'
              }}
            >
              <Icon
                icon="solar:clock-circle-bold"
                className="text-[10px] shrink-0"
                style={{ color: (status.status === 'ongoing' || status.status === 'live') ? '#52BE80' : (isCurrentlySoldOut || eventData?.slug?.includes('mobil-reuni')) ? '#EF4444' : '#64748b' }}
              />
              <span
                className="text-[9px] font-black tracking-widest leading-none uppercase"
                style={{ color: (status.status === 'ongoing' || status.status === 'live') ? '#52BE80' : (isCurrentlySoldOut || eventData?.slug?.includes('mobil-reuni')) ? '#EF4444' : '#64748b' }}
              >
                {eventData?.slug?.includes('mobil-reuni') && (status.status === 'ended' || status.status === 'soldout') ? 'SOLD OUT' : isCurrentlySoldOut ? 'TERJUAL HABIS' : status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Price & Chevron */}
        <div className={`w-full md:w-[280px] p-5 md:p-8 flex flex-col justify-center items-start relative ${isCurrentlySoldOut ? 'bg-gray-50/10' : 'bg-white'}`}>
          <div className={`flex flex-col items-start w-full ${isCurrentlySoldOut ? 'opacity-40' : ''}`}>
            <span className={`text-[10px] font-bold tracking-[0.15em] mb-1 ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#94a3b8]'}`}>Harga</span>
            {/* Main Price Display */}
            <div className={`text-lg md:text-xl font-black tracking-tighter ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#1e293b]'}`}>
              {formatIDR(ticketData.price * 1.15)}
            </div>
            {/* Strikethrough price BELOW (Only for explicit promos) */}
            {ticketData.is_promo === 1 && (
              <span className="text-[11px] font-bold text-red-500 line-through decoration-[1.5px] mt-[-2px] opacity-80">
                {formatIDR(ticketData.price * 1.35)}
              </span>
            )}

          </div>

          {/* Chevron */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`text-black transition-transform text-lg ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isExpanded && (
        <div className={`p-5 md:p-8 bg-[#f8fafc] border-t border-[#f1f5f9] animate-in fade-in slide-in-from-top-2 duration-500 ease-out ${isCurrentlySoldOut ? 'opacity-60 grayscale-[0.5]' : ''}`}>
          <Stack gap={24}>
            {/* 1. Date Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className={`text-[9px] font-bold tracking-[0.15em] ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#94a3b8]'}`}>Tanggal Event</span>
                <div className="flex items-center gap-2.5">
                  {(ticketData.valid_dates || [ticketData.event_schedule_date || ticketData.ticket_date || ticketData.start_date]).map((date, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center justify-center w-12 h-14 bg-white border border-[#e2e8f0] rounded-xl shadow-sm shrink-0">
                        <span className="text-[9px] font-bold text-[#94a3b8] leading-none mb-1">
                          {moment(date).format("ddd")}
                        </span>
                        <span className="text-sm font-black text-[#1e293b] leading-none mb-0.5">
                          {moment(date).format("DD")}
                        </span>
                        <span className="text-[9px] font-bold text-[#94a3b8] leading-none">
                          {moment(date).format("MMM")}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                  <div className="flex flex-col gap-1 ml-2">
                    <div className="text-[13px] font-medium text-[#64748b]">
                      Masa berlaku: <span className="font-bold text-[#1e293b]">
                        {ticketData.valid_dates && ticketData.valid_dates.length > 1
                          ? `${moment(ticketData.valid_dates[0]).format("DD MMM")} - ${moment(ticketData.valid_dates[ticketData.valid_dates.length - 1]).format("DD MMM YYYY")}`
                          : moment(ticketData.event_schedule_date || ticketData.ticket_date || ticketData.start_date).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown for Upcoming Sales */}
              {status.status === 'upcoming' && (
                <div className="flex flex-col items-start md:items-end gap-1">
                  <span className="text-[10px] font-bold text-[#94a3b8] tracking-[0.15em]">Penjualan Dimulai</span>
                  <div className="px-3 py-1 bg-blue-50 rounded-lg">
                    <span className="text-xs font-black text-[#194E9E]">{status.subLabel || 'Segera Hadir'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-[#e2e8f0]/60 w-full" />

            {/* Ticket Description Section (Universal) */}
            <div className="flex flex-col gap-3">
              <span className={`text-[9px] font-bold tracking-[0.15em] ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#94a3b8]'}`}>Informasi Tiket</span>
              <div className="flex flex-col gap-2.5">
                {/* Standard Terms List */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:shield-cross-bold" className="text-[#64748b] text-[14px]" />
                    <span className="text-[12px] font-medium text-[#64748b]">Tidak Bisa Refund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:check-circle-bold" className="text-[#64748b] text-[14px]" />
                    <span className="text-[12px] font-medium text-[#64748b]">Konfirmasi Instan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:bill-list-bold" className="text-[#64748b] text-[14px]" />
                    <span className="text-[12px] font-medium text-[#64748b]">Termasuk Pajak 10%</span>
                  </div>
                </div>

                {/* VIP Specific Benefits List */}
                {ticketData.name?.toLowerCase()?.includes('vip') && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:cup-hot-bold" className="text-[#64748b] text-[14px]" />
                      <span className="text-[12px] font-medium text-[#64748b]">Konsum Dapet Langsung</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:armchair-bold" className="text-[#64748b] text-[14px]" />
                      <span className="text-[12px] font-medium text-[#64748b]">Tempat Duduk VIP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:star-bold" className="text-[#64748b] text-[14px]" />
                      <span className="text-[12px] font-medium text-[#64748b]">Akses Langsung ke Panggung</span>
                    </div>
                  </div>
                )}

                {/* Festival Specific Benefits List */}
                {ticketData.name?.toLowerCase()?.includes('festival') && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:ticket-bold" className="text-[#64748b] text-[14px]" />
                      <span className="text-[12px] font-medium text-[#64748b]">
                        {ticketData.name?.toLowerCase()?.includes('2 day pass')
                          ? "Akses penuh Festival untuk 2 hari (Day 1 & Day 2)"
                          : ticketData.name?.toLowerCase()?.includes('day 1')
                            ? "Akses Festival untuk Hari ke-1"
                            : ticketData.name?.toLowerCase()?.includes('day 2')
                              ? "Akses Festival untuk Hari ke-2"
                              : "Akses Festival"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Triple Specific Benefits List */}
                {ticketData.name?.toLowerCase()?.includes('triple') && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:ticket-bold" className="text-[#64748b] text-[14px]" />
                      <span className="text-[12px] font-medium text-[#64748b]">Mendapatkan 3 Tiket Masuk</span>
                    </div>
                  </div>
                )}

                {ticketData.description && (
                  <div className="flex flex-col gap-2.5 mt-1">
                    {(() => {
                      let desc = ticketData.description;
                      // Filter out common benefit strings for cleaner view
                      desc = desc.replace(/Ticket Reguler Benefit\s*:\s*1\.\s*Mendapatkan Konsum/gi, "");
                      desc = desc.replace(/Ticket VIP Benefit\s*:\s*1\.\s*Konsum Dapet Langsung\s*2\.\s*Tempat Duduk VIP\s*3\.\s*Akses Langsung ke Panggung/gi, "");
                      desc = desc.replace(/--\s*dua\s*tiket/gi, "");
                      desc = desc.replace(/--\s*tiga\s*tiket/gi, "");

                      const points = desc.split('.').filter(p => p.trim().length > 2);
                      return points.map((point, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Icon
                            icon={
                              point.toLowerCase().includes('akses') || point.toLowerCase().includes('tiket') ? "solar:ticket-star-bold" :
                                point.toLowerCase().includes('pameran') || point.toLowerCase().includes('komunitas') ? "solar:users-group-rounded-bold" :
                                  point.toLowerCase().includes('hemat') || point.toLowerCase().includes('paket') ? "solar:tag-price-bold" :
                                    "solar:info-circle-bold"
                            }
                            className="text-[#64748b] text-[14px] mt-0.5 shrink-0"
                          />
                          <span className="text-[12px] font-medium text-[#64748b] leading-relaxed">
                            {point.trim()}.
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
            <div className="h-px bg-[#e2e8f0]/60 w-full" />

            {/* Benefit Tiket Section (ONLY for Merch) */}
            {ticketData.name?.toLowerCase()?.includes('merch') && (
              <>
                <div className="flex flex-col gap-3">
                  <span className={`text-[9px] font-bold tracking-[0.15em] ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#94a3b8]'}`}>Benefit Tiket</span>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg w-fit">
                    <Icon icon="solar:gift-bold-duotone" className="text-blue-600 text-sm" />
                    <span className="text-[11px] font-bold text-blue-700">Tiket ini mendapatkan official merchandise</span>
                  </div>
                </div>
                <div className="h-px bg-[#e2e8f0]/60 w-full" />
              </>
            )}

            {/* 2. End Sale Section (Replaced Price Section) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-1">
                <span className={`text-[9px] font-bold tracking-[0.15em] ${isCurrentlySoldOut ? 'text-gray-400' : 'text-[#94a3b8]'}`}>
                  Berakhir Pada
                </span>
                <span className="text-base md:text-lg font-black text-[#1e293b]">
                  {moment(ticketData.ticket_end).format("DD MMM YYYY, HH:mm")}
                </span>
              </div>

              {(() => {
                const isCurrentlySoldOut = status.status === 'soldout' || status.status === 'ended' || isSoldOut || isFullbook || (ticketData.is_fullbook === 1);
                return (
                  <div className="flex items-center justify-end gap-5 bg-white border border-[#e2e8f0] p-1.5 px-2 rounded-full shadow-sm w-fit ml-auto md:w-auto md:ml-0">
                    <button
                      onClick={() => setCount(count - step)}
                      disabled={!canDecrement || isCurrentlySoldOut}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${count > 0 && !isCurrentlySoldOut ? "bg-[#194E9E] hover:bg-[#0b387c] shadow-sm" : "bg-[#f1f5f9] opacity-30 cursor-not-allowed"
                        }`}
                    >
                      <Icon
                        icon="fa6-solid:minus"
                        className="text-[12px]"
                        style={{ color: count > 0 && !isCurrentlySoldOut ? '#FFFFFF' : '#94a3b8' }}
                      />
                    </button>

                    <span className={`text-base font-black min-w-[24px] text-center ${isCurrentlySoldOut ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                      {count}
                    </span>

                    <button
                      onClick={() => setCount(count + step)}
                      disabled={!canIncrement || isCurrentlySoldOut}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${!isCurrentlySoldOut ? "bg-[#194E9E] hover:bg-[#0b387c] shadow-sm" : "bg-[#f1f5f9] opacity-30 cursor-not-allowed"
                        }`}
                    >
                      <Icon
                        icon="fa6-solid:plus"
                        className="text-[12px]"
                        style={{ color: !isCurrentlySoldOut ? '#FFFFFF' : '#94a3b8' }}
                      />
                    </button>
                  </div>
                );
              })()}
            </div>

            <div className="h-px bg-[#e2e8f0]/60 w-full" />

            {/* 3. Total Section */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold text-[#94a3b8] tracking-[0.15em] text-right">
                Total ({count} pax)
              </span>
              <span className="text-xl md:text-2xl font-black text-[#1e293b] leading-none">
                {formatIDR(ticketData.price * 1.15 * count)}
              </span>
            </div>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default OrderCounter;

type SeatmapViewerProps = {
  data?: SeatmapData[];
  selectedSeat?: string[];
  setSelectSeat?: (data: string) => void;
  available?: string;
  ticketData?: TicketProps;
  setIsFullscreen?: (data: boolean) => void;
  isFullscreen?: boolean;
};

const SeatmapViewer = ({ ticketData, data, selectedSeat, setSelectSeat, available, setIsFullscreen, isFullscreen }: SeatmapViewerProps) => {
  const [isCanvasMove, setIsCanvasMove] = useState(false);
  const [scale, setScale] = useState(1);
  const [canvasPos, setCanvasPos] = useState<[number, number]>([0, 0]);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const { seatmapData, seatmapOpen } = useContext(EventContext);
  const [lastTouch, setLastTouch] = useState<React.Touch>();
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (seatmapOpen !== undefined) {
      const area = seatmapData?.filter((e: SeatmapData) =>
        Array((e.col ?? 1) * (e.row ?? 1))
          .fill(e.prefix)
          .map((_, i) => `${e.prefix}${i + 1}`)
          .some((x) => ticketData?.available_seat_number?.includes(x))
      );

      if (area) {
        const [x, y]: [number, number] = area
          .map((e: SeatmapData) => e.position)
          .reduce<[number[], number[]]>(
            (c, n) => [
              [...c[0], n[0]],
              [...c[1], n[1]],
            ],
            [[], []]
          )
          .map((e: number[]) => e.reduce((sum: number, num: number) => sum + num, 0) / e.length) as [number, number];

        setCanvasPos([x * -1, y * -1]);
      }
    }
  }, [seatmapOpen]);

  const handleMouse = {
    down: () => {
      setIsCanvasMove(true);
    },
    up: () => {
      setIsCanvasMove(false);
    },
    move: (event: React.MouseEvent<HTMLDivElement>) => {
      if (isCanvasMove && canvasWrap?.current) {
        const [x, y] = canvasWrap?.current?.style?.transform
          ?.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
          ?.slice(1)
          .map(Number) || [0, 0];
        var currentScale = parseFloat(canvasWrap?.current?.style?.scale ?? "1");

        if (currentScale <= 0.01) currentScale = 1;

        const newX = x + event.movementX / currentScale;
        const newY = y + event.movementY / currentScale;

        if (canvasWrap?.current?.style) {
          canvasWrap.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      }
    },
    touchdown: (event: React.TouchEvent<HTMLDivElement>) => {
      setIsCanvasMove(true);
      const touch = event.touches[0];
      localStorage.setItem("lastTouch", JSON.stringify({ pageX: touch.pageX, pageY: touch.pageY }));
    },
    touchup: () => {
      setIsCanvasMove(false);
    },
    touchmove: (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));

        const lastDistance = parseFloat(localStorage.getItem("lastDistance") || "0");
        var currentScale = parseFloat(canvasWrap?.current?.style?.scale ?? "1");
        if (currentScale <= 0.01) currentScale = 1;

        if (lastDistance) {
          const scaleChange = distance / lastDistance;
          currentScale *= scaleChange;
          if (canvasWrap?.current?.style && currentScale > 0) {
            canvasWrap.current.style.scale = `${String(currentScale)}`;
          }
        }

        localStorage.setItem("lastDistance", String(distance));
      } else {
        const touch = event.touches[0];
        const lastTouch = JSON.parse(localStorage.getItem("lastTouch") || '{"pageX": 0, "pageY": 0}');
        var currentScale = parseFloat(canvasWrap?.current?.style?.scale ?? "1");
        if (currentScale <= 0.01) currentScale = 1;

        if (isCanvasMove && canvasWrap?.current) {
          const [x, y] = canvasWrap?.current?.style?.transform
            ?.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
            ?.slice(1)
            .map(Number) || [0, 0];

          const newX = x + (touch.pageX - (lastTouch.pageX ?? 0)) / currentScale;
          const newY = y + (touch.pageY - (lastTouch.pageY ?? 0)) / currentScale;

          if (canvasWrap?.current?.style) {
            canvasWrap.current.style.transform = `translate(${newX}px, ${newY}px)`;
          }

          localStorage.setItem("lastTouch", JSON.stringify({ pageX: touch.pageX, pageY: touch.pageY }));
        }
      }
    },
    wheel: (event?: React.WheelEvent<HTMLDivElement>, force?: "up" | "down") => {
      event?.preventDefault();
      document.body.style.overflow = "hidden";

      var currentScale = parseFloat(canvasWrap?.current?.style?.scale ?? "1");
      var scalingValue = 0.3;

      if (((event?.deltaY ?? 0) > 0 || force == "up") && currentScale > 0.5) {
        currentScale -= scalingValue;
      }

      if (((event?.deltaY ?? 0) < 0 || force == "down") && currentScale < 8) {
        currentScale += scalingValue;
      }

      if (canvasWrap?.current?.style && currentScale > 0) {
        canvasWrap.current.style.scale = `${String(currentScale)}`;
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        document.body.style.overflow = "";
        scrollTimeout.current = null;
      }, 1000);
    },
  };

  useEffect(() => {
    if (window) {
      window.addEventListener("mouseup", handleMouse.up);
    }
  }, []);

  if (!data) return <></>;

  return (
    <div
      onWheel={handleMouse.wheel}
      onMouseDown={handleMouse.down}
      onMouseUp={handleMouse.up}
      onMouseMove={handleMouse.move}
      onTouchStart={handleMouse.touchdown}
      onTouchEnd={handleMouse.touchup}
      onTouchMove={handleMouse.touchmove}
      className={`h-full w-full relative z-30 [&_*]:!select-none`}
    >
      <Flex className={`!absolute top-0 right-0 z-50`} gap={10}>
        <ActionIcon className={`!hidden md:!block`} color="gray.1" radius="xl" onClick={() => setIsFullscreen && setIsFullscreen(!isFullscreen)}>
          <Icon icon="lucide:fullscreen" className={`text-primary-base`} />
        </ActionIcon>
        <ActionIcon color="gray.1" radius="xl" onClick={() => handleMouse.wheel(undefined, "up")}>
          <Icon icon="uiw:minus" className={`text-primary-base`} />
        </ActionIcon>
        <ActionIcon color="gray.1" radius="xl" onClick={() => handleMouse.wheel(undefined, "down")}>
          <Icon icon="uiw:plus" className={`text-primary-base`} />
        </ActionIcon>
      </Flex>

      <Card
        ref={canvasWrap}
        bg="transparent"
        pos="relative"
        style={{
          overflow: "hidden",
          scale: `${scale * 100}%`,
          transform: `translate(${canvasPos[0]}px, ${canvasPos[1]}px)`,
        }}
        className={`z-20 !overflow-visible top-2/4`}
      >
        <Box className={`absolute top-2/4 left-2/4 w-[2px] h-[999vh] bg-grey/10 -translate-y-2/4 -translate-x-2/4`} />
        <Box className={`absolute top-2/4 left-2/4 w-[999vw] h-[2px] bg-grey/10 -translate-y-2/4 -translate-x-2/4`} />

        <Box className={`absolute z-20 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4`}>
          <SeatmapItem ticketData={ticketData} data={data} selectedSeat={selectedSeat} available={available} setSelectSeat={!isCanvasMove ? setSelectSeat : () => { }} />
        </Box>
      </Card>
    </div>
  );
};

const SeatmapItem = ({ ticketData, data, selectedSeat, setSelectSeat, available }: SeatmapViewerProps) => {
  const [loading, setLoading] = useState(false);
  const getContrastColor = useCallback((color: string) => {
    return contrastColor({ bgColor: color, threshold: 255 * 0.6 });
  }, []);

  const availableSeat = useMemo(() => {
    const soldSeat = ticketData?.has_ordered_seatnumber?.map((e) => e.seatnumber_ticket ?? "") ?? [];
    return available?.split(",").filter((e) => !soldSeat.includes(e));
  }, [available, ticketData]);

  const filteredArea = useMemo(() => {
    setLoading(true);

    const result = (data ?? []).map((e) => ({
      ...e,
      seat: chunk(
        (
          Array((e.row ?? 1) * (e.col ?? 1))
            .fill(e.prefix)
            .map((pre, i) => `${pre}${i + (e.starting_seat ?? 1)}`) ?? []
        ).map((s) => ({
          code: s,
          active: availableSeat?.includes(s),
          color: e.seatcolor ?? "#194e9e",
          selected: selectedSeat?.includes(s),
        })),
        e.col ?? 1
      ),
    }));

    setLoading(false);
    return result;
  }, [selectedSeat]);

  if (!data) return <></>;

  return (
    <>
      <LoadingOverlay visible={loading} />
      {filteredArea.map((e, i) => (
        <Box
          className={`absolute z-30 [&_.hvr]:hover:!flex -translate-x-2/4 -translate-y-2/4`}
          style={{
            transform: `rotate(${e.rotation ?? 0}deg)`,
            top: `${e.position[1]}px`,
            left: `${e.position[0]}px`,
            width: e.size && e.size[0] ? `${e.size[0]}px` : undefined,
            height: e.size && e.size[1] ? `${e.size[1]}px` : undefined,
          }}
          key={i}
        >
          <Box
            bg={e.background ?? (e.type != "box" ? "transparent" : "gray.1")}
            h="100%"
            style={{
              borderRadius: `${e.radius?.[0] ?? 5}px ${e.radius?.[1] ?? 5}px ${e.radius?.[2] ?? 5}px ${e.radius?.[3] ?? 5}px`,
            }}
            className={`rounded-md ${!e.background ? "" : "shadow-lg"}`}
          >
            <Box className={`absolute w-full h-full left-0 top-0 z-20`} />

            {e.type == "box" && (
              <Center h="100%">
                <Text fw={500} className={`uppercase`} c={getContrastColor(e.background ?? "#fff")}>
                  {e.text}
                </Text>
              </Center>
            )}

            {e.type != "box" && (
              <Flex className={`absolute top-2/4 -translate-y-2/4 z-20 ${!!e.background ? "-left-[30px]" : "-left-[15px]"}`} gap={5}>
                <Text fw={600} size="sm" c="gray.8">
                  {e.prefix}
                </Text>
              </Flex>
            )}

            {e.type != "box" && (
              <Flex className={`absolute top-2/4 -translate-y-2/4 ${!!e.background ? "-right-[30px]" : "-right-[15px]"}`} gap={5}>
                <Text fw={600} size="sm" c="gray.8">
                  {e.prefix}
                </Text>
              </Flex>
            )}

            {e.type != "box" && (
              <Stack h="100%" align="center" justify="center" gap={5} p={10}>
                {e.text && (
                  <Text size="xs" c="gray">
                    {e.text}
                  </Text>
                )}
                <Stack gap={3} w="100%" h="100%" justify="space-between">
                  {(e.seat ?? []).map((x, r) => (
                    <Flex w="100%" h="100%" justify="space-between" key={r} className={`!gap-[7px] md:!gap-[5px]`}>
                      {x.map((z, c) => (
                        <Tooltip label={z.code} key={c} fw={600}>
                          <Box onClick={() => z.active && setSelectSeat && setSelectSeat(z.code)} opacity={z.active ? (z.selected ? 0.5 : 1) : 0.1} w={20} h={25} key={c} className={`rounded-md overflow-hidden relative z-40 cursor-pointer`}>
                            <Box className={`relative z-10 !rounded-[5px] mt-[5px] border ${z.selected ? "border-[#fafafa30]" : " border-[#d0d0d0]"}`} style={{ height: "calc(100% - 7px)" }} bg={z.color} />
                            <Box className={`w-[calc(70%)] !rounded-[5px] absolute top-0 left-2/4 -translate-x-2/4 h-[7px] ${z.selected ? "" : "border border-[#d0d0d0]"}`} style={{ height: "calc(100% - 5px)" }} bg={z.color} />
                          </Box>
                        </Tooltip>
                      ))}
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            )}
          </Box>
        </Box>
      ))}
    </>
  );
};