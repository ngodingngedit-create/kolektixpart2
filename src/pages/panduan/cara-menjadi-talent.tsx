import React from 'react';
import { Container, Title, Text, Box, Stack, Grid, Card, Flex, ThemeIcon, Button, Divider, Accordion, Alert } from '@mantine/core';
import { Icon } from '@iconify/react';
import Head from 'next/head';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import LogoWhite from '@images/logo-creator-white.png';
import Footer from '@/components/FooterComponent';

const faqData = [
  { q: 'Siapa saja yang bisa menjadi talent?', a: 'Siapa pun yang memiliki keahlian di bidang hiburan, seni, atau jasa profesional lainnya dapat mendaftar sebagai talent di Kolektix.' },
  { q: 'Apakah saya harus membayar untuk mendaftar?', a: 'Tidak, pendaftaran sebagai talent di Kolektix sepenuhnya gratis. Kami tidak memungut biaya pendaftaran apa pun.' },
  { q: 'Berapa lama proses verifikasi akun talent?', a: 'Proses verifikasi biasanya memakan waktu 1-3 hari kerja setelah Anda melengkapi profil dan mengirimkan portofolio.' },
  { q: 'Bagaimana jika lamaran saya ditolak?', a: 'Jika profil Anda belum disetujui, tim kami akan memberikan alasan dan saran perbaikan melalui email. Anda dapat memperbarui profil dan mengajukan kembali.' },
  { q: 'Apa saja yang dinilai dari portofolio talent?', a: 'Kualitas karya, kelengkapan informasi, pengalaman sebelumnya, dan kejelasan media (foto/video) yang diunggah menjadi poin utama penilaian kami.' },
];

