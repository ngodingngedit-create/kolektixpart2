import React from 'react';
import { Container, Title, Text, Box, Stack, Grid, Card, Flex, ThemeIcon, Button, Divider, Accordion } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useMediaQuery } from '@mantine/hooks';
import Footer from '@/components/FooterComponent';

const faqData = [
  { q: 'Kapan waktu terbaik untuk memulai promosi?', a: 'Kami merekomendasikan memulai promosi minimal 2-4 minggu sebelum hari H event untuk membangun antusiasme dan mengamankan penjualan tiket early bird.' },
  { q: 'Apakah ada biaya tambahan untuk fitur "Boost"?', a: 'Ya, fitur Boost dan Spotlight adalah layanan berbayar. Anda bisa memilih paket yang sesuai dengan budget promosi Anda di dashboard.' },
  { q: 'Bagaimana cara melacak efektivitas promo code?', a: 'Anda dapat melihat laporan penggunaan kode promo secara real-time di menu "Laporan Penjualan" pada dashboard partner Anda.' },
  { q: 'Dapatkah saya menggabungkan beberapa jenis promosi?', a: 'Tentu! Strategi terbaik adalah mengombinasikan promosi internal (Boost) dengan promosi eksternal (Share Media Sosial & Broadcast).' },
  { q: 'Bagaimana jika saya ingin bantuan promosi khusus dari tim Kolektix?', a: 'Anda dapat menghubungi tim partnership kami melalui tombol "Hubungi Support" untuk konsultasi strategi promosi kustom.' },
];

