import React from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Text,
  Flex,
  Stack,
  Breadcrumbs,
  Anchor,
  Button,
  Card,
  SimpleGrid,
  Image,
  Badge,
  Select,
  Avatar,
  Divider,
  ActionIcon,
  Pagination,
  Accordion,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Icon } from '@iconify/react';

const MOCK_TALENT = {
  name: 'Aldi Ramadhan',
  role: 'Photographer',
  rating: '4.9',
  ratingCount: '128',
  location: 'Jakarta, Indonesia',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  description: 'Photographer profesional dengan pengalaman lebih dari 5 tahun dalam dokumentasi event besar dan corporate.',
};

const MOCK_PORTFOLIO = [
  { 
    title: 'Konser Musik - Jakarta', 
    date: '12 Mei 2024', 
    category: 'Konser',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    description: 'Dokumentasi lengkap konser musik skala besar di Jakarta. Fokus pada penangkapan energi penonton dan aksi panggung artis. Menggunakan teknik pencahayaan dramatis untuk menonjolkan atmosfer konser yang megah. Hasil foto digunakan untuk keperluan promosi media sosial dan press release artis.'
  },
  { 
    title: 'Festival Musik - Bandung', 
    date: '4 Mei 2024', 
    category: 'Konser',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    description: 'Liputan festival musik outdoor di Bandung yang dihadiri ribuan pengunjung. Menangkap berbagai momen mulai dari persiapan backstage hingga kemeriahan main stage saat malam hari. Tantangan utama adalah cuaca yang berubah-ubah, namun berhasil diatasi dengan perlengkapan weatherproof.'
  },
  { 
    title: 'Corporate Gathering - Surabaya', 
    date: '28 Apr 2024', 
    category: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1514525253348-8d9807cc96a1?w=800',
    description: 'Acara gathering tahunan sebuah perusahaan multinasional di Surabaya. Dokumentasi mencakup pidato direksi, sesi team building, dan gala dinner. Fokus pada potret profesional karyawan dan suasana keakraban tim.'
  },
  { 
    title: 'Wedding Reception - Bali', 
    date: '20 Apr 2024', 
    category: 'Wedding',
    image: 'https://images.unsplash.com/photo-1459749411177-042180ceea72?w=800',
    description: 'Resepsi pernikahan eksklusif dengan tema garden party di Bali. Menangkap momen emosional pasangan dan keindahan dekorasi. Menggunakan teknik natural light untuk memberikan kesan romantis dan elegan pada setiap jepretan.'
  },
  { 
    title: 'Seminar Tech - Jakarta', 
    date: '15 Apr 2024', 
    category: 'Seminar',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    description: 'Seminar teknologi yang membahas tren AI masa depan. Dokumentasi difokuskan pada interaksi pembicara dengan audiens serta presentasi visual yang ditampilkan. Foto-foto ini digunakan untuk laporan tahunan dan konten website perusahaan.'
  },
  { 
    title: 'Konser Musik - Yogyakarta', 
    date: '10 Apr 2024', 
    category: 'Konser',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    description: 'Konser band lokal ternama di Yogyakarta. Menangkap suasana panggung yang intim namun penuh semangat. Fokus pada detail ekspresi musisi dan interaksi dengan penggemar di baris terdepan.'
  },
];

const PortfolioPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const breadcrumbItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Talenta', href: '/talent' },
    { title: 'Aldi Ramadhan', href: `/talent/${id}` },
    { title: 'Portofolio', href: '#' },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      size="sm"
      fw={500}
      c={index === 3 ? 'dimmed' : '#194E9E'}
      className="hover:underline"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Modal for detail view (Blog Style) - Responsive Size via Styles */}
      <Modal 
        opened={opened} 
        onClose={close} 
        size="800px"
        centered 
        radius="xl" 
        padding={0}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.6,
          blur: 8,
        }}
        styles={{
          content: { overflow: 'hidden', maxWidth: '95vw' }
        }}
      >
        {selectedItem && (
          <Box className="bg-white">
            {/* Hero Image */}
            <Box pos="relative" className="h-[200px] md:h-[400px]">
              <Image 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                h="100%" 
                className="object-cover" 
              />
              <ActionIcon 
                pos="absolute" 
                right={15} 
                top={15} 
                variant="filled"
                color="white"
                className="z-50 shadow-md hover:scale-110 transition-transform" 
                onClick={close}
                radius="xl"
                size="lg"
              >
                <Icon icon="tabler:x" color="#000" width={18} />
              </ActionIcon>
              <Box 
                pos="absolute" 
                bottom={15} 
                left={15} 
                className="z-10"
              >
                <Badge color="#194E9E" variant="filled" size="lg" radius="sm">
                  {selectedItem.category}
                </Badge>
              </Box>
            </Box>

            {/* Content Section */}
            <Stack p={0} gap={0} className="p-5 md:p-10">
              <Box className="mb-4">
                <Text fw={700} c="dimmed" mb={4} tt="uppercase" lts={1} className="text-[10px]">
                  {selectedItem.date}
                </Text>
                <Text fw={800} c="black" lh={1.2} className="text-[20px] md:text-[32px]">
                  {selectedItem.title}
                </Text>
              </Box>

              <Divider className="mb-4" />

              <Stack gap={10} className="mb-5">
                <Text fw={700} fz={15}>Deskripsi Kegiatan</Text>
                <Text c="dark.3" lh={1.8} className="text-[13px] md:text-[15px]">
                  {selectedItem.description}
                </Text>
              </Stack>

              <Flex gap={8} mt={5} wrap="wrap">
                <Badge variant="outline" color="gray" radius="sm" size="xs">#Photography</Badge>
                <Badge variant="outline" color="gray" radius="sm" size="xs">#EventDocumentation</Badge>
                <Badge variant="outline" color="gray" radius="sm" size="xs">#Professional</Badge>
              </Flex>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Header - Truly Responsive */}
      <Box bg="#002D72" className="flex items-center h-[60px] md:h-[70px]">
        <Container size={1380} className="w-full">
          <Flex justify="space-between" align="center">
            <Flex align="center" className="gap-[15px] md:gap-[40px]">
               <Text c="white" fw={800} className="text-[20px] md:text-[24px]">kolektix</Text>
               <Flex gap={25} className="hidden lg:flex">
                 {['Event', 'Merchandise', 'Talenta', 'Venue', 'Tracking'].map(item => (
                   <Text key={item} c="white" fz={14} fw={500} className="cursor-pointer opacity-80 hover:opacity-100">{item}</Text>
                 ))}
               </Flex>
            </Flex>
            <Flex align="center" className="gap-[10px] md:gap-[20px]">
               <ActionIcon variant="transparent" c="white" className="hidden sm:flex"><Icon icon="solar:magnifer-linear" width={22} /></ActionIcon>
               <Button variant="filled" color="white" c="#002D72" radius="xl" size="xs" leftSection={<Icon icon="tabler:plus" />} className="hidden xs:flex">Buat Event</Button>
               <Box className="hidden sm:block w-6 h-4 bg-red-600 rounded-sm overflow-hidden border border-white/20">
                 <Box h="50%" bg="white" mt="50%" />
               </Box>
               <Avatar size={32} radius="xl" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" className="border-2 border-white/20" />
               <ActionIcon variant="transparent" c="white" className="lg:hidden"><Icon icon="solar:hamburger-menu-linear" width={24} /></ActionIcon>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size={1380} px={16} className="py-5 md:py-10">
        <Breadcrumbs
          separator={<Icon icon="tabler:chevron-right" width={12} />}
          visibleFrom="sm"
          className="mb-[15px] md:mb-[24px]"
        >
          {breadcrumbItems}
        </Breadcrumbs>

        <SimpleGrid cols={{ base: 1, lg: 3 }} className="gap-[24px] md:gap-[32px]">
          {/* Main Content */}
          <Box className="lg:col-span-2">
            <Stack className="gap-[20px] md:gap-[30px]">
              <Box>
                <Text fw={800} c="black" mb={4} className="text-[24px] md:text-[32px]">Portofolio</Text>
                <Text c="dimmed" className="text-[13px] md:text-[15px]">Kumpulan hasil dokumentasi event oleh Aldi Ramadhan</Text>
              </Box>

              <Flex 
                justify="space-between" 
                align={{ base: 'flex-start', md: 'center' }} 
                direction={{ base: 'column', md: 'row' }} 
                gap={15}
              >
                {/* Scrollable Filters on Mobile */}
                <Box className="w-full overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <Flex gap={10} wrap="nowrap" pb={{ base: 5, md: 0 }}>
                    {[
                      { label: 'Semua', count: 56 },
                      { label: 'Konser', count: 24 },
                      { label: 'Corporate Event', count: 18 },
                      { label: 'Wedding', count: 8 },
                      { label: 'Seminar', count: 6 },
                    ].map((filter, i) => (
                      <Button
                        key={filter.label}
                        variant={i === 0 ? 'outline' : 'default'}
                        color={i === 0 ? '#194E9E' : 'gray'}
                        radius="xl"
                        size="xs"
                        className={i === 0 ? 'border-[#194E9E] bg-blue-50/50' : 'border-gray-200'}
                        fw={600}
                        style={{ flexShrink: 0 }}
                      >
                        {filter.label} ({filter.count})
                      </Button>
                    ))}
                  </Flex>
                </Box>
                {/* <Select
                  placeholder="Terbaru"
                  data={['Terbaru', 'Terlama', 'Populer']}
                  defaultValue="Terbaru"
                  radius="md"
                  size="sm"
                  w={140}
                  rightSection={<Icon icon="tabler:chevron-down" width={14} />}
                /> */}
              </Flex>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={20} verticalSpacing={25}>
                {MOCK_PORTFOLIO.map((item, i) => (
                  <Card 
                    key={i} 
                    radius="lg" 
                    p={12} 
                    withBorder 
                    className="group cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-white"
                    onClick={() => {
                      setSelectedItem(item);
                      open();
                    }}
                  >
                    <Card.Section>
                      <Box h={160} pos="relative" className="overflow-hidden mb-8">
                        <Image
                          src={item.image}
                          alt={item.title}
                          h="100%"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Box>
                    </Card.Section>
                    <Stack gap={2}>
                      <Text fw={700} fz={14} c="black" className="group-hover:text-[#194E9E] transition-colors line-clamp-1">{item.title}</Text>
                      <Text fz={12} c="dimmed">{item.date}</Text>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>

            </Stack>
          </Box>

          {/* Sidebar */}
          <Stack gap={24}>
            {/* Profile Card */}
            <Card radius={12} p={24} withBorder className="shadow-sm bg-white">
              <Stack gap={15}>
                <Text fw={700} size="sm">Tentang Aldi Ramadhan</Text>
                <Flex gap={15} align="center">
                  <Avatar size={60} radius="xl" src={MOCK_TALENT.avatar} className="border-2 border-gray-100" />
                  <Stack gap={0}>
                    <Flex align="center" gap={6}>
                      <Text fw={700} size="md" c="black">{MOCK_TALENT.name}</Text>
                      <Icon icon="solar:verified-check-bold" className="text-[#194E9E] text-lg" />
                    </Flex>
                    <Text size="xs" fw={600} c="dimmed">{MOCK_TALENT.role}</Text>
                    <Flex align="center" gap={4} mt={2}>
                      <Icon icon="solar:star-bold" className="text-yellow-400" width={14} />
                      <Text size="xs" fw={700} c="black">{MOCK_TALENT.rating}</Text>
                      <Text size="xs" c="dimmed">({MOCK_TALENT.ratingCount} ulasan)</Text>
                    </Flex>
                    <Flex align="center" gap={4}>
                      <Icon icon="material-symbols:location-on-rounded" className="text-gray-400" width={14} />
                      <Text size="xs" c="dimmed">{MOCK_TALENT.location}</Text>
                    </Flex>
                  </Stack>
                </Flex>
                <Text size="xs" c="black" lh={1.6}>
                  {MOCK_TALENT.description}
                </Text>
                <Button
                  variant="outline"
                  color="#194E9E"
                  fullWidth
                  radius="md"
                  size="sm"
                  className="border-[#194E9E] font-bold"
                  onClick={() => router.push(`/talent/${id}`)}
                >
                  Lihat Profil Talent
                </Button>
              </Stack>
            </Card>

            {/* Unified Info Accordion Card */}
            <Card radius={12} p={0} withBorder className="shadow-sm bg-white overflow-hidden">
              <Accordion 
                defaultValue="layanan" 
                variant="separated"
                styles={{
                  item: { border: 'none', borderBottom: '1px solid #f1f3f5', borderRadius: 0 },
                  control: { padding: '16px 24px' },
                  label: { fontWeight: 700, fontSize: '14px' },
                  content: { padding: '0 24px 24px 24px' }
                }}
              >
                {/* Layanan & Harga */}
                <Accordion.Item value="layanan">
                  <Accordion.Control>Layanan & Harga</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={15}>
                      <Flex gap={12} align="center">
                        <Box p={10} className="bg-[#F8F9FA] rounded-lg">
                          <Icon icon="solar:camera-bold" className="text-[#194E9E] text-2xl" />
                        </Box>
                        <Stack gap={2}>
                          <Text fw={700} size="sm">Event Photography</Text>
                          <Text size="xs" c="dimmed">Mulai dari</Text>
                          <Text fw={800} size="md" c="black">Rp 1.500.000 <Text span fw={400} c="dimmed" size="xs">/ event</Text></Text>
                        </Stack>
                      </Flex>
                      <Button 
                        variant="outline" 
                        color="#194E9E" 
                        fullWidth 
                        radius="md" 
                        size="sm"
                        className="border-[#194E9E] font-bold"
                      >
                        Lihat Paket Layanan
                      </Button>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                {/* Butuh Layanan Khusus? */}
                <Accordion.Item value="khusus">
                  <Accordion.Control>Butuh Layanan Khusus?</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={15}>
                      <Text size="xs" c="black" lh={1.6}>
                        Punya kebutuhan khusus? Diskusikan langsung dengan Aldi untuk penawaran terbaik.
                      </Text>
                      <Button 
                        variant="outline" 
                        color="#194E9E" 
                        fullWidth 
                        radius="md" 
                        size="sm"
                        className="border-[#194E9E] font-bold"
                      >
                        Kirim Pesan
                      </Button>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                {/* Informasi Penting */}
                <Accordion.Item value="penting" style={{ borderBottom: 'none' }}>
                  <Accordion.Control>Informasi Penting</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={15}>
                      <Flex gap={12}>
                        <Icon icon="solar:bus-bold" className="text-[#194E9E] text-xl shrink-0" />
                        <Stack gap={2}>
                          <Text fw={700} size="xs">Biaya Transportasi</Text>
                          <Text size="xs" c="dimmed">Belum termasuk biaya perjalanan luar kota.</Text>
                        </Stack>
                      </Flex>
                      <Flex gap={12}>
                        <Icon icon="solar:card-2-bold" className="text-[#194E9E] text-xl shrink-0" />
                        <Stack gap={2}>
                          <Text fw={700} size="xs">Sistem Pembayaran</Text>
                          <Text size="xs" c="dimmed">DP 30% untuk booking jadwal.</Text>
                        </Stack>
                      </Flex>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Stack>
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default PortfolioPage;
