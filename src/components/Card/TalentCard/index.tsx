import { useState } from 'react';
import { Card, Flex, Stack, Text, Image, ActionIcon, Badge, Avatar, Rating, Group, Button } from '@mantine/core';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

interface TalentCardProps {
  name: string;
  image: string;
  skills?: string;
  id: number;
  description?: string;
  location?: string;
  rating?: number;
  ratingCount?: number;
  price?: number;
  isVerified?: boolean;
}

const TalentCard = ({ 
  description, 
  name, 
  image, 
  skills, 
  id, 
  location = "Jakarta", 
  rating = 4.9, 
  ratingCount = 128,
  price = 1500000,
  isVerified = true
}: TalentCardProps) => {
  const [bookmark, setBookmark] = useState<boolean>(false);

  // Mock cover image based on skills
  const getCoverImage = (skill: string) => {
    if (skill.toLowerCase().includes('photo')) return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500";
    if (skill.toLowerCase().includes('video')) return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=500";
    if (skill.toLowerCase().includes('sound')) return "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=500";
    if (skill.toLowerCase().includes('lighting')) return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=500";
    if (skill.toLowerCase().includes('mc') || skill.toLowerCase().includes('host')) return "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=500";
    return "https://images.unsplash.com/photo-1522071823991-b1ae055110c4?auto=format&fit=crop&q=80&w=500";
  };

  return (
    <Card 
      withBorder 
      w="100%" 
      radius={12} 
      p={0} 
      className="!shadow-smooth-low hover:!shadow-md transition-all bg-white overflow-hidden border-gray-200 group"
    >
      {/* Cover Photo */}
      <div className="relative h-40">
        <Image 
          src={getCoverImage(skills ?? "")} 
          h={160} 
          w="100%" 
          fallbackSrc="https://placehold.co/400x160?text=Talent+Work"
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge color="green.6" variant="filled" size="sm" radius="xs">
            TERSEDIA
          </Badge>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ActionIcon 
            variant="white" 
            color="gray" 
            radius="md" 
            size="md"
            className="shadow-sm hover:!bg-[#194E9E] hover:!text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              setBookmark(!bookmark);
            }}
          >
            <Icon icon={bookmark ? "lucide:bookmark-check" : "lucide:bookmark"} className={bookmark ? "text-white" : ""} />
          </ActionIcon>
        </div>
      </div>

      <Stack p={16} gap={0}>
        {/* Profile Info Overlaying Cover */}
        <Flex gap={12} align="end" mt={-40} mb={8} className="relative z-10">
          <Avatar 
            src={image} 
            size={64} 
            radius="xl" 
            className="border-4 border-white shadow-sm"
          />
        </Flex>

        {/* Talent Name & Role */}
        <Flex align="center" gap={6}>
          <Text fw={700} size="lg" className="capitalize">{name}</Text>
          {isVerified && (
            <Icon icon="tdesign:verified-filled" className="text-[#194E9E] text-lg"/>
          )}
        </Flex>
        
        <Flex align="center" gap={4}>
           <Text c="dimmed" size="sm" fw={500}>{skills ?? '-'}</Text>
           <Text c="dimmed" size="sm">•</Text>
           <Text c="dimmed" size="sm" fw={500}>Kreator</Text>
        </Flex>

        {/* Rating & Location */}
        <Group gap={12} mt={8}>
          <Flex align="center" gap={4}>
            <Icon icon="material-symbols:star-rounded" className="text-yellow-400 text-lg"/>
            <Text size="sm" fw={600}>{rating}</Text>
            <Text size="xs" c="dimmed">({ratingCount})</Text>
          </Flex>
          <Flex align="center" gap={4}>
            <Icon icon="material-symbols:location-on-rounded" className="text-gray-400 text-lg"/>
            <Text size="sm" c="dimmed">{location}</Text>
          </Flex>
        </Group>

        {/* Bio */}
        <Text size="sm" mt={12} c="gray.7" lineClamp={1}>
          {description}
        </Text>

        {/* Pricing & CTA */}
        <Flex justify="space-between" align="center" mt={20}>
          <Stack gap={0}>
            <Text size="xs" c="dimmed" fw={500}>Mulai dari</Text>
            <Flex align="baseline" gap={2}>
              <Text fw={700} size="md" c="dark.8">
                Rp {price.toLocaleString('id-ID')}
              </Text>
              <Text size="xs" c="dimmed">/ event</Text>
            </Flex>
          </Stack>

          <Button 
            component={Link} 
            href={`/talent/${id}`} 
            variant="outline" 
            color="gray" 
            c="dark.8"
            radius="md" 
            size="xs"
            className="px-4 border-gray-300 hover:!bg-[#194E9E] hover:!text-white hover:!border-[#194E9E] transition-all"
          >
            Lihat Profil
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};

export default TalentCard;
