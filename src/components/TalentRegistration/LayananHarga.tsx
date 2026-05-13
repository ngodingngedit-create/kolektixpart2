import { useState } from 'react';
import {
  Stack,
  Box,
  Text,
  Flex,
  Button,
  Accordion,
  Group,
  TextInput,
  Textarea,
  Select,
  Table,
  ActionIcon,
  Card,
  Divider,
  NumberInput,
  Badge,
  Tooltip
} from '@mantine/core';
import { Icon } from '@iconify/react';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
}

interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  workDuration: string;
  icon: string;
  color: string;
  packages: ServicePackage[];
}

const INITIAL_SERVICES: ServiceOffer[] = [
  {
    id: '1',
    title: 'Fotografi Event',
    description: 'Jasa dokumentasi untuk berbagai jenis acara seperti konser, seminar, wedding, corporate event, dan lainnya.',
    workDuration: '1 - 3 hari',
    icon: 'solar:camera-bold',
    color: 'blue',
    packages: [
      { id: 'p1', name: 'Basic', description: 'Dokumentasi acara hingga 3 jam', duration: 'Hingga 3 jam', price: 1500000, features: ['50+ foto hasil edit', 'Soft file via Google Drive'] },
      { id: 'p2', name: 'Standard', description: 'Dokumentasi acara hingga 6 jam', duration: 'Hingga 6 jam', price: 2500000, features: ['100+ foto hasil edit', 'Soft file via Google Drive'] },
      { id: 'p3', name: 'Premium', description: 'Dokumentasi full day (maks. 12 jam)', duration: 'Hingga 12 jam', price: 4000000, features: ['200+ foto hasil edit', 'Soft file via Google Drive', '10 foto cetak 4R'] },
    ]
  },
  {
    id: '2',
    title: 'Videografi Event',
    description: 'Jasa pembuatan video liputan acara dengan hasil cinematic berkualitas tinggi.',
    workDuration: '2 - 5 hari',
    icon: 'solar:videocamera-record-bold',
    color: 'violet',
    packages: []
  },
  {
    id: '3',
    title: 'Editing Foto',
    description: 'Jasa edit foto profesional untuk keperluan event, promosi, maupun personal.',
    workDuration: '1 - 2 hari',
    icon: 'solar:gallery-bold',
    color: 'green',
    packages: []
  }
];

interface LayananHargaProps {
  isMobile: boolean;
  formData: any;
  updateFormData: (data: any) => void;
}