const CaraMempromosikanEvent = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Box className="min-h-screen bg-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Head>
        <title>Cara Mempromosikan Event | Kolektix Guide</title>
        <meta name="description" content="Tingkatkan penjualan tiket Anda dengan panduan lengkap strategi promosi event di Kolektix." />
      </Head>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <Container size="91%" className="pt-24 pb-12 px-2 md:px-12 lg:px-20 xl:px-32 max-w-[1350px] mx-auto">
        <Stack gap={40}>

          {/* --- 1. HERO SECTION --- */}
          <Card
            radius="12px"
            p={0}
            className="overflow-hidden border border-[#E2E8F0] relative shadow-sm"
            style={{ backgroundColor: 'rgba(0, 97, 255, 0.05)' }}
          >
            {/* Last Updated Label */}
            <div className="absolute top-3 md:top-6 right-3 md:right-8 flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 rounded-full shadow-sm border border-[#E2E8F0] z-20">
              <Icon icon="solar:calendar-bold" width={12} className="text-[#0061FF]" />
              <div className="text-[8px] md:text-[11px] font-bold text-[#002147] uppercase tracking-wider">Terakhir diperbarui: 14 Januari 2026</div>
            </div>

            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 56}>
                <Stack gap={24} align={isMobile ? 'center' : 'start'} className={isMobile ? 'text-center' : ''}>
                  <Box>
                    <Title order={1} className="text-[28px] md:text-[48px] font-black text-[#002147] leading-tight">
                      Cara Mempromosikan Event
                    </Title>
                    <Text className="text-sm md:text-lg text-gray-500 mt-4 max-w-lg leading-relaxed font-medium">
                      Optimalkan jangkauan event Anda dan maksimalkan penjualan tiket menggunakan berbagai fitur promosi cerdas yang tersedia di platform Kolektix.
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>

              {!isMobile && (
                <Grid.Col span={5} className="relative h-full flex items-center justify-center p-12 pr-16">
                  <Box className="relative w-full aspect-square flex items-center justify-center">
                    {/* 3D-style Illustration Mockup */}
                    <Box className="relative z-10 w-full h-full flex items-center justify-center">
                       {/* Megaphone Icon with Glow */}
                       <div className="relative group">
                          <div className="absolute inset-0 bg-[#0061FF]/20 blur-3xl rounded-full scale-150 animate-pulse" />
                          <Icon icon="solar:megaphone-bold" width={180} className="text-[#0061FF] relative drop-shadow-2xl" />
                          {/* Floating social bubbles */}
                          <Box className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-lg border border-[#E2E8F0] flex items-center justify-center animate-bounce">
                             <Icon icon="solar:camera-bold" className="text-pink-500 w-6 h-6" />
                          </Box>
                          <Box className="absolute bottom-4 -left-8 w-12 h-12 bg-white rounded-xl shadow-lg border border-[#E2E8F0] flex items-center justify-center animate-bounce [animation-delay:0.5s]">
                             <Icon icon="solar:share-bold" className="text-blue-500 w-6 h-6" />
                          </Box>
                       </div>
                    </Box>
                  </Box>
                </Grid.Col>
              )}
            </Grid>
          </Card>

          {/* --- 2. PROGRESS SUMMARY (RINGKASAN PROMOSI) --- */}
          <Card radius="12px" p={isMobile ? "lg" : "xl"} className="border border-[#E2E8F0] bg-white shadow-sm">
            <Text fw={800} size="lg" mb={32} className="text-[#002147] text-center md:text-left">Ringkasan Strategi Promosi</Text>
            
            <Box className={isMobile ? "overflow-x-auto no-scrollbar pb-4" : ""}>
              <Flex 
                justify="space-between" 
                align="center" 
                gap={isMobile ? 24 : 12}
                className={isMobile ? "min-w-[700px] px-2" : "relative"}
              >
                {/* Horizontal Dashed Line (Desktop Only) */}
                {!isMobile && <Box className="absolute top-1/2 left-10 right-10 h-[2px] border-t-2 border-dashed border-[#E2E8F0] -translate-y-12 z-0" />}

                {[
                  { icon: 'solar:megaphone-bold', label: 'Fitur Promosi', step: 1 },
                  { icon: 'solar:users-group-rounded-bold', label: 'Social Share', step: 2 },
                  { icon: 'solar:letter-bold', label: 'Broadcast', step: 3 },
                  { icon: 'solar:tag-bold', label: 'Kode Promo', step: 4 },
                  { icon: 'solar:chart-2-bold', label: 'Analisis Performa', step: 5 },
                ].map((item) => (
                  <Stack key={item.step} align="center" gap={12} className="relative z-10 flex-1">
                    <Box className="relative">
                      <Box className="w-16 h-16 md:w-20 md:h-20 rounded-[12px] bg-[#F8FAFF] border border-[#E2E8F0] flex items-center justify-center text-[#0061FF] shadow-sm">
                        <Icon icon={item.icon} width={isMobile ? 28 : 36} />
                      </Box>
                      <Box className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#0061FF] border-4 border-white flex items-center justify-center text-white text-[10px] md:text-xs font-black">
                        {item.step}
                      </Box>
                    </Box>
                    <Text size="xs" fw={700} className="text-[#002147] text-center whitespace-nowrap">{item.label}</Text>
                  </Stack>
                ))}
              </Flex>
            </Box>
          </Card>

          {/* --- 3. MAIN CONTENT GRID --- */}
          <Grid gutter={40}>
            {/* LEFT COLUMN: CONTENT */}
            <Grid.Col span={isMobile ? 12 : 8}>
              <Stack gap={40}>
                <Box>
                  <Title order={2} size="24px" mb={32} className="text-[#002147] font-black">Langkah Mempromosikan Event</Title>
                  
                  <Stack gap={0} className="relative pl-12 md:pl-16">
                    {/* Vertical Timeline Line */}
                    <Box className="absolute left-[23px] md:left-[31px] top-6 bottom-6 w-[2px] bg-[#E2E8F0] z-0" />

                    {[
                      {
                        title: 'Gunakan Fitur Promosi Internal',
                        desc: 'Tingkatkan visibilitas event Anda langsung di platform Kolektix dengan fitur Spotlight dan Boost.',
                        visual: (
                          <Card radius="12px" p="md" className="border border-[#E2E8F0] bg-white mt-4 max-w-sm">
                            <Text fw={800} size="xs" mb="md" className="text-gray-400 uppercase tracking-widest">Fitur Promosi</Text>
                            <Stack gap={8}>
                              {['Spotlight Halaman Utama', 'Boost Kategori Event', 'Paket Promosi Hemat'].map((f) => (
                                <Flex key={f} justify="space-between" align="center" className="p-3 bg-blue-50/50 rounded-lg border border-[#E2E8F0]">
                                  <Text size="xs" fw={700} className="text-[#002147]">{f}</Text>
                                  <Icon icon="solar:add-circle-bold" className="text-[#0061FF]" />
                                </Flex>
                              ))}
                            </Stack>
                          </Card>
                        )
                      },
                      {
                        title: 'Bagikan ke Media Sosial',
                        desc: 'Jangkau komunitas Anda dengan membagikan link event yang sudah dioptimalkan untuk berbagai platform.',
                        visual: (
                          <Card radius="12px" p="md" className="border border-[#E2E8F0] bg-white mt-4 max-w-sm">
                            <Flex gap="md" mb="md">
                              {['solar:camera-bold', 'solar:share-bold', 'solar:users-group-rounded-bold'].map((s, i) => (
                                <ThemeIcon key={i} size="lg" radius="md" className="bg-[#0061FF]">
                                  <Icon icon={s} width={18} />
                                </ThemeIcon>
                              ))}
                            </Flex>
                            <Box className="p-3 bg-gray-50 rounded-lg border border-[#E2E8F0] flex justify-between items-center">
                              <Text size="xs" fw={600} className="truncate pr-4 text-gray-500">kolektix.com/e/concert-2026...</Text>
                              <Button size="compact-xs" className="bg-[#0061FF] text-[10px] font-bold">Salin Link</Button>
                            </Box>
                          </Card>
                        )
                      },
                      {
                        title: 'Manfaatkan Fitur Broadcast',
                        desc: 'Kirimkan notifikasi langsung kepada pengikut atau calon pembeli tiket Anda melalui sistem Kolektix.',
                        visual: (
                          <Card radius="12px" p="md" className="border border-[#E2E8F0] bg-white mt-4 max-w-sm">
                            <Flex justify="space-between" mb="sm">
                              <Text fw={800} size="xs">Status Broadcast</Text>
                              <Text size="xs" color="green" fw={700}>Terkirim</Text>
                            </Flex>
                            <Grid gutter="xs" mb="md">
                              <Grid.Col span={6}>
                                <Box className="p-2 bg-blue-50 rounded-lg text-center">
                                  <Text size="xs" fw={800} className="text-[#0061FF]">2.5k</Text>
                                  <Text size="[8px]" className="text-gray-400 font-bold">Penerima</Text>
                                </Box>
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <Box className="p-2 bg-blue-50 rounded-lg text-center">
                                  <Text size="xs" fw={800} className="text-[#0061FF]">12%</Text>
                                  <Text size="[8px]" className="text-gray-400 font-bold">CTR</Text>
                                </Box>
                              </Grid.Col>
                            </Grid>
                            <Button fullWidth size="compact-sm" className="bg-[#0061FF]">Buat Pesan Baru</Button>
                          </Card>
                        )
                      },
                      {
                        title: 'Buat Kode Promo Menarik',
                        desc: 'Gunakan insentif harga seperti Early Bird atau Flash Sale untuk memicu keputusan pembelian yang cepat.',
                        visual: (
                          <Card radius="12px" p="md" className="border border-[#E2E8F0] bg-white mt-4 max-w-sm relative overflow-hidden">
                            <Box className="absolute top-0 right-0 w-12 h-12 bg-yellow-400 rotate-45 translate-x-6 -translate-y-6 flex items-end justify-center pb-1">
                               <Icon icon="solar:star-bold" className="text-white w-3 h-3" />
                            </Box>
                            <Stack gap={4}>
                              <Text size="xs" fw={800} color="gray">KODE PROMO AKTIF</Text>
                              <Box className="p-4 border-2 border-dashed border-[#0061FF] bg-blue-50/30 rounded-xl flex flex-col items-center gap-1">
                                <Text fw={900} size="xl" className="text-[#002147] tracking-widest">EARLYBIRD20</Text>
                                <Text size="xs" fw={700} className="text-[#0061FF]">Diskon 20% • Sisa 45 Slot</Text>
                              </Box>
                            </Stack>
                          </Card>
                        )
                      },
                      {
                        title: 'Pantau Performa secara Real-time',
                        desc: 'Analisis data kunjungan dan konversi tiket untuk menyesuaikan strategi promosi Anda di tengah jalan.',
                        visual: (
                          <Card radius="12px" p="md" className="border border-[#E2E8F0] bg-white mt-4 max-w-sm">
                             <Flex justify="space-between" align="end" mb="md" className="h-16">
                                {[40, 70, 45, 90, 60, 85].map((h, i) => (
                                   <Box key={i} className="w-4 bg-[#0061FF]/20 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                                      {i === 3 && <Box className="absolute inset-0 bg-[#0061FF] rounded-t-sm" />}
                                   </Box>
                                ))}
                             </Flex>
                             <Flex justify="space-between" align="center">
                                <Box>
                                   <Text size="xs" fw={800}>Performa Event</Text>
                                   <Text className="text-[10px] text-green-500 font-bold">+15.4% dari kemarin</Text>
                                </Box>
                                <Text size="xs" fw={800} className="text-[#0061FF] cursor-pointer">Lihat Laporan</Text>
                             </Flex>
                          </Card>
                        )
                      },
                    ].map((step, i) => (
                      <Box key={i} className="pb-16 last:pb-0 relative">
                        {/* Step Number Circle */}
                        <Box className="absolute -left-[45px] md:-left-[61px] top-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#0061FF] border-4 border-white shadow-md flex items-center justify-center text-white font-black text-xs md:text-sm z-10">
                          {i + 1}
                        </Box>
                        
                        <Stack gap={8}>
                          <Text fw={900} size="lg" className="text-[#002147] leading-tight">{step.title}</Text>
                          <Text size="sm" className="text-gray-500 font-medium leading-relaxed max-w-xl">
                            {step.desc}
                          </Text>
                          {step.visual}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Footer Note */}
                <Card radius="12px" p="xl" className="bg-[#F8FAFF] border border-[#E2E8F0] mt-8">
                  <Flex gap="md" align="start">
                    <ThemeIcon size="lg" radius="md" className="bg-[#0061FF]">
                      <Icon icon="solar:info-circle-bold" width={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={800} size="md" className="text-[#002147] mb-1">Catatan</Text>
                      <Text size="sm" className="text-gray-500 font-medium leading-relaxed">
                        Keberhasilan promosi sangat bergantung pada kualitas konten visual dan konsistensi publikasi. Pastikan gambar banner event Anda menarik dan deskripsi event informatif sebelum memulai kampanye berbayar.
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              </Stack>
            </Grid.Col>

            {/* RIGHT COLUMN: SIDEBAR */}
            <Grid.Col span={isMobile ? 12 : 4}>
              <Stack gap={24} className={isMobile ? '' : 'sticky top-[100px]'}>
                
                {/* FAQ Card */}
                <Card radius="12px" p="xl" className="border border-[#E2E8F0] shadow-sm bg-white">
                  <Title order={3} size="20px" mb="xl" className="text-[#002147] font-black">Butuh Bantuan?</Title>
                  <Accordion 
                    variant="separated" 
                    defaultValue={faqData[0].q}
                    styles={{
                      item: { border: 'none', background: 'transparent', marginBottom: '8px' },
                      control: { padding: '12px 0', '&:hover': { background: 'transparent' } },
                      content: { padding: '0 0 16px 0', borderBottom: '1px solid #E2E8F0' },
                      label: { fontSize: '14px', fontWeight: 800, color: '#002147' },
                      chevron: { color: '#0061FF' }
                    }}
                  >
                    {faqData.map((item) => (
                      <Accordion.Item key={item.q} value={item.q}>
                        <Accordion.Control>{item.q}</Accordion.Control>
                        <Accordion.Panel>
                          <Text size="sm" className="text-gray-500 font-medium leading-relaxed">{item.a}</Text>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>

                {/* Support Card */}
                <Card radius="12px" p="xl" className="border border-[#E2E8F0] shadow-sm bg-white">
                  <Title order={3} size="18px" mb="sm" className="text-[#002147] font-black">Masih butuh bantuan?</Title>
                  <Text size="sm" color="gray" mb="xl" className="font-medium">Tim support kami siap membantu strategi promosi Anda.</Text>
                  <Button 
                    fullWidth 
                    variant="outline" 
                    size="md" 
                    radius="8px"
                    className="!border-[#0061FF] !text-[#0061FF] font-black hover:bg-blue-50 transition-all"
                    leftSection={<Icon icon="solar:headphones-round-bold" width={20} />}
                  >
                    Hubungi Support
                  </Button>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>

          {/* --- 5. FEEDBACK FOOTER --- */}
          <Divider color="#E2E8F0" my="xl" />
          <Flex direction={isMobile ? 'column' : 'row'} justify="space-between" align="center" gap="lg" className="pb-12">
             <Text fw={800} size="lg" className="text-[#002147]">Apakah halaman ini membantu?</Text>
             <Flex gap="md" className="w-full md:w-auto">
                <Button 
                  variant="outline" 
                  radius="8px" 
                  className="flex-1 md:flex-none !border-[#E2E8F0] !text-gray-400 font-bold hover:bg-gray-50"
                >
                  Tidak membantu
                </Button>
                <Button 
                  variant="outline" 
                  radius="8px" 
                  className="flex-1 md:flex-none !border-[#E2E8F0] !text-gray-400 font-bold hover:bg-gray-50"
                >
                  Membantu
                </Button>
             </Flex>
          </Flex>

        </Stack>
      </Container>

      {/* --- PLATFORM FOOTER --- */}
      <Footer />

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Prevent black outlines strictly */
        *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        button, a {
          -webkit-tap-highlight-color: transparent;
        }

        .mantine-Accordion-item {
          border-radius: 12px !important;
        }
      `}</style>
    </Box>
  );
};

export default CaraMempromosikanEvent;
