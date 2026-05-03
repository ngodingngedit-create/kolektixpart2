import React, { useCallback, useContext, useMemo, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import OrderCounter from "../OrderCounter";
import { TicketProps } from "@/utils/globalInterface";
import moment from "moment";
import Cookies from "js-cookie";
import { SeatmapData } from "@/utils/formInterface";
import { EventContext } from "@/pages/event/[slug]";
import { notifications } from "@mantine/notifications";
import { Flex, Text, Box, ActionIcon, Popover } from "@mantine/core";
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
}

const monthsId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const daysIdShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DateTab({ maxOrder, counts, setCounts, data, isLogin, selected, setSelected, setStep, scrollToTop, hideDateStrip, hideTicketList, noShadow, baseDate: propsBaseDate, setBaseDate: propsSetBaseDate }: Props) {
  const { eventData } = useContext(EventContext);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [internalBaseDate, setInternalBaseDate] = React.useState<Date | null>(null);

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

  return (
    <div className={`flex flex-col bg-white overflow-hidden ${hideDateStrip && hideTicketList ? 'hidden' : ''} font-inter`}>
      <TabGroup manual selectedIndex={selected} onChange={setSelected}>
        {/* 1. Header Section (Date Strip) */}
        {!hideDateStrip && (
          <div className="px-5 sm:px-7 pt-2 pb-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-3">
                <h2 className="text-[13px] font-extrabold text-gray-900 tracking-tight leading-none">
                  Jadwal Event
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 group cursor-default">
                  <Icon icon="solar:calendar-minimalistic-bold-duotone" className="text-[14px] text-primary-base group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-gray-700 tracking-widest leading-none">
                    {monthsId[selectedDateObj.getMonth()]} {selectedDateObj.getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full mt-2 relative group/scroll">
              <TabList className="flex-1 flex items-center gap-2.5 overflow-x-auto pb-4 pt-1.5 scroll-smooth pr-16 select-none
                [&::-webkit-scrollbar]:h-[5px]
                [&::-webkit-scrollbar-track]:bg-gray-50
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
                transition-all duration-300
              ">
                {groupedTickets.map(({ date, tickets }, idx) => {
                  const d = new Date(date);
                  const isSelected = selected === idx;
                  const hasTickets = tickets.length > 0;

                  return (
                    <Tab
                      key={date}
                      disabled={!hasTickets}
                      className={`min-w-[42px] sm:min-w-[50px] h-[44px] sm:h-[48px] rounded-lg flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none
                        ${isSelected
                          ? 'bg-gradient-to-br from-[#194E9E] to-[#0b387c] shadow-[0_10px_20px_-5px_rgba(25,78,158,0.3)] -translate-y-0.5'
                          : hasTickets
                            ? 'bg-white hover:bg-blue-50/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                            : 'bg-gray-50/50 opacity-40 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className={`text-[6.5px] font-bold tracking-widest leading-none mb-1 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                        {daysIdShort[d.getDay()]}
                      </span>
                      <span className={`text-[12px] sm:text-[14px] font-bold leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {d.getDate()}
                      </span>
                    </Tab>
                  );
                })}
              </TabList>

              {/* Fixed Calendar Icon on the right of the strip */}
              <div className="absolute right-0 top-0 bottom-4 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-12 pr-1 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                <Popover position="bottom-end" shadow="xl" radius="xl" withArrow offset={10}>
                  <Popover.Target>
                    <div className="min-w-[42px] sm:min-w-[50px] h-[44px] sm:h-[48px] rounded-lg flex items-center justify-center cursor-pointer bg-white shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 group -translate-y-[1px]">
                      <Icon icon="solar:calendar-bold-duotone" className="text-[20px] text-[#194E9E] group-hover:scale-110 transition-transform" />
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown p={10}>
                    <DatePicker
                      value={selectedDateObj}
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
              </div>
            </div>
          </div>
        )}

        {/* Divider if both sections shown */}
        {/* No Divider */}

        {/* 4. Ticket Category Selection Section (Ticket List) */}
        {!hideTicketList && (
          <div className={`pt-2 ${hideDateStrip ? 'p-0' : 'p-5 sm:p-7'}`}>
            {!hideDateStrip && (
              <h2 className="text-[15px] sm:text-[17px] font-black text-gray-900 tracking-tight leading-none mb-6 px-1">
                Pilih Tiket
              </h2>
            )}

            {groupedTickets[selected] && (
              <Stack gap={24}>
                {Object.entries(groupByCategory(sortedTicket(groupedTickets[selected].tickets))).map(([category, catTickets]) => (
                  <div key={category} className="bg-white rounded-[24px] shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden mb-4">
                    {/* Category Title - Shown for all categories */}
                    <div className="px-6 py-4 bg-gray-50/10">
                      <Text fw={900} size="sm" className="tracking-widest text-[#194E9E]">
                        {category}
                      </Text>
                    </div>

                    {/* Ticket Items */}
                    <div className="flex flex-col gap-3 p-3">
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
