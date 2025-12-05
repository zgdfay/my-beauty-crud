# 🚀 Quick Start: Koneksi Android ke API Lokal

## ⚡ Solusi Cepat (5 Menit)

### **Step 1: Cari IP PC Anda**
```bash
# Windows
ipconfig
# Cari "IPv4 Address" → Contoh: 192.168.1.100

# Mac/Linux
ifconfig
# Cari IP di en0 atau wlan0 → Contoh: 192.168.1.100
```

### **Step 2: Pastikan PC & Android di WiFi yang Sama**
- PC dan Android harus terhubung ke router WiFi yang sama

### **Step 3: Test dari Browser Android**
- Buka browser di Android
- Ketik: `http://192.168.1.100/dbrest/api/produk.php`
- Jika muncul response JSON → ✅ Berhasil!

### **Step 4: Update Base URL di Android**
```kotlin
// Config.kt
const val BASE_URL = "http://192.168.1.100/dbrest/api/"
```

### **Step 5: Tambahkan Permission di AndroidManifest.xml**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<application android:usesCleartextTraffic="true" ...>
```

## 📚 Dokumentasi Lengkap
Lihat file **`DOKUMENTASI_ANDROID_API.md`** untuk penjelasan detail dan troubleshooting.

## 💻 Contoh Kode
Lihat file **`CONTOH_KOTLIN_API.kt`** untuk contoh implementasi lengkap.

---

**Flow Singkat:**
```
XAMPP (PC) → IP PC (192.168.1.100) → WiFi Router → Android App
```

