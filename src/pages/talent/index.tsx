import { useEffect, useState } from 'react';
import TalentCard from '@/components/Card/TalentCard';
import { TalentProps } from '@/utils/globalInterface';
import { Get } from '@/utils/REST';
import empty from '@/assets/icon/vacancy.png';
import Image from 'next/image';
import FilterTalent from '@/components/FilterTalent';
import { Button, Flex, Text, Stack, Container, SimpleGrid, TextInput, Select, Pagination, ActionIcon, Box } from '@mantine/core';
import { Icon } from '@iconify/react/dist/iconify.js';

// Mock data for high-fidelity demonstration
const MOCK_TALENTS = [
  { id: 1, name: "Aldi Ramadhan", image: "https://i.pravatar.cc/150?u=aldi", skills: "Photographer", description: "Spesialis event, konser, dan corporate gathering.", location: "Jakarta", rating: 4.9, ratingCount: 128, price: 1500000 },
  { id: 2, name: "Abdur Rahman", image: "https://i.pravatar.cc/150?u=abdur", skills: "Videographer", description: "Membuat video storytelling yang cinematic.", location: "Bandung", rating: 4.8, ratingCount: 96, price: 2000000 },
  { id: 3, name: "Rizky Pratama", image: "https://i.pravatar.cc/150?u=rizky", skills: "Sound Engineer", description: "Berpengalaman menangani berbagai event skala besar.", location: "Surabaya", rating: 4.9, ratingCount: 72, price: 1200000 },
  { id: 4, name: "Dimas Setiawan", image: "https://i.pravatar.cc/150?u=dimas", skills: "Lighting Designer", description: "Desain lighting kreatif untuk panggung dan event.", location: "Yogyakarta", rating: 4.7, ratingCount: 64, price: 1800000 },
  { id: 5, name: "Fahmi Hidayat", image: "https://i.pravatar.cc/150?u=fahmi", skills: "MC / Host", description: "MC profesional untuk event formal maupun santai.", location: "Jakarta", rating: 4.9, ratingCount: 112, price: 900000 },
  { id: 6, name: "Yudha Kurnia", image: "https://i.pravatar.cc/150?u=yudha", skills: "Photographer", description: "Spesialis foto wedding dan prewedding.", location: "Bali", rating: 4.8, ratingCount: 85, price: 1750000 },
];

const TalentPage = () => {
  const [data, setData] = useState<any[]>(MOCK_TALENTS);
  const [filteredData, setFilteredData] = useState<any[]>(MOCK_TALENTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showFilterSidebar, setShowFilterSidebar] = useState<boolean>(false);

  const getData = () => {
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <Container size="xl" py={40}>
        {/* Page Header */}
        <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap="md" mb={30}>
          <Stack gap={5}>
            <Text size="1.8rem" fw={700} c="dark.8" lineClamp={1}>Semua Talenta</Text>
            <Text c="dimmed" size="sm">Temukan talenta terbaik untuk kebutuhan eventmu</Text>
          </Stack>

          <Button 
            variant="filled" 
            color="#194E9E" 
            radius="md" 
            size="sm"
            leftSection={<Icon icon="solar:user-plus-bold" className="text-lg" />}
          >
            Daftar Talenta
          </Button>
        </Flex>

        {/* Category Pill Buttons + Filter Toggle */}
        <Flex gap={12} wrap="wrap" align="center" mb={24}>
          <Button 
            variant={showFilterSidebar ? "filled" : "outline"} 
            color={showFilterSidebar ? "#194E9E" : "gray"} 
            c={showFilterSidebar ? "white" : "dark.8"}
            radius="xl" 
            size="sm" 
            onClick={() => setShowFilterSidebar(!showFilterSidebar)}
            leftSection={<Icon icon="lucide:sliders-horizontal" />}
            className={!showFilterSidebar ? "border-gray-300" : ""}
          >
            Filtering
          </Button>

          <Button variant="filled" color="#194E9E" radius="xl" size="sm" leftSection={<Icon icon="material-symbols:group" />}>
            Semua Talenta
          </Button>
          <Button variant="outline" color="gray" c="gray.8" radius="xl" size="sm" className="border-gray-300" leftSection={<Icon icon="material-symbols:camera-enhance" />}>
            Photographer
          </Button>
          <Button variant="outline" color="gray" c="gray.8" radius="xl" size="sm" className="border-gray-300" leftSection={<Icon icon="material-symbols:videocam" />}>
            Videographer
          </Button>
          <Button variant="outline" color="gray" c="gray.8" radius="xl" size="sm" className="border-gray-300" leftSection={<Icon icon="material-symbols:equalizer" />}>
            Sound Engineer
          </Button>
        </Flex>

        {/* Main Content: Sidebar + Grid */}
        <Flex gap={30} direction={{ base: 'column', md: 'row' }} align="flex-start">
          {/* Sidebar Filter - Conditional with Animation */}
          {showFilterSidebar && (
            <Box w={{ base: '100%', md: 280 }} className="shrink-0 sticky top-20">
              <FilterTalent 
                setNameFilter={setNameFilter}
                setCategoryFilter={setCategoryFilter}
                categories={[]}
              />
            </Box>
          )}

          {/* Talent Grid */}
          <Stack gap={30} className="flex-1 w-full">
            {filteredData.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: showFilterSidebar ? 3 : 4 }} spacing={20} verticalSpacing={20}>
                {filteredData.map((item) => (
                  <TalentCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    image={item.image} 
                    skills={item.skills}
                    description={item.description}
                    location={item.location}
                    rating={item.rating}
                    ratingCount={item.ratingCount}
                    price={item.price}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Flex direction="column" gap={10} align="center" justify="center" py={100}>
                <Image src={empty} alt='Vacancy' width={120} height={120} />
                <Text c="dimmed" size="lg">Belum ada talent yang ditemukan</Text>
              </Flex>
            )}

          </Stack>
        </Flex>
      </Container>
    </div>
  );
};

export default TalentPage;
