// import { useEffect, useState } from "react";
// import useWindowSize from "@/utils/useWindowSize";
// import { useRouter } from "next/router";
// import { EventProps, TransactionProps } from "@/utils/globalInterface";
// import Image from "next/image";
// import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Field, Label, Input } from "@headlessui/react";
// import Countdown, { CountdownRendererFn } from "react-countdown";
// import { faChevronCircleDown, faChevronDown, faTicket, faChevronCircleLeft, faChevronUp, faChevronCircleUp, faCheck } from "@fortawesome/free-solid-svg-icons";
// import ModalTransaction from "../ModalTransaction";
// import InputField from "../Input";
// import { formatDate } from "@/utils/useFormattedDate";
// import ModalPaymentDataConfirmation from "../Modals/ModalPaymentDataConfirm";
// import InputSelect from "../Input/Select";
// import { Post, Get } from "@/utils/REST";
// import { Accordion, AccordionItem, Radio, RadioGroup, Switch, Spinner } from "@nextui-org/react";
// import Images from "../Images";
// import { toast } from "react-toastify";
// import { faCopy } from "@fortawesome/free-regular-svg-icons";
// import React from "react";
// import { Button, Card, Flex, Group, NumberFormatter, Stack, Text, TextInput } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { Numans } from "next/font/google";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import fetch from "@/utils/fetch";
// import moment from "moment";
// import { useListState } from "@mantine/hooks";

// interface FormTicket {
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

// interface ErrorForm {
//   nik: boolean;
//   nama: boolean;
//   email: boolean;
//   countryCode: boolean;
//   phone: boolean;
//   is_profession: boolean;
//   is_company: boolean;
// }

// interface Form {
//   nik: string;
//   full_name: string;
//   email: string;
//   countryCode: string;
//   no_telp: string;
//   is_pemesan: number;
//   identity_type_id: number;
//   event_ticket_id: number;
//   seat_number?: string;
//   is_profession: string;
//   is_company: string;
// }

// interface StepPaymentProps {
//   detail: EventProps;
//   ticket: FormTicket[];
//   forms: Form[];
//   totalCount: number;
//   totalSubtotalPrice: number;
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   setFormValid: (valid: boolean) => void;
//   step: number;
//   setStep: (step: number) => void;
//   onSubmitVoucher?: (data: { name: string; amount: number }) => void;
// }

// const FirstStepUnlogged = ({ onSubmitVoucher, detail, ticket, totalCount, totalSubtotalPrice, forms, isOpen, setIsOpen, setFormValid, step, setStep }: StepPaymentProps) => {
//   const { width } = useWindowSize();
//   const [voucherFields, setVoucherFields] = useState<string[]>([""]);
//   const [form, setForm] = useState<Form[]>(forms);
//   const [error, setError] = useState<ErrorForm>({
//     nik: false,
//     nama: false,
//     email: false,
//     is_profession: false,
//     is_company: false,
//     countryCode: true,
//     phone: false,
//   });
//   const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false);
//   const [vouchers, setVouchers] = useState<{ id: number; name: string; amount: number }[]>([]);
//   const [loadings, setLoadings] = useListState<string>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [collapse, setCollapse] = useState<boolean[]>(form.map((_, index) => index === 0));
//   const [payment, setPayment] = useState<string>("");
//   const [xenditInvoice, setXenditInvoice] = useState<any>(null);
//   const [transactionData, setTransactionData] = useState<TransactionProps | null>(null);
//   const [bank, setBank] = useState<string>("");
//   const [paymentMethod, setPaymentMethod] = useState<any>(null);

//   const totalTicketFee = ticket.reduce((sum, item) => sum + (item.ticket_fee || 0) * item.qty_ticket, 0);
//   // const adminFee = (detail?.admin_fee || 0) * totalCount + totalTicketFee;
//   const adminFee = totalTicketFee;
//   const getPaymentMethodById = (id: string) => {
//     setLoading(true);
//     Get(`payment-method/${id}`, {})
//       .then((res: any) => {
//         // console.log(res);
//         setPaymentMethod(res.data);
//         setLoading(false);
//         setIsOpen(false);
//         setStep(3);
//       })
//       .catch((err: any) => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   const handleShowModal = () => {
//     setShowModalTransaction(!showModalTransaction);
//   };

//   useEffect(() => {
//     console.log("FirstStepUnlogged");
//     console.log("Ticket data:", ticket);
//   }, []);

//   const renderer: CountdownRendererFn = ({ hours, minutes, seconds }) => {
//     return (
//       <div className="flex flex-col items-center justify-center  font-semibold">
//         <h3 className="text-[15px] my-5">Waktu untuk Pembayaran Tersisa</h3>
//         <div className="bg-primary-light border-2 border-primary-light-200 text-[40px] px-6 py-2 rounded-xl">
//           <div className="flex">
//             <div className="pr-4">
//               {String(hours).padStart(2, "0")}
//               <p className="text-sm font-medium text-center text-grey">Jam</p>
//             </div>
//             <div className="border-2 border-x-primary-light-200 border-y-primary-light px-4">
//               {String(minutes).padStart(2, "0")}
//               <p className="text-sm font-medium text-center text-grey">Menit</p>
//             </div>
//             <div className="pl-4">
//               {String(seconds).padStart(2, "0")}
//               <p className="text-sm font-medium text-center text-grey">Detik</p>
//             </div>
//           </div>
//         </div>
//         <p className="text-sm text-center font-light my-5 px-4">
//           Batas pembayaran sampai dengan <span className="font-semibold">{formattedDate}</span> Harap selesaikan pembayaran sebelum waktu tersebut untuk menghindari pembatalan otomatis.
//         </p>
//       </div>
//     );
//   };

//   const classAcc = {
//     base: "!p-0",
//     heading: "bg-primary-light px-4",
//     trigger: "",
//     titleWrapper: "",
//     title: "text-sm ",
//     subtitle: "",
//     startContent: "",
//     indicator: "",
//     content: "px-4",
//   };

//   const now = new Date();
//   const targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//   function padToTwoDigits(num: number) {
//     return num.toString().padStart(2, "0");
//   }
//   const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
//   const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
//   const dayName = days[targetDate.getDay()];
//   const day = padToTwoDigits(targetDate.getDate());
//   const month = months[targetDate.getMonth()];
//   const year = targetDate.getFullYear();
//   const hours = padToTwoDigits(targetDate.getHours());
//   const minutes = padToTwoDigits(targetDate.getMinutes());
//   const formattedDate = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;

//   const formValidation = (data: Form) => {
//     return (
//       (detail.is_noidentity == 1 ? Boolean(data.nik) : true) &&
//       (detail.is_name == 1 ? Boolean(data.full_name) : true) &&
//       (detail.is_email == 1 ? Boolean(data.email) : true) &&
//       (detail.is_email == 1 ? data.email.includes("@") && data.email.includes(".") : true) &&
//       (detail.is_phone_number == 1 ? Boolean(data.no_telp) : true)
//     );
//   };

//   const handleInput = (index: number, field: keyof Form, value: string) => {
//     let newForm = [...form];
//     if (field == "no_telp") {
//       var phone = value.replaceAll(/\D/g, "");
//       phone = phone.replace(/^(?!0|6)(\d+)/, "628$1");
//       phone = phone.replace(/^0/, "62");
//       newForm[index] = { ...newForm[index], [field]: phone };
//     } else {
//       newForm[index] = { ...newForm[index], [field]: value };
//     }
//     setForm(newForm);

//     const ticketPriceTotal = ticket.reduce((e, n) => e + n.price * n.qty_ticket, 0);
//     const isFormValid = newForm.every(formValidation);

//     setFormValid(isFormValid);
//   };

//   const handlePaymentChange = (value: string, type: "payment" | "bank") => {
//     if (type === "payment") {
//       setPayment(value);
//     } else {
//       setBank(value);
//     }

//     const isFormValid = form.every(formValidation) && value !== null;

//     setFormValid(isFormValid);
//   };

//   useEffect(() => {
//     if (detail && detail.has_event_payment_method.length === 1) {
//       const ticketPriceTotal = ticket.reduce((e, n) => e + n.price * n.qty_ticket, 0);
//       const paymentMethod = detail.has_event_payment_method[0].has_payment_method;
//       if (paymentMethod.payment_name === "Xendit") {
//         setPayment(paymentMethod.id.toString());
//         setFormValid(form.every(formValidation));
//       }
//     }
//   }, [detail, form]);

//   const copyOrderer = (targetIndex: number) => {
//     if (form.length > 0 && targetIndex > 0 && targetIndex < form.length) {
//       let newForm = [...form];
//       newForm[targetIndex] = { ...newForm[0], is_pemesan: 0 };
//       setForm(newForm);
//       const isFormValid = newForm.every(formValidation);
//       setFormValid(isFormValid);
//     }
//   };

//   const clearForm = (targetIndex: number) => {
//     if (form.length > 0 && targetIndex >= 0 && targetIndex < form.length) {
//       let newForm = [...form];
//       newForm[targetIndex] = {
//         nik: "",
//         full_name: "",
//         email: "",
//         countryCode: "",
//         no_telp: "",
//         is_pemesan: 0,
//         is_profession: "",
//         is_company: "",
//         identity_type_id: 1,
//         event_ticket_id: 1,
//       };
//       setForm(newForm);
//     }
//   };

//   const router = useRouter();

//   const submitForm = () => {
//     const now = new Date();
//     now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
//     const isoString = now.toISOString();

//     const subtotal = totalSubtotalPrice; // Use the prop that was passed to the component
//     //const adminFee = (detail?.admin_fee || 0) * totalCount + totalTicketFee;
//     const adminFee = totalTicketFee;
//     const tax = detail?.ppn ? Math.round((subtotal + adminFee) * (detail.ppn / 100)) : 0;
//     const voucherDiscount = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//     const grandtotal = subtotal + adminFee + tax - voucherDiscount;

//     const allSeatNumbers = ticket.map((t) => (Array.isArray(t.seat_number) ? t.seat_number : JSON.parse(t.seat_number || "[]"))).flat();

//     let seatIndex = 0;
//     const payload = {
//       event_id: detail?.id,
//       admin_fee: detail?.admin_fee,
//       // plus adminfee
//       //admin_fee: (detail?.admin_fee || 0) * totalCount,
//       payment_method: payment ? payment : "4",
//       // grandtotal: detail ? totalSubtotalPrice + ((detail.admin_fee * totalCount) + (detail.ppn || 0)) - vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0) : 0,
//       grandtotal: grandtotal,
//       identities: form.map((identity) => {
//         if (identity.is_pemesan === 1) return identity;

//         const seat_number = allSeatNumbers[seatIndex] || "";
//         seatIndex++;

//         return {
//           ...identity,
//           seat_number: identity.seat_number || seat_number,
//         };
//       }),
//       tickets: ticket.map((e) => ({
//         ...e,
//         seatnumber_ticket: JSON.stringify(e.seat_number),
//       })),
//       bank_code: bank,
//       expiration_date: isoString,
//       vouchers:
//         vouchers.length > 0
//           ? vouchers.map((v) => ({
//               voucher_id: v.id,
//               voucher_code: v.name,
//               voucher_amount: v.amount,
//             }))
//           : [],
//     };

//     //console.log('Payload:', payload);

//     const ticketPriceTotal = ticket.reduce((e, n) => e + n.price * n.qty_ticket, 0);
//     // if (ticketPriceTotal == 0) {
//     //     return;
//     // }

//     setLoading(true);
//     Post("transaction-without-auth", payload)
//       .then((res: any) => {
//         setTransactionData(res.data);
//         console.log("Response:", res);

//         if (res?.isFree) {
//           router.push("/success/" + res.invoice_no);
//           return;
//         }

//         if (res.xendit_invoice && res.xendit_invoice.invoice_url) {
//           router.push(res.xendit_invoice.invoice_url);
//         } else if (res.xendit_invoice && res.xendit_invoice.va_number?.length > 0) {
//           setXenditInvoice(res.xendit_invoice.va_number[0]);
//           setLoading(false);
//           setIsOpen(false);
//           setStep(3);
//         }

//         if (res.data.payment_method === "2" && !res.xendit_invoice_url) {
//           getPaymentMethodById("2");
//         }
//       })
//       .catch((err: any) => {
//         setLoading(false);

//         // Check for 400 error and out_of_stock condition
//         if (err?.response?.data?.out_of_stock || err?.response?.out_of_stock) {
//           // toast.error('Tiket sudah habis terjual');
//           notifications.show({
//             color: "red",
//             position: "top-right",
//             message: "Tiket sudah habis terjual",
//           });
//           // router.push('/event'); // Redirect to /event page
//         } else {
//           // toast.error(err?.response?.data?.message ?? err?.message);
//           notifications.show({
//             color: "red",
//             position: "top-right",
//             message: err.response?.data?.message,
//           });
//         }
//       });
//   };

//   const toggleCollapse = (index: number) => {
//     setCollapse((prev) => {
//       let newCollapse = [...prev];
//       newCollapse[index] = !newCollapse[index];
//       return newCollapse;
//     });
//   };

//   const [isCopied, setIsCopied] = useState<boolean>(false);

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

//   const handleGetVoucher = async (index: number) => {
//     if (!voucherFields[index]) return;

//     const isDuplicate = vouchers.some((v) => v.name === voucherFields[index]);
//     if (isDuplicate) {
//       notifications.show({
//         message: "Voucher sudah digunakan.",
//         color: "red",
//       });
//       return;
//     }

//     await fetch<
//       {
//         event_id: number;
//         date: string;
//         code: string;
//       },
//       {
//         voucher: {
//           discount: number;
//           type: "persentase" | "nominal";
//           date_start: string;
//           date_end: string;
//           max_use: number;
//           min_transaction: number;
//           stock: number;
//           status: 1 | 0;
//         };
//       }
//     >({
//       url: "vouchers/validate",
//       method: "POST",
//       data: {
//         event_id: detail.id,
//         date: moment(new Date()).format("YYYY-MM-DD"),
//         code: voucherFields[index],
//       },
//       before: () => setLoadings.append(`getvoucher-${index}`),
//       success: (data) => {
//         const voucher = data?.voucher ?? data?.data?.voucher;
//         if (!voucher) return;
//         const isDateValid = moment(voucher.date_start).isBefore(new Date()) && moment(voucher.date_end).isAfter(new Date());
//         const isStockValid = voucher.stock > 0;
//         const isStatusValid = voucher.status == 1;
//         const isMinTransactionValid = totalSubtotalPrice >= voucher.min_transaction;
//         const discount = voucher.type == "persentase" ? (totalSubtotalPrice * voucher.discount) / 100 : voucher.discount;

//         if (isDateValid && isStockValid && isStatusValid && isMinTransactionValid) {
//           setVouchers((prevVouchers) => [
//             ...prevVouchers,
//             {
//               data: voucher,
//               id: voucher.id,
//               name: voucherFields[index],
//               amount: discount,
//             },
//           ]);
//         } else {
//           notifications.show({
//             message: "Voucher Tidak Ditemukan",
//             color: "red",
//           });
//           setVoucherFields((prev) => {
//             const newFields = [...prev];
//             newFields[index] = "";
//             return newFields;
//           });
//         }
//       },
//       complete: () => setLoadings.filter((e) => e !== `getvoucher-${index}`),
//       error: () => {
//         notifications.show({
//           message: "Voucher Tidak Ditemukan",
//           color: "red",
//         });
//         setVoucherFields((prev) => {
//           const newFields = [...prev];
//           newFields[index] = "";
//           return newFields;
//         });
//       },
//     });
//   };

//   const handleAddVoucherField = () => {
//     //console.log('handleAddVoucherField');
//     //console.log(detail.max_use_voucher)
//     //setVoucherFields([...voucherFields, '']);
//     if (voucherFields.length < (detail.max_use_voucher ?? 0)) {
//       setVoucherFields([...voucherFields, ""]);
//     } else {
//       notifications.show({
//         message: "Maksimal voucher sudah digunakan",
//         color: "red",
//       });
//     }
//   };

//   const handleCancelVoucher = (index: number) => {
//     const newVoucherFields = [...voucherFields];
//     const newVouchers = [...vouchers];
//     newVoucherFields[index] = "";
//     newVouchers.splice(index, 1);
//     setVoucherFields(newVoucherFields);
//     setVouchers(newVouchers.filter(Boolean));
//   };

//   return step === 0 ? (
//     <>
//       {width &&
//         (width < 768 ? (
//           <div className="bg-primary-light mt-32 lg:mt-0">
//             <div className="border-b p-3 border-primary-light flex items-center gap-3">
//               <div className="px-2 py-1 border rounded-md border-primary-light">{detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-10 h-10 object-cover rounded-md" />}</div>
//               <div>
//                 <p className="text-sm mb-1">{detail?.name}</p>
//                 <p className="text-xs text-grey">{totalCount} Tiket</p>
//               </div>
//             </div>
//             <Card withBorder radius={10} p={20}>
//               <Stack gap={20}>
//                 <Flex gap={10} align="center">
//                   <Icon icon="mdi:voucher-outline" className={`text-primary-base text-[20px]`} />
//                   <Text fw={600}>Voucher</Text>
//                 </Flex>

