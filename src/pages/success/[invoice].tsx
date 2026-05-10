import { Icon } from "@iconify/react/dist/iconify.js";
import { Alert, AspectRatio, Box, Button, Card, Container, Divider, Flex, Image, NumberFormatter, ScrollArea, SimpleGrid, Stack, Table, Text, Title, Badge, Group, Paper, Grid } from "@mantine/core";
import _ from "lodash";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import fetch from "@/utils/fetch";
import { useListState } from "@mantine/hooks";
import { useRouter } from "next/router";
import moment from "moment";
import { TransactionProps } from "@/utils/globalInterface";
import { formatDate, formatYear } from "@/utils/useFormattedDate";
import { TransactionStatusResponse } from "../dashboard/my-event/type";
import config from "@/Config";
import { modals } from "@mantine/modals";
import QrCode from "@/components/QrCode";
import Logo from "@images/logo.png";

export default function Invoice() {
  const [data, setData] = useState<TransactionProps>();
  const [loading, setLoading] = useListState<string>();
  const router = useRouter();
  const { invoice } = router.query;
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusResponse[]>();

  const getData = async () => {
    if (!invoice) return;

    if (invoice === "SAMPLE-INV") {
      const mockData: TransactionProps = {
        id: 1,
        invoice_no: "KL-1749624050YGBAHJ7",
        created_at: moment("2025-06-11 13:40").toISOString(),
        total_qty: 2,
        total_price: 500000,
        grandtotal: 510000,
        transaction_status_id: 1,
        payment_method: {
          id: 1,
          payment_name: "Virtual Account BCA",
          logo: "",
          payment_type_id: 1,
          account_no: "123456789",
          account_name: "KOLEKTIX",
          account_branch: "Jakarta",
          description: null,
          has_payment_link: [],
          type: null,
          created_by: null,
          updated_by: null,
          created_at: null,
          updated_at: null,
          deleted_at: null
        },
        has_event: {
          id: 1,
          name: "Konser Harmoni Alam 2024",
          image_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60",
          start_date: moment("2026-05-11").toISOString(),
          location_name: "Gelora Bung Karno",
          location_address: "Jl. Pintu Satu Senayan, Jakarta Pusat",
          starting_price: 150000,
          creator_id: "1",
          category_id: "1",
          slug: "konser-harmoni-alam-2024",
          image: null,
          image_thumbnail: null,
          end_date: moment().add(7, 'days').toISOString(),
          start_time: "19:00",
          end_time: "22:00",
          zone_time: "WIB",
          location_city: "Jakarta",
          location_map: "",
          activity_status: "active",
          admin_fee: 10000,
          ppn: 0,
          ppn_type: "exclude",
          max_buy_ticket: 5,
          one_email_ticket: "1",
          one_id_one_ticket: "1",
          description: "Nikmati konser musik alam terbuka yang spektakuler.",
          term_condition: "1. Tiket tidak dapat dipindahtangankan.<br/>2. Dilarang membawa senjata tajam.<br/>3. Wajib membawa e-TTP asli.",
          save_as_draft: "0",
          event_status_id: 1,
          has_creator: { id: 1, name: "Kolektix Organizer", image: "", user_id: "1", category_id: "1", status: "active", created_by: "1", updated_by: null, created_at: new Date(), updated_at: new Date(), deleted_at: null, verified: new Date(), email: "org@kolektix.com", phone_number: "08123456789", location: "Jakarta", longitude: "", latitude: "", website: "", description: null, event_coordinator_name: "", event_cordinator_phone: "" },
          has_event_status: { id: 1, name: "Active", description: "", created_by: "1", updated_by: null, created_at: null, updated_at: null, deleted_at: null, status: "active" },
          has_event_payment_method: [],
          has_event_social_meida: { id: 1, event_id: 1, status: "active", website: "", facebook: "", twitter: "", instagram: "", youtube: "", tiktok: "", ig_name: "", created_by: "1", updated_by: null, created_at: null, updated_at: null, deleted_at: null },
          upcoming: 0,
          created_by: "1",
          updated_by: "1",
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          is_birthdate: 0,
          is_email: 1,
          is_gender: 0,
          is_name: 1,
          is_profession: 0,
          is_company: 0,
          is_noidentity: 0,
          is_phone_number: 1,
          is_kelas: 0,
          is_assistant: 0,
          is_insurance: 0,
          insurance_required: 0,
          insurance_amount: 0,
          grand_total: 0,
          transaction_saldo_by_event: { event_id: 1, event_slug: "slug", creator_id: 1, creator_name: "name", total_saldo_event: "0" }
        },
        identities: [
          { id: 1, transaction_id: "1", nik: "1234567890", full_name: "Budi Santoso", email: "budi.santoso@example.com", no_telp: "081234567890", created_at: new Date(), updated_at: new Date(), deleted_at: null, is_pemesan: 1, countryCode: 62 }
        ],
        tickets: [
          { 
            id: 1, 
            transaction_id: "1", 
            event_id: "1", 
            event_ticket_id: "1", 
            price: 250000, 
            subtotal_price: 500000, 
            qty_ticket: 2, 
            payment_status: "PAID", 
            has_event_ticket: { id: 1, name: "VIP Festival", price: 250000, qty: 2, description: "", event_id: "1", ticket_date: "", ticket_end: "", is_fullbook: 0, is_soldout: 0, is_finish: 0, is_ready: 1, is_promo: 0, is_bundling: 0, bundling_qty: 0, promo_title: "", promo_price: 0, created_by: null, updated_by: null, created_at: null, updated_at: null, deleted_at: null, has_event: {} as any, is_bundling_merch: 0, is_ots: 0, start_date: "", event_schedule_date: "" },
            created_by: null, updated_by: null, created_at: new Date(), updated_at: new Date(), deleted_at: null, code: "TIX-12345"
          }
        ],
        transaction_merches: [
          { id: 1, transaction_id: 1, event_merch_id: 1, product_variant_id: 1, qty: 1, price: 50000, subtotal: 50000, noted: "Kaos Event Limited Edition" }
        ],
        date: moment().toISOString(),
        user_id: 1,
        event_id: "1",
        payment_status: "PAID",
        updated_at: moment().toISOString(),
        ppn: 0,
        voucher_code: "",
        voucher_amount: 0,
        admin_fee: 10000,
        xendit_url: "",
        has_user: {} as any,
        countryCode: 62,
        no_telp: 8123456789,
        has_transaction_status: {
          id: 1,
          name: "PAID",
          description: "Pembayaran Berhasil",
          bgcolor: "green",
          created_by: null,
          updated_by: null,
          created_at: moment().toISOString(),
          updated_at: moment().toISOString(),
          deleted_at: null
        },
        has_transaction_voucher: [],
        insurance_amount: 0,
        is_insurance: 0,
        insurance_required: 0
      };
      setData(mockData);
      setTransactionStatus([{ id: 1, name: "PAID", description: "", bgcolor: "green" }]);
      return;
    }

    try {
      await fetch<any, TransactionProps>({
        url: `transaction-finish?external_id=${invoice}`,
        method: "GET",
        data: {},
        before: () => setLoading.append("getdata"),
        success: ({ data }) => {
          if (data) setData(data);
        },
        complete: () => setLoading.filter((e) => e !== "getdata"),
        error: () => {
          modals.open({
            centered: true,
            closeOnClickOutside: false,
            withCloseButton: false,
            children: (
              <Stack gap={10}>
                <Text ta="center">Data tidak ditemukan</Text>
                <Button onClick={() => { modals.closeAll(); router.push("/"); }}>Ke Halaman Utama</Button>
              </Stack>
            ),
          });
        },
      });

      await fetch<any, any>({
        url: "transaction-statuses",
        method: "GET",
        success: (_data) => {
          const data = _data as TransactionStatusResponse[];
          if (data?.length > 0) setTransactionStatus(data);
        },
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, [invoice]);

  const transStatus = useMemo(() => {
    return transactionStatus ? transactionStatus.find((e) => e.id == data?.transaction_status_id) : null;
  }, [data, transactionStatus]);

  const isPaid = transStatus?.name === "PAID";

  const cardShadowStyle = { boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: 'none' };
  const borderLineColor = 'rgb(227, 227, 227)';

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-6 px-4 md:py-10 font-inter">
      <Container size="md" p={0} className="max-w-[850px]">
        <Paper shadow="none" radius={0} bg="white" className="overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 md:px-10 flex justify-start items-center">
            <Image src={Logo.src} alt="Kolektix Logo" w={150} />
          </div>

          {/* Blue Invoice Header Section */}
          <div className="mx-6 md:mx-10 bg-[#002D84] rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-center text-white">
            <Flex align="center" gap="lg">
              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <Icon icon="solar:bill-list-bold" className="text-3xl" />
              </div>
              <Stack gap={2}>
                <Title order={3} className="uppercase tracking-wide font-bold" style={{ fontSize: '20px' }}>Invoice Pesanan</Title>
                <Text size="xs" className="opacity-80 font-medium tracking-widest">{invoice || "KL-1749624050YGBAHJ7"}</Text>
              </Stack>
            </Flex>
            
            <div className="mt-4 md:mt-0 bg-white rounded-md px-6 py-2.5 flex items-center gap-3 shadow-sm">
              <Text size="xs" className="text-black font-normal">Status Pembayaran :</Text>
              <Flex align="center" gap={4}>
                <Icon icon="solar:check-circle-bold" className="text-green-500 text-lg" />
                <Text size="xs" className="text-green-500 font-normal uppercase">PAID</Text>
              </Flex>
            </div>
          </div>

          {/* Event Banner */}
          <div className="px-6 md:px-10 mt-8">
            <div className="rounded-xl overflow-hidden">
              <Image 
                src={data?.has_event?.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=60"} 
                alt="Event Banner" 
                className="w-full h-[320px] object-cover"
              />
            </div>
          </div>

          {/* 3 Column Information Grid */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" className="px-6 md:px-10 mt-10">
             {/* Card Pemesan */}
             <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
                <Title order={6} className="text-[#002D84] font-bold mb-8" style={{ fontSize: '11px' }}>Informasi Pemesan</Title>
                <Stack gap="xl">
                  <Flex gap="md" align="center">
                    <div className="bg-blue-50 p-2 rounded-full"><Icon icon="solar:user-bold" className="text-[#002D84] text-md" /></div>
                    <Stack gap={1}>
                      <Text size="10px" c="gray.5" fw={500}>Nama Pemesan</Text>
                      <Text fw={600} size="xs" className="text-gray-900">{data?.identities.find(e => e.is_pemesan === 1)?.full_name || "Budi Santoso"}</Text>
                    </Stack>
                  </Flex>
                  <Flex gap="md" align="center">
                    <div className="bg-blue-50 p-2 rounded-full"><Icon icon="solar:letter-bold" className="text-[#002D84] text-md" /></div>
                    <Stack gap={1}>
                      <Text size="10px" c="gray.5" fw={500}>Email Pemesan</Text>
                      <Text fw={600} size="xs" className="text-gray-900 break-all">{data?.identities.find(e => e.is_pemesan === 1)?.email || "budi.santoso@example.com"}</Text>
                    </Stack>
                  </Flex>
                  <Flex gap="md" align="center">
                    <div className="bg-blue-50 p-2 rounded-full"><Icon icon="solar:calendar-bold" className="text-[#002D84] text-md" /></div>
                    <Stack gap={1}>
                      <Text size="10px" c="gray.5" fw={500}>Tanggal Pemesanan</Text>
                      <Text fw={600} size="xs" className="text-gray-900">{data?.created_at ? moment(data.created_at).format("DD MMM YYYY HH:mm") : "11 June 2025 13:40"} WIB</Text>
                    </Stack>
                  </Flex>
                </Stack>
             </Card>

             {/* Card Tiket */}
             <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
                <Title order={6} className="text-[#002D84] font-bold mb-8" style={{ fontSize: '11px' }}>Informasi Tiket</Title>
                <Stack gap="lg">
                  {data?.tickets.map((t, i) => (
                    <Flex key={i} gap="md" align="center">
                      <div className="bg-blue-50 p-2 rounded-lg"><Icon icon="solar:ticket-bold" className="text-[#002D84] text-lg" /></div>
                      <Stack gap={1}>
                        <Text fw={600} size="xs" className="text-gray-900">{t.has_event_ticket.name}</Text>
                        <Text size="10px" c="gray.5" fw={500}>{t.qty_ticket} Tiket × <NumberFormatter value={t.has_event_ticket.price} prefix="Rp " /></Text>
                      </Stack>
                    </Flex>
                  ))}
                </Stack>
             </Card>

             {/* Card Merchandise */}
             <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
                <Title order={6} className="text-[#002D84] font-bold mb-8" style={{ fontSize: '11px' }}>Informasi Merchandise</Title>
                <Stack gap="lg">
                  {data?.transaction_merches && data.transaction_merches.length > 0 ? (
                    data.transaction_merches.map((m, i) => (
                      <Flex key={i} gap="md" align="center">
                        <div className="bg-blue-50 p-2 rounded-full"><Icon icon="solar:box-bold" className="text-[#002D84] text-lg" /></div>
                        <Stack gap={1}>
                          <Text fw={600} size="xs" className="text-gray-900">{m.noted || "Kaos Event Limited Edition"}</Text>
                          <Text size="10px" c="gray.5" fw={500}>{m.qty} Item × <NumberFormatter value={m.price} prefix="Rp " /></Text>
                        </Stack>
                      </Flex>
                    ))
                  ) : (
                    <Flex gap="md" align="center" className="opacity-20 h-full justify-center">
                       <Text size="xs" fs="italic">Tidak ada merchandise</Text>
                    </Flex>
                  )}
                </Stack>
             </Card>
          </SimpleGrid>

          {/* Details & Summary 2 Columns */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" className="px-6 md:px-10 mt-8 mb-10">
            {/* Detail Pemesanan Card */}
            <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
              <Title order={6} className="text-[#002D84] font-bold mb-6" style={{ fontSize: '11px' }}>Detail Pemesanan</Title>
              <div className="space-y-0">
                {[
                  { icon: "solar:bill-list-bold", label: "Nomor Tiket", value: data?.invoice_no || "KL-1749624050YGBAHJ7", mono: true },
                  { icon: "solar:flag-bold", label: "Event Type", value: data?.has_event?.starting_price === 0 ? "Free Event" : "Paid Event" },
                  { icon: "solar:map-point-bold", label: "Location", value: data?.has_event?.location_name || "Gelora Bung Karno" },
                  { icon: "solar:calendar-date-bold", label: "Event Date", value: data?.has_event?.start_date ? moment(data.has_event.start_date).format("DD MMMM YYYY") : "11 May 2026" },
                ].map((item, idx) => (
                  <div key={idx} className="py-4 border-b last:border-0" style={{ borderColor: borderLineColor }}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap="md">
                        <div className="bg-blue-50 p-1.5 rounded-full"><Icon icon={item.icon} className="text-[#002D84] text-sm" /></div>
                        <Text size="xs" fw={500} className="text-gray-400" style={{ fontSize: '9px' }}>{item.label}</Text>
                      </Flex>
                      <Text size="xs" fw={600} className={`text-gray-800 ${item.mono ? 'font-mono' : ''}`}>{item.value}</Text>
                    </Flex>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ringkasan Pembayaran Card */}
            <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
              <Title order={6} className="text-[#002D84] font-bold mb-6" style={{ fontSize: '11px' }}>Ringkasan Pembayaran</Title>
              <div className="space-y-5">
                <Flex justify="space-between" align="center">
                  <Text size="xs" fw={500} className="text-gray-500">Tiket ({data?.total_qty || 2})</Text>
                  <Text fw={600} size="xs" className="text-gray-800"><NumberFormatter value={data?.total_price || 500000} prefix="Rp " /></Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text size="xs" fw={500} className="text-gray-500">Merchandise</Text>
                  <Text fw={600} size="xs" className="text-gray-800"><NumberFormatter value={data?.transaction_merches?.reduce((acc, m) => acc + (Number(m.subtotal) || 0), 0) || 50000} prefix="Rp " /></Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text size="xs" fw={500} className="text-gray-500">Biaya Layanan</Text>
                  <Text fw={600} size="xs" className="text-gray-800">Rp 0</Text>
                </Flex>
                
                <Divider my="sm" style={{ borderColor: borderLineColor }} />
                
                <Flex justify="space-between" align="center">
                  <Text size="sm" fw={800} className="text-[#002D84] uppercase tracking-widest">Total</Text>
                  <Title order={3} className="text-[#002D84]" style={{ fontSize: '24px' }}>
                    <NumberFormatter value={data?.grandtotal || 510000} prefix="Rp " />
                  </Title>
                </Flex>

                <Button 
                  component={Link} 
                  href={`${config.wsUrl}transaction-document/${invoice}`} 
                  target="_blank" 
                  fullWidth 
                  size="xl"
                  radius="md"
                  className="mt-2 shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#002D84', height: '65px' }}
                  leftSection={<Icon icon="solar:download-bold" className="text-2xl" />}
                >
                  <Stack gap={0} align="start">
                    <Text fw={800} size="md" className="tracking-widest">UNDUH TIKET</Text>
                    <Text size="9px" fw={500} className="opacity-60">Download PDF</Text>
                  </Stack>
                </Button>
              </div>
            </Card>
          </SimpleGrid>

          {/* Terms and Conditions */}
          <div className="px-6 md:px-10 mb-12">
            <Card shadow="none" radius="md" p="xl" style={cardShadowStyle}>
              <Title order={6} className="text-[#002D84] font-bold mb-6" style={{ fontSize: '11px' }}>Syarat dan Ketentuan</Title>
              <Box className="text-[11px] text-gray-500 leading-relaxed space-y-3 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: data?.has_event?.term_condition || `
                  1. Tiket tidak dapat dipindahtangankan.<br/>
                  2. Dilarang membawa senjata tajam.<br/>
                  3. Wajib membawa e-TTP asli.
                ` }} />
              </Box>
            </Card>
          </div>

          {/* Footer */}
          <div className="bg-white py-12">
             <Stack align="center" gap="lg">
                <Text fw={700} size="xs" className="text-[#002D84] uppercase tracking-[0.4em]">Butuh Bantuan?</Text>
                <Flex gap="xl" wrap="wrap" justify="center" align="center">
                  <Flex align="center" gap={10}>
                    <Icon icon="solar:letter-bold" className="text-blue-600 text-lg" />
                    <Link href="mailto:support@kolektix.com" className="text-gray-600 hover:text-blue-600 hover:underline text-[11px] font-medium">support@kolektix.com</Link>
                  </Flex>
                  <div className="hidden md:block h-4 w-[1px] bg-gray-200"></div>
                  <Flex align="center" gap={10}>
                    <Icon icon="solar:global-bold" className="text-blue-600 text-lg" />
                    <Link href="https://www.kolektix.com" className="text-gray-600 hover:text-blue-600 hover:underline text-[11px] font-medium">www.kolektix.com</Link>
                  </Flex>
                </Flex>
             </Stack>
          </div>
        </Paper>
      </Container>
    </div>
  );
}