import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Container,
  Flex,
  Stack,
  Text,
  Card,
  Button,
  Avatar,
  Group,
  Badge,
  SimpleGrid,
  Breadcrumbs,
  Anchor,
  Box,
  Divider,
  ActionIcon,
  List,
  Title,
  ScrollArea,
  ThemeIcon,
  Accordion,
  Popover,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Icon } from '@iconify/react/dist/iconify.js';

// Mock data for services
const MOCK_SERVICES = [
  {
    id: 1,
    title: "Event Photography - Basic",
    description: "Sempurna untuk acara kecil atau dokumentasi singkat dengan hasil berkualitas tinggi.",
    duration: "2 Jam Durasi",
    deliverables: "30+ Foto Edit",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    popular: true
  },
  {
    id: 2,
    title: "Event Photography - Standard",
    description: "Paket paling populer untuk event menengah seperti seminar, workshop, atau gathering perusahaan.",
    duration: "5 Jam Durasi",
    deliverables: "100+ Foto Edit",
    price: 3500000,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    popular: false
  },
  {
    id: 3,
    title: "Event Photography - Premium",
    description: "Cakupan lengkap untuk event besar sepanjang hari dengan dokumentasi mendalam dan highlight khusus.",
    duration: "Full Time (8-12 Jam)",
    deliverables: "Semua Foto (Min. 250+ Edit)",
    price: 6000000,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
    popular: false
  },
  {
    id: 4,
    title: "Photo Editing Service",
    description: "Layanan editing profesional untuk memperbaiki warna, pencahayaan, dan komposisi foto Anda.",
    duration: "3-5 Hari Kerja",
    deliverables: "Unlimited Revisions (T&C)",
    price: 750000,
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800",
    popular: false
  },
];

const ServiceDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [openSchedules, setOpenSchedules] = useState<number[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const toggleSchedule = (serviceId: number) => {
    setOpenSchedules((prev) =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const breadcrumbItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Talenta', href: '/talent' },
    { title: 'Aldi Ramadhan', href: `/talent/${id}` },
    { title: 'Layanan', href: '#' },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      size="xs"
      fw={500}
      c={index === 3 ? 'dimmed' : '#194E9E'}
      className="hover:underline"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Header */}
      <Box bg="#001B44" py={12}>
        <Container size={1380}>
          <Flex justify="space-between" align="center">
            <Group gap={40}>
              <Text c="white" fw={900} size="xl" style={{ letterSpacing: '-1px' }}>kolektix</Text>
              <Group gap={30}>
                {['Event', 'Merchandise'].map((item) => (
                  <Text key={item} c="white" size="sm" fw={500} className="cursor-pointer hover:opacity-80">
                    {item}
                  </Text>
                ))}
                <Button
                  variant="filled"
                  color="#194E9E"
                  radius="xl"
                  size="sm"
                  px={24}
                  className="font-bold"
                >
                  Talenta
                </Button>
                {['Venue', 'Tracking'].map((item) => (
                  <Text key={item} c="white" size="sm" fw={500} className="cursor-pointer hover:opacity-80">
                    {item}
                  </Text>
                ))}
              </Group>
            </Group>

            <Group gap={20}>
              <ActionIcon variant="transparent" c="white">
                <Icon icon="solar:magnifer-linear" width={20} />
              </ActionIcon>
              <Button
                variant="white"
                c="#001B44"
                radius="xl"
                size="sm"
                leftSection={<Icon icon="tabler:plus" width={16} />}
                className="font-bold"
              >
                Buat Event
              </Button>
              <Group gap={12}>
                <Box className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                  <Image src="https://flagcdn.com/id.svg" alt="ID Flag" width={24} height={24} />
                </Box>
                <Group gap={8} className="bg-white/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                  <Avatar size={24} radius="xl" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" />
                  <Icon icon="tabler:chevron-down" width={14} color="white" />
                </Group>
              </Group>
            </Group>
          </Flex>
        </Container>
      </Box>

      <Container size={1380} pt={100} pb={40} px={{ base: 5, md: 20 }}>
        <Breadcrumbs
          separator={<Icon icon="tabler:chevron-right" width={14} />}
          mb={24}
        >
          {breadcrumbItems}
        </Breadcrumbs>

        <Box mb={20}>
          <Title order={1} size="h2" fw={800} mb={4} c="dark.9">Sewa Talenta</Title>
          <Text size="xs" c="dimmed">Isi detail kebutuhan Anda untuk memesan talenta</Text>
        </Box>

        {/* Date Selection Section - Sticky with Mask */}
        <Box
          pos="sticky"
          top={65}
          style={{ zIndex: 10 }}
          className="bg-[#F8F9FA] py-3 mb-25"
        >
          <Card
            radius={12}
            p="xs"
            withBorder
            className="shadow-sm bg-white"
          >
            <Flex align="center" gap={0} wrap="nowrap">
              <Box style={{ flex: 1, overflow: 'hidden' }}>
                <ScrollArea scrollbars="x" type="never">
                  <Flex gap={{ base: 12, md: 24 }} align="center" px={4}>
                    {Array.from({ length: 14 }).map((_, i) => {
                      const date = dayjs().add(i, 'day');
                      const isSelected = dayjs(selectedDate).isSame(date, 'day');

                      return (
                        <Stack
                          key={i}
                          gap={2}
                          align="center"
                          className={`cursor-pointer transition-all ${isSelected ? 'bg-[#194E9E] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                          px={12}
                          py={isSelected ? 8 : 6}
                          style={{ borderRadius: '10px', minWidth: '64px' }}
                          onClick={() => setSelectedDate(date.toDate())}
                        >
                          <Text size="10px" fw={500} c={isSelected ? 'white' : 'dimmed'} mb={-2}>
                            {date.locale('id').format('ddd')}
                          </Text>
                          <Stack gap={0} align="center">
                            <Text size="sm" fw={800} c={isSelected ? 'white' : 'dark.9'} style={{ lineHeight: 1 }}>
                              {date.format('DD')}
                            </Text>
                            <Text size="10px" fw={600} c={isSelected ? 'white' : 'dimmed'} style={{ textTransform: 'uppercase' }}>
                              {date.locale('id').format('MMM')}
                            </Text>
                          </Stack>
                        </Stack>
                      );
                    })}
                  </Flex>
                </ScrollArea>
              </Box>

              <Box px={15} style={{ borderLeft: '1px solid #E9ECEF' }}>
                <Popover position="bottom-end" shadow="md" withArrow>
                  <Popover.Target>
                    <ActionIcon variant="light" color="blue" size="lg" radius="md">
                      <Icon icon="solar:calendar-bold" width={20} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown p={0}>
                    <DatePicker
                      value={selectedDate}
                      onChange={(val) => val && setSelectedDate(val)}
                    />
                  </Popover.Dropdown>
                </Popover>
              </Box>
            </Flex>
          </Card>
        </Box>



        <Flex direction={{ base: 'column', md: 'row' }} gap={30} align="flex-start">
          {/* Main Content: Service List */}
          <Stack gap={20} style={{ flex: 1 }}>
            {MOCK_SERVICES.map((service) => (
              <Card key={service.id} padding="lg" radius={12} withBorder className="shadow-sm hover:shadow-md transition-shadow bg-white overflow-visible">
                <Flex direction={{ base: 'column', sm: 'row' }} gap={20}>
                  <Box w={{ base: '100%', sm: 220 }} h={160} pos="relative" className="shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {service.popular && (
                      <Badge
                        pos="absolute"
                        top={10}
                        left={10}
                        color="#194E9E"
                        variant="filled"
                        radius="sm"
                        size="sm"
                      >
                        Populer
                      </Badge>
                    )}
                  </Box>

                  <Flex justify="space-between" flex={1} direction={{ base: 'column', lg: 'row' }} gap={20}>
                    <Stack gap={12} flex={1}>
                      <Box>
                        <Text fw={700} size="xl" c="dark.8" mb={4}>{service.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {service.description}
                        </Text>
                      </Box>

                      <Group gap={20}>
                        <Flex align="center" gap={6}>
                          <Icon icon="solar:clock-circle-bold" className="text-[#194E9E]" width={18} />
                          <Text size="xs" fw={500} c="dark.6">{service.duration}</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <Icon icon="solar:gallery-bold" className="text-[#194E9E]" width={18} />
                          <Text size="xs" fw={500} c="dark.6">{service.deliverables}</Text>
                        </Flex>
                      </Group>
                    </Stack>

                    <Flex direction="column" align={{ base: 'flex-start', lg: 'flex-end' }} justify="space-between" gap={12}>
                      <Text fw={800} size="xl" c="black">
                        Rp {service.price.toLocaleString('id-ID')} <Text span size="sm" fw={400} c="dimmed">/ event</Text>
                      </Text>
                      <Flex gap={10} w="full" direction={{ base: 'column', sm: 'row' }}>
                        <Button
                          variant="outline"
                          color="#194E9E"
                          radius="md"
                          onClick={() => toggleSchedule(service.id)}
                          className="px-4 border-[#194E9E]"
                          leftSection={<Icon icon="solar:calendar-bold" />}
                          rightSection={<Icon icon={openSchedules.includes(service.id) ? "tabler:chevron-up" : "tabler:chevron-down"} />}
                        >
                          Jadwal Tersedia
                        </Button>
                        <Button
                          variant="filled"
                          color="#194E9E"
                          radius="md"
                          fullWidth={false}
                          className="w-full lg:w-auto px-8 shadow-sm"
                          onClick={() => router.push(`/talent/${id}/service/${service.id}`)}
                        >
                          Lihat Detail
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>

                {/* Collapsible Schedule Section */}
                {openSchedules.includes(service.id) && (
                  <Box mt={20} pt={20} ml={{ base: 0, sm: 240 }} style={{ borderTop: '1px solid #F1F3F5' }}>
                    <Flex justify="space-between" align="center" mb={16}>
                      <Text fw={700} size="sm" c="dark.8">Jadwal Tersedia untuk {service.title}</Text>
                      <Button 
                        variant="subtle" 
                        size="xs" 
                        color="#194E9E"
                        onClick={() => {
                          const slots = [
                            "00:00 - 01:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", 
                            "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", 
                            "13:00 - 14:00", "14:00 - 15:00", "23:00 - 00:00"
                          ].map(t => ({
                            time: t,
                            available: service.id === 2 || t === "00:00 - 01:00" || t === "23:00 - 00:00"
                          }));

                          const availableSlotKeys = slots.filter(s => s.available).map(s => `${service.id}-${s.time}`);
                          const allSelected = availableSlotKeys.every(k => selectedSlots.includes(k));
                          
                          if (allSelected) {
                            setSelectedSlots(prev => prev.filter(k => !availableSlotKeys.includes(k)));
                          } else {
                            setSelectedSlots(prev => Array.from(new Set([...prev, ...availableSlotKeys])));
                          }
                        }}
                      >
                        {(() => {
                          const availableSlotKeys = (service.id === 2 
                            ? ["00:00 - 01:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "23:00 - 00:00"]
                            : ["00:00 - 01:00", "23:00 - 00:00"]
                          ).map(t => `${service.id}-${t}`);
                          return availableSlotKeys.every(k => selectedSlots.includes(k)) ? "Batalkan Semua" : "Pilih Semua Jadwal";
                        })()}
                      </Button>
                    </Flex>
                    <SimpleGrid cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }} spacing="xs">
                      {[
                        "Full Time", "00:00 - 01:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", 
                        "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", 
                        "13:00 - 14:00", "14:00 - 15:00", "23:00 - 00:00"
                      ].map((time, i) => {
                        const isAvailable = time === "Full Time" || service.id === 2 || time === "00:00 - 01:00" || time === "23:00 - 00:00";
                        const availableTimes = (service.id === 2 
                          ? ["00:00 - 01:00", "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "23:00 - 00:00"]
                          : ["00:00 - 01:00", "23:00 - 00:00"]
                        );
                        const slotPrice = Math.round(service.price / availableTimes.length);
                        const slotKey = `${service.id}-${time}`;
                        const isSelected = selectedSlots.includes(slotKey);

                        return (
                          <Card
                            key={i}
                            padding="xs"
                            radius="md"
                            withBorder={isAvailable || isSelected}
                            bg={isSelected ? "#E7F5FF" : (isAvailable ? "white" : "gray.0")}
                            className={isAvailable ? `cursor-pointer transition-all ${isSelected ? '!border-[#194E9E] border-[2px]' : 'hover:border-[#194E9E] border-gray-200'}` : "opacity-60"}
                            style={{ borderColor: isSelected ? '#194E9E' : undefined }}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedSlots((prev) =>
                                  isSelected ? prev.filter((k) => k !== slotKey) : [...prev, slotKey]
                                );
                              }
                            }}
                          >
                            <Stack gap={2} align="center">
                              <Text size="10px" c={isSelected ? "#194E9E" : "dimmed"} fw={isSelected ? 600 : 500}>60 Menit</Text>
                              <Text size="xs" fw={700} c={isSelected ? "#194E9E" : (isAvailable ? "black" : "gray.6")}>{time}</Text>
                              <Text size="10px" fw={isSelected ? 800 : 600} c={isAvailable ? "#194E9E" : "gray.5"}>
                                {isAvailable ? `Rp ${slotPrice.toLocaleString('id-ID')}` : "Booked"}
                              </Text>
                            </Stack>
                          </Card>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                )}
              </Card>
            ))}
          </Stack>

          {/* Sidebar - Sticky on Desktop */}
          <Stack
            gap={24}
            w={{ base: '100%', md: 340 }}
            className="shrink-0"
            pos={{ base: 'static', md: 'sticky' }}
            top={{ base: 0, md: 166 }}
          >
            {/* Mini Profile Card */}
            <Card radius={12} padding="lg" withBorder className="shadow-sm bg-white">
              <Flex gap={16} align="center" mb={16}>
                <Avatar
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                  size={64}
                  radius="xl"
                />
                <Box>
                  <Flex align="center" gap={4}>
                    <Text fw={700} size="lg">Aldi Ramadhan</Text>
                    <Icon icon="solar:check-circle-bold" className="text-[#194E9E]" width={16} />
                  </Flex>
                  <Text size="sm" c="dimmed">Photographer</Text>
                </Box>
              </Flex>
              <Text size="sm" c="dark.6" lineClamp={3}>
                Photographer profesional dengan pengalaman 5 tahun dalam dokumentasi event besar dan corporate.
              </Text>
            </Card>

            {/* Combined Sidebar Sections in Card + Accordion */}
            <Card radius={12} padding={0} withBorder className="shadow-sm bg-white overflow-hidden">
              <Accordion variant="default" defaultValue="why-me" chevronPosition="right" styles={{ item: { border: 'none' } }}>
                <Accordion.Item value="why-me">
                  <Accordion.Control>
                    <Text fw={700} size="sm">Mengapa Memilih Saya?</Text>
                  </Accordion.Control>
                  <Accordion.Panel pb="md">
                    <List
                      spacing="sm"
                      size="sm"
                      center
                      icon={
                        <ThemeIcon color="#194E9E" size={20} radius="xl">
                          <Icon icon="tabler:check" width={12} height={12} />
                        </ThemeIcon>
                      }
                    >
                      <List.Item>Peralatan Profesional Terbaru</List.Item>
                      <List.Item>Pengiriman File Cepat</List.Item>
                      <List.Item>Revisi Editing Terjamin</List.Item>
                      <List.Item>Berpengalaman di Berbagai Event</List.Item>
                    </List>
                  </Accordion.Panel>
                  <Divider mx="md" color="gray.1" />
                </Accordion.Item>

                <Accordion.Item value="custom-request">
                  <Accordion.Control>
                    <Text fw={700} size="sm">Butuh Layanan Khusus?</Text>
                  </Accordion.Control>
                  <Accordion.Panel pb="md">
                    <Text size="xs" c="dimmed" mb={16}>
                      Punya kebutuhan spesifik yang tidak ada di paket? Diskusikan langsung dengan saya.
                    </Text>
                    <Button
                      variant="outline"
                      color="#194E9E"
                      fullWidth
                      radius="md"
                      size="xs"
                      leftSection={<Icon icon="solar:letter-bold" />}
                    >
                      Kirim Pesan
                    </Button>
                  </Accordion.Panel>
                  <Divider mx="md" color="gray.1" />
                </Accordion.Item>

                <Accordion.Item value="important-info">
                  <Accordion.Control>
                    <Text fw={700} size="sm">Informasi Penting</Text>
                  </Accordion.Control>
                  <Accordion.Panel pb="md">
                    <Stack gap={16}>
                      <Flex gap={12}>
                        <ThemeIcon variant="light" color="gray" radius="md" size="sm">
                          <Icon icon="solar:bus-bold" width={14} />
                        </ThemeIcon>
                        <Box>
                          <Text size="xs" fw={700}>Biaya Transportasi</Text>
                          <Text size="xs" c="dimmed">Belum termasuk biaya perjalanan luar kota.</Text>
                        </Box>
                      </Flex>
                      <Flex gap={12}>
                        <ThemeIcon variant="light" color="gray" radius="md" size="sm">
                          <Icon icon="solar:card-2-bold" width={14} />
                        </ThemeIcon>
                        <Box>
                          <Text size="xs" fw={700}>Sistem Pembayaran</Text>
                          <Text size="xs" c="dimmed">DP 30% untuk booking tanggal event.</Text>
                        </Box>
                      </Flex>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Stack>
        </Flex>
      </Container>

      {/* Sticky Bottom Bar */}
      <Box
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        className="shadow-[0_-4px_10px_rgba(0,0,0,0.04)] z-[100]"
        py={10}
      >
        <Container size={1380}>
          <Flex 
            justify="space-between" 
            align={{ base: 'flex-start', md: 'center' }} 
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 8, md: 15 }}
          >
            {/* Price Info (Visible on all devices) */}
            <Box>
              <Text size="10px" c="dimmed" fw={500} mb={-4}>
                {selectedSlots.length > 0 ? 'Total Harga' : 'Harga Mulai Dari'}
              </Text>
              <Text fw={700} size={selectedSlots.length > 0 ? "lg" : "md"} c="black" style={{ whiteSpace: 'nowrap' }}>
                {selectedSlots.length > 0 
                  ? (() => {
                      const grouped = selectedSlots.reduce((acc, slotKey) => {
                        const parts = slotKey.split('-');
                        const serviceId = parseInt(parts[0]);
                        const isFullTime = parts[1] === "Full Time";
                        
                        const service = MOCK_SERVICES.find(s => s.id === serviceId);
                        const availableCount = service?.id === 2 ? 11 : 2;

                        if (isFullTime) {
                          acc[serviceId] = availableCount;
                        } else if (acc[serviceId] !== availableCount) {
                          acc[serviceId] = (acc[serviceId] || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<number, number>);

                      const total = Object.entries(grouped).reduce((sum, [idStr, count]) => {
                        const serviceId = parseInt(idStr);
                        const service = MOCK_SERVICES.find(s => s.id === serviceId);
                        if (!service) return sum;
                        
                        const availableCount = service.id === 2 ? 11 : 2;
                        // If all slots for this service are selected, use the exact service price
                        if (count === availableCount) {
                          return sum + service.price;
                        }
                        // Otherwise use the pro-rated price
                        return sum + (count * Math.round(service.price / availableCount));
                      }, 0);
                      return `Rp ${total.toLocaleString('id-ID')}`;
                    })()
                  : 'Rp 1.500.000'} 
                <Text span fw={400} c="dimmed" size="xs">
                  {selectedSlots.length > 0 ? '' : ' / event'}
                </Text>
              </Text>
            </Box>

            {/* Actions */}
            <Flex gap={10} w={{ base: '100%', md: 'auto' }} justify="flex-end">
              <Button
                variant="filled"
                color="#194E9E"
                size="md"
                radius="md"
                className="px-6 shadow-sm"
                flex={{ base: 1, md: 'none' }}
                leftSection={<Icon icon="solar:ticket-bold" className="text-lg" />}
                onClick={() => router.push(`/talent/${id}/checkout`)}
              >
                Sewa Talenta
              </Button>

              <ActionIcon
                variant="outline"
                color="gray"
                size="md"
                radius="md"
                style={{ borderColor: '#CED4DA', height: '42px', width: '50px' }}
                onClick={() => { }}
              >
                <Icon icon="solar:cart-large-2-bold" width={24} className="text-[#194E9E]" />
              </ActionIcon>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Add padding at the bottom for the bar */}
      <Box h={80} />
    </div>
  );
};

export default ServiceDetails;
