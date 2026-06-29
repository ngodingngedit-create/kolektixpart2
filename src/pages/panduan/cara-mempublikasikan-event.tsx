import React from 'react';
import { Container, Title, Text, Box, Stack, Grid, Card, Flex, ThemeIcon, Button, Divider, Accordion } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import LogoWhite from '@images/logo-creator-white.png';
import Footer from '@/components/FooterComponent';

const faqData = [
  { q: 'Berapa lama proses review setelah publikasi?', a: 'Setelah Anda klik publikasikan, tim Kolektix akan mereview event Anda dalam waktu maksimal 1x24 jam di hari kerja.' },
  { q: 'Apakah saya bisa membatalkan publikasi?', a: 'Ya, Anda bisa mengubah status event kembali menjadi draft selama tiket belum terjual.' },
  { q: 'Di mana event saya akan muncul?', a: 'Event Anda akan muncul di halaman eksplorasi Kolektix, kategori yang relevan, dan hasil pencarian.' },
  { q: 'Bagaimana cara membagikan link event?', a: 'Setelah dipublikasikan, Anda akan mendapatkan link unik yang bisa dibagikan ke media sosial melalui dashboard.' },
  { q: 'Apakah ada biaya untuk publikasi?', a: 'Publikasi event di Kolektix gratis. Biaya hanya dikenakan per tiket yang terjual (platform fee).' },
];

