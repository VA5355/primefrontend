const TTL = 1000 * 60 * 15;
export const StorageUtils = {
    _save: (key, value) => {
        const now = Date.now();
        localStorage.setItem(key, JSON.stringify({
            value,
            ttl: now + TTL
        }));
    },
    _retrieve: (key) => {
        if (typeof window === "undefined") {
            // Running on server — return a default
            return { isValid: false };
        }
        const isValid = false;
        const now = Date.now();
        const data = localStorage.getItem(key);
        if (!data) {
            return {
                isValid: false,
                data: null,
            };
        }
        const parsedData = JSON.parse(data);
        if (parsedData.ttl < now) {
            localStorage.removeItem(key);
            return {
                isValid: false,
                data: null
            };
        }
        else {
            return {
                isValid: true,
                data: parsedData.value,
                ttl: parsedData.ttl
            };
        }
    }
};
