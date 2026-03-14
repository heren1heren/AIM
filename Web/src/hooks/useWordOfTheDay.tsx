import { useEffect, useState } from "react";
import { type WordOfTheDay } from '../types/wordOfTheDay.type';
export default function useWordOfTheDay() {
    const [data, setData] = useState<WordOfTheDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWOTD() {
            try {
                setLoading(true);
                const res = await fetch("https://wordoftheday.freeapi.me/");
                if (!res.ok) throw new Error("Failed to fetch word of the day");

                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        fetchWOTD();
    }, []);

    return { data, loading, error };
}
