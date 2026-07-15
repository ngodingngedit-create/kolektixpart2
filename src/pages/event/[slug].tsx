// import Head from "next/head";
// import bank from "@images/bca.png";
// import config from "@/Config";
// import Image from "next/image";
// import { useLocalStorage } from "usehooks-ts";
// import { useRouter } from "next/router";
// import { useState, useEffect, useMemo, createContext, Dispatch, SetStateAction } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { TicketProps, TransactionProps, EventProps } from "@/utils/globalInterface";
// import Countdown, { CountdownRendererFn } from "react-countdown";
// import { Get, Post } from "@/utils/REST";
// import Link from "next/link";
// import ModalTransaction from "@/components/ModalTransaction";
// import { faBookmark as faBookmarkOutlined, faCopy } from "@fortawesome/free-regular-svg-icons";
// import { formatDate, formatYear } from "@/utils/useFormattedDate";
// import { faArrowLeft, faCalendar, faCheck, faClock, faLocationDot, faShareNodes, faTicket } from "@fortawesome/free-solid-svg-icons";
// import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
// import { Progress, Spinner } from "@nextui-org/react";
// import xendit from "../../assets/images/xendit.png";
// import DescriptionBlock from "@/components/Detail/DescriptionBlock";
// import TermsConditionBlock from "@/components/Detail/TermsConditionBlock";
// import TicketViewBlock from "@/components/Detail/TicketViewBlock";
// import useWindowSize from "@/utils/useWindowSize";
// import { toast } from "react-toastify";
// import Images from "@/components/Images";
// import InputField from "@/components/Input";
// import Button from "@/components/Button";
// import { useParams, useSearchParams } from "next/navigation";
// import FirstStep from "@/components/Payment/FirstStep";
// import SecondStep from "@/components/Payment/SecondStep";
// import ThirdStep from "@/components/Payment/ThirdStep";
// import ImagesWithModal from "@/components/Images/ImagesWithModal";
// import AuthModal from "@/components/AuthModal";
// import React from "react";
// import ChatBox from "@/components/chat";
// import { validateHeaderName } from "node:http";
// import { Flex, Stack, Text, Image as ImageM, ActionIcon, Box, Card, AspectRatio } from "@mantine/core";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { randomId, useClickOutside, useInterval, useListState, useTimeout } from "@mantine/hooks";
// import { notifications } from "@mantine/notifications";
// import moment from "moment";
// import fetch from "@/utils/fetch";
// import { BookmarkListResponse, BookmarkRequest } from "@/types/bookmark";
// import Cookies from "js-cookie";
// import useLoggedUser from "@/utils/useLoggedUser";
// import { faBookmark as bookmarkSolid } from "@fortawesome/free-solid-svg-icons";
// import { modals } from "@mantine/modals";
// import { SeatmapData } from "@/utils/formInterface";
// import { useTranslation } from "react-i18next";

// interface Form {
//   nik: string;
//   full_name: string;
//   is_profession: string;
//   is_company: string;
//   email: string;
//   countryCode: string;
//   no_telp: string;
//   is_pemesan: number;
//   identity_type_id: number;
//   event_ticket_id: number;
// }

// interface ErrorForm {
//   nik: boolean;
//   nama: boolean;
//   is_profession: boolean;
//   is_company: boolean;
//   email: boolean;
//   countryCode: boolean;
//   phone: boolean;
// }

// interface FormTicket {
//   id?: number;
//   event_id: number;
//   event_ticket_id: number;
//   name: string;
//   price: number;
//   subtotal_price: number;
//   qty_ticket: number;
//   payment_status: string;
//   seat_number?: string[];
//   ticket_fee?: number;
// }

// interface Transaction {
//   data: TransactionProps;
// }

// const people = [
//   { id: 1, name: "+62" },
//   { id: 2, name: "+1" },
//   { id: 3, name: "+2" },
//   { id: 4, name: "+3" },
//   { id: 5, name: "+4" },
// ];

// export const Context = createContext<{
//   seatmapData?: SeatmapData[];
//   seatmapOpen?: number;
//   setSeatmapOpen?: Dispatch<SetStateAction<number | undefined>>;
//   ticket?: FormTicket[];
//   setTicket?: Dispatch<SetStateAction<FormTicket[]>>;
//   eventData?: EventProps;
//   counts?: { [key: string]: number | string[] };
//   setCounts?: Dispatch<SetStateAction<{ [key: string]: number | string[] }>>;
// }>({});

// // Fungsi untuk mendapatkan zona waktu
// const getTimeZone = (): string => {
//   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   if (timezone.includes("Asia/Jakarta") || timezone.includes("Asia/Bangkok")) {
//     return "WIB";
//   } else if (timezone.includes("Asia/Makassar") || timezone.includes("Asia/Ujung_Pandang")) {
//     return "WITA";
//   } else if (timezone.includes("Asia/Jayapura")) {
//     return "WIT";
//   }
//   return "WIB";
// };

// // Fungsi untuk format tanggal dengan tahun
// const formatDateWithYear = (dateString: string) => {
//   const date = new Date(dateString);
//   const day = date.getDate();
//   const month = date.toLocaleDateString("id-ID", { month: "short" });
//   const year = date.getFullYear();
//   return `${day} ${month} ${year}`;
// };

// // Fungsi untuk format waktu dengan zona waktu
// const formatTimeWithZone = (time: string) => {
//   return `${time} ${getTimeZone()}`;
// };

// const EventDetails = () => {
//   const { t } = useTranslation();
//   const { width } = useWindowSize();
//   const [menu, setMenu] = useState(1);
//   const [step, setStep] = useState(0);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<number>(0);
//   const [ticket, setTicket] = useState<FormTicket[]>([]);
//   const [firstLoad, setFirstLoad] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [transactionData, setTransactionData] = useState<TransactionProps | null>(null);
//   const [xenditInvoice, setXenditInvoice] = useState<any>(null);
//   const isBrowser = () => typeof window !== "undefined";
//   const [selected, setSelected] = useState(people[1]);
//   const [payment, setPayment] = useState<string>("");
//   const [paymentMethod, setPaymentMethod] = useState<any>(null);
//   const [venueLayout, setVenueLayout] = useState<any>(null);
//   const [paymentList, setPaymentList] = useState<PaymentMethod[]>([]);
//   const [form, setForm] = useState<Form[]>([]);
//   const [error, setError] = useState<ErrorForm>({
//     nik: false,
//     nama: false,
//     email: false,
//     is_profession: false,
//     is_company: false,
//     countryCode: true,
//     phone: false,
//   });
//   const [bank, setBank] = useState<string>("");
//   const [data, setData] = useState<TicketProps[]>([]);
//   const [detail, setDetail] = useState<EventProps>();
//   const [counts, setCounts] = useState<{ [key: string]: number | string[] }>({});
//   const [isLogin, setIsLogin] = useState<boolean>(false);
//   const [triggered, setTriggered] = useState<boolean>(false);
//   const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false);
//   const totalCount = Object.values(counts).reduce((sum, count) => (sum as number) + ((typeof count == "number" ? count : count.length) as number), 0) as number;
//   const router = useRouter();
//   const { slug } = router.query;
//   const selectedTab = Number(Cookies.get("selected"));
//   const key = "key";
//   const initialValue = { transactionStorage: "value" };
//   const [alert, setAlert] = useState("");
//   const [openChat, setOpenChat] = useState(false);
//   const [bookmark, setBookmark] = useState(false);
//   const [loadings, setLoadings] = useListState<string>();
//   const [seatmapOpen, setSeatmapOpen] = useState<number>();
//   const [voucher, setVoucher] = useState<{ id: number; name: string; amount: number }[]>([]);
//   const user = useLoggedUser();

//   const clickOutsideChat = useClickOutside(() => {
//     if (isLogin && openChat) {
//       setTimeout(() => {
//         setOpenChat(false);
//       }, 500);
//     }
//   });

//   useEffect(() => {
//     const bookmarked = user?.bookmarked?.find((e) => Boolean(e.event_id) && e.event_id == detail?.id);
//     setBookmark(Boolean(bookmarked));
//   }, [user]);

//   const toggleBookmark = () => {
//     if (!bookmark) {
//       toggleBookmarkFetch();
//       setBookmark(true);
//     } else {
//       modals.openConfirmModal({
//         centered: true,
//         title: "Hapus dari bookmark",
//         children: "Apakah kamu yakin ingin menghapus event ini dari bookmark?",
//         labels: { cancel: "Batal", confirm: "Hapus" },
//         onConfirm: () => {
//           toggleBookmarkFetch(false);
//           setBookmark(false);
//         },
//       });
//     }
//   };

//   const toggleBookmarkFetch = async (status: boolean = true) => {
//     if (!status) {
//       const bookid = user?.bookmarked?.find((e) => e.event_id == detail?.id)?.id;
//       if (!bookid) {
//         toast.error("Gagal Menghapus");
//         return;
//       }

//       await fetch<any, any>({
//         url: "bookmark/" + bookid,
//         method: "DELETE",
//         before: () => setLoadings.append("bookmark"),
//         success: () => {
//           const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
//           Cookies.set("bookmarked", JSON.stringify(data.filter((e) => e.event_id != detail?.id)));
//           toast.info("Berhasil menghapus ke bookmark");
//         },
//         complete: () => setLoadings.filter((e) => e != "bookmark"),
//         error: () => toast.error("Gagal Menghapus"),
//       });
//       return;
//     }

//     await fetch<BookmarkRequest, BookmarkListResponse>({
//       url: "bookmark-user",
//       method: "POST",
//       data: {
//         module_id: 1,
//         type: "Event",
//         event_id: detail?.id ?? 0,
//       },
//       before: () => setLoadings.append("bookmark"),
//       success: ({ data: newData }) => {
//         const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
//         Cookies.set("bookmarked", JSON.stringify([...data, newData]));
//         toast.info("Berhasil menambahkan ke bookmark");
//       },
//       complete: () => setLoadings.filter((e) => e != "bookmark"),
//     });
//   };

//   const handleShare = () => {
//     const url = window.location.href;
//     navigator.clipboard
//       .writeText(url)
//       .then(() => {
//         setAlert("Tautan berhasil disalin!");
//         setTimeout(() => setAlert(""), 1000);
//       })
//       .catch((error) => {
//         console.error("Gagal menyalin tautan:", error);
//       });
//   };

//   const countdownRenderer: CountdownRendererFn = ({ minutes, seconds, completed }) => {
//     if (completed) {
//       return <p>Time Out</p>;
//     } else {
//       return (
//         <p className="font-semibold">
//           {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
//         </p>
//       );
//     }
//   };

//   const [localStorage, setLocalStorage] = useLocalStorage(key, initialValue, {
//     initializeWithValue: false,
//   });

//   const openDatabase = (): Promise<IDBDatabase> => {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open("myDatabase", 1);

//       request.onupgradeneeded = (event) => {
//         const db = (event.target as IDBOpenDBRequest).result;
//         if (!db.objectStoreNames.contains("transactionStore")) {
//           db.createObjectStore("transactionStore", { keyPath: "id" });
//         }
//       };

//       request.onsuccess = (event) => {
//         resolve((event.target as IDBOpenDBRequest).result);
//       };

//       request.onerror = (event) => {
//         reject((event.target as IDBOpenDBRequest).error);
//       };
//     });
//   };

//   const saveDataToIndexedDB = async (data: object) => {
//     try {
//       const db = await openDatabase();
//       const transaction = db.transaction("transactionStore", "readwrite");
//       const store = transaction.objectStore("transactionStore");

//       store.put({ id: "transactionStorage", data });

//       transaction.oncomplete = () => {
//         router.push("/transaction-woauth");
//       };

//       transaction.onerror = (error) => {
//         console.error("Kesalahan saat menyimpan data ke IndexedDB:", error);
//       };
//     } catch (error) {
//       console.error("Kesalahan saat membuka database IndexedDB:", error);
//     }
//   };

//   const setLocalStorageValue = () => {
//     openDatabase()
//       .then((db) => {
//         const transaction = db.transaction("transactionStore", "readwrite");
//         const store = transaction.objectStore("transactionStore");
//         store.delete("transactionStorage");

//         transaction.oncomplete = () => {
//           //console.log('Data berhasil dihapus dari IndexedDB');
//         };

//         transaction.onerror = (error) => {
//           console.error("Kesalahan saat menghapus data dari IndexedDB:", error);
//         };
//       })
//       .catch((error) => {
//         console.error("Kesalahan saat membuka database IndexedDB:", error);
//       });

//     const dataToStore = {
//       detail,
//       ticket,
//       totalSubtotalPrice,
//       totalCount,
//       form,
//       countdowns: Date.now() + 15 * 60 * 1000,
//       ticket_fee: ticket.reduce((sum, item) => sum + (item.ticket_fee || 0) * item.qty_ticket, 0),
//     };

//     saveDataToIndexedDB(dataToStore);
//   };

//   const [isCopied, setIsCopied] = useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(xenditInvoice.bank_account_number);
//       setIsCopied(true);
//       setTimeout(() => {
//         setIsCopied(false);
//       }, 2000);
//     } catch (err) {
//       console.error("Failed to copy text: ", err);
//       setIsCopied(false);
//     }
//   };

//   useEffect(() => {
//     if (detail?.one_id_one_ticket) {
//       if (totalCount > 0) {
//         const initialForm = Array.from({ length: totalCount + 1 }, (_, index) => ({
//           nik: "",
//           full_name: "",
//           email: "",
//           is_profession: "",
//           is_company: "",
//           countryCode: "",
//           no_telp: "",
//           is_pemesan: index ? 0 : 1,
//           identity_type_id: 1,
//           event_ticket_id: 1,
//         }));
//         setForm(initialForm);
//       }
//     } else {
//       setForm([
//         {
//           nik: "",
//           full_name: "",
//           is_profession: "",
//           is_company: "",
//           email: "",
//           countryCode: "",
//           no_telp: "",
//           is_pemesan: 0,
//           identity_type_id: 1,
//           event_ticket_id: 1,
//         },
//       ]);
//     }
//   }, [totalCount, detail?.one_id_one_ticket]);

//   useEffect(() => {
//     const availableIndex = data.findIndex((ticket) => ticket.is_soldout === 0 && ticket.is_finish === 0);
//     if (selectedTab) {
//       setSelectedDate(selectedTab);
//     } else if (availableIndex !== -1 && selectedDate === null) {
//       setSelectedDate(availableIndex);
//     }
//   }, [selectedTab, data]);

//   const ticketCount = Cookies.get("ticketCount");
//   const prevPath = Cookies.get("prevPath");
//   const getData = () => {
//     setFirstLoad(true);
//     Get(`event/${slug}`, {})
//       .then((res: any) => {
//         setVenueLayout(res.data.has_venue_layout);
//         setDetail({
//           ...res.data,
//           seatmap: res?.data?.seatmap ? JSON.parse(res?.data?.seatmap) : undefined,
//         });
//         setData(
//           res.data.has_event_ticket.map((e: any) => ({
//             ...e,
//             avaliable_seat_number: e?.avaliable_seat_number?.split(","),
//           }))
//         );
//         ticketCount && prevPath === router.asPath ? setCounts(JSON.parse(ticketCount)) : initializeCounts(res.data.has_event_ticket);
//         ticketCount && setMenu(2);
//         if (!triggered) {
//           triggerCounter(res.data.id);
//         }
//         setFirstLoad(false);
//       })
//       .catch((err: any) => {
//         setFirstLoad(false);
//       });
//   };

//   const handleShowModal = () => {
//     setShowModalTransaction(!showModalTransaction);
//   };
//   useEffect(() => {
//     const userData = Cookies.get("token");
//     userData !== undefined ? setIsLogin(true) : setIsLogin(false);
//   }, []);

//   const submitData = () => {
//     console.log("submitData");
//     console.log("voucher", voucher);
//     setLoading(true);
//     if (payment !== "") {
//       getPaymentMethodById(payment);
//     }

//     const userData: string | undefined = Cookies.get("user_data");
//     const userId = userData ? JSON.parse(userData).id : "";
//     const now = new Date();
//     now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
//     const isoString = now.toISOString();

//     const subtotalBeforeVoucher = totalSubtotalPrice;
//     const voucherDiscount = voucher.reduce((sum, v) => sum + v.amount, 0);
//     const subtotalAfterVoucher = subtotalBeforeVoucher - voucherDiscount;
//     const totalTicketFee = ticket.reduce((sum, item) => sum + (item.ticket_fee || 0) * item.qty_ticket, 0);

//     const taxAmount = detail?.ppn ? Math.round(subtotalAfterVoucher * (detail.ppn / 100)) : 0;

//     const grandtotal = subtotalAfterVoucher + totalTicketFee + taxAmount;