//                 {voucherFields.map((field, index) => (
//                   <Group key={index}>
//                     <TextInput
//                       w="100%"
//                       value={field}
//                       onChange={(e) => {
//                         const newFields = [...voucherFields];
//                         newFields[index] = e.currentTarget.value;
//                         setVoucherFields(newFields);
//                       }}
//                       placeholder={`Masukan Kode Voucher ${index + 1}`}
//                     />
//                     <Button loading={loadings.includes(`getvoucher-${index}`)} disabled={field.length < 3} size="xs" onClick={() => handleGetVoucher(index)} className={`shrink-0`}>
//                       Submit
//                     </Button>
//                     {vouchers[index] && (
//                       <>
//                         <Button variant="outline" size="xs" color="red" onClick={() => handleCancelVoucher(index)} className="shrink-0">
//                           Cancel
//                         </Button>
//                         <Icon icon="uiw:circle-check" className="text-green-500 text-[20px] shrink-0" />
//                       </>
//                     )}
//                   </Group>
//                 ))}
//                 <Button variant="outline" size="xs" onClick={handleAddVoucherField} className="mt-2">
//                   + Tambah Voucher
//                 </Button>
//               </Stack>
//             </Card>
//             <div className="border border-primary-light-200 rounded-lg bg-white shadow-sm">
//               <div className="border-b border-b-primary-light-200 p-3">
//                 <p className="font-semibold">Ringkasan Pesanan</p>
//               </div>

//               {ticket.map((item: FormTicket) => (
//                 <div className="border-b p-3 border-primary-light-200 flex gap-3" key={item.event_ticket_id}>
//                   <div className="px-3 flex items-center border rounded-md border-primary-light">
//                     <FontAwesomeIcon icon={faTicket} className="text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm mb-1 font-semibold">{item.name}</p>
//                     <p className=" text-grey text-xs">
//                       {item.qty_ticket} Tiket x {item.price}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {/* JUMALAH TIKET */}
//               <div className="py-3 px-4 flex justify-between items-center">
//                 <p>{`Jumlah (${totalCount} Tiket)`}</p>
//                 <p className="font-semibold">{totalSubtotalPrice > 0 ? <NumberFormatter value={totalSubtotalPrice} /> : <Text>Free</Text>}</p>
//               </div>

//               {/* ADMIN FEE */}
//               <div className="py-3 px-4 flex justify-between items-center">
//                 <p>Biaya Admin </p>
//                 <p className="font-semibold">{adminFee > 0 ? <NumberFormatter value={adminFee} /> : <Text>Free</Text>}</p>
//               </div>

//               {/* SUBTOTAL BARU SETELAH VOUCHER */}
//               {(() => {
//                 const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                 const subtotalAfterVoucher = Math.max(totalSubtotalPrice - totalVoucher, 0);

//                 return (
//                   <div className="py-3 px-4 flex justify-between items-center">
//                     <p>Subtotal</p>
//                     <p className="font-semibold">
//                       <NumberFormatter value={subtotalAfterVoucher} />
//                     </p>
//                   </div>
//                 );
//               })()}

//               {/* TAX BARU */}
//               {detail.ppn
//                 ? (() => {
//                     const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                     const subtotalAfterVoucher = Math.max(totalSubtotalPrice - totalVoucher, 0);

//                     const taxBase = subtotalAfterVoucher + adminFee;
//                     const tax = Math.round(taxBase * (detail.ppn / 100));

//                     return (
//                       <div className="py-3 px-4 flex justify-between items-center">
//                         <p>Tax ({detail.ppn}%)</p>
//                         <p className="font-semibold">{detail.ppn > 0 ? <NumberFormatter value={tax} /> : <Text>Free</Text>}</p>
//                       </div>
//                     );
//                   })()
//                 : null}

//               {/* TOTAL VOUCHER (TIDAK DIUBAH) */}
//               {vouchers.length > 0 && (
//                 <div className="py-3 px-4 flex justify-between items-center">
//                   <p>Total Voucher</p>
//                   <p className="font-semibold">
//                     -
//                     <NumberFormatter value={vouchers.reduce((sum, voucher) => sum + (voucher.amount || 0), 0)} />
//                   </p>
//                 </div>
//               )}

//               {/* TOTAL PEMBAYARAN MOBILE (SAMA LOGIKA DENGAN DESKTOP) */}
//               <div className="py-3 px-4 flex justify-between items-center">
//                 <p>Total Pembayaran mobile</p>
//                 <p className="font-semibold">
//                   {(() => {
//                     const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                     const subtotalAfterVoucher = Math.max(totalSubtotalPrice - totalVoucher, 0);
//                     const tax = detail.ppn ? Math.round((subtotalAfterVoucher + adminFee) * (detail.ppn / 100)) : 0;
//                     const grandTotal = subtotalAfterVoucher + adminFee + tax;

//                     return grandTotal > 0 ? <NumberFormatter value={grandTotal} /> : <Text>Free</Text>;
//                   })()}
//                 </p>
//               </div>
//             </div>

//             {form.map((item, index) => {
//               let ticketForOwner = null;
//               let currentIndex = 0;

//               // Loop untuk mencari tiket yang sesuai dengan index pemilik tiket
//               for (const ticketItem of ticket) {
//                 for (let i = 0; i < (ticketItem?.seat_number?.length ?? ticketItem.qty_ticket); i++) {
//                   if (currentIndex === index - 1) {
//                     // Pemilik ditemukan, simpan tiket untuk pemilik ini
//                     ticketForOwner = {
//                       ...ticketItem,
//                       seat_number: ticketItem?.seat_number ? ticketItem?.seat_number[i] : undefined,
//                     } as FormTicket;
//                     break;
//                   }
//                   currentIndex++;
//                 }
//                 if (ticketForOwner) break;
//               }

//               if (!ticketForOwner?.seat_number && !!item.seat_number) {
//                 handleInput(index, "seat_number", item.seat_number ?? "");
//               }

//               return (
//                 <div className="bg-white mt-1" key={index}>
//                   <div className="border-b py-3 px-5 border-primary-light flex items-center justify-between cursor-pointer" onClick={() => toggleCollapse(index)}>
//                     {index > 0 && <FontAwesomeIcon icon={faTicket} className="text-primary shrink-0 mr-[10px]" />}
//                     <Stack gap={0} className={`flex-grow`}>
//                       <p className="font-semibold">{index > 0 ? `${index}. Pemilik Tiket ${ticketForOwner?.name} ${ticketForOwner?.seat_number ? `(Seat ${ticketForOwner?.seat_number})` : ""}` : "Data Pemesan"}</p>

//                       {index > 0 && (
//                         <p className="text-xs text-grey">
//                           1 Tiket x{" "}
//                           {new Intl.NumberFormat("id-ID", {
//                             style: "currency",
//                             currency: "IDR",
//                           }).format(ticketForOwner?.price ?? 0)}
//                         </p>
//                       )}
//                     </Stack>
//                     <button className="text-grey">
//                       <FontAwesomeIcon icon={faChevronUp} className={`${collapse[index] ? "rotate-0" : "rotate-180"} transition-transform`} />
//                     </button>
//                   </div>
//                   {index > 0 && (
//                     <div className="flex items-center justify-end gap-[8px] px-4 py-2 rounded-lg text-grey">
//                       <p className="text-xs md:text-sm text-end">Gunakan Data Pemesan</p>
//                       <Switch size="sm" onChange={(e: any) => (e.target.checked ? copyOrderer(index) : clearForm(index))} />
//                     </div>
//                   )}
//                   <div className={`border-b p-3 border-primary-light ${collapse[index] ? "max-h-[26rem]" : "max-h-0"} transition-max-height delay-100 duration-150 ease-in-out`}>
//                     <div className={`${collapse[index] ? "opacity-100" : "opacity-0"} transition-transform-opacity duration-300 delay-300 ease-in-out`}>
//                       <div className={`${collapse[index] ? "visible delay-300 duration-300" : "invisible"} transition-transform `}>
//                         {detail.is_noidentity == 1 ? (
//                           <div className="grid grid-cols-4 gap-3">
//                             <div>
//                               <InputSelect
//                                 label="Identitas"
//                                 required
//                                 onChange={(e) => handleInput(index, "identity_type_id", e.target.value)}
//                                 options={[
//                                   { key: "1", label: "KTP" },
//                                   { key: "2", label: "SIM" },
//                                   { key: "3", label: "Kartu Pelajar" },
//                                   { key: "4", label: "Passport" },
//                                   { key: "5", label: "KTM" },
//                                 ]}
//                               />
//                             </div>
//                             <div className="col-span-3">
//                               <InputField fullWidth type="number" label="Nomor Identitas" placeholder="Contoh: 123456789012345" value={item.nik} onChange={(e) => handleInput(index, "nik", e.target.value)} inputProps={{ maxLength: 16 }} />
//                               {error.nik && <p className="text-[10px] mt-1 text-danger">Minimal NIK adalah 16 Digit</p>}
//                             </div>
//                           </div>
//                         ) : (
//                           <></>
//                         )}
//                         {detail.is_name == 1 ? (
//                           <Field className="mb-2">
//                             <Label className="text-sm font-base text-grey">Nama Lengkap</Label>
//                             <Input
//                               className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200"
//                               placeholder="Nama Lengkap"
//                               value={item.full_name}
//                               onChange={(e) => handleInput(index, "full_name", e.target.value)}
//                             />
//                           </Field>
//                         ) : (
//                           <></>
//                         )}
//                         {detail.is_profession == 1 ? (
//                           <Field className="mb-2">
//                             <Label className="text-sm font-base text-grey">Profesi / Bidang Pekerjaan</Label>
//                             <Input
//                               className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200"
//                               placeholder="profesi atau bidang pekerjaan"
//                               value={item.is_profession || ""}
//                               onChange={(e) => handleInput(index, "is_profession", e.target.value)}
//                             />
//                           </Field>
//                         ) : (
//                           <></>
//                         )}
//                         {detail.is_company == 1 ? (
//                           <Field className="mb-2">
//                             <Label className="text-sm font-base text-grey">Perusahaan / Organisasi</Label>
//                             <Input
//                               className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200"
//                               placeholder="Nama Perusahaan Atau Organisasi"
//                               value={item.is_company || ""}
//                               onChange={(e) => handleInput(index, "is_company", e.target.value)}
//                             />
//                           </Field>
//                         ) : (
//                           <></>
//                         )}
//                         {detail.is_email == 1 ? (
//                           <Field className="mb-2">
//                             <Label className="text-sm font-base text-grey">Email</Label>
//                             <Input
//                               type="email"
//                               className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200"
//                               placeholder="Contoh: example@example.com"
//                               value={item.email}
//                               onChange={(e) => handleInput(index, "email", e.target.value)}
//                             />
//                           </Field>
//                         ) : (
//                           <></>
//                         )}
//                         {detail.is_phone_number == 1 ? (
//                           <Field className="mb-2">
//                             <Label className="text-sm font-base text-grey">No Telepon</Label>
//                             <div className="flex gap-2 items-center">
//                               <form className="max-w-sm block mt-2">
//                                 <select
//                                   id="countries"
//                                   className="bg-gray-50 border border-primary-light-200 text-dark text-sm rounded-lg focus:ring-primary-base focus:border-primary-light-200 block w-full py-1.5"
//                                   defaultValue="+62"
//                                   value={item.countryCode}
//                                   onChange={(e) => handleInput(index, "countryCode", e.target.value)}
//                                 >
//                                   <option value="+62">+62</option>
//                                   <option value="+1">+1</option>
//                                   <option value="+2">+2</option>
//                                   <option value="+3">+3</option>
//                                   <option value="+4">+4</option>
//                                 </select>
//                               </form>
//                               <Input
//                                 className="mt-2 w-4/5 block rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200"
//                                 placeholder="Contoh: 81233334444"
//                                 value={item.no_telp}
//                                 onChange={(e) => handleInput(index, "no_telp", e.target.value)}
//                               />
//                             </div>
//                           </Field>
//                         ) : (
//                           <></>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}

//             {detail && detail.has_event_payment_method.length > 1 ? (
//               <div className="bg-white mt-1">
//                 <div className="border-b-2 py-3 px-5 border-primary-light">
//                   <p className="font-semibold">Metode Pembayaran</p>
//                 </div>
//                 <div className="border-b-2 p-3 border-primary-light text-xs">
//                   <Accordion variant="splitted" itemClasses={classAcc}>
//                     {detail.has_event_payment_method
//                       .filter((e) => e.payment_method_id != 5)
//                       .map((el: any) => (
//                         <AccordionItem key={el.has_payment_method_id} aria-label="Anchor" className="" indicator={<FontAwesomeIcon icon={faChevronCircleLeft} className="px-2 text-lg" />} title={el.has_payment_method.payment_name}>
//                           {el.has_payment_method.id === 3 && el.has_payment_method.has_payment_link && el.has_payment_method.has_payment_link.length > 0 ? (
//                             <RadioGroup
//                               color="primary"
//                               name="bank-code"
//                               onChange={(e) => {
//                                 setPayment("3");
//                                 handlePaymentChange(e.target.value, "bank");
//                               }}
//                             >
//                               {el.has_payment_method.has_payment_link[0].has_payment_channel.map((item: any) => (
//                                 <div key={item.id} className="flex items-center justify-between py-2">
//                                   <div className="flex items-center gap-3">
//                                     <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
//                                     <p className="text-sm">{item.payment_channel}</p>
//                                   </div>
//                                   <Radio value={item.payment_channel} />
//                                 </div>
//                               ))}
//                             </RadioGroup>
//                           ) : (
//                             <RadioGroup color="primary" name="payment-method" onChange={(e) => handlePaymentChange(e.target.value, "payment")}>
//                               <div className="flex items-center justify-between py-2">
//                                 <div className="flex items-center gap-3">
//                                   <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
//                                   <p className="text-sm">{el.has_payment_method.payment_name}</p>
//                                 </div>
//                                 <Radio value={el.has_payment_method.id.toString()}></Radio>
//                               </div>
//                             </RadioGroup>
//                           )}
//                         </AccordionItem>
//                       ))}
//                   </Accordion>
//                 </div>
//               </div>
//             ) : null}
//             {/* <div className='flex justify-center'>
//               <button
//                 className='w-[95%] bg-primary-dark text-white py-2 rounded-lg my-3 disabled:bg-primary-light-200 disabled:text-grey disabled:cursor-not-allowed'
//                 onClick={submitForm}
//                 // disabled={!isFormValid}
//               >
//                 Lanjut
//               </button>
//             </div> */}
//           </div>
//         ) : (
//           <div className="bg-primary-light min-h-screen pb-28">
//             <div className="max-w-5xl mx-auto grid grid-cols-5 mt-8 gap-x-7 pt-20 ">
//               <h2 className="col-span-5 mb-4">Personal Informasi</h2>
//               <div className="col-span-3 flex flex-col gap-3">
//                 {form.map((item, index) => {
//                   // Tentukan tiket untuk pemilik berdasarkan index
//                   let ticketForOwner = null;
//                   let currentIndex = 0;

//                   // Loop untuk mencari tiket yang sesuai dengan index pemilik tiket
//                   for (const ticketItem of ticket) {
//                     for (let i = 0; i < (ticketItem?.seat_number?.length ?? ticketItem.qty_ticket); i++) {
//                       if (currentIndex === index - 1) {
//                         // Pemilik ditemukan, simpan tiket untuk pemilik ini
//                         ticketForOwner = {
//                           ...ticketItem,
//                           seat_number: ticketItem?.seat_number ? ticketItem?.seat_number[i] : undefined,
//                         } as FormTicket;
//                         break;
//                       }
//                       currentIndex++;
//                     }
//                     if (ticketForOwner) break;
//                   }

//                   if (!ticketForOwner?.seat_number && !!item.seat_number) {
//                     handleInput(index, "seat_number", item.seat_number ?? "");
//                   }

//                   return (
//                     <div className="border border-primary-light-200 rounded-lg bg-white shadow-sm" key={index}>
//                       <div className="border-b border-b-primary-light-200 px-5 py-3 flex items-center justify-between cursor-pointer" onClick={() => toggleCollapse(index)}>
//                         {index > 0 && <FontAwesomeIcon icon={faTicket} className="text-primary shrink-0 mr-[10px]" />}
//                         <Stack gap={0} className={`flex-grow`}>
//                           <p className="font-semibold">{index > 0 ? `${index}. Pemilik Tiket ${ticketForOwner?.name} ${ticketForOwner?.seat_number ? `(Seat ${ticketForOwner?.seat_number})` : ""}` : "Data Pemesan"}</p>
//                           {index > 0 && (
//                             <p className="text-xs text-grey">
//                               1 Tiket x{" "}
//                               {new Intl.NumberFormat("id-ID", {
//                                 style: "currency",
//                                 currency: "IDR",
//                               }).format(ticketForOwner?.price ?? 0)}
//                             </p>
//                           )}
//                         </Stack>
//                         <button className="text-grey">
//                           <FontAwesomeIcon icon={faChevronUp} className={`${collapse[index] ? "rotate-0" : "rotate-180"} transition-transform`} />
//                         </button>
//                       </div>

