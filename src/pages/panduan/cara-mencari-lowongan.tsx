import React from 'react';
import { Container, Title, Text, Box, Stack, Grid, Card, Flex, ThemeIcon, Button, Divider, Accordion } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import LogoWhite from '@images/logo-creator-white.png';
import Footer from '@/components/FooterComponent';

const faqData = [
  { q: 'Berapa lama menunggu balasan klien?', a: 'Waktu respon bervariasi tergantung pada klien, namun biasanya memakan waktu 2-5 hari kerja. Pastikan notifikasi Anda aktif.' },
  { q: 'Apakah melamar lowongan dipungut biaya?', a: 'Tidak, melamar lowongan di Kolektix sepenuhnya gratis bagi talenta. Kami tidak pernah memungut biaya administrasi saat melamar.' },
  { q: 'Bagaimana cara membatalkan lamaran?', a: 'Anda dapat membatalkan lamaran melalui dashboard "Lamaran Saya" selama statusnya masih "Pending" atau belum diproses oleh klien.' },
  { q: 'Apa itu \'Verified Talent\'?', a: 'Verified Talent adalah status khusus untuk talenta yang telah divalidasi identitas dan portofolionya oleh tim Kolektix, memberikan kepercayaan ekstra bagi klien.' },
  { q: 'Bagaimana cara meningkatkan peluang diterima?', a: 'Pastikan profil Anda lengkap 100%, miliki portofolio yang relevan, dan kirimkan pesan penawaran yang personal serta menarik bagi klien.' },
];