//     console.log("=== PAYMENT CALCULATION VERIFICATION ===");
//     console.log("1. Subtotal (before voucher):", subtotalBeforeVoucher);
//     console.log("2. Vouchers detail:", voucher);
//     console.log("3. Total voucher discount:", voucherDiscount);
//     console.log("4. Subtotal after voucher:", subtotalAfterVoucher);
//     console.log("5. Ticket items:", ticket);
//     console.log("6. Total ticket fee (sum of item.ticket_fee * qty):", totalTicketFee);
//     console.log("7. Tax base (subtotal AFTER voucher only):", subtotalAfterVoucher);
//     console.log("8. PPN rate:", detail?.ppn, "%");
//     console.log("9. Tax amount (10% of subtotal after voucher):", taxAmount);
//     console.log("10. GRAND TOTAL:", grandtotal);
//     console.log("    Breakdown: ", subtotalAfterVoucher, "+", totalTicketFee, "+", taxAmount, "=", grandtotal);

//     var payload: { [key: string]: any } = {
//       user_id: userId,
//       event_id: detail?.id,
//       admin_fee: 0,
//       payment_status: "pending",
//       vouchers:
//         voucher.length > 0
//           ? voucher.map((v) => ({
//               voucher_id: v.id,
//               voucher_code: v.name,
//               voucher_amount: v.amount,
//             }))
//           : [],
//       identities: form,
//       tickets: ticket.map((e) => ({
//         ...e,
//         seatnumber_ticket: JSON.stringify(e.seat_number),
//         ticket_fee: e.ticket_fee,
//       })),
//       grandtotal: grandtotal,
//       bank_code: bank ?? "xendit",
//       expiration_date: isoString,
//       payment_method: (paymentList?.find((e) => e?.payment_name?.toLowerCase() == "xendit") ?? { id: 0 }).id.toString(),
//       ppn: taxAmount,
//       total_ticket_fee: ticket.reduce((sum, item) => sum + (item.ticket_fee || 0) * item.qty_ticket, 0),
//     };

//     if (payment) payload.payment_method = payment;

//     console.log("=== PAYLOAD TO BACKEND ===");
//     console.log("Grandtotal in payload:", payload.grandtotal);
//     console.log("Admin fee in payload:", payload.admin_fee);
//     console.log("PPN in payload:", payload.ppn);
//     console.log("Total ticket fee in payload:", payload.total_ticket_fee);
//     console.log("Vouchers in payload:", payload.vouchers);
//     console.log("Full payload:", JSON.stringify(payload, null, 2));

//     setLoading(true);
//     Post("transaction", payload)
//       .then((res: any) => {
//         if (res?.isFree) {
//           router.push("/success/" + res.invoice_no);
//           return;
//         }

//         setTransactionData(res.data);

//         if (res.xendit_invoice && res.xendit_invoice.va_number) {
//           setXenditInvoice(res.xendit_invoice.va_number[0]);
//         }

