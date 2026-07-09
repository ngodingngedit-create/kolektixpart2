// import { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import { MerchProps } from "@/utils/globalInterface";
// import MerchandiseCard from "@/components/Card/MerchandiseCard";
// import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
// import { Get } from "@/utils/REST";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCartShopping, faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { MerchListResponse } from "../dashboard/merch/type";
// import { Text, Loader, Center } from "@mantine/core";
// import useLoggedUser from "@/utils/useLoggedUser";
// import { BookmarkListResponse } from "@/types/bookmark";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
// import { modals } from "@mantine/modals";
// import fetch from "@/utils/fetch";
// import { BookmarkRequest } from "@/types/bookmark";

// interface ApiResponse {
//   data: MerchListResponse[];
//   total?: number;
//   current_page?: number;
//   last_page?: number;
//   per_page?: number;
//   // Coba berbagai kemungkinan struktur response
//   meta?: {
//     total: number;
//     current_page: number;
//     last_page: number;
//     per_page: number;
//   };
// }

// const Merchandise = () => {
//   const [categoryActive, setCategoryActive] = useState<string>();
//   const [data, setData] = useState<MerchListResponse[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingMore, setLoadingMore] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [total, setTotal] = useState<number>(0);
//   const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

//   const users = useLoggedUser();
//   const isLoggedIn = !!users?.name;

//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const loadMoreRef = useRef<HTMLDivElement>(null);

//   const getData = useCallback(
//     async (pageNum: number = 1, isLoadMore: boolean = false) => {
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       try {
//         console.log(`Fetching page ${pageNum} with limit 10...`);

//         // Coba tanpa parameter dulu untuk debugging
//         const res = (await Get("product", {
//           page: pageNum,
//           limit: 10,
//         })) as any;

//         console.log("API Response:", res);

//         // Debug: Tampilkan struktur response
//         console.log("Response structure:", {
//           data: res.data,
//           hasDataProperty: res.hasOwnProperty("data"),
//           isArray: Array.isArray(res.data),
//           keys: Object.keys(res),
//           meta: res.meta,
//         });

//         let apiData: ApiResponse;
//         let filteredData: MerchListResponse[];
//         let totalItems: number;
//         let lastPage: number;

//         // Handle berbagai kemungkinan struktur response
//         if (Array.isArray(res.data)) {
//           // Case 1: response.data adalah array langsung
//           filteredData = res.data.filter((e: MerchListResponse) => e.product_status_id == 2);
//           apiData = { data: res.data };
//           totalItems = res.total || res.data.length;
//           lastPage = res.last_page || Math.ceil(totalItems / 10);
//         } else if (res.data && Array.isArray(res.data.data)) {
//           // Case 2: response.data.data adalah array (Laravel pagination default)
//           filteredData = res.data.data.filter((e: MerchListResponse) => e.product_status_id == 2);
//           apiData = res.data;
//           totalItems = res.data.total || res.data.data.length;
//           lastPage = res.data.last_page || Math.ceil(totalItems / 10);
//         } else if (Array.isArray(res)) {
//           // Case 3: response langsung array (tanpa wrapper)
//           filteredData = res.filter((e: MerchListResponse) => e.product_status_id == 2);
//           apiData = { data: res };
//           totalItems = res.length;
//           lastPage = Math.ceil(totalItems / 10);
//         } else {
//           console.error("Unexpected API response structure:", res);
//           toast.error("Format response API tidak dikenali");
//           filteredData = [];
//           totalItems = 0;
//           lastPage = 1;
//         }

//         if (isLoadMore) {
//           setData((prev) => [...prev, ...filteredData]);
//         } else {
//           setData(filteredData);
//         }

//         setTotal(totalItems);
//         setHasMore(pageNum < lastPage);

//         console.log(`Loaded ${filteredData.length} items, total: ${totalItems}, hasMore: ${pageNum < lastPage}`);

//         // Load bookmarks from user data
//         if (users?.bookmarked) {
//           const merchandiseBookmarks = users.bookmarked.filter((e: any) => e.type === "Merchandise" || e.module_id === 2);
//           const bookmarkedProductIds = merchandiseBookmarks.map((item) => item.product_id || item.event_id || item.id);
//           setBookmarkedIds(new Set(bookmarkedProductIds));
//         }
//       } catch (err: any) {
//         console.error("Error fetching merchandise:", err);

//         // Tampilkan error detail untuk debugging
//         if (err.response) {
//           console.error("Error response:", err.response.data);
//           console.error("Error status:", err.response.status);
//           toast.error(`Gagal memuat merchandise: ${err.response.status} ${err.response.data?.message || ""}`);
//         } else if (err.request) {
//           console.error("No response received:", err.request);
//           toast.error("Tidak ada respons dari server");
//         } else {
//           console.error("Error message:", err.message);
//           toast.error(`Gagal memuat merchandise: ${err.message}`);
//         }

//         // Fallback: coba ambil semua data tanpa pagination
//         if (!isLoadMore) {
//           try {
//             console.log("Trying fallback fetch without pagination...");
//             const fallbackRes = (await Get("product", {})) as any;
//             let fallbackData: MerchListResponse[] = [];

//             if (Array.isArray(fallbackRes.data)) {
//               fallbackData = fallbackRes.data.filter((e: MerchListResponse) => e.product_status_id == 2);
//             } else if (fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
//               fallbackData = fallbackRes.data.data.filter((e: MerchListResponse) => e.product_status_id == 2);
//             } else if (Array.isArray(fallbackRes)) {
//               fallbackData = fallbackRes.filter((e: MerchListResponse) => e.product_status_id == 2);
//             }

//             setData(fallbackData);
//             setHasMore(false); // Nonaktifkan infinite scroll untuk fallback

//             console.log(`Fallback loaded ${fallbackData.length} items`);
//           } catch (fallbackErr) {
//             console.error("Fallback also failed:", fallbackErr);
//           }
//         }
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [users?.bookmarked],
//   );

//   useEffect(() => {
//     getData(1, false);
//   }, [getData]);

//   // Setup intersection observer for infinite scroll
//   useEffect(() => {
//     if (!hasMore || loading || loadingMore) return;

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loadingMore) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           getData(nextPage, true);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       },
//     );

