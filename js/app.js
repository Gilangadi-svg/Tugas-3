
/* =========================================
   CRYPTOVERSE - MAIN APPLICATION
========================================= */


/* =========================================
   1. IMPORT API SERVICE
========================================= */

import {
    getCryptocurrency,
    formatPrice
} from "./api.js";


/* =========================================
   2. MENGAMBIL ELEMEN HTML
========================================= */

// Halaman aplikasi
const loginPage = document.getElementById("login-page");
const dashboardPage = document.getElementById("dashboard-page");

// Form login
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

// Tombol login dan logout
const logoutButton = document.getElementById("logout-button");
const togglePassword = document.getElementById("toggle-password");

// Tombol refresh dan coba lagi
const refreshButton = document.getElementById("refresh-button");
const retryButton = document.getElementById("retry-button");

// Elemen dashboard
const cryptoList = document.getElementById("crypto-list");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const updateTime = document.getElementById("update-time");
const totalCrypto = document.getElementById("total-crypto");
const apiStatus = document.getElementById("api-status");

// Kolom pencarian
const searchInput = document.getElementById("search-input");

// Informasi tombol refresh
const refreshText = document.getElementById("refresh-text");
const refreshIcon = document.getElementById("refresh-icon");


/* =========================================
   3. VARIABEL DATA
========================================= */

// Menyimpan data cryptocurrency dari API
let cryptocurrencyData = [];


/* =========================================
   4. FUNGSI LOGIN
========================================= */

loginForm.addEventListener("submit", function(event) {

    // Mencegah halaman melakukan reload
    event.preventDefault();

    // Mengambil username dan password
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validasi akun demonstrasi
    if (
        username === "mahasiswa" &&
        password === "crypto123"
    ) {

        // Menghapus pesan kesalahan
        loginError.textContent = "";

        // Menyembunyikan halaman login
        loginPage.classList.add("hidden");

        // Menampilkan dashboard
        dashboardPage.classList.remove("hidden");

        // Mengambil data cryptocurrency
        loadCryptocurrency();

    } else {

        // Menampilkan pesan kesalahan
        loginError.textContent =
            "Username atau password yang kamu masukkan salah.";

    }

});


/* =========================================
   5. FUNGSI MENAMPILKAN PASSWORD
========================================= */

togglePassword.addEventListener("click", function() {

    if (passwordInput.type === "password") {

        // Menampilkan password
        passwordInput.type = "text";

        togglePassword.textContent = "Sembunyikan";

    } else {

        // Menyembunyikan password
        passwordInput.type = "password";

        togglePassword.textContent = "Lihat";

    }

});


/* =========================================
   6. FUNGSI LOGOUT
========================================= */

logoutButton.addEventListener("click", function() {

    // Menyembunyikan dashboard
    dashboardPage.classList.add("hidden");

    // Kembali ke halaman login
    loginPage.classList.remove("hidden");

    // Mengosongkan form login
    loginForm.reset();

    // Mengembalikan tipe password
    passwordInput.type = "password";

    togglePassword.textContent = "Lihat";

    // Menghapus pesan kesalahan
    loginError.textContent = "";

    // Mengosongkan pencarian
    searchInput.value = "";

});


/* =========================================
   7. FUNGSI MENAMPILKAN DATA CRYPTOCURRENCY
========================================= */

function displayCryptocurrency(data) {

    // Mengosongkan daftar sebelumnya
    cryptoList.innerHTML = "";

    // Melakukan perulangan setiap data cryptocurrency
    data.forEach(function(coin) {

        // Membuat elemen utama
        const item = document.createElement("div");

        item.className = "crypto-item";


        // =========================
        // BAGIAN RANK
        // =========================

        const rank = document.createElement("div");

        const rankLabel = document.createElement("p");

        rankLabel.className = "crypto-label";

        rankLabel.textContent = "Rank";

        const rankValue = document.createElement("p");

        rankValue.className = "crypto-rank";

        rankValue.textContent = coin.rank;

        rank.append(rankLabel, rankValue);


        // =========================
        // BAGIAN NAME DAN SYMBOL
        // =========================

        const identity = document.createElement("div");

        const nameLabel = document.createElement("p");

        nameLabel.className = "crypto-label";

        nameLabel.textContent = "Name";

        const nameValue = document.createElement("p");

        nameValue.className = "crypto-name";

        nameValue.textContent = coin.name;

        const symbolValue = document.createElement("span");

        symbolValue.className = "crypto-symbol";

        symbolValue.textContent = coin.symbol;

        identity.append(
            nameLabel,
            nameValue,
            symbolValue
        );


        // =========================
        // BAGIAN PRICE USD
        // =========================

        const price = document.createElement("div");

        const priceLabel = document.createElement("p");

        priceLabel.className = "crypto-label price-label";

        priceLabel.textContent = "USD";

        const priceValue = document.createElement("p");

        priceValue.className = "crypto-price";

        // Menggunakan fungsi dari api.js
        priceValue.textContent = formatPrice(coin.price_usd);

        price.append(priceLabel, priceValue);


        // =========================
        // MENGGABUNGKAN ELEMEN
        // =========================

        item.append(rank, identity, price);

        // Menampilkan data ke halaman
        cryptoList.appendChild(item);

    });

}


