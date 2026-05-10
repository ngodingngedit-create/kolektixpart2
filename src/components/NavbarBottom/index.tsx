import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
import useLoggedUser from '@/utils/useLoggedUser';
import { Indicator } from '@mantine/core';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  image?: string;
  path: string;
  activePaths: string[];
  badgeCount?: number;
  isAction?: boolean;
  isCenter?: boolean;
}

const NavbarBottom: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const [cartCount, setCartCount] = useState(0);
  const [isSearchActiveLocal, setIsSearchActiveLocal] = useState(false);


  // Cek apakah ini halaman yang harus menyembunyikan navbar
  const isExcludedPage = pathname.includes('/pilih-jadwal') || (pathname.startsWith('/event/') && pathname !== '/event');

  // Ambil jumlah cart dari cookies
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(Cookies.get('_cart') ?? '[]') as { qty: number }[];
      const total = cartItems.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(total);
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 2000);
    return () => clearInterval(interval);
  }, []);

  // Reset local search active state when navigating to other pages
  useEffect(() => {
    if (pathname !== '/search') {
      setIsSearchActiveLocal(false);
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'solar:home-2-linear',
      image: '/mobilenavbar/home.png',
      path: '/',
      activePaths: ['/', '/home']
    },
    {
      id: 'tracking',
      label: 'Tracking',
      icon: 'solar:scanner-linear',
      path: '/tracking',
      activePaths: ['/tracking'],
    },
    {
      id: 'event',
      label: 'Event',
      icon: 'solar:calendar-minimalistic-linear',
      path: '/event',
      activePaths: ['/event', '/event/'],
      isCenter: true
    },
    {
      id: 'merch',
      label: 'Merch',
      icon: 'solar:t-shirt-linear',
      path: '/merchandise',
      activePaths: ['/merchandise', '/merchandise/'],
      badgeCount: cartCount
    },
    {
      id: 'search',
      label: 'Cari',
      icon: 'solar:magnifer-linear',
      path: '/search',
      activePaths: ['/search'],
      isAction: true
    }
  ];

  const isActive = (item: NavItem) => {
    // If search is locally active, only search should be active
    if (isSearchActiveLocal) {
      return item.id === 'search';
    }

    // Normal path-based logic
    const pathActive = item.activePaths.some(path =>
      pathname === path ||
      (path !== '/' && pathname.startsWith(path))
    );

    return pathActive;
  };


  const getIcon = (item: NavItem, active: boolean) => {
    if (active) {
      return item.icon.replace('-linear', '-bold');
    }
    return item.icon;
  };

  const handleSearchClick = () => {
    setIsSearchActiveLocal(!isSearchActiveLocal);
    const searchButton = document.querySelector('button[aria-label="Search"], button[title*="Cari"]') as HTMLButtonElement;
    if (searchButton) {
      searchButton.click();
    } else {
      router.push('/search');
    }
  };


  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);



    const content = (
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        {/* Active Line Indicator (Clipped by container for perfect curved fit) */}
        {active && (
          <div className="absolute -top-[10px] w-8 h-[2.5px] bg-[#0b387c] rounded-b-full shadow-[0_1px_8px_rgba(11,56,124,0.4)] animate-in fade-in slide-in-from-top-1 duration-500 z-50 left-1/2 -translate-x-1/2" />
        )}

        <div className={`relative transition-all duration-300 ${active ? 'scale-100 -translate-y-0.5' : ''}`}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.label}
              className={`w-[24px] h-[24px] object-contain transition-all duration-300 ${active ? '' : 'grayscale opacity-70'}`}
            />
          ) : (
            item.badgeCount && item.badgeCount > 0 ? (
              <Indicator
                inline
                label={item.badgeCount > 99 ? '99+' : item.badgeCount}
                size={16}
                color="red"
                offset={2}
                withBorder
              >
                <Icon
                  icon={getIcon(item, active)}
                  className={`text-2xl transition-colors duration-300 ${active ? 'text-[#0b387c]' : 'text-[#999999]'
                    }`}
                />
              </Indicator>
            ) : (
              <Icon
                icon={getIcon(item, active)}
                className={`text-2xl transition-colors duration-300 ${active ? 'text-[#0b387c]' : 'text-[#999999]'
                  }`}
              />
            )
          )}
        </div>

        <span className={`text-[10px] mt-0.5 transition-all duration-300 ${active ? 'text-[#0b387c] font-bold' : 'text-[#999999] font-medium'
          }`}>
          {item.label}
        </span>
      </div>
    );

    if (item.isAction) {
      return (
        <button
          key={item.id}
          onClick={item.id === 'search' ? handleSearchClick : undefined}
          className="flex-1 flex justify-center"
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.path}
        onClick={() => setIsSearchActiveLocal(false)}
        className="flex-1 flex justify-center"
      >
        {content}
      </Link>
    );

  };

  if (isExcludedPage) return null;

  return (
    <>
      {/* Spacer */}
      <div className="h-20 md:hidden"></div>

      {/* Navbar Bottom Modern */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white rounded-t-[24px] shadow-[0_-12px_30px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-2 py-3 flex justify-around items-center h-16">
          {navItems.map(renderNavItem)}
        </div>

        {/* Safe area for modern mobile browsers */}
        <div className="h-safe-bottom"></div>
      </div>

      <style jsx>{`
        .h-safe-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </>
  );
};

export default NavbarBottom;