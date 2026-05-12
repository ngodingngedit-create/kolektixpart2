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
  ThemeIcon,
  Accordion,
  Grid,
} from '@mantine/core';
import { Icon } from '@iconify/react/dist/iconify.js';

const ServiceDetail = () => {
  const router = useRouter();
  const { id, serviceId } = router.query;

  const breadcrumbItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Talenta', href: '/talent' },
    { title: 'Aldi Ramadhan', href: `/talent/${id}` },
    { title: 'Layanan', href: `/talent/${id}/services` },
    { title: 'Event Photography - Basic', href: '#' },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      size="xs"
      fw={500}
      c={index === 4 ? 'dimmed' : '#194E9E'}
      className="hover:underline"
    >
      {item.title}
    </Anchor>
  ));

  const galleryImages = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
  ];

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
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
          mb={32}
          visibleFrom="md"
        >
          {breadcrumbItems}
        </Breadcrumbs>

        <Grid gutter={20} align="stretch">
          {/* Main Content Column */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap={20}>
              {/* Top Section: Service Overview Card (Now inside column) */}
              <Card radius={12} padding="lg" withBorder className="shadow-sm bg-white overflow-hidden">
                <Flex direction={{ base: 'column', lg: 'row' }} gap={24}>
                  <Box w={{ base: '100%', lg: 280 }} h={200} pos="relative" className="shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
                      alt="Event Photography"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Badge
                      pos="absolute"
                      top={12}
                      left={12}
                      color="#194E9E"
                      variant="filled"
                      radius="sm"
                      size="sm"
                      px={8}
                    >
                      POPULER
                    </Badge>
                  </Box>

                  <Stack justify="center" flex={1} gap={16}>
                    <Box>
                      <Flex justify="space-between" align="flex-start">
                        <Text fw={800} size="1rem" c="dark.9" lh={1.2} className="md:text-[1.5rem]">Event Photography - Basic</Text>
                        <Badge variant="light" color="blue" radius="sm" size="xs">Photography</Badge>
                      </Flex>
                      <Text size="sm" c="dimmed" mt={8} lineClamp={2}>
                        Dokumentasi acara kecil seperti gathering, ulang tahun, seminar, atau acara komunitas lainnya dengan hasil berkualitas tinggi.
                      </Text>
                    </Box>

                    <Group gap={20}>
                      <Flex align="center" gap={8}>
                        <ThemeIcon variant="light" color="gray" size={24} radius="md">
                          <Icon icon="solar:clock-circle-bold" width={16} className="text-[#194E9E]" />
                        </ThemeIcon>
                        <Box>
                          <Text size="10px" c="dimmed" fw={500}>Durasi</Text>
                          <Text size="xs" fw={700}>2 Jam</Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <ThemeIcon variant="light" color="gray" size={24} radius="md">
                          <Icon icon="solar:gallery-bold" width={16} className="text-[#194E9E]" />
                        </ThemeIcon>
                        <Box>
                          <Text size="10px" c="dimmed" fw={500}>Foto Edit</Text>
                          <Text size="xs" fw={700}>30+ Foto</Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <ThemeIcon variant="light" color="gray" size={24} radius="md">
                          <Icon icon="solar:users-group-rounded-bold" width={16} className="text-[#194E9E]" />
                        </ThemeIcon>
                        <Box>
                          <Text size="10px" c="dimmed" fw={500}>Cocok untuk</Text>
                          <Text size="xs" fw={700}>Acara Kecil</Text>
                        </Box>
                      </Flex>
                    </Group>
                  </Stack>
                </Flex>
              </Card>

              {/* Consolidated Content in Accordion Card */}
              <Card radius={12} padding={0} withBorder className="shadow-sm bg-white overflow-hidden">
                <Accordion variant="default" defaultValue="description" styles={{ item: { border: 'none' } }}>
                  {/* Service Description & What You Get */}
                  <Accordion.Item value="description">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Deskripsi Layanan & Apa yang Didapat</Text>
                    </Accordion.Control>
                    <Accordion.Panel pb="xl" px="xl">
                      <Flex direction={{ base: 'column', lg: 'row' }} gap={40}>
                        <Box flex={1}>
                          <Text size="sm" c="dark.6" lh={1.6} mb={20}>
                            Layanan fotografi untuk acara dengan durasi maksimal 2 jam. Cocok untuk kebutuhan dokumentasi singkat dengan hasil foto yang jernih dan natural.
                          </Text>
                          <List
                            spacing="sm"
                            size="sm"
                            center
                            icon={
                              <Icon icon="tabler:check" className="text-[#194E9E]" width={16} />
                            }
                          >
                            <List.Item>Pemotretan selama acara berlangsung (maks. 2 jam)</List.Item>
                            <List.Item>Hasil foto diedit profesional</List.Item>
                            <List.Item>Pengiriman digital via Google Drive</List.Item>
                            <List.Item>Revisi color grading (jika diperlukan)</List.Item>
                          </List>
                        </Box>
                        <Box w={{ base: '100%', lg: 280 }}>
                          <Text fw={700} size="sm" mb={20}>Yang Anda Dapatkan</Text>
                          <Stack gap={16}>
                            {[
                              { icon: "solar:camera-bold", text: "2 Jam Pemotretan" },
                              { icon: "solar:gallery-bold", text: "30+ Foto Edit" },
                              { icon: "solar:file-download-bold", text: "Soft File (High Resolution)" },
                              { icon: "solar:cloud-download-bold", text: "Pengiriman via Google Drive" },
                              { icon: "solar:chat-round-dots-bold", text: "Konsultasi Sebelum Event" },
                            ].map((item, i) => (
                              <Flex key={i} align="center" gap={12}>
                                <Icon icon={item.icon} className="text-[#194E9E]" width={18} />
                                <Text size="xs" fw={500} c="dark.7">{item.text}</Text>
                              </Flex>
                            ))}
                          </Stack>
                        </Box>
                      </Flex>
                    </Accordion.Panel>
                    <Divider mx="xl" color="gray.1" />
                  </Accordion.Item>

                  {/* Photo Gallery */}
                  <Accordion.Item value="gallery">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Galeri Foto Portfolio</Text>
                    </Accordion.Control>
                    <Accordion.Panel pb="xl" px="xl">
                      <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm">
                        {galleryImages.map((src, i) => (
                          <Box key={i} h={100} pos="relative" className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <Image src={src} alt={`Gallery ${i}`} fill className="object-cover" />
                            {i === 4 && (
                              <Box pos="absolute" inset={0} bg="rgba(0,0,0,0.5)" className="flex items-center justify-center">
                                <Text c="white" fw={700} size="lg">+25</Text>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Accordion.Panel>
                    <Divider mx="xl" color="gray.1" />
                  </Accordion.Item>

                  {/* Suitable For */}
                  <Accordion.Item value="suitable">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Cocok Untuk Berbagai Acara</Text>
                    </Accordion.Control>
                    <Accordion.Panel pb="xl" px="xl">
                      <Group gap="xs">
                        {['Gathering', 'Ulang Tahun', 'Seminar', 'Workshop', 'Acara Komunitas'].map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            color="gray"
                            radius="xl"
                            px={16}
                            py={12}
                            style={{ textTransform: 'none', borderColor: '#E9ECEF' }}
                            leftSection={<Icon icon="solar:users-group-rounded-bold" width={14} />}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Card>

              {/* FAQ Section */}
              <Card radius={12} padding="xl" withBorder className="bg-white">
                <Text fw={700} size="lg" mb={20}>FAQ</Text>
                <Accordion variant="separated" radius="md">
                  <Accordion.Item value="q1">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Berapa lama sebelum hari H harus melakukan pemesanan?</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text size="xs" c="dimmed">
                        Disarankan minimal 3 hari sebelum acara untuk memastikan ketersediaan jadwal.
                      </Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="q2">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Apakah bisa request style foto tertentu?</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text size="xs" c="dimmed">
                        Tentu bisa! Anda bisa memberikan referensi atau moodboard sebelum acara.
                      </Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar Column - Sticky on Desktop */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack
              gap={20}
              pos={{ base: 'static', md: 'sticky' }}
              top={{ base: 0, md: 70 }}
            >
              {/* Talent Profile Card (Now at Top) */}
              <Card radius={12} p="md" withBorder className="shadow-sm bg-white md:p-10">
                <Flex gap={12} align="center" mb={12} className="md:gap-4 md:mb-4">
                  <Avatar
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
                    size={48}
                    radius="xl"
                    className="md:w-16 md:h-16"
                  />
                  <Box flex={1}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={2} className="md:gap-1">
                        <Text fw={700} size="sm" className="md:text-lg">Aldi Ramadhan</Text>
                        <Icon icon="solar:check-circle-bold" className="text-[#194E9E]" width={16} />
                      </Flex>
                      <Button
                        variant="outline"
                        size="xs"
                        color="#194E9E"
                        radius="md"
                        className="px-3 md:px-4 h-7 border-[#194E9E]"
                        onClick={() => router.push(`/talent/${id}`)}
                      >
                        Profil
                      </Button>
                    </Flex>
                    <Text c="dimmed" className="!text-[8px] md:!text-sm">Photographer</Text>
                  </Box>
                </Flex>
                <Group gap={12} className="md:gap-5">
                  <Flex align="center" gap={4}>
                    <Icon icon="solar:star-bold" className="text-yellow-400" width={12} />
                    <Text fw={700} className="!text-[12px] md:!text-xs">4.9</Text>
                    <Text c="dimmed" className="!text-[12px] md:!text-xs">(128 ulasan)</Text>
                  </Flex>
                  <Flex align="center" gap={4}>
                    <Icon icon="solar:map-point-bold" className="text-gray-400" width={12} />
                    <Text c="dimmed" className="!text-[12px] md:!text-xs">Jakarta, Indonesia</Text>
                  </Flex>
                </Group>
              </Card>

              {/* Price Card (Now Second) */}
              <Card radius={12} padding="xl" withBorder className="shadow-sm bg-white">
                <Box mb={20}>
                  <Text size="xs" c="dimmed" fw={500}>Mulai dari</Text>
                  <Text fw={800} size="1.75rem" c="dark.9">Rp 1.500.000 <Text span size="sm" fw={400} c="dimmed">/ event</Text></Text>
                </Box>
                <Stack gap={12}>
                  <Button
                    variant="filled"
                    color="#194E9E"
                    fullWidth
                    size="md"
                    radius="md"
                    leftSection={<Icon icon="solar:cart-large-2-bold" />}
                  >
                    Pilih Paket Ini
                  </Button>
                  <Button
                    variant="outline"
                    color="#194E9E"
                    fullWidth
                    size="md"
                    radius="md"
                    className="border-[#194E9E]"
                    leftSection={<Icon icon="solar:letter-bold" />}
                  >
                    Kirim Pesan
                  </Button>
                </Stack>
              </Card>

              {/* Additional Info Accordion */}
              <Card radius={12} padding={0} withBorder className="shadow-sm bg-white overflow-hidden">
                <Accordion variant="default">
                  <Accordion.Item value="info">
                    <Accordion.Control>
                      <Text fw={700} size="sm">Informasi Tambahan</Text>
                    </Accordion.Control>
                    <Accordion.Panel pb="md">
                      <Stack gap={16}>
                        {[
                          { icon: "solar:global-bold", title: "Bahasa", value: "Indonesia, English" },
                          { icon: "solar:map-point-bold", title: "Area Layanan", value: "Jabodetabek" },
                          { icon: "solar:camera-bold", title: "Peralatan", value: "Kamera Full Frame, Lensa Prime & Zoom, Lighting Portable" },
                          { icon: "solar:box-bold", title: "Pengiriman Hasil", value: "1 - 3 Hari Setelah Event" },
                        ].map((info, i) => (
                          <Flex key={i} gap={12}>
                            <Icon icon={info.icon} className="text-gray-400 mt-0.5" width={16} />
                            <Box>
                              <Text size="xs" fw={700}>{info.title}</Text>
                              <Text size="xs" c="dimmed">{info.value}</Text>
                            </Box>
                          </Flex>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
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
              <Text size="10px" c="dimmed" fw={500} mb={-2}>Harga Paket Ini</Text>
              <Text fw={700} fz={{ base: 'sm', md: 'md' }} c="black">
                Rp 1.500.000 <Text span fw={400} c="dimmed" size="xs">/ event</Text>
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
                Pilih Paket Ini
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Padding for bottom bar */}
      <Box h={80} />
    </div>
  );
};

export default ServiceDetail;