//     if (loadMoreRef.current) {
//       observerRef.current.observe(loadMoreRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [hasMore, loading, loadingMore, page, getData]);

//   // Update bookmarks when user data changes
//   useEffect(() => {
//     if (users?.bookmarked) {
//       const merchandiseBookmarks = users.bookmarked.filter((e: any) => e.type === "Merchandise" || e.module_id === 2);
//       const bookmarkedProductIds = merchandiseBookmarks.map((item) => item.product_id || item.event_id || item.id);
//       setBookmarkedIds(new Set(bookmarkedProductIds));
//     } else {
//       setBookmarkedIds(new Set());
//     }
//   }, [users]);

//   const flashSaleProduct = useMemo(() => {
//     return data.filter((e) => e.add_to_flash_sale);
//   }, [data]);

//   const toggleBookmark = async (productId: number) => {
//     if (!isLoggedIn) {
//       toast.error("Silakan login untuk menyimpan bookmark");
//       return;
//     }

//     const isBookmarked = bookmarkedIds.has(productId);
//     const existingBookmark = users?.bookmarked?.find((e: any) => (e.product_id === productId || e.event_id === productId) && (e.type === "Merchandise" || e.module_id === 2));

//     if (isBookmarked || existingBookmark) {
//       // Show confirmation modal for removal
//       modals.openConfirmModal({
//         centered: true,
//         title: "Hapus dari bookmark",
//         children: "Apakah kamu yakin ingin menghapus merchandise ini dari bookmark?",
//         labels: { cancel: "Batal", confirm: "Hapus" },
//         onConfirm: async () => {
//           await handleRemoveBookmark(productId, existingBookmark?.id);
//         },
//       });
//     } else {
//       await handleAddBookmark(productId);
//     }
//   };

//   const handleAddBookmark = async (productId: number) => {
//     try {
//       await fetch<any, BookmarkListResponse>({
//         url: "bookmark-user",
//         method: "POST",
//         data: {
//           module_id: 2, // 2 untuk merchandise (1 untuk event)
//           type: "Merchandise",
//           product_id: productId,
//         } as BookmarkRequest,
//         success: (response) => {
//           // Update local state
//           setBookmarkedIds((prev) => new Set(prev).add(productId));

//           // Update cookies
//           const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
//           Cookies.set("bookmarked", JSON.stringify([...data, response.data]));

//           toast.success("Berhasil menambahkan ke bookmark");
//         },
//         error: () => {
//           toast.error("Gagal menambahkan bookmark");
//         },
//       });
//     } catch (error) {
//       console.error("Error adding bookmark:", error);
//       toast.error("Gagal menambahkan bookmark");
//     }
//   };

//   const handleRemoveBookmark = async (productId: number, bookmarkId?: number) => {
//     try {
//       // Cari bookmark ID jika tidak tersedia
//       let idToDelete = bookmarkId;
//       if (!idToDelete) {
//         const existingBookmark = users?.bookmarked?.find((e: any) => (e.product_id === productId || e.event_id === productId) && (e.type === "Merchandise" || e.module_id === 2));
//         idToDelete = existingBookmark?.id;
//       }

//       if (!idToDelete) {
//         toast.error("Gagal menghapus bookmark");
//         return;
//       }

//       await fetch<any, any>({
//         url: `bookmark/${idToDelete}`,
//         method: "DELETE",
//         success: () => {
//           // Update local state
//           setBookmarkedIds((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(productId);
//             return newSet;
//           });