//                       {index > 0 && (
//                         <div className="flex items-center justify-end gap-[8px] px-4 py-2 rounded-lg text-grey">
//                           <p className="text-xs md:text-sm text-end">Gunakan Data Pemesan</p>
//                           <Switch size="sm" onChange={(e: any) => (e.target.checked ? copyOrderer(index) : clearForm(index))} />
//                         </div>
//                       )}

//                       <div className={`px-5 pt-3 pb-5 ${collapse[index] ? "" : "max-h-0"} transition-max-height delay-100 duration-150 ease-in-out`}>
//                         <div className={`${collapse[index] ? "opacity-100" : "opacity-0"} transition-transform-opacity duration-300 delay-300 ease-in-out`}>
//                           <div className={`${collapse[index] ? "visible" : "invisible"} flex flex-col gap-3`}>
//                             {detail.is_noidentity == 1 ? (
//                               <div className="grid grid-cols-4 gap-3">
//                                 <div>
//                                   <InputSelect
//                                     label="Identitas"
//                                     required
//                                     onChange={(e) => handleInput(index, "identity_type_id", e.target.value)}
//                                     options={[
//                                       { key: "1", label: "KTP" },
//                                       { key: "2", label: "SIM" },
//                                       { key: "3", label: "Kartu Pelajar" },
//                                       { key: "4", label: "Passport" },
//                                       { key: "5", label: "KTM" },
//                                     ]}
//                                   />
//                                 </div>
//                                 <div className="col-span-3">
//                                   <InputField
//                                     fullWidth
//                                     type="number"
//                                     label="Nomor Identitas"
//                                     placeholder="Contoh: 123456789012345"
//                                     value={item.nik}
//                                     onChange={(e) => handleInput(index, "nik", e.target.value)}
//                                     inputProps={{ maxLength: 16 }}
//                                   />
//                                   {error.nik && <p className="text-[10px] mt-1 text-danger">Minimal NIK adalah 16 Digit</p>}
//                                 </div>
//                               </div>
//                             ) : (
//                               <></>
//                             )}

//                             {/* Field lainnya */}
//                             {detail?.is_name == 1 ? <InputField fullWidth type="text" label="Nama Lengkap" placeholder="Nama Lengkap" value={item.full_name} onChange={(e) => handleInput(index, "full_name", e.target.value)} /> : <></>}

//                             {detail?.is_profession == 1 ? (
//                               <InputField
//                                 fullWidth
//                                 type="text"
//                                 label="Profesi atau Pekerjaan anda"
//                                 placeholder="contoh: Promotor,Musisi, IT, Programmer etc "
//                                 value={item.is_profession}
//                                 onChange={(e) => handleInput(index, "is_profession", e.target.value)}
//                               />
//                             ) : (
//                               <></>
//                             )}

//                             {detail?.is_company == 1 ? (
//                               <InputField fullWidth type="text" label="Perusahaan Atau Organisasi" placeholder="Nama perusahaan atau organisasi" value={item.is_company} onChange={(e) => handleInput(index, "is_company", e.target.value)} />
//                             ) : (
//                               <></>
//                             )}

//                             {detail?.is_email == 1 ? <InputField fullWidth type="text" label="Email" placeholder="Contoh: example@example.com" value={item.email} onChange={(e) => handleInput(index, "email", e.target.value)} /> : <></>}

//                             {detail?.is_phone_number == 1 ? (
//                               <InputField fullWidth type="number" label="No Telepon" placeholder="Contoh: 81233334444" onChange={(e) => handleInput(index, "no_telp", e.target.value)} value={item.no_telp} />
//                             ) : (
//                               <></>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="col-span-2 flex flex-col gap-3">
//                 <div className="border border-primary-light-200 rounded-lg bg-white shadow-sm">
//                   {/* <div className='border-b border-b-primary-light-200 p-3'>
//                 <p className='font-semibold'>Event</p>
//               </div> */}
//                   <div className="flex items-center gap-3 p-3">
//                     {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-10 h-10 object-cover rounded-md" />}
//                     <div>
//                       <p className="text-sm mb-1">{detail?.name}</p>
//                       <p className="text-xs text-grey">
//                         {formatDate(detail.start_date) == formatDate(detail.end_date) ? `${formatDate(detail.start_date)}` : `${formatDate(detail.start_date)} - ${formatDate(detail.end_date)}`}
//                         {/* &bull;{' '} */}
//                         {/* {`${detail.start_time} - ${detail.end_time}`} */}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <Card withBorder radius={10} p={20}>
//                   <Stack gap={20}>
//                     <Flex gap={10} align="center">
//                       <Icon icon="mdi:voucher-outline" className={`text-primary-base text-[20px]`} />
//                       <Text fw={600}>Voucher</Text>
//                     </Flex>

//                     {voucherFields.map((field, index) => (
//                       <Group key={index}>
//                         <TextInput
//                           w="100%"
//                           value={field}
//                           onChange={(e) => {
//                             const newFields = [...voucherFields];
//                             newFields[index] = e.currentTarget.value;
//                             setVoucherFields(newFields);
//                           }}
//                           placeholder={`Masukan Kode Voucher ${index + 1}`}
//                         />
//                         <Button loading={loadings.includes(`getvoucher-${index}`)} disabled={field.length < 3} size="xs" onClick={() => handleGetVoucher(index)} className={`shrink-0`}>
//                           Submit
//                         </Button>
//                         {vouchers[index] && (
//                           <>
//                             <Button variant="outline" size="xs" color="red" onClick={() => handleCancelVoucher(index)} className="shrink-0">
//                               Cancel
//                             </Button>
//                             <Icon icon="uiw:circle-check" className="text-green-500 text-[20px] shrink-0" />
//                           </>
//                         )}
//                       </Group>
//                     ))}
//                     <Button variant="outline" size="xs" onClick={handleAddVoucherField} className="mt-2">
//                       + Tambah Voucher
//                     </Button>
//                   </Stack>
//                 </Card>
//                 <div className="border border-primary-light-200 rounded-lg bg-white shadow-sm">
//                   <div className="border-b border-b-primary-light-200 p-3">
//                     <p className="font-semibold">Ringkasan Pesanan</p>
//                   </div>

//                   {ticket.map((item: FormTicket) => (
//                     <div className="border-b p-3 border-primary-light-200 flex gap-3" key={item.event_ticket_id}>
//                       <div className="px-3 flex items-center border rounded-md border-primary-light">
//                         <FontAwesomeIcon icon={faTicket} className="text-primary" />
//                       </div>
//                       <div>
//                         <p className="text-sm mb-1 font-semibold">{item.name}</p>
//                         <p className=" text-grey text-xs">
//                           {item.qty_ticket} Tiket x {item.price}
//                         </p>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Jumlah Tiket */}
//                   <div className="py-3 px-4 flex justify-between items-center">
//                     <p>{`Jumlah (${totalCount} Tiket)`}</p>
//                     <p className="font-semibold">{totalSubtotalPrice > 0 ? <NumberFormatter value={totalSubtotalPrice} /> : <Text>Free</Text>}</p>
//                   </div>

//                   {/* Total Voucher */}
//                   {vouchers.length > 0 && (
//                     <div className="py-3 px-4 flex justify-between items-center">
//                       <p>Total Voucher</p>
//                       <p className="font-semibold">
//                         -
//                         <NumberFormatter value={vouchers.reduce((sum, voucher) => sum + (voucher.amount || 0), 0)} />
//                       </p>
//                     </div>
//                   )}

//                   {/* SUBTOTAL BARU (Setelah Voucher) */}
//                   {(() => {
//                     const subtotalTiket = totalSubtotalPrice;
//                     const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                     const subtotalAfterVoucher = Math.max(subtotalTiket - totalVoucher, 0);

//                     return (
//                       <div className="py-3 px-4 flex justify-between items-center">
//                         <p>Subtotal</p>
//                         <p className="font-semibold">
//                           <NumberFormatter value={subtotalAfterVoucher} />
//                         </p>
//                       </div>
//                     );
//                   })()}

//                   {/* Admin Fee */}
//                   <div className="py-3 px-4 flex justify-between items-center">
//                     <p>Admin Fee</p>
//                     <p className="font-semibold">{adminFee > 0 ? <NumberFormatter value={adminFee} /> : <Text>Free</Text>}</p>
//                   </div>

//                   {/* TAX baru: (SubtotalAfterVoucher + AdminFee) × PPN */}
//                   {detail.ppn
//                     ? (() => {
//                         const subtotalTiket = totalSubtotalPrice;
//                         const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                         const subtotalAfterVoucher = Math.max(subtotalTiket - totalVoucher, 0);

//                         const taxBase = subtotalAfterVoucher + adminFee;
//                         const tax = detail.ppn ? Math.round(taxBase * (detail.ppn / 100)) : 0;

//                         return (
//                           <div className="py-3 px-4 flex justify-between items-center">
//                             <p>Tax ({detail.ppn}%)</p>
//                             <p className="font-semibold">{detail.ppn > 0 ? <NumberFormatter value={tax} /> : <Text>Free</Text>}</p>
//                           </div>
//                         );
//                       })()
//                     : null}

//                   {/* TOTAL PEMBAYARAN BARU */}
//                   <div className="py-3 px-4 flex justify-between items-center">
//                     <p>Total Pembayaran</p>
//                     <p className="font-semibold">
//                       {(() => {
//                         const subtotalTiket = totalSubtotalPrice;
//                         const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
//                         const subtotalAfterVoucher = Math.max(subtotalTiket - totalVoucher, 0);

//                         const tax = detail.ppn ? Math.round((subtotalAfterVoucher + adminFee) * (detail.ppn / 100)) : 0;

//                         const grandTotal = subtotalAfterVoucher + adminFee + tax;

//                         return grandTotal > 0 ? <NumberFormatter value={grandTotal} /> : <Text>Free</Text>;
//                       })()}
//                     </p>
//                   </div>
//                 </div>

//                 {detail && detail.has_event_payment_method.length > 1 ? (
//                   <div className="border border-primary-light-200 rounded-lg bg-white">
//                     <div className="border-b border-b-primary-light-200 py-4 px-6">
//                       <p className="font-semibold">Metode Pembayaran</p>
//                     </div>
//                     <div className="border-b px-3 py-5 border-primary-light text-xs">
//                       <Accordion variant="splitted" itemClasses={classAcc}>
//                         {detail.has_event_payment_method
//                           .filter((e) => e.payment_method_id != 5)
//                           .map((el: any) => (
//                             <AccordionItem key={el.has_payment_method_id} aria-label="Anchor" className="" indicator={<FontAwesomeIcon icon={faChevronCircleLeft} className="px-2 text-lg" />} title={el.has_payment_method.payment_name}>
//                               {el.has_payment_method.id === 3 && el.has_payment_method.has_payment_link && el.has_payment_method.has_payment_link.length > 0 ? (
//                                 <RadioGroup
//                                   color="primary"
//                                   name="bank-code"
//                                   onChange={(e) => {
//                                     setPayment("3");
//                                     handlePaymentChange(e.target.value, "bank");
//                                     console.log(e.target.value);
//                                   }}
//                                 >
//                                   {el.has_payment_method.has_payment_link[0].has_payment_channel.map((item: any) => (
//                                     <div key={item.id} className="flex items-center justify-between py-2">
//                                       <div className="flex items-center gap-3">
//                                         <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
//                                         <p className="text-sm">{item.payment_channel}</p>
//                                       </div>
//                                       <Radio value={item.payment_channel} />
//                                     </div>
//                                   ))}
//                                 </RadioGroup>
//                               ) : (
//                                 <RadioGroup color="primary" name="payment-method" onChange={(e) => handlePaymentChange(e.target.value, "payment")}>
//                                   <div className="flex items-center justify-between py-2">
//                                     <div className="flex items-center gap-3">
//                                       <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
//                                       <p className="text-sm">{el.has_payment_method.payment_name}</p>
//                                     </div>
//                                     <Radio value={el.has_payment_method.id.toString()}></Radio>
//                                   </div>
//                                 </RadioGroup>
//                               )}
//                             </AccordionItem>
//                           ))}
//                       </Accordion>
//                     </div>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         ))}
//       <ModalPaymentDataConfirmation isOpen={isOpen} setIsOpen={setIsOpen} onConfirm={submitForm} loading={loading} data={form[0]} />
//     </>
//   ) : (
//     step === 3 && transactionData && (
//       <div className="bg-primary-light max-w-xl pt-16 mx-auto">
//         {detail && detail.image_url && <Image src={detail?.image_url} width={1000} height={1000} alt="banner" className="w-full mt-10" />}

//         <div className="bg-white">
//           <div className="border-b-2 p-3 border-primary-light">
//             <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
//           </div>
//           <div className="border-b-2 p-3 border-primary-light flex gap-3"></div>
//         </div>

//         <div className="bg-white mt-1">
//           <div className="border-b-2 p-3 border-primary-light flex gap-3">
//             {xenditInvoice ? (
//               <div className="flex items-center gap-3">
//                 <p className="font-semibold">{xenditInvoice.bank_code}</p>
//                 {/* <Image src={paymen} alt='BCA' /> */}
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <p className="font-semibold">BCA</p>
//                 {/* <Image src={paymen} alt='BCA' /> */}
//               </div>
//             )}
//           </div>
//           <div className="bg-white mt-1">
//             <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//               <div>
//                 <p className="text-xs text-grey mb-1">Kode Invoice</p>
//                 <p className="text-sm mb-1">{transactionData.invoice_no}</p>
//               </div>
//               <div>
//                 {xenditInvoice ? (
//                   <>
//                     <p className="text-xs text-grey mb-1">No. Virtual Account</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-sm">{xenditInvoice.bank_account_number}</p>
//                       <button onClick={handleCopy} className="hover:bg-primary-light-200 p-1 rounded-md">
//                         <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-xs text-grey mb-1">No. Rekening</p>
//                     <p className="text-sm mb-1">{paymentMethod.account_no}</p>
//                     <p className="text-xs mb-1">Atas Nama {paymentMethod.account_name}</p>
//                   </>
//                 )}
//                 {/* <p className='text-xs mb-1'>Atas Nama {paymentMethod.account_name}</p> */}
//               </div>
//               <div>
//                 <p className="text-xs text-grey mb-1">Total Pembayaran</p>
//                 <p className="text-sm mb-1">
//                   {xenditInvoice ? `Rp${xenditInvoice.transfer_amount.toLocaleString("id-ID")}` : `Rp${(transactionData.grandtotal - vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0)).toLocaleString("id-ID")}`}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white mt-1">
//           <div className="border-b-2 p-3 border-primary-light flex flex-col gap-2">
//             <div className="flex justify-between">
//               <p className="text-xs text-grey mb-1">Regular Ticket {`x(${transactionData.total_qty})`}</p>
//               <p className="text-xs mb-1">{transactionData.total_price ? <NumberFormatter value={transactionData.total_price} /> : <Text>Free</Text>}</p>
//             </div>
//             {vouchers.length > 0 && (
//               <div className="py-3 px-4 flex justify-between items-center">
//                 <p>Voucher</p>
//                 <p className="font-semibold">
//                   -
//                   <NumberFormatter value={vouchers.reduce((sum, voucher) => sum + (voucher.amount || 0), 0)} />
//                 </p>
//               </div>
//             )}
//             <div className="flex justify-between items-center">
//               <p className="text-xs text-grey mb-1">Pajak</p>
//               <p className="text-xs mb-1">{transactionData.ppn ? <NumberFormatter value={transactionData.ppn} /> : <Text>Free</Text>}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className="text-xs text-grey mb-1">Biaya Admin</p>
//               <p className="text-xs mb-1">{transactionData.admin_fee ? <NumberFormatter value={transactionData.admin_fee} /> : <Text>Free</Text>}</p>
//             </div>
//             <div className="border-t-2 border-primary-light">
//               <div className="flex items-center justify-between font-semibold">
//                 <p>Total Pembayaran</p>
//                 <p>{`Rp${(transactionData.grandtotal - vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0)).toLocaleString("id-ID")}`}</p>
//               </div>
//               {xenditInvoice ? (
//                 <Link href={`/success/${transactionData.invoice_no}`} target="_blank">
//                   <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3">{loading ? <Spinner color="default" size="sm" /> : "Cek Status Pembayaran"}</button>
//                 </Link>
//               ) : (
//                 <button className="w-full bg-primary-dark text-white py-2 rounded-lg my-3" onClick={() => handleShowModal()}>
//                   {loading ? <Spinner color="default" size="sm" /> : "Upload Bukti Pembayaran"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//         <ModalTransaction id={transactionData.id} invoice={transactionData.invoice_no} isOpen={showModalTransaction} setIsOpen={setShowModalTransaction} />
//       </div>
//     )
//   );
// };

