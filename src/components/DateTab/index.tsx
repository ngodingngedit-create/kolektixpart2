import React, { useCallback, useContext, useMemo, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import OrderCounter from "../OrderCounter";
import { TicketProps } from "@/utils/globalInterface";
import moment from "moment";
import Cookies from "js-cookie";
import { SeatmapData } from "@/utils/formInterface";
import { EventContext } from "@/pages/event/[slug]";
import { notifications } from "@mantine/notifications";
import { Flex, Text, Box, ActionIcon, Popover, UnstyledButton } from "@mantine/core";
import { Icon } from "@iconify/react";
import { DatePicker } from "@mantine/dates";

import dayjs from "dayjs";

interface GroupTicket {
  date: string;
  tickets: TicketProps[];
}

interface Props {
  counts: { [key: number]: number | string[] };
  setCounts: (counts: { [key: string]: number | string[] }) => void;
  data: TicketProps[];
  isLogin: boolean;
  selected: number;
  setSelected: (index: number) => void;
  maxOrder?: number;
  setStep: (step: number) => void;
  scrollToTop: () => void;
  hideDateStrip?: boolean;
  hideTicketList?: boolean;
  noShadow?: boolean;
  baseDate?: Date | null;
  setBaseDate?: (date: Date | null) => void;
  hideTitle?: boolean;
}

const monthsId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const monthsIdShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const daysIdShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const daysIdLong = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DateTab({ maxOrder, counts, setCounts, data, isLogin, selected, setSelected, setStep, scrollToTop, hideDateStrip, hideTicketList, noShadow, baseDate: propsBaseDate, setBaseDate: propsSetBaseDate, hideTitle }: Props) {
  const { eventData } = useContext(EventContext);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [internalBaseDate, setInternalBaseDate] = React.useState<Date | null>(null);
  const [collapsedCategories, setCollapsedCategories] = React.useState<{ [key: string]: boolean }>({});
  const [popoverOpened, setPopoverOpened] = React.useState(false);
  const [viewDate, setViewDate] = React.useState<Date>(new Date());

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const baseDate = propsBaseDate !== undefined ? propsBaseDate : internalBaseDate;
  const setBaseDate = propsSetBaseDate !== undefined ? propsSetBaseDate : setInternalBaseDate;

  // Initialize baseDate from first ticket if available in parent or locally
  useEffect(() => {
    if (!baseDate && data.length > 0) {
      const firstDate = new Date(data[0].event_schedule_date || data[0].ticket_date || data[0].start_date);
      setBaseDate(firstDate);
    }
  }, [data, baseDate, setBaseDate]);

  const handleCount = (id: number, newCount: number | string) => {
    var dataCount = counts[id];
    if (!dataCount) dataCount = 0;

    const countData = typeof newCount == "number" ? newCount : (typeof dataCount != "number" ? dataCount : []).includes(newCount) ? (dataCount as string[]).filter((e) => e != newCount) : [...((typeof dataCount != "number" ? dataCount : []) ?? []), newCount];
    const length = typeof countData == "number" ? countData : countData.length;

    if (length > (eventData?.max_buy_ticket ?? 999)) {
      notifications.show({
        message: `Maksimal ${eventData?.max_buy_ticket} tiket`,
        color: "red",
      });
      return;
    }

    setCounts({
      ...counts,
      [id]: countData,
    });
  };

  const groupedTickets = useMemo(() => {
    const combineTicketsByDate = (tickets: TicketProps[]): GroupTicket[] => {
      const groupedByDate = tickets.reduce((acc: { [key: string]: TicketProps[] }, item) => {
        const dates = item.valid_dates || [item.event_schedule_date || item.ticket_date || item.start_date];

        dates.forEach(date => {
          if (date != null) {
            const dateStr = moment(date).format("YYYY-MM-DD");
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(item);
          }
        });
        return acc;
      }, {});

      if (tickets.length === 0 && !baseDate) return [];

      const referenceDate = baseDate ? moment(baseDate) : moment(tickets[0].event_schedule_date || tickets[0].ticket_date || tickets[0].start_date);
      const startOfMonth = referenceDate.clone().startOf('month');
      const endOfMonth = referenceDate.clone().endOf('month');

      const allDays: GroupTicket[] = [];
      let currentDay = startOfMonth.clone();

      while (currentDay.isSameOrBefore(endOfMonth)) {
        const dateStr = currentDay.format("YYYY-MM-DD");
        allDays.push({
          date: dateStr,
          tickets: groupedByDate[dateStr] || []
        });
        currentDay.add(1, 'day');
      }

      return allDays;
    };

    return combineTicketsByDate(data);
  }, [data, baseDate]);

  useEffect(() => {
    // Auto-select first active date if selected is 0
    if (selected === 0 && groupedTickets.length > 0) {
      const firstActiveIdx = groupedTickets.findIndex(g => g.tickets.length > 0);
      if (firstActiveIdx !== -1) {
        setSelected(firstActiveIdx);
      }
    }
  }, [groupedTickets, selected]);

  const sortedTicket = useCallback((data: TicketProps[]) => data, []);

  const groupByCategory = (tickets: TicketProps[]) => {
    return tickets.reduce((acc: { [key: string]: TicketProps[] }, ticket) => {
      const isBundling = ticket.is_bundling === 1;
      const category = isBundling
        ? "Bundling"
        : (ticket as any).has_category_ticket?.name || ticket.ticket_category || "Tiket";

      if (!acc[category]) acc[category] = [];
      acc[category].push(ticket);
      return acc;
    }, {});
  };

  const selectedDateObj = useMemo(() => {
    if (groupedTickets[selected]) return new Date(groupedTickets[selected].date);
    return new Date();
  }, [groupedTickets, selected]);

  useEffect(() => {
    setViewDate(selectedDateObj);
  }, [selectedDateObj]);

  return (
    <div className={`flex flex-col overflow-hidden ${hideDateStrip && hideTicketList ? 'hidden' : ''} font-inter`}>
      <TabGroup manual selectedIndex={selected} onChange={setSelected}>
        {/* 1. Header Section (Date Strip) */}
        {!hideDateStrip && (
          <div className="px-4 pt-2 pb-2">
            <div className="flex items-center gap-4 w-full relative">
              <TabList className="flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scroll-smooth select-none scrollbar-hide
                [&::-webkit-scrollbar]:hidden
              ">
                {groupedTickets.map(({ date, tickets }, idx) => {
                  const d = new Date(date);
                  const isSelected = selected === idx;
                  const hasTickets = tickets.length > 0;

                  return (
                    <Tab
                      key={date}
                      disabled={!hasTickets}
                      className={`min-w-[56px] md:min-w-[64px] h-[48px] md:h-[56px] rounded-[8px] flex flex-col items-center justify-center transition-all duration-300 focus:outline-none shrink-0
                        ${isSelected
                          ? 'bg-[#194E9E] shadow-[0_6px_12px_-4px_rgba(25,78,158,0.4)]'
                          : hasTickets
                            ? 'bg-transparent hover:bg-gray-100'
                            : 'bg-transparent opacity-30 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className={`text-[8px] md:text-[9px] font-medium leading-none mb-1 ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                        {daysIdLong[d.getDay()].substring(0, 3)}
                      </span>
                      <span className={`text-[11px] md:text-[12px] font-bold leading-none ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {d.getDate()} {monthsIdShort[d.getMonth()]}
                      </span>
                    </Tab>
                  );
                })}
              </TabList>

              <div className="shrink-0 pl-3 md:pl-4 border-l border-[#e4e4e7]">
                <Popover
                  position="bottom-end"
                  shadow="xl"
                  radius="md"
                  withArrow
                  offset={10}
                  onOpen={() => setPopoverOpened(true)}
                  onClose={() => setPopoverOpened(false)}
                >
                  <Popover.Target>
                    <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-transparent transition-all cursor-pointer">
                      <Icon
                        icon="solar:calendar-minimalistic-linear"
                        className={`text-[18px] md:text-[22px] transition-colors ${popoverOpened ? "text-[#194E9E]" : "text-[#6c6c6c]"}`}
                      />
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown p={10} className="bg-white border border-gray-200/80 [&_.mantine-DatePicker-calendarHeaderLevel]:!text-black [&_.mantine-DatePicker-calendarHeaderLevel]:!font-semibold [&_.mantine-DatePicker-calendarHeaderControl]:!text-black hover:[&_button]:!bg-gray-100 rounded-[8px]">
                    <DatePicker
                      value={selectedDateObj}
                      date={viewDate}
                      onDateChange={setViewDate}
                      onChange={(date) => {
                        if (date) {
                          setBaseDate(date);
                          const dayIndex = date.getDate() - 1;
                          setSelected(dayIndex);
                        }
                      }}
                    />
                  </Popover.Dropdown>
                </Popover>
              </div>

              {/* Fixed Calendar Icon removed and merged into Header Pill */}
            </div>
          </div>
        )}

        {/* Divider if both sections shown */}
        {/* No Divider */}

        {/* 4. Ticket Category Selection Section (Ticket List) */}
        {!hideTicketList && (
          <div className={`pt-2 ${hideDateStrip ? 'p-0' : 'p-5'}`}>
            {!hideDateStrip && (
              <h2 className="text-[12px] font-black text-gray-400 tracking-[0.1em] leading-none uppercase mb-6 px-1">
                Pilih Tiket
              </h2>
            )}

            {groupedTickets[selected] && (
              <Stack gap={16}>
                {Object.entries(groupByCategory(sortedTicket(groupedTickets[selected].tickets))).map(([category, catTickets]) => (
                  <div key={category} className="bg-[#F3F4F6] rounded-[8px] p-6 md:p-8 ml-1 md:ml-2 mr-1 md:mr-0 shadow-[0px_8px_30px_rgba(0,0,0,0.05)]">
                    {/* Category Title - Shown for all categories */}
                    <div className="flex items-center justify-between px-1 py-2 mb-4">
                      <Text fw={900} size="md" className="tracking-[0.15em] text-[#194E9E] uppercase md:text-lg">
                        {category}
                      </Text>
                      <UnstyledButton onClick={() => toggleCategory(category)} className="p-1">
                        <Icon
                          icon={collapsedCategories[category] ? "solar:alt-arrow-down-linear" : "solar:alt-arrow-up-linear"}
                          className="text-gray-400 text-[20px] hover:text-gray-600 transition-all duration-300"
                        />
                      </UnstyledButton>
                    </div>

                    {/* Ticket Items */}
                    <div className={`flex flex-col gap-4 transition-all duration-500 overflow-hidden ${collapsedCategories[category] ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'}`}>
                      {(catTickets as TicketProps[]).map((item, index) => (
                        <OrderCounter
                          key={item.id}
                          index={index}
                          isFullbook={(item?.is_fullbook ?? 0) === 1}
                          maxOrder={maxOrder}
                          ticketData={item}
                          description={item.description}
                          isLogin={isLogin}
                          count={counts[item.id]}
                          setCount={(newCount) => handleCount(item.id, newCount)}
                          isSoldOut={item.is_soldout === 1}
                          isFinish={item.is_finish === 1}
                          isReady={item.is_ready === 1}
                          title={item.name}
                          price={item.price}
                          isExpanded={expandedId === item.id}
                          onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          onOrder={() => {
                            Cookies.remove("ticketCount", { path: "/" });
                            setStep(33);
                            scrollToTop();
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </Stack>
            )}
          </div>
        )}
      </TabGroup>
    </div>
  );
}

const Stack = ({ children, gap }: { children: React.ReactNode; gap: number }) => (
  <div className="flex flex-col" style={{ gap }}>
    {children}
  </div>
);
