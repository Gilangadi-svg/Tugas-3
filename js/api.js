
/* =========================================
   CRYPTOVERSE - API SERVICE
   Sumber API: Coinlore
========================================= */

// Alamat API Cryptocurrency Coinlore
const API_URL = "https://api.coinlore.net/api/tickers/";


/* =========================================
   1. FUNGSI MENGAMBIL DATA CRYPTOCURRENCY
========================================= */

export async function getCryptocurrency() {

    try {

        // Mengirim permintaan data ke server API
        const response = await fetch(API_URL);

        // Memeriksa status respons dari server
        if (!response.ok) {

            throw new Error(
                "Gagal menghubungkan ke API Coinlore. Status: " +
                response.status
            );

        }

        // Mengubah respons API menjadi format JSON
        const result = await response.json();

        // Memeriksa apakah data tersedia
        if (
            !result ||
            !Array.isArray(result.data) ||
            result.data.length === 0
        ) {

            throw new Error(
                "Data cryptocurrency tidak ditemukan."
            );

        }

        // Mengembalikan data cryptocurrency
        return result.data;

    } catch (error) {

        // Menampilkan kesalahan pada console browser
        console.error(
            "Terjadi kesalahan saat mengambil data API:",
            error
        );

        // Mengirimkan kesalahan ke app.js
        throw error;

    }

}


/* =========================================
   2. FUNGSI MENGAMBIL 7 DATA TERATAS
========================================= */

export async function getTopCryptocurrency() {

    try {

        // Mengambil seluruh data dari API
        const data = await getCryptocurrency();

        // Mengambil tujuh cryptocurrency teratas
        const topCrypto = data.slice(0, 7);

        // Mengembalikan tujuh data cryptocurrency
        return topCrypto;

    } catch (error) {

        console.error(
            "Gagal mengambil tujuh cryptocurrency teratas:",
            error
        );

        throw error;

    }

}


/* =========================================
   3. FUNGSI FORMAT HARGA USD
========================================= */

export function formatPrice(price) {

    // Mengubah harga menjadi angka
    const number = Number(price);

    // Memeriksa apakah harga merupakan angka valid
    if (!Number.isFinite(number)) {

        return "-";

    }

    // Mengatur format tampilan harga USD
    return number.toLocaleString("en-US", {

        minimumFractionDigits: 2,

        maximumFractionDigits: 8

    });

}


/* =========================================
   4. FUNGSI INFORMASI API
========================================= */

export function getApiInformation() {

    return {

        name: "Coinlore Cryptocurrency API",

        url: API_URL,

        description:
            "API untuk mengambil informasi cryptocurrency secara online.",

        fields: [
            "rank",
            "name",
            "symbol",
            "price_usd"
        ]

    };

}
