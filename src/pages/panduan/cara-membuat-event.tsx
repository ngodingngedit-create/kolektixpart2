import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
  Box,
  Text,
  Title,
  UnstyledButton,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Flex,
  Accordion,
  ThemeIcon,
  ScrollArea,
  Divider,
  Badge,
} from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/FooterComponent';

// Assets
import LogoWhite from '@/assets/images/logo-creator-white.png';

export default function CaraMembuatEvent() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [scroll] = useWindowScroll();
  const [activeTab, setActiveTab] = useState('Kebijakan');

  const faqData = [
    { q: 'Berapa lama proses review event?', a: 'Proses review biasanya memakan waktu 1-2 hari kerja.' },
    { q: 'Apakah event berbayar dikenakan biaya?', a: 'Ya, terdapat biaya layanan untuk setiap tiket yang terjual.' },
    { q: 'Bagaimana cara mengedit event?', a: 'Anda dapat mengedit melalui dashboard creator di menu "My Events".' },
    { q: 'Bagaimana jika event saya ditolak?', a: 'Tim kami akan memberikan alasan penolakan dan saran perbaikan.' },
    { q: 'Cara menarik dana penjualan tiket?', a: 'Anda dapat melakukan penarikan dana melalui dashboard creator pada menu Keuangan.' },
  ];

  return (
    <Box className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Head>
        <title>Cara Membuat Event | Kolektix Guide</title>
        <meta name="description" content="Panduan lengkap cara membuat dan mempublikasikan event di platform Kolektix." />
      </Head>


      {/* --- MAIN CONTENT WRAPPER --- */}
      <Container size="xl" className="pt-24 pb-12">
        <Stack gap={48}>

          {/* --- 2. HERO SECTION --- */}
          <Card
            radius="20px"
            p={0}
            className="overflow-hidden border-none"
            style={{ backgroundColor: 'rgba(34, 101, 200, 0.05)' }}
          >
            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 48}>
                <Stack gap={24}>
                  <Badge
                    variant="filled"
                    color="blue"
                    radius="md"
                    size="lg"
                    className="bg-[#194E9E] w-fit"
                    style={{ textTransform: 'none' }}
                  >
                    Panduan
                  </Badge>
                  <Box>
                    <Title order={1} className="text-[32px] md:text-[44px] font-extrabold text-[#02255A] leading-tight">
                      Cara Membuat Event
                    </Title>
                    <Text size="lg" className="text-gray-600 mt-4 max-w-lg leading-relaxed">
                      Panduan lengkap untuk membantu Anda membuat dan mempublikasikan event di platform Kolektix dengan mudah.
                    </Text>
                  </Box>
                  <Flex align="center" gap={8} className="text-gray-500">
                    <Icon icon="solar:calendar-outline" width={20} />
                    <Text size="sm" fw={500}>Terakhir diperbarui: 14 Januari 2026</Text>
                  </Flex>
                </Stack>
              </Grid.Col>

              {!isMobile && (
                <Grid.Col span={5} className="relative h-full flex items-center justify-center pr-12">
                  {/* <Box className="relative w-full h-[300px] flex items-center justify-center">
                    <Box className="absolute inset-0 bg-blue-100/20 blur-3xl rounded-full" />
                    <Icon icon="solar:clipboard-check-bold-duotone" width={180} className="text-[#194E9E] opacity-20 absolute translate-x-[-40px]" />
                    <Icon icon="solar:calendar-bold-duotone" width={140} className="text-[#194E9E] z-10" />
                    <Box className="absolute bottom-10 right-10 w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center rotate-12">
                      <Icon icon="solar:check-circle-bold" width={40} className="text-[#194E9E]" />
                    </Box>
                  </Box> */}
                </Grid.Col>
              )}
            </Grid>
          </Card>

          {/* --- 3. MAIN GRID --- */}
          <Grid gutter={40}>

            {/* LEFT COLUMN: CONTENT */}
            <Grid.Col span={isMobile ? 12 : 8}>
              <Stack gap={40}>

                {/* SECTION 1: PREPARATION */}
                <Box id="persiapan">
                  <Flex align="center" gap={12} className="mb-6">
                    <ThemeIcon size={32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size="xs" fw={700}>1</Text>
                    </ThemeIcon>
                    <Title order={2} size="h3" className="text-[#02255A] font-bold">
                      Persiapan Sebelum Membuat Event
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Box>
                      <Text className="text-gray-600 mb-8 leading-relaxed">
                        Sebelum membuat event, pastikan Anda sudah menyiapkan beberapa hal berikut agar proses pembuatan event berjalan lancar.
                      </Text>

                      <Grid gutter="lg">
                        {[
                          { title: 'Informasi Event', icon: 'solar:document-text-linear', color: 'blue', desc: 'Siapkan detail event seperti nama, deskripsi, tanggal, waktu, dan lokasi.' },
                          { title: 'Media Event', icon: 'solar:gallery-linear', color: 'green', desc: 'Siapkan gambar/grafis event seperti poster, banner, dan lainnya.' },
                          { title: 'Rencana Tiket', icon: 'solar:ticket-linear', color: 'purple', desc: 'Tentukan jenis tiket, kategori, dan harga yang akan ditawarkan.' },
                          { title: 'Kebutuhan Promosi', icon: 'solar:megaphone-linear', color: 'orange', desc: 'Siapkan strategi promosi untuk menjangkau audiens Anda.' },
                        ].map((card, i) => (
                          <Grid.Col span={isMobile ? 6 : 3} key={card.title}>
                            <Card
                              padding="xl"
                              radius="12px"
                              className="h-full border border-gray-200 shadow-[0_4px_6px_rgba(0,0,0,0.01)] hover:shadow-md transition-all text-center group"
                            >
                              <Stack align="center" gap="md">
                                <ThemeIcon
                                  size={56}
                                  radius="xl"
                                  variant="light"
                                  color={card.color}
                                  className="group-hover:scale-110 transition-transform"
                                >
                                  <Icon icon={card.icon} width={28} />
                                </ThemeIcon>
                                <Box>
                                  <Text fw={700} size="sm" className="text-[#02255A] mb-2">{card.title}</Text>
                                  <Text size="xs" className="text-gray-500 leading-normal">{card.desc}</Text>
                                </Box>
                              </Stack>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>
                  </Card>
                </Box>

                {/* SECTION 2: STEPS */}
                <Box id="langkah">
                  <Flex align="center" gap={12} className="mb-6">
                    <ThemeIcon size={32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size="xs" fw={700}>2</Text>
                    </ThemeIcon>
                    <Title order={2} size="h3" className="text-[#02255A] font-bold">
                      Langkah Membuat Event
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Box>
                      <Stack gap={0} className="relative pl-12">
                        {/* Vertical Line */}
                        <Box className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200" />

                        {[
                          { title: 'Masuk ke Akun Kolektix', icon: 'solar:user-linear', desc: 'Login ke akun Kolektix Anda, lalu klik tombol "Buat Event" di bagian kanan atas.' },
                          { title: 'Isi Informasi Dasar Event', icon: 'solar:document-text-linear', desc: 'Lengkapi informasi dasar seperti nama event, kategori, deskripsi, tanggal, waktu, dan lokasi.' },
                          { title: 'Unggah Media Event', icon: 'solar:cloud-upload-linear', desc: 'Upload gambar poster, banner, atau video untuk mempercantik tampilan event Anda.' },
                          { title: 'Atur Tiket & Harga', icon: 'solar:ticket-bold-duotone', desc: 'Tambahkan jenis tiket, tentukan harga, kuota, dan periode penjualan tiket.' },
                          { title: 'Atur Promosi (Opsional)', icon: 'solar:megaphone-bold-duotone', desc: 'Buat kode promo atau tentukan program promosi untuk menarik lebih banyak audiens.' },
                          { title: 'Review & Publish', icon: 'solar:check-circle-linear', desc: 'Periksa kembali semua informasi event Anda. Jika sudah sesuai, klik "Publish Event".' },
                        ].map((step, i) => (
                          <Box key={step.title} className="pb-10 last:pb-0 relative">
                            {/* Number Circle on Line */}
                            <Box className="absolute -left-[45px] top-1 w-8 h-8 rounded-full bg-[#194E9E] flex items-center justify-center text-white text-[10px] font-extrabold z-10 border-4 border-white shadow-sm">
                              {i + 1}
                            </Box>

                            <Flex gap={20}>
                              <ThemeIcon size={48} radius="xl" variant="light" color="blue" className="shrink-0 bg-blue-50/50">
                                <Icon icon={step.icon} width={24} />
                              </ThemeIcon>
                              <Box pt={4}>
                                <Text fw={700} className="text-[#02255A] mb-1">{step.title}</Text>
                                <Text size="sm" className="text-gray-500 leading-relaxed">{step.desc}</Text>
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Card>
                </Box>

                {/* INFO BOX */}
                <Box className="bg-[#EDF3FC] border border-[#D9E3F3] rounded-xl p-6 flex gap-4 items-start">
                  <ThemeIcon variant="filled" color="#194E9E" radius="xl" size="sm">
                    <Icon icon="solar:info-circle-bold" width={16} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={700} size="sm" className="text-[#194E9E]">Catatan</Text>
                    <Text size="sm" className="text-[#2656A9] mt-1 opacity-90">
                      Event akan melalui proses review sebelum ditampilkan ke publik demi menjaga kualitas platform.
                    </Text>
                  </Box>
                </Box>

              </Stack>
            </Grid.Col>

            {/* RIGHT COLUMN: SIDEBAR */}
            <Grid.Col span={isMobile ? 12 : 4}>
              <Stack gap={20} className={isMobile ? '' : 'sticky top-[200px] mt-24'}>

                {/* FAQ Section */}
                <Card id="faq" radius="12px" padding="md" className="shadow-[0_4px_12px_rgba(0,0,0,0.01)] border border-gray-200" style={{ borderColor: '#E5E7EB' }}>
                  <Title order={3} size="h5" className="mb-1 text-[#02255A] px-2">Butuh Bantuan?</Title>
                  <Text size="10px" className="text-gray-400 mb-4 px-2">Temukan jawaban untuk pertanyaan yang sering diajukan.</Text>

                  <Accordion
                    variant="unstyled"
                    defaultValue={faqData[0].q}
                    styles={{
                      item: { border: 'none', background: 'transparent' },
                      control: { padding: '12px 8px', '&:hover': { background: 'transparent' } },
                      content: { padding: '0 8px 12px 8px' },
                      label: { fontSize: '13px', fontWeight: 600, color: '#4A5568' },
                      chevron: { color: '#194E9E' }
                    }}
                  >
                    {faqData.map((item, idx) => (
                      <Accordion.Item key={item.q} value={item.q}>
                        <Accordion.Control>{item.q}</Accordion.Control>
                        <Accordion.Panel>
                          <Text size="xs" className="text-gray-500 leading-relaxed">{item.a}</Text>
                        </Accordion.Panel>
                        {idx !== faqData.length - 1 && (
                          <Divider my={2} color="gray.2" className="mx-2" />
                        )}
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>

                {/* Video Tutorial Card */}
                <Card id="video" radius="12px" padding="md" className="shadow-[0_4px_12px_rgba(0,0,0,0.01)] border border-gray-200 overflow-hidden relative">
                  <Title order={3} size="h5" className="mb-1 text-[#02255A] px-2">Video Tutorial</Title>
                  <Text size="10px" className="text-gray-500 mb-4 px-2">Pelajari cara membuat event melalui video panduan berikut.</Text>

                  <Box className="relative rounded-lg overflow-hidden aspect-video bg-[#02255A] group cursor-pointer mb-4">
                    <Box className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Box className="absolute inset-0 flex items-center justify-center z-20">
                      <Box className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Icon icon="solar:play-bold" width={20} className="text-[#194E9E] ml-1" />
                      </Box>
                    </Box>
                    <Box className="absolute bottom-3 left-3 z-20">
                      <Image src={LogoWhite} alt="logo" width={50} height={15} className="object-contain opacity-80" />
                      <Text fw={700} size="xs" className="text-white mt-1">Cara Membuat Event</Text>
                    </Box>
                  </Box>

                  <Button
                    variant="outline"
                    fullWidth
                    radius="8px"
                    size="sm"
                    rightSection={<Icon icon="solar:arrow-right-up-linear" width={14} />}
                    className="!border-gray-200 !text-[#194E9E] font-bold hover:bg-gray-50"
                  >
                    Tonton di YouTube
                  </Button>
                </Card>

                {/* Support Card */}
                <Card radius="12px" padding="xl" className="bg-[#F8FAFF] border-none shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                  <Stack align="start" gap="xs">
                    <Title order={3} size="h4" className="text-[#02255A]">Masih butuh bantuan?</Title>
                    <Text size="xs" className="text-gray-500">Tim support kami siap membantu Anda.</Text>
                    <Button
                      variant="outline"
                      radius="8px"
                      fullWidth
                      mt="md"
                      size="md"
                      leftSection={<Icon icon="solar:headphones-round-linear" width={20} />}
                      className="!border-[#194E9E] !text-[#194E9E] font-bold bg-white hover:bg-blue-50 transition-colors"
                    >
                      Hubungi Support
                    </Button>
                  </Stack>
                </Card>

              </Stack>
            </Grid.Col>
          </Grid>



        </Stack>
      </Container>

      {/* --- PLATFORM FOOTER --- */}
      <Footer />

      {/* --- GLOBAL STYLES & TYPOGRAPHY --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          background-color: #F9FAFB;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Aggressively remove any dark borders or outlines */
        *:focus {
          outline: none !important;
        }
        
        /* Override Mantine default borders if they are dark */
        .mantine-Accordion-item {
          border-bottom: none !important;
        }
        .mantine-Card-root {
          border-color: #E5E7EB !important; /* Standard grey */
        }
      `}</style>
    </Box>
  );
}