export default function LayananHarga({ isMobile, formData, updateFormData }: LayananHargaProps) {
  const [services, setServices] = useState<ServiceOffer[]>(INITIAL_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleEdit = (serviceId: string, pkgId: string, values?: any) => {
    if (editingId === pkgId && values) {
      // Save logic
      const updatedServices = services.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            packages: s.packages.map(p => {
              if (p.id === pkgId) {
                return {
                  ...p,
                  ...values,
                  features: typeof values.features === 'string' ? values.features.split(',').map((f: string) => f.trim()) : p.features
                };
              }
              return p;
            })
          };
        }
        return s;
      });
      setServices(updatedServices);
    }
    setEditingId(editingId === pkgId ? null : pkgId);
  };

  const handleDelete = (serviceId: string, pkgId: string) => {
    const updatedServices = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          packages: s.packages.filter(p => p.id !== pkgId)
        };
      }
      return s;
    });
    setServices(updatedServices);
  };

  const handleAddPackage = (serviceId: string) => {
    const newPackage: ServicePackage = {
      id: `pkg-${Date.now()}`,
      name: '',
      description: '',
      duration: 'Hingga 3 jam',
      price: 0,
      features: []
    };

    const updatedServices = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          packages: [...s.packages, newPackage]
        };
      }
      return s;
    });

    setServices(updatedServices);
    setEditingId(newPackage.id);
  };

  return (
    <Stack gap={25}>
      <Flex justify="space-between" align="center" direction={isMobile ? 'column' : 'row'} gap="md">
        <Box>
          <Text fw={700} size="md">Layanan yang Saya Tawarkan</Text>
          <Text c="dimmed" size="xs">Anda dapat menambahkan beberapa layanan berikut dengan paket harga yang berbeda.</Text>
        </Box>
        <Button
          variant="filled"
          color="#0B387C"
          radius="md"
          size="sm"
          leftSection={<Icon icon="solar:plus-bold" width={18} />}
          fullWidth={isMobile}
        >
          Tambah Layanan
        </Button>
      </Flex>

      <Accordion variant="separated" radius="lg" defaultValue="1" chevronSize={0}>
        {services.map((service) => (
          <Accordion.Item key={service.id} value={service.id} style={{ backgroundColor: 'white', border: '1px solid #EEE' }}>
            <Accordion.Control style={{ paddingRight: 16 }}>
              <Flex gap="md" align="center" direction={isMobile ? 'column' : 'row'} style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Box p={12} bg={`${service.color}.0`} style={{ borderRadius: 12 }}>
                  <Icon icon={service.icon} width={32} color={`var(--mantine-color-${service.color}-6)`} />
                </Box>
                <Stack gap={2} flex={1}>
                  <Text fw={700} size="md">{service.title}</Text>
                  <Text size="xs" c="dimmed" lineClamp={2}>{service.description}</Text>
                  <Group gap={15} mt={5} justify={isMobile ? 'center' : 'flex-start'}>
                    <Flex align="center" gap={5}>
                      <Icon icon="solar:clock-circle-bold" width={14} color="gray" />
                      <Text size="xs" c="dimmed">Durasi Pengerjaan: <Text span fw={600} c="dark">{service.workDuration}</Text></Text>
                    </Flex>
                  </Group>
                </Stack>
                {!isMobile && (
                  <Button 
                    variant="outline" 
                    color="#0B387C" 
                    radius="md" 
                    size="xs" 
                    px={15}
                    rightSection={<Icon icon="solar:alt-arrow-down-broken" width={16} />}
                    style={{ pointerEvents: 'none' }}
                  >
                    Kelola Harga
                  </Button>
                )}
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <Divider mb="lg" />
              <Stack gap="lg">
                <Box>
                  <Text fw={700} size="sm" mb={5}>Paket Harga</Text>
                  <Text c="dimmed" size="xs" mb={15}>Tambahkan beberapa paket harga untuk layanan ini.</Text>
                  
                  {!isMobile ? (
                    <Table verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th><Text size="xs" fw={700}>Nama Paket</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={700}>Deskripsi Paket</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={700}>Durasi</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={700}>Harga (Rp)</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={700}>Fitur yang Didapat</Text></Table.Th>
                          <Table.Th><Text size="xs" fw={700} ta="center">Aksi</Text></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {service.packages.map((pkg) => {
                          const isEditing = editingId === pkg.id;
                          return (
                            <Table.Tr key={pkg.id}>
                              <Table.Td w={110}>
                                <TextInput 
                                  id={`name-${pkg.id}`}
                                  defaultValue={pkg.name} 
                                  size="xs" 
                                  radius="md" 
                                  fw={600} 
                                  readOnly={!isEditing}
                                  styles={{ input: { cursor: isEditing ? 'text' : 'default', border: isEditing ? '1px solid #0B387C' : '1px solid transparent', backgroundColor: isEditing ? 'white' : '#F8F9FA' } }}
                                />
                              </Table.Td>
                              <Table.Td>
                                <TextInput 
                                  id={`desc-${pkg.id}`}
                                  defaultValue={pkg.description} 
                                  size="xs" 
                                  radius="md" 
                                  readOnly={!isEditing}
                                  styles={{ input: { cursor: isEditing ? 'text' : 'default', border: isEditing ? '1px solid #0B387C' : '1px solid transparent', backgroundColor: isEditing ? 'white' : '#F8F9FA' } }}
                                />
                              </Table.Td>
                              <Table.Td w={130}>
                                <Select
                                  id={`duration-${pkg.id}`}
                                  size="xs"
                                  radius="md"
                                  defaultValue={pkg.duration}
                                  readOnly={!isEditing}
                                  data={['Hingga 3 jam', 'Hingga 6 jam', 'Hingga 12 jam', 'Full Time', 'Custom']}
                                  styles={{ input: { cursor: isEditing ? 'pointer' : 'default', border: isEditing ? '1px solid #0B387C' : '1px solid transparent', backgroundColor: isEditing ? 'white' : '#F8F9FA' }, section: { display: isEditing ? 'flex' : 'none' } }}
                                />
                              </Table.Td>
                              <Table.Td w={140}>
                                <NumberInput
                                  id={`price-${pkg.id}`}
                                  size="xs"
                                  radius="md"
                                  defaultValue={pkg.price}
                                  readOnly={!isEditing}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  hideControls
                                  fw={700}
                                  styles={{ input: { cursor: isEditing ? 'text' : 'default', border: isEditing ? '1px solid #0B387C' : '1px solid transparent', backgroundColor: isEditing ? 'white' : '#F8F9FA' } }}
                                />
                              </Table.Td>
                              <Table.Td>
                                {isEditing ? (
                                  <Tooltip label="Gunakan tanda koma (,) untuk memisahkan setiap fitur/poin." position="top" withArrow>
                                    <TextInput 
                                      id={`features-${pkg.id}`}
                                      defaultValue={pkg.features.join(', ')}
                                      placeholder="Contoh: Edit foto, Revisi 2x, ..."
                                      size="xs"
                                      radius="md"
                                      styles={{ input: { fontSize: '9px', border: '1px solid #0B387C', backgroundColor: 'white' } }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Stack gap={2}>
                                    {pkg.features.map((f, i) => (
                                      <Flex key={i} align="center" gap={4}>
                                        <Text size="8px" fw={500} c="gray.7" style={{ whiteSpace: 'nowrap' }}>- {f}</Text>
                                      </Flex>
                                    ))}
                                  </Stack>
                                )}
                              </Table.Td>
                              <Table.Td>
                                <Group gap={5} justify="center">
                                  <ActionIcon 
                                    variant="subtle" 
                                    color={isEditing ? 'blue.7' : 'gray.6'} 
                                    size="sm" 
                                    radius="md"
                                    onClick={() => {
                                      if (isEditing) {
                                        const values = {
                                          name: (document.getElementById(`name-${pkg.id}`) as HTMLInputElement)?.value,
                                          description: (document.getElementById(`desc-${pkg.id}`) as HTMLInputElement)?.value,
                                          duration: (document.getElementById(`duration-${pkg.id}`) as HTMLInputElement)?.value,
                                          price: Number((document.getElementById(`price-${pkg.id}`) as HTMLInputElement)?.value.replace(/\./g, '').replace(',', '.')),
                                          features: (document.getElementById(`features-${pkg.id}`) as HTMLInputElement)?.value
                                        };
                                        toggleEdit(service.id, pkg.id, values);
                                      } else {
                                        toggleEdit(service.id, pkg.id);
                                      }
                                    }}
                                  >
                                    <Icon icon={isEditing ? "solar:check-circle-bold" : "solar:pen-bold"} width={16} />
                                  </ActionIcon>
                                  <ActionIcon 
                                    variant="subtle" 
                                    color="red" 
                                    size="sm" 
                                    radius="md"
                                    onClick={() => handleDelete(service.id, pkg.id)}
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold" width={14} />
                                  </ActionIcon>
                                </Group>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  ) : (
                    <Stack gap="md">
                      {service.packages.map((pkg) => {
                        const isEditing = editingId === pkg.id;
                        return (
                          <Card key={pkg.id} withBorder radius="md" p="sm">
                            <Stack gap="sm">
                              <Flex justify="space-between" align="center">
                                <Badge color="blue" variant="light">{pkg.name}</Badge>
                                <Group gap={5}>
                                  <ActionIcon 
                                    variant={isEditing ? 'filled' : 'subtle'} 
                                    color={isEditing ? 'blue.7' : 'gray.6'} 
                                    size="sm"
                                    onClick={() => {
                                      toggleEdit(service.id, pkg.id);
                                    }}
                                  >
                                    <Icon icon={isEditing ? "solar:check-circle-bold" : "solar:pen-bold"} width={16} />
                                  </ActionIcon>
                                  <ActionIcon 
                                    variant="subtle" 
                                    color="red" 
                                    size="sm"
                                    onClick={() => handleDelete(service.id, pkg.id)}
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold" width={14} />
                                  </ActionIcon>
                                </Group>
                              </Flex>
                              <TextInput 
                                label="Deskripsi" 
                                defaultValue={pkg.description} 
                                size="xs" 
                                radius="md" 
                                readOnly={!isEditing}
                              />
                              <Group grow>
                                <Select 
                                  label="Durasi" 
                                  size="xs" 
                                  radius="md" 
                                  defaultValue={pkg.duration} 
                                  data={['Hingga 3 jam', 'Hingga 6 jam', 'Hingga 12 jam', 'Full Time']} 
                                  readOnly={!isEditing}
                                />
                                <NumberInput 
                                  label="Harga" 
                                  size="xs" 
                                  radius="md" 
                                  defaultValue={pkg.price} 
                                  thousandSeparator="." 
                                  hideControls 
                                  fw={700} 
                                  readOnly={!isEditing}
                                />
                              </Group>
                              <Box>
                                <Text size="xs" fw={600} mb={5}>Fitur:</Text>
                                {isEditing ? (
                                  <TextInput 
                                    defaultValue={pkg.features.join(', ')}
                                    size="xs"
                                    radius="md"
                                  />
                                ) : (
                                  <Stack gap={2}>
                                    {pkg.features.map((f, i) => (
                                      <Text key={i} size="xs" c="gray.7">- {f}</Text>
                                    ))}
                                  </Stack>
                                )}
                              </Box>
                            </Stack>
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                  
                  <Button
                    variant="outline"
                    color="#0B387C"
                    radius="md"
                    size="xs"
                    mt="md"
                    leftSection={<Icon icon="solar:plus-bold" width={14} />}
                    px={20}
                    onClick={() => handleAddPackage(service.id)}
                  >
                    Tambah Paket Harga
                  </Button>
                </Box>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <Box bg="#F0F7FF" p="md" style={{ borderRadius: 12 }}>
        <Flex gap="sm" align="flex-start">
          <Icon icon="solar:info-circle-bold" color="#0B387C" width={20} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text size="xs" c="dimmed" lh={1.5}>
            <Text span fw={700} c="#0B387C">Catatan: </Text>
            Harga yang dicantumkan bersifat fleksibel dan dapat disesuaikan dengan kebutuhan klien. Pastikan paket yang Anda buat mencakup detail layanan dengan jelas untuk menarik minat klien.
          </Text>
        </Flex>
      </Box>
    </Stack>
  );
}
