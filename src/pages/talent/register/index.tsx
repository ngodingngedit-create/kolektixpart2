import { useState, useEffect } from 'react';
import {
  Container,
  Text,
  Flex,
  Stack,
  Button,
  Breadcrumbs,
  Anchor,
  Box,
  SimpleGrid,
  Card,
  Avatar,
  Divider,
  ActionIcon,
  Group,
  Transition,
  useMantineTheme,
  TextInput,
  Textarea,
  MultiSelect,
  Select,
  FileInput,
  Input,
  Tooltip,
  RingProgress,
  Accordion,
  Badge
} from '@mantine/core';
import { Icon } from '@iconify/react';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import Head from 'next/head';
import InformasiDasar from '@/components/TalentRegistration/InformasiDasar';
import Portfolio from '@/components/TalentRegistration/Portfolio';
import LayananHarga from '@/components/TalentRegistration/LayananHarga';

const STEPS = [
  { label: 'Pilih Jenis Talenta', icon: 'solar:user-broken' },
  { label: 'Informasi Dasar', icon: 'solar:pen-new-square-broken' },
  { label: 'Portfolio', icon: 'solar:gallery-broken' },
  { label: 'Layanan & Harga', icon: 'solar:wad-of-money-broken' },
  { label: 'Review & Publish', icon: 'solar:upload-track-broken' },
];

const CATEGORIES = [
  {
    id: 'photographer',
    title: 'Photographer',
    desc: 'Abadikan momen terbaik dalam setiap event.',
    icon: 'solar:camera-broken',
    color: 'blue'
  },
  {
    id: 'videographer',
    title: 'Videographer',
    desc: 'Ciptakan video berkualitas untuk berbagai event.',
    icon: 'solar:videocamera-record-broken',
    color: 'green'
  },
  {
    id: 'sound',
    title: 'Sound Engineer',
    desc: 'Ahli dalam tata suara dan audio event.',
    icon: 'solar:music-library-broken',
    color: 'violet'
  },
  {
    id: 'lighting',
    title: 'Lighting Designer',
    desc: 'Ciptakan pencahayaan yang memukau.',
    icon: 'solar:lightbulb-broken',
    color: 'yellow'
  },
];

const BENEFITS = [
  { label: 'Terpercaya', icon: 'solar:shield-check-bold', desc: 'Verifikasi talenta untuk keamanan dan kualitas layanan.', color: '#1971c2' },
  { label: 'Peluang Luas', icon: 'solar:users-group-rounded-bold', desc: 'Dapatkan proyek dari berbagai event di seluruh Indonesia.', color: '#2b8a3e' },
  { label: 'Tingkatkan Karir', icon: 'solar:star-bold', desc: 'Bangun reputasi dan tingkatkan rating Anda.', color: '#e67700' },
  { label: 'Pembayaran Aman', icon: 'solar:wallet-money-bold', desc: 'Dapatkan pembayaran aman dan tepat waktu.', color: '#5f3dc4' },
  { label: 'Dapat Asuransi', icon: 'solar:shield-star-bold', desc: 'Setiap proyek yang dikerjakan dilindungi asuransi.', color: '#0b7285', isNew: true },
];

interface FormData {
  category: string;
  fullName: string;
  email: string;
  brandName: string;
  dob: string;
  location: string;
  languages: string[];
  bio: string;
  phone: string;
  profilePhoto: string | null;
  bannerPhoto: string | null;
}

const initialData: FormData = {
  category: 'photographer',
  fullName: '',
  email: '',
  brandName: '',
  dob: '',
  location: '',
  languages: ['Indonesian', 'English'],
  bio: '',
  phone: '',
  profilePhoto: null,
  bannerPhoto: null,
};

