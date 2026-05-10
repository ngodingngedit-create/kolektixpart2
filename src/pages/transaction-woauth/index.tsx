import FirstStepUnlogged from "@/components/Payment/FirstStepUnlogged";
import { EventProps } from "@/utils/globalInterface";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Countdown, { CountdownRendererFn } from "react-countdown";
import Footer from "@/components/FooterComponent";
import React from "react";
import { useRouter } from "next/router";

// Interface definitions
interface FormTicket {
  event_id: number;
  event_ticket_id: number;
  name: string;
  price: number;
  subtotal_price: number;
  qty_ticket: number;
  payment_status: string;
  ticket_fee: number;
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
  is_profession: string;
  is_company: string;
  is_assistant: string;
  merch_size?: string;
  merch_product_name?: string;
  merch_product_id?: number;
  merch_image_url?: string;
  merch_price?: number;
  merch_variant_id?: number;
  merch_variant_name?: string;
  event_merch_id?: number;
}

interface DataProps {
  detail: EventProps;
  ticket: FormTicket[];
  totalSubtotalPrice: number;
  totalCount: number;
  form: Form[];
  countdowns: string;
  merchSelections?: any;
}

// Function to open IndexedDB
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

// Function to get data from IndexedDB
// const getDataFromIndexedDB = async (): Promise<DataProps | null> => {
//   try {
//     const db = await openDatabase();
//     return new Promise((resolve, reject) => {
//       const transaction = db.transaction("transactionStore", "readonly");
//       const store = transaction.objectStore("transactionStore");
//       const request = store.get("transactionStorage");

//       request.onsuccess = () => {
//         const result = request.result;
//         resolve(result ? result.data : null);
//       };

//       request.onerror = (error) => {
//         reject(error);
//       };
//     });
//   } catch (error) {
//     console.error("Error accessing IndexedDB:", error);
//     return null;
//   }
// };

const getDataFromIndexedDB = async (): Promise<DataProps | null> => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("transactionStore", "readonly");
      const store = transaction.objectStore("transactionStore");
      const request = store.get("transactionStorage");

      request.onsuccess = () => {
        const result = request.result;
        console.log("Raw data from IndexedDB:", result); // Periksa struktur datanya

        if (result) {
          console.log("Ticket data:", result.data.ticket); // Periksa array tiket

          const ticketsWithFee = result.data.ticket.map((ticket: any) => {
            console.log("Individual ticket:", ticket); // Periksa setiap tiket
            return {
              ...ticket,
              ticket_fee: ticket.ticket_fee !== undefined && ticket.ticket_fee !== null ? ticket.ticket_fee : ticket.price * 0.1,
            };
          });

          resolve({
            ...result.data,
            ticket: ticketsWithFee,
          });
        } else {
          resolve(null);
        }
      };

      request.onerror = (error) => {
        reject(error);
      };
    });
  } catch (error) {
    console.error("Error accessing IndexedDB:", error);
    return null;
  }
};

const TransactionWithoutAuth = () => {
  const [data, setData] = useState<DataProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [step, setStep] = useState<number>(0);
  const router = useRouter();

  const renderer: CountdownRendererFn = ({ minutes, seconds, completed }) => {
    if (completed) {
      router.back();
      // return <p>Time Out</p>;
    } else {
      return (
        <p className="font-semibold">
          {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
        </p>
      );
    }
  };

  useEffect(() => {
    console.log("TransactionWithoutAuth mounted");
    getDataFromIndexedDB()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Failed to fetch data from IndexedDB", error);
        setData(null);
      });
  }, []);

  return (
    <>
      <div className="text-dark min-h-screen bg-[#f8fafc] px-4 md:px-2 lg:px-0 pb-32">
        {data && (
          <FirstStepUnlogged
            detail={data.detail}
            ticket={data.ticket}
            totalCount={data.totalCount}
            totalSubtotalPrice={data.totalSubtotalPrice}
            forms={data.form}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            setFormValid={setFormValid}
            setStep={setStep}
            step={step}
          />
        )}
      </div>
      {step === 0 && (
        <div className="w-full fixed bottom-0 bg-white border-t border-[#e4e4e7] z-50 py-4 px-4 md:px-8 lg:px-12 shadow-smooth-low">
          <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 bg-[#EA4D3E] text-white px-4 py-1.5 rounded-full shadow-sm">
              <div className="text-sm font-bold">
                {data?.countdowns && <Countdown date={new Date(data.countdowns)} renderer={renderer} />}
              </div>
              <div className="w-[1px] h-3 bg-white/30"></div>
              <p className="text-[11px] font-medium tracking-wide">Segera selesaikan pesananmu</p>
            </div>
            <Button 
              label="Selanjutnya" 
              color="primary" 
              disabled={!formValid} 
              className="px-10 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 active:scale-[0.98]" 
              onClick={() => setIsOpen(true)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionWithoutAuth;
