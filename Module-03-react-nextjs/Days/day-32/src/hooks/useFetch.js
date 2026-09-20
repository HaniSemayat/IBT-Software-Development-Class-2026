import { useEffect, useState } from "react";

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(
                        "Could not load the menu. Please try again."
                    );
                }

                const result = await response.json();

                setData(result);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        load();

        return function () {
            controller.abort();
        };
    }, [url]);

    return {
        data,
        loading,
        error
    };
}

export default useFetch;