const CaraMempublikasikanEvent = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Box className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Head>
        <title>Cara Mempublikasikan Event | Kolektix Guide</title>
        <meta name="description" content="Panduan lengkap cara mempublikasikan event Anda agar tayang di Kolektix." />
      </Head>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <Container size="91%" className="pt-24 pb-12 px-2 md:px-12 lg:px-20 xl:px-32">
        <Stack gap={48}>

          {/* --- 1. HERO SECTION --- */}
          <Card
            radius="20px"
            p={0}
            className="overflow-hidden border-none relative"
            style={{ backgroundColor: 'rgba(34, 101, 200, 0.05)' }}
          >
            {/* Last Updated Label */}
            <div className="absolute top-3 md:top-6 right-3 md:right-8 flex items-center gap-1 md:gap-2 bg-[#194E9E] backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-sm border border-white/40 z-20">
              <Icon icon="solar:calendar-outline" width={10} className="text-white md:w-[14px]" />
              <div className="text-[7px] md:text-[11px] font-semibold text-white uppercase tracking-wider">Terakhir diperbarui: 14 Januari 2026</div>
            </div>

            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 48}>
                <Stack gap={24}>
                  <Box>
                    <div className="text-[20px] md:text-[44px] font-extrabold text-[#02255A] leading-tight">
                      Cara Mempublikasikan Event
                    </div>
                    <div className="text-sm md:text-lg text-gray-600 mt-3 md:mt-4 max-w-lg leading-relaxed">
                      Langkah final untuk membawa event Anda tayang secara resmi dan mulai menjangkau audiens di seluruh platform Kolektix.
                    </div>
                  </Box>
                </Stack>
              </Grid.Col>

              {!isMobile && (
                <Grid.Col span={5} className="relative h-full flex items-center justify-center p-12">

                </Grid.Col>
              )}
            </Grid>
          </Card>


          {/* --- 3. MAIN CONTENT GRID --- */}
          <Grid gutter={40}>
            {/* LEFT COLUMN: CONTENT */}
            <Grid.Col span={isMobile ? 12 : 8}>
              <Stack gap={40}>

                {/* SECTION 1: BEFORE PUBLISHING */}
                <Box>
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>1</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#02255A] font-bold">
                      Sebelum Mempublikasikan
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white overflow-hidden relative">
                    <Box className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-bl-full -mr-8 -mt-8" />
                    <Stack gap={20}>
                      <div className="text-gray-600 leading-relaxed pl-1 z-10">
                        Pastikan seluruh komponen berikut telah siap untuk memastikan proses publikasi berjalan lancar dan profesional:
                      </div>

                      <Grid gutter="md">
                        {[
                          'Informasi event sudah lengkap',
                          'Tiket & harga sudah dibuat',
                          'Media event sudah diunggah',
                          'Promosi (opsional) sudah diatur'
                        ].map((item, idx) => (
                          <Grid.Col span={isMobile ? 12 : 6} key={idx}>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border" style={{ borderColor: '#e4e4e7' }}>
                              <ThemeIcon size={24} radius="xl" color="green" variant="light">
                                <Icon icon="solar:check-read-linear" width={16} />
                              </ThemeIcon>
                              <Text size="sm" fw={600} className="text-[#02255A]">{item}</Text>
                            </div>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Stack>
                  </Card>
                </Box>

                {/* SECTION 2: STEPS */}
                <Box>
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>2</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#02255A] font-bold">
                      Langkah Mempublikasikan Event
                    </Title>
                  </Flex>

                  <Grid gutter={32}>
                    <Grid.Col span={isMobile ? 12 : 12}>
                      <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                        <Grid gutter={isMobile ? 32 : 48}>
                          <Grid.Col span={isMobile ? 12 : 7}>
                            <Stack gap={0} className={`relative ${isMobile ? 'pl-9' : 'pl-12'}`}>
                              {/* Connecting Line */}
                              <Box className={`absolute ${isMobile ? 'left-[14px]' : 'left-[19px]'} top-8 bottom-8 w-[1px] bg-[#194E9E]/20 z-0`} />

                              {[
                                { title: 'Buka Menu "Event Saya"', icon: 'solar:list-bold-duotone', desc: 'Klik dashboard Kreator dan pilih menu "Event Saya" untuk melihat daftar event Anda.' },
                                { title: 'Pilih Draft Event', icon: 'solar:document-bold-duotone', desc: 'Cari event yang statusnya masih "Draft" dan klik tombol "Edit" atau judul event.' },
                                { title: 'Review Akhir', icon: 'solar:eye-bold-duotone', desc: 'Gunakan fitur "Pratinjau" untuk melihat bagaimana audiens melihat halaman event Anda.' },
                                { title: 'Klik Tombol Publikasikan', icon: 'solar:paper-plane-bold-duotone', desc: 'Jika semua sudah sesuai, klik tombol "Publikasikan" di pojok kanan atas dashboard.' },
                                { title: 'Konfirmasi Publikasi', icon: 'solar:shield-check-bold-duotone', desc: 'Akan muncul pop-up konfirmasi. Klik "Ya, Publikasikan" untuk mengirim event ke tim review.' },
                                { title: 'Tunggu Proses Review', icon: 'solar:clock-circle-bold-duotone', desc: 'Tim Kolektix akan mereview event Anda. Anda akan menerima notifikasi jika event sudah tayang.' },
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
                          </Grid.Col>

                          {/* Dashboard Mockup Column */}
                          {!isMobile && (
                            <Grid.Col span={5}>
                              <Box className="sticky top-24">
                                <Box className="bg-[#02255A] rounded-[24px] p-6 shadow-2xl relative overflow-hidden h-[500px]">
                                  {/* Navbar Mockup */}
                                  <Flex justify="space-between" align="center" mb="xl">
                                    <Image src={LogoWhite} alt="logo" width={60} height={18} />
                                    <ThemeIcon radius="xl" color="gray" variant="light" size="sm">
                                      <Icon icon="solar:user-bold" />
                                    </ThemeIcon>
                                  </Flex>

                                  {/* Menu List Mockup */}
                                  <Stack gap="xs" mb="xl">
                                    <Box className="bg-white/10 p-2 rounded-lg flex items-center gap-2 border border-white/10">
                                      <Icon icon="solar:list-bold" className="text-white" />
                                      <Text size="xs" fw={700} className="text-white">Event Saya</Text>
                                    </Box>
                                    <Box className="p-2 rounded-lg flex items-center gap-2 opacity-50">
                                      <Icon icon="solar:ticket-bold" className="text-white" />
                                      <Text size="xs" fw={700} className="text-white">Pesanan</Text>
                                    </Box>
                                  </Stack>

                                  {/* Content Area Mockup */}
                                  <Box className="bg-white rounded-xl p-4 h-[250px] shadow-lg">
                                    <Flex justify="space-between" align="center" mb="md">
                                      <Title order={5} size="xs" className="text-[#02255A]">Edit Event</Title>
                                      <Flex gap="xs">
                                        <Button variant="outline" size="compact-xs" radius="sm">Pratinjau</Button>
                                        <Button color="green" size="compact-xs" radius="sm">Publikasikan</Button>
                                      </Flex>
                                    </Flex>

                                    <Divider mb="md" />

                                    <Stack gap="sm">
                                      <Box className="h-2 w-3/4 bg-gray-100 rounded-full" />
                                      <Box className="h-2 w-1/2 bg-gray-100 rounded-full" />
                                      <Box className="h-12 w-full bg-blue-50 rounded-lg flex items-center justify-center border border-dashed border-blue-200">
                                        <Icon icon="solar:gallery-add-linear" className="text-blue-300" />
                                      </Box>
                                      <Flex gap="sm">
                                        <Box className="h-8 flex-1 bg-gray-50 rounded-lg" />
                                        <Box className="h-8 flex-1 bg-gray-50 rounded-lg" />
                                      </Flex>
                                    </Stack>
                                  </Box>

                                  {/* Floating Glow */}
                                  <Box className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 blur-[60px] rounded-full" />
                                </Box>

                                <Card mt="xl" radius="lg" className="bg-green-50 border border-green-100">
                                  <Flex gap="md">
                                    <ThemeIcon color="green" radius="xl" size="lg">
                                      <Icon icon="solar:check-read-bold" width={20} />
                                    </ThemeIcon>
                                    <Box>
                                      <Text fw={700} size="sm" className="text-[#02255A]">Setelah event dipublikasikan</Text>
                                      <Text size="xs" className="text-gray-600 mt-1">Status akan berubah menjadi &quot;Review&quot; dan Anda akan menerima email konfirmasi.</Text>
                                    </Box>
                                  </Flex>
                                </Card>
                              </Box>
                            </Grid.Col>
                          )}
                        </Grid>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Box>

                {/* Mobile Post-Publish Note */}
                {isMobile && (
                  <Card radius="lg" className="bg-green-50 border border-green-100 p-6">
                    <Flex gap="md" align="start">
                      <ThemeIcon color="green" radius="xl" size="lg">
                        <Icon icon="solar:check-read-bold" width={20} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} size="sm" className="text-[#02255A]">Setelah event dipublikasikan</Text>
                        <Text size="xs" className="text-gray-600 mt-1 leading-relaxed">
                          Status akan berubah menjadi &quot;Review&quot; dan Anda akan menerima email konfirmasi.
                          Pastikan Anda memantau email atau notifikasi dashboard untuk update dari tim moderator Kolektix.
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                )}

              </Stack>
            </Grid.Col>

            {/* RIGHT COLUMN: SIDEBAR */}
            <Grid.Col span={isMobile ? 12 : 4}>
              <Stack gap={20} className={isMobile ? '' : 'sticky top-[80px] mt-14'}>

                <Accordion variant="separated" radius="12px" defaultValue={['faq', 'support']} multiple styles={{
                  item: { border: '1px solid #E5E7EB', backgroundColor: 'white', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
                  control: { padding: '16px 20px' },
                  label: { fontSize: '18px', fontWeight: 700, color: '#02255A' },
                  content: { padding: '0 16px 20px 16px' }
                }}>

                  {/* FAQ Section */}
                  <Accordion.Item value="faq">
                    <Accordion.Control>Butuh Bantuan?</Accordion.Control>
                    <Accordion.Panel>
                      <div className="text-sm text-gray-500 mb-6 pl-2 pr-1 leading-relaxed">Temukan jawaban untuk pertanyaan yang sering diajukan seputar publikasi.</div>
                      <Accordion
                        variant="unstyled"
                        defaultValue={faqData[0].q}
                        styles={{
                          item: { border: 'none', background: 'transparent' },
                          control: { padding: '12px 8px', '&:hover': { background: 'transparent' } },
                          content: { padding: '0 8px 12px 8px' },
                          label: { fontSize: '13px', fontWeight: 700, color: '#4A5568' },
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

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .mantine-Accordion-item {
          border-radius: 12px !important;
          overflow: hidden;
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
};

export default CaraMempublikasikanEvent;