// export default FirstStepUnlogged;

// src/components/Payment/FirstStepUnlogged.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import useWindowSize from "@/utils/useWindowSize";
import { useRouter } from "next/router";
import { EventProps, TransactionProps } from "@/utils/globalInterface";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Label, Input } from "@headlessui/react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { faChevronCircleDown, faChevronDown, faTicket, faChevronCircleLeft, faChevronUp, faChevronCircleUp, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import ModalTransaction from "../ModalTransaction";
import InputField from "../Input";
import { formatDate } from "@/utils/useFormattedDate";
import ModalPaymentDataConfirmation from "../Modals/ModalPaymentDataConfirm";
import InputSelect from "../Input/Select";
import { Post, Get } from "@/utils/REST";
import { Accordion, AccordionItem, Radio, RadioGroup, Switch, Spinner } from "@nextui-org/react";
import Images from "../Images";
import { toast } from "react-toastify";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import { Button, Card, Flex, Group, NumberFormatter, Stack, Text, TextInput, Modal, Select, Badge, Divider } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Icon } from "@iconify/react/dist/iconify.js";
import fetch from "@/utils/fetch";
import moment from "moment";
import { useListState } from "@mantine/hooks";
import { MerchListResponse } from "@/pages/dashboard/merch/type";

interface FormTicket {
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

interface ErrorForm {
  nik: boolean;
  nama: boolean;
  email: boolean;
  countryCode: boolean;
  phone: boolean;
  is_profession: boolean;
  is_company: boolean;
  nikLength?: boolean;
  phoneFormat?: boolean;
  phoneLength?: boolean;
}

interface Form {
  nik: string;
  full_name: string;
  email: string;
  countryCode: string;
  no_telp: string;
  is_pemesan: number;
  identity_type_id: number;
  event_ticket_id: number;
  seat_number?: string;
  is_profession: string;
  is_company: string;
  is_assistant: string;
  birthdate?: string;
  kelas?: string;
  gender?: string;
  is_insurance?: number;
  insurance_amount?: number;
  insurance_require?: number;
  merch_size?: string;
  merch_product_name?: string;
  merch_product_id?: number;
  merch_image_url?: string;
  merch_price?: number;
  merch_variant_id?: number;
  merch_variant_name?: string;
  event_merch_id?: number;
}

interface EventMerchandise {
  id: number;
  event_id: number;
  event_ticket_id: number;
  product_id: number;
  title: string;
  price: number;
  stock_qty: number;
  max_per_ticket: number;
  is_required: number;
  is_active: number;
  product: {
    id: number;
    product_name: string;
    slug: string;
    average_star: string;
    total_review: number;
    total_sold: number;
    product_image?: {
      id: number;
      product_id: number;
      image: string;
      image_url: string;
    }[];
  };
  varians: {
    id: number;
    product_id: number;
    varian_name: string;
    sku: string;
    price: string;
    stock_qty: number;
  }[];
}

interface EventDetailWithMerch extends EventProps {
  has_merches?: EventMerchandise[];
}

interface StepPaymentProps {
  detail: EventDetailWithMerch;
  ticket: FormTicket[];
  forms: Form[];
  totalCount: number;
  totalSubtotalPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setFormValid: (valid: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  onSubmitVoucher?: (data: { name: string; amount: number }) => void;
}

type Detail = { ppn?: any; ppn_type?: any;[k: string]: any };

const normalizeDetail = (detail: Detail) => {
  const normalized: Detail = { ...detail };

  const rawType = detail?.ppn_type;
  if (rawType === null || rawType === undefined || rawType === "" || rawType === "null") {
    normalized.ppn_type = "percentage";
  } else {
    normalized.ppn_type = String(rawType);
  }

  const rawPpn = detail?.ppn;
  if (rawPpn === null || rawPpn === undefined || rawPpn === "" || rawPpn === "null") {
    normalized.ppn = 0;
  } else {
    const n = Number(rawPpn);
    normalized.ppn = Number.isNaN(n) ? 0 : n;
  }

  const rawAdminFee = detail?.admin_fee;
  if (rawAdminFee === null || rawAdminFee === undefined || rawAdminFee === "" || rawAdminFee === "null") {
    normalized.admin_fee = 7000;
  } else {
    const af = Number(rawAdminFee);
    normalized.admin_fee = Number.isNaN(af) ? 7000 : af;
  }

  return normalized;
};

const validateNIK = (nik: string): { isValid: boolean; errorMessage?: string } => {
  const cleanedNIK = nik.replace(/\D/g, "");

  if (cleanedNIK.length < 16) {
    return {
      isValid: false,
      errorMessage: "NIK harus 16 digit",
    };
  }

  if (cleanedNIK.length > 16) {
    return {
      isValid: false,
      errorMessage: "Maksimal NIK adalah 16 digit",
    };
  }

  return { isValid: true };
};

const validatePhoneNumber = (phone: string): { isValid: boolean; errorMessage?: string } => {
  const cleanedPhone = phone.replace(/\D/g, "");

  if (cleanedPhone.startsWith("62")) {
    return {
      isValid: false,
      errorMessage: "Nomor telepon tidak boleh dimulai dengan 62",
    };
  }

  if (cleanedPhone.startsWith("0")) {
    return {
      isValid: false,
      errorMessage: "Nomor telepon tidak boleh dimulai dengan 0",
    };
  }

  if (cleanedPhone.length > 13) {
    return {
      isValid: false,
      errorMessage: "Maksimal 13 digit",
    };
  }

  if (cleanedPhone.length < 9) {
    return {
      isValid: false,
      errorMessage: "Nomor telepon terlalu pendek (minimal 9 digit)",
    };
  }

  if (!/^\d+$/.test(cleanedPhone)) {
    return {
      isValid: false,
      errorMessage: "Format nomor telepon tidak valid",
    };
  }

  return { isValid: true };
};

const FirstStepUnlogged = ({ onSubmitVoucher, detail, ticket, totalCount, totalSubtotalPrice, forms, isOpen, setIsOpen, setFormValid, step, setStep }: StepPaymentProps) => {
  const { width } = useWindowSize();
  const [voucherFields, setVoucherFields] = useState<string[]>([""]);
  const [form, setForm] = useState<Form[]>(forms);
  const [error, setError] = useState<ErrorForm>({
    nik: false,
    nama: false,
    email: false,
    is_profession: false,
    is_company: false,
    countryCode: true,
    phone: false,
  });
  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false);
  const [vouchers, setVouchers] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [loadings, setLoadings] = useListState<string>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<boolean[]>(form.map((_, index) => index === 0));
  const [isEventCardOpen, setIsEventCardOpen] = useState(false);
  const [payment, setPayment] = useState<string>("");
  const [xenditInvoice, setXenditInvoice] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<TransactionProps | null>(null);
  const [bank, setBank] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [displayValues, setDisplayValues] = useState<{ [key: number]: string }>({});
  const [fieldErrors, setFieldErrors] = useState<{
    [key: number]: {
      nik?: string;
      phone?: string;
    };
  }>({});
  const [insuranceChecked, setInsuranceChecked] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);

  const [merchProducts, setMerchProducts] = useState<any[]>([]);
  // Use sample products as a default for development/testing when bundling is detected
  // Auto-mapping logic for pre-filled merchandise data from ticket page
  useEffect(() => {
    if (merchProducts.length > 0) {
      let formUpdated = false;
      const newForm = form.map((f) => {
        let updatedF = { ...f };
        let localUpdated = false;

        // 1. Map product if name is present but ID is not
        if (f.merch_product_name && !f.merch_product_id) {
          const matchedProduct = merchProducts.find(
            (p) => p.product?.product_name === f.merch_product_name || p.product_name === f.merch_product_name
          );
          
          if (matchedProduct) {
            localUpdated = true;
            updatedF.merch_product_id = matchedProduct.id;
            updatedF.event_merch_id = matchedProduct.event_merch_data?.event_merch_id || matchedProduct.event_merch_id;
            updatedF.merch_price = parseFloat(matchedProduct.price) || 0;
          }
        }

        // 2. Map variant if name is present but ID is not
        // This should run if we have a product ID (either just found or already there)
        if (updatedF.merch_variant_name && !updatedF.merch_variant_id && updatedF.merch_product_id) {
          const matchedProduct = merchProducts.find(p => p.id === updatedF.merch_product_id);
          if (matchedProduct) {
            const variants = matchedProduct.event_merch_data?.varians || matchedProduct.varians || [];
            const matchedVariant = variants.find(
              (v: any) => v.varian_name === updatedF.merch_variant_name
            );
            if (matchedVariant) {
              localUpdated = true;
              updatedF.merch_variant_id = matchedVariant.id;
              updatedF.merch_price = parseFloat(matchedVariant.price) || updatedF.merch_price;
            }
          }
        }

        if (localUpdated) {
          formUpdated = true;
          return updatedF;
        }
        return f;
      });

      if (formUpdated) {
        setForm(newForm);
      }
    }
  }, [merchProducts, form.length]);

  useEffect(() => {
    if (merchProducts.length === 0 && ticket.some(t => t.name.toLowerCase().includes('budling') || t.name.toLowerCase().includes('bundling'))) {
      setMerchProducts(sampleMerchProducts);
    }
  }, [ticket, merchProducts.length]);
  const [selectedMerchImages, setSelectedMerchImages] = useState<{ [key: number]: string }>({});
  const [loadingMerch, setLoadingMerch] = useState<boolean>(false);
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<any>(null);
  const [selectedProductImage, setSelectedProductImage] = useState<string>("");
  const [productPreviewModalOpen, setProductPreviewModalOpen] = useState(false);

  const router = useRouter();

  const hasInsuranceData = detail?.has_insurances && detail.has_insurances.length > 0;
  const firstInsurance = hasInsuranceData ? detail.has_insurances?.[0] : null;
  const insuranceInfo = {
    title: firstInsurance?.title ?? "Tidak ada asuransi",
    description: firstInsurance?.description ?? "Tidak ada Deskripsi",
    provider: firstInsurance?.insurance?.name ?? "",
    address: firstInsurance?.insurance?.address ?? "",
    hasInsurance: hasInsuranceData,
  };

  const getTicketInfoForOwner = (index: number) => {
    if (index === 0) return { isBundlingMerch: false, ticketName: "", seatNumber: "", ticketPrice: 0, eventTicketId: 0 };

    let currentIndex = 0;
    for (const ticketItem of ticket) {
      for (let i = 0; i < (ticketItem?.seat_number?.length ?? ticketItem.qty_ticket); i++) {
        if (currentIndex === index - 1) {
          const ticketDetail = detail.has_event_ticket?.find((t) => t.id === ticketItem.event_ticket_id);
          const cleanName = (name: string) => name?.replace(/budling/gi, "Bundling").replace(/budnling/gi, "Bundling");
          const isBundlingMerch = ticketDetail ? (ticketDetail.is_bundling_merch === 1 || cleanName(ticketItem.name).toLowerCase().includes('bundling merch')) : false;

          return {
            isBundlingMerch,
            ticketName: cleanName(ticketItem.name),
            seatNumber: ticketItem?.seat_number ? ticketItem.seat_number[i] : undefined,
            ticketPrice: ticketItem.price,
            eventTicketId: ticketItem.event_ticket_id,
          };
        }
        currentIndex++;
      }
    }
    return { isBundlingMerch: false, ticketName: "", seatNumber: "", ticketPrice: 0, eventTicketId: 0 };
  };

  const openProductImageModal = (product: any) => {
    if (product) {
      setSelectedProductForPreview(product);
      // Cari gambar pertama yang valid
      if (product.product_image && product.product_image.length > 0 && product.product_image[0]?.image_url) {
        setSelectedProductImage(product.product_image[0].image_url);
      } else {
        setSelectedProductImage("");
      }
      setProductPreviewModalOpen(true);
    }
  };

  const closeProductImageModal = () => {
    setSelectedProductForPreview(null);
    setSelectedProductImage("");
    setProductPreviewModalOpen(false);
  };

  useEffect(() => {
    if (detail?.insurance_required === 1) {
      setInsuranceChecked(true);
    } else {
      setInsuranceChecked(false);
    }
  }, [detail?.insurance_required]);
 
