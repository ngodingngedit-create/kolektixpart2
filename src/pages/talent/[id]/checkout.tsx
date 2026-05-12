import { useState } from 'react';
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
  Breadcrumbs,
  Anchor,
  Box,
  Divider,
  Stepper,
  Title,
  TextInput,
  Select,
  Radio,
  Paper,
  Accordion,
} from '@mantine/core';
import { Icon } from '@iconify/react';

export default function TalentCheckout() {
  const router = useRouter();
  const { id } = router.query;
  const [activeStep, setActiveStep] = useState(0);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const breadcrumbItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Talenta', href: '/talent' },
    { title: 'Aldi Ramadhan', href: `/talent/${id}` },
    { title: 'Sewa Talenta', href: '#' },
  ].map((item, index) => (
    <Anchor 
      href={item.href} 
      key={index} 
      size="xs" 
      fw={500} 
      c={index === 3 ? 'dimmed' : '#194E9E'}
      className="hover:underline"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <Box bg="#F8F9FA" mih="100vh" pb={100}>
      <Container size={1200} pt={100} pb={30}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<Icon icon="tabler:chevron-right" width={14} />} mb={24}>
          {breadcrumbItems}
        </Breadcrumbs>

        {/* Page Title */}
        <Box mb={32}>
          <Title order={1} size="h2" fw={800} mb={4} c="dark.9">Sewa Talenta</Title>
          <Text size="sm" c="dimmed">Isi detail kebutuhan Anda untuk memesan talenta</Text>
        </Box>

        {/* Stepper */}
        <Paper radius="md" p={0} mb={40} bg="transparent">
          <Stepper active={activeStep} onStepClick={setActiveStep} size="sm" allowNextStepsSelect={false}
            styles={{
              stepIcon: { borderSize: 2 },
              stepLabel: { fontSize: '13px', fontWeight: 600 }
            }}
          >
            <Stepper.Step label="Detail Pemesanan" />
            <Stepper.Step label="Detail Pekerjaan" />
            <Stepper.Step label="Konfirmasi" />
            <Stepper.Step label="Pembayaran" />
          </Stepper>
        </Paper>

        <Flex direction={{ base: 'column', md: 'row' }} gap={32} align="flex-start">
          {/* Main Form Area */}
          <Stack gap={24} style={{ flex: 1 }}>
            
            {/* Choose Service Section */}
            <Box>
              <Text fw={700} mb={12} size="lg">Pilih Layanan</Text>
              <Text size="sm" c="dimmed" mb={16}>Pilih layanan yang ingin Anda pesan dari Aldi Ramadhan</Text>
              
              <Card radius={12} withBorder p="lg" className="bg-white">
                <Flex direction={{ base: 'column', sm: 'row' }} gap={20}>
                  <Box w={{ base: '100%', sm: 180 }} h={120} pos="relative" className="shrink-0 overflow-hidden rounded-lg">
                    <Image 
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800" 
                      alt="Service" 
                      fill 
                      className="object-cover"
                    />
                    <Badge pos="absolute" top={8} left={8} variant="filled" color="#194E9E" size="xs" radius="sm">POPULER</Badge>
                  </Box>
                  
                  <Flex direction="column" justify="space-between" flex={1}>
                    <Flex justify="space-between" align="flex-start" wrap="wrap" gap={10}>
                      <Box>
                        <Text fw={800} size="md">Event Photography - Basic</Text>
                        <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                          Dokumentasi acara kecil seperti gathering, ulang tahun, seminar, atau acara komunitas lainnya dengan hasil berkualitas tinggi.
                        </Text>
                      </Box>
                      <Text fw={800} size="md" c="dark.9">Rp 1.500.000 <Text span size="xs" fw={500} c="dimmed">/ event</Text></Text>
                    </Flex>
                    
                    <Flex justify="space-between" align="flex-end" mt={12}>
                      <Group gap={16}>
                        <Flex align="center" gap={4}>
                          <Icon icon="solar:clock-circle-linear" width={16} className="text-dimmed" />
                          <Text size="xs" c="dimmed">Durasi Max. 2 Jam</Text>
                        </Flex>
                        <Flex align="center" gap={4}>
                          <Icon icon="solar:gallery-linear" width={16} className="text-dimmed" />
                          <Text size="xs" c="dimmed">30+ Foto</Text>
                        </Flex>
                      </Group>
                      <Button variant="outline" color="#194E9E" radius="md" size="xs" px={20}>Ubah Layanan</Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            </Box>

            {/* Date & Time Section */}
            <Box>
              <Text fw={700} mb={12} size="lg">Tanggal & Waktu</Text>
              <Text size="sm" c="dimmed" mb={16}>Pilih tanggal dan waktu pelaksanaan</Text>
              
              <Flex gap={16} direction={{ base: 'column', sm: 'row' }}>
                <Paper withBorder p="md" radius={12} style={{ flex: 1 }}>
                  <Text size="xs" fw={600} mb={8} c="dimmed">Tanggal</Text>
                  <TextInput 
                    placeholder="Pilih Tanggal" 
                    value="Selasa, 19 Mei 2024"
                    readOnly
                    leftSection={<Icon icon="solar:calendar-linear" width={18} />}
                    rightSection={<Icon icon="tabler:chevron-down" width={16} />}
                    styles={{ input: { border: 'none', paddingLeft: 36, fontWeight: 600 } }}
                  />
                </Paper>
                
                <Paper withBorder p="md" radius={12} style={{ flex: 2 }}>
                  <Text size="xs" fw={600} mb={8} c="dimmed">Waktu</Text>
                  <Flex align="center" gap={12}>
                    <Box style={{ flex: 1 }}>
                      <Text size="10px" c="dimmed" mb={4} ml={12}>Mulai</Text>
                      <Select 
                        data={['10:00', '11:00', '12:00']} 
                        defaultValue="10:00" 
                        variant="unstyled"
                        leftSection={<Icon icon="solar:clock-circle-linear" width={18} />}
                        styles={{ input: { fontWeight: 600, paddingLeft: 36 } }}
                      />
                    </Box>
                    <Text c="dimmed">-</Text>
                    <Box style={{ flex: 1 }}>
                      <Text size="10px" c="dimmed" mb={4} ml={12}>Selesai</Text>
                      <Select 
                        data={['11:00', '12:00', '13:00']} 
                        defaultValue="12:00" 
                        variant="unstyled"
                        leftSection={<Icon icon="solar:clock-circle-linear" width={18} />}
                        styles={{ input: { fontWeight: 600, paddingLeft: 36 } }}
                      />
                    </Box>
                    <Badge variant="light" color="blue" radius="md" size="lg" h={40} px={15}>2 Jam</Badge>
                  </Flex>
                </Paper>
              </Flex>
            </Box>

            {/* Location Section */}
            <Box>
              <Text fw={700} mb={12} size="lg">Lokasi Acara</Text>
              <Text size="sm" c="dimmed" mb={16}>Di mana acara akan dilaksanakan?</Text>
              
              <Radio.Group defaultValue="my-location">
                <Stack gap={16}>
                  <Paper withBorder p="md" radius={12}>
                    <Radio 
                      value="my-location" 
                      label={<Text fw={600} size="sm">Di lokasi saya</Text>} 
                      color="#194E9E"
                    />
                    <Box mt={12} ml={32}>
                      {!isEditingLocation ? (
                        <Paper withBorder p="sm" radius="md" bg="#F8F9FA">
                          <Flex justify="space-between" align="center">
                            <Flex gap={12} align="center">
                              <Icon icon="solar:map-point-bold" width={20} color="#194E9E" />
                              <Box>
                                <Text size="sm" fw={700}>Gedung Serbaguna, Tanah Abang</Text>
                                <Text size="xs" c="dimmed">Jakarta Pusat, DKI Jakarta</Text>
                              </Box>
                            </Flex>
                            <Button variant="subtle" size="xs" color="#194E9E" onClick={() => setIsEditingLocation(true)}>Ubah</Button>
                          </Flex>
                        </Paper>
                      ) : (
                        <Stack gap={12}>
                          <Flex gap={12} direction={{ base: 'column', sm: 'row' }}>
                            <Select
                              label="Provinsi"
                              placeholder="Pilih Provinsi"
                              data={['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten']}
                              defaultValue="DKI Jakarta"
                              radius="md"
                              flex={1}
                              styles={{ label: { fontSize: '11px', fontWeight: 600, color: '#868E96', marginBottom: '4px' }, input: { backgroundColor: '#F8F9FA' } }}
                            />
                            <Select
                              label="Kota/Kabupaten"
                              placeholder="Pilih Kota"
                              data={['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Barat']}
                              defaultValue="Jakarta Pusat"
                              radius="md"
                              flex={1}
                              styles={{ label: { fontSize: '11px', fontWeight: 600, color: '#868E96', marginBottom: '4px' }, input: { backgroundColor: '#F8F9FA' } }}
                            />
                          </Flex>
                          
                          <Flex gap={12} direction={{ base: 'column', sm: 'row' }}>
                            <Select
                              label="Kecamatan"
                              placeholder="Pilih Kecamatan"
                              data={['Gambir', 'Tanah Abang', 'Menteng', 'Senen', 'Cempaka Putih']}
                              defaultValue="Tanah Abang"
                              radius="md"
                              flex={1}
                              styles={{ label: { fontSize: '11px', fontWeight: 600, color: '#868E96', marginBottom: '4px' }, input: { backgroundColor: '#F8F9FA' } }}
                            />
                            <Box flex={1} />
                          </Flex>

                          <TextInput 
                            label="Alamat Lengkap"
                            placeholder="Contoh: Gedung Serbaguna, Jl. Sudirman No. 10"
                            defaultValue="Gedung Serbaguna, Jl. Sudirman No. 10"
                            radius="md"
                            leftSection={<Icon icon="solar:map-point-linear" width={18} />}
                            styles={{ label: { fontSize: '11px', fontWeight: 600, color: '#868E96', marginBottom: '4px' }, input: { backgroundColor: '#F8F9FA' } }}
                          />
                          <Button size="xs" color="#194E9E" radius="md" onClick={() => setIsEditingLocation(false)} mt={4}>Simpan Lokasi</Button>
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                  
                  <Paper withBorder p="md" radius={12}>
                    <Radio 
                      value="other-location" 
                      label={<Text fw={600} size="sm">Di lokasi lain (talent yang tentukan)</Text>} 
                      color="#194E9E"
                    />
                  </Paper>
                </Stack>
              </Radio.Group>
            </Box>
          </Stack>

          {/* Sidebar Area */}
          <Stack gap={20} w={{ base: '100%', md: 380 }} className="shrink-0">
            {/* Order Summary Card */}
            <Card radius={12} withBorder p="lg" className="bg-white shadow-sm">
              <Text fw={700} mb={20} size="md">Ringkasan Pesanan</Text>
              
              {/* Talent Info */}
              <Flex gap={12} align="center" mb={20}>
                <Avatar 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" 
                  size={50} 
                  radius="xl" 
                />
                <Box>
                  <Flex align="center" gap={4}>
                    <Text fw={700} size="sm">Aldi Ramadhan</Text>
                    <Icon icon="solar:check-circle-bold" className="text-[#194E9E]" width={14} />
                  </Flex>
                  <Text size="xs" c="dimmed">Photographer</Text>
                </Box>
              </Flex>

              {/* Selected Service Accordion */}
              <Accordion variant="separated" radius="md" styles={{ item: { border: 'none' }, control: { padding: 0 }, content: { padding: '10px 0' } }}>
                <Accordion.Item value="service-details">
                  <Accordion.Control>
                    <Flex gap={12} align="center">
                      <Image 
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200" 
                        alt="Service" 
                        width={60} 
                        height={40} 
                        className="object-cover rounded"
                      />
                      <Box>
                        <Text fw={700} size="xs" lineClamp={1}>Event Photography - Basic</Text>
                        <Text fw={800} size="sm" mt={2}>Rp 1.500.000 <Text span size="10px" fw={500} c="dimmed">/ event</Text></Text>
                      </Box>
                    </Flex>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="xs" c="dimmed">
                      Dokumentasi acara kecil seperti gathering, ulang tahun, seminar, atau acara komunitas lainnya dengan hasil berkualitas tinggi.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Divider mb={20} opacity={0.5} />

              {/* Details List */}
              <Stack gap={16} mb={24}>
                <Flex justify="space-between" align="flex-start">
                  <Text size="xs" c="dimmed">Tanggal & Waktu</Text>
                  <Box style={{ textAlign: 'right' }}>
                    <Text size="xs" fw={600}>Selasa, 19 Mei 2024</Text>
                    <Text size="xs" c="dimmed">10:00 - 12:00 (2 Jam)</Text>
                  </Box>
                </Flex>
                <Flex justify="space-between" align="flex-start">
                  <Text size="xs" c="dimmed">Lokasi</Text>
                  <Text size="xs" fw={600} style={{ maxWidth: '200px', textAlign: 'right' }}>
                    Gedung Serbaguna, Jl. Sudirman No. 10, Jakarta Pusat, DKI Jakarta
                  </Text>
                </Flex>
              </Stack>

              <Divider mb={20} opacity={0.5} />

              {/* Pricing Breakdown */}
              <Stack gap={10} mb={24}>
                <Flex justify="space-between">
                  <Text size="sm" c="dimmed">Subtotal</Text>
                  <Text size="sm" fw={700}>Rp 1.500.000</Text>
                </Flex>
                <Flex justify="space-between">
                  <Flex align="center" gap={4}>
                    <Text size="sm" c="dimmed">Biaya Platform</Text>
                    <Icon icon="solar:info-circle-linear" width={14} className="text-dimmed" />
                  </Flex>
                  <Text size="sm" fw={700}>Rp 75.000</Text>
                </Flex>
              </Stack>

              <Flex justify="space-between" align="center" pt={16} style={{ borderTop: '2px dashed #EEE' }}>
                <Text fw={800} size="lg">Total</Text>
                <Text fw={800} size="xl" c="#194E9E">Rp 1.575.000</Text>
              </Flex>
            </Card>

            {/* Secure Payment Card */}
            <Card radius={12} withBorder p="md" className="bg-[#F8FFF9] border-[#D1F0D5]">
              <Flex gap={12} align="center">
                <Icon icon="solar:shield-check-bold" className="text-[#2D9B3E]" width={24} />
                <Box>
                  <Text fw={700} size="sm" c="#1D6B28">Pembayaran aman</Text>
                  <Text size="xs" c="#1D6B28" opacity={0.8}>Semua pembayaran dilindungi sistem Kolektix.</Text>
                </Box>
              </Flex>
            </Card>

            {/* Need Help Card */}
            <Card radius={12} withBorder p="lg" className="bg-white shadow-sm">
              <Text fw={700} mb={8} size="sm">Butuh Bantuan?</Text>
              <Text size="xs" c="dimmed" mb={16}>Hubungi tim support kami jika Anda membutuhkan bantuan.</Text>
              <Button 
                variant="outline" 
                color="gray" 
                fullWidth 
                radius="md" 
                leftSection={<Icon icon="solar:headset-linear" width={18} />}
                className="border-gray-200 text-dark"
              >
                Hubungi Support
              </Button>
            </Card>
          </Stack>
        </Flex>
      </Container>

      {/* Sticky Bottom Footer */}
      <Paper pos="fixed" bottom={0} left={0} right={0} p="md" bg="white" style={{ zIndex: 100, borderTop: '1px solid #EEE' }}>
        <Container size={1200}>
          <Flex justify="flex-end" align="center" gap={24}>
            <Box visibleFrom="sm">
              <Text size="xs" c="dimmed" style={{ textAlign: 'right' }}>Harga Mulai Dari</Text>
              <Text fw={800} size="lg">Rp 1.500.000 <Text span size="xs" fw={500} c="dimmed">/ event</Text></Text>
            </Box>
            <Button 
              size="lg" 
              radius="md" 
              bg="#0B387C"
              px={50}
              rightSection={<Icon icon="solar:arrow-right-linear" width={20} />}
              className="hover:bg-[#082d63] transition-colors"
            >
              Lanjutkan
            </Button>
          </Flex>
        </Container>
      </Paper>
    </Box>
  );
}
