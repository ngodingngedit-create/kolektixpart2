import {
  Stack,
  Box,
  Text,
  SimpleGrid,
  Card,
  Group,
  Button,
  TextInput,
  Textarea,
  Badge,
  ActionIcon,
  Flex,
  Select,
  Divider,
  FileButton,
  Accordion
} from '@mantine/core';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  thumbnail: string;
  size: string;
  title: string;
  duration?: string;
}

interface PortfolioProps {
  isMobile: boolean;
  formData: any;
  updateFormData: (data: any) => void;
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: '1', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', size: '2.4 MB', title: 'Konser Musik' },
  { id: '2', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', size: '3.1 MB', title: 'Corporate Event' },
  { id: '3', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1514525253348-8d9807cc96a1?w=400', size: '1.8 MB', title: 'Seminar Nasional' },
  { id: '4', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1459749411177-042180ceea72?w=400', size: '2.7 MB', title: 'Wedding Outdoor' },
  { id: '5', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', size: '18.6 MB', title: 'Event Highlight', duration: '00:45' },
  { id: '6', type: 'image', thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', size: '2.2 MB', title: 'Fashion Show' },
];

export default function Portfolio({ isMobile, formData, updateFormData }: PortfolioProps) {
  return (
    <Stack gap={30}>
      <Stack gap={25}>
        {/* Upload Section */}
        <Box>
          <Text fw={700} size="md" mb={5}>Upload Karya</Text>
          <Text c="dimmed" size="xs" mb={20}>
            Unggah foto atau video hasil karya Anda. Maksimal 10 file, ukuran maksimum 50MB per file.
          </Text>

          <Flex gap={20} direction={isMobile ? 'column' : 'row'}>
            {/* Drop Zone */}
            <Box flex={1}>
              <Text fw={600} size="xs" mb={8}>File Karya <Text span c="red">*</Text></Text>
              <Box
                style={{
                  border: '2px dashed #DEE2E6',
                  borderRadius: 12,
                  padding: '30px 20px',
                  textAlign: 'center',
                  backgroundColor: '#F8F9FA'
                }}
              >
                <Stack align="center" gap={10}>
                  <Icon icon="solar:upload-cloud-bold-duotone" width={48} color="#0B387C" />
                  <Box>
                    <Text fw={700} size="sm">Drag & drop file di sini</Text>
                    <Text size="xs" c="dimmed">atau</Text>
                  </Box>
                  <FileButton onChange={() => { }} accept="image/png,image/jpeg,video/mp4,video/quicktime">
                    {(props) => (
                      <Button {...props} variant="filled" color="#0B387C" radius="md" size="xs" px={20}>
                        Pilih File
                      </Button>
                    )}
                  </FileButton>
                  <Text size="10px" c="dimmed">Format: JPG, PNG, MP4, MOV</Text>
                </Stack>
              </Box>
            </Box>

            {/* Description */}
            <Box flex={1}>
              <Text fw={600} size="xs" mb={8}>Deskripsi Kegiatan <Text span c="red">*</Text></Text>
              <Textarea
                placeholder="Contoh: Foto ini diambil saat saya bertugas sebagai fotografer resmi pada acara konser musik 'Sound of Harmony' di Jakarta Convention Center."
                minRows={10}
                radius="md"
                styles={{ input: { fontSize: '12px', height: '178px' } }}
              />
              <Text size="10px" c="dimmed" ta="right" mt={5}>0 / 300 karakter</Text>
            </Box>
          </Flex>
        </Box>

        {/* Portfolio Grid */}
        <Box>
          <Flex justify="space-between" align="center" mb={20}>
            <Text fw={700} size="md">Karya Anda (6/10)</Text>
          </Flex>

          <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
            {MOCK_PORTFOLIO.map((item) => (
              <Card key={item.id} p={0} radius="md" withBorder className="group cursor-pointer">
                <Box pos="relative" h={100}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  />
                  <Badge
                    pos="absolute"
                    bottom={5}
                    left={5}
                    size="xs"
                    variant="filled"
                    bg="rgba(0,0,0,0.6)"
                    styles={{ label: { fontSize: '8px' } }}
                  >
                    {item.type === 'image' ? 'JPG' : 'MP4'}
                  </Badge>
                  {item.duration && (
                    <Text
                      pos="absolute"
                      bottom={5}
                      right={5}
                      size="8px"
                      c="white"
                      fw={700}
                      bg="rgba(0,0,0,0.6)"
                      px={4}
                      style={{ borderRadius: 4 }}
                    >
                      {item.duration}
                    </Text>
                  )}
                  <ActionIcon
                    pos="absolute"
                    top={5}
                    right={5}
                    size="sm"
                    variant="filled"
                    bg="rgba(255,255,255,0.9)"
                    c="dark"
                    radius="md"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="solar:menu-dots-bold" width={14} />
                  </ActionIcon>
                </Box>
                <Box p={8}>
                  <Text fw={700} size="9px" lineClamp={1}>{item.title}</Text>
                  <Text size="8px" c="dimmed">{item.size}</Text>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* External Links */}
        <Box>
          <Accordion variant="separated" radius="lg">
            <Accordion.Item value="links" style={{ backgroundColor: 'white', border: '1px solid #EEE' }}>
              <Accordion.Control icon={<Icon icon="solar:link-bold" color="#0B387C" width={20} />}>
                <Stack gap={2}>
                  <Text fw={700} size="md">Tautan Portofolio (Opsional)</Text>
                  <Text c="dimmed" size="xs">Tambahkan tautan ke akun atau platform lain tempat Anda menampilkan karya.</Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" pt="xs">
                  <TextInput
                    label={<Group gap={6} mb={4}><Icon icon="ri:instagram-fill" color="#E4405F" /><Text size="xs" fw={600}>Instagram</Text></Group>}
                    placeholder="https://instagram.com/username"
                    radius="md"
                    size="xs"
                  />
                  <TextInput
                    label={<Group gap={6} mb={4}><Icon icon="ri:behance-fill" color="#1769FF" /><Text size="xs" fw={600}>Behance</Text></Group>}
                    placeholder="https://behance.net/username"
                    radius="md"
                    size="xs"
                  />
                  <TextInput
                    label={<Group gap={6} mb={4}><Icon icon="ri:youtube-fill" color="#FF0000" /><Text size="xs" fw={600}>YouTube</Text></Group>}
                    placeholder="https://youtube.com/@channel"
                    radius="md"
                    size="xs"
                  />
                  <TextInput
                    label={<Group gap={6} mb={4}><Icon icon="solar:global-bold" color="#666" /><Text size="xs" fw={600}>Website</Text></Group>}
                    placeholder="https://yourwebsite.com"
                    radius="md"
                    size="xs"
                  />
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>
      </Stack>
    </Stack>
  );
}