//           // Update cookies
//           const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
//           Cookies.set("bookmarked", JSON.stringify(data.filter((e: any) => e.id !== idToDelete && !(e.product_id === productId && (e.type === "Merchandise" || e.module_id === 2)))));

//           toast.success("Berhasil menghapus dari bookmark");
//         },
//         error: () => {
//           toast.error("Gagal menghapus bookmark");
//         },
//       });
//     } catch (error) {
//       console.error("Error removing bookmark:", error);
//       toast.error("Gagal menghapus bookmark");
//     }
//   };

//   // Handle manual load more button
//   const handleLoadMore = () => {
//     if (!loadingMore && hasMore) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       getData(nextPage, true);
//     }
//   };

//   const category = ["Merchandise", "Merchandise 2", "Merchandise 3", "Merchandise 4"];

//   return (
//     <div className="py-10 md:pt-12 max-w-5xl mx-auto text-dark !mt-[0px] md:mt-0">
//       <div className="pl-7">
//         <Breadcrumbs>
//           <BreadcrumbItem>Beranda</BreadcrumbItem>
//           <BreadcrumbItem>List Merchandise</BreadcrumbItem>
//         </Breadcrumbs>
//       </div>

//       {loading && !loadingMore ? (
//         <Center className="min-h-[50vh]">
//           <Loader size="lg" />
//           <span className="ml-2">Memuat merchandise...</span>
//         </Center>
//       ) : (
//         <>
//           {flashSaleProduct.length > 0 && (
//             <>
//               <Text px={20} mt={15} size="xl" mb={-10} fw={600}>
//                 Flash Sale
//               </Text>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 content-center justify-items-center gap-[10px] md:gap-[15px] my-5 px-[20px]">
//                 {flashSaleProduct.map((item) => (
//                   <MerchandiseCard
//                     key={`flash-${item.id}`}
//                     id={item.id}
//                     name={item.product_name}
//                     price={parseInt((item?.product_varian?.length ?? 0) > 0 ? item.product_varian[0].price : item.price)}
//                     sale={0}
//                     creator={item.creator.name}
//                     creatorid={item.creator.id}
//                     creatorImage={item.creator.image_url}
//                     redirect={`/merchandise/${item.slug}`}
//                     image={item.product_image.length > 0 ? item.product_image[0].image_url : undefined}
//                     location={item.has_store_location?.store_name}
//                     isBookmarked={bookmarkedIds.has(item.id)}
//                     onBookmarkToggle={toggleBookmark}
//                     showBookmark={isLoggedIn}
//                   />
//                 ))}
//               </div>
//             </>
//           )}

//           <Text px={20} mt={15} size="xl" mb={-10} fw={600}>
//             Semua Merchandise
//           </Text>

//           {data.length > 0 ? (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 content-center justify-items-center gap-[10px] md:gap-[15px] my-5 px-[20px]">
//                 {data.map((item, index) => (
//                   <MerchandiseCard
//                     key={`merch-${item.id}-${index}`}
//                     id={item.id}
//                     name={item.product_name}
//                     price={parseInt((item?.product_varian?.length ?? 0) > 0 ? (item.product_varian[0].price ?? 0) : (item.price ?? 0))}
//                     sale={0}
//                     creator={item.creator?.name ?? "Unknown Creator"}
//                     creatorid={item.creator?.id}
//                     creatorImage={item.creator?.image_url}
//                     redirect={`/merchandise/${item.slug}`}
//                     image={item.product_image?.length > 0 ? item.product_image[0].image_url : undefined}
//                     location={item.has_store_location?.store_name}
//                     isBookmarked={bookmarkedIds.has(item.id)}
//                     onBookmarkToggle={toggleBookmark}
//                     showBookmark={isLoggedIn}
//                     productVariants={item.product_varian as any[]}
//                   />
//                 ))}
//               </div>

//               {/* Loading indicator and observer trigger */}
//               <div ref={loadMoreRef} className="py-6 text-center">
//                 {loadingMore && (
//                   <Center>
//                     <Loader size="sm" />
//                     <span className="ml-2">Memuat merchandise...</span>
//                   </Center>
//                 )}

//                 {/* Optional: Show load more button for mobile or as fallback */}
//                 {!loadingMore && hasMore && data.length > 0 && (
//                   <div className="space-y-4">
//                     <button onClick={handleLoadMore} className="mt-4 px-6 py-2 bg-primary-base text-white rounded-lg hover:bg-primary-dark transition-colors">
//                       Muat Lebih Banyak
//                     </button>
//                     <p className="text-sm text-gray-500">Scroll ke bawah untuk memuat otomatis</p>
//                   </div>
//                 )}

