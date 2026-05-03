import { useContext, useEffect, useMemo, useState } from "react";
import DateTab from "@/components/DateTab";
import { TicketProps } from "@/utils/globalInterface";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ActionIcon, Badge, Button, Card, Divider, Drawer, Flex, NumberFormatter, Stack, Text, UnstyledButton, Image, ScrollArea, Box } from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";
import { EventContext } from "@/pages/event/[slug]";
import { useTranslation } from "react-i18next";
import config from "@/Config";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { Modal, ModalContent } from "@nextui-org/react";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  counts: { [key: number]: number | string[] };
  setCounts: (counts: { [key: string]: number | string[] }) => void;
  data: TicketProps[];
  isGratis?: boolean;
  maxOrder?: number;
  isLogin: boolean;
  totalCount: number;
  totalSubtotalPrice: number;
  setStep: (step: number) => void;
  scrollToTop: () => void;
  selected: number;
  setSelected: (index: number) => void;
  storeLocalStorage: () => void;
  venue: any;
}

const TicketViewBlock = ({ maxOrder, isGratis, counts, setCounts, data, isLogin, totalSubtotalPrice, totalCount, scrollToTop, setStep, selected, setSelected, storeLocalStorage, venue }: Props) => {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [showVenue, setShowVenue] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [baseDate, setBaseDate] = useState<Date | null>(null);
  const { ticket, setTicket, seatmapData } = useContext(EventContext);
  const hasSeatmap = useMemo(() => seatmapData && seatmapData.length > 0, [seatmapData]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const { displayTotalCount, displayTotalSubtotalPrice } = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        const id = item.id;
        if (id == null) return acc;
        const rawCount = counts[id];
        const physicalTicketQty = typeof rawCount === "number" ? rawCount : Array.isArray(rawCount) ? rawCount.length : 0;
        if (physicalTicketQty <= 0) return acc;
        const isBundling = Number(item.is_bundling ?? 0) === 1;
        const bundlingQty = Number(item.bundling_qty ?? 0);
        const price = Number(item?.price ?? 0);
        if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
          const packageCount = Math.ceil(physicalTicketQty / bundlingQty);
          acc.displayTotalCount += packageCount;
          acc.displayTotalSubtotalPrice += price * packageCount;
        } else {
          acc.displayTotalCount += physicalTicketQty;
          acc.displayTotalSubtotalPrice += price * physicalTicketQty;
        }
        return acc;
      },
      { displayTotalCount: 0, displayTotalSubtotalPrice: 0 }
    );
  }, [data, counts]);

  const handleDelete = (index: number) => {
    if (ticket && setTicket) {
      const id = ticket[index].event_ticket_id;
      const newCount = Object.keys(counts).reduce((acc, q) => {
        if (parseInt(q) !== id) acc[parseInt(q)] = counts[parseInt(q)];
        return acc;
      }, {} as { [key: number]: number | string[] });
      setCounts(newCount ?? {});
      setTicket(ticket?.filter((_, i) => i != index));
    }
  };

  const SummaryBody = () => (
    <div className="flex flex-col h-full max-h-[70vh] md:max-h-none">
      {/* 1. Header (Fixed) */}
      <div className="flex justify-between items-center w-full mb-5 shrink-0 px-1">
        <Text size="sm" fw={800} className="text-gray-900 tracking-widest">
          {t("selectedTicket")}
        </Text>
        <UnstyledButton onClick={() => setEdit(!edit)}>
          <Flex align="center" className={`${edit ? "[&_*]:!text-grey" : "[&_*]:!text-[#194E9E]"}`} gap={8}>
            <Text fw={700} size="xs" className="tracking-wider">
              {edit ? t("selectedTicketEndEdit") : "Ubah"}
            </Text>
            {!edit && <Icon icon="solar:pen-bold-duotone" className="text-lg" />}
          </Flex>
        </UnstyledButton>
      </div>

      {/* 2. Scrollable Ticket List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent -mx-2 px-2 flex flex-col gap-3">
        {ticket?.map((e, i) => {
          const originalTicket = data.find((item) => item.id === e.event_ticket_id);
          const isBundling = Number(originalTicket?.is_bundling ?? 0) === 1;
          const bundlingQty = Number(originalTicket?.bundling_qty ?? 0);
          const displayQty = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? 1 : e.seat_number?.length ?? e.qty_ticket;
          const displayPrice = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? e.price : e.subtotal_price;

          return (
            <div key={i} className="flex items-center justify-between gap-4 bg-white p-4 rounded-[20px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-500 group cursor-default">
              <Flex gap={12} align="center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C41D6]/10 to-[#1C41D6]/5 flex items-center justify-center group-hover:from-[#1C41D6]/20 group-hover:to-[#1C41D6]/10 transition-all duration-500">
                  <Icon icon={originalTicket?.icon || "solar:ticket-bold-duotone"} className="text-[#1C41D6] text-xl" />
                </div>
                <Stack gap={0}>
                  <Text size="sm" fw={700} className="text-gray-900 line-clamp-1">
                    {e.name}
                    <Badge ml={8} variant="light" color="blue" size="xs" className="font-bold">
                      {displayQty}x
                    </Badge>
                  </Text>
                  {e.seat_number && (
                    <Text size="xs" fw={500} className="text-gray-400 mt-0.5">
                      Seat: {e.seat_number.join(", ")}
                    </Text>
                  )}
                </Stack>
              </Flex>

              <div className="flex items-center gap-3">
                <Text fw={700} size="sm" className="text-[#1C41D6]">
                  <NumberFormatter prefix="Rp " thousandSeparator="." value={displayPrice} />
                </Text>
                {edit && (
                  <ActionIcon onClick={() => handleDelete(i)} variant="subtle" color="red" radius="md" size="sm">
                    <Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="text-lg" />
                  </ActionIcon>
                )}
              </div>
            </div>
          );
        })}

        {(ticket?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50/30 rounded-[32px] border border-dashed border-[rgb(227,227,227)]">
            <Icon icon="solar:ticket-broken" className="text-3xl text-gray-300 mb-2" />
            <Text size="xs" fw={600} className="text-gray-400 text-center tracking-wider">
              {t("selectedTicketEmpty")}
            </Text>
          </div>
        )}
      </div>

      {/* 3. Footer (Fixed) */}
      {(ticket?.length ?? 0) > 0 && (
        <div className="mt-8 mb-2 shrink-0 border-t border-[#e4e4e7] pt-6">
          <div className="flex items-center justify-between gap-4 px-1">
            <span className="text-[12px] font-bold text-gray-400 tracking-tight">Total ({totalCount}) Tiket</span>
            <div className="text-[18px] font-bold text-gray-900 tracking-tight">
              <NumberFormatter prefix="Rp " thousandSeparator="." value={displayTotalSubtotalPrice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="text-dark font-inter">
      <Drawer 
        opened={openDetail} 
        onClose={() => setOpenDetail(!openDetail)} 
        withCloseButton={false} 
        position="bottom" 
        radius="32px 32px 0 0" 
        size="75vh" 
        className="[&_.mantine-Drawer-content]:bg-white [&_.mantine-Drawer-body]:p-0 [&_.mantine-Drawer-body]:h-full"
      >
        <div className="flex flex-col h-[75vh] font-inter">
          {/* Top Handle */}
          <div className="pt-4 pb-2 shrink-0">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />
          </div>

          {/* Main Body with Fixed/Scrollable logic inside SummaryBody */}
          <div className="flex-1 overflow-hidden px-5 pb-4">
            <SummaryBody />
          </div>

          {/* Fixed Bottom Action */}
          <div className="p-5 pt-0 shrink-0">
            <Button
              size="lg"
              radius="xl"
              fullWidth
              className="bg-[#194E9E] hover:bg-[#0b387c] transition-all h-14 shadow-lg shadow-blue-900/10 font-black text-sm active:scale-[0.98]"
              disabled={totalCount === 0}
              onClick={() => {
                if (isLogin) {
                  Cookies.remove("ticketCount", { path: "/" });
                  setStep(33);
                  scrollToTop();
                } else storeLocalStorage();
              }}
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </div>
      </Drawer>

      <div className="flex-1 flex flex-col md:flex-row bg-[#fafbfc]">
        {/* MAIN CONTENT AREA: RESPONSIVE LAYOUT */}
        <div className="flex-1 flex flex-col md:flex-row min-w-0">
          {/* LEFT COLUMN: DATE + TICKET TYPES (Full width on mobile) */}
          <div className="flex-1 md:flex-[2.2] flex flex-col bg-white shadow-none md:shadow-[30px_0_60px_-30px_rgba(0,0,0,0.04)] z-10 min-w-0">
            {/* TOP: DATE STRIP (STICKY below sub-navbar) */}
            <div id="date-strip" className="w-full bg-white/95 backdrop-blur-md z-30 shrink-0 shadow-sm transition-all duration-500 sticky top-[70px]">
              <DateTab
                maxOrder={maxOrder}
                counts={counts}
                setCounts={setCounts}
                data={data}
                isLogin={isLogin}
                selected={selected}
                setSelected={setSelected}
                setStep={setStep}
                scrollToTop={scrollToTop}
                hideTicketList={true}
                noShadow={true}
                baseDate={baseDate}
                setBaseDate={setBaseDate}
              />
            </div>

            {/* BOTTOM: TICKET LIST */}
            <div className="flex-1">
              <div className="px-4 md:px-8 py-6">
                <DateTab
                  maxOrder={maxOrder}
                  counts={counts}
                  setCounts={setCounts}
                  data={data}
                  isLogin={isLogin}
                  selected={selected}
                  setSelected={setSelected}
                  setStep={setStep}
                  scrollToTop={scrollToTop}
                  hideDateStrip={true}
                  noShadow={false}
                  baseDate={baseDate}
                  setBaseDate={setBaseDate}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY (Sticky Sidebar) */}
          <div className="hidden md:flex md:w-[350px] lg:w-[400px] flex-col bg-[#fafbfc] p-6 pt-4 gap-6 min-w-0">
            <div className="sticky top-[120px] self-start w-full bg-white rounded-[32px] shadow-[0_30px_100px_-20px_rgba(28,65,214,0.08)] p-6 transition-all duration-700 ease-out hover:shadow-[0_40px_120px_-20px_rgba(28,65,214,0.12)]">
              <SummaryBody />
            </div>
          </div>
        </div>

        {/* GLOBAL BOTTOM BAR (MOBILE REDESIGN - COMFORTABLE) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.1)] z-50 font-inter md:hidden pb-safe">
          <div className="w-full px-6 py-3.5 flex flex-col gap-3">
            {/* Row 1: Price & Detail Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase leading-none mb-1">Total Harga</span>
                <span className="text-[18px] font-black text-[#1e293b] leading-none">Rp {displayTotalSubtotalPrice.toLocaleString("id-ID")}</span>
              </div>
              <button 
                onClick={() => setOpenDetail(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/50 rounded-full active:scale-95 transition-all"
              >
                <span className="text-[11px] font-black text-[#194E9E]">({totalCount}) Detail</span>
                <Icon icon="solar:alt-arrow-up-bold" className="text-[#194E9E] text-[11px]" />
              </button>
            </div>

            {/* Row 2: Main Action & Chat */}
            <div className="flex items-center gap-3">
              <button
                className={`flex-1 ${totalCount > 0
                  ? "bg-[#194E9E] active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
                  } text-white h-12 font-black text-[14px] rounded-2xl transition-all shadow-lg shadow-blue-900/5 flex items-center justify-center`}
                onClick={() => {
                  if (isLogin) {
                    Cookies.remove("ticketCount", { path: "/" });
                    setStep(33);
                    scrollToTop();
                  } else storeLocalStorage();
                }}
                disabled={totalCount === 0}
              >
                {isGratis ? "Registrasi Sekarang" : "Beli Tiket Sekarang"}
              </button>
              
              <button className="w-12 h-12 bg-[#194E9E] rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-blue-900/5">
                <Icon icon="solar:chat-round-dots-bold" className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP BOTTOM BAR (Original) */}
        <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.08)] z-50 font-inter">
          <div className="w-full px-8 py-3 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-[#94a3b8] tracking-wider">Total ({totalCount}) Tiket</p>
              <p className="text-[18px] font-black text-gray-900 leading-none">Rp {displayTotalSubtotalPrice.toLocaleString("id-ID")}</p>
            </div>

            <button
              className={`${totalCount > 0
                ? "bg-[#194E9E] hover:bg-[#0b387c] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                : "bg-primary-disabled cursor-not-allowed"
                } text-white px-8 py-2.5 font-bold text-[13px] rounded-2xl transition-all duration-300 shadow-md`}
              onClick={() => {
                if (isLogin) {
                  Cookies.remove("ticketCount", { path: "/" });
                  setStep(33);
                  scrollToTop();
                } else storeLocalStorage();
              }}
              disabled={totalCount === 0}
            >
              {isGratis ? "Registrasi" : "Beli Tiket"}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showVenue} onOpenChange={setShowVenue} placement="auto" size="4xl" closeButton>
        <ModalContent className="text-dark font-inter h-full">
          {() => (
            <div className="flex flex-col w-full h-full overflow-auto">
              <Slide autoplay={false}>
                {venue?.map((e: { title: string; image: string }, i: number) => (
                  <div key={i}>
                    <Image src={`${config.assetUrl}event/${e.image}`} alt="image" radius={8} mt={-5} />
                  </div>
                ))}
              </Slide>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TicketViewBlock;