export default function TalentRegistrationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [savedData, setSavedData] = useState<FormData>(initialData);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const theme = useMantineTheme();

  const isStepValid = (step: number) => {
    if (step === 0) return !!formData.category;
    if (step === 1) {
      return (
        !!formData.fullName &&
        !!formData.email &&
        !!formData.dob &&
        !!formData.location &&
        formData.languages.length > 0 &&
        !!formData.bio &&
        !!formData.phone &&
        !!formData.profilePhoto &&
        !!formData.bannerPhoto
      );
    }
    return true; // Other steps not implemented yet
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setSavedData({ ...formData });
      if (activeStep < STEPS.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleTabClick = (idx: number) => {
    // Only allow clicking steps that are already completed or the very next one if current is valid
    if (idx <= activeStep || (idx === activeStep + 1 && isStepValid(activeStep))) {
      setActiveStep(idx);
    }
  };

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <Box bg="#F8F9FA" mih="100vh" pos="relative" pb={100}>
      <Head>
        <title>Daftar Talenta | Kolektix</title>
      </Head>

      <Container size="xl" pt={80} pb={40}>
        <Breadcrumbs mb={30} separator=">">
          <Anchor href="/" c="#0B387C" size="sm" style={{ textDecoration: 'none', fontWeight: 500 }}>Beranda</Anchor>
          <Anchor href="/talent" c="#0B387C" size="sm" style={{ textDecoration: 'none', fontWeight: 500 }}>Talenta</Anchor>
          <Text size="sm" c="gray.6" fw={500}>Daftar Talenta</Text>
        </Breadcrumbs>

        <Flex justify="space-between" align="center" mb={15} direction={isMobile ? 'column' : 'row'}>
          <Stack gap={10} flex={1}>
            <Flex align="center" gap={15}>
              <Text size="1.8rem" fw={800} c="dark" style={{ marginTop: 10 }}>Daftar Talenta</Text>
            </Flex>
            <Text c="dimmed" size="lg" maw={500}>
              Daftarkan diri Anda sebagai talenta profesional
            </Text>
          </Stack>
        </Flex>

        <Flex gap={20} direction={isMobile ? 'column' : 'row'} align="flex-start">
          <Box flex={1} w="100%">
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Stack gap={30}>
                <Box
                  mb={30}
                  style={{
                    borderBottom: '1px solid #EEE',
                    overflowX: isMobile ? 'auto' : 'visible'
                  }}
                >
                  <Flex gap={40} style={{ minWidth: isMobile ? 600 : 'auto' }}>
                    {STEPS.map((step, idx) => {
                      const isActive = idx === activeStep;
                      const isValid = idx < activeStep || (idx === activeStep && isStepValid(idx));
                      const isClickable = idx <= activeStep || (idx === activeStep + 1 && isStepValid(activeStep));

                      return (
                        <Box
                          key={idx}
                          pb={15}
                          pos="relative"
                          style={{
                            cursor: isClickable ? 'pointer' : 'not-allowed',
                            borderBottom: isActive ? '3px solid #0B387C' : '3px solid transparent',
                            transition: 'all 0.2s ease',
                            opacity: isClickable ? 1 : 0.5
                          }}
                          onClick={() => handleTabClick(idx)}
                        >
                          <Flex align="center" gap={10}>
                            <Icon
                              icon={step.icon}
                              width={22}
                              color={isActive ? '#0B387C' : '#555'}
                            />
                            <Text
                              fw={600}
                              size="sm"
                              c={isActive ? '#0B387C' : '#555'}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              {step.label}
                            </Text>
                          </Flex>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
                <Box>
                  <Text size="xl" fw={700} mb={5}>
                    {STEPS[activeStep].label}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {activeStep === 0
                      ? 'Pilih kategori yang paling sesuai dengan keahlian utama Anda.'
                      : activeStep === 1
                      ? 'Lengkapi informasi profil Anda dengan data yang benar.'
                      : activeStep === 2
                      ? 'Tampilkan hasil karya terbaik Anda. Portofolio yang menarik akan meningkatkan peluang Anda mendapatkan proyek.'
                      : 'Tawarkan layanan yang Anda sediakan beserta paket harga agar klien dapat mengetahui pilihan dan menyesuaikan kebutuhan mereka.'}
                  </Text>
                </Box>

                {activeStep === 0 && (
                  <>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                      {CATEGORIES.map((cat) => (
                        <Card
                          key={cat.id}
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            cursor: 'pointer',
                            borderColor: formData.category === cat.id ? '#0B387C' : theme.colors.gray[3],
                            borderWidth: formData.category === cat.id ? 2 : 1,
                            backgroundColor: formData.category === cat.id ? '#F0F7FF' : 'white',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => updateFormData({ category: cat.id })}
                        >
                          <Box pos="absolute" top={10} right={10}>
                            {formData.category === cat.id && (
                              <Icon icon="solar:check-circle-bold" color="#0B387C" width={20} />
                            )}
                          </Box>
                          <Stack align="center" gap={10} style={{ textAlign: 'center' }}>
                            <Box p={12} bg={`${cat.color}.0`} style={{ borderRadius: '50%' }}>
                              <Icon icon={cat.icon} width={32} color={theme.colors[cat.color][6]} />
                            </Box>
                            <Text fw={700} size="md">{cat.title}</Text>
                            <Text size="xs" c="dimmed">{cat.desc}</Text>
                          </Stack>
                        </Card>
                      ))}
                    </SimpleGrid>

                    <Box bg="#F0F7FF" p="md" style={{ borderRadius: 12, borderLeft: '4px solid #0B387C' }}>
                      <Flex gap="sm">
                        <Icon icon="solar:info-circle-bold" color="#0B387C" width={24} />
                        <Stack gap={2}>
                          <Text fw={700} size="sm" c="#0B387C">Pilih dengan tepat</Text>
                          <Text size="xs" c="dimmed">
                            Pilih kategori yang paling sesuai dengan keahlian utama Anda. Anda masih bisa menambahkan layanan lainnya nanti.
                          </Text>
                        </Stack>
                      </Flex>
                    </Box>
                  </>
                )}

                {activeStep === 1 && (
                  <InformasiDasar
                    isMobile={!!isMobile}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {activeStep === 2 && (
                  <Portfolio
                    isMobile={!!isMobile}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {activeStep === 3 && (
                  <LayananHarga
                    isMobile={!!isMobile}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
              </Stack>
            </Card>

            {!isMobile ? (
              <Card padding="xl" radius="lg" withBorder shadow="sm" mt={20}>
                <Text fw={700} size="lg" mb={20}>Keuntungan Bergabung di Kolektix Talenta</Text>
                <SimpleGrid cols={5} spacing="md">
                  {BENEFITS.map((benefit, idx) => (
                    <Flex key={idx} gap="xs" align="center">
                      <Box p={8} bg="gray.0" style={{ borderRadius: 10, flexShrink: 0 }}>
                        <Icon icon={benefit.icon} color={benefit.color} width={20} />
                      </Box>
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Text fw={700} size="11px" style={{ lineHeight: 1.2 }}>{benefit.label}</Text>
                        <Text size="10px" c="dimmed" lineClamp={2} style={{ lineHeight: 1.2 }}>{benefit.desc}</Text>
                      </Stack>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Card>
            ) : (
              <Accordion variant="separated" radius="lg" mt={20}>
                <Accordion.Item value="benefits" style={{ backgroundColor: 'white', border: '1px solid #EEE' }}>
                  <Accordion.Control >
                    <Text fw={700} size="sm">Keuntungan Bergabung di Kolektix Talenta</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md" pt="xs">
                      {BENEFITS.map((benefit, idx) => (
                        <Flex key={idx} gap="sm" align="center">
                          <Box p={8} bg="gray.0" style={{ borderRadius: 10, flexShrink: 0 }}>
                            <Icon icon={benefit.icon} color={benefit.color} width={20} />
                          </Box>
                          <Stack gap={2}>
                            <Text fw={700} size="xs">{benefit.label}</Text>
                            <Text size="xs" c="dimmed">{benefit.desc}</Text>
                          </Stack>
                        </Flex>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}
          </Box>

          {!isMobile && (
            <Box w={500} style={{ position: 'sticky', top: 100 }}>
              <Card padding="xl" radius="lg" withBorder shadow="md">
                <Text fw={700} size="lg" mb={20}>Preview Profil Anda</Text>

                <Box pos="relative" mb={60}>
                  <Box
                    h={120}
                    style={{
                      borderRadius: 8,
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: savedData.bannerPhoto ? 'transparent' : '#F1F3F5'
                    }}
                  >
                    {savedData.bannerPhoto ? (
                      <Image
                        src={savedData.bannerPhoto}
                        alt="Preview Banner"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Flex h="100%" align="center" justify="center">
                        <Icon icon="solar:gallery-bold" width={40} color="#DEE2E6" />
                      </Flex>
                    )}
                  </Box>
                  <Avatar
                    size={80}
                    radius="xl"
                    bg="white"
                    pos="absolute"
                    bottom={-40}
                    left={20}
                    src={savedData.profilePhoto || undefined}
                    style={{ border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  >
                    {!savedData.profilePhoto && <Icon icon="solar:user-bold" width={40} color="gray" />}
                  </Avatar>
                </Box>

                <Stack gap={2} mb={25}>
                  <Text fw={800} size="lg">{savedData.fullName || 'Nama Anda'}</Text>
                  <Text size="sm" c="black" fw={600}>
                    {CATEGORIES.find(c => c.id === savedData.category)?.title || 'Talenta'}
                  </Text>
                </Stack>

                <Stack gap={20}>
                  <Box>
                    <Text size="xs" fw={800} c="dark" mb={8} style={{ textTransform: 'uppercase' }}>Tentang Saya</Text>
                    {savedData.bio ? (
                      <Text size="xs" c="dimmed" lineClamp={3}>{savedData.bio}</Text>
                    ) : (
                      <>
                        <Box bg="gray.1" h={8} w="100%" mb={8} style={{ borderRadius: 4 }} />
                        <Box bg="gray.1" h={8} w="100%" mb={8} style={{ borderRadius: 4 }} />
                        <Box bg="gray.1" h={8} w="80%" style={{ borderRadius: 4 }} />
                      </>
                    )}
                  </Box>

                  <Box>
                    <Text size="xs" fw={800} c="dark" mb={8} style={{ textTransform: 'uppercase' }}>Layanan</Text>
                    <Group gap={8}>
                      {activeStep >= 3 ? (
                        <>
                          <Badge variant="light" color="gray" size="sm" radius="md">Fotografi Event</Badge>
                          <Badge variant="light" color="gray" size="sm" radius="md">Videografi Event</Badge>
                          <Badge variant="light" color="gray" size="sm" radius="md">Editing Foto</Badge>
                        </>
                      ) : (
                        <>
                          <Box bg="gray.1" h={25} w={60} style={{ borderRadius: 6 }} />
                          <Box bg="gray.1" h={25} w={80} style={{ borderRadius: 6 }} />
                        </>
                      )}
                    </Group>
                  </Box>

                  <Divider />

                  <Box style={{ textAlign: 'right' }}>
                    <Text size="xs" c="dimmed" fw={700}>Mulai dari</Text>
                    <Text fw={800} size="lg">
                      {activeStep >= 3 ? 'Rp 1.500.000' : 'Rp 0'}{' '}
                      <Text span size="xs" fw={500} c="dimmed">/ paket</Text>
                    </Text>
                  </Box>
                </Stack>
              </Card>
            </Box>
          )}
        </Flex>
      </Container>

      <Box
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        p={isMobile ? 10 : 12}
        style={{
          borderTop: '1px solid #EEE',
          zIndex: 50,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Container size="xl">
          <Flex justify="space-between" align="center" gap="xs">
            <Flex align="center" gap={isMobile ? 8 : "md"}>
              <RingProgress
                size={isMobile ? 35 : 45}
                thickness={isMobile ? 2 : 3}
                roundCaps
                sections={[{ value: ((activeStep + 1) / STEPS.length) * 100, color: '#0B387C' }]}
                label={
                  <Text fw={800} size={isMobile ? "xs" : "sm"} c="#0B387C" ta="center">
                    {activeStep + 1}
                  </Text>
                }
              />
              <Stack gap={0}>
                <Text size={isMobile ? "8px" : "10px"} c="dimmed" fw={500}>Step {activeStep + 1} dari 5</Text>
                <Text fw={600} size={isMobile ? "9px" : "xs"} c="gray.7" lineClamp={1}>{STEPS[activeStep].label}</Text>
              </Stack>
            </Flex>

            <Flex gap={8} align="center">
              {activeStep > 0 && (
                <Button
                  variant="outline"
                  radius="md"
                  size={isMobile ? "xs" : "sm"}
                  h={isMobile ? 32 : 36}
                  style={{ borderColor: '#E9ECEF', color: '#000000', fontWeight: 600 }}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Kembali
                </Button>
              )}
              <Button
                variant="filled"
                color="#0B387C"
                radius="md"
                size={isMobile ? "xs" : "sm"}
                h={isMobile ? 32 : 36}
                disabled={!isStepValid(activeStep)}
                rightSection={!isMobile && <Icon icon="solar:arrow-right-broken" width={18} />}
                style={{ fontWeight: 600 }}
                onClick={handleNext}
              >
                {activeStep === STEPS.length - 1 ? 'Selesai' : 'Selanjutnya'}
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