//         if (res.data) {
//           setStep(100);
//           scrollToTop();
//         }
//       })
//       .catch((err: any) => {
//         if (err?.response?.data?.out_of_stock) {
//           notifications.show({
//             color: "red",
//             position: "top-right",
//             message: `Maaf, tiket yang tersedia tidak mencukupi`,
//           });
//         } else {
//           notifications.show({
//             color: "red",
//             position: "top-right",
//             message: err.response?.data?.message,
//           });
//         }
//         if ((err?.response?.data?.message ?? err?.message) === "The account is not registered yet") {
//           router.push("/auth");
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const initializeCounts = (data: TicketProps[]) => {
//     const initialCount: Record<number, number> = {};
//     data.forEach((item) => {
//       initialCount[item.id] = 0;
//     });
//     setCounts(initialCount);
//   };

//   const updateDataBasedOnCounts = () => {
//     const newData: FormTicket[] = Object.keys(counts)
//       .filter((id) => ((typeof counts[parseInt(id)] == "number" ? counts[parseInt(id)] : (counts[parseInt(id)] as string[]).length) as number) > 0)
//       .map((id, idx) => {
//         const ticketItem = data.find((el) => el.id === parseInt(id));
//         return {
//           id: parseInt(id),
//           event_id: detail?.id ?? 0,
//           event_ticket_id: parseInt(id),
//           price: ticketItem?.price || 0,
//           ticket_fee: ticketItem?.ticket_fee || 0,
//           name: ticketItem?.name || "",
//           subtotal_price: (ticketItem?.price || 0) * (typeof counts[id] == "number" ? counts[id] : counts[id].length),
//           qty_ticket: (typeof counts[parseInt(id)] == "number" ? counts[parseInt(id)] : (counts[parseInt(id)] as string[]).length) as number,
//           payment_status: "pending",
//           seat_number: (typeof counts[parseInt(id)] == "object" ? counts[parseInt(id)] : undefined) as string[] | undefined,
//         };
//       });

//     setTicket(newData);
//   };
//   const triggerCounter = (id: string) => {
//     if (data) {
//       setFirstLoad(true);
//       if (!triggered) {
//         Post("event-counter", { event_id: id })
//           .then((res) => {
//             setFirstLoad(false);
//             setTriggered(true);
//           })
//           .catch((err) => {
//             setTriggered(true);
//             setFirstLoad(false);
//           });
//       }
//     }
//   };

//   let totalPrice = 0;
//   let totalQty = 0;

//   ticket.forEach((item) => {
//     totalPrice += item.price;
//     totalQty += item.qty_ticket;
//   });

//   let totalSubtotalPrice = 0;

//   ticket.forEach((item) => {
//     totalSubtotalPrice += item.subtotal_price;
//   });
//   useEffect(() => {
//     if (slug) {
//       getData();
//       getPaymentMethod();
//     }
//   }, [slug]);

//   useEffect(() => {
//     if (data.length > 0) {
//       updateDataBasedOnCounts();
//     }
//   }, [counts]);

//   function scrollToTop() {
//     if (!isBrowser()) return;
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   const isOnePayment = (detail?.has_event_payment_method.length ?? 2) <= 1;

//   const submitForm = () => {
//     console.log("submitForm");

//     if (detail) {
//       if (isOnePayment) {
//         console.log("isOnePayment");
//         setPayment((paymentList?.find((e) => e?.id === 4) ?? { id: 0 }).id.toString());
//         submitData();
//       } else {
//         setStep(66);
//       }
//     }
//     scrollToTop();
//   };

//   const getPaymentMethodById = (id: string) => {
//     setLoading(true);
//     Get(`payment-method/${id}`, {})
//       .then((res: any) => {
//         setPaymentMethod(res.data);
//       })
//       .catch((err: any) => {
//         setLoading(false);
//       });
//   };

//   const getPaymentMethod = () => {
//     setFirstLoad(true);
//     Get(`payment-method`, {})
//       .then((res: any) => {
//         setPaymentList(res);
//         setFirstLoad(false);
//       })
//       .catch((err: any) => {
//         setFirstLoad(false);
//       });
//   };

//   const renderer: CountdownRendererFn = ({ minutes, seconds, completed }) => {
//     if (completed) {
//       router.back();
//     } else {
//       return (
//         <p className="font-semibold">
//           {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
//         </p>
//       );
//     }
//   };

//   const params = useSearchParams();
//   const stepParams = params.get("step");
//   const [authModalVisible, setAuthModalVisible] = useState(false);

//   const handleChatClick = () => {
//     const userData = Cookies.get("user_data");

//     if (userData) {
//       router.push("/chat");
//     } else {
//       setAuthModalVisible(true);
//     }
//   };

//   useEffect(() => {
//     if (slug) {
//       if (step > 32) {
//         slug && router.push(`/event/${slug}?step=${step}`);
//       } else {
//         router.push(`/event/${slug}`);
//       }
//     }
//   }, [step, slug]);

//   function padToTwoDigits(num: number) {
//     return num.toString().padStart(2, "0");
//   }
//   const now = new Date();
//   const targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//   const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
//   const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

//   useEffect(() => {
//     if (step !== 100) {
//       const unloadCallback = (e: any) => {
//         e.preventDefault();
//         e.returnValue = "";
//         return "";
//       };
//       window.addEventListener("beforeunload", unloadCallback);
//       return () => window.removeEventListener("beforeunload", unloadCallback);
//     }
//   }, [step]);

//   const dayName = days[targetDate.getDay()];
//   const day = padToTwoDigits(targetDate.getDate());
//   const month = months[targetDate.getMonth()];
//   const year = targetDate.getFullYear();
//   const hours = padToTwoDigits(targetDate.getHours());
//   const minutes = padToTwoDigits(targetDate.getMinutes());

//   const formattedDate = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;

//   const isGratis = useMemo(() => {
//     if (data) {
//       const total = data.reduce((q, n) => q + (n.price ?? 0), 0);
//       return total <= 0;
//     } else {
//       return false;
//     }
//   }, [data]);

//   function isCurrentTimeBetween(startDate: string, endDate: string): boolean {
//     const start = moment(startDate, "YYYY-MM-DD HH:mm:ss");
//     const end = moment(endDate, "YYYY-MM-DD HH:mm:ss");
//     const now = moment();

//     return now.isBetween(start, end, undefined, "[]");
//   }

//   function isDatePassed(dateString: string) {
//     const date = moment(dateString, "YYYY-MM-DD HH:mm:ss");
//     return date.isBefore(moment());
//   }

//   const countdownTime = useMemo(() => {
//     const targetDate = new Date();
//     targetDate.setMinutes(targetDate.getMinutes() + 15);

//     return targetDate;
//   }, []);

//   const addVoucher = (data: { id: number; name: string; amount: number }) => {
//     const isDuplicate = voucher.some((v) => v.id === data.id);
//     if (isDuplicate) {
//       notifications.show({
//         color: "red",
//         position: "top-right",
//         message: "Voucher sudah digunakan.",
//       });
//       return;
//     }
//     setVoucher((prevVouchers) => [...prevVouchers, data]);
//   };

//   const handleCancelVoucher = (index: number) => {
//     setVoucher((prevVouchers) => prevVouchers.filter((_, i) => i !== index));
//   };

//   return !firstLoad && detail ? (
//     detail && (
//       <Context.Provider
//         value={{
//           seatmapData: detail.seatmap,
//           seatmapOpen,
//           setSeatmapOpen,
//           ticket,
//           setTicket,
//           counts,
//           setCounts,
//           eventData: detail,
//         }}
//       >
//         <div className="text-dark w-full">
//           <div ref={clickOutsideChat} className={`${openChat ? "" : "hidden"}`}>
//             <ChatBox toggleOpenTab={() => setOpenChat(!openChat)} openTab={openChat} creatorIdOpen={parseInt(detail.creator_id)} />
//             <AuthModal visible={openChat && !isLogin} onClose={() => setOpenChat(false)} />
//           </div>
//           <Head>
//             <meta name="author" content="PT.Kolektix Maju Bersama" />
//             <meta name="copyright" content="&copy;2024 kolektix Maju Bersama" />
//             <meta name="description" content={detail ? detail?.description.replace(/(<([^>]+)>)/gi, "") : ""} />
//             <meta name="robots" content="index, follow" />
//             <meta name="googlebot" content="index, follow" />
//             <title>Kolektix.com | {detail?.name}</title>
//           </Head>
//           {menu === 1 && (
//             <>
//               <div className="fixed bottom-0 opacity-90 w-full bg-white border-2 border-t-primary-light border-x-0 border-b-0 drop-shadow-md z-30">
//                 <div className="flex justify-between items-center py-3 px-5">
//                   <p className="text-sm font-bold">{detail?.name}</p>
//                   <Link href="#ticket-picker">
//                     <button
//                       className="bg-primary-base text-white px-4 py-2 font-semibold text-sm rounded-md disabled:bg-primary-disabled disabled:cursor-not-allowed"
//                       onClick={() => {
//                         setMenu(2);
//                       }}
//                     >
//                       {isGratis ? t("registrationTicketTab") : t("openTicketTab")}
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </>
//           )}
//           {step !== 0 &&
//             step !== 2 &&
//             stepParams !== null &&
//             width &&
//             (width < 768 ? (
//               <>
//                 <div className="w-full sticky top-0 bg-primary-base z-50">
//                   <div className="flex items-center justify-between px-5 py-3">
//                     <div className="flex items-center">
//                       <button onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))}>
//                         <FontAwesomeIcon icon={faArrowLeft} className="mr-3 text-white" />
//                       </button>
//                       <div>
//                         <p className="text-white text-xs mb-1">{step === 33 ? "1 " : step === 66 ? "2 " : "3 "}dari 3</p>
//                         <p className="text-white text-sm font-semibold">{step === 33 ? "Informasi Pribadi" : step === 66 ? "Konfirmasi" : "Pembayaran"}</p>
//                       </div>
//                     </div>
//                     <div className="">
//                       <button disabled={loading} className="text-white text-xs mb-1">
//                         {t("next")}
//                       </button>
//                       <p className="text-white text-sm">{step === 33 ? "Konfirmasi" : "Pembayaran"}</p>
//                     </div>
//                   </div>

//                   <Progress size="sm" color="success" aria-label="Loading..." value={step} />
//                 </div>
//                 <div className="w-full fixed flex justify-between gap-3 bottom-0 bg-white border-t-2 border-t-primary-light-200 z-50 p-5">
//                   <div className="hidden lg:flex items-center gap-0 md:gap-3 bg-[#EA4D3E] text-white px-3 py-2 rounded-md">
//                     <Countdown date={countdownTime} renderer={renderer} />
//                     <div className="w-[1px] mx-1 md:mx-0 h-5 bg-primary-light-200"></div>
//                     <p className="text-xs">{t("completeYourOrder")}</p>
//                   </div>
//                   <Flex align="center" gap={10}>
//                     <Button color="secondary" label={t("previous")} onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))} />
//                     {step === 66 ? (
//                       <Button color="primary" label={t("next")} loading={loading} disabled={loading || payment === ""} onClick={submitData} />
//                     ) : step === 100 && transactionData ? (
//                       <Button
//                         color="primary"
//                         label="Bayar Sekarang"
//                         disabled={loading || payment === ""}
//                         onClick={
//                           payment === "4" && transactionData.xendit_url
//                             ? () => {
//                                 setLoading(true);
//                                 router.push(transactionData.xendit_url);
//                               }
//                             : payment === "3"
//                             ? () => {
//                                 setStep(3);
//                                 scrollToTop();
//                               }
//                             : () => {
//                                 setStep(2);
//                                 scrollToTop();
//                               }
//                         }
//                       />
//                     ) : (
//                       <Button
//                         color="primary"
//                         label={t("next")}
//                         loading={loading}
//                         disabled={!isFormValid || loading}
//                         onClick={() => (step === 33 ? (isOnePayment ? submitForm() : (detail ? totalSubtotalPrice + detail.admin_fee * totalCount + (detail.ppn || 0) : 0) == 0 ? submitData() : setStep(66)) : setStep(100))}
//                       />
//                     )}
//                   </Flex>
//                 </div>
//               </>
//             ) : (
//               <div className="w-full fixed flex justify-between gap-3 bottom-0 bg-white border-t-2 border-t-primary-light-200 z-50 p-5">
//                 <div className="hidden lg:flex items-center gap-0 md:gap-3 bg-[#EA4D3E] text-white px-3 py-2 rounded-md">
//                   <Countdown date={countdownTime} renderer={renderer} />
//                   <div className="w-[1px] mx-1 md:mx-0 h-5 bg-primary-light-200"></div>
//                   <p className="text-xs">{t("completeYourOrder")}</p>
//                 </div>
//                 <Flex align="center" gap={10}>
//                   <Button color="secondary" label={t("previous")} onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))} />
//                   {step === 66 ? (
//                     <Button color="primary" label={t("next")} loading={loading} disabled={loading || payment === ""} onClick={submitData} />
//                   ) : step === 100 && transactionData ? (
//                     <Button
//                       color="primary"
//                       label="Bayar Sekarang"
//                       disabled={loading || payment === ""}
//                       onClick={
//                         payment === "4" && transactionData.xendit_url
//                           ? () => {
//                               setLoading(true);
//                               router.push(transactionData.xendit_url);
//                             }
//                           : payment === "3"
//                           ? () => {
//                               setStep(3);
//                               scrollToTop();
//                             }
//                           : () => {
//                               setStep(2);
//                               scrollToTop();
//                             }
//                       }
//                     />
//                   ) : (
//                     <Button
//                       disabled={!isFormValid || loading}
//                       color="primary"
//                       loading={loading}
//                       label={t("next")}
//                       onClick={() => (step === 33 ? (isOnePayment ? submitForm() : (detail ? totalSubtotalPrice + detail.admin_fee * totalCount + (detail.ppn || 0) : 0) == 0 ? submitData() : setStep(66)) : setStep(100))}
//                     />
//                   )}
//                 </Flex>
//               </div>
//             ))}

//           {step === 0 &&
//             stepParams === null &&
//             (width && width > 768 ? (
//               <>
//                 <div className="bg-primary-dark">
//                   <div className="max-w-7xl mx-auto">
//                     <Flex justify="space-between" align="end" className="px-8 pt-20 pb-3">
//                       <div>
//                         <p className={`text-white/70 mb-[-10px]`}>{detail?.has_category_event?.name}</p>
//                         <h3 className="text-white font-bold my-4 text-2xl">{detail?.name}</h3>
//                       </div>

//                       {!isDatePassed(`${detail?.start_date} ${detail?.start_time}:00`) && (
//                         <Stack gap={12} align="end">
//                           <Text size="xs" c="white">
//                             {t("eventStartsIn")}
//                           </Text>
//                           <EventCountdown startdate={detail?.start_date} starttime={detail?.start_time} />
//                         </Stack>
//                       )}
//                     </Flex>
//                     <div className="flex justify-between px-8 gap-5 h-full items-stretch">
//                       <Stack w="100%">
//                         <Box pos="relative">
//                           {/* {detail && detail?.image && <ImagesWithModal type="event" path={detail?.image} width={1000} height={1000} alt="banner" className="w-full h-72 object-fill lg:rounded-3xl md:rounded-2xl rounded-full" />} */}

//                           {detail?.image ? (
//                             <ImagesWithModal type="event" path={detail.image} width={1000} height={1000} alt="banner" className="w-full h-72 object-fill lg:rounded-3xl md:rounded-2xl rounded-full" />
//                           ) : (
//                             <div className="w-full h-72 bg-white lg:rounded-3xl md:rounded-2xl rounded-full"></div>
//                           )}

//                           {isCurrentTimeBetween(`${detail?.start_date} ${detail?.start_time}:00`, `${detail?.end_date} ${detail?.end_time}:00`) && (
//                             <Card className={`!absolute z-20 top-3 right-3 w-fit !rounded-full !border !border-white/50 backdrop-blur-sm`} p="4px 16px 4px 30px" bg="#00000030">
//                               <Flex gap={10} align="center">
//                                 <Icon icon="ph:dot-duotone" className={`absolute top-2/4 left-0 -translate-y-2/4 !text-[40px] mr-[-20px] animate-pulse !text-red-500`} />
//                                 <Icon icon="mynaui:video" className={`!text-[24px] !text-red-500`} />
//                                 <Text fw={600} c="white" size="xs">
//                                   Live Event
//                                 </Text>
//                               </Flex>
//                             </Card>
//                           )}
//                         </Box>

//                         <div className="flex justify-between items-center text-white px-5 py-4">
//                           <div className="flex items-center gap-4">
//                             {detail.has_event_social_meida?.instagram && (
//                               <Link href={detail.has_event_social_meida?.instagram} target="_blank" rel="noreferrer" className="flex items-center">
//                                 <FontAwesomeIcon icon={faInstagram} className="mr-2 text-lg " />
//                                 <p className=" font-normal text-sm mr-3">{detail.has_event_social_meida.ig_name}</p>
//                               </Link>
//                             )}
//                           </div>
//                           <div className="flex items-center">
//                             <div className="relative">
//                               <button onClick={handleShare} className="flex items-center">
//                                 <FontAwesomeIcon icon={faShareNodes} className="mr-3 text-xl" />
//                               </button>
//                               {alert && <div className="absolute top-0 left-0 mt-2 bg-dark text-white shadow-lg animate-fade-in-out">Copy</div>}
//                             </div>
//                             {isLogin && (
//                               <Box onClick={toggleBookmark}>
//                                 <FontAwesomeIcon icon={bookmark ? bookmarkSolid : faBookmarkOutlined} className="text-xl " />
//                               </Box>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex gap-5 max-w-5xl pb-4 flex-grow">
//                           <button onClick={() => setMenu(1)} className={`cursor-pointer ${menu === 1 ? "font-semibold text-[#82b3ff]" : "text-white"}`}>
//                             {t("description")}
//                           </button>
//                           <button onClick={() => setMenu(2)} className={`cursor-pointer ${menu === 2 ? "font-semibold text-[#82b3ff]" : "text-white"}`}>
//                             {t("ticket")}
//                           </button>
//                           <button onClick={() => setMenu(3)} className={`cursor-pointer ${menu === 3 ? "font-semibold text-[#82b3ff]" : "text-white"}`}>
//                             {t("termAndCondition")}
//                           </button>
//                         </div>
//                       </Stack>

//                       <Stack className={`w-full md:max-w-[300px] pb-[20px]`} gap={10}>
//                         <div className="px-[25px] pt-[15px] pb-[10px] bg-white rounded-3xl dark:bg-gray-800 dark:border-gray-700 shadow-md h-fit flex flex-col">
//                           <Stack gap={12}>
//                             <Flex align="center" gap={10}>
//                               <Icon icon="solar:calendar-bold" className={`text-primary-base text-[20px]`} />
//                               <Text>{detail && `${formatDate(detail.start_date)} ${detail.start_date !== detail.end_date ? "- " + formatDate(detail.end_date) : ""} ${formatYear(detail.end_date)}`}</Text>
//                             </Flex>
//                             <Flex align="center" gap={10}>
//                               <Icon icon="tabler:clock-filled" className={`text-primary-base text-[20px]`} />
//                               <Text>
//                                 {detail?.start_time.toString()} - {detail?.end_time.toString()} {getTimeZone()}
//                               </Text>
//                             </Flex>
//                             <Link href={detail?.location_map ?? "#"} target="_blank">
//                               <Flex align="center" gap={10}>
//                                 <Icon icon="tdesign:location-filled" className={`text-primary-base text-[20px]`} />
//                                 <Text>{detail?.location_name}</Text>
//                               </Flex>
//                             </Link>
//                             <Text size="sm" c="gray">
//                               {t("organizedBy")}
//                             </Text>
//                             <Flex align="center" gap={10}>
//                               <ImageM src={`${config.assetUrl}creator/${detail?.has_creator?.image}`} alt="image" radius={8} mt={-5} w="30%" miw={100} mah={300} />
//                             </Flex>
//                           </Stack>
//                         </div>

//                         <Button label="Chat" color="secondary" className={`!text-[18px] !font-[600]`} onClick={() => setOpenChat(!openChat)} />
//                         <Button onClick={() => setMenu(2)} label={isGratis ? t("registrationTicketTab") : t("buyTicket")} color="secondary" className={`${menu === 2 && "hidden"} !text-[18px] !font-[600]`} />
//                       </Stack>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="px-8 max-w-7xl mx-auto text-dark">
//                   {menu === 1 && <DescriptionBlock data={detail?.description} />}
//                   {menu === 2 && (
//                     <div id="ticket-view">
//                       <TicketViewBlock
//                         venue={venueLayout}
//                         maxOrder={detail.max_buy_ticket}
//                         isGratis={isGratis}
//                         selected={selectedDate}
//                         setSelected={setSelectedDate}
//                         counts={counts}
//                         setCounts={setCounts}
//                         data={data}
//                         isLogin={isLogin}
//                         totalCount={totalCount}
//                         storeLocalStorage={setLocalStorageValue}
//                         totalSubtotalPrice={totalSubtotalPrice}
//                         setStep={setStep}
//                         scrollToTop={scrollToTop}
//                       />
//                     </div>
//                   )}
//                   {menu === 3 && <TermsConditionBlock data={detail?.term_condition} />}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Box className={`!relative`}>
//                   {detail && detail.image && <Images type="event" path={detail?.image} width={1000} height={1000} alt="banner" className="w-full rounded-3xl p-4 mt-16 lg:mt-0" />}

//                   {isCurrentTimeBetween(`${detail?.start_date} ${detail?.start_time}:00`, `${detail?.end_date} ${detail?.end_time}:00`) && (
//                     <Card className={`!absolute z-20 top-7 right-7 w-fit !rounded-full !border !border-white/50 backdrop-blur-sm`} p="4px 16px 4px 30px" bg="#00000030">
//                       <Flex gap={10} align="center">
//                         <Icon icon="ph:dot-duotone" className={`absolute top-2/4 left-0 -translate-y-2/4 !text-[40px] mr-[-20px] animate-pulse !text-red-500`} />
//                         <Icon icon="mynaui:video" className={`!text-[24px] !text-red-500`} />
//                         <Text fw={600} c="white" size="xs">
//                           Live Event
//                         </Text>
//                       </Flex>
//                     </Card>
//                   )}
//                 </Box>

//                 <Flex justify="space-between" gap={10} px={20} display="none">
//                   <Box></Box>
//                 </Flex>

//                 <div className="p-5 pt-2 border-primary-light-200 border-2 border-x-0 border-t-0 border-dashed">
//                   <Flex gap={10} justify="space-between" mb={5} align="center">
//                     <p className={`opacity-70`}>{detail?.has_category_event?.name}</p>
//                     {detail.has_event_social_meida?.ig_name && (
//                       <Link href={detail.has_event_social_meida?.instagram + "/" + detail.has_event_social_meida?.ig_name} target="_blank" rel="noreferrer" className="flex items-center">
//                         <Flex gap={8} align="center">
//                           <FontAwesomeIcon icon={faInstagram} className="!text-[24px] text-primary-base" />
//                           <Text size="sm" className={`!text-primary-base`}>
//                             {detail.has_event_social_meida?.ig_name}
//                           </Text>
//                         </Flex>
//                       </Link>
//                     )}
//                   </Flex>
//                   <h3 className="mb-3">{detail?.name}</h3>

//                   {/* MODIFIKASI DI SINI - Tanggal dengan tahun */}
//                   <p className="mb-3 font-normal text-sm">
//                     <FontAwesomeIcon icon={faCalendar} className="mr-3 text-grey" />
//                     <span className="text-dark">{detail && `${formatDateWithYear(detail?.start_date)}` + (detail.end_date !== detail.start_date ? ` - ${formatDateWithYear(detail?.end_date)}` : "")}</span>
//                   </p>

//                   {/* MODIFIKASI DI SINI - Waktu dengan zona waktu */}
//                   <p className="mb-3 font-normal text-sm">
//                     <FontAwesomeIcon icon={faClock} className="mr-3 text-grey" />
//                     <span className="text-dark">
//                       {formatTimeWithZone(detail?.start_time || "")} - {formatTimeWithZone(detail?.end_time || "")}
//                     </span>
//                   </p>

//                   <Link href={detail?.location_map ?? "#"} target="_blank">
//                     <p className="mb-3 font-normal text-sm">
//                       <FontAwesomeIcon icon={faLocationDot} className="mr-3 text-grey" />
//                       <span className="text-dark">{detail?.location_name}</span>
//                     </p>
//                   </Link>
//                 </div>
//                 <div className="p-5 border-primary-light-200 border-2 border-t-0 border-x-0 flex items-center gap-3">
//                   <Image src={`${config.assetUrl}creator/${detail?.has_creator?.image}`} alt="image" className="w-10 h-10 border border-grey rounded-full object-contain" width={200} height={200} />
//                   <div className={`w-full flex items-center gap-2`}>
//                     <div>
//                       <p>{t("organizedBy")}</p>
//                       <p className="font-semibold">{detail?.has_creator?.name}</p>
//                     </div>
//                     {detail?.has_creator?.is_verified === 1 && (
//                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2" className="w-4 h-4">
//                         <path d="M22 12l-2-2 1-3-3-1-1-3-3 1-2-2-2 2-3-1-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3 3-1 2 2 2-2 3 1 1-3 3-1-1-3 2-2zM10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8l-7 7z" />
//                       </svg>
//                     )}
//                   </div>
//                   <ActionIcon color="#0B387C" variant="transparent" size="lg">
//                     <Icon icon="fluent:chat-12-regular" className={`!text-[30px]`} onClick={() => setOpenChat(!openChat)} />
//                   </ActionIcon>
//                 </div>
//                 <div className="flex bg-white items-center justify-center sticky mb-5 top-16 text-sm z-20">
//                   <div className="flex gap-5 w-full border-2 text-grey border-primary-light-200 border-x-0 border-t-0 px-8">
//                     <button onClick={() => setMenu(1)} className={` py-2 cursor-pointer ${menu === 1 && "font-semibold text-dark border-2 border-b-primary-base border-x-0 border-t-0 py-3"}`}>
//                       {t("description")}
//                     </button>
//                     <button onClick={() => setMenu(2)} className={`py-2 cursor-pointer ${menu === 2 && "font-semibold text-dark border-2 border-b-primary-base border-x-0 border-t-0 py-3"}`}>
//                       {isGratis ? t("ticketRegistration") : t("ticket")}
//                     </button>
//                     <button onClick={() => setMenu(3)} className={`py-2 cursor-pointer ${menu === 3 && "font-semibold text-dark border-2 border-b-primary-base border-x-0 border-t-0 py-3"}`}>
//                       {t("termAndCondition")}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="px-5 w-full text-dark">
//                   {menu === 1 && <DescriptionBlock data={detail?.description} />}
//                   {menu === 2 && (
//                     <TicketViewBlock
//                       venue={venueLayout}
//                       maxOrder={detail.max_buy_ticket}
//                       isGratis={isGratis}
//                       selected={selectedDate}
//                       setSelected={setSelectedDate}
//                       counts={counts}
//                       setCounts={setCounts}
//                       data={data}
//                       isLogin={isLogin}
//                       totalCount={totalCount}
//                       storeLocalStorage={setLocalStorageValue}
//                       totalSubtotalPrice={totalSubtotalPrice}
//                       setStep={setStep}
//                       scrollToTop={scrollToTop}
//                     />
//                   )}
//                   {menu === 3 && <TermsConditionBlock data={detail?.term_condition} />}
//                 </div>
//               </>
//             ))}

//           {stepParams === "33" && (
//             <FirstStep
//               onSubmitVoucher={addVoucher}
//               onCancelVoucher={handleCancelVoucher}
//               detail={detail}
//               ticket={ticket}
//               totalSubtotalPrice={totalSubtotalPrice}
//               totalCount={totalCount}
//               form={form}
//               setForm={setForm}
//               error={error}
//               onSubmit={submitForm}
//               setFormValid={setIsFormValid}
//               haveVoucher={voucher}
//             />
//           )}
//           {stepParams === "66" && (
//             <SecondStep
//               voucher={voucher}
//               detail={detail}
//               ticket={ticket}
//               totalSubtotalPrice={totalSubtotalPrice}
//               totalCount={totalCount}
//               onSubmit={submitData}
//               payment={payment}
//               setPayment={setPayment}
//               setBank={setBank}
//               loading={loading}
//               paymentList={detail.has_event_payment_method.map((e) => e.has_payment_method)}
//             />
//           )}
//           {stepParams === "100" && <ThirdStep voucher={voucher} scrollToTop={scrollToTop} setLoading={setLoading} setStep={setStep} transactionData={transactionData} detail={detail} xenditInvoice={xenditInvoice} loading={loading} />}
//           {step === 2 && transactionData && (
//             <div className="bg-primary-light px-4 sm:px-6 md:px-8 lg:px-8 mt-20 mb-4">
//               {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-full h-72 object-cover lg:rounded-3xl md:rounded-2xl rounded-medium" />}

//               <div className="bg-white mt-4">
//                 <div className="border-b-2 p-3 border-primary-light">
//                   <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
//                 </div>
//                 <div className="border-b-2 p-3 border-primary-light flex gap-3"></div>
//               </div>

//               <div className="bg-white mt-1">
//                 <div className="border-b-2 p-3 border-primary-light flex gap-3">
//                   <div className="flex items-center gap-3">
//                     <p className=" font-semibold">{paymentMethod.payment_name}</p>
//                     <Image src={bank} alt="BCA" />
//                   </div>
//                 </div>
//                 <div className="bg-white mt-1">
//                   <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//                     <div>
//                       <p className="text-xs text-grey mb-1">Kode Invoice</p>
//                       <p className="text-sm mb-1">{transactionData.invoice_no}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-grey mb-1">No. Rekening</p>
//                       <p className="text-sm mb-1">{paymentMethod.account_no}</p>
//                       <p className="text-xs mb-1">Atas Nama {paymentMethod.account_name}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-grey mb-1">Total Pembayaran</p>
//                       <p className="text-sm mb-1">{`Rp${transactionData.grandtotal.toLocaleString("id-ID")}`}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white mt-1">
//                 <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//                   <div className="flex justify-between">
//                     <p className="text-xs text-grey mb-1">Regular Ticket {`x(${transactionData.total_qty})`}</p>
//                     <p className="text-xs mb-1">Rp {transactionData.total_price.toLocaleString("id-ID")}</p>
//                   </div>
//                   {voucher && (
//                     <div className="flex justify-between">
//                       {voucher.map((v) => (
//                         <p key={v.id} className="text-xs text-grey mb-1">
//                           Voucher {v.name}
//                         </p>
//                       ))}
//                       <p className="text-xs mb-1">Rp {voucher.reduce((sum, v) => sum + v.amount, 0).toLocaleString("id-ID")}</p>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-grey mb-1">Pajak</p>
//                     <p className="text-xs mb-1">Rp {transactionData.ppn ? transactionData.ppn.toLocaleString("id-ID") : 0}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-grey mb-1">Biaya Admin</p>
//                     <p className="text-xs mb-1">Rp {transactionData.admin_fee ? transactionData.admin_fee.toLocaleString("id-ID") : 0}</p>
//                   </div>
//                   <div className="border-t-2 border-primary-light">
//                     <div className="flex items-center justify-between font-semibold">
//                       <p>Total Pembayaran</p>
//                       <p>{`Rp ${(transactionData.grandtotal - (voucher ? voucher.reduce((sum, v) => sum + v.amount, 0) : 0)).toLocaleString("id-ID")}`}</p>
//                     </div>
//                     {transactionData.xendit_url ? (
//                       <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3" onClick={() => router.push(transactionData.xendit_url)}>
//                         {loading ? <Spinner color="default" size="sm" /> : "Checkout"}
//                       </button>
//                     ) : (
//                       <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3" onClick={() => handleShowModal()}>
//                         {loading ? <Spinner color="default" size="sm" /> : "Upload Bukti Pembayaran"}
//                       </button>
//                     )}
//                     <ModalTransaction id={transactionData.id} invoice={transactionData.invoice_no} isOpen={showModalTransaction} setIsOpen={setShowModalTransaction} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           {step === 3 && transactionData && xenditInvoice && (
//             <div className="bg-primary-light max-w-xl pt-16 mx-auto">
//               {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-full" />}

//               <div className="bg-white">
//                 <div className="border-b-2 p-3 border-primary-light">
//                   <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
//                 </div>
//                 <div className="border-b-2 p-3 border-primary-light flex gap-3"></div>
//               </div>

//               <div className="bg-white mt-1">
//                 <div className="border-b-2 p-3 border-primary-light flex gap-3">
//                   <div className="flex items-center gap-3">
//                     <p className="font-semibold">{xenditInvoice.bank_code}</p>
//                   </div>
//                 </div>
//                 <div className="bg-white mt-1">
//                   <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//                     <div>
//                       <p className="text-xs text-grey mb-1">Kode Invoice</p>
//                       <p className="text-sm mb-1">{transactionData.invoice_no}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-grey mb-1">No. Virtual Account</p>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm mb-1">{xenditInvoice.bank_account_number}</p>
//                         <button onClick={handleCopy} className="hover:bg-primary-light-200 p-1 rounded-md">
//                           <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
//                         </button>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-xs text-grey mb-1">Total Pembayaran</p>
//                       <p className="text-sm mb-1">{`Rp${xenditInvoice.transfer_amount.toLocaleString("id-ID")}`}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white mt-1">
//                 <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//                   <div className="flex justify-between">
//                     <p className="text-xs text-grey mb-1">Regular Ticket {`x(${transactionData.total_qty})`}</p>
//                     <p className="text-xs mb-1">Rp {transactionData.total_price.toLocaleString("id-ID")}</p>
//                   </div>
//                   {voucher && (
//                     <div className="flex justify-between">
//                       {voucher.map((v) => (
//                         <p key={v.id} className="text-xs text-grey mb-1">
//                           Voucher {v.name}
//                         </p>
//                       ))}
//                       <p className="text-xs mb-1">Rp {voucher.reduce((sum, v) => sum + v.amount, 0).toLocaleString("id-ID")}</p>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-grey mb-1">Pajak</p>
//                     <p className="text-xs mb-1">Rp {transactionData.ppn ? transactionData.ppn.toLocaleString("id-ID") : 0}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs text-grey mb-1">Biaya Admin</p>
//                     <p className="text-xs mb-1">Rp {transactionData.admin_fee ? transactionData.admin_fee.toLocaleString("id-ID") : 0}</p>
//                   </div>
//                   <div className="border-t-2 border-primary-light">
//                     <div className="flex items-center justify-between font-semibold">
//                       <p>Total Pembayaran</p>
//                       <p>{`Rp${(transactionData.grandtotal - (voucher ? voucher.reduce((sum, v) => sum + v.amount, 0) : 0)).toLocaleString("id-ID")}`}</p>
//                     </div>
//                     <Link href={`/success/${transactionData.invoice_no}`} target="_blank">
//                       <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3">{loading ? <Spinner color="default" size="sm" /> : "Cek Status Pembayaran"}</button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </Context.Provider>
//     )
//   ) : (
//     <Spinner color="primary" size="lg" className="min-h-screen flex items-center justify-center" />
//   );
// };

// const EventCountdown = ({ startdate, starttime }: { startdate?: string; starttime?: string }) => {
//   const { t } = useTranslation();
//   const [timoutHash, setTimeoutHash] = useState("");
//   const interval = useInterval(() => setTimeoutHash(randomId()), 1000);

//   useEffect(() => {
//     interval.start();
//   }, []);

//   const timeToEvent = useMemo((): [number, string][] => {
//     const date = `${startdate} ${starttime}`;
//     const targetDate = new Date(date);
//     const now = new Date();
//     const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

//     if (diffInSeconds < 0) {
//       return [];
//     }

//     const secondsInMinute = 60;
//     const secondsInHour = 3600;
//     const secondsInDay = 86400;

//     const days = Math.floor(diffInSeconds / secondsInDay);
//     const hours = Math.floor((diffInSeconds % secondsInDay) / secondsInHour);
//     const minutes = Math.floor((diffInSeconds % secondsInHour) / secondsInMinute);
//     const seconds = diffInSeconds % secondsInMinute;

//     const result: [number, string][] = [];
//     if (days > 0) result.push([days, t("hari")]);
//     result.push([hours, t("jam")]);
//     result.push([minutes, t("menit")]);
//     result.push([seconds, t("detik")]);
//     return result;
//   }, [timoutHash]);

//   return (
//     <Flex align="center" gap={5} className={`! bottom-3 right-3`} mb={10}>
//       {timeToEvent.map((e, i) => (
//         <AspectRatio key={i}>
//           <Card w={42} radius={10} p={0} className={`border border-white/50 backdrop-blur-sm !bg-black/20`} key={i}>
//             <Stack align="center" justify="center" h="100%" gap={3} c="white">
//               <Text fw={600} size="16px">
//                 {e[0]}
//               </Text>
//               <Text size="9px">{e[1]}</Text>
//             </Stack>
//           </Card>
//         </AspectRatio>
//       ))}
//     </Flex>
//   );
// };

// export default EventDetails;

import Head from "next/head";
import bank from "@images/bca.png";
import config from "@/Config";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, createContext, Dispatch, SetStateAction, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TicketProps, TransactionProps, EventProps } from "@/utils/globalInterface";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { Get, Post } from "@/utils/REST";
import Link from "next/link";
import ModalTransaction from "@/components/ModalTransaction";
import { faBookmark as faBookmarkOutlined, faCopy } from "@fortawesome/free-regular-svg-icons";
import { formatDate, formatYear } from "@/utils/useFormattedDate";
import { faArrowLeft, faCalendar, faCheck, faClock, faLocationDot, faShareNodes, faTicket } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Progress, Spinner } from "@nextui-org/react";
import xendit from "../../assets/images/xendit.png";
import TicketViewBlock from "@/components/Detail/TicketViewBlock";
import useWindowSize from "@/utils/useWindowSize";
import { toast } from "react-toastify";
import Images from "@/components/Images";
import InputField from "@/components/Input";
import Button from "@/components/Button";
import { useParams, useSearchParams } from "next/navigation";
import FirstStep from "@/components/Payment/FirstStep";
import SecondStep from "@/components/Payment/SecondStep";
import ImagesWithModal from "@/components/Images/ImagesWithModal";
import AuthModal from "@/components/AuthModal";
import React from "react";
import ChatBox from "@/components/chat";
import { Flex, Stack, Text, Image as ImageM, ActionIcon, Box, Card, AspectRatio } from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";
import { randomId, useClickOutside, useInterval, useListState, useTimeout } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import fetch from "@/utils/fetch";
import { BookmarkListResponse, BookmarkRequest } from "@/types/bookmark";
import Cookies from "js-cookie";
import useLoggedUser from "@/utils/useLoggedUser";
import { faBookmark as bookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { modals } from "@mantine/modals";
import { SeatmapData } from "@/utils/formInterface";
import { useTranslation } from "react-i18next";

interface Form {
  nik: string;
  full_name: string;
  is_profession: string;
  is_company: string;
  email: string;
  countryCode: string;
  no_telp: string;
  is_pemesan: number;
  identity_type_id: number;
  event_ticket_id: number;
  merch_product_id?: number;
  event_merch_id?: number;
  merch_variant_id?: number;
  merch_variant_name?: string;
  merch_price?: number;
  merch_note?: string;
  merch_product_name?: string;
}

interface ErrorForm {
  nik: boolean;
  nama: boolean;
  is_profession: boolean;
  is_company: boolean;
  email: boolean;
  countryCode: boolean;
  phone: boolean;
}

interface FormTicket {
  id?: number;
  event_id: number;
  event_ticket_id: number;
  name: string;
  price: number;
  subtotal_price: number;
  qty_ticket: number;
  payment_status: string;
  seat_number?: string[];
  ticket_fee?: number;
}

interface Transaction {
  data: TransactionProps;
}

interface MerchPayload {
  event_merch_id: number;
  product_variant_id: number;
  qty: number;
  noted: string;
}

const people = [
  { id: 1, name: "+62" },
  { id: 2, name: "+1" },
  { id: 3, name: "+2" },
  { id: 4, name: "+3" },
  { id: 5, name: "+4" },
];

export const EventContext = createContext<{
  seatmapData?: SeatmapData[];
  seatmapOpen?: number;
  setSeatmapOpen?: Dispatch<SetStateAction<number | undefined>>;
  ticket?: FormTicket[];
  setTicket?: Dispatch<SetStateAction<FormTicket[]>>;
  eventData?: EventProps;
  counts?: { [key: string]: number | string[] };
  setCounts?: Dispatch<SetStateAction<{ [key: string]: number | string[] }>>;
  merchSelections?: { [key: string]: { merchId: string | null; size: string | null } };
  setMerchSelections?: Dispatch<SetStateAction<{ [key: string]: { merchId: string | null; size: string | null } }>>;
}>({});

// Fungsi untuk mendapatkan zona waktu
const getTimeZone = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes("Asia/Jakarta") || timezone.includes("Asia/Bangkok")) {
    return "WIB";
  } else if (timezone.includes("Asia/Makassar") || timezone.includes("Asia/Ujung_Pandang")) {
    return "WITA";
  } else if (timezone.includes("Asia/Jayapura")) {
    return "WIT";
  }
  return "WIB";
};

