import React, { useState } from 'react';
import { Stack, Text, Checkbox, Select, RangeSlider, Group, Button, Flex, Divider, Collapse, UnstyledButton, Card } from '@mantine/core';
import { Icon } from '@iconify/react/dist/iconify.js';

type FilterTalentProps = {
  setNameFilter: (name: string) => void;
  setCategoryFilter: (category: string) => void;
  categories: string[]; 
};

const FilterTalent: React.FC<FilterTalentProps> = ({ setNameFilter, setCategoryFilter, categories }) => {
  const [opened, setOpened] = useState({
    kategori: true,
    lokasi: true,
    harga: true,
    rating: true
  });

  const toggleSection = (section: keyof typeof opened) => {
    setOpened(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Card withBorder radius={12} p={0} className="bg-white shadow-sm overflow-hidden sticky top-20 border-gray-300">
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-300">
        <Text fw={700} size="sm">Filter</Text>
        <UnstyledButton onClick={() => {}} className="text-[#194E9E] flex items-center gap-1">
          <Icon icon="lucide:rotate-ccw" width={14}/>
          <Text size="xs" fw={600}>Reset</Text>
        </UnstyledButton>
      </div>

      <Stack gap={0} p={16}>
        {/* Kategori Section */}
        <Stack gap={10} mb={20}>
          <UnstyledButton onClick={() => toggleSection('kategori')} className="flex justify-between items-center">
            <Text fw={700} size="sm">Kategori</Text>
            <Icon icon={opened.kategori ? "lucide:chevron-up" : "lucide:chevron-down"} className="text-gray-400" />
          </UnstyledButton>
          <Collapse in={opened.kategori}>
            <Stack gap={8} mt={10}>
              <Checkbox label="Semua Kategori" size="xs" color="#194E9E" defaultChecked />
              <Checkbox label="Photographer (124)" size="xs" color="#194E9E" />
              <Checkbox label="Videographer (98)" size="xs" color="#194E9E" />
              <Checkbox label="Sound Engineer (56)" size="xs" color="#194E9E" />
              <Checkbox label="Lighting Designer (43)" size="xs" color="#194E9E" />
              <Checkbox label="MC / Host (78)" size="xs" color="#194E9E" />
            </Stack>
          </Collapse>
        </Stack>

        <Divider mb={20} color="gray.3" />

        {/* Lokasi Section */}
        <Stack gap={10} mb={20}>
          <UnstyledButton onClick={() => toggleSection('lokasi')} className="flex justify-between items-center">
            <Text fw={700} size="sm">Lokasi</Text>
            <Icon icon={opened.lokasi ? "lucide:chevron-up" : "lucide:chevron-down"} className="text-gray-400" />
          </UnstyledButton>
          <Collapse in={opened.lokasi}>
            <Select 
              mt={10}
              placeholder="Semua Lokasi"
              data={['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali']}
              radius="md"
              size="sm"
              leftSection={<Icon icon="material-symbols:location-on-rounded" className="text-gray-400" />}
            />
          </Collapse>
        </Stack>

        <Divider mb={20} color="gray.3" />

        {/* Harga Section */}
        <Stack gap={10} mb={20}>
          <UnstyledButton onClick={() => toggleSection('harga')} className="flex justify-between items-center">
            <Text fw={700} size="sm">Harga</Text>
            <Icon icon={opened.harga ? "lucide:chevron-up" : "lucide:chevron-down"} className="text-gray-400" />
          </UnstyledButton>
          <Collapse in={opened.harga}>
            <Flex gap={10} mt={10} align="center">
              <Select placeholder="Min" data={['0', '500k', '1M']} size="xs" radius="md" />
              <div className="w-4 h-px bg-gray-300" />
              <Select placeholder="Maks" data={['5M', '10M', '10M+']} size="xs" radius="md" />
            </Flex>
            <RangeSlider 
              mt={25} 
              size="xs" 
              color="#194E9E" 
              label={null}
              min={0}
              max={100}
              step={1}
              defaultValue={[0, 100]}
              thumbSize={16}
            />
            <Flex justify="space-between" mt={10}>
              <Text size="xs" c="dimmed">Rp 0</Text>
              <Text size="xs" c="dimmed">Rp 10.000.000+</Text>
            </Flex>
          </Collapse>
        </Stack>

        <Divider mb={20} color="gray.3" />

        {/* Rating Section */}
        <Stack gap={10}>
          <UnstyledButton onClick={() => toggleSection('rating')} className="flex justify-between items-center">
            <Text fw={700} size="sm">Rating</Text>
            <Icon icon={opened.rating ? "lucide:chevron-up" : "lucide:chevron-down"} className="text-gray-400" />
          </UnstyledButton>
          <Collapse in={opened.rating}>
            <Group gap={8} mt={10}>
              <Button variant="filled" size="xs" radius="md" color="#194E9E">Semua</Button>
              <Button variant="outline" size="xs" radius="md" color="gray" c="gray.8" leftSection={<Icon icon="material-symbols:star-rounded" className="text-yellow-400"/>}>4+</Button>
              <Button variant="outline" size="xs" radius="md" color="gray" c="gray.8" leftSection={<Icon icon="material-symbols:star-rounded" className="text-yellow-400"/>}>4.5+</Button>
              <Button variant="outline" size="xs" radius="md" color="gray" c="gray.8" leftSection={<Icon icon="material-symbols:star-rounded" className="text-yellow-400"/>}>5</Button>
            </Group>
          </Collapse>
        </Stack>
      </Stack>
    </Card>
  );
};

export default FilterTalent;