/* =========================================
   8. FUNGSI PENCARIAN CRYPTOCURRENCY
========================================= */

function searchCryptocurrency() {

    // Mengambil kata kunci pencarian
    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    // Menyaring data berdasarkan nama atau simbol
    const filteredData = cryptocurrencyData.filter(
        function(coin) {

            return (
                String(coin.name)
                    .toLowerCase()
                    .includes(keyword) ||

                String(coin.symbol)
                    .toLowerCase()
                    .includes(keyword)
            );

        }
    );

    // Menampilkan hasil pencarian
    displayCryptocurrency(filteredData);

    // Jika data tidak ditemukan
    if (filteredData.length === 0) {

        cryptoList.innerHTML =
            '<p class="message">Cryptocurrency tidak ditemukan.</p>';

    }

}

// Menjalankan pencarian ketika pengguna mengetik
searchInput.addEventListener(
    "input",
    searchCryptocurrency
);


/* =========================================
   9. FUNGSI MENGAMBIL DATA API
========================================= */

async function loadCryptocurrency() {

    try {

        // Menampilkan loading
        loading.classList.remove("hidden");

        // Menyembunyikan pesan error
        errorMessage.classList.add("hidden");

        // Mengosongkan data lama
        cryptoList.innerHTML = "";

        // Menonaktifkan tombol refresh
        refreshButton.disabled = true;

        refreshText.textContent = "Loading...";

        refreshIcon.textContent = "↻";

        // Mengubah status API
        apiStatus.textContent = "Memuat...";


        // =========================
        // MENGAMBIL DATA DARI API.JS
        // =========================

        const data = await getCryptocurrency();


        // Memeriksa apakah data tersedia
        if (!Array.isArray(data) || data.length === 0) {

            throw new Error(
                "Data cryptocurrency tidak tersedia."
            );

        }


        // =========================
        // MENYIMPAN TUJUH DATA TERATAS
        // =========================

        cryptocurrencyData = data.slice(0, 7);


        // =========================
        // MENAMPILKAN DATA
        // =========================

        displayCryptocurrency(cryptocurrencyData);


        // =========================
        // MEMPERBARUI STATISTIK
        // =========================

        totalCrypto.textContent =
            cryptocurrencyData.length;

        apiStatus.textContent = "Online";


        // =========================
        // WAKTU PEMBARUAN DATA
        // =========================

        updateTime.textContent =
            "Last updated: " +
            new Date().toLocaleString("id-ID");


    } catch (error) {

        // Menampilkan kesalahan di console browser
        console.error(
            "Gagal memuat cryptocurrency:",
            error
        );

        // Mengubah status API
        apiStatus.textContent = "Offline";

        // Menampilkan pesan kesalahan
        errorMessage.classList.remove("hidden");

        // Mengosongkan daftar data
        cryptoList.innerHTML = "";


    } finally {

        // Menyembunyikan animasi loading
        loading.classList.add("hidden");

        // Mengaktifkan tombol refresh kembali
        refreshButton.disabled = false;

        refreshText.textContent = "Refresh";

        refreshIcon.textContent = "↻";

    }

}


/* =========================================
   10. EVENT TOMBOL REFRESH
========================================= */

refreshButton.addEventListener(
    "click",
    loadCryptocurrency
);


/* =========================================
   11. EVENT TOMBOL COBA LAGI
========================================= */

retryButton.addEventListener(
    "click",
    loadCryptocurrency
);


/* =========================================
   12. KONDISI AWAL APLIKASI
========================================= */

// Saat aplikasi pertama kali dibuka,
// pengguna akan diarahkan ke halaman login.

loginPage.classList.remove("hidden");

dashboardPage.classList.add("hidden");