// Fungsi untuk format tanggal dengan tahun
const formatDateWithYear = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("id-ID", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Fungsi untuk format waktu dengan zona waktu
const formatTimeWithZone = (time: string) => {
  return `${time} ${getTimeZone()}`;
};

// Fungsi untuk memotong HTML dengan aman tanpa merusak tag formatting
const truncateHtml = (html: string, limit: number): string => {
  let count = 0;
  let result = "";
  let inTag = false;
  let openTags: string[] = [];

  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === "<") {
      inTag = true;
      const rest = html.slice(i);
      const tagMatch = rest.match(/^<\/?([a-zA-Z0-9]+)/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        if (rest.startsWith("</")) {
          openTags = openTags.filter((t) => t !== tagName);
        } else {
          const tagContent = rest.slice(0, rest.indexOf(">") + 1);
          if (!tagContent.includes("/>") && tagName.toLowerCase() !== "br" && tagName.toLowerCase() !== "img" && tagName.toLowerCase() !== "hr") {
            openTags.push(tagName);
          }
        }
      }
    }

    result += char;

    if (char === ">") {
      inTag = false;
      continue;
    }

    if (!inTag) {
      count++;
      if (count >= limit) {
        for (let j = openTags.length - 1; j >= 0; j--) {
          result += `</${openTags[j]}>`;
        }
        break;
      }
    }
  }
  return result;
};

