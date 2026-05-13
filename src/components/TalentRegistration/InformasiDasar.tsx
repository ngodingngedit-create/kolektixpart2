import {
  Stack,
  Box,
  Text,
  SimpleGrid,
  Avatar,
  ActionIcon,
  TextInput,
  Group,
  Tooltip,
  MultiSelect,
  Textarea,
  FileButton,
  Flex,
  Select
} from '@mantine/core';
import { Icon } from '@iconify/react';
import Image from 'next/image';

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

interface InformasiDasarProps {
  isMobile: boolean;
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
}

export default function InformasiDasar({ 
  isMobile, 
  formData,
  updateFormData
}: InformasiDasarProps) {
  const inputStyles = {
    input: {
      fontSize: '13px',
      '&::placeholder': {
        fontSize: '11px',
      }
    },
    label: {
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    },
    pill: {
      fontSize: '10px',
      height: '22px',
      paddingLeft: '8px',
      paddingRight: '8px',
    }
  };

  const handleProfileUpload = (file: File | null) => {
    if (file) {
      updateFormData({ profilePhoto: URL.createObjectURL(file) });
    }
  };

  const handleBannerUpload = (file: File | null) => {
    if (file) {
      updateFormData({ bannerPhoto: URL.createObjectURL(file) });
    }
  };

  return (
    <Stack gap={25}>
      {/* Foto Profil & Banner Talenta */}
      <Box p="lg" style={{ border: '1px solid #EEE', borderRadius: 12 }}>
        <Text fw={700} size="sm" mb="lg">Foto Profil & Banner Talenta</Text>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
          {/* Foto Profil */}
          <Box>
            <Text fw={600} size="xs" mb={2}>Foto Profil <Text span c="red">*</Text></Text>
            <Text size="10px" c="dimmed" mb="sm">Foto ini akan tampil sebagai identitas utama Anda.</Text>
            <Stack align="center" pos="relative" w="fit-content">
              <Avatar size={100} radius="xl" bg="gray.1" style={{ border: '2px solid #EEE' }} src={formData.profilePhoto}>
                {!formData.profilePhoto && <Icon icon="solar:user-bold" width={50} color="#CCC" />}
              </Avatar>
              <FileButton onChange={handleProfileUpload} accept="image/png,image/jpeg">
                {(props) => (
                  <ActionIcon
                    {...props}
                    pos="absolute"
                    bottom={0}
                    right={0}
                    bg="#0B387C"
                    c="white"
                    radius="xl"
                    size="lg"
                    style={{ border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  >
                    <Icon icon="solar:add-circle-bold" width={22} />
                  </ActionIcon>
                )}
              </FileButton>
            </Stack>
            <Text size="10px" c="dimmed" mt={5}>JPG, PNG. Maks 2MB</Text>
          </Box>

          {/* Banner Talenta */}
          <Box>
            <Text fw={600} size="xs" mb={2}>Banner Talenta <Text span c="red">*</Text></Text>
            <Text size="10px" c="dimmed" mb="sm">Banner ini akan ditampilkan di halaman profil Anda.</Text>
            <Box pos="relative">
              <Box
                h={100}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #EEE',
                  position: 'relative',
                  backgroundColor: formData.bannerPhoto ? 'transparent' : '#F8F9FA'
                }}
              >
                {formData.bannerPhoto ? (
                  <Image
                    src={formData.bannerPhoto}
                    alt="Banner"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Flex h="100%" align="center" justify="center">
                    <Icon icon="solar:gallery-bold" width={32} color="#DEE2E6" />
                  </Flex>
                )}
              </Box>
              <FileButton onChange={handleBannerUpload} accept="image/png,image/jpeg">
                {(props) => (
                  <ActionIcon
                    {...props}
                    pos="absolute"
                    bottom={-10}
                    right={10}
                    bg="#0B387C"
                    c="white"
                    radius="xl"
                    size="lg"
                    style={{ border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  >
                    <Icon icon="solar:add-circle-bold" width={22} />
                  </ActionIcon>
                )}
              </FileButton>
            </Box>
            <Text size="10px" c="dimmed" mt={15}>JPG, PNG. Rasio 16:5, Maks 5MB</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Main Form Fields */}
      <Stack gap={20}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={20}>
          <TextInput
            label="Nama Lengkap *"
            placeholder="Masukkan nama lengkap"
            radius="md"
            size="md"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.currentTarget.value })}
            styles={inputStyles}
          />
          <TextInput
            label="Email *"
            placeholder="Masukkan alamat email"
            radius="md"
            size="md"
            leftSection={<Icon icon="solar:letter-broken" color="gray" />}
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.currentTarget.value })}
            styles={inputStyles}
          />

          <TextInput
            label={
              <Group gap={5}>
                <Text size="12px" fw={600}>Nama Panggung / Brand</Text>
                <Tooltip label="Nama yang akan ditampilkan sebagai identitas profesional Anda">
                  <Icon icon="solar:info-circle-broken" width={14} color="gray" />
                </Tooltip>
              </Group>
            }
            placeholder="Masukkan nama panggung"
            radius="md"
            size="md"
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.currentTarget.value })}
            styles={inputStyles}
          />
          <TextInput
            label="Nomor Telepon *"
            placeholder="Masukkan nomor telepon"
            radius="md"
            size="md"
            leftSection={<Icon icon="solar:phone-broken" color="gray" />}
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.currentTarget.value })}
            styles={inputStyles}
          />

          <TextInput
            label="Tanggal Lahir *"
            placeholder="Pilih tanggal lahir"
            radius="md"
            size="md"
            rightSection={<Icon icon="solar:calendar-broken" color="gray" />}
            value={formData.dob}
            onChange={(e) => updateFormData({ dob: e.currentTarget.value })}
            styles={inputStyles}
          />
          <Box>
            <Textarea
              label="Bio Singkat *"
              placeholder="Ceritakan singkat tentang diri Anda"
              radius="md"
              size="md"
              minRows={3}
              value={formData.bio}
              onChange={(e) => updateFormData({ bio: e.currentTarget.value })}
              styles={inputStyles}
            />
            <Text size="10px" c="dimmed" mt={4} ta="right">{formData.bio.length} / 500 karakter</Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={20} mt={-10}>
          <Box>
            <Select
              label="Lokasi *"
              placeholder="Pilih lokasi"
              data={['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali']}
              radius="md"
              size="md"
              leftSection={<Icon icon="solar:map-point-broken" color="gray" />}
              value={formData.location}
              onChange={(val) => updateFormData({ location: val || '' })}
              styles={inputStyles}
              searchable
            />
            <Text size="10px" c="dimmed" mt={4}>Lokasi ini akan ditampilkan di profil publik Anda.</Text>
          </Box>
          <MultiSelect
            label="Bahasa yang Dikuasai"
            placeholder={formData.languages.length > 0 ? "" : "Pilih bahasa"}
            data={['Indonesian', 'English', 'Japanese', 'Korean']}
            radius="md"
            size="md"
            value={formData.languages}
            onChange={(val) => updateFormData({ languages: val })}
            styles={inputStyles}
          />
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