const CaraMenjadiTalent = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Box className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Head>
        <title>Cara Menjadi Talent | Kolektix Guide</title>
        <meta name="description" content="Panduan lengkap cara mendaftar dan menjadi talent profesional di platform Kolektix." />
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
            <div className="absolute top-3 md:top-6 right-3 md:right-8 flex items-center gap-1 md:gap-2 bg-[#194E9E] backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-sm border border-white/40 z-20">
              <Icon icon="solar:calendar-outline" width={10} className="text-white md:w-[14px]" />
              <div className="text-[7px] md:text-[11px] font-semibold text-white uppercase tracking-wider">Terakhir diperbarui: 14 Januari 2026</div>
            </div>

            <Grid gutter={0} align="center">
              <Grid.Col span={isMobile ? 12 : 7} p={isMobile ? 32 : 48}>
                <Stack gap={24}>
                  <Box>
                    <div className="text-[20px] md:text-[44px] font-extrabold text-[#194E9E] leading-tight">
                      Cara Menjadi Talent
                    </div>
                    <div className="text-sm md:text-lg text-gray-600 mt-3 md:mt-4 max-w-lg leading-relaxed">
                      Pelajari cara mendaftar dan menjadi talent di Kolektix untuk mendapatkan kesempatan tampil di berbagai event bergengsi.
                    </div>
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>



          {/* --- 3. MAIN CONTENT GRID --- */}
          <Grid gutter={40}>
            <Grid.Col span={isMobile ? 12 : 8}>
              <Stack gap={40}>

                {/* SECTION: STEPS */}
                <Box>
                  <Flex align="center" gap={isMobile ? 8 : 12} className={isMobile ? 'mb-4' : 'mb-6'}>
                    <ThemeIcon size={isMobile ? 24 : 32} radius="xl" color="blue" className="bg-[#194E9E]">
                      <Text size={isMobile ? 'xs' : 'sm'} fw={700}>1</Text>
                    </ThemeIcon>
                    <Title order={2} size={isMobile ? '16px' : 'h3'} className="text-[#194E9E] font-bold">
                      Langkah Menjadi Talent
                    </Title>
                  </Flex>

                  <Card radius="12px" padding={isMobile ? 'lg' : 'xl'} className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200 bg-white">
                    <Grid gutter={isMobile ? 32 : 48}>
                      <Grid.Col span={isMobile ? 12 : 7}>
                        <Stack gap={0} className="relative pl-12">
                          <Box className="absolute left-[19px] top-8 bottom-8 w-[1px] bg-[#0061FF]/20 z-0" />

                          {[
                            { title: 'Daftar / Login ke Kolektix', icon: 'solar:user-circle-bold', desc: 'Masuk ke akun Kolektix Anda. Jika belum memiliki akun, lakukan pendaftaran terlebih dahulu menggunakan Email atau Social Media.' },
                            { title: 'Lengkapi Profil Talent', icon: 'solar:pen-new-square-bold', desc: 'Isi informasi diri, kategori keahlian, bio, pengalaman, dan media pendukung untuk memperkenalkan diri Anda kepada penyelenggara event.' },
                            { title: 'Verifikasi Akun', icon: 'solar:shield-check-bold', desc: 'Tim Kolektix akan memverifikasi informasi yang Anda berikan untuk memastikan keaslian dan kelayakan akun talent Anda.' },
                            { title: 'Kirim Portofolio', icon: 'solar:gallery-bold', desc: 'Unggah portofolio terbaik Anda seperti foto, video, audio, atau link media sosial untuk ditinjau oleh penyelenggara event.' },
                            { title: 'Tunggu Persetujuan', icon: 'solar:clock-circle-bold', desc: 'Setelah disetujui, profil Anda akan terlihat oleh penyelenggara event dan Anda bisa mulai mendapatkan kesempatan tampil.' },
                          ].map((step, i) => (
                            <Box key={step.title} className={`${isMobile ? 'pb-8' : 'pb-12'} last:pb-0 relative`}>
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
                                    <Icon icon={step.icon} className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
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

                      {/* Visual Mockups Column */}
                      {!isMobile && (
                        <Grid.Col span={5}>
                          <Stack gap={32} className="sticky top-25">
                            {/* Mockup 1: Social Login */}
                            <Box className="bg-gray-50 rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e4e4e7' }}>
                              <Text size="xs" fw={700} className="text-[#194E9E] mb-4 text-center">Masuk ke Kolektix</Text>
                              <Stack gap="xs">
                                <Button fullWidth variant="default" size="xs" leftSection={<Icon icon="logos:google-icon" width={14} />}>Google</Button>
                                <Button fullWidth variant="default" size="xs" leftSection={<Icon icon="logos:facebook" width={14} />}>Facebook</Button>
                                <Button fullWidth variant="default" size="xs" leftSection={<Icon icon="solar:letter-bold" className="text-gray-400 w-3.5 h-3.5" />}>Email</Button>
                              </Stack>
                              <Text size="10px" className="text-center text-gray-400 mt-4">Belum punya akun? <span className="text-blue-500 font-bold">Daftar sekarang</span></Text>
                            </Box>

                            {/* Mockup 2: Profile Form */}
                            <Box className="bg-gray-50 rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e4e4e7' }}>
                              <Text size="xs" fw={700} className="text-[#194E9E] mb-4">Profil Talent</Text>
                              <Flex align="center" gap="sm" mb="md">
                                <Box className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Icon icon="solar:user-bold" className="text-blue-500 w-6 h-6" />
                                </Box>
                                <Stack gap={2} flex={1}>
                                  <Box className="h-2 w-full bg-gray-200 rounded-full" />
                                  <Box className="h-2 w-2/3 bg-gray-100 rounded-full" />
                                </Stack>
                              </Flex>
                              <Box className="h-6 w-full bg-blue-500 rounded-md mb-2" />
                            </Box>

                            {/* Mockup 3: Verification */}
                            <Box className="bg-white rounded-2xl p-6 border shadow-lg relative overflow-hidden" style={{ borderColor: '#e4e4e7' }}>
                              <Box className="absolute top-0 left-0 w-1 bg-blue-500 h-full" />
                              <Flex align="center" gap="md">
                                <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                                  <Icon icon="solar:shield-check-bold" className="w-6 h-6" />
                                </ThemeIcon>
                                <Box>
                                  <Text fw={700} size="xs" className="text-blue-700">Verifikasi Akun</Text>
                                  <Text size="10px" className="text-blue-500">Sedang diverifikasi</Text>
                                </Box>
                              </Flex>
                            </Box>
                          </Stack>
                        </Grid.Col>
                      )}
                    </Grid>
                  </Card>

                  {/* Footer Note */}
                  <Card mt="xl" radius="lg" className="bg-blue-50 border border-blue-100 p-6">
                    <Flex gap="md" align="start">
                      <ThemeIcon color="blue" radius="xl" size="lg">
                        <Icon icon="solar:info-circle-bold" width={20} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} size="sm" className="text-[#194E9E]">Catatan Penting</Text>
                        <Text size="xs" className="text-gray-600 mt-1 leading-relaxed">
                          Pastikan semua informasi yang Anda berikan benar dan portofolio yang diunggah mencerminkan kemampuan terbaik Anda. Data yang tidak valid dapat menyebabkan penolakan akun.
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Box>
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
                      <div className="text-sm text-gray-500 mb-6 pl-2 pr-1 leading-relaxed">Temukan jawaban untuk pertanyaan yang sering diajukan seputar menjadi talent.</div>
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
          border-color: #E5E7EB !important;
        }
      `}</style>
    </Box>
  );
};

export default CaraMenjadiTalent;