  const sampleMerchProducts = [
    {
      id: 1001,
      product_name: "Official T-Shirt Black",
      product: {
        product_name: "Official T-Shirt Black",
        product_image: [{ image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&h=300&auto=format&fit=crop" }]
      },
      event_merch_data: {
        event_merch_id: 1001,
        varians: [
          { id: 1, varian_name: "S", price: "0" },
          { id: 2, varian_name: "M", price: "0" },
          { id: 3, varian_name: "L", price: "0" },
          { id: 4, varian_name: "XL", price: "0" },
          { id: 9, varian_name: "XXL", price: "0" },
          { id: 10, varian_name: "XXXL", price: "0" },
        ]
      }
    },
    {
      id: 1002,
      product_name: "Official T-Shirt White",
      product: {
        product_name: "Official T-Shirt White",
        product_image: [{ image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=300&auto=format&fit=crop" }]
      },
      event_merch_data: {
        event_merch_id: 1002,
        varians: [
          { id: 5, varian_name: "S", price: "0" },
          { id: 6, varian_name: "M", price: "0" },
          { id: 7, varian_name: "L", price: "0" },
          { id: 8, varian_name: "XL", price: "0" },
          { id: 11, varian_name: "XXL", price: "0" },
          { id: 12, varian_name: "XXXL", price: "0" },
        ]
      }
    },
    {
      id: 1003,
      product_name: "Exclusive Tote Bag",
      product: {
        product_name: "Exclusive Tote Bag",
        product_image: [{ image_url: "https://images.unsplash.com/photo-1544816153-39ad0350b51c?q=80&w=300&h=300&auto=format&fit=crop" }]
      },
      event_merch_data: {
        event_merch_id: 1003,
        varians: []
      }
    }
  ];

  const fetchMerchProductsFromEvent = useCallback(() => {
    try {
      setLoadingMerch(true);

      if (detail?.has_merches && Array.isArray(detail.has_merches) && detail.has_merches.length > 0) {
        const filteredMerches = detail.has_merches.filter((merch: EventMerchandise) => merch.is_active === 1 && merch.stock_qty > 0);

        const convertedProducts: any[] = filteredMerches.map((merch: EventMerchandise) => ({
          id: merch.product_id,
          product_name: merch.product.product_name,
          price: merch.price.toString(),
          qty: merch.stock_qty,
          product_status_id: 2,
          product_image: merch.product.product_image || [],
          slug: merch.product.slug,
          average_star: merch.product.average_star,
          total_review: merch.product.total_review,
          total_sold: merch.product.total_sold,
          event_merch_data: {
            event_merch_id: merch.id,
            title: merch.title,
            max_per_ticket: merch.max_per_ticket,
            is_required: merch.is_required,
            varians: merch.varians,
          },
        }));

        setMerchProducts(convertedProducts);

        const initialImages: { [key: number]: string } = {};
        convertedProducts.forEach((product: any) => {
          if (product.product_image && product.product_image.length > 0 && product.product_image[0]?.image_url) {
            initialImages[product.id] = product.product_image[0].image_url;
          }
        });
        setSelectedMerchImages(initialImages);
      } else {
        setMerchProducts(sampleMerchProducts);
      }
    } catch (error: any) {
      console.error("Error processing merch products from event:", error);
      setMerchProducts(sampleMerchProducts);
    } finally {
      setLoadingMerch(false);
    }
  }, [detail?.has_merches]);

  useEffect(() => {
    const hasBundlingMerchTickets = ticket.some((ticketItem) => {
      const ticketDetail = detail.has_event_ticket?.find((t) => t.id === ticketItem.event_ticket_id);
      const cleanName = (name: string) => name?.replace(/budling/gi, "Bundling").replace(/budnling/gi, "Bundling");
      return ticketDetail?.is_bundling_merch === 1 || cleanName(ticketItem.name).toLowerCase().includes('bundling merch');
    });

    if (hasBundlingMerchTickets) {
      fetchMerchProductsFromEvent();
    }
  }, [detail?.has_event_ticket, ticket, fetchMerchProductsFromEvent]);

  const computeTax = (detail: any, subtotalAfterVoucher: number) => {
    const d = normalizeDetail(detail);

    const ppnType = d.ppn_type;
    const ppnValue = Number(d.ppn);

    if (ppnType === "percentage") {
      const tax = Math.round(subtotalAfterVoucher * (ppnValue / 100));
      return { tax, label: `${ppnValue}%`, ppnType };
    } else if (ppnType === "nominal") {
      const tax = Math.round(ppnValue);
      return { tax, label: "", ppnType };
    }

    return { tax: 0, label: "0", ppnType };
  };

  const getPaymentMethodById = (id: string) => {
    setLoading(true);
    Get(`payment-method/${id}`, {})
      .then((res: any) => {
        setPaymentMethod(res.data);
        setLoading(false);
        setIsOpen(false);
        setStep(3);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleShowModal = () => {
    setShowModalTransaction(!showModalTransaction);
  };

  const allBundlingInfo = detail.has_event_ticket
    ? detail.has_event_ticket.map((ticket) => ({
      id: ticket.id,
      isBundling: ticket.is_bundling === 1,
      bundlingQty: ticket.bundling_qty,
    }))
    : [];

  const getBundlingInfo = useCallback((event_ticket_id: number) => {
    if (!detail.has_event_ticket) return { isBundling: false, bundlingQty: 0 };

    const ticket = detail.has_event_ticket.find((t) => t.id === event_ticket_id);
    return {
      isBundling: ticket ? ticket.is_bundling === 1 : false,
      bundlingQty: ticket ? ticket.bundling_qty : 0,
    };
  }, [detail.has_event_ticket]);

  const displayTotalCount = useMemo(() => {
    if (!ticket || ticket.length === 0) return 0;

    let count = 0;

    ticket.forEach((item) => {
      const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);

      if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
        const packageCount = Math.floor(item.qty_ticket / bundlingQty);
        count += packageCount;
      } else {
        count += item.qty_ticket;
      }
    });

    return count;
  }, [ticket, getBundlingInfo]);

  const displayTotalSubtotalPrice = useMemo(() => {
    if (!ticket || ticket.length === 0) return 0;

    let total = 0;

    ticket.forEach((item) => {
      const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);

      if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
        const packageCount = Math.floor(item.qty_ticket / bundlingQty);
        total += item.price * packageCount;
      } else {
        total += item.price * item.qty_ticket;
      }
    });

    return total;
  }, [ticket, getBundlingInfo]);

  const totalTicketFee = useMemo(() => {
    if (!ticket || ticket.length === 0) return 0;

    let totalFee = 0;

    ticket.forEach((item) => {
      const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);
      const fee = item.ticket_fee || 0;

      if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
        const packageCount = Math.floor(item.qty_ticket / bundlingQty);
        totalFee += fee * packageCount;
      } else {
        totalFee += fee * item.qty_ticket;
      }
    });

    return totalFee;
  }, [ticket, getBundlingInfo]);

  const adminFee = totalTicketFee;

  const calculateInsuranceTotal = () => {
    if ((detail?.insurance_required === 1 || insuranceChecked) && detail?.insurance_amount && displayTotalCount > 0) {
      return detail.insurance_amount * displayTotalCount;
    }
    return 0;
  };

  const eventHasInsurance = detail?.is_insurance === 1;
  const insuranceRequired = detail?.insurance_required === 1;
  const insuranceAmount = detail?.insurance_amount || 0;

  let isInsuranceSelected = false;
  let is_insurance_value = 0;

  if (insuranceRequired) {
    isInsuranceSelected = true;
    is_insurance_value = 1;
  } else if (eventHasInsurance) {
    isInsuranceSelected = insuranceChecked;
    is_insurance_value = insuranceChecked ? 1 : 0;
  }

  const InsuranceTotal = calculateInsuranceTotal();

  const calculateGrandTotal = () => {
    const subtotalTiket = displayTotalSubtotalPrice;
    const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
    const subtotalAfterVoucher = Math.max(subtotalTiket - totalVoucher, 0);
    const insuranceTotal = calculateInsuranceTotal();
    const tax = detail?.ppn ? Math.round(subtotalAfterVoucher * (detail.ppn / 100)) : 0;

    return subtotalAfterVoucher + adminFee + tax + insuranceTotal;
  };

  const renderer: CountdownRendererFn = ({ hours, minutes, seconds }) => {
    return (
      <div className="flex flex-col items-center justify-center font-semibold">
        <h3 className="text-[15px] my-5">Waktu untuk Pembayaran Tersisa</h3>
        <div className="bg-primary-light border-2 border-primary-light-200 text-[40px] px-6 py-2 rounded-xl">
          <div className="flex">
            <div className="pr-4">
              {String(hours).padStart(2, "0")}
              <p className="text-sm font-medium text-center text-grey">Jam</p>
            </div>
            <div className="border-2 border-x-primary-light-200 border-y-primary-light px-4">
              {String(minutes).padStart(2, "0")}
              <p className="text-sm font-medium text-center text-grey">Menit</p>
            </div>
            <div className="pl-4">
              {String(seconds).padStart(2, "0")}
              <p className="text-sm font-medium text-center text-grey">Detik</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-center font-light my-5 px-4">
          Batas pembayaran sampai dengan <span className="font-semibold">{formattedDate}</span> Harap selesaikan pembayaran sebelum waktu tersebut untuk menghindari pembatalan otomatis.
        </p>
      </div>
    );
  };

  const classAcc = {
    base: "!p-0",
    heading: "bg-primary-light px-4",
    trigger: "",
    titleWrapper: "",
    title: "text-sm ",
    subtitle: "",
    startContent: "",
    indicator: "",
    content: "px-4",
  };

  const now = new Date();
  const targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  function padToTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabru"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayName = days[targetDate.getDay()];
  const day = padToTwoDigits(targetDate.getDate());
  const month = months[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  const hours = padToTwoDigits(targetDate.getHours());
  const minutes = padToTwoDigits(targetDate.getMinutes());
  const formattedDate = `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}`;

  const formValidation = useCallback((data: Form) => {
    return (
      (detail.is_noidentity == 1 ? Boolean(data.nik) : true) &&
      (detail.is_name == 1 ? Boolean(data.full_name) : true) &&
      (detail.is_email == 1 ? Boolean(data.email) : true) &&
      (detail.is_email == 1 ? data.email.includes("@") && data.email.includes(".") : true) &&
      (detail.is_phone_number == 1 ? Boolean(data.no_telp) : true)
    );
  }, [detail]);

  const handleInput = (index: number, field: keyof Form, value: string) => {
    let newForm = [...form];

    if (field === "no_telp") {
      const displayVal = value.replaceAll(/\D/g, "");
      setDisplayValues((prev) => ({ ...prev, [index]: displayVal }));

      const phoneForBackend = "62" + displayVal;
      newForm[index] = { ...newForm[index], [field]: phoneForBackend };

      if (detail.is_phone_number == 1) {
        const validation = validatePhoneNumber(displayVal);

        if (!validation.isValid) {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              phone: validation.errorMessage,
            },
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              phone: undefined,
            },
          }));
        }
      }
    } else if (field === "nik") {
      const numericValue = value.replace(/\D/g, "").slice(0, 16);
      newForm[index] = { ...newForm[index], [field]: numericValue };

      if (detail.is_noidentity == 1) {
        const validation = validateNIK(numericValue);

        if (!validation.isValid) {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              nik: validation.errorMessage,
            },
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              nik: undefined,
            },
          }));
        }
      }
    } else if (field === "merch_product_name") {
      const selectedProduct = merchProducts.find((product) => (product.product?.product_name === value || product.product_name === value));
      if (selectedProduct) {
        newForm[index] = {
          ...newForm[index],
          [field]: value,
          merch_product_id: selectedProduct.id,
          event_merch_id: selectedProduct.event_merch_data?.event_merch_id || selectedProduct.event_merch_id,
          merch_price: parseFloat(selectedProduct.price) || 0,
          merch_variant_id: undefined,
          merch_variant_name: "",
        };
      }
    } else {
      newForm[index] = { ...newForm[index], [field]: value };

      if (field === "email" && detail.is_email == 1 && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              email: "Format email tidak valid",
            },
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              email: undefined,
            },
          }));
        }
      }

      if ((field === "full_name" && value.trim()) || (field === "is_profession" && value.trim()) || (field === "is_company" && value.trim()) || (field === "is_assistant" && value.trim()) || (field === "kelas" && value.trim())) {
        setFieldErrors((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            [field]: undefined,
          },
        }));
      }
    }

    setForm(newForm);
    const isFormValid = newForm.every(formValidation);
    setFormValid(isFormValid);
  };

  const handlePaymentChange = (value: string, type: "payment" | "bank") => {
    if (type === "payment") {
      setPayment(value);
    } else {
      setBank(value);
    }

    const isFormValid = form.every(formValidation) && value !== null;
    setFormValid(isFormValid);
  };

  useEffect(() => {
    if (detail && detail.has_event_payment_method.length === 1) {
      // const ticketPriceTotal = ticket.reduce((e, n) => e + n.price * n.qty_ticket, 0);
      const paymentMethod = detail.has_event_payment_method[0].has_payment_method;
      if (paymentMethod.payment_name === "Xendit") {
        setPayment(paymentMethod.id.toString());
        setFormValid(form.every(formValidation));
      }
    }
  }, [detail, form, formValidation, setFormValid]);

  const copyOrderer = (targetIndex: number) => {
    if (form.length > 0 && targetIndex > 0 && targetIndex < form.length) {
      let newForm = [...form];
      newForm[targetIndex] = { ...newForm[0], is_pemesan: 0 };
      setForm(newForm);

      if (displayValues[0]) {
        setDisplayValues((prev) => ({
          ...prev,
          [targetIndex]: displayValues[0],
        }));
      }

      setFieldErrors((prev) => ({
        ...prev,
        [targetIndex]: {},
      }));

      const isFormValid = newForm.every(formValidation);
      setFormValid(isFormValid);
    }
  };

  const clearForm = (targetIndex: number) => {
    if (form.length > 0 && targetIndex >= 0 && targetIndex < form.length) {
      let newForm = [...form];
      newForm[targetIndex] = {
        nik: "",
        full_name: "",
        email: "",
        countryCode: "",
        no_telp: "",
        is_pemesan: 0,
        is_profession: "",
        is_company: "",
        identity_type_id: 1,
        event_ticket_id: 1,
        gender: "",
        birthdate: "",
        kelas: "",
        is_assistant: "",
        merch_size: "",
        merch_product_name: "",
        merch_product_id: undefined,
        event_merch_id: undefined,
        merch_image_url: "",
        merch_price: 0,
        merch_variant_id: undefined,
        merch_variant_name: "",
      };
      setForm(newForm);

      setDisplayValues((prev) => ({
        ...prev,
        [targetIndex]: "",
      }));

      setFieldErrors((prev) => ({
        ...prev,
        [targetIndex]: {},
      }));

      const isFormValid = newForm.every(formValidation);
      setFormValid(isFormValid);
    }
  };

  const submitForm = () => {
    const now = new Date();
    now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
    const isoString = now.toISOString();

    const subtotal = displayTotalSubtotalPrice;
    const adminFee = totalTicketFee;

    const voucherDiscount = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);

    const subtotalAfterVoucher = Math.max(subtotal - voucherDiscount, 0);

    let tax = 0;
    let taxLabel = "";
    try {
      if (typeof computeTax === "function") {
        const res = computeTax(detail, subtotalAfterVoucher);
        tax = Number(res.tax) || 0;
        taxLabel = res.label || "";
      } else {
        const ppnType = detail?.ppn_type || "percentage";
        const rawPpn = Number(detail?.ppn) || 0;
        if (ppnType === "percentage") {
          const taxBase = subtotalAfterVoucher + adminFee;
          tax = Math.round(taxBase * (rawPpn / 100));
          taxLabel = `${rawPpn}%`;
        } else if (ppnType === "nominal") {
          tax = Math.round(rawPpn);
          taxLabel = `Rp ${tax.toLocaleString("id-ID")}`;
        } else {
          tax = 0;
          taxLabel = "Free";
        }
      }
    } catch (e) {
      const rawPpn = Number(detail?.ppn) || 0;
      tax = detail?.ppn ? Math.round(subtotalAfterVoucher * (rawPpn / 100)) : 0;
      taxLabel = `${detail?.ppn ?? 0}%`;
    }

    const eventHasInsurance = detail?.is_insurance === 1;
    const insuranceRequired = detail?.insurance_required === 1;
    const insuranceAmount = detail?.insurance_amount || 0;

    let isInsuranceSelected = false;
    let is_insurance_value = 0;
    let insurance_required_value = insuranceRequired ? 1 : 0;

    if (insuranceRequired) {
      isInsuranceSelected = true;
      is_insurance_value = 1;
      insurance_required_value = 1;
    } else if (eventHasInsurance) {
      isInsuranceSelected = insuranceChecked;
      is_insurance_value = insuranceChecked ? 1 : 0;
      insurance_required_value = insuranceChecked ? 1 : 0;
    }

    const InsuranceTotal = isInsuranceSelected ? insuranceAmount * displayTotalCount : 0;

    const grandtotal = subtotalAfterVoucher + adminFee + tax + InsuranceTotal;

    const allSeatNumbers = ticket.map((t) => (Array.isArray(t.seat_number) ? t.seat_number : JSON.parse(t.seat_number || "[]"))).flat();

    let seatIndex = 0;

    const merchPayload = form
      .filter((f) => f.event_merch_id && f.merch_product_name)
      .map((f) => ({
        event_merch_id: f.event_merch_id,
        product_variant_id: f.merch_variant_id || null,
        qty: 1,
        noted: f.merch_variant_name || f.merch_size || "",
      }));

    const hasMerch = merchPayload.length > 0;

    const payload = {
      event_id: detail?.id,
      admin_fee: detail?.admin_fee,
      payment_method: payment ? payment : "4",
      grandtotal: grandtotal,
      ppn_type: detail?.ppn_type ?? "percentage",
      ppn: detail?.ppn ?? 0,
      ppn_amount: tax,
      is_insurance: is_insurance_value,
      insurance_amount: insuranceAmount,
      insurance_total: InsuranceTotal,
      insurance_required: isInsuranceSelected ? 1 : 0,
      identities: form.map((identity) => {
        if (identity.is_pemesan === 1) return identity;

        const seat_number = allSeatNumbers[seatIndex] || "";
        seatIndex++;

        return {
          ...identity,
          seat_number: identity.seat_number || seat_number,
        };
      }),
      tickets: ticket.map((e) => ({
        ...e,
        seatnumber_ticket: JSON.stringify(e.seat_number),
        is_insurance: is_insurance_value,
        insurance_amount: isInsuranceSelected ? insuranceAmount : 0,
        insurance_require: detail?.insurance_required || 0,
      })),
      bank_code: bank,
      expiration_date: isoString,
      vouchers:
        vouchers.length > 0
          ? vouchers.map((v) => ({
            voucher_id: v.id,
            voucher_code: v.name,
            voucher_amount: v.amount,
          }))
          : [],
      is_merch: hasMerch ? 1 : 0,
      merches: hasMerch ? merchPayload : undefined,
    };

    setLoading(true);
    Post("transaction-without-auth", payload)
      .then((res: any) => {
        setTransactionData(res.data);

        if (res?.isFree) {
          router.push("/success/" + res.invoice_no);
          return;
        }

        if (res.xendit_invoice && res.xendit_invoice.invoice_url) {
          router.push(res.xendit_invoice.invoice_url);
        } else if (res.xendit_invoice && res.xendit_invoice.va_number?.length > 0) {
          setXenditInvoice(res.xendit_invoice.va_number[0]);
          setLoading(false);
          setIsOpen(false);
          setStep(3);
        } else if (res.data?.payment_method === "2" && !res.xendit_invoice_url) {
          getPaymentMethodById("2");
        } else {
          setLoading(false);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.error("DEBUG -> Payment error:", err);
        if (err?.response?.data?.out_of_stock || err?.response?.out_of_stock) {
          notifications.show({
            color: "red",
            position: "top-right",
            message: "Tiket sudah habis terjual",
          });
        } else {
          notifications.show({
            color: "red",
            position: "top-right",
            message: err.response?.data?.message ?? err.message,
          });
        }
      });
  };

  const toggleCollapse = (index: number) => {
    setCollapse((prev) => {
      let newCollapse = [...prev];
      newCollapse[index] = !newCollapse[index];
      return newCollapse;
    });
  };

  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleGetVoucher = async (index: number) => {
    if (!voucherFields[index]) return;

    const isDuplicate = vouchers.some((v) => v.name === voucherFields[index]);
    if (isDuplicate) {
      notifications.show({
        message: "Voucher sudah digunakan.",
        color: "red",
      });
      return;
    }

    await fetch<
      {
        event_id: number;
        date: string;
        code: string;
      },
      {
        voucher: {
          discount: number;
          type: "persentase" | "nominal";
          date_start: string;
          date_end: string;
          max_use: number;
          min_transaction: number;
          stock: number;
          status: 1 | 0;
        };
      }
    >({
      url: "vouchers/validate",
      method: "POST",
      data: {
        event_id: detail.id,
        date: moment(new Date()).format("YYYY-MM-DD"),
        code: voucherFields[index],
      },
      before: () => setLoadings.append(`getvoucher-${index}`),
      success: (data) => {
        const voucher = data?.voucher ?? data?.data?.voucher;
        if (!voucher) return;
        const isDateValid = moment(voucher.date_start).isBefore(new Date()) && moment(voucher.date_end).isAfter(new Date());
        const isStockValid = voucher.stock > 0;
        const isStatusValid = voucher.status == 1;
        const isMinTransactionValid = totalSubtotalPrice >= voucher.min_transaction;
        const discount = voucher.type == "persentase" ? (totalSubtotalPrice * voucher.discount) / 100 : voucher.discount;

        if (isDateValid && isStockValid && isStatusValid && isMinTransactionValid) {
          setVouchers((prevVouchers) => [
            ...prevVouchers,
            {
              data: voucher,
              id: voucher.id,
              name: voucherFields[index],
              amount: discount,
            },
          ]);
        } else {
          notifications.show({
            message: "Voucher Tidak Ditemukan",
            color: "red",
          });
          setVoucherFields((prev) => {
            const newFields = [...prev];
            newFields[index] = "";
            return newFields;
          });
        }
      },
      complete: () => setLoadings.filter((e) => e !== `getvoucher-${index}`),
      error: () => {
        notifications.show({
          message: "Voucher Tidak Ditemukan",
          color: "red",
        });
        setVoucherFields((prev) => {
          const newFields = [...prev];
          newFields[index] = "";
          return newFields;
        });
      },
    });
  };

  const handleAddVoucherField = () => {
    if (voucherFields.length < (detail.max_use_voucher ?? 0)) {
      setVoucherFields([...voucherFields, ""]);
    } else {
      notifications.show({
        message: "Maksimal voucher sudah digunakan",
        color: "red",
      });
    }
  };

  const handleCancelVoucher = (index: number) => {
    const newVoucherFields = [...voucherFields];
    const newVouchers = [...vouchers];
    newVoucherFields[index] = "";
    newVouchers.splice(index, 1);
    setVoucherFields(newVoucherFields);
    setVouchers(newVouchers.filter(Boolean));
  };

  const getMerchVariants = (productId: any) => {
    const product = merchProducts.find((p) => p.id == productId);
    if (!product || !product.event_merch_data?.varians) return [];

    return product.event_merch_data.varians;
  };

  return step === 0 ? (
    <>
      {width &&
        (width < 768 ? (
          <div className="bg-primary-light mt-32 lg:mt-0 pb-8">
            <div className="border-b p-3 border-primary-light flex items-center gap-3">
              <div className="px-2 py-1 border rounded-md border-primary-light">{detail?.image_url && <Image src={detail.image_url} width={1000} height={1000} alt="banner" className="w-10 h-10 object-cover rounded-md" />}</div>
              <div>
                <p className="text-sm mb-1">{detail?.name}</p>
                <p className="text-xs text-grey">{totalCount} Tiket</p>
              </div>
            </div>

            <Card withBorder radius={10} p={20} className="mt-3">
              <Stack gap={20}>
                <Flex gap={10} align="center">
                  <Icon icon="mdi:voucher-outline" className="text-primary-base text-[20px]" />
                  <Text fw={600}>Voucher</Text>
                </Flex>

                {voucherFields.map((field, i) => (
                  <Group key={i}>
                    <TextInput
                      w="100%"
                      value={field}
                      onChange={(e) => {
                        const newFields = [...voucherFields];
                        newFields[i] = e.currentTarget.value;
                        if (i === voucherFields.length - 1 && e.currentTarget.value.length > 0) {
                          newFields.push("");
                        }
                        setVoucherFields(newFields);
                      }}
                      placeholder={`Masukan Kode Voucher ${i + 1}`}
                    />
                    <Button loading={loadings.includes(`getvoucher-${i}`)} disabled={field.length < 3} size="xs" onClick={() => handleGetVoucher(i)} className="shrink-0">
                      Submit
                    </Button>
                    {vouchers[i] && (
                      <>
                        <Button variant="outline" size="xs" color="red" onClick={() => handleCancelVoucher(i)} className="shrink-0">
                          Cancel
                        </Button>
                        <Icon icon="uiw:circle-check" className="text-green-500 text-[20px] shrink-0" />
                      </>
                    )}
                  </Group>
                ))}


              </Stack>
            </Card>

            <div className="border border-primary-light-200 rounded-lg bg-white shadow-sm">
              <div className="border-b border-b-primary-light-200 p-3">
                <p className="font-semibold">Ringkasan Pesanan</p>
              </div>

              {ticket.map((item: FormTicket) => {
                const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);

                let displayQty = item.qty_ticket;
                let packageCount = 1;

                if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
                  packageCount = Math.floor(item.qty_ticket / bundlingQty);
                  displayQty = packageCount;
                }

                const bundlingInfo = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? ` (paket ${bundlingQty} orang)` : "";
                const displaySubtotal = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? item.price * packageCount : item.price * item.qty_ticket;

                return (
                  <div className="border-b p-3 border-primary-light-200 flex gap-3" key={item.event_ticket_id}>
                    <div className="px-3 flex items-center border rounded-md border-primary-light">
                      <FontAwesomeIcon icon={faTicket} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm mb-1 font-semibold">
                        {item.name}
                        {bundlingInfo}
                      </p>
                      <p className="text-xs text-grey">
                        {displayQty} {displayQty === 1 ? "Paket" : "Paket"} x {item.price} = Rp {displaySubtotal.toLocaleString("id-ID")}
                        {isBundling && bundlingQty >= 2 && bundlingQty <= 99 && <span className="text-[10px] text-gray-500 block">({item.qty_ticket} tiket fisik)</span>}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="py-3 px-4 flex justify-between items-center">
                <p>
                  {`Jumlah (${displayTotalCount} ${ticket.some((item) => {
                    const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);
                    return isBundling && bundlingQty >= 2 && bundlingQty <= 99;
                  })
                    ? "Paket"
                    : "Tiket"
                    })`}
                </p>
                <p className="font-semibold">{displayTotalSubtotalPrice > 0 ? <NumberFormatter value={displayTotalSubtotalPrice} /> : <Text>Free</Text>}</p>
              </div>

              {vouchers.length > 0 && (
                <div className="py-3 px-4 flex justify-between items-center">
                  <p>Total Voucher</p>
                  <p className="font-semibold">
                    -<NumberFormatter value={vouchers.reduce((s, v) => s + (v.amount || 0), 0)} />
                  </p>
                </div>
              )}

              {(() => {
                const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
                const subtotalAfterVoucher = Math.max(displayTotalSubtotalPrice - totalVoucher, 0);
                return (
                  <div className="py-3 px-4 flex justify-between items-center">
                    <p>Subtotal</p>
                    <p className="font-semibold">
                      <NumberFormatter value={subtotalAfterVoucher} />
                    </p>
                  </div>
                );
              })()}

              {detail?.ppn !== undefined
                ? (() => {
                  const subtotalTiket = displayTotalSubtotalPrice;
                  const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
                  const subtotalAfterVoucher = Math.max(displayTotalSubtotalPrice - totalVoucher, 0);

                  const { tax, label, ppnType } = computeTax(detail, subtotalAfterVoucher);

                  if (tax <= 0) return null;

                  return (
                    <div className="py-3 px-4 flex justify-between items-center">
                      <p>{ppnType === "nominal" ? `Tax ${label}` : `Tax (${label})`}</p>
                      <p className="font-semibold">
                        <NumberFormatter value={tax} />
                      </p>
                    </div>
                  );
                })()
                : null}

              {detail?.is_insurance === 1 && (
                <>
                  <div className="border-b p-3 border-primary-light-200 flex gap-3 items-center justify-between" key="asuransi">
                    <div className="flex items-center gap-3">
                      <div className="px-3 flex items-center border rounded-md border-primary-light">
                        <Icon icon="mdi:shield-check" className="text-primary" />
                      </div>
                      <div>
                        <button onClick={() => setInsuranceModalOpen(true)} className="text-sm mb-1 font-semibold hover:text-primary transition-colors text-left">
                          Pakai Asuransi
                        </button>
                        <p className="text-xs text-grey">
                          Rp {detail?.insurance_amount?.toLocaleString("id-ID") || "0"} per tiket
                          {insuranceChecked && <span className="block text-xs text-blue-600">+Rp {calculateInsuranceTotal().toLocaleString("id-ID")}</span>}
                        </p>
                      </div>
                    </div>

                    {detail?.insurance_required === 0 ? (
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        checked={insuranceChecked}
                        onChange={(e) => {
                          setInsuranceChecked(e.target.checked);
                        }}
                      />
                    ) : (
                      <div className="text-xs text-primary font-semibold">Wajib</div>
                    )}
                  </div>

                  <Modal opened={insuranceModalOpen} onClose={() => setInsuranceModalOpen(false)} title="Ketentuan Asuransi" size="lg" centered>
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="w-full sm:w-1/4 flex flex-col items-center justify-center">
                        <div className="bg-blue-50 p-4 rounded-full mb-3">
                          <Icon icon="mdi:shield-check" className="text-blue-600 text-4xl" />
                        </div>
                        <p className="text-sm font-semibold text-center">Proteksi Tiket Anda</p>
                      </div>

                      <div className="w-full sm:w-3/4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{insuranceInfo.title}</h4>
                            <p className="text-xs text-gray-600">{insuranceInfo.description}</p>
                          </div>

                          <div className="pt-2">
                            <p className="text-xs text-gray-500">
                              Biaya asuransi: <span className="font-semibold">Rp {detail?.insurance_amount?.toLocaleString("id-ID") || "2.000"} per tiket</span>
                            </p>
                            {detail?.insurance_required === 1 && <p className="text-xs text-red-500 mt-1">*Asuransi wajib untuk event ini</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-end">
                      <Button onClick={() => setInsuranceModalOpen(false)} size="xs">
                        Mengerti
                      </Button>
                    </div>
                  </Modal>
                </>
              )}

              {adminFee > 0 && (
                <div className="py-3 px-4 flex justify-between items-center">
                  <p>Biaya Admin</p>
                  <p className="font-semibold">
                    <NumberFormatter value={adminFee} />
                  </p>
                </div>
              )}

              <div className="py-3 px-4 flex justify-between items-center">
                <p>Total Pembayaran</p>
                <p className="font-semibold">
                  {(() => {
                    const grandTotal = calculateGrandTotal();
                    return grandTotal > 0 ? <NumberFormatter value={grandTotal} /> : <Text>Free</Text>;
                  })()}
                </p>
              </div>
            </div>

            <div className="mt-3">
              {form.map((item, index) => {
                const ticketInfo = getTicketInfoForOwner(index);

                if (index > 0 && !item.seat_number && ticketInfo.seatNumber) {
                  handleInput(index, "seat_number", ticketInfo.seatNumber);
                }

                const selectedProduct = item.merch_product_id ? merchProducts.find((p) => p.id === item.merch_product_id) : null;

                const availableVariants = selectedProduct ? getMerchVariants(item.merch_product_id!) : [];

                return (
                  <div className="bg-white rounded-lg shadow-sm mb-3" key={index}>
                    <div className="border-b py-3 px-5 border-primary-light flex items-center justify-between cursor-pointer" onClick={() => toggleCollapse(index)}>
                      <div className="flex items-center gap-3">
                        {index > 0 && <FontAwesomeIcon icon={faTicket} className="text-primary shrink-0" />}
                        <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{index > 0 ? `${index}. Pemilik Tiket` : "Data Pemesan"}</p>
                          {index > 0 && (
                            <>
                              <span className="text-[#e3e3e3]">|</span>
                              <Icon icon="solar:ticket-bold" className="text-primary-base text-sm" />
                              <span className="font-semibold">{ticketInfo.ticketName}</span>
                              {ticketInfo.seatNumber && <span className="text-xs text-gray-500">(Seat {ticketInfo.seatNumber})</span>}
                            </>
                          )}
                        </div>
                        </div>
                      </div>
                      <button className="text-grey">
                        <FontAwesomeIcon icon={faChevronUp} className={`${collapse[index] ? "rotate-0" : "rotate-180"} transition-transform duration-200`} />
                      </button>
                    </div>

                    {index > 0 && (
                      <div className="flex items-center justify-end gap-[8px] px-4 py-2 rounded-lg text-grey">
                        <p className="text-xs md:text-sm text-end">Gunakan Data Pemesan</p>
                        <Switch size="sm" onChange={(e: any) => (e.target.checked ? copyOrderer(index) : clearForm(index))} />
                      </div>
                    )}

                    <div className={`px-5 pt-3 pb-5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${collapse[index] ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className={`${collapse[index] ? "block" : "hidden"} flex flex-col gap-3`}>
                        {detail.is_noidentity ? (
                          <Field className="mb-1.5 sm:mb-2">
                            <div>
                              <InputSelect
                                label="Identitas"
                                required
                                onChange={(e) => handleInput(index, "identity_type_id", e.target.value)}
                                options={[
                                  { key: "1", label: "KTP" },
                                  { key: "2", label: "SIM" },
                                  { key: "3", label: "Kartu Pelajar" },
                                  { key: "4", label: "Passport" },
                                  { key: "5", label: "KTM" },
                                ]}
                              />
                            </div>
                            <Label className="text-xs sm:text-sm font-base text-grey">Nomor Induk KTP</Label>
                            <Input
                              type="text"
                              className={`${fieldErrors[index]?.nik ? "border-danger" : "border-primary-light"
                                } [&::-webkit-inner-spin-button]:appearance-none mt-0.5 sm:mt-1 block w-full rounded-lg border bg-white/5 py-1 px-2 text-xs sm:text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200`}
                              placeholder="3277*************"
                              value={item.nik}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, "").slice(0, 16);
                                handleInput(index, "nik", numericValue);
                              }}
                              maxLength={16}
                            />
                            {fieldErrors[index]?.nik && <p className="text-[8px] sm:text-[9px] mt-0.5 text-danger">{fieldErrors[index]?.nik}</p>}
                            {error.nik && item.nik.length < 16 && !fieldErrors[index]?.nik && <p className="text-[8px] sm:text-[9px] mt-0.5 text-danger">Minimal NIK adalah 16 Digit</p>}
                          </Field>
                        ) : null}

                        {detail.is_name == 1 && <InputField fullWidth type="text" label="Nama Lengkap" placeholder="Nama Lengkap" value={item.full_name} onChange={(e) => handleInput(index, "full_name", e.target.value)} />}
                        {detail.is_assistant == 1 && <InputField fullWidth type="text" label="Assistant" placeholder="Nama Assistant" value={item.is_assistant || ""} onChange={(e) => handleInput(index, "is_assistant", e.target.value)} />}
                        {detail.is_gender == 1 && (
                          <Field className="mb-2">
                            <Label className="text-sm font-base text-grey">Jenis Kelamin</Label>
                            <select
                              className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm text-dark focus:outline-none"
                              value={item.gender || ""}
                              onChange={(e) => handleInput(index, "gender", e.target.value)}
                            >
                              <option value="">Pilih jenis kelamin</option>
                              <option value="Pria">Pria</option>
                              <option value="Wanita">Wanita</option>
                              <option value="Tidak Memberitahu">Tidak Memberitahu</option>
                            </select>
                          </Field>
                        )}

                        {detail.is_birthdate == 1 && (
                          <Field className="mb-2">
                            <Label className="text-sm font-base text-grey">Tanggal Lahir</Label>
                            <Input
                              type="date"
                              className="mt-2 block w-full rounded-lg border border-primary-light-200 bg-white/5 py-1.5 px-3 text-sm text-dark focus:outline-none"
                              value={item.birthdate || ""}
                              onChange={(e) => handleInput(index, "birthdate", e.target.value)}
                            />
                          </Field>
                        )}

                        {detail.is_kelas == 1 && <InputField fullWidth type="text" label="Kelas" placeholder="Contoh: Kelas I" value={item.kelas} onChange={(e) => handleInput(index, "kelas", e.target.value)} />}
                        {detail.is_profession == 1 && (
                          <InputField
                            fullWidth
                            type="text"
                            label="Profesi atau Pekerjaan anda"
                            placeholder="contoh: Promotor, Musisi, IT, Programmer etc"
                            value={item.is_profession}
                            onChange={(e) => handleInput(index, "is_profession", e.target.value)}
                          />
                        )}
                        {detail.is_company == 1 && (
                          <InputField fullWidth type="text" label="Perusahaan Atau Organisasi" placeholder="Nama perusahaan atau organisasi" value={item.is_company} onChange={(e) => handleInput(index, "is_company", e.target.value)} />
                        )}
                        {detail.is_phone_number ? (
                          <Field className="mb-1.5 sm:mb-2">
                            <Label className="text-xs sm:text-sm font-base text-grey">No Telepon</Label>
                            <div className="flex gap-1 sm:gap-2 items-center">
                              <form className="max-w-sm block mt-0.5 sm:mt-1">
                                <select
                                  id="countries"
                                  className="bg-gray-50 border border-primary-light text-dark text-xs sm:text-sm rounded-lg focus:ring-primary-base focus:border-primary-light block w-full py-1 sm:py-1.5 px-1.5 sm:px-2"
                                  value={item.countryCode}
                                  onChange={(e) => handleInput(index, "countryCode", e.target.value)}
                                >
                                  <option value="+62">+62</option>
                                </select>
                              </form>
                              <Input
                                className={`${fieldErrors[index]?.phone ? "border-danger" : "border-primary-light"
                                  } mt-0.5 sm:mt-1 w-4/5 block rounded-lg border bg-white/5 py-1 sm:py-1.5 px-1.5 sm:px-2 text-xs sm:text-sm/6 text-dark focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary-200`}
                                placeholder="Contoh: 81234567890"
                                value={displayValues[index] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numericValue = value.replace(/\D/g, "");
                                  handleInput(index, "no_telp", numericValue);
                                }}
                                type="tel"
                                maxLength={13}
                              />
                            </div>
                            {fieldErrors[index]?.phone && <p className="text-[8px] sm:text-[9px] mt-0.5 text-danger">{fieldErrors[index]?.phone}</p>}
                          </Field>
                        ) : null}
                        {detail.is_email == 1 && <InputField fullWidth type="text" label="Email" placeholder="Contoh: example@example.com" value={item.email} onChange={(e) => handleInput(index, "email", e.target.value)} />}



                        {/* Bagian Bundling untuk pemilik tiket */}
                        {index > 0 && ticketInfo.isBundlingMerch && (
                          <div className="border-t pt-4 mt-3">
                            <div className="flex flex-col gap-6">
                              {/* Langkah 1: Pilih Merchandise */}
                              <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">
                                    Langkah 1: Pilih Merchandise
                                  </span>
                                  <p className="text-[10px] font-medium text-[#94a3b8]">
                                    Pilih salah satu merchandise yang termasuk dalam paket bundling.
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                  {merchProducts.map((product) => {
                                    const isSelected = item.merch_product_id == product.id;
                                    const imageUrl = product.product.product_image?.[0]?.image_url;

                                    return (
                                      <div
                                        key={product.id}
                                        onClick={() => {
                                          handleInput(index, "merch_product_id", product.id.toString());
                                          handleInput(index, "merch_product_name", product.product.product_name);
                                        }}
                                        className={`
                                          flex flex-col rounded-[8px] border-2 transition-all duration-300 overflow-hidden relative cursor-pointer
                                          ${item.merch_product_id == product.id
                                            ? "border-[#194E9E] bg-blue-50 shadow-sm scale-[1.02]"
                                            : "border-[#e2e8f0] bg-white hover:border-[#194E9E]/40"}
                                        `}
                                      >
                                        <div className="aspect-square relative overflow-hidden bg-gray-50 flex items-center justify-center">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={product.product_name}
                                              className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? "scale-110" : ""}`}
                                            />
                                          ) : (
                                            <Icon icon="solar:box-bold" className="text-gray-200 text-2xl" />
                                          )}
                                          {isSelected && (
                                            <div className="absolute top-1 right-1 z-10 bg-[#194E9E] text-white p-0.5 rounded-full shadow-sm">
                                              <Icon icon="solar:check-circle-bold" className="text-[8px]" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="p-1.5 text-center">
                                          <span className={`text-[8px] font-bold leading-tight block truncate ${isSelected ? "text-[#194E9E]" : "text-[#1e293b]"}`}>
                                            {product.product.product_name}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Langkah 2: Pilih Ukuran/Varian */}
                              {item.merch_product_id && availableVariants.length > 0 && (
                                <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-500">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">
                                      Langkah 2: Pilih Ukuran / Varian
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2.5">
                                    {availableVariants.map((variant: any) => {
                                      const isVariantSelected = item.merch_variant_id == variant.id;
                                      return (
                                        <button
                                          key={variant.id}
                                          onClick={() => {
                                            const newForm = [...form];
                                            newForm[index] = {
                                              ...newForm[index],
                                              merch_variant_id: variant.id,
                                              merch_variant_name: variant.varian_name,
                                              merch_price: parseFloat(variant.price) || parseFloat(selectedProduct?.price || "0"),
                                            };
                                            setForm(newForm);
                                          }}
                                          className={`
                                            flex items-center justify-center py-2.5 rounded-[8px] border-2 transition-all duration-300 font-bold text-[11px]
                                            ${isVariantSelected
                                              ? "border-[#194E9E] bg-blue-50 text-[#194E9E] shadow-sm"
                                              : "border-[#e2e8f0] bg-white text-gray-500 hover:border-[#194E9E]/40"}
                                          `}
                                        >
                                          {variant.varian_name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-transparent pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-12 mt-12 gap-x-10 pt-16">
              <div className="col-span-12 mb-8">
                <h1 className="text-[32px] font-bold text-[#0f172a]">Personal Informasi</h1>
              </div>

              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                {form.map((item, index) => {
                  const ticketInfo = getTicketInfoForOwner(index);

                  if (index > 0 && !item.seat_number && ticketInfo.seatNumber) {
                    handleInput(index, "seat_number", ticketInfo.seatNumber);
                  }

                  const selectedProduct = item.merch_product_id ? merchProducts.find((p) => p.id === item.merch_product_id) : null;

                  const availableVariants = selectedProduct ? getMerchVariants(item.merch_product_id!) : [];

                  return (
                    <div className="bg-white rounded-[20px] shadow-smooth-low overflow-hidden" key={index}>
                      <div
                        className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => toggleCollapse(index)}
                      >
                        <div className="flex items-center gap-4">
                          {index > 0 && (
                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                              <Icon icon="solar:ticket-bold" className="text-primary-base text-xl" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[16px] font-bold text-[#0f172a]">
                                {index > 0 ? `${index}. Pemilik Tiket` : "Data Pemesan"}
                              </p>
                              {index > 0 && (
                                <>
                                  <span className="text-[#e3e3e3]">|</span>
                                  <Icon icon="solar:ticket-bold" className="text-primary-base text-sm" />
                                  <span className="text-[14px] font-bold text-[#0f172a]">{ticketInfo.ticketName}</span>
                                  {ticketInfo.seatNumber && <span className="text-xs text-gray-500">(Seat {ticketInfo.seatNumber})</span>}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <FontAwesomeIcon icon={faChevronUp} className={`${collapse[index] ? "rotate-0" : "rotate-180"} transition-transform duration-300 text-xs`} />
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-y border-[#e4e4e7]">
                          <p className="text-sm font-semibold text-[#64748b]">Gunakan Data Pemesan</p>
                          <Switch
                            size="sm"
                            color="primary"
                            classNames={{
                              wrapper: "group-data-[selected=true]:bg-primary-base",
                            }}
                            onChange={(e: any) => (e.target.checked ? copyOrderer(index) : clearForm(index))}
                          />
                        </div>
                      )}

                      <div className={`px-6 pb-6 overflow-hidden transition-all duration-300 ease-in-out ${collapse[index] ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                        <div className="flex flex-col gap-5 pt-2">
                          {/* Bagian Bundling Merchandise - TOP POSITION */}
                          {index > 0 && ticketInfo.isBundlingMerch && (
                            <div className="flex flex-col gap-6 mb-8">
                              {/* Langkah 1: Pilih Merchandise */}
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[11px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">
                                    Langkah 1: Pilih Merchandise
                                  </span>
                                  <p className="text-[12px] font-medium text-[#94a3b8]">
                                    Pilih salah satu merchandise yang termasuk dalam paket bundling.
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                  {merchProducts.map((product) => {
                                    const isSelected = item.merch_product_id == product.id;
                                    const imageUrl = product.product.product_image?.[0]?.image_url;

                                    return (
                                      <div
                                        key={product.id}
                                        onClick={() => {
                                          handleInput(index, "merch_product_id", product.id.toString());
                                          handleInput(index, "merch_product_name", product.product.product_name);
                                        }}
                                        className={`
                                          flex flex-col rounded-[8px] border-2 transition-all duration-300 overflow-hidden relative cursor-pointer group
                                          ${item.merch_product_id == product.id
                                            ? "border-[#194E9E] bg-blue-50 shadow-md scale-[1.02]"
                                            : "border-[#e4e4e7] bg-white hover:border-[#194E9E]/40"}
                                        `}
                                      >
                                        <div className="aspect-square relative overflow-hidden bg-gray-50 flex items-center justify-center">
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={product.product_name}
                                              className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}
                                            />
                                          ) : (
                                            <Icon icon="solar:box-bold" className="text-gray-200 text-4xl" />
                                          )}
                                          {isSelected && (
                                            <div className="absolute top-2 right-2 z-10 bg-[#194E9E] text-white p-1 rounded-full shadow-lg">
                                              <Icon icon="solar:check-circle-bold" className="text-[12px]" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="p-2.5 text-center">
                                          <span className={`text-[11px] font-black leading-tight block truncate ${isSelected ? "text-[#194E9E]" : "text-[#0f172a]"}`}>
                                            {product.product.product_name}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Langkah 2: Pilih Ukuran/Varian */}
                              {item.merch_product_id && availableVariants.length > 0 && (
                                <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-black tracking-[0.2em] text-[#94a3b8] uppercase">
                                      Langkah 2: Pilih Ukuran / Varian
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
                                    {availableVariants.map((variant: any) => {
                                      const isVariantSelected = item.merch_variant_id == variant.id;
                                      return (
                                        <button
                                          key={variant.id}
                                          onClick={() => {
                                            const newForm = [...form];
                                            newForm[index] = {
                                              ...newForm[index],
                                              merch_variant_id: variant.id,
                                              merch_variant_name: variant.varian_name,
                                              merch_price: parseFloat(variant.price) || parseFloat(selectedProduct?.price?.toString() || "0"),
                                            };
                                            setForm(newForm);
                                          }}
                                          className={`
                                            flex items-center justify-center py-2.5 rounded-[8px] border-2 transition-all duration-300 font-bold text-[11px]
                                            ${isVariantSelected
                                              ? "border-[#194E9E] bg-blue-50 text-[#194E9E] shadow-sm"
                                              : "border-[#e4e4e7] bg-white text-gray-500 hover:border-[#194E9E]/40"}
                                          `}
                                        >
                                          {variant.varian_name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="h-[1px] bg-[#e4e4e7] w-full" />
                              <p className="text-[16px] font-bold text-[#0f172a]">Data Pemesan</p>
                            </div>
                          )}

                          {detail.is_noidentity ? (
                            <div className="grid grid-cols-12 gap-3">
                              <div className="col-span-12 md:col-span-4">
                                <InputSelect
                                  label="Identitas"
                                  required
                                  className="text-xs scale-95 origin-left"
                                  onChange={(e) => handleInput(index, "identity_type_id", e.target.value)}
                                  options={[
                                    { key: "1", label: "KTP" },
                                    { key: "2", label: "SIM" },
                                    { key: "3", label: "Kartu Pelajar" },
                                    { key: "4", label: "Passport" },
                                    { key: "5", label: "KTM" },
                                  ]}
                                />
                              </div>
                              <div className="col-span-12 md:col-span-8">
                                <div className="relative">
                                  <InputField
                                    fullWidth
                                    type="number"
                                    label="Nomor Identitas"
                                    placeholder="Contoh : 1234567890123456"
                                    className="text-xs py-1.5"
                                    value={item.nik}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                                      handleInput(index, "nik", value);
                                    }}
                                  />
                                  {fieldErrors[index]?.nik && <p className="text-[10px] mt-1 text-danger font-medium">{fieldErrors[index]?.nik}</p>}
                                  {error.nik && item.nik.length < 16 && !fieldErrors[index]?.nik && <p className="text-[10px] mt-1 text-danger font-medium">Minimal NIK adalah 16 Digit</p>}
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {detail.is_name == 1 && <InputField fullWidth type="text" label="Nama Lengkap" placeholder="Nama Lengkap" className="text-xs py-1.5" value={item.full_name} onChange={(e) => handleInput(index, "full_name", e.target.value)} />}

                          {detail.is_email == 1 && <InputField fullWidth type="text" label="Email" placeholder="Contoh: example@example.com" className="text-xs py-1.5" value={item.email} onChange={(e) => handleInput(index, "email", e.target.value)} />}

                          {detail.is_assistant == 1 && <InputField fullWidth type="text" label="Assistant" placeholder="Nama Assistant" value={item.is_assistant || ""} onChange={(e) => handleInput(index, "is_assistant", e.target.value)} />}
                          {detail.is_gender == 1 && (
                            <Field className="mb-1">
                              <Label className="text-sm font-semibold text-[#64748b] mb-1.5 block">Jenis Kelamin</Label>
                              <select
                                className="block w-full rounded-xl border border-[#e4e4e7] bg-white py-2.5 px-4 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base transition-all"
                                value={item.gender || ""}
                                onChange={(e) => handleInput(index, "gender", e.target.value)}
                              >
                                <option value="">Pilih jenis kelamin</option>
                                <option value="Pria">Pria</option>
                                <option value="Wanita">Wanita</option>
                                <option value="Tidak Memberitahu">Tidak Memberitahu</option>
                              </select>
                            </Field>
                          )}

                          {detail.is_birthdate == 1 && (
                            <Field className="mb-1">
                              <Label className="text-sm font-semibold text-[#64748b] mb-1.5 block">Tanggal Lahir</Label>
                              <Input
                                type="date"
                                className="block w-full rounded-xl border border-[#e4e4e7] bg-white py-2.5 px-4 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base transition-all"
                                value={item.birthdate || ""}
                                onChange={(e) => handleInput(index, "birthdate", e.target.value)}
                              />
                            </Field>
                          )}

                          {detail.is_kelas == 1 && <InputField fullWidth type="text" label="Kelas" placeholder="Contoh: Kelas I" value={item.kelas} onChange={(e) => handleInput(index, "kelas", e.target.value)} />}
                          {detail.is_profession == 1 && (
                            <InputField
                              fullWidth
                              type="text"
                              label="Profesi atau Pekerjaan anda"
                              placeholder="contoh: Promotor, Musisi, IT, Programmer etc"
                              value={item.is_profession}
                              onChange={(e) => handleInput(index, "is_profession", e.target.value)}
                            />
                          )}
                          {detail.is_company == 1 && (
                            <InputField fullWidth type="text" label="Perusahaan Atau Organisasi" placeholder="Nama perusahaan atau organisasi" value={item.is_company} onChange={(e) => handleInput(index, "is_company", e.target.value)} />
                          )}
                          {detail.is_phone_number ? (
                            <Field className="mb-1">
                              <Label className="text-sm font-semibold text-[#64748b] mb-1.5 block">No Telepon</Label>
                              <div className="flex gap-3 items-center">
                                <div className="w-24 flex-shrink-0">
                                  <select
                                    className="w-full bg-white border border-[#e4e4e7] text-[#0f172a] text-xs rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-base block py-1.5 px-3 transition-all outline-none"
                                    value={item.countryCode}
                                    onChange={(e) => handleInput(index, "countryCode", e.target.value)}
                                  >
                                    <option value="+62">+62</option>
                                  </select>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    className={`${fieldErrors[index]?.phone ? "border-danger" : "border-[#e4e4e7]"
                                      } w-full block rounded-xl border bg-white py-1.5 px-4 text-xs text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-base transition-all`}
                                    placeholder="Contoh: 81234567890"
                                    value={displayValues[index] || ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/\D/g, "");
                                      handleInput(index, "no_telp", numericValue);
                                    }}
                                    type="tel"
                                    maxLength={13}
                                  />
                                </div>
                              </div>
                              {fieldErrors[index]?.phone && <p className="text-xs mt-1.5 text-danger font-medium">{fieldErrors[index]?.phone}</p>}
                            </Field>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-10 h-fit">
                {/* Section Creator */}
                {detail?.has_creator && (
                  <div className="bg-white rounded-2xl shadow-smooth-low overflow-hidden">

                    {/* <div className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 border border-[#e4e4e7] flex-shrink-0">
                        {detail.has_creator.image_url ? (
                          <Image src={detail.has_creator.image_url} width={48} height={48} alt="creator" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-base font-bold text-lg">
                            {detail.has_creator.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[15px] font-bold text-[#0f172a] truncate">{detail.has_creator.name}</p>
                          {detail.has_creator.is_verified === 1 && (
                            <Icon icon="solar:verified-check-bold" className="text-blue-500 text-base flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[#64748b] font-medium mt-0.5">Penyelenggara Event</p>
                      </div>
                    </div> */}
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-smooth-low overflow-hidden">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setIsEventCardOpen(!isEventCardOpen)}>
                    <div className="flex items-center gap-4">
                      {detail?.image_url && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={detail.image_url} width={100} height={100} alt="banner" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-[15px] font-bold text-[#0f172a] line-clamp-1">{detail?.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Icon icon="solar:calendar-bold" className="text-[#64748b] text-sm" />
                          <p className="text-xs text-[#64748b] font-medium">
                            {formatDate(detail.start_date) === formatDate(detail.end_date) ? `${formatDate(detail.start_date)}` : `${formatDate(detail.start_date)} - ${formatDate(detail.end_date)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <FontAwesomeIcon icon={faChevronUp} className={`${isEventCardOpen ? "rotate-0" : "rotate-180"} transition-transform duration-300 text-xs`} />
                    </div>
                  </div>
                  <div className={`px-4 pb-4 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isEventCardOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 pb-0"}`}>
                    <div className="pt-4 border-t border-[#e3e3e3] space-y-3">
                      {detail?.description && (
                        <div>
                          <p className="text-xs font-semibold text-[#0f172a] mb-1">Deskripsi</p>
                          <div className="text-[11px] text-[#64748b] leading-relaxed" dangerouslySetInnerHTML={{ __html: detail.description.includes("Event Reuni Mobil") || detail.description.length < 30 ? "Festival mobil klasik Jakarta menghadirkan ratusan koleksi mobil langka dari berbagai era, bursa onderdil antik, dan panggung hiburan menarik. Jangan lewatkan kesempatan langka ini untuk melihat sejarah otomotif dari dekat." : detail.description }} />
                        </div>
                      )}
                      
                      {detail?.location_name && (
                        <div>
                          <p className="text-xs font-semibold text-[#0f172a]">{detail.location_name}</p>
                          {detail.location_address && <p className="text-[11px] text-[#64748b] mt-0.5">{detail.location_address}</p>}
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#0f172a] mb-1.5">Line Up</p>
                            <div className="flex flex-col gap-1.5">
                              <p className="text-[11px] text-[#64748b] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> <span className="font-semibold">MALIQ & D&apos;Essentials</span></p>
                              <p className="text-[11px] text-[#64748b] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> <span className="font-semibold">Feel Koplo</span></p>
                              <p className="text-[11px] text-[#64748b] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> <span className="font-semibold">Perunggu</span></p>
                              <p className="text-[11px] text-[#64748b] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> <span className="font-semibold">Hanif</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-smooth-low p-6">
                  <Stack gap={20}>
                    <Flex gap={10} align="center">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:ticket-sale-bold" className="text-primary-base text-lg" />
                      </div>
                      <Text fw={700} size="md" c="#0f172a">Voucher</Text>
                    </Flex>

                    {voucherFields.map((field, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex gap-2">
                          <TextInput
                            className="flex-1"
                            styles={{
                              input: {
                                borderRadius: '12px',
                                border: '1px solid #e4e4e7',
                                height: '42px',
                              }
                            }}
                            value={field}
                            onChange={(e) => {
                              const newFields = [...voucherFields];
                              newFields[i] = e.currentTarget.value;
                              if (i === voucherFields.length - 1 && e.currentTarget.value.length > 0) {
                                newFields.push("");
                              }
                              setVoucherFields(newFields);
                            }}
                            placeholder={`Masukan Kode Voucher ${i + 1}`}
                          />
                          <Button
                            loading={loadings.includes(`getvoucher-${i}`)}
                            disabled={field.length < 3}
                            onClick={() => handleGetVoucher(i)}
                            className="bg-[#0f172a] hover:bg-[#1e293b] rounded-xl h-[42px] px-6 text-xs font-semibold"
                          >
                            Submit
                          </Button>
                        </div>
                        {vouchers[i] && (
                          <div className="flex items-center justify-between bg-green-50 p-2.5 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2">
                              <Icon icon="solar:check-circle-bold" className="text-green-500 text-lg" />
                              <p className="text-xs font-bold text-green-700">Voucher Berhasil Terpasang</p>
                            </div>
                            <Button variant="subtle" size="compact-xs" color="red" onClick={() => handleCancelVoucher(i)} className="font-bold">
                              Hapus
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}


                  </Stack>
                </div>

                <div className="bg-white rounded-2xl shadow-smooth-low overflow-hidden">
                  <div className="border-b border-[#e4e4e7] p-5 bg-gray-50/50">
                    <p className="text-[16px] font-bold text-[#0f172a]">Ringkasan Pesanan</p>
                  </div>

                  <div className="divide-y divide-[#e4e4e7]">
                    {ticket.map((item: FormTicket) => {
                      const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);

                      let displayQty = item.qty_ticket;
                      let packageCount = 1;

                      if (isBundling && bundlingQty >= 2 && bundlingQty <= 99) {
                        packageCount = Math.floor(item.qty_ticket / bundlingQty);
                        displayQty = packageCount;
                      }

                      const bundlingInfo = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? ` (paket ${bundlingQty} orang)` : "";
                      const displaySubtotal = isBundling && bundlingQty >= 2 && bundlingQty <= 99 ? item.price * packageCount : item.price * item.qty_ticket;

                      return (
                        <div className="p-5 flex gap-4" key={item.event_ticket_id}>
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-[#e4e4e7] flex-shrink-0">
                            <Icon icon="solar:ticket-bold" className="text-primary-base text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#0f172a] leading-snug">
                              {item.name}
                              {bundlingInfo}
                            </p>
                            <div className="flex justify-between items-end mt-1">
                              <p className="text-xs text-[#64748b] font-medium">
                                {displayQty} {displayQty === 1 ? "Paket" : "Paket"} x {item.price.toLocaleString("id-ID")}
                                {isBundling && bundlingQty >= 2 && bundlingQty <= 99 && <span className="text-[10px] text-gray-400 block font-normal">({item.qty_ticket} tiket fisik)</span>}
                              </p>
                              <p className="text-sm font-bold text-[#0f172a]">Rp {displaySubtotal.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-5 bg-gray-50/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-[#64748b]">
                        {`Jumlah (${displayTotalCount} ${ticket.some((item) => {
                          const { isBundling, bundlingQty } = getBundlingInfo(item.event_ticket_id);
                          return isBundling && bundlingQty >= 2 && bundlingQty <= 99;
                        })
                          ? "Paket"
                          : "Tiket"
                          })`}
                      </p>
                      <p className="text-sm font-bold text-[#0f172a]">{displayTotalSubtotalPrice > 0 ? <NumberFormatter value={displayTotalSubtotalPrice} /> : <Text>Free</Text>}</p>
                    </div>

                    {vouchers.length > 0 && (
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-[#64748b]">Total Voucher</p>
                        <p className="text-sm font-bold text-green-600">
                          -<NumberFormatter value={vouchers.reduce((sum, voucher) => sum + (voucher.amount || 0), 0)} />
                        </p>
                      </div>
                    )}

                    {(() => {
                      const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
                      const subtotalAfterVoucher = Math.max(displayTotalSubtotalPrice - totalVoucher, 0);

                      return (
                        <div className="flex justify-between items-center border-t border-[#e4e4e7] pt-3">
                          <p className="text-xs font-semibold text-[#64748b]">Subtotal</p>
                          <p className="text-sm font-bold text-[#0f172a]">
                            <NumberFormatter value={subtotalAfterVoucher} />
                          </p>
                        </div>
                      );
                    })()}

                    {detail?.is_insurance === 1 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-[#64748b]">Asuransi</p>
                          <button onClick={() => setInsuranceModalOpen(true)} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold hover:bg-blue-100">Detail</button>
                        </div>
                        <p className="text-sm font-bold text-[#0f172a]">
                          {insuranceChecked ? `Rp ${calculateInsuranceTotal().toLocaleString("id-ID")}` : "Rp 0"}
                        </p>
                      </div>
                    )}

                    {detail?.ppn !== undefined && (() => {
                      const totalVoucher = vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0);
                      const subtotalAfterVoucher = Math.max(displayTotalSubtotalPrice - totalVoucher, 0);
                      const { tax, label, ppnType } = computeTax(detail, subtotalAfterVoucher);
                      if (tax > 0) {
                        return (
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-semibold text-[#64748b]">{ppnType === "nominal" ? `Tax ${label}` : `Tax (${label})`}</p>
                            <p className="text-sm font-bold text-[#0f172a]"><NumberFormatter value={tax} /></p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {adminFee > 0 && (
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-[#64748b]">Biaya Admin</p>
                        <p className="text-sm font-bold text-[#0f172a]"><NumberFormatter value={adminFee} /></p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#e4e4e7]">
                      <div className="flex justify-between items-center">
                        <p className="text-[15px] font-bold text-[#0f172a]">Total Pembayaran</p>
                        <p className="text-xl font-black text-primary-base">
                          {(() => {
                            const grandTotal = calculateGrandTotal();
                            return grandTotal > 0 ? <NumberFormatter value={grandTotal} /> : "Free";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {detail && detail.has_event_payment_method.length > 1 ? (
                  <div className="bg-white rounded-2xl shadow-smooth-low overflow-hidden">
                    <div className="p-5 border-b border-[#e4e4e7]">
                      <p className="text-[16px] font-bold text-[#0f172a]">Metode Pembayaran</p>
                    </div>

                    <div className="p-2 text-xs">
                      <Accordion variant="splitted" itemClasses={classAcc}>
                        {detail.has_event_payment_method
                          .filter((e) => e.payment_method_id != 5)
                          .map((el: any) => (
                            <AccordionItem key={el.has_payment_method_id} aria-label="Anchor" indicator={<FontAwesomeIcon icon={faChevronCircleLeft} className="px-2 text-lg" />} title={el.has_payment_method.payment_name}>
                              {el.has_payment_method.id === 3 && el.has_payment_method.has_payment_link && el.has_payment_method.has_payment_link.length > 0 ? (
                                <RadioGroup
                                  color="primary"
                                  name="bank-code"
                                  onChange={(e) => {
                                    setPayment("3");
                                    handlePaymentChange(e.target.value, "bank");
                                  }}
                                >
                                  {el.has_payment_method.has_payment_link[0].has_payment_channel.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-2">
                                      <div className="flex items-center gap-3">
                                        <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
                                        <p className="text-sm font-medium">{item.payment_channel}</p>
                                      </div>
                                      <Radio value={item.payment_channel} />
                                    </div>
                                  ))}
                                </RadioGroup>
                              ) : (
                                <RadioGroup color="primary" name="payment-method" onChange={(e) => handlePaymentChange(e.target.value, "payment")}>
                                  <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                      <Images type="logo" path={el.has_payment_method.logo} alt={el.has_payment_method.payment_name} className="w-8 h-8 object-contain" />
                                      <p className="text-sm">{el.has_payment_method.payment_name}</p>
                                    </div>
                                    <Radio value={el.has_payment_method.id.toString()} />
                                  </div>
                                </RadioGroup>
                              )}
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}

      {/* Modal Preview Produk */}
      <Modal
        opened={productPreviewModalOpen}
        onClose={closeProductImageModal}
        size="lg"
        centered
        title={
          <div className="flex items-center gap-2">
            <Icon icon="mdi:image-search" className="text-primary" />
            <span>Detail Produk</span>
          </div>
        }
        padding="lg"
      >
        {selectedProductForPreview && (
          <div className="space-y-6">
            {/* Gambar Produk */}
            <div className="relative">
              {selectedProductImage && selectedProductImage !== "" ? (
                <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gray-100">
                  <Image src={selectedProductImage} alt={selectedProductForPreview.product_name} width={800} height={600} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-full h-64 md:h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                  <Icon icon="mdi:tshirt-crew" className="text-gray-400 text-8xl mb-4" />
                  <p className="text-gray-500">Tidak ada gambar tersedia</p>
                </div>
              )}
            </div>

            {/* Informasi Produk */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProductForPreview.product_name}</h3>

                <div className="flex items-center gap-4 mb-3">
                  <Badge color="blue" variant="light" size="lg">
                    Bundling
                  </Badge>
                  {selectedProductForPreview.average_star && (
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:star" className="text-yellow-500" />
                      <span className="text-sm font-medium">{selectedProductForPreview.average_star}</span>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Harga */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Harga</h4>
                {selectedProductForPreview.event_merch_data?.varians?.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 line-through">Rp {parseFloat(selectedProductForPreview.price).toLocaleString("id-ID")}</span>
                      <span className="text-sm text-gray-500">(Harga akan menyesuaikan variant)</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">Rp {parseFloat(selectedProductForPreview.price).toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>

              {/* Variant yang tersedia */}
              {selectedProductForPreview.event_merch_data?.varians?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Variant Tersedia</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProductForPreview.event_merch_data.varians.map((variant: any) => (
                      <div key={variant.id} className={`border rounded-lg p-3 ${variant.stock_qty > 0 ? "border-gray-200" : "border-red-200 bg-red-50"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{variant.varian_name}</p>
                            <p className="text-sm font-bold text-primary mt-1 line-through">Rp {parseFloat(variant.price).toLocaleString("id-ID")}</p>
                          </div>
                          {variant.stock_qty > 0 ? (
                            <Badge color="green" variant="light" size="sm">
                              Stok: {variant.stock_qty}
                            </Badge>
                          ) : (
                            <Badge color="red" variant="light" size="sm">
                              Habis
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informasi tambahan */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Icon icon="mdi:sale" className="text-2xl text-green-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">Terjual</p>
                  <p className="text-sm font-bold">{selectedProductForPreview.total_sold || 0}</p>
                </div>
                <div className="text-center">
                  <Icon icon="mdi:star-circle" className="text-2xl text-yellow-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">Rating</p>
                  <p className="text-sm font-bold">{selectedProductForPreview.average_star || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <Button fullWidth onClick={closeProductImageModal} variant="light" color="gray">
            Tutup Preview
          </Button>
        </div>
      </Modal>

      <ModalPaymentDataConfirmation isOpen={isOpen} setIsOpen={setIsOpen} onConfirm={submitForm} loading={loading} data={form[0]} />
    </>
  ) : (
    step === 3 && transactionData && (
      <div className="bg-primary-light max-w-xl mx-auto py-8 px-4">
        {detail?.image_url && <Image src={detail.image_url} width={1000} height={1000} alt="banner" className="w-full h-auto rounded-md object-cover mb-6" />}
        <div className="bg-white rounded-md overflow-hidden shadow-sm">
          <div className="border-b-2 p-3 border-primary-light">
            <Countdown date={targetDate} intervalDelay={0} precision={3} renderer={renderer} autoStart={true} />
          </div>

          <div className="p-4">
            <div className="border-b-2 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <p className="font-semibold">{xenditInvoice ? xenditInvoice.bank_code : "BCA"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border p-3 rounded-sm">
                <p className="text-xs text-grey mb-1">Kode Invoice</p>
                <p className="text-sm mb-1">{transactionData.invoice_no}</p>

                {xenditInvoice ? (
                  <>
                    <p className="text-xs text-grey mb-1 mt-3">No. Virtual Account</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{xenditInvoice.bank_account_number}</p>
                      <button onClick={handleCopy} className="hover:bg-primary-light-200 p-1 rounded-md">
                        <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-grey mb-1 mt-3">No. Rekening</p>
                    <p className="text-sm mb-1">{paymentMethod?.account_no}</p>
                    <p className="text-xs mb-1">Atas Nama {paymentMethod?.account_name}</p>
                  </>
                )}

                <div className="mt-3">
                  <p className="text-xs text-grey mb-1">Total Pembayaran</p>
                  <p className="text-sm mb-1">
                    {xenditInvoice
                      ? `Rp${xenditInvoice.transfer_amount.toLocaleString("id-ID")}`
                      : `Rp${(transactionData.grandtotal + detail?.insurance_amount - vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0)).toLocaleString("id-ID")}`}
                  </p>
                </div>
              </div>

              <div className="border p-3 rounded-sm">
                <div className="flex justify-between">
                  <p className="text-xs text-grey">Regular Ticket {`x(${transactionData.total_qty})`}</p>
                  <p className="text-xs">{transactionData.total_price ? <NumberFormatter value={transactionData.total_price} /> : <Text>Free</Text>}</p>
                </div>

                {vouchers.length > 0 && (
                  <div className="py-3 px-0 flex justify-between items-center">
                    <p>Voucher</p>
                    <p className="font-semibold">
                      -<NumberFormatter value={vouchers.reduce((sum, voucher) => sum + (voucher.amount || 0), 0)} />
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-xs text-grey">Pajak</p>
                  <p className="text-xs">{transactionData.ppn ? <NumberFormatter value={transactionData.ppn} /> : <Text>Free</Text>}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-grey">Biaya Admin</p>
                  <p className="text-xs">{transactionData.admin_fee ? <NumberFormatter value={transactionData.admin_fee} /> : <Text>Free</Text>}</p>
                </div>

                <div className="border-t-2 border-primary-light mt-4 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <p>Total Pembayaran</p>
                    <p>{`Rp${(transactionData.grandtotal - vouchers.reduce((sum, v) => sum + (v?.amount || 0), 0)).toLocaleString("id-ID")}`}</p>
                  </div>

                  <div className="mt-4">
                    {xenditInvoice ? (
                      <Link href={`/success/${transactionData.invoice_no}`} target="_blank" className="block">
                        <button className="w-full bg-primary-dark text-white py-2 rounded-lg">{loading ? <Spinner color="default" size="sm" /> : "Cek Status Pembayaran"}</button>
                      </Link>
                    ) : (
                      <button className="w-full bg-primary-dark text-white py-2 rounded-lg" onClick={() => handleShowModal()}>
                        {loading ? <Spinner color="default" size="sm" /> : "Upload Bukti Pembayaran"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalTransaction id={transactionData.id} invoice={transactionData.invoice_no} isOpen={showModalTransaction} setIsOpen={setShowModalTransaction} />
      </div>
    )
  );
};

export default FirstStepUnlogged;
