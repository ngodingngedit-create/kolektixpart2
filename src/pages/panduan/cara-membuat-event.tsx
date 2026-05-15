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
      <Container size="91%" className="pt-24 pb-12 px-2 md:px-12 lg:px-20 xl:px-32">
        <Stack gap={48}>

          {/* --- 2. HERO SECTION --- */}
          <Card
            radius="20px"
            p={0}
            className="overflow-hidden border-none relative"
            style={{ backgroundColor: 'rgba(34, 101, 200, 0.05)' }}
          >
            {/* Last Updated Label */}
            <div className="absolute top-3 md:top-6 right-3 md:right-8 flex items-center gap-1 md:gap-2 bg-[#194E9E] backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-sm border border-white/40 z-20">
              <Icon icon="solar:calendar-outline" width={10} className="text-white md:w-[14px]" />
              <div className="text-[7px] md:text-[11px] font-semibold text-white">Terakhir diperbarui: 14 Januari 2026</div>
            </div>

            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 48}>
                <Stack gap={24}>

                  <Box>
                    <div className="text-[20px] md:text-[44px] font-extrabold text-[#02255A] leading-tight">
                      Cara Membuat Event
                    </div>
                    <div className="text-sm md:text-lg text-gray-600 mt-3 md:mt-4 max-w-lg leading-relaxed">
                      Panduan lengkap untuk membantu Anda membuat dan mempublikasikan event di platform Kolektix dengan mudah.
                    </div>
                  </Box>
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
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>1</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#02255A] font-bold">
                      Persiapan Sebelum Membuat Event
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Box>
                      <div className="text-gray-600 mb-8 leading-relaxed pl-1">
                        Sebelum membuat event, pastikan Anda sudah menyiapkan beberapa hal berikut agar proses pembuatan event berjalan lancar.
                      </div>

                      <Grid gutter="lg">
                        {[
                          { title: 'Informasi Event', icon: 'solar:document-text-linear', color: 'blue', desc: 'Siapkan detail event seperti nama, deskripsi, tanggal, waktu, dan lokasi.' },
                          { title: 'Media Event', icon: 'solar:gallery-linear', color: 'green', desc: 'Siapkan gambar/grafis event seperti poster, banner, dan lainnya.' },
                          { title: 'Rencana Tiket', icon: 'solar:ticket-linear', color: 'purple', desc: 'Tentukan jenis tiket, kategori, dan harga yang akan ditawarkan.' },
                          { title: 'Kebutuhan Promosi', icon: 'solar:tag-bold-duotone', color: 'orange', desc: 'Siapkan strategi promosi untuk menjangkau audiens Anda.' },
                        ].map((card, i) => (
                          <Grid.Col span={isMobile ? 6 : 3} key={card.title}>
                            <Card
                              padding={isMobile ? 'md' : 'xl'}
                              radius="12px"
                              className="h-full border border-gray-200 shadow-[0_4px_6px_rgba(0,0,0,0.01)] hover:shadow-md transition-all text-center group"
                            >
                              <Stack align="center" gap={isMobile ? 'xs' : 'md'}>
                                <ThemeIcon
                                  size={isMobile ? 40 : 56}
                                  radius="xl"
                                  variant="light"
                                  color={card.color}
                                  className="group-hover:scale-110 transition-transform"
                                >
                                  <Icon icon={card.icon} width={isMobile ? 20 : 28} />
                                </ThemeIcon>
                                <Box>
                                  <Text fw={700} size={isMobile ? 'xs' : 'sm'} className="text-[#02255A] mb-1 md:mb-2">{card.title}</Text>
                                  <div className="text-[10px] md:text-xs text-gray-500 leading-normal">{card.desc}</div>
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
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>2</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#02255A] font-bold">
                      Langkah Membuat Event
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Box>
                      <Stack gap={0} className={`relative ${isMobile ? 'pl-9' : 'pl-12'}`}>
                        {/* Connecting Line */}
                        <Box className={`absolute ${isMobile ? 'left-[14px]' : 'left-[19px]'} top-8 bottom-8 w-[1px] bg-[#194E9E]/20 z-0`} />

                        {[
                          { title: 'Masuk ke Akun Kolektix', icon: 'solar:user-linear', desc: 'Login ke akun Kolektix Anda, lalu klik tombol "Buat Event" di bagian kanan atas.' },
                          { title: 'Isi Informasi Dasar Event', icon: 'solar:document-text-linear', desc: 'Lengkapi informasi dasar seperti nama event, kategori, deskripsi, lokasi, dan waktu.' },
                          { title: 'Unggah Media Event', icon: 'solar:cloud-upload-linear', desc: 'Upload gambar poster, banner, atau video untuk mempercantik tampilan event Anda.' },
                          { title: 'Atur Tiket & Harga', icon: 'solar:ticket-bold-duotone', desc: 'Tambahkan jenis tiket, tentukan harga, kuota, dan periode penjualan tiket.' },
                          { title: 'Atur Promosi (Opsional)', icon: 'solar:tag-bold-duotone', desc: 'Buat kode promo atau tentukan program promosi untuk menarik lebih banyak audiens.' },
                          { title: 'Review & Publish', icon: 'solar:check-circle-linear', desc: 'Periksa kembali semua informasi event Anda. Jika sudah sesuai, klik "Publish Event".' },
                        ].map((step, i) => (
                          <Box key={step.title} className="pb-10 last:pb-0 relative">
                            <Flex align="start" gap={isMobile ? 12 : 20}>
                              {/* Step Number */}
                              <Box 
                                className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} rounded-full bg-[#194E9E] flex items-center justify-center text-white font-bold ${isMobile ? 'text-[10px]' : 'text-sm'} shadow-lg absolute ${isMobile ? 'left-[-35px]' : 'left-[-48px]'} z-10 ${isMobile ? 'top-1' : 'top-2'}`}
                              >
                                {i + 1}
                              </Box>

                              {/* Icon Box */}
                              <Box className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} rounded-2xl bg-blue-50 flex items-center justify-center text-[#194E9E] shadow-sm shrink-0`}>
                                <Icon icon={step.icon} width={isMobile ? 20 : 28} />
                              </Box>

                              {/* Content */}
                              <Box className="flex-1" pt={isMobile ? 2 : 4}>
                                <Text fw={700} size={isMobile ? 'sm' : 'lg'} className="text-[#02255A] leading-tight">{step.title}</Text>
                                <div className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-gray-500 mt-1 leading-relaxed`}>{step.desc}</div>
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
              <Stack gap={20} className={isMobile ? '' : 'sticky top-[80px] mt-14'}>

                <Accordion variant="separated" radius="12px" defaultValue={['faq', 'video', 'support']} multiple styles={{
                  item: { border: '1px solid #E5E7EB', backgroundColor: 'white', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
                  control: { padding: '16px 20px' },
                  label: { fontSize: '18px', fontWeight: 700, color: '#02255A' },
                  content: { padding: '0 16px 20px 16px' }
                }}>

                  {/* FAQ Section */}
                  <Accordion.Item value="faq">
                    <Accordion.Control>Butuh Bantuan?</Accordion.Control>
                    <Accordion.Panel>
                      <div className="text-sm text-gray-500 mb-6 pl-2 pr-1 leading-relaxed">Temukan jawaban untuk pertanyaan yang sering diajukan.</div>
                      <Accordion
                        variant="unstyled"
                        defaultValue={faqData[0].q}
                        styles={{
                          item: { border: 'none', background: 'transparent' },
                          control: { padding: '12px 8px', '&:hover': { background: 'transparent' } },
                          content: { padding: '0 8px 12px 8px' },
                          label: { fontSize: '13px', fontWeight: 700, color: '#000000ff' },
                          chevron: { color: '#000000ff' }
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
                    </Accordion.Panel>
                  </Accordion.Item>

                  {/* Support Section */}
                  <Accordion.Item value="support">
                    <Accordion.Control>Masih butuh bantuan?</Accordion.Control>
                    <Accordion.Panel>
                      <div className="text-sm text-gray-500 mb-4 pl-2 leading-relaxed">Tim support kami siap membantu Anda.</div>
                      <Button
                        variant="outline"
                        radius="8px"
                        fullWidth
                        size="md"
                        leftSection={<Icon icon="solar:headphones-round-linear" width={20} />}
                        className="!border-[#194E9E] !text-[#194E9E] font-bold bg-white hover:bg-blue-50 transition-colors"
                      >
                        Hubungi Support
                      </Button>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>

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