const EventDetails = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const [menu, setMenu] = useState(1);
  const [step, setStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [ticket, setTicket] = useState<FormTicket[]>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionProps | null>(null);
  const [xenditInvoice, setXenditInvoice] = useState<any>(null);
  const isBrowser = () => typeof window !== "undefined";
  const [selected, setSelected] = useState(people[1]);
  const [payment, setPayment] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [venueLayout, setVenueLayout] = useState<any>(null);
  const [paymentList, setPaymentList] = useState<PaymentMethod[]>([]);
  const [form, setForm] = useState<Form[]>([]);
  const [error, setError] = useState<ErrorForm>({
    nik: false,
    nama: false,
    email: false,
    is_profession: false,
    is_company: false,
    countryCode: true,
    phone: false,
  });
  const [bank, setBank] = useState<string>("");
  const [data, setData] = useState<TicketProps[]>([]);
  const [detail, setDetail] = useState<EventProps>();
  const [counts, setCounts] = useState<{ [key: string]: number | string[] }>({});
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [triggered, setTriggered] = useState<boolean>(false);
  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false);
  const totalCount = Object.values(counts).reduce((sum, count) => (sum as number) + ((typeof count == "number" ? count : count.length) as number), 0) as number;
  const router = useRouter();
  const { slug } = router.query;
  const selectedTab = Number(Cookies.get("selected"));
  const key = "key";
  const initialValue = { transactionStorage: "value" };
  const [alert, setAlert] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [loadings, setLoadings] = useListState<string>();
  const [seatmapOpen, setSeatmapOpen] = useState<number>();
  const [voucher, setVoucher] = useState<{ id: number; name: string; amount: number }[]>([]);
  const firstStepRef = useRef<any>(null);

  // State untuk menyimpan data dari step 1
  const [step1FormData, setStep1FormData] = useState<Form[]>([]);
  const [step1TicketData, setStep1TicketData] = useState<FormTicket[]>([]);
  const [step1MerchData, setStep1MerchData] = useState<MerchPayload[]>([]);
  const [submittedPayload, setSubmittedPayload] = useState<any>(null);
  const [merchSelections, setMerchSelections] = useState<{ [key: string]: { merchId: string | null; size: string | null } }>({});

  // Data Dummy untuk Deskripsi dan FAQ
  const dummyDescription = `<h4 style="margin-bottom: 12px;">Ajang Silaturahmi Pecinta Otomotif Terbesar</h4><p style="margin-bottom: 16px;"><strong>Event Reuni Mobil</strong> adalah ajang pertemuan berkala bagi para pecinta dan pemilik mobil untuk berbagi informasi, pengalaman, serta mempererat tali persaudaraan antar sesama komunitas.</p><p>Bergabunglah bersama kami untuk merayakan semangat otomotif dalam suasana yang akrab dan meriah. Berbagai hadiah menarik juga telah disiapkan untuk para peserta kegiatan!</p>`;

  const dummyFaq = `<div class="flex flex-col gap-6 text-gray-700 leading-relaxed text-sm md:text-base">
  <div>
    <h4 class="font-extrabold text-gray-900 text-sm md:text-base mb-2 tracking-wider">Aturan Umum</h4>
    <ol class="list-decimal pl-5 space-y-2">
      <li>Pembelian seluruh tiket dan layanan di Kolektix bersifat final. Seluruh transaksi yang telah berhasil tidak dapat dikembalikan (refund) maupun ditukar dalam bentuk apapun.</li>
      <li>Dengan melakukan pembelian tiket melalui platform Kolektix, Pengunjung menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan Penggunaan Layanan Kolektix.</li>
      <li>Dengan menghadiri event yang terdaftar di Kolektix, Pengunjung dianggap menyetujui bahwa dokumentasi kegiatan yang melibatkan Pengunjung dapat digunakan dan dipublikasikan oleh penyelenggara ke media sosial untuk keperluan dokumentasi dan/atau promosi.</li>
      <li>Apabila Pengunjung mengalami kendala terkait pemesanan, silakan menghubungi Customer Service Kolektix via WhatsApp.</li>
    </ol>
  </div>

  <div>
    <h4 class="font-extrabold text-gray-900 text-sm md:text-base mb-1 tracking-wider">Aturan & Tata Cara Menghadiri Event</h4>
    <p class="text-xs md:text-sm text-gray-500 mb-2 italic">Setelah berhasil mendaftar, Pengunjung akan mendapat e-tiket resmi melalui email.</p>
    <ol class="list-decimal pl-5 space-y-2">
      <li><strong>Konfirmasi Tiket</strong> berisikan rincian pembayaran dan e-tiket dari Kolektix, akan langsung dikirimkan ke email terdaftar setelah pembayaran berhasil.</li>
      <li><strong>Informasi Tambahan</strong> berisikan jadwal event, tautan panduan akses, serta link grup komunikasi (jika ada). Email akan dikirim paling lambat 2x24 jam sejak pembayaran berhasil.</li>
      <li><strong>Link Akses Masuk</strong> berisikan barcode scan fisik atau tautan online untuk bergabung ke event. Harap simpan barcode Anda dengan baik untuk proses check-in di lokasi.</li>
    </ol>
    <p class="text-xs md:text-sm text-gray-500 mt-2">Periksa inbox/spam/junk email Anda secara berkala! Segera hubungi Customer Service Kolektix apabila belum menerima email konfirmasi tiket.</p>
  </div>

  <div>
    <h4 class="font-extrabold text-gray-900 text-sm md:text-base mb-2 tracking-wider">Persiapan Sebelum Event</h4>
    <ol class="list-decimal pl-5 space-y-2">
      <li>Event dapat diselenggarakan offline atau online. Pengunjung wajib menginstal aplikasi pendukung (jika online) atau membawa e-ticket resmi (jika offline) sebelum acara dimulai.</li>
      <li>Pengunjung wajib melakukan verifikasi masuk menggunakan alamat email yang terdaftar saat pembelian tiket.</li>
      <li>Satu e-ticket hanya berlaku untuk satu orang pengunjung.</li>
      <li>Satu tautan streaming online hanya dapat digunakan pada satu perangkat secara bersamaan.</li>
      <li>Pengunjung dilarang keras menyebarluaskan barcode e-ticket, link streaming, atau materi eksklusif event kepada pihak manapun. Segala kerugian akibat kelalaian Pengunjung bukan merupakan tanggung jawab Kolektix.</li>
    </ol>
  </div>
</div>`;

  const sectionRefs = {
    info: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    lokasi: useRef<HTMLDivElement>(null),
  };
  const [activeSection, setActiveSection] = useState("info");
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const user = useLoggedUser();

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section
      const sections = [
        { id: "info", ref: sectionRefs.info },
        { id: "lokasi", ref: sectionRefs.lokasi },
        { id: "faq", ref: sectionRefs.faq },
      ];

      // Pengecekan jika sudah di paling bawah halaman
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (isAtBottom) {
        setActiveSection("faq");
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = sections[i].ref.current;
          if (el && el.getBoundingClientRect().top <= 120) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect untuk menangani scroll otomatis setelah pindah ke menu Detail
  useEffect(() => {
    if (menu === 1 && pendingScroll) {
      const timer = setTimeout(() => {
        const ref = sectionRefs[pendingScroll as "info" | "lokasi" | "faq"];
        if (ref?.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
          setPendingScroll(null);
        }
      }, 100); // Tunggu render sebentar
      return () => clearTimeout(timer);
    }
  }, [menu, pendingScroll]);

  const clickOutsideChat = useClickOutside(() => {
    if (isLogin && openChat) {
      setTimeout(() => {
        setOpenChat(false);
      }, 500);
    }
  });

  useEffect(() => {
    const bookmarked = user?.bookmarked?.find((e) => Boolean(e.event_id) && e.event_id == detail?.id);
    setBookmark(Boolean(bookmarked));
  }, [user]);

  const toggleBookmark = () => {
    if (!bookmark) {
      toggleBookmarkFetch();
      setBookmark(true);
    } else {
      modals.openConfirmModal({
        centered: true,
        title: "Hapus dari bookmark",
        children: "Apakah kamu yakin ingin menghapus event ini dari bookmark?",
        labels: { cancel: "Batal", confirm: "Hapus" },
        onConfirm: () => {
          toggleBookmarkFetch(false);
          setBookmark(false);
        },
      });
    }
  };

  const toggleBookmarkFetch = async (status: boolean = true) => {
    if (!status) {
      const bookid = user?.bookmarked?.find((e) => e.event_id == detail?.id)?.id;
      if (!bookid) {
        toast.error("Gagal Menghapus");
        return;
      }

      await fetch<any, any>({
        url: "bookmark/" + bookid,
        method: "DELETE",
        before: () => setLoadings.append("bookmark"),
        success: () => {
          const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
          Cookies.set("bookmarked", JSON.stringify(data.filter((e) => e.event_id != detail?.id)));
          toast.info("Berhasil menghapus ke bookmark");
        },
        complete: () => setLoadings.filter((e) => e != "bookmark"),
        error: () => toast.error("Gagal Menghapus"),
      });
      return;
    }

    await fetch<BookmarkRequest, BookmarkListResponse>({
      url: "bookmark-user",
      method: "POST",
      data: {
        module_id: 1,
        type: "Event",
        event_id: detail?.id ?? 0,
      },
      before: () => setLoadings.append("bookmark"),
      success: ({ data: newData }) => {
        const data = JSON.parse(Cookies.get("bookmarked") ?? "[]") as BookmarkListResponse[];
        Cookies.set("bookmarked", JSON.stringify([...data, newData]));
        toast.info("Berhasil menambahkan ke bookmark");
      },
      complete: () => setLoadings.filter((e) => e != "bookmark"),
    });
  };

  const [openShare, setOpenShare] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);

  const clickOutsideShare = useClickOutside(() => {
    if (openShare) {
      setOpenShare(false);
    }
  });

  const handleShare = () => {
    setOpenShare(!openShare);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.info("Tautan berhasil disalin!");
        setOpenShare(false);
      })
      .catch((error) => {
        console.error("Gagal menyalin tautan:", error);
      });
  };

  const handleWhatsAppShare = () => {
    const waBase = ["https://api", "whatsapp", "com/send"].join(".");
    const url = window.location.href;
    window.open(waBase + "?text=" + encodeURIComponent(url), "_blank");
    setOpenShare(false);
  };

  const handleInstagramShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.info("Tautan disalin! Membuka Instagram...");
        setTimeout(() => {
          const igBase = ["https://www", "instagram", "com"].join(".");
          window.open(igBase, "_blank");
          setOpenShare(false);
        }, 800);
      })
      .catch((error) => {
        console.error("Gagal menyalin tautan:", error);
      });
  };

  const countdownRenderer: CountdownRendererFn = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <p>Time Out</p>;
    } else {
      return (
        <p className="font-semibold">
          {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
        </p>
      );
    }
  };

  const [localStorage, setLocalStorage] = useLocalStorage(key, initialValue, {
    initializeWithValue: false,
  });

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("myDatabase", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("transactionStore")) {
          db.createObjectStore("transactionStore", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  const saveDataToIndexedDB = async (data: object) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction("transactionStore", "readwrite");
      const store = transaction.objectStore("transactionStore");

      store.put({ id: "transactionStorage", data });

      transaction.oncomplete = () => {
        router.push("/transaction-woauth");
      };

      transaction.onerror = (error) => {
        console.error("Kesalahan saat menyimpan data ke IndexedDB:", error);
      };
    } catch (error) {
      console.error("Kesalahan saat membuka database IndexedDB:", error);
    }
  };

  const setLocalStorageValue = () => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction("transactionStore", "readwrite");
        const store = transaction.objectStore("transactionStore");
        store.delete("transactionStorage");

        transaction.oncomplete = () => {
          //console.log('Data berhasil dihapus dari IndexedDB');
        };

        transaction.onerror = (error) => {
          console.error("Kesalahan saat menghapus data dari IndexedDB:", error);
        };
      })
      .catch((error) => {
        console.error("Kesalahan saat membuka database IndexedDB:", error);
      });

    const dataToStore = {
      detail,
      ticket,
      totalSubtotalPrice,
      totalCount,
      form,
      countdowns: Date.now() + 15 * 60 * 1000,
      ticket_fee: ticket.reduce((sum, item) => sum + (item.ticket_fee || 0) * item.qty_ticket, 0),
    };

    saveDataToIndexedDB(dataToStore);
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xenditInvoice.bank_account_number);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setIsCopied(false);
    }
  };

  useEffect(() => {
    if (detail?.one_id_one_ticket) {
      if (totalCount > 0) {
        const initialForm = Array.from({ length: totalCount + 1 }, (_, index) => ({
          nik: "",
          full_name: "",
          email: "",
          is_profession: "",
          is_company: "",
          countryCode: "",
          no_telp: "",
          is_pemesan: index ? 0 : 1,
          identity_type_id: 1,
          event_ticket_id: 1,
        }));
        setForm(initialForm);
      }
    } else {
      setForm([
        {
          nik: "",
          full_name: "",
          is_profession: "",
          is_company: "",
          email: "",
          countryCode: "",
          no_telp: "",
          is_pemesan: 0,
          identity_type_id: 1,
          event_ticket_id: 1,
        },
      ]);
    }
  }, [totalCount, detail?.one_id_one_ticket]);

  useEffect(() => {
    const availableIndex = data.findIndex((ticket) => ticket.is_soldout === 0 && ticket.is_finish === 0);
    if (selectedTab) {
      setSelectedDate(selectedTab);
    } else if (availableIndex !== -1 && selectedDate === null) {
      setSelectedDate(availableIndex);
    }
  }, [selectedTab, data]);

  const ticketCount = Cookies.get("ticketCount");
  const prevPath = Cookies.get("prevPath");
  const getData = () => {
    setFirstLoad(true);
    Get(`event/${slug}`, {})
      .then((res: any) => {
        setVenueLayout(res.data.has_venue_layout);
        setDetail({
          ...res.data,
          seatmap: res?.data?.seatmap ? JSON.parse(res?.data?.seatmap) : undefined,
        });
        let fetchedTickets = res.data.has_event_ticket.map((e: any) => ({
          ...e,
          avaliable_seat_number: e?.avaliable_seat_number?.split(","),
        }));

        // Injection of new tickets for specific event (mobil-reuni)
        if (slug === "mobil-reuni") {
          const mockTickets: TicketProps[] = [
            {
              id: 9901,
              event_id: res.data.id,
              name: "Presale 1 - Festival (Day 1)",
              qty: 100,
              price: 120000, // Result in 138k after 1.15x
              description: "",
              ticket_date: "2025-12-14",
              start_date: "2025-12-14",
              ticket_end: "2025-12-14 23:59:59",
              is_fullbook: 0,
              is_soldout: 0,
              is_finish: 0,
              is_ready: 1,
              is_promo: 1,
              is_bundling: 0,
              bundling_qty: 0,
              promo_title: "PRESALE",
              promo_price: 120000,
              event_schedule_date: "2025-12-14",
              valid_dates: ["2025-12-14"],
              ticket_category: "Festival",
              is_bundling_merch: 0,
              is_ots: 0,
              has_event: res.data,
              created_by: null, updated_by: null, created_at: null, updated_at: null, deleted_at: null
            },
            {
              id: 9902,
              event_id: res.data.id,
              name: "Presale 1 - Festival (2 Day Pass)",
              qty: 50,
              price: 217391, // Result in 250k after 1.15x
              icon: "solar:tickets-bold",
              description: "",
              ticket_date: "2025-12-14",
              start_date: "2025-12-14",
              ticket_end: "2025-12-15 23:59:59",
              is_fullbook: 0,
              is_soldout: 0,
              is_finish: 0,
              is_ready: 1,
              is_promo: 0,
              is_bundling: 1,
              bundling_qty: 2,
              promo_title: "",
              promo_price: 0,
              event_schedule_date: "2025-12-14",
              valid_dates: ["2025-12-14", "2025-12-15"],
              ticket_category: "Festival",
              is_bundling_merch: 0,
              is_ots: 0,
              has_event: res.data,
              created_by: null, updated_by: null, created_at: null, updated_at: null, deleted_at: null
            },
            {
              id: 9903,
              event_id: res.data.id,
              name: "Presale 2 - festival (Day 2)",
              qty: 100,
              price: 130435, // Result in ~150k after 1.15x
              description: "",
              ticket_date: "2025-12-15",
              start_date: "2025-12-15",
              ticket_end: "2025-12-15 23:59:59",
              is_fullbook: 0,
              is_soldout: 0,
              is_finish: 0,
              is_ready: 1,
              is_promo: 0,
              is_bundling: 0,
              bundling_qty: 0,
              promo_title: "",
              promo_price: 0,
              event_schedule_date: "2025-12-15",
              valid_dates: ["2025-12-15"],
              ticket_category: "Festival",
              is_bundling_merch: 0,
              is_ots: 0,
              has_event: res.data,
              created_by: null, updated_by: null, created_at: null, updated_at: null, deleted_at: null
            }
          ];
          fetchedTickets = [...fetchedTickets, ...mockTickets];
        }

        setData(fetchedTickets);
        ticketCount && prevPath === router.asPath ? setCounts(JSON.parse(ticketCount)) : initializeCounts(res.data.has_event_ticket);
        ticketCount && setMenu(2);
        if (!triggered) {
          triggerCounter(res.data.id);
        }
        setFirstLoad(false);
      })
      .catch((err: any) => {
        setFirstLoad(false);
      });
  };

  const handleShowModal = () => {
    setShowModalTransaction(!showModalTransaction);
  };
  useEffect(() => {
    const userData = Cookies.get("token");
    userData !== undefined ? setIsLogin(true) : setIsLogin(false);
  }, []);

  // Fungsi submitData yang diperbaiki
  const submitData = (merchPayload?: MerchPayload[]) => {
    console.log("submitData - called from StepPayment");
    console.log("Merch payload received:", merchPayload);

    // Simpan data dari step 1 untuk step 3
    setStep1FormData([...form]);
    setStep1TicketData([...ticket]);
    setStep1MerchData(merchPayload || []);

    setLoading(true);
    if (payment !== "") {
      getPaymentMethodById(payment);
    }

    const userData: string | undefined = Cookies.get("user_data");
    const userId = userData ? JSON.parse(userData).id : "";
    const now = new Date();
    now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
    const isoString = now.toISOString();

    const subtotalBeforeVoucher = totalSubtotalPrice;
    const voucherDiscount = voucher.reduce((sum, v) => sum + v.amount, 0);
    const subtotalAfterVoucher = Math.max(subtotalBeforeVoucher - voucherDiscount, 0);

    const taxAmount = detail?.ppn ? Math.round(subtotalAfterVoucher * (detail.ppn / 100)) : 0;

    const grandtotal = subtotalAfterVoucher + taxAmount;

    console.log("=== PAYMENT CALCULATION (Frontend) ===");
    console.log("1. Subtotal (from form):", subtotalBeforeVoucher);
    console.log("2. Voucher discount:", voucherDiscount);
    console.log("3. Subtotal after voucher:", subtotalAfterVoucher);
    console.log("4. Tax amount:", taxAmount);
    console.log("5. Grandtotal (temporary):", grandtotal);

    // Membersihkan data merchandise dari identities
    const cleanedIdentities = form.map((item) => {
      const {
        merch_product_id, event_merch_id, merch_variant_id,
        merch_variant_name, merch_price, merch_note,
        merch_product_name,
        ...cleanItem
      } = item;
      return cleanItem;
    });

    console.log("Cleaned identities:", cleanedIdentities);

    // Siapkan tickets data dengan bundling info
    const ticketsWithBundling = ticket.map((e) => {
      const ticketDetail = detail?.has_event_ticket?.find(t => t.id === e.event_ticket_id);
      const isBundling = ticketDetail?.is_bundling === 1;

      return {
        ...e,
        seatnumber_ticket: JSON.stringify(e.seat_number),
        ticket_fee: 0,
        is_bundling: ticketDetail?.is_bundling || 0,
        bundling_qty: ticketDetail?.bundling_qty || 0,
        is_bundling_merch: ticketDetail?.is_bundling_merch || 0,
        qty_ticket: isBundling ? 1 : e.qty_ticket
      };
    });

    console.log("=== TICKETS DATA ===");
    console.log("Tickets with bundling info:", ticketsWithBundling);

    var payload: { [key: string]: any } = {
      user_id: userId,
      event_id: detail?.id,
      admin_fee: 0,
      payment_status: "pending",
      vouchers: voucher.length > 0 ? voucher.map((v) => ({
        voucher_id: v.id,
        voucher_code: v.name,
        voucher_amount: v.amount,
      })) : [],
      identities: cleanedIdentities,
      tickets: ticketsWithBundling,
      grandtotal: grandtotal,
      bank_code: bank ?? "xendit",
      expiration_date: isoString,
      payment_method: payment || "0",
      ppn: taxAmount,
      total_ticket_fee: 0,
    };

    if (merchPayload && merchPayload.length > 0) {
      payload.is_merch = 1;
      payload.merches = merchPayload;
      console.log("Adding merchandise to payload:", merchPayload);
    } else if (firstStepRef.current?.getMerchPayload) {
      const merchFromRef = firstStepRef.current.getMerchPayload();
      if (merchFromRef && merchFromRef.length > 0) {
        payload.is_merch = 1;
        payload.merches = merchFromRef;
        console.log("Adding merchandise from ref:", merchFromRef);
      }
    }

    setSubmittedPayload(payload);
    console.log("💾 Saved submitted payload:", payload);

    console.log("=== FINAL PAYLOAD TO BACKEND ===");
    console.log(JSON.stringify(payload, null, 2));

    setLoading(true);
    Post("transaction", payload)
      .then((res: any) => {
        if (res?.isFree) {
          router.push("/success/" + res.invoice_no);
          return;
        }

        const transactionWithMerch = {
          ...res.data,
          merches: res.merches || [],
          submittedPayload: payload
        };

        setTransactionData(transactionWithMerch);

        if (res.xendit_invoice && res.xendit_invoice.va_number) {
          setXenditInvoice(res.xendit_invoice.va_number[0]);
        }

        console.log("=== RESPONSE FROM BACKEND ===");
        console.log("Backend data:", res.data);
        console.log("Total price from backend:", res.data.total_price);
        console.log("Admin fee from backend:", res.data.admin_fee);
        console.log("Grandtotal from backend:", res.data.grandtotal);

        if (res.merches && res.merches.length > 0) {
          console.log("Merches from backend:", res.merches);
        }

        if (res.data) {
          setStep(100);
          scrollToTop();
        }
      })
      .catch((err: any) => {
        if (err?.response?.data?.out_of_stock) {
          notifications.show({
            color: "red",
            position: "top-right",
            message: `Maaf, tiket yang tersedia tidak mencukupi`,
          });
        } else {
          notifications.show({
            color: "red",
            position: "top-right",
            message: err.response?.data?.message,
          });
        }
        if ((err?.response?.data?.message ?? err?.message) === "The account is not registered yet") {
          router.push("/auth");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initializeCounts = (data: TicketProps[]) => {
    const initialCount: Record<number, number> = {};
    data.forEach((item) => {
      initialCount[item.id] = 0;
    });
    setCounts(initialCount);
  };

  const updateDataBasedOnCounts = () => {
    const newData: FormTicket[] = Object.keys(counts)
      .filter((id) => ((typeof counts[parseInt(id)] == "number" ? counts[parseInt(id)] : (counts[parseInt(id)] as string[]).length) as number) > 0)
      .map((id, idx) => {
        const ticketItem = data.find((el) => el.id === parseInt(id));
        return {
          id: parseInt(id),
          event_id: detail?.id ?? 0,
          event_ticket_id: parseInt(id),
          price: ticketItem?.price || 0,
          ticket_fee: ticketItem?.ticket_fee || 0,
          name: ticketItem?.name || "",
          subtotal_price: (ticketItem?.price || 0) * (typeof counts[id] == "number" ? counts[id] : counts[id].length),
          qty_ticket: (typeof counts[parseInt(id)] == "number" ? counts[parseInt(id)] : (counts[parseInt(id)] as string[]).length) as number,
          payment_status: "pending",
          seat_number: (typeof counts[parseInt(id)] == "object" ? counts[parseInt(id)] : undefined) as string[] | undefined,
        };
      });

    setTicket(newData);
  };

  const triggerCounter = (id: string) => {
    if (data) {
      setFirstLoad(true);
      if (!triggered) {
        Post("event-counter", { event_id: id })
          .then((res) => {
            setFirstLoad(false);
            setTriggered(true);
          })
          .catch((err) => {
            setTriggered(true);
            setFirstLoad(false);
          });
      }
    }
  };

  let totalPrice = 0;
  let totalQty = 0;

  ticket.forEach((item) => {
    totalPrice += item.price;
    totalQty += item.qty_ticket;
  });

  let totalSubtotalPrice = 0;

  ticket.forEach((item) => {
    totalSubtotalPrice += item.subtotal_price;
  });

  useEffect(() => {
    if (slug) {
      getData();
      getPaymentMethod();
    }
  }, [slug]);

  useEffect(() => {
    if (data.length > 0) {
      updateDataBasedOnCounts();
    }
  }, [counts]);

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isOnePayment = (detail?.has_event_payment_method.length ?? 2) <= 1;

  const submitForm = () => {
    console.log("submitForm");

    if (detail) {
      if (isOnePayment) {
        console.log("isOnePayment");
        setPayment((paymentList?.find((e) => e?.id === 4) ?? { id: 0 }).id.toString());
        submitData([]);
      } else {
        setStep(66);
      }
    }
    scrollToTop();
  };

  const getPaymentMethodById = (id: string) => {
    setLoading(true);
    Get(`payment-method/${id}`, {})
      .then((res: any) => {
        setPaymentMethod(res.data);
      })
      .catch((err: any) => {
        setLoading(false);
      });
  };

  const getPaymentMethod = () => {
    setFirstLoad(true);
    Get(`payment-method`, {})
      .then((res: any) => {
        setPaymentList(res);
        setFirstLoad(false);
      })
      .catch((err: any) => {
        setFirstLoad(false);
      });
  };

  const renderer: CountdownRendererFn = ({ minutes, seconds, completed }) => {
    if (completed) {
      router.back();
    } else {
      return (
        <p className="font-semibold">
          {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
        </p>
      );
    }
  };

  const params = useSearchParams();
  const stepParams = params.get("step");
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleChatClick = () => {
    const userData = Cookies.get("user_data");

    if (userData) {
      router.push("/chat");
    } else {
      setAuthModalVisible(true);
    }
  };

  useEffect(() => {
    if (slug) {
      if (step > 32) {
        slug && router.push(`/event/${slug}?step=${step}`);
      } else {
        router.push(`/event/${slug}`);
      }
    }
  }, [step, slug]);

  function padToTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }
  const now = new Date();
  const targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  useEffect(() => {
    if (step !== 100) {
      const unloadCallback = (e: any) => {
        e.preventDefault();
        e.returnValue = "";
        return "";
      };
      window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
    }
  }, [step]);

  const dayName = days[targetDate.getDay()];
  const day = padToTwoDigits(targetDate.getDate());
  const month = months[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  const hours = padToTwoDigits(targetDate.getHours());
  const minutes = padToTwoDigits(targetDate.getMinutes());

  const formattedDate = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;

  const isGratis = useMemo(() => {
    if (data) {
      const total = data.reduce((q, n) => q + (n.price ?? 0), 0);
      return total <= 0;
    } else {
      return false;
    }
  }, [data]);

  function isCurrentTimeBetween(startDate: string, endDate: string): boolean {
    const start = moment(startDate, "YYYY-MM-DD HH:mm:ss");
    const end = moment(endDate, "YYYY-MM-DD HH:mm:ss");
    const now = moment();

    return now.isBetween(start, end, undefined, "[]");
  }

  function isDatePassed(dateString: string) {
    const date = moment(dateString, "YYYY-MM-DD HH:mm:ss");
    return date.isBefore(moment());
  }

  const countdownTime = useMemo(() => {
    const targetDate = new Date();
    targetDate.setMinutes(targetDate.getMinutes() + 15);

    return targetDate;
  }, []);

  const addVoucher = (data: { id: number; name: string; amount: number }) => {
    const isDuplicate = voucher.some((v) => v.id === data.id);
    if (isDuplicate) {
      notifications.show({
        color: "red",
        position: "top-right",
        message: "Voucher sudah digunakan.",
      });
      return;
    }
    setVoucher((prevVouchers) => [...prevVouchers, data]);
  };

  const handleCancelVoucher = (index: number) => {
    setVoucher((prevVouchers) => prevVouchers.filter((_, i) => i !== index));
  };

  // Tentukan step yang aktif
  const activeStep = stepParams ? parseInt(stepParams) : step;

  // Cek apakah sedang dalam proses payment step
  const isInPaymentFlow = activeStep === 33 || activeStep === 66 || activeStep === 100;

  return !firstLoad && detail ? (
    detail && (
      <EventContext.Provider
        value={{
          seatmapData: detail.seatmap,
          seatmapOpen,
          setSeatmapOpen,
          ticket,
          setTicket,
          counts,
          setCounts,
          eventData: detail,
          merchSelections,
          setMerchSelections,
        }}
      >
        <div className="text-dark w-full font-inter">
          <div ref={clickOutsideChat} className={`${openChat ? "" : "hidden"}`}>
            <ChatBox toggleOpenTab={() => setOpenChat(!openChat)} openTab={openChat} creatorIdOpen={parseInt(detail.creator_id)} />
            <AuthModal visible={openChat && !isLogin} onClose={() => setOpenChat(false)} />
          </div>
          <Head>
            <meta name="author" content="PT.Kolektix Maju Bersama" />
            <meta name="copyright" content="&copy;2024 kolektix Maju Bersama" />
            <meta name="description" content={detail ? detail?.description.replace(/(<([^>]+)>)/gi, "") : ""} />
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <title>Kolektix.com | {detail?.name}</title>
          </Head>

          {/* PERBAIKAN: Render berdasarkan activeStep dengan kondisi eksklusif */}
          {!isInPaymentFlow && menu === 1 && (
            <>
              <div className="fixed bottom-0 opacity-90 w-full bg-white border-2 border-t-primary-light border-x-0 border-b-0 drop-shadow-md z-30">
                <div className="flex justify-between items-center py-3 px-5">
                  <p className="text-sm font-bold">{detail?.name}</p>
                  <Link href="#ticket-picker">
                    <button
                      className="bg-primary-base text-white px-4 py-2 font-semibold text-sm rounded-md disabled:bg-primary-disabled disabled:cursor-not-allowed"
                      onClick={() => {
                        setMenu(2);
                      }}
                    >
                      {isGratis ? t("registrationTicketTab") : t("openTicketTab")}
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Progress bar hanya muncul saat dalam payment flow */}
          {isInPaymentFlow && step !== 2 && stepParams !== null && width && width < 768 && (
            <>
              <div className="w-full sticky top-0 bg-primary-base z-50">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center">
                    <button onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))}>
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-3 text-white" />
                    </button>
                    <div>
                      <p className="text-white text-xs mb-1">{step === 33 ? "1 " : step === 66 ? "2 " : "3 "}dari 3</p>
                      <p className="text-white text-sm font-semibold">{step === 33 ? "Informasi Pribadi" : step === 66 ? "Konfirmasi" : "Pembayaran"}</p>
                    </div>
                  </div>
                  <div className="">
                    <button disabled={loading} className="text-white text-xs mb-1">
                      {t("next")}
                    </button>
                    <p className="text-white text-sm">{step === 33 ? "Konfirmasi" : "Pembayaran"}</p>
                  </div>
                </div>

                <Progress size="sm" color="success" aria-label="Loading..." value={step} />
              </div>
              <div className="w-full fixed flex justify-between gap-3 bottom-0 bg-white border-t-2 border-t-primary-light-200 z-50 p-5">
                <div className="hidden lg:flex items-center gap-0 md:gap-3 bg-[#EA4D3E] text-white px-3 py-2 rounded-md">
                  <Countdown date={countdownTime} renderer={renderer} />
                  <div className="w-[1px] mx-1 md:mx-0 h-5 bg-primary-light-200"></div>
                  <p className="text-xs">{t("completeYourOrder")}</p>
                </div>
                <Flex align="center" gap={10}>
                  <Button color="secondary" label={t("previous")} onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))} />
                  {step === 66 ? (
                    <Button color="primary" label={t("next")} loading={loading} disabled={loading || payment === ""} onClick={() => submitData([])} />
                  ) : step === 100 && transactionData ? (
                    <Button
                      color="primary"
                      label="Bayar Sekarang"
                      disabled={loading || payment === ""}
                      onClick={
                        payment === "4" && transactionData.xendit_url
                          ? () => {
                            setLoading(true);
                            router.push(transactionData.xendit_url);
                          }
                          : payment === "3"
                            ? () => {
                              setStep(3);
                              scrollToTop();
                            }
                            : () => {
                              setStep(2);
                              scrollToTop();
                            }
                      }
                    />
                  ) : (
                    <Button
                      color="primary"
                      label={t("next")}
                      loading={loading}
                      disabled={!isFormValid || loading}
                      onClick={() => (step === 33 ? (isOnePayment ? submitForm() : (detail ? totalSubtotalPrice + detail.admin_fee * totalCount + (detail.ppn || 0) : 0) == 0 ? submitData([]) : setStep(66)) : setStep(100))}
                    />
                  )}
                </Flex>
              </div>
            </>
          )}

          {isInPaymentFlow && step !== 2 && stepParams !== null && width && width >= 768 && (
            <div className="w-full fixed flex justify-between gap-3 bottom-0 bg-white border-t-2 border-t-primary-light-200 z-50 p-5">
              <div className="hidden lg:flex items-center gap-0 md:gap-3 bg-[#EA4D3E] text-white px-3 py-2 rounded-md">
                <Countdown date={countdownTime} renderer={renderer} />
                <div className="w-[1px] mx-1 md:mx-0 h-5 bg-primary-light-200"></div>
                <p className="text-xs">{t("completeYourOrder")}</p>
              </div>
              <Flex align="center" gap={10}>
                <Button color="secondary" label={t("previous")} onClick={() => (step === 100 ? setStep(66) : step === 33 ? (ticketCount ? window.location.reload() : setStep(0)) : setStep(33))} />
                {step === 66 ? (
                  <Button color="primary" label={t("next")} loading={loading} disabled={loading || payment === ""} onClick={() => submitData([])} />
                ) : step === 100 && transactionData ? (
                  <Button
                    color="primary"
                    label="Bayar Sekarang"
                    disabled={loading || payment === ""}
                    onClick={
                      payment === "4" && transactionData.xendit_url
                        ? () => {
                          setLoading(true);
                          router.push(transactionData.xendit_url);
                        }
                        : payment === "3"
                          ? () => {
                            setStep(3);
                            scrollToTop();
                          }
                          : () => {
                            setStep(2);
                            scrollToTop();
                          }
                    }
                  />
                ) : (
                  <Button
                    disabled={!isFormValid || loading}
                    color="primary"
                    loading={loading}
                    label={t("next")}
                    onClick={() => (step === 33 ? (isOnePayment ? submitForm() : (detail ? totalSubtotalPrice + detail.admin_fee * totalCount + (detail.ppn || 0) : 0) == 0 ? submitData([]) : setStep(66)) : setStep(100))}
                  />
                )}
              </Flex>
            </div>
          )}

          {/* PERBAIKAN: Gunakan switch case untuk render konten utama */}
          {(() => {
            switch (activeStep) {
              case 0:
              case null:
              case undefined:
                // Halaman detail event
                return (
                  <React.Fragment>
                    {width && width > 768 ? (
                      <React.Fragment>
                        <div className={`${menu === 2 && detail?.seatmap && detail.seatmap.length > 0 ? "pt-16 pb-4" : "pt-24 pb-3"} bg-primary-dark transition-all duration-500`}>
                          <div className="w-full mx-auto max-w-[1250px]">
                            <Flex justify="space-between" align="end" className="px-4 md:px-6">
                              <div>
                                <p className={`text-white/70 mb-[-10px] text-xs uppercase tracking-widest`}>{detail?.has_category_event?.name}</p>
                                <h3 className={`${menu === 2 && detail?.seatmap && detail.seatmap.length > 0 ? "text-xl my-2" : "text-2xl my-4"} text-white font-bold transition-all duration-500`}>{detail?.name}</h3>
                              </div>

                              {!isDatePassed(`${detail?.start_date} ${detail?.start_time}:00`) && (
                                <Stack gap={8} align="end">
                                  <Text size="xs" c="white" className="opacity-70 uppercase tracking-wider">
                                    {t("eventStartsIn")}
                                  </Text>
                                  <EventCountdown startdate={detail?.start_date} starttime={detail?.start_time} />
                                </Stack>
                              )}
                            </Flex>
                            <div className="flex justify-between gap-5 h-full items-stretch px-4 md:px-6">
                              <Stack w="100%">
                                <Box pos="relative">
                                  {detail?.image ? (
                                    <ImagesWithModal type="event" path={detail.image} width={1000} height={1000} alt="banner" className="w-full h-72 object-fill lg:rounded-3xl md:rounded-2xl rounded-full" />
                                  ) : (
                                    <div className="w-full h-72 bg-white lg:rounded-3xl md:rounded-2xl rounded-full"></div>
                                  )}

                                  {isCurrentTimeBetween(`${detail?.start_date} ${detail?.start_time}:00`, `${detail?.end_date} ${detail?.end_time}:00`) && (
                                    <Card className={`!absolute z-20 top-3 right-3 w-fit !rounded-full !border !border-white/50 backdrop-blur-sm`} p="4px 16px 4px 30px" bg="#00000030">
                                      <Flex gap={10} align="center">
                                        <Icon icon="ph:dot-duotone" className={`absolute top-2/4 left-0 -translate-y-2/4 !text-[40px] mr-[-20px] animate-pulse !text-red-500`} />
                                        <Icon icon="mynaui:video" className={`!text-[24px] !text-red-500`} />
                                        <Text fw={600} c="white" size="xs">
                                          Live Event
                                        </Text>
                                      </Flex>
                                    </Card>
                                  )}
                                </Box>

                                <div className="flex justify-between items-center text-white px-5 py-4">
                                  <div className="flex items-center gap-4">
                                    {detail.has_event_social_meida?.instagram && (
                                      <Link href={detail.has_event_social_meida?.instagram} target="_blank" rel="noreferrer" className="flex items-center">
                                        <FontAwesomeIcon icon={faInstagram} className="mr-2 text-lg " />
                                        <p className=" font-normal text-sm mr-3">{detail.has_event_social_meida.ig_name}</p>
                                      </Link>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    {isLogin && (
                                      <Box onClick={toggleBookmark}>
                                        <FontAwesomeIcon icon={bookmark ? bookmarkSolid : faBookmarkOutlined} className="text-xl " />
                                      </Box>
                                    )}
                                  </div>
                                </div>
                              </Stack>                              <Stack className="w-full md:max-w-[300px] h-72 justify-between" gap={12}>
                                <div className="bg-white/10 backdrop-blur-md rounded-md md:rounded-lg lg:rounded-xl border border-white/20 p-4 shadow-xl text-white flex flex-col justify-center flex-1">
                                  <Stack gap={10}>
                                    <Flex align="center" gap={10}>
                                      <Icon icon="solar:calendar-bold" className="text-white text-[22px] shrink-0" />
                                      <Text c="white" size="sm" className="font-normal">{detail && `${formatDate(detail.start_date)} ${detail.start_date !== detail.end_date ? "- " + formatDate(detail.end_date) : ""} ${formatYear(detail.end_date)}`}</Text>
                                    </Flex>
                                    <Flex align="center" gap={10}>
                                      <Icon icon="tabler:clock-filled" className="text-white text-[22px] shrink-0" />
                                      <Text c="white" size="sm" className="font-normal">
                                        {detail?.start_time.toString()} - {detail?.end_time.toString()} {getTimeZone()}
                                      </Text>
                                    </Flex>
                                    <Link href={detail?.location_map ?? "#"} target="_blank" className="hover:underline">
                                      <Flex align="center" gap={10}>
                                        <Icon icon="tdesign:location-filled" className="text-white text-[22px] shrink-0" />
                                        <Text c="white" size="sm" className="line-clamp-2 font-normal">{detail?.location_name}</Text>
                                      </Flex>
                                    </Link>
                                    <div className="h-[1px] bg-white/10 w-full my-0.5" />
                                    <div className="flex flex-col gap-1.5">
                                      <Text c="white" className="text-[9px] opacity-75 tracking-wider font-normal">
                                        {t("organizedBy")}
                                      </Text>
                                      <Flex align="center" gap={10}>
                                        <ImageM src={`${config.assetUrl}creator/${detail?.has_creator?.image}`} alt="image" radius="full" w={64} h={64} className="border border-white/20 object-contain bg-white/10 shrink-0" />
                                      </Flex>
                                    </div>
                                  </Stack>
                                </div>
                                <div className="w-full bg-white/10 backdrop-blur-md rounded-md md:rounded-lg lg:rounded-xl border border-white/20 p-1.5 flex items-center gap-3 shadow-xl relative">
                                      {/* SHARE BUTTON */}
                                      <button
                                        onClick={handleShare}
                                        className="flex-1 bg-[#0b387c] hover:bg-[#0b387c]/90 text-white p-2.5 rounded-lg transition-all flex items-center justify-center relative"
                                        title="Share Event"
                                      >
                                        <Icon icon="solar:share-bold" className="text-white text-[22px]" />
                                      </button>
 
                                      {/* CHAT BUTTON */}
                                      <button
                                        onClick={() => setOpenChat(!openChat)}
                                        className="flex-1 bg-[#0b387c] hover:bg-[#0b387c]/90 text-white p-2.5 rounded-lg transition-all flex items-center justify-center"
                                        title="Chat"
                                      >
                                        <Icon icon="fluent:chat-12-filled" className="text-white text-[22px]" />
                                      </button>

                                      {/* SHARE POPUP CARD */}
                                      {openShare && (
                                        <div ref={clickOutsideShare} className="absolute bottom-[66px] left-0 right-0 z-30 bg-[#092e66]/95 border border-white/20 backdrop-blur-md rounded-xl p-3 shadow-2xl flex justify-around items-center gap-2">
                                          {/* Copy Link */}
                                          <div onClick={handleCopyLink} className="flex flex-col items-center gap-1 cursor-pointer group">
                                            <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center border border-white/10 transition-all">
                                              <Icon icon="solar:link-bold" className="text-white text-[18px]" />
                                            </div>
                                            <span className="text-[9px] text-white/90">Salin Link</span>
                                          </div>
 
                                          {/* WhatsApp */}
                                          <div onClick={handleWhatsAppShare} className="flex flex-col items-center gap-1 cursor-pointer group">
                                            <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center border border-white/10 transition-all">
                                              <Icon icon="tabler:brand-whatsapp" className="text-[#25D366] text-[20px]" />
                                            </div>
                                            <span className="text-[9px] text-white/90">WhatsApp</span>
                                          </div>
 
                                          {/* Instagram */}
                                          <div onClick={handleInstagramShare} className="flex flex-col items-center gap-1 cursor-pointer group">
                                            <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center border border-white/10 transition-all">
                                              <Icon icon="tabler:brand-instagram" className="text-[#E1306C] text-[20px]" />
                                            </div>
                                            <span className="text-[9px] text-white/90">Instagram</span>
                                          </div>

                                          {/* Caret Arrow pointing to Share Button */}
                                          <div className="w-2.5 h-2.5 bg-[#092e66] border-r border-b border-white/20 absolute bottom-[-6px] left-[25%] -translate-x-1/2 rotate-45 z-40" />
                                        </div>
                                      )}
                                </div>
                              </Stack>
                            </div>
                          </div>
                        </div>

                        {/* NEW STATIC NAV TAB BAR FOR DESKTOP (Moved from hero-section) */}
                        <div className="w-full bg-white border-b border-light-grey sticky top-[64px] z-30">
                          <div className="w-full mx-auto max-w-[1250px] px-4 md:px-6">
                            <div className="flex items-center gap-3 md:gap-8 overflow-x-auto scrollbar-hide">
                              {[
                                { id: "info", label: t("description") },
                                { id: "tiket", label: t("ticket"), type: "link" },
                                { id: "lokasi", label: "Lokasi" },
                                { id: "faq", label: t("termAndCondition") },
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => {
                                    if (tab.id === "tiket") {
                                      setMenu(2);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    } else {
                                      setActiveSection(tab.id);
                                      if (menu !== 1) {
                                        setPendingScroll(tab.id);
                                        setMenu(1);
                                      } else {
                                        const ref = sectionRefs[tab.id as "info" | "lokasi" | "faq"];
                                        ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                      }
                                    }
                                  }}
                                  className={`pb-4 pt-4 text-[13px] md:text-[14px] transition-all relative whitespace-nowrap shrink-0 ${(activeSection === tab.id && menu === 1) || (tab.id === "tiket" && menu === 2) ? "text-[#194e9e] font-semibold" : "text-grey font-medium"
                                    }`}
                                >
                                  {tab.label}
                                  {((activeSection === tab.id && menu === 1) || (tab.id === "tiket" && menu === 2)) && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#194e9e] rounded-t-lg" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={`w-full text-dark flex flex-col gap-2 ${menu === 2 ? 'pt-4 pb-0' : 'pt-8 pb-60'} bg-white`}>
                          {menu === 1 ? (
                            <div className="max-w-[1250px] mx-auto w-full flex flex-col gap-2 px-4 md:px-6">
                              {/* SECTION DESKRIPSI */}
                              <div ref={sectionRefs.info} className="w-full mb-2">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                  <Icon icon="solar:notes-linear" className="text-[#0b387c] text-[22px] md:text-[25px] shrink-0" />
                                  <h3 className="text-[18px] md:text-[22px] font-black text-[#0b387c] tracking-tight">{t("description")}</h3>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mb-2" />
                                <div className="w-full bg-transparent pl-8 pr-0 text-gray-600 leading-normal text-sm md:text-base prose prose-blue max-w-none">
                                   {!isReadMore && (detail?.description && detail.description.length > 20 ? detail.description : dummyDescription).replace(/<[^>]*>/g, "").length > 350 ? (
                                     <div className="inline-children">
                                       <style>{`
                                         .inline-children p, .inline-children div, .inline-children span, .inline-children strong, .inline-children em {
                                           display: inline !important;
                                           margin: 0 !important;
                                           padding: 0 !important;
                                         }
                                       `}</style>
                                       <div dangerouslySetInnerHTML={{ __html: truncateHtml(detail?.description && detail.description.length > 20 ? detail.description : dummyDescription, 350) }} className="inline" />
                                       <span>... </span>
                                       <button
                                         onClick={() => setIsReadMore(true)}
                                         className="text-[#194e9e] hover:text-[#0b387c] font-bold ml-1 inline-flex items-center gap-0.5"
                                       >
                                         Baca Selengkapnya
                                       </button>
                                     </div>
                                   ) : (
                                     <div>
                                       <div dangerouslySetInnerHTML={{ __html: detail?.description && detail.description.length > 20 ? detail.description : dummyDescription }} className="inline" />
                                       {(detail?.description && detail.description.length > 20 ? detail.description : dummyDescription).replace(/<[^>]*>/g, "").length > 350 && (
                                         <button
                                           onClick={() => setIsReadMore(false)}
                                           className="text-[#194e9e] hover:text-[#0b387c] font-bold ml-1.5 inline-flex items-center gap-0.5 active:scale-95 transition-all"
                                         >
                                           Sembunyikan
                                         </button>
                                       )}
                                     </div>
                                   )}
                                </div>
                              </div>

                              {/* Gray thin divider */}
                              <div className="w-full h-[1px] bg-gray-200/60 my-1" />                               {/* SECTION LOKASI */}
                              <div ref={sectionRefs.lokasi} className="w-full">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                  <Icon icon="solar:map-point-linear" className="text-[#0b387c] text-[22px] md:text-[25px] shrink-0" />
                                  <h3 className="text-[18px] md:text-[22px] font-black text-[#0b387c] tracking-tight">Lokasi Venue</h3>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mb-2" />
                                <div className="w-full pl-8">
                                  <div className="w-full bg-white rounded-2xl p-5 md:p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                                    <div className="flex flex-col gap-1.5">
                                      <h4 className="text-[16px] md:text-[18px] font-bold text-black tracking-tight">
                                        {detail?.location_name || "CBN Hall Kuningan"}
                                      </h4>
                                      <p className="text-[13px] md:text-[14px] text-gray-500 font-semibold leading-relaxed">
                                        {detail?.location_address || detail?.location_name || "Jl. Gatot Subroto No. 45, Jakarta Raya"}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => window.open(detail?.location_map?.startsWith('http') ? detail.location_map : `https://google.com/maps/search/${encodeURIComponent((detail?.name || '') + ' ' + (detail?.location_name || ''))}`, '_blank')}
                                      className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-primary-base hover:bg-primary-dark text-white rounded-full text-[12px] font-black uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95"
                                    >
                                      <Icon icon="solar:map-point-bold" className="text-[18px]" />
                                      Buka Peta
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Gray thin divider */}
                              <div className="w-full h-[1px] bg-gray-200/60 my-1" />

                              {/* SECTION FAQ DESKTOP */}
                              <div ref={sectionRefs.faq} className="w-full mb-2">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                  <Icon icon="solar:info-circle-linear" className="text-[#0b387c] text-[22px] md:text-[25px] shrink-0" />
                                  <h3 className="text-[18px] md:text-[22px] font-black text-[#0b387c] tracking-tight">{t("termAndCondition")}</h3>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mb-2" />
 
                                <div className="w-full bg-transparent pl-8 pr-0 text-gray-600 leading-normal text-sm md:text-base prose prose-blue max-w-none"
                                  dangerouslySetInnerHTML={{ __html: detail?.term_condition && detail.term_condition.length > 20 ? detail.term_condition : dummyFaq }}></div>
                                  
                              </div>
                            </div>
                          ) : (
                            /* FULL TICKET PAGE VIEW */
                             <div className="w-full flex flex-col gap-6 pt-0 pb-4 animate-fade-in">
                              <div className="w-full">
                                <TicketViewBlock
                                  venue={venueLayout}
                                  maxOrder={detail.max_buy_ticket}
                                  isGratis={isGratis}
                                  selected={selectedDate}
                                  setSelected={setSelectedDate}
                                  counts={counts}
                                  setCounts={setCounts}
                                  data={data}
                                  isLogin={isLogin}
                                  totalCount={totalCount}
                                  storeLocalStorage={setLocalStorageValue}
                                  totalSubtotalPrice={totalSubtotalPrice}
                                  setStep={setStep}
                                  scrollToTop={scrollToTop}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Box className={`!relative`}>
                          {detail && detail.image && <Images type="event" path={detail?.image} width={1000} height={1000} alt="banner" className="w-full rounded-3xl p-4 mt-20 lg:mt-0" />}

                          {isCurrentTimeBetween(`${detail?.start_date} ${detail?.start_time}:00`, `${detail?.end_date} ${detail?.end_time}:00`) && (
                            <Card className={`!absolute z-20 top-7 right-7 w-fit !rounded-full !border !border-white/50 backdrop-blur-sm`} p="4px 16px 4px 30px" bg="#00000030">
                              <Flex gap={10} align="center">
                                <Icon icon="ph:dot-duotone" className={`absolute top-2/4 left-0 -translate-y-2/4 !text-[40px] mr-[-20px] animate-pulse !text-red-500`} />
                                <Icon icon="mynaui:video" className={`!text-[24px] !text-red-500`} />
                                <Text fw={600} c="white" size="xs">
                                  Live Event
                                </Text>
                              </Flex>
                            </Card>
                          )}
                        </Box>

                        <Flex justify="space-between" gap={10} px={20} display="none">
                          <Box></Box>
                        </Flex>

                        <div className="p-5 pt-2 border-primary-light-200 border-2 border-x-0 border-t-0 border-dashed">
                          <Flex gap={10} justify="space-between" mb={5} align="center">
                            <p className={`opacity-70`}>{detail?.has_category_event?.name}</p>
                            {detail.has_event_social_meida?.ig_name && (
                              <Link href={detail.has_event_social_meida?.instagram + "/" + detail.has_event_social_meida?.ig_name} target="_blank" rel="noreferrer" className="flex items-center">
                                <Flex gap={8} align="center">
                                  <FontAwesomeIcon icon={faInstagram} className="!text-[24px] text-primary-base" />
                                  <Text size="sm" className={`!text-primary-base`}>
                                    {detail.has_event_social_meida?.ig_name}
                                  </Text>
                                </Flex>
                              </Link>
                            )}
                          </Flex>
                          <h3 className="mb-3">{detail?.name}</h3>

                          <p className="mb-3 font-normal text-sm">
                            <FontAwesomeIcon icon={faCalendar} className="mr-3 text-grey" />
                            <span className="text-dark">{detail && `${formatDateWithYear(detail?.start_date)}` + (detail.end_date !== detail.start_date ? ` - ${formatDateWithYear(detail?.end_date)}` : "")}</span>
                          </p>

                          <p className="mb-3 font-normal text-sm">
                            <FontAwesomeIcon icon={faClock} className="mr-3 text-grey" />
                            <span className="text-dark">
                              {formatTimeWithZone(detail?.start_time || "")} - {formatTimeWithZone(detail?.end_time || "")}
                            </span>
                          </p>

                          <Link href={detail?.location_map ?? "#"} target="_blank">
                            <p className="mb-3 font-normal text-sm">
                              <FontAwesomeIcon icon={faLocationDot} className="mr-3 text-grey" />
                              <span className="text-dark">{detail?.location_name}</span>
                            </p>
                          </Link>
                        </div>

                        <div className="p-5 border-primary-light-200 border-2 border-t-0 border-x-0 flex items-center gap-3">
                          <Image src={`${config.assetUrl}creator/${detail?.has_creator?.image}`} alt="image" className="w-10 h-10 border border-grey rounded-full object-contain" width={200} height={200} />
                          <div className={`w-full flex flex-col`}>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{t("organizedBy")}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <p className="font-semibold">{detail?.has_creator?.name}</p>
                              {detail?.has_creator?.is_verified === 1 && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2" className="w-4 h-4">
                                  <path d="M22 12l-2-2 1-3-3-1-1-3-3 1-2-2-2 2-3-1-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3 3-1 2 2 2-2 3 1 1-3 3-1-1-3 2-2zM10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8l-7 7z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <ActionIcon
                            color="#0B387C"
                            variant="transparent"
                            size="lg"
                            onClick={() => {
                              if (typeof navigator !== "undefined" && navigator.share) {
                                navigator.share({
                                  title: detail?.name || document.title,
                                  url: window.location.href
                                }).catch(err => console.log(err));
                              } else {
                                const url = window.location.href;
                                navigator.clipboard.writeText(url)
                                  .then(() => toast.info("Tautan berhasil disalin!"))
                                  .catch(err => console.error(err));
                              }
                            }}
                          >
                            <Icon icon="solar:share-linear" className={`!text-[26px]`} />
                          </ActionIcon>
                        </div>
                        <div className="flex bg-white items-center justify-center sticky mb-5 top-[64px] text-sm z-30">
                          <div className="flex gap-4 w-full border-b border-light-grey px-4 md:px-8 overflow-x-auto scrollbar-hide">
                            {[
                              { id: "info", label: t("description") },
                              { id: "tiket", label: t("ticket") },
                              { id: "lokasi", label: "Lokasi" },
                              { id: "faq", label: t("termAndCondition") },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  if (tab.id === "tiket") {
                                    setMenu(2);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  } else {
                                    setActiveSection(tab.id);
                                    if (menu !== 1) {
                                      setPendingScroll(tab.id);
                                      setMenu(1);
                                    } else {
                                      const ref = sectionRefs[tab.id as "info" | "lokasi" | "faq"];
                                      ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                  }
                                }}
                                className={`py-4 relative whitespace-nowrap shrink-0 text-[13px] transition-all ${(activeSection === tab.id && menu === 1) || (tab.id === "tiket" && menu === 2) ? "text-[#194e9e] font-semibold" : "text-grey font-medium"}`}
                              >
                                {tab.label}
                                {((activeSection === tab.id && menu === 1) || (tab.id === "tiket" && menu === 2)) && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#194e9e] rounded-t-lg" />}
                              </button>
                            ))}
                          </div>
                        </div>

                         <div className={`w-full text-dark flex flex-col gap-2 ${menu === 2 ? 'pt-3 pb-60' : 'pt-5 pb-60'} bg-white`}>
                          {menu === 1 ? (
                            <React.Fragment>
                              {/* MOBILE SECTION DESKRIPSI */}
                              <div ref={sectionRefs.info} className="mx-5 mb-2">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Icon icon="solar:notes-linear" className="text-[#0b387c] text-[20px] shrink-0" />
                                  <h3 className="text-[16px] md:text-[18px] font-black text-[#0b387c] tracking-tight">{t("description")}</h3>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mb-2" />
                                <div className="w-full bg-transparent pl-0 pr-0 text-gray-600 leading-normal text-[11px] font-medium prose prose-sm max-w-none [&_p]:text-[11px] [&_div]:text-[11px] [&_span]:text-[11px] [&_strong]:text-[11px] [&_em]:text-[11px] [&_a]:text-[11px]">
                                   {!isReadMore && (detail?.description && detail.description.length > 20 ? detail.description : dummyDescription).replace(/<[^>]*>/g, "").length > 300 ? (
                                     <div className="inline-children">
                                       <style>{`
                                         .inline-children p, .inline-children div, .inline-children span, .inline-children strong, .inline-children em {
                                           display: inline !important;
                                           margin: 0 !important;
                                           padding: 0 !important;
                                         }
                                       `}</style>
                                       <div dangerouslySetInnerHTML={{ __html: truncateHtml(detail?.description && detail.description.length > 20 ? detail.description : dummyDescription, 300) }} className="inline" />
                                       <span>... </span>
                                       <button
                                         onClick={() => setIsReadMore(true)}
                                         className="text-[#194e9e] hover:text-[#0b387c] font-bold ml-1 inline-flex items-center gap-0.5"
                                       >
                                         Baca Selengkapnya
                                       </button>
                                     </div>
                                   ) : (
                                     <div>
                                       <div dangerouslySetInnerHTML={{ __html: detail?.description && detail.description.length > 20 ? detail.description : dummyDescription }} className="inline" />
                                       {(detail?.description && detail.description.length > 20 ? detail.description : dummyDescription).replace(/<[^>]*>/g, "").length > 300 && (
                                         <button
                                           onClick={() => setIsReadMore(false)}
                                           className="text-[#194e9e] hover:text-[#0b387c] font-bold ml-1.5 inline-flex items-center gap-0.5 active:scale-95 transition-all"
                                         >
                                           Sembunyikan
                                         </button>
                                       )}
                                     </div>
                                   )}
                                 </div>
                              </div>

                              {/* Gray thin divider */}
                              <div className="mx-5 h-[1px] bg-gray-200/60 my-1" />

                              {/* MOBILE SECTION LOKASI */}
                              <div ref={sectionRefs.lokasi} className="w-full">
                                <div className="flex items-center gap-1.5 mb-1 px-5">
                                  <Icon icon="solar:map-point-linear" className="text-[#0b387c] text-[20px] shrink-0" />
                                  <h3 className="text-[16px] md:text-[18px] font-black text-[#0b387c] tracking-tight">Lokasi Venue</h3>
                                </div>
                                <div className="mx-5 h-[1px] bg-gray-200 mb-2" />
                                <div className="mx-5 bg-white rounded-2xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-row justify-between items-center gap-3 mb-2">
                                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <h4 className="text-[13px] font-bold text-black tracking-tight">
                                      {detail?.location_name || "CBN Hall Kuningan"}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                                      {detail?.location_address || detail?.location_name || "Jl. Gatot Subroto No. 45, Jakarta Raya"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => window.open(detail?.location_map?.startsWith('http') ? detail.location_map : `https://google.com/maps/search/${encodeURIComponent((detail?.name || '') + ' ' + (detail?.location_name || ''))}`, '_blank')}
                                    className="shrink-0 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary-base hover:bg-primary-dark text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95"
                                  >
                                    <Icon icon="solar:map-point-bold" className="text-[12px]" />
                                    Buka Peta
                                  </button>
                                </div>
                              </div>

                              {/* Gray thin divider */}
                              <div className="mx-5 h-[1px] bg-gray-200/60 my-1" />

                              {/* MOBILE SECTION FAQ */}
                              <div ref={sectionRefs.faq} className="mx-5 mb-10">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Icon icon="solar:info-circle-linear" className="text-[#0b387c] text-[20px] shrink-0" />
                                  <h3 className="text-[16px] md:text-[18px] font-black text-[#0b387c] tracking-tight">{t("termAndCondition")}</h3>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mb-2" />
                                <div className="w-full bg-transparent pl-0 pr-0 text-gray-600 leading-normal text-[11px] prose prose-sm max-w-none [&_p]:text-[11px] [&_div]:text-[11px] [&_span]:text-[11px] [&_strong]:text-[11px] [&_em]:text-[11px] [&_a]:text-[11px] [&_li]:text-[11px] [&_ul]:text-[11px] [&_ol]:text-[11px]"
                                  dangerouslySetInnerHTML={{ __html: detail?.term_condition && detail.term_condition.length > 20 ? detail.term_condition : dummyFaq }}
                                />
                              </div>

                              {/* GLOBAL BOTTOM BAR FOR DESCRIPTION/LOCATION/FAQ TABS (MOBILE ONLY) */}
                              <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 font-inter md:hidden pb-safe">
                                <div className="w-full px-6 py-2 flex flex-col gap-2">
                                  {/* Row 1: Event Name */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col min-w-0 flex-1">
                                      <span className="text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase leading-none mb-1">EVENT</span>
                                      <span className="text-[14px] font-black text-[#1e293b] leading-tight line-clamp-1">
                                        {detail?.name || "Event Reuni Mobil"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 2: Main Action & Chat */}
                                  <div className="flex items-center gap-3">
                                    <button
                                      className="flex-1 bg-[#194E9E] active:scale-[0.98] text-white h-10 font-black text-[13px] rounded-xl transition-all shadow-lg shadow-blue-900/5 flex items-center justify-center"
                                      onClick={() => {
                                        setMenu(2);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                      }}
                                    >
                                      Lihat Tiket
                                    </button>

                                    <button
                                      onClick={() => setOpenChat(!openChat)}
                                      className="w-10 h-10 bg-[#194E9E] rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-blue-900/5 shrink-0"
                                    >
                                      <Icon icon="solar:chat-round-dots-bold" className="text-white text-xl" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            /* MOBILE FULL TICKET PAGE VIEW */
                             <div className="w-full flex flex-col gap-6 pt-0 pb-2 animate-fade-in">


                              <div className="w-full">
                                <TicketViewBlock
                                  venue={venueLayout}
                                  maxOrder={detail.max_buy_ticket}
                                  isGratis={isGratis}
                                  selected={selectedDate}
                                  setSelected={setSelectedDate}
                                  counts={counts}
                                  setCounts={setCounts}
                                  data={data}
                                  isLogin={isLogin}
                                  totalCount={totalCount}
                                  storeLocalStorage={setLocalStorageValue}
                                  totalSubtotalPrice={totalSubtotalPrice}
                                  setStep={setStep}
                                  scrollToTop={scrollToTop}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );

              case 33:
                return (
                  <FirstStep
                    ref={firstStepRef}
                    currentStep={1}
                    submittedFormData={form}
                    submittedTicketsData={ticket}
                    submittedMerchesData={step1MerchData}
                    onSubmitVoucher={addVoucher}
                    onCancelVoucher={handleCancelVoucher}
                    detail={detail}
                    ticket={ticket}
                    totalSubtotalPrice={totalSubtotalPrice}
                    totalCount={totalCount}
                    form={form}
                    setForm={setForm}
                    error={error}
                    onSubmit={async () => {
                      let merchPayload = [];
                      if (firstStepRef.current && firstStepRef.current.getMerchPayload) {
                        merchPayload = await firstStepRef.current.getMerchPayload();
                        console.log("🎁 Merch payload from ref:", merchPayload);
                      }
                      submitData(merchPayload);
                    }}
                    setFormValid={setIsFormValid}
                    haveVoucher={voucher}
                    loading={loading}
                    setLoading={setLoading}
                    setStep={setStep}
                    scrollToTop={scrollToTop}
                    xenditInvoice={xenditInvoice}
                    transactionData={transactionData}
                    voucher={voucher}
                  />
                );

              case 66:
                return (
                  <SecondStep
                    voucher={voucher}
                    detail={detail}
                    ticket={ticket}
                    totalSubtotalPrice={totalSubtotalPrice}
                    totalCount={totalCount}
                    onSubmit={() => submitData([])}
                    payment={payment}
                    setPayment={setPayment}
                    setBank={setBank}
                    loading={loading}
                    paymentList={detail.has_event_payment_method.map((e) => e.has_payment_method)}
                  />
                );

              case 100:
                return (
                  <FirstStep
                    currentStep={3}
                    submittedFormData={step1FormData}
                    submittedTicketsData={step1TicketData}
                    submittedMerchesData={step1MerchData}
                    voucher={voucher}
                    scrollToTop={scrollToTop}
                    setLoading={setLoading}
                    setStep={setStep}
                    transactionData={transactionData}
                    detail={detail}
                    xenditInvoice={xenditInvoice}
                    loading={loading}
                    ticket={step1TicketData}
                    totalSubtotalPrice={totalSubtotalPrice}
                    totalCount={totalCount}
                    form={step1FormData}
                    setForm={setForm}
                    error={error}
                    onSubmit={submitData}
                    setFormValid={setIsFormValid}
                    haveVoucher={voucher}
                    onSubmitVoucher={addVoucher}
                    onCancelVoucher={handleCancelVoucher}
                  />
                );

              default:
                return null;
            }
          })()}

          {/* Render untuk step 2 dan 3 (payment confirmation) */}
          {step === 2 && transactionData && (
            <div className="bg-primary-light px-4 sm:px-6 md:px-8 lg:px-8 mt-20 mb-4">
              {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-full h-72 object-cover lg:rounded-3xl md:rounded-2xl rounded-medium" />}

              <div className="bg-white mt-4">
                <div className="border-b-2 p-3 border-primary-light">
                  <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
                </div>
                <div className="border-b-2 p-3 border-primary-light flex gap-3"></div>
              </div>

              <div className="bg-white mt-1">
                <div className="border-b-2 p-3 border-primary-light flex gap-3">
                  <div className="flex items-center gap-3">
                    <p className=" font-semibold">{paymentMethod.payment_name}</p>
                    <Image src={bank} alt="BCA" />
                  </div>
                </div>
                <div className="bg-white mt-1">
                  <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-grey mb-1">Kode Invoice</p>
                      <p className="text-sm mb-1">{transactionData.invoice_no}</p>
                    </div>
                    <div>
                      <p className="text-xs text-grey mb-1">No. Rekening</p>
                      <p className="text-sm mb-1">{paymentMethod.account_no}</p>
                      <p className="text-xs mb-1">Atas Nama {paymentMethod.account_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-grey mb-1">Total Pembayaran</p>
                      <p className="text-sm mb-1">{`Rp${transactionData.grandtotal.toLocaleString("id-ID")}`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white mt-1">
                <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-xs text-grey mb-1">Regular Ticket {`x(${transactionData.total_qty})`}</p>
                    <p className="text-xs mb-1">Rp {transactionData.total_price.toLocaleString("id-ID")}</p>
                  </div>
                  {voucher && (
                    <div className="flex justify-between">
                      {voucher.map((v) => (
                        <p key={v.id} className="text-xs text-grey mb-1">
                          Voucher {v.name}
                        </p>
                      ))}
                      <p className="text-xs mb-1">Rp {voucher.reduce((sum, v) => sum + v.amount, 0).toLocaleString("id-ID")}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-grey mb-1">Pajak</p>
                    <p className="text-xs mb-1">Rp {transactionData.ppn ? transactionData.ppn.toLocaleString("id-ID") : 0}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-grey mb-1">Biaya Admin</p>
                    <p className="text-xs mb-1">Rp {transactionData.admin_fee ? transactionData.admin_fee.toLocaleString("id-ID") : 0}</p>
                  </div>
                  <div className="border-t-2 border-primary-light">
                    <div className="flex items-center justify-between font-semibold">
                      <p>Total Pembayaran</p>
                      <p>{`Rp ${(transactionData.grandtotal - (voucher ? voucher.reduce((sum, v) => sum + v.amount, 0) : 0)).toLocaleString("id-ID")}`}</p>
                    </div>
                    {transactionData.xendit_url ? (
                      <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3" onClick={() => router.push(transactionData.xendit_url)}>
                        {loading ? <Spinner color="default" size="sm" /> : "Checkout"}
                      </button>
                    ) : (
                      <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3" onClick={() => handleShowModal()}>
                        {loading ? <Spinner color="default" size="sm" /> : "Upload Bukti Pembayaran"}
                      </button>
                    )}
                    <ModalTransaction id={transactionData.id} invoice={transactionData.invoice_no} isOpen={showModalTransaction} setIsOpen={setShowModalTransaction} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && transactionData && xenditInvoice && (
            <div className="bg-primary-light max-w-xl pt-16 mx-auto">
              {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-full" />}

              <div className="bg-white">
                <div className="border-b-2 p-3 border-primary-light">
                  <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
                </div>
                <div className="border-b-2 p-3 border-primary-light flex gap-3"></div>
              </div>

              <div className="bg-white mt-1">
                <div className="border-b-2 p-3 border-primary-light flex gap-3">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">{xenditInvoice.bank_code}</p>
                  </div>
                </div>
                <div className="bg-white mt-1">
                  <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-grey mb-1">Kode Invoice</p>
                      <p className="text-sm mb-1">{transactionData.invoice_no}</p>
                    </div>
                    <div>
                      <p className="text-xs text-grey mb-1">No. Virtual Account</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm mb-1">{xenditInvoice.bank_account_number}</p>
                        <button onClick={handleCopy} className="hover:bg-primary-light-200 p-1 rounded-md">
                          <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-grey mb-1">Total Pembayaran</p>
                      <p className="text-sm mb-1">{`Rp${xenditInvoice.transfer_amount.toLocaleString("id-ID")}`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white mt-1">
                <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-xs text-grey mb-1">Regular Ticket {`x(${transactionData.total_qty})`}</p>
                    <p className="text-xs mb-1">Rp {transactionData.total_price.toLocaleString("id-ID")}</p>
                  </div>
                  {voucher && (
                    <div className="flex justify-between">
                      {voucher.map((v) => (
                        <p key={v.id} className="text-xs text-grey mb-1">
                          Voucher {v.name}
                        </p>
                      ))}
                      <p className="text-xs mb-1">Rp {voucher.reduce((sum, v) => sum + v.amount, 0).toLocaleString("id-ID")}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-grey mb-1">Pajak</p>
                    <p className="text-xs mb-1">Rp {transactionData.ppn ? transactionData.ppn.toLocaleString("id-ID") : 0}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-grey mb-1">Biaya Admin</p>
                    <p className="text-xs mb-1">Rp {transactionData.admin_fee ? transactionData.admin_fee.toLocaleString("id-ID") : 0}</p>
                  </div>
                  <div className="border-t-2 border-primary-light">
                    <div className="flex items-center justify-between font-semibold">
                      <p>Total Pembayaran</p>
                      <p>{`Rp${(transactionData.grandtotal - (voucher ? voucher.reduce((sum, v) => sum + v.amount, 0) : 0)).toLocaleString("id-ID")}`}</p>
                    </div>
                    <Link href={`/success/${transactionData.invoice_no}`} target="_blank">
                      <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3">{loading ? <Spinner color="default" size="sm" /> : "Cek Status Pembayaran"}</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </EventContext.Provider>
    )
  ) : (
    <Spinner color="primary" size="lg" className="min-h-screen flex items-center justify-center" />
  );
};

const EventCountdown = ({ startdate, starttime }: { startdate?: string; starttime?: string }) => {
  const { t } = useTranslation();
  const [timoutHash, setTimeoutHash] = useState("");
  const interval = useInterval(() => setTimeoutHash(randomId()), 1000);

  useEffect(() => {
    interval.start();
  }, []);

  const timeToEvent = useMemo((): [number, string][] => {
    const date = `${startdate} ${starttime}`;
    const targetDate = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

    if (diffInSeconds < 0) {
      return [];
    }

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    const days = Math.floor(diffInSeconds / secondsInDay);
    const hours = Math.floor((diffInSeconds % secondsInDay) / secondsInHour);
    const minutes = Math.floor((diffInSeconds % secondsInHour) / secondsInMinute);
    const seconds = diffInSeconds % secondsInMinute;

    const result: [number, string][] = [];
    if (days > 0) result.push([days, t("hari")]);
    result.push([hours, t("jam")]);
    result.push([minutes, t("menit")]);
    result.push([seconds, t("detik")]);
    return result;
  }, [timoutHash]);

  return (
    <Flex align="center" gap={5} className={`! bottom-3 right-3`} mb={10}>
      {timeToEvent.map((e, i) => (
        <AspectRatio key={i}>
          <Card w={42} radius={10} p={0} className={`border border-white/50 backdrop-blur-sm !bg-black/20`} key={i}>
            <Stack align="center" justify="center" h="100%" gap={3} c="white">
              <Text fw={600} size="16px">
                {e[0]}
              </Text>
              <Text size="9px">{e[1]}</Text>
            </Stack>
          </Card>
        </AspectRatio>
      ))}
    </Flex>
  );
};

export default EventDetails;