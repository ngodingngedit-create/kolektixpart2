"use client";

import React, { useState } from "react";
import useWindowSize from "@/utils/useWindowSize";
import { EventProps, PaymentMethod } from "@/utils/globalInterface";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionItem, RadioGroup, Radio, Spinner, Card, Divider, Button } from "@nextui-org/react";
import { faTicket, faChevronLeft, faShieldAlt, faCreditCard, faMobileAlt, faQrcode, faStore, faHistory } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/useFormattedDate";
import { Icon } from "@iconify/react/dist/iconify.js";

interface FormTicket {
  event_id: number;
  event_ticket_id: number;
  name: string;
  price: number;
  subtotal_price: number;
  qty_ticket: number;
  payment_status: string;
}

interface StepPaymentProps {
  detail: EventProps;
  ticket: FormTicket[];
  totalCount: number;
  onSubmit: () => void;
  totalSubtotalPrice: number;
  paymentList: PaymentMethod[];
  payment: string;
  setPayment: (payment: string) => void;
  bank: string;
  setBank: (bank: string) => void;
  loading: boolean;
  voucher?: any;
  onBack: () => void;
}

const CheckoutPage = ({
  detail,
  ticket,
  totalCount,
  onSubmit,
  totalSubtotalPrice,
  paymentList,
  bank,
  setBank,
  payment,
  setPayment,
  loading,
  voucher,
  onBack,
}: StepPaymentProps) => {
  const { width } = useWindowSize();
  const isMobile = width ? width < 1024 : false;

  const adminFee = (detail.admin_fee || 7000) * totalCount;
  const ppn = detail.ppn || 0;
  const totalVoucher = voucher ? (Array.isArray(voucher) ? voucher.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) : (voucher.amount || 0)) : 0;
  const grandTotal = totalSubtotalPrice + adminFee + ppn - totalVoucher;

  const paymentGroups = [
    {
      title: "Virtual Account",
      icon: <Icon icon="solar:bank-bold-duotone" className="text-xl" />,
      folder: "TFBANK",
      items: [
        { id: "bca", name: "BCA Virtual Account", logo: "bca.png" },
        { id: "mandiri", name: "Mandiri Virtual Account", logo: "mandiri.png" },
        { id: "bni", name: "BNI Virtual Account", logo: "bni.png" },
        { id: "bri", name: "BRI Virtual Account", logo: "bri.png" },
        { id: "permata", name: "Permata Virtual Account", logo: "permata.png" },
        { id: "bsi", name: "BSI Virtual Account", logo: "bsi.png" },
        { id: "bjb", name: "BJB Virtual Account", logo: "bjb.png" },
        { id: "cimb", name: "CIMB Virtual Account", logo: "cimb.png" },
      ],
    },
    {
      title: "E-Wallet",
      icon: <Icon icon="solar:wallet-money-bold-duotone" className="text-xl" />,
      folder: "Ewallets",
      items: [
        { id: "dana", name: "DANA", logo: "dana.png" },
        { id: "ovo", name: "OVO", logo: "ovo.png" },
        { id: "shopeepay", name: "ShopeePay", logo: "shopeepay.png" },
        { id: "linkaja", name: "LinkAja", logo: "linkaja.png" },
        { id: "astrapay", name: "AstraPay", logo: "astrapay.png" },
      ],
    },
    {
      title: "QRIS",
      icon: <Icon icon="solar:qr-code-bold-duotone" className="text-xl" />,
      folder: "qris",
      items: [{ id: "qris", name: "QRIS", logo: "qris.jpg" }],
    },
    {
      title: "Retail Outlets",
      icon: <Icon icon="solar:shop-bold-duotone" className="text-xl" />,
      folder: "retail",
      items: [
        { id: "alfamart", name: "Alfamart", logo: "alfamart.jpg" },
        { id: "indomaret", name: "Indomaret", logo: "indomaret.jpg" },
      ],
    },
    {
      title: "Credit / Debit Card",
      icon: <Icon icon="solar:card-bold-duotone" className="text-xl" />,
      folder: "CARDCREDIT",
      items: [
        { id: "visa", name: "Visa", logo: "VISA.webp" },
        { id: "mastercard", name: "Mastercard", logo: "mastercard.png" },
        { id: "jcb", name: "JCB", logo: "jcb.png" },
        { id: "amex", name: "American Express", logo: "americanexpress.png" },
      ],
    },
    {
      title: "Paylater",
      icon: <Icon icon="solar:history-bold-duotone" className="text-xl" />,
      folder: "paylater",
      items: [
        { id: "kredivo", name: "Kredivo", logo: "kredivo.webp" },
        { id: "akulaku", name: "Akulaku", logo: "logoakulaku.png" },
        { id: "indodana", name: "Indodana", logo: "indodana.png" },
        { id: "atome", name: "Atome", logo: "atome.png" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      {/* Header Sticky for Mobile */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 lg:hidden">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        <div className="hidden lg:flex items-center gap-4 mb-10">
          <button onClick={onBack} className="group w-12 h-12 flex items-center justify-center bg-white hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm border border-gray-100">
            <FontAwesomeIcon icon={faChevronLeft} className="transition-transform group-hover:-translate-x-1" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pembayaran</h1>
            <p className="text-gray-500 font-medium">Selesaikan pesanan Anda dengan aman</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Payment Methods */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon icon="solar:card-transfer-bold-duotone" className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                  <p className="text-sm text-gray-500 font-medium">Pilih salah satu metode di bawah ini</p>
                </div>
              </div>

              <Accordion 
                variant="light" 
                className="px-0 gap-4" 
                selectionMode="single" 
                defaultExpandedKeys={["0"]}
                itemClasses={{
                  base: "border border-gray-100 rounded-2xl overflow-hidden mb-4 transition-all hover:border-primary/30",
                  title: "font-bold text-gray-800",
                  trigger: "px-6 py-4 hover:bg-gray-50/50",
                  content: "px-6 pb-6",
                }}
              >
                {paymentGroups.map((group, index) => (
                  <AccordionItem
                    key={index}
                    aria-label={group.title}
                    title={
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 group-data-[open=true]:bg-primary group-data-[open=true]:text-white transition-colors">
                          {group.icon}
                        </div>
                        <span className="font-bold">{group.title}</span>
                      </div>
                    }
                  >
                    <RadioGroup
                      value={payment === group.folder ? bank : ""}
                      onValueChange={(val) => {
                        setPayment("4"); // Defaulting to Xendit
                        setBank(val);
                      }}
                      className="gap-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${bank === item.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-gray-50 bg-white hover:border-gray-200"}`}
                            onClick={() => {
                              setPayment("4");
                              setBank(item.id);
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-10 relative flex items-center justify-center bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                                <Image
                                  src={`/paymentmethod/${group.folder}/${item.logo}`}
                                  alt={item.name}
                                  width={48}
                                  height={32}
                                  className="object-contain max-h-full"
                                />
                              </div>
                              <span className={`text-sm font-bold ${bank === item.id ? "text-primary" : "text-gray-700"}`}>{item.name}</span>
                            </div>
                            <Radio value={item.id} color="primary" />
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Right Side: Summary (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Order Summary Card */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center justify-between">
                <span>Ringkasan Pesanan</span>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400">{totalCount}</span>
              </h2>

              <div className="space-y-6">
                {/* Event Tiny Info */}
                <div className="flex gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  {detail.image_url && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <Image src={detail.image_url} alt="event" width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{detail.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] font-bold mt-1 uppercase tracking-wider">
                      <Icon icon="solar:calendar-bold" className="text-primary" />
                      <span>{formatDate(detail.start_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {ticket.map((item, idx) => (
                    <div key={idx} className="group flex justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon icon="solar:ticket-bold-duotone" className="text-lg" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-sm font-black text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] font-bold text-gray-400">{item.qty_ticket} Tiket x Rp {item.price.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-gray-900 self-center">
                        Rp {(item.price * item.qty_ticket).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 w-full" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-900">Rp {totalSubtotalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  {totalVoucher > 0 && (
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-400">Potongan Voucher</span>
                      <span className="text-red-500">- Rp {totalVoucher.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Biaya Admin</span>
                    <span className="text-gray-900">Rp {adminFee.toLocaleString("id-ID")}</span>
                  </div>
                  {ppn > 0 && (
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-400">Pajak (PPN)</span>
                      <span className="text-gray-900">Rp {ppn.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 p-5 rounded-[24px] border border-primary/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Total Pembayaran</span>
                    <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-md uppercase">Secure</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-primary tracking-tighter">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl shadow-[0_15px_30px_rgba(25,78,158,0.25)] hover:shadow-[0_15px_40px_rgba(25,78,158,0.35)] transition-all active:scale-[0.98]"
                  disabled={!bank || loading}
                  onClick={onSubmit}
                  isLoading={loading}
                  spinner={<Spinner color="white" size="sm" />}
                >
                  Bayar Sekarang
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Icon icon="solar:shield-check-bold" className="text-green-500 text-sm" />
                  Pembayaran Terenkripsi & Aman
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