//                 {/* {!hasMore && data.length > 0 && (
//                   <p className="text-gray-500 py-4">
//                     Menampilkan semua {data.length} merchandise
//                   </p>
//                 )} */}
//               </div>
//             </>
//           ) : (
//             <div className="min-h-[80vh] flex flex-col gap-3 items-center justify-center">
//               <FontAwesomeIcon icon={faCartShopping} size="2x" className="text-primary-base" />
//               <h3 className="text-grey">Belum ada merchandise</h3>
//               <button onClick={() => getData(1, false)} className="mt-4 px-4 py-2 bg-primary-base text-white rounded hover:bg-primary-dark transition-colors">
//                 Coba Muat Ulang
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Merchandise;

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Get } from "@/utils/REST";
import MerchandiseCard from "@/components/Card/MerchandiseCard";
import { Text, Loader, Center, Button, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useLoggedUser from "@/utils/useLoggedUser";
import { toast } from "react-toastify";
import { modals } from "@mantine/modals";
import fetch from "@/utils/fetch";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal, TextInput, Divider, ActionIcon, Drawer } from "@mantine/core";
import { MerchListResponse } from "../dashboard/merch/type";
import { BookmarkListResponse, BookmarkRequest } from "@/types/bookmark";

// ============ TYPE DEFINITIONS ============
type MerchListResponseWithVerified = MerchListResponse & {
  creator: (MerchListResponse['creator'] & { is_verified?: boolean | number });
};

