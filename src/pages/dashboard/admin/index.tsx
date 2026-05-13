import { formatDateNoCheck, formatDay, formatYear } from "@/utils/useFormattedDate";
import useLoggedUser from "@/utils/useLoggedUser";
import { useState, useEffect } from "react";

export default function DashboardAdmin() {
    const user = useLoggedUser();
    const [mounted, setMounted] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    
    useEffect(() => {
        setMounted(true);
        setCurrentDate(new Date());
    }, []);
    
    if (!mounted || !currentDate) {
        return (
            <div className="w-full text-dark">
                <div className="flex flex-col gap-2 px-4 py-4 md:px-7 md:py-4 w-full bg-gradient-to-b from-white to-[#f5f5f5]">
                    <h1 className='mb-4 text-dark'>Dashboard Admin</h1>
                    <p className="text-dark-grey mb-1">
                        Loading...
                    </p>
                    <h3 className="font-semibold text-xl md:text-2xl">Halo, {user?.name || "Pengguna"}</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full text-dark">
            <div className="flex flex-col gap-2 px-4 py-4 md:px-7 md:py-4 w-full bg-gradient-to-b from-white to-[#f5f5f5]">
                <h1 className='mb-4 text-dark'>Dashboard Admin</h1>
                <p className="text-dark-grey mb-1">
                    {formatDay(currentDate.toString())} &bull; {formatDateNoCheck(currentDate.toString())},{' '}
                    {formatYear(currentDate.toString())}
                </p>
                <h3 className="font-semibold text-xl md:text-2xl">Halo, {user?.name || "Admin"}</h3>
                <p className="text-sm text-dark-grey">Selamat datang di panel kontrol administrasi.</p>
            </div>
        </div>
    );
}