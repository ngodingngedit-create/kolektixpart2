import React, { useEffect, useState, useContext } from 'react';
import { Drawer, ScrollArea, ActionIcon, Button, Text, Flex, Image, Stack, Divider, Group } from '@mantine/core';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { AppMainContext } from '@/pages/_app';
import { notifications } from '@mantine/notifications';

import { useMediaQuery } from '@mantine/hooks';

interface CartItem {
  variant_id: number;
  product_id: number;
  qty: number;
  price: number;
  product_name?: string;
  image_url?: string;
  varian_name?: string;
}

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ opened, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { setCartCount } = useContext(AppMainContext);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Load items from cookie when opened
  useEffect(() => {
    if (opened) {
      const savedCart = Cookies.get('_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    }
  }, [opened]);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    Cookies.set('_cart', JSON.stringify(newItems));
    const totalQty = newItems.reduce((acc, item) => acc + item.qty, 0);
    if (setCartCount) {
      setCartCount(totalQty);
    }
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const newItems = [...cartItems];
    const newQty = newItems[index].qty + delta;
    if (newQty > 0) {
      newItems[index].qty = newQty;
      updateCart(newItems);
    } else {
      handleRemoveItem(index);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    updateCart(newItems);
    notifications.show({
      message: 'Item berhasil dihapus dari keranjang',
      color: 'blue',
      icon: <Icon icon="solar:trash-bin-minimalistic-bold" />,
    });
  };

  const handleClearAll = () => {
    updateCart([]);
    notifications.show({
      message: 'Keranjang telah dikosongkan',
      color: 'blue',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? '100%' : 'md'}
      title={
        <Group justify="space-between" style={{ width: '100%', paddingRight: isMobile ? '10px' : '40px' }} wrap="nowrap">
          <Flex align="center" gap={isMobile ? 6 : 10}>
            <Icon icon="solar:cart-large-bold-duotone" className={`text-blue-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <Text fw={900} size={isMobile ? "md" : "xl"}>Keranjang Belanja</Text>
          </Flex>
          {cartItems.length > 0 && (
            <ActionIcon 
              variant="subtle" 
              color="red" 
              onClick={handleClearAll}
              title="Kosongkan Keranjang"
              size={isMobile ? "sm" : "md"}
            >
              <Icon icon="solar:trash-bin-minimalistic-bold" className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
            </ActionIcon>
          )}
        </Group>
      }
      styles={{
        header: {
          borderBottom: '1px solid rgb(227, 227, 227)',
          padding: '20px',
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 80px)',
        },
      }}
    >
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-5">
          {cartItems.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py={100} gap={20}>
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon icon="solar:cart-cross-bold-duotone" className="text-blue-200 w-12 h-12" />
              </div>
              <Text c="dimmed" fw={600}>Keranjang Anda masih kosong</Text>
              <Button 
                variant="light" 
                color="blue" 
                onClick={onClose}
                radius="xl"
              >
                Mulai Belanja
              </Button>
            </Flex>
          ) : (
            <Stack gap={15}>
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.product_id}-${item.variant_id}-${index}`}
                  className="bg-white border border-[rgb(227,227,227)] rounded-2xl p-4 flex gap-4 transition-all hover:border-blue-200"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-[rgb(227,227,227)]">
                    <Image 
                      src={item.image_url || '/default-image.jpg'} 
                      alt={item.product_name}
                      fit="cover"
                      h="100%"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Text fw={900} size="sm" className="line-clamp-1">{item.product_name}</Text>
                      {item.varian_name && (
                        <Text size="xs" c="dimmed" fw={600}>Varian: {item.varian_name}</Text>
                      )}
                      <Text fw={900} size="md" c="blue" mt={2}>{formatPrice(item.price)}</Text>
                    </div>

                    <Flex justify="space-between" align="center" mt={10}>
                      <Group gap={12} className="bg-gray-100 rounded-full p-1 border border-[rgb(227,227,227)]">
                        <ActionIcon 
                          size="md" 
                          variant="default" 
                          radius="xl"
                          onClick={() => handleQuantityChange(index, -1)}
                          className="!bg-white !border-[rgb(227,227,227)] shadow-sm hover:!bg-gray-50"
                        >
                          <Icon icon="tabler:minus" className="w-4 h-4 !text-[#1C41D6]" />
                        </ActionIcon>
                        <Text size="sm" fw={900} w={24} ta="center" c="dark">{item.qty}</Text>
                        <ActionIcon 
                          size="md" 
                          variant="default" 
                          radius="xl"
                          onClick={() => handleQuantityChange(index, 1)}
                          className="!bg-white !border-[rgb(227,227,227)] shadow-sm hover:!bg-gray-50"
                        >
                          <Icon icon="tabler:plus" className="w-4 h-4 !text-[#1C41D6]" />
                        </ActionIcon>
                      </Group>

                      <ActionIcon 
                        variant="subtle" 
                        color="gray" 
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Icon icon="solar:trash-bin-minimalistic-linear" className="w-6 h-6" />
                      </ActionIcon>
                    </Flex>
                  </div>
                </div>
              ))}
            </Stack>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[rgb(227,227,227)] bg-white">
            <Flex justify="space-between" align="center" mb={20}>
              <Text fw={700} c="dimmed">Total Pembayaran</Text>
              <Text fw={900} size="xl" color="blue">{formatPrice(totalPrice)}</Text>
            </Flex>
            
            <Stack gap={10}>
              <Button 
                size="lg" 
                radius="xl" 
                fullWidth
                onClick={() => {
                  onClose();
                  router.push('/merch-cart');
                }}
                color="blue"
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                Lihat Semua
              </Button>
              <Button 
                variant="subtle" 
                color="gray" 
                onClick={onClose}
                radius="xl"
                size="md"
              >
                Lanjutkan Belanja
              </Button>
            </Stack>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