const Merchandise = () => {
  // ============ STATE ============
  const [data, setData] = useState<MerchListResponseWithVerified[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  // Cache list of creators persistently
  const [allLoadedCreators, setAllLoadedCreators] = useState<any[]>([]);

  // ============ HORIZONTAL FILTER SLIDER STATES & HANDLERS ============
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  const updateArrowVisibility = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  const syncActiveIndicator = useCallback(() => {
    if (scrollRef.current) {
      const targetId = selectedCreator || "semua";
      const activeButton = scrollRef.current.querySelector(`[data-creator-id="${targetId}"]`) as HTMLButtonElement;
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth
        });
      }
    }
  }, [selectedCreator]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateArrowVisibility, 350);
    }
  };


  
  const users = useLoggedUser();
  const isLoggedIn = !!users?.name;

  // ============ REFS ============
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // ============ CACHE CREATOR ============
  const [creatorCache, setCreatorCache] = useState<Record<number, boolean>>({});
  const cacheRef = useRef<Record<number, boolean>>({});
  const isFetchingCreators = useRef(false);
  const pendingCreatorFetch = useRef<Set<number>>(new Set());

  // ============ SCROLL DETECTION ============
  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // ============ INITIAL LOAD ============
  useEffect(() => {
    loadInitialData();
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // ============ PERSISTENT CREATORS CACHE ============
  useEffect(() => {
    if (data.length > 0) {
      const creators = new Map();
      data.forEach(item => {
        if (item.creator?.id && item.creator?.name) {
          creators.set(item.creator.id, {
            id: item.creator.id,
            name: item.creator.name
          });
        }
      });
      
      setAllLoadedCreators(prev => {
        const nextMap = new Map();
        prev.forEach(c => nextMap.set(c.id, c));
        creators.forEach(c => nextMap.set(c.id, c));
        return Array.from(nextMap.values());
      });
    }
  }, [data]);

  // ============ RESET WHEN FILTER CHANGE ============
  useEffect(() => {
    if (selectedCreator !== null) {
      resetAndLoad();
    }
  }, [selectedCreator]);

  // ============ SETUP INTERSECTION OBSERVER ============
  useEffect(() => {
    if (loading || !hasMore || loadingMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isFetchingRef.current) {
          loadMoreData();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadingMore, currentPage]);

  // ============ UPDATE BOOKMARKS ============
  useEffect(() => {
    if (users?.bookmarked) {
      const bookmarkedIds = users.bookmarked
        .filter((e: any) => e.type === "Merchandise" || e.module_id === 2)
        .map((item: any) => item.product_id || item.event_id || item.id);
      setBookmarkedIds(new Set(bookmarkedIds));
    }
  }, [users]);

  // ============ LOAD INITIAL DATA ============
  const loadInitialData = async () => {
    if (initialLoadDoneRef.current) return;
    
    setLoading(true);
    setData([]);
    setCurrentPage(1);
    isFetchingRef.current = true;
    
    try {
      console.log('📦 Fetching initial page...');
      const response = await Get("product", { page: 1, limit: 10 }) as any;
      
      // Parse response
      let products: MerchListResponseWithVerified[] = [];
      let lastPage = 1;
      
      if (response.data?.last_page) {
        lastPage = response.data.last_page;
        products = (response.data.data || []).filter((e: any) => e.product_status_id == 2);
      } else if (response.meta?.last_page) {
        lastPage = response.meta.last_page;
        products = (response.data || []).filter((e: any) => e.product_status_id == 2);
      } else if (response.last_page) {
        lastPage = response.last_page;
        products = (response.data || []).filter((e: any) => e.product_status_id == 2);
      }
      
      setData(products);
      setTotalPages(lastPage);
      setHasMore(lastPage > 1);
      initialLoadDoneRef.current = true;
      
      console.log(`📊 Page 1/${lastPage} | Items: ${products.length}`);
      
      // Fetch creators untuk initial data
      await fetchCreatorsForProducts(products);
      
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // ============ LOAD MORE DATA ============
  const loadMoreData = async () => {
    if (isFetchingRef.current || !hasMore || loadingMore || currentPage >= totalPages) return;
    
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    isFetchingRef.current = true;
    
    try {
      console.log(`⏳ Loading page ${nextPage}...`);
      
      // Delay 1.5 detik antar request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await Get("product", { page: nextPage, limit: 10 }) as any;
      
      // Parse response
      let newProducts: MerchListResponseWithVerified[] = [];
      
      if (response.data?.data) {
        newProducts = response.data.data.filter((e: any) => e.product_status_id == 2);
      } else if (response.data) {
        newProducts = (Array.isArray(response.data) ? response.data : [])
          .filter((e: any) => e.product_status_id == 2);
      }
      
      if (newProducts.length > 0) {
        setData(prev => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < totalPages);
        
        console.log(`✅ Page ${nextPage}/${totalPages} loaded | +${newProducts.length} items`);
        
        // Fetch creators untuk produk baru
        await fetchCreatorsForProducts(newProducts);
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error(`❌ Error loading page ${nextPage}:`, error);
      toast.error("Gagal memuat data tambahan");
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  // ============ FETCH CREATORS FOR PRODUCTS ============
  const fetchCreatorsForProducts = async (products: MerchListResponseWithVerified[]) => {
    // Kumpulin unique creator IDs yang belum di-fetch
    const creatorIds = Array.from(new Set(
      products
        .map(item => item.creator?.id)
        .filter((id): id is number => 
          id !== undefined && 
          id !== null && 
          !cacheRef.current.hasOwnProperty(id) &&
          !pendingCreatorFetch.current.has(id)
        )
    ));
    
    if (creatorIds.length === 0 || isFetchingCreators.current) return;
    
    // Tandai sebagai pending
    creatorIds.forEach(id => pendingCreatorFetch.current.add(id));
    
    // Fetch satu per satu dengan delay 500ms
    for (let i = 0; i < creatorIds.length; i++) {
      const id = creatorIds[i];
      
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      try {
        console.log(`👤 Fetching creator ${id}...`);
        const res = await window.fetch(`${process.env.NEXT_PUBLIC_WS_URL}creator/${id}`);
        
        if (res.ok) {
          const result = await res.json();
          const data = result.data || result;
          const isVerified = data.is_verified == 1 || data.is_verified == true;
          
          // Update cache
          cacheRef.current[id] = isVerified;
          setCreatorCache({ ...cacheRef.current });
          
          // Update data yang sudah ada
          setData(prev => prev.map(item => {
            if (item.creator?.id === id) {
              return {
                ...item,
                creator: {
                  ...item.creator,
                  is_verified: isVerified ? 1 : 0
                }
              };
            }
            return item;
          }));
        }
      } catch (e) {
        console.error(`Error fetch creator ${id}:`, e);
        cacheRef.current[id] = false;
      } finally {
        pendingCreatorFetch.current.delete(id);
      }
    }
  };

  // ============ RESET AND LOAD ============
  const resetAndLoad = () => {
    // Reset semua state
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setLoading(true);
    initialLoadDoneRef.current = false;
    isFetchingRef.current = false;
    
    // Cancel pending fetches
    pendingCreatorFetch.current.clear();
    
    // Load ulang
    loadInitialData();
  };

  // ============ MEMOIZED ============
  const flashSaleProduct = useMemo(() => {
    return data.filter(e => e.add_to_flash_sale);
  }, [data]);

  const uniqueCreators = useMemo(() => {
    const creators = new Map();
    data.forEach(item => {
      if (item.creator?.id && item.creator?.name) {
        creators.set(item.creator.id, {
          id: item.creator.id,
          name: item.creator.name
        });
      }
    });
    
    const realCreators = Array.from(creators.values()).sort((a, b) => a.name.localeCompare(b.name));
    
    const mockCreators = [
      { id: 9901, name: "moofeet" },
      { id: 9902, name: "Abiboy" },
      { id: 9903, name: "subculturemerch" },
      { id: 9904, name: "MCL" },
      { id: 9905, name: "Karina Christy" },
      { id: 9906, name: "Sir Dandy" },
      { id: 9907, name: "Solear Records" },
      { id: 9908, name: "Los Panturas Mart" },
      { id: 9909, name: "Ten Holes" },
      { id: 9910, name: "Setengah Limart" },
      { id: 9911, name: "Geral Idgitaf" },
      { id: 9912, name: "The Jansen" }
    ];

    const allCreatorsMap = new Map();
    realCreators.forEach(c => allCreatorsMap.set(c.name.toLowerCase(), c));
    mockCreators.forEach(c => {
      if (!allCreatorsMap.has(c.name.toLowerCase())) {
        allCreatorsMap.set(c.name.toLowerCase(), c);
      }
    });

    return Array.from(allCreatorsMap.values());
  }, [allLoadedCreators]);

  // ============ SLIDER ARROWS & INDICATOR SYNC ============
  useEffect(() => {
    const syncAll = () => {
      updateArrowVisibility();
      syncActiveIndicator();
    };

    const timer = setTimeout(syncAll, 150);

    window.addEventListener("resize", syncAll);
    return () => {
      window.removeEventListener("resize", syncAll);
      clearTimeout(timer);
    };
  }, [uniqueCreators, selectedCreator, updateArrowVisibility, syncActiveIndicator]);

  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) return uniqueCreators;
    return uniqueCreators.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueCreators, searchQuery]);

  const filteredData = useMemo(() => {
    if (!selectedCreator) return data;
    return data.filter(item => item.creator?.id === parseInt(selectedCreator));
  }, [data, selectedCreator]);

  // ============ BOOKMARK HANDLERS ============
  const toggleBookmark = async (productId: number) => {
    if (!isLoggedIn) {
      toast.error("Silakan login untuk menyimpan bookmark");
      return;
    }

    const isBookmarked = bookmarkedIds.has(productId);
    const existingBookmark = users?.bookmarked?.find((e: any) => 
      (e.product_id === productId || e.event_id === productId) && 
      (e.type === "Merchandise" || e.module_id === 2)
    );

    if (isBookmarked || existingBookmark) {
      modals.openConfirmModal({
        centered: true,
        title: "Hapus dari bookmark",
        children: "Apakah kamu yakin ingin menghapus merchandise ini dari bookmark?",
        labels: { cancel: "Batal", confirm: "Hapus" },
        onConfirm: async () => {
          await handleRemoveBookmark(productId, existingBookmark?.id);
        },
      });
    } else {
      await handleAddBookmark(productId);
    }
  };

  const handleAddBookmark = async (productId: number) => {
    try {
      await fetch<any, BookmarkListResponse>({
        url: "bookmark-user",
        method: "POST",
        data: {
          module_id: 2,
          type: "Merchandise",
          product_id: productId,
        } as BookmarkRequest,
        success: (response) => {
          setBookmarkedIds((prev) => new Set(prev).add(productId));
          const data = JSON.parse(Cookies.get("bookmarked") ?? "[]");
          Cookies.set("bookmarked", JSON.stringify([...data, response.data]));
          toast.success("Berhasil menambahkan ke bookmark");
        },
        error: () => {
          toast.error("Gagal menambahkan bookmark");
        },
      });
    } catch (error) {
      console.error("Error adding bookmark:", error);
      toast.error("Gagal menambahkan bookmark");
    }
  };

  const handleRemoveBookmark = async (productId: number, bookmarkId?: number) => {
    try {
      let idToDelete = bookmarkId;
      if (!idToDelete) {
        const existingBookmark = users?.bookmarked?.find((e: any) => 
          (e.product_id === productId || e.event_id === productId) && 
          (e.type === "Merchandise" || e.module_id === 2)
        );
        idToDelete = existingBookmark?.id;
      }

      if (!idToDelete) {
        toast.error("Gagal menghapus bookmark");
        return;
      }

      await fetch<any, any>({
        url: `bookmark/${idToDelete}`,
        method: "DELETE",
        success: () => {
          setBookmarkedIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          const data = JSON.parse(Cookies.get("bookmarked") ?? "[]");
          Cookies.set("bookmarked", JSON.stringify(data.filter((e: any) => 
            e.id !== idToDelete && !(e.product_id === productId && (e.type === "Merchandise" || e.module_id === 2))
          )));
          toast.success("Berhasil menghapus dari bookmark");
        },
        error: () => {
          toast.error("Gagal menghapus bookmark");
        },
      });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Gagal menghapus bookmark");
    }
  };

  // ============ HANDLER FILTER ============
  const handleSelectCreator = (creatorId: string | null) => {
    setSelectedCreator(creatorId);
    close();
    setSearchQuery("");
  };

  // ============ RENDER ============
  return (
    <div className="py-10 md:pt-12 max-w-[1440px] mx-auto px-5 md:px-10 text-dark">
      {/* Styles for scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-custom {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .scrollbar-custom::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        @media (max-width: 768px) {
          .scrollbar-custom {
            scrollbar-width: thin !important;
            -ms-overflow-style: auto !important;
          }
          .scrollbar-custom::-webkit-scrollbar {
            display: block !important;
            height: 3px !important;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: transparent !important;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background-color: #E2E8F0 !important;
            border-radius: 9px !important;
          }
        }
      `}} />

          {/* FILTER CHIPS (IMAGE 3 STYLE) */}
          {/* Outer: sticky full-width bg spanning across viewport */}
           <div className={`mb-6 mt-4 md:mt-5 sticky top-[64px] z-[100] bg-white transition-shadow duration-200 mx-[calc(50%-50vw)] ${
             isScrolled ? 'shadow-[0_10px_10px_-10px_rgba(0,0,0,0.15)]' : ''
           }`}>
            {/* Inner: content aligned with page max-width grid */}
            <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex items-center gap-4 py-2">
              {/* Menu icon button */}
              <button 
                onClick={open}
                className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center bg-white text-[#64748B] hover:bg-gray-50 hover:text-[#194E9E] transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Horizontal scroll list of chips wrapper */}
              <div className="flex-1 relative flex items-center overflow-hidden w-full">
                {/* Left Arrow Button */}
                {showLeftArrow && (
                  <button
                    onClick={() => handleScroll("left")}
                    className="hidden md:flex absolute left-0 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-[#E5E7EB] shadow-md items-center justify-center text-gray-500 hover:text-[#194E9E] hover:scale-105 transition-all duration-200 focus:outline-none"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}

                {/* Scroll Container */}
                <div 
                  ref={scrollRef}
                  onScroll={updateArrowVisibility}
                  className="w-full overflow-x-scroll scrollbar-custom flex items-center gap-4 py-2 select-none relative"
                >
                  {/* Sliding active indicator underline */}
                  <div 
                    className="absolute bottom-[3px] h-[4px] transition-all duration-300 ease-out flex justify-center"
                    style={{ 
                      left: `${indicatorStyle.left}px`, 
                      width: `${indicatorStyle.width}px` 
                    }}
                  >
                    <div className="h-[4px] w-full bg-[#194E9E] rounded-full" />
                  </div>

                  {/* "Semua" chip */}
                  <button
                    data-creator-id="semua"
                    onClick={() => setSelectedCreator(null)}
                    className={`px-1 rounded-none bg-transparent whitespace-nowrap transition-all duration-200 pb-[6px] pt-1 border-none focus:outline-none
                      ${!selectedCreator 
                        ? "text-[#194E9E] font-semibold" 
                        : "text-black font-normal hover:text-[#194E9E]"}`}
                  >
                    Semua
                  </button>

                  {/* Creator chips */}
                  {uniqueCreators.map((creator) => (
                    <button
                      key={creator.id}
                      data-creator-id={creator.id.toString()}
                      onClick={() => setSelectedCreator(creator.id.toString())}
                      className={`px-1 rounded-none bg-transparent whitespace-nowrap transition-all duration-200 pb-[6px] pt-1 border-none focus:outline-none
                        ${selectedCreator === creator.id.toString()
                          ? "text-[#194E9E] font-semibold"
                          : "text-black font-normal hover:text-[#194E9E]"}`}
                    >
                      {creator.name}
                    </button>
                  ))}
                </div>

                {/* Right Arrow Button */}
                {showRightArrow && (
                  <button
                    onClick={() => handleScroll("right")}
                    className="hidden md:flex absolute right-0 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-[#E5E7EB] shadow-md items-center justify-center text-gray-500 hover:text-[#194E9E] hover:scale-105 transition-all duration-200 focus:outline-none"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

      {/* LOADING INITIAL */}
      {loading && (
        <Center className="min-h-[50vh] flex-col gap-4">
          <Loader size="lg" />
          <span className="text-lg font-medium">Memuat merchandise...</span>
        </Center>
      )}

      {/* DATA LOADED */}
      {!loading && (
        <>
          {/* FLASH SALE SECTION */}
          {flashSaleProduct.length > 0 && (
            <>
              <Text size="xl" fw={600} className="mb-2">
                🔥 Flash Sale
              </Text>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {flashSaleProduct.map((item) => (
                  <MerchandiseCard
                    key={`flash-${item.id}`}
                    id={item.id}
                    name={item.product_name}
                    price={parseInt(item.product_varian?.[0]?.price || item.price || "0")}
                    sale={0}
                    creator={item.creator?.name || "Unknown"}
                    creatorid={item.creator?.id}
                    creatorImage={item.creator?.image_url}
                    redirect={`/merchandise/${item.slug}`}
                    image={item.product_image?.[0]?.image_url}
                    hoverImage={item.product_image?.[1]?.image_url || item.product_image?.[0]?.image_url}
                    location={item.has_store_location?.store_name}
                    isBookmarked={bookmarkedIds.has(item.id)}
                    onBookmarkToggle={toggleBookmark}
                    showBookmark={isLoggedIn}
                    isVerified={cacheRef.current[item.creator?.id] || item.creator?.is_verified === 1 || item.creator?.is_verified === true}
                    isPreorder={item.is_preorder}
                  />
                ))}
              </div>
            </>
          )}

          {/* HAPUS FILTER BUTTON (ONLY SHOWS IF ACTIVE) */}
          {selectedCreator && (
            <div className="mb-4 flex justify-end">
              <Button variant="subtle" size="xs" onClick={() => setSelectedCreator(null)} color="red">
                Hapus Filter: {uniqueCreators.find(c => c.id.toString() === selectedCreator)?.name}
              </Button>
            </div>
          )}



          {/* SIDEBAR FILTER DRAWER (DARK BLUE DESIGN) */}
          <Drawer
            opened={opened}
            onClose={close}
            size="290px"
            padding="xl"
            position="left"
            withCloseButton={false}
            styles={{
              content: {
                backgroundColor: '#0A3370',
                color: '#ffffff',
              },
              header: {
                display: 'none',
              }
            }}
          >
            <div className="flex flex-col h-full text-white">
              {/* Custom Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold tracking-wide">Filter Produk</span>
                <button 
                  onClick={close} 
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {/* Populer */}
                <button 
                  onClick={() => {
                    toast.info("Menampilkan produk Populer");
                    close();
                  }}
                  className="flex items-center gap-4 w-full text-left group hover:opacity-90 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:bg-white/20 transition-all flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">Sedang Populer</p>
                    <p className="text-[11px] text-white/60 mt-0.5">Produk yang paling banyak dilihat</p>
                  </div>
                </button>

                {/* Trending */}
                <button 
                  onClick={() => {
                    toast.info("Menampilkan produk Trending");
                    close();
                  }}
                  className="flex items-center gap-4 w-full text-left group hover:opacity-90 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:bg-white/20 transition-all flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">Sedang Trending</p>
                    <p className="text-[11px] text-white/60 mt-0.5">Produk yang sedang naik daun</p>
                  </div>
                </button>

                {/* Terlaris */}
                <button 
                  onClick={() => {
                    toast.info("Menampilkan produk Paling Banyak Dibeli");
                    close();
                  }}
                  className="flex items-center gap-4 w-full text-left group hover:opacity-90 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:bg-white/20 transition-all flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">Paling Banyak di Beli</p>
                    <p className="text-[11px] text-white/60 mt-0.5">Produk terlaris saat ini</p>
                  </div>
                </button>

                {/* Promo */}
                <button 
                  onClick={() => {
                    toast.info("Menampilkan produk Promo");
                    close();
                  }}
                  className="flex items-center gap-4 w-full text-left group hover:opacity-90 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:bg-white/20 transition-all flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.43 1.43 0 0 0 2.022 0l4.72-4.72a1.43 1.43 0 0 0 0-2.022l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] leading-tight">Promo</p>
                    <p className="text-[11px] text-white/60 mt-0.5">Penawaran harga terbaik</p>
                  </div>
                </button>
              </div>
            </div>
          </Drawer>

          {/* GRID PRODUCT */}
          {filteredData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredData.map((item, index) => (
                  <MerchandiseCard
                    key={`merch-${item.id}-${index}`}
                    id={item.id}
                    name={item.product_name}
                    price={parseInt(item.product_varian?.[0]?.price || item.price || "0")}
                    sale={0}
                    creator={item.creator?.name || "Unknown"}
                    creatorid={item.creator?.id}
                    creatorImage={item.creator?.image_url}
                    redirect={`/merchandise/${item.slug}`}
                    image={item.product_image?.[0]?.image_url}
                    hoverImage={item.product_image?.[1]?.image_url || item.product_image?.[0]?.image_url}
                    location={item.has_store_location?.store_name}
                    isBookmarked={bookmarkedIds.has(item.id)}
                    onBookmarkToggle={toggleBookmark}
                    showBookmark={isLoggedIn}
                    productVariants={item.product_varian as any[]}
                    isVerified={cacheRef.current[item.creator?.id] || item.creator?.is_verified === 1 || item.creator?.is_verified === true}
                    isPreorder={item.is_preorder}
                  />
                ))}
              </div>

              {/* INFINITE SCROLL TRIGGER */}
              {hasMore && (
                <div ref={loadingRef} className="w-full py-8 flex justify-center">
                  {loadingMore ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader size="sm" />
                      <span className="text-sm text-gray-500">
                        Memuat halaman {currentPage + 1} dari {totalPages}...
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Scroll untuk memuat lebih banyak</span>
                  )}
                </div>
              )}
            </>
          ) : (
            <Center className="min-h-[60vh] flex-col gap-4">
              <FontAwesomeIcon icon={faCartShopping} size="3x" className="text-gray-300" />
              <h3 className="text-xl font-medium text-gray-500">Belum ada merchandise</h3>
              {selectedCreator && (
                <Button variant="light" color="red" onClick={() => setSelectedCreator(null)}>
                  Hapus Filter
                </Button>
              )}
            </Center>
          )}
        </>
      )}
    </div>
  );
};

export default Merchandise;