const CaraMencariLowongan = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Box className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Head>
        <title>Cara Mencari Lowongan | Kolektix Guide</title>
        <meta name="description" content="Panduan lengkap cara mencari dan melamar lowongan pekerjaan sebagai talenta di Kolektix." />
      </Head>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <Container size="91%" className="pt-24 pb-12 px-2 md:px-12 lg:px-20 xl:px-32">
        <Stack gap={48}>

          {/* --- 1. HERO SECTION --- */}
          <Card
            radius="20px"
            p={0}
            className="overflow-hidden border-none relative"
            style={{ backgroundColor: 'rgba(0, 97, 255, 0.05)' }}
          >
            {/* Last Updated Label */}
            <div className="absolute top-3 md:top-6 right-3 md:right-8 flex items-center gap-1 md:gap-2 bg-[#194E9E] backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-sm border border-white/40 z-20">
              <Icon icon="solar:calendar-outline" width={10} className="text-white md:w-[14px]" />
              <div className="text-[7px] md:text-[11px] font-semibold text-white ">Terakhir diperbarui: 15 Mei 2026</div>
            </div>

            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 48}>
                <Stack gap={24}>
                  <Box>
                    <div className="text-[20px] md:text-[44px] font-extrabold text-[#194E9E] leading-tight">
                      Cara Mencari Lowongan
                    </div>
                    <div className="text-sm md:text-lg text-gray-600 mt-3 md:mt-4 max-w-lg leading-relaxed">
                      Temukan peluang kerja terbaik yang sesuai dengan keahlian dan minat Anda di Kolektix.
                    </div>
                  </Box>
                </Stack>
              </Grid.Col>

            </Grid>
          </Card>



          {/* --- 3. MAIN CONTENT GRID --- */}
          <Grid gutter={40}>
            {/* LEFT COLUMN: CONTENT */}
            <Grid.Col span={isMobile ? 12 : 8}>
              <Stack gap={40}>

                {/* SECTION 1: PREPARATION */}
                <Box>
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>1</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#194E9E] font-bold">
                      Persiapan Sebelum Mencari
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white overflow-hidden relative">
                    <Box className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8" />
                    <Stack gap={20}>
                      <div className="text-gray-600 leading-relaxed pl-1 z-10">
                        Pastikan profil Anda siap menarik perhatian klien dengan langkah-langkah berikut:
                      </div>

                      <Stack gap="md">
                        {[
                          'Profil sudah 100% lengkap (Foto, Bio, dan Skill).',
                          'Portofolio terbaru sudah diunggah.',
                          'Dokumen pendukung (CV/Sertifikat) siap.',
                          'Layanan & Harga sudah diatur.'
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border" style={{ borderColor: '#e4e4e7' }}>
                            <ThemeIcon size={24} radius="xl" color="green" variant="light">
                              <Icon icon="solar:check-read-linear" width={16} />
                            </ThemeIcon>
                            <Text size="sm" fw={600} className="text-[#194E9E]">{item}</Text>
                          </div>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                </Box>

                {/* SECTION 2: STEPS */}
                <Box>
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>2</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#194E9E] font-bold">
                      Langkah Mencari & Melamar
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Grid gutter={isMobile ? 32 : 48}>
                      <Grid.Col span={isMobile ? 12 : 7}>
                        <Stack gap={0} className={`relative ${isMobile ? 'pl-9' : 'pl-12'}`}>
                          {/* Connecting Line */}
                          <Box className={`absolute ${isMobile ? 'left-[14px]' : 'left-[19px]'} top-8 bottom-8 w-[1px] bg-[#0061FF]/20 z-0`} />

                          {[
                            { title: 'Masuk ke Menu Talenta', icon: 'solar:users-group-rounded-bold-duotone', desc: 'Navigasi ke halaman cari lowongan melalui dashboard atau menu navigasi utama.' },
                            { title: 'Gunakan Filter', icon: 'solar:filter-bold-duotone', desc: 'Saring lowongan berdasarkan kategori keahlian, lokasi, dan range budget yang diinginkan.' },
                            { title: 'Baca Detail Pekerjaan', icon: 'solar:document-text-bold-duotone', desc: 'Pahami deskripsi pekerjaan, kualifikasi, dan kebutuhan spesifik yang diminta oleh klien.' },
                            { title: 'Klik Ajukan Lamaran', icon: 'solar:pen-new-square-bold-duotone', desc: 'Masukkan pesan penawaran yang personal dan profesional untuk menarik minat klien.' },
                            { title: 'Konfirmasi Detail', icon: 'solar:checklist-bold-duotone', desc: 'Periksa kembali jadwal pelaksanaan, harga penawaran, dan lampiran pendukung lainnya.' },
                            { title: 'Kirim Penawaran', icon: 'solar:send-square-bold-duotone', desc: 'Tekan tombol kirim untuk melamar secara resmi. Lamaran Anda akan masuk ke daftar review klien.' },
                          ].map((step, i) => (
                            <Box key={step.title} className="pb-10 last:pb-0 relative">
                              {/* Step Number */}
                              <Box
                                className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} rounded-full bg-[#194E9E] flex items-center justify-center text-white font-bold ${isMobile ? 'text-[10px]' : 'text-sm'} shadow-lg absolute ${isMobile ? 'left-[-35px]' : 'left-[-48px]'} z-10 ${isMobile ? 'top-0.5' : 'top-0'}`}
                              >
                                {i + 1}
                              </Box>

                              <Stack gap={0}>
                                <Flex align="center" gap={isMobile ? 12 : 20}>
                                  {/* Icon Box */}
                                  <Box className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-blue-50 flex items-center justify-center text-[#0061FF] shadow-sm shrink-0`}>
                                    <Icon icon={step.icon} width={isMobile ? 16 : 20} />
                                  </Box>

                                  {/* Title */}
                                  <Text fw={700} size={isMobile ? 'sm' : 'lg'} className="text-[#194E9E] leading-tight">
                                    {step.title}
                                  </Text>
                                </Flex>

                                {/* Description */}
                                <Box className={`${isMobile ? 'pl-[44px]' : 'pl-[60px]'} mt-1`}>
                                  <div className={`${isMobile ? 'text-[10px]' : 'text-sm'} text-gray-500 leading-relaxed`}>
                                    {step.desc}
                                  </div>
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </Grid.Col>

                      {/* Job Dashboard Mockup Column */}
                      {!isMobile && (
                        <Grid.Col span={5}>
                          <Box className="sticky top-24">
                            <Box className="bg-[#194E9E] rounded-[24px] p-6 shadow-2xl relative overflow-hidden h-[540px]">
                              {/* Navbar Mockup */}
                              <Flex justify="space-between" align="center" mb="xl">
                                <Image src={LogoWhite} alt="logo" width={60} height={18} />
                                <ThemeIcon radius="xl" color="gray" variant="light" size="sm">
                                  <Icon icon="solar:user-bold" />
                                </ThemeIcon>
                              </Flex>

                              {/* Dashboard Layout Mockup */}
                              <Grid gutter="xs">
                                {/* Sidebar Filter */}
                                <Grid.Col span={4}>
                                  <Stack gap="xs">
                                    <Box className="bg-white/10 p-2 rounded-lg border border-white/10">
                                      <Box className="h-1.5 w-full bg-white/30 rounded-full mb-2" />
                                      <Box className="h-1.5 w-3/4 bg-white/20 rounded-full" />
                                    </Box>
                                    <Box className="p-2 rounded-lg opacity-50">
                                      <Box className="h-1.5 w-full bg-white/20 rounded-full mb-2" />
                                      <Box className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                                    </Box>
                                  </Stack>
                                </Grid.Col>

                                {/* Main Job List */}
                                <Grid.Col span={8}>
                                  <Stack gap="xs">
                                    {[1, 2, 3].map((i) => (
                                      <Box key={i} className="bg-white rounded-xl p-3 shadow-lg">
                                        <Flex justify="space-between" align="start" mb="xs">
                                          <Box className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Icon icon="solar:case-bold" className="text-blue-500" width={16} />
                                          </Box>
                                          <Box className="h-4 w-12 bg-blue-50 rounded text-[8px] flex items-center justify-center text-blue-500 font-bold">NEW</Box>
                                        </Flex>
                                        <Box className="h-2 w-3/4 bg-gray-100 rounded-full mb-2" />
                                        <Box className="h-1.5 w-1/2 bg-gray-50 rounded-full mb-3" />
                                        <Button fullWidth color="blue" size="compact-xs" radius="sm">Lamar Sekarang</Button>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Grid.Col>
                              </Grid>

                              {/* Floating Glow */}
                              <Box className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#0061FF]/20 blur-[60px] rounded-full" />
                            </Box>

                            <Card mt="xl" radius="lg" className="bg-blue-50 border border-blue-100 p-6">
                              <Flex gap="md" align="start">
                                <ThemeIcon color="blue" radius="xl" size="lg">
                                  <Icon icon="solar:lightbulb-bold" width={20} />
                                </ThemeIcon>
                                <Box>
                                  <Text fw={700} size="sm" className="text-[#194E9E]">Tips Sukses</Text>
                                  <Text size="xs" className="text-gray-600 mt-1 leading-relaxed">
                                    Pastikan profil Anda terlihat profesional untuk meningkatkan peluang diterima oleh klien.
                                  </Text>
                                </Box>
                              </Flex>
                            </Card>
                          </Box>
                        </Grid.Col>
                      )}
                    </Grid>
                  </Card>
                </Box>

                {/* Mobile Post-Publish Note */}
                {isMobile && (
                  <Card radius="lg" className="bg-blue-50 border border-blue-100 p-6">
                    <Flex gap="md" align="start">
                      <ThemeIcon color="blue" radius="xl" size="lg">
                        <Icon icon="solar:lightbulb-bold" width={20} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} size="sm" className="text-[#194E9E]">Tips Sukses</Text>
                        <Text size="xs" className="text-gray-600 mt-1 leading-relaxed">
                          Pastikan profil Anda terlihat profesional untuk meningkatkan peluang diterima oleh klien.
                          Update portofolio secara berkala dengan karya-karya terbaik Anda.
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
                  label: { fontSize: '18px', fontWeight: 700, color: '#194E9E' },
                  content: { padding: '0 16px 20px 16px' }
                }}>

                  {/* FAQ Section */}
                  <Accordion.Item value="faq">
                    <Accordion.Control>Butuh Bantuan?</Accordion.Control>
                    <Accordion.Panel>
                      <div className="text-sm text-gray-500 mb-6 pl-2 pr-1 leading-relaxed">Temukan jawaban untuk pertanyaan seputar mencari lowongan.</div>
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
                        className="!border-[#0061FF] !text-[#0061FF] font-bold bg-white hover:bg-blue-50 transition-colors"
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

export default CaraMencariLowongan;
