import { useState, useEffect } from 'react';
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
  Tabs,
  SimpleGrid,
  Timeline,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Box,
  Divider,
  Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

// Mock data based on requested design
const MOCK_TALENT = {
  id: 1,
  name: "Aldi Ramadhan",
  role: "Photographer",
  rating: 4.9,
  ratingCount: 128,
  location: "Jakarta, Indonesia",
  joinDate: "29 Jul 2024",
  responseTime: "≤ 1 jam",
  languages: "Indonesia, English",
  description: "Saya adalah seorang photographer profesional dengan pengalaman lebih dari 5 tahun dalam mengabadikan momen spesial di berbagai event, konser, dan kegiatan corporate. Fokus saya adalah menangkap momen yang berkesan dengan hasil foto berkualitas tinggi.",
  price: "Rp 1.500.000 / event",
  skills: ["event photography", "concert photography", "editing", "lightroom", "photoshop", "capture one"],
  portfolio: [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
    "https://images.unsplash.com/photo-1514525253348-8d9807cc96a1?w=400",
    "https://images.unsplash.com/photo-1459749411177-042180ceea72?w=400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
  ],
  experience: [
    {
      period: "2023 - Present",
      role: "Photographer",
      company: "Pamungkas Concert",
      desc: "Fotografer resmi untuk tur konser Pamungkas di berbagai kota di Indonesia."
    },
    {
      period: "2021 - 2023",
      role: "Event Photographer",
      company: "We The Fest",
      desc: "Mengabadikan momen berbagai pertunjukan musik dan aktivitas festival."
    },
    {
      period: "2019 - 2021",
      role: "Freelance Photographer",
      company: "Berbagai Event",
      desc: "Menangani berbagai event seperti wedding, corporate gathering, dan konser."
    }
  ]
};

const TalentDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<string | null>('profil');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleImageClick = (img: string) => {
    setSelectedImg(img);
    open();
  };

  // Breadcrumbs items
  const breadcrumbItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Talenta', href: '/talent' },
    { title: 'Aldi Ramadhan', href: '#' },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      size="xs"
      fw={500}
      c={index === 2 ? 'dimmed' : '#194E9E'}
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

      <Container size={1380} py={40}>
        <Breadcrumbs
          separator={<Icon icon="tabler:chevron-right" width={14} />}
          mb={24}
          visibleFrom="md"
        >
          {breadcrumbItems}
        </Breadcrumbs>

        <Stack gap={24}>
          {/* Profile Header Card */}
          <Card radius={12} p={0} withBorder className="shadow-sm overflow-hidden bg-white">
            <Box h={{ base: 140, md: 240 }} pos="relative">
              <Image
                src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200"
                alt="Banner"
                fill
                className="object-cover brightness-75 md:brightness-50"
              />
            </Box>

            <Box px={{ base: 20, md: 40 }} pb={{ base: 20, md: 30 }} pos="relative">
              {/* Overlapping Content Container */}
              <Flex
                gap={{ base: 12, md: 25 }}
                align="flex-start"
                mt={{ base: -30, md: -45 }}
                direction={{ base: 'column', md: 'row' }}
              >
                {/* Avatar with Thick Border */}
                <Avatar
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
                  w={{ base: 80, md: 150 }}
                  h={{ base: 80, md: 150 }}
                  radius={150}
                  className="border-[4px] md:border-[6px] border-white shadow-xl z-30 bg-white shrink-0"
                />

                <Stack gap={0} flex={1} mt={{ base: 5, md: 20 }} pos="relative" className="w-full">
                  {/* Talent Name - Sitting on Banner (Desktop) or Below (Mobile) */}
                  <Box
                    pos="absolute"
                    top={{ base: -5, md: -38 }}
                    left={0}
                    className="z-20"
                  >
                    <Flex align="center" gap={6}>
                      <Text
                        fw={800}
                        fz={{ base: 16, md: 36 }}
                        c={{ base: 'black', md: 'white' }}
                        className="drop-shadow-none md:drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                      >
                        {MOCK_TALENT.name}
                      </Text>
                      <Box pos="relative" w={{ base: 16, md: 26 }} h={{ base: 16, md: 26 }} className="flex items-center justify-center">
                        <Icon icon="solar:verified-check-bold" className="text-[#194E9E] text-base md:text-3xl" />
                        <Icon icon="tabler:check" className="text-white text-[8px] md:text-[14px] absolute font-bold" />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Professional Info Stack - On the White Background */}
                  {/* Professional Info Stack - On the White Background */}
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', md: 'flex-end' }}
                    gap={15}
                    className="w-full pt-[30px] md:pt-[45px]"
                  >
                    <Stack gap={4} flex={1} className="md:gap-2">
                      {/* Main Info Row */}
                      <Flex
                        direction={{ base: 'column', md: 'row' }}
                        align={{ base: 'flex-start', md: 'center' }}
                        gap={4}
                        className="md:gap-5"
                      >
                        <Flex align="center" gap={6}>
                          <Icon icon="solar:camera-bold" className="text-gray-400" width={14} />
                          <Text fz={{ base: 11, md: 15 }} c="black">Photographer</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <Icon icon="solar:star-bold" className="text-yellow-400" width={14} />
                          <Text fz={{ base: 11, md: 15 }} c="black">4.9</Text>
                          <Text fz={{ base: 11, md: 14 }} c="black">(128 ulasan)</Text>
                        </Flex>
                        <Flex align="center" gap={6}>
                          <Icon icon="material-symbols:location-on-rounded" className="text-gray-400" width={14} />
                          <Text fz={{ base: 11, md: 15 }} c="black">Jakarta, Indonesia</Text>
                        </Flex>
                      </Flex>

                      {/* Bio Text */}
                      <Text fz={{ base: 11, md: 15 }} c="black">
                        Spesialis event, konser, dan corporate gathering.
                      </Text>
                    </Stack>

                    {/* Action Buttons Container - Right on Desktop, Left on Mobile */}
                    <Flex gap={12} w={{ base: '100%', md: 'auto' }} justify={{ base: 'flex-start', md: 'flex-end' }} className="md:mb-1">
                      <Button
                        variant="filled"
                        color="#194E9E"
                        radius="md"
                        h={36}
                        px={20}
                        fz={12}
                        className="font-bold shadow-sm hover:bg-[#002D72] transition-colors"
                        leftSection={<Icon icon="solar:letter-bold" width={16} />}
                      >
                        Kirim Pesan
                      </Button>
                      <ActionIcon
                        variant="outline"
                        color="gray"
                        size={36}
                        radius="md"
                        className="border-gray-200 bg-white hover:bg-gray-50"
                      >
                        <Icon icon="solar:bookmark-linear" className="text-[#194E9E] text-xl" />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                </Stack>
              </Flex>
            </Box>
          </Card>

          {/* Main Content & Sidebar */}
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={24}>
            {/* Left Column - Main Content */}
            <Box className="md:col-span-2">
              <Card radius={12} p={24} withBorder className="shadow-sm bg-white overflow-hidden">
                <Stack gap={30}>
                  {/* Tentang Saya */}
                  <Stack gap={12}>
                    <Text fw={700} size="md">Tentang Saya</Text>
                    <Text size="sm" c="black" lh={1.6}>
                      {MOCK_TALENT.description}
                    </Text>
                  </Stack>

                  <Divider color="gray.1" />

                  {/* Portfolio Summary */}
                  <Stack gap={15}>
                    <Flex justify="space-between" align="center">
                      <Text fw={700} size="md">Portofolio</Text>
                      <Anchor href={`/talent/${id}/portfolio`} size="xs" fw={600} c="#194E9E">Lihat Semua</Anchor>
                    </Flex>
                    <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing={10}>
                      {MOCK_TALENT.portfolio.map((img, i) => (
                        <Box
                          key={i}
                          pos="relative"
                          h={100}
                          className="rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => handleImageClick(img)}
                        >
                          <Image src={img} alt={`Portfolio ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                          {i === 4 && (
                            <Box pos="absolute" inset={0} className="bg-black/60 flex items-center justify-center pointer-events-none">
                              <Text c="white" fw={700}>+12</Text>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>

                  <Divider color="gray.1" />

                  {/* Pengalaman Kerja */}
                  <Stack gap={15}>
                    <Text fw={700} size="md">Pengalaman Kerja</Text>
                    <Timeline active={0} bulletSize={12} lineWidth={2} color="#194E9E">
                      {MOCK_TALENT.experience.map((exp, i) => (
                        <Timeline.Item key={i}>
                          <Flex gap={20} direction={{ base: 'column', sm: 'row' }}>
                            <Text size="xs" c="black" w={100} className="shrink-0">{exp.period}</Text>
                            <Stack gap={4}>
                              <Text fw={700} size="sm">{exp.role}</Text>
                              <Text size="xs" c="black">{exp.company}</Text>
                              <Text size="xs" c="black">{exp.desc}</Text>
                            </Stack>
                          </Flex>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Stack>
                </Stack>
              </Card>
            </Box>

            {/* Right Column - Sidebar */}
            <Stack gap={24}>
              {/* Informasi Talent */}
              <Card radius={12} p={20} withBorder className="shadow-sm bg-white">
                <Stack gap={15}>
                  <Text fw={700} size="sm">Informasi Talent</Text>
                  <Stack gap={12}>
                    {[
                      { icon: 'material-symbols:location-on-rounded', label: 'Lokasi', val: MOCK_TALENT.location },
                      { icon: 'solar:calendar-bold', label: 'Bergabung', val: MOCK_TALENT.joinDate },
                      { icon: 'solar:chat-round-bold', label: 'Balas Pesan', val: MOCK_TALENT.responseTime },
                      { icon: 'solar:global-bold', label: 'Bahasa', val: MOCK_TALENT.languages },
                    ].map((item, i) => (
                      <Flex key={i} justify="space-between" align="center">
                        <Flex align="center" gap={8}>
                          <Icon icon={item.icon} className="text-gray-400" />
                          <Text size="xs" c="black">{item.label}</Text>
                        </Flex>
                        <Text size="xs" fw={600} c="dark.8">{item.val}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              {/* Layanan & Harga */}
              <Card radius={12} p={20} withBorder className="shadow-sm bg-white">
                <Stack gap={15}>
                  <Text fw={700} size="sm">Layanan & Harga</Text>
                  <Flex gap={12} align="center">
                    <Box p={8} className="bg-[#F8F9FA] rounded-lg">
                      <Icon icon="solar:camera-bold" className="text-[#194E9E] text-xl" />
                    </Box>
                    <Stack gap={2}>
                      <Text fw={700} size="xs">Event Photography</Text>
                      <Text size="10px" c="black">Mulai dari</Text>
                      <Text fw={700} size="sm" c="black">Rp 1.500.000 <Text span fw={400} c="black">/ event</Text></Text>
                    </Stack>
                  </Flex>
                  <Button
                    variant="outline"
                    color="#194E9E"
                    radius="md"
                    size="xs"
                    fullWidth
                    className="border-[#194E9E]"
                    onClick={() => router.push(`/talent/${id}/services`)}
                  >
                    Lihat Paket Layanan
                  </Button>
                </Stack>
              </Card>

              {/* Skills */}
              <Card radius={12} p={20} withBorder className="shadow-sm bg-white">
                <Stack gap={15}>
                  <Text fw={700} size="sm">Skills</Text>
                  <Flex gap={8} wrap="wrap">
                    {MOCK_TALENT.skills.map((skill, i) => (
                      <Badge key={i} variant="filled" color="gray.1" c="dark.8" radius="sm" size="sm" tt="lowercase" px={8}>
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                </Stack>
              </Card>

              {/* Bagikan Profil */}
              <Card radius={12} p={20} withBorder className="shadow-sm bg-white">
                <Stack gap={15}>
                  <Text fw={700} size="sm">Bagikan Profil</Text>
                  <Group gap={10}>
                    {[
                      'solar:link-bold',
                      'ri:whatsapp-fill',
                      'ri:instagram-fill',
                      'ri:facebook-fill',
                      'ri:twitter-x-fill'
                    ].map((icon, i) => (
                      <ActionIcon key={i} variant="filled" color="gray.1" radius="xl" size="lg" c="gray.6">
                        <Icon icon={icon} className="text-lg" />
                      </ActionIcon>
                    ))}
                  </Group>
                </Stack>
              </Card>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Sticky Bottom Bar */}
      <Box
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        className="shadow-[0_-4px_10px_rgba(0,0,0,0.04)] z-[100]"
        py={{ base: 12, md: 10 }}
      >
        <Container size={1380}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            gap={{ base: 12, md: 10 }}
          >
            {/* Price Info */}
            <Box>
              <Text size="10px" c="black" fw={500} mb={-2}>Harga Mulai Dari</Text>
              <Text fw={700} fz={{ base: 'sm', md: 'md' }} c="black">
                Rp 1.500.000 <Text span fw={400} c="black" size="xs">/ event</Text>
              </Text>
            </Box>

            {/* Actions */}
            <Flex gap={8} align="center" w={{ base: '100%', md: 'auto' }}>
              <ActionIcon
                variant="outline"
                color="gray"
                size="md"
                radius="md"
                style={{ borderColor: '#CED4DA', height: '40px', width: '46px' }}
                onClick={() => { }}
              >
                <Icon icon="solar:cart-large-2-bold" width={22} className="text-[#194E9E]" />
              </ActionIcon>

              <Button
                variant="filled"
                color="#194E9E"
                size="md"
                radius="md"
                className="shadow-sm"
                h={40}
                flex={1}
                leftSection={<Icon icon="solar:ticket-bold" className="text-lg" />}
              >
                Sewa Talenta
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Image Detail Modal */}
      <Modal
        opened={opened}
        onClose={close}
        size="95%"
        centered
        padding={0}
        withCloseButton={false}
        radius="md"
        lockScroll={true}
        overlayProps={{
          backgroundOpacity: 0.9,
          blur: 15,
        }}
        styles={{
          content: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            border: 'none',
            overflow: 'hidden',
          },
          body: {
            padding: 0,
            overflow: 'hidden',
          }
        }}
      >
        {selectedImg && (
          <Box pos="relative" className="flex items-center justify-center w-full h-full overflow-hidden">
            <Box className="w-full max-w-[1200px] aspect-video pos-relative">
              <Image
                src={selectedImg}
                alt="Detail"
                fill
                className="object-contain rounded-lg shadow-2xl"
              />
            </Box>
            <ActionIcon
              pos="fixed"
              top={20}
              right={20}
              variant="transparent"
              color="white"
              onClick={close}
              className="z-[120] hover:scale-110 transition-transform"
            >
              <Icon icon="tabler:x" className="text-white text-4xl" />
            </ActionIcon>
          </Box>
        )}
      </Modal>

      {/* Add padding at the bottom of the page so content isn't hidden by the bar */}
      <Box h={80} />
    </div>
  );
};

export default TalentDetail;