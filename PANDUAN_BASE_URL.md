# 🔗 Panduan Base URL untuk Koneksi Android

## ⚠️ PENTING: Base URL WAJIB Menggunakan IP PC!

**Android TIDAK BISA mengakses `localhost` atau `127.0.0.1`** karena:
- `localhost` di Android = perangkat Android itu sendiri
- `localhost` di PC = PC Anda
- Android dan PC adalah perangkat berbeda!

## ✅ Format Base URL yang Benar

### **1. Untuk Android Device Fisik (WiFi)**
```
http://[IP_PC]/dbrest/api/
```

**Contoh:**
```
http://192.168.1.100/dbrest/api/
http://192.168.43.1/dbrest/api/
http://10.0.0.5/dbrest/api/
```

**Cara cari IP PC:**
- **Windows**: Buka CMD → ketik `ipconfig` → cari "IPv4 Address"
- **Mac/Linux**: Buka Terminal → ketik `ifconfig` → cari IP di `en0` atau `wlan0`

### **2. Untuk Android Emulator**
```
http://10.0.2.2/dbrest/api/
```

**Catatan:** `10.0.2.2` adalah IP khusus Android Emulator untuk akses localhost PC.

### **3. Untuk Ngrok (Testing dari Internet)**
```
https://xxxx-xxxx-xxxx.ngrok.io/dbrest/api/
```

### **4. Untuk Production (Hosting)**
```
https://yourdomain.com/dbrest/api/
```

---

## 📝 Cara Setup Base URL di Android Kotlin

### **Step 1: Buat File Config.kt**

```kotlin
// app/src/main/java/com/yourapp/config/Config.kt
object Config {
    // GANTI dengan IP PC Anda!
    const val BASE_URL = "http://192.168.1.100/dbrest/api/"
}
```

### **Step 2: Gunakan di Retrofit**

```kotlin
// app/src/main/java/com/yourapp/network/ApiClient.kt
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    private val retrofit = Retrofit.Builder()
        .baseUrl(Config.BASE_URL) // ⬅️ Pakai base URL dari Config
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

### **Step 3: Setup API Interface**

```kotlin
// app/src/main/java/com/yourapp/network/ApiService.kt
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Endpoint akan menjadi: BASE_URL + "produk.php"
    // = http://192.168.1.100/dbrest/api/produk.php
    @GET("produk.php")
    suspend fun getAllProducts(): Response<ApiResponse<List<Product>>>
}
```

---

## 🔍 Verifikasi Base URL

### **Test 1: Dari Browser Android**
1. Buka browser di Android
2. Ketik: `http://192.168.1.100/dbrest/api/produk.php`
3. Jika muncul JSON response → ✅ Base URL benar!
4. Jika error/timeout → ❌ Cek IP, WiFi, atau firewall

### **Test 2: Dari Android App**
1. Set base URL di `Config.kt`
2. Jalankan aplikasi
3. Cek Logcat untuk melihat request URL
4. Pastikan URL lengkap: `http://192.168.1.100/dbrest/api/produk.php`

---

## ⚙️ Konfigurasi Tambahan

### **1. AndroidManifest.xml - Internet Permission**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Wajib untuk akses internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        <!-- Wajib untuk HTTP (non-HTTPS) -->
        android:usesCleartextTraffic="true"
        ...>
        ...
    </application>
</manifest>
```

### **2. Network Security Config (Opsional, untuk HTTPS)**

Buat file `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

Lalu referensi di AndroidManifest.xml:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

---

## 🚨 Troubleshooting

### **Error: "Unable to resolve host"**
**Penyebab:** IP PC salah atau tidak bisa diakses
**Solusi:**
- ✅ Cek IP PC dengan `ipconfig`/`ifconfig`
- ✅ Pastikan PC dan Android di WiFi yang sama
- ✅ Test dari browser Android dulu

### **Error: "Connection refused"**
**Penyebab:** XAMPP tidak running atau firewall memblokir
**Solusi:**
- ✅ Pastikan XAMPP Apache running
- ✅ Cek firewall PC (allow Apache/port 80)
- ✅ Test dari browser PC: `http://localhost/dbrest/api/produk.php`

### **Error: "Cleartext HTTP traffic not permitted"**
**Penyebab:** Android memblokir HTTP (non-HTTPS)
**Solusi:**
- ✅ Tambahkan `android:usesCleartextTraffic="true"` di AndroidManifest.xml
- ✅ Atau gunakan HTTPS (ngrok atau hosting)

### **IP PC Berubah Setiap Hari**
**Penyebab:** Router memberikan IP dinamis
**Solusi:**
- ✅ Set static IP di router untuk PC
- ✅ Atau gunakan ngrok/hosting untuk URL tetap

---

## 📋 Checklist Setup Base URL

- [ ] Cari IP PC dengan `ipconfig`/`ifconfig`
- [ ] Pastikan PC dan Android di WiFi yang sama
- [ ] Test dari browser Android: `http://[IP_PC]/dbrest/api/produk.php`
- [ ] Update `Config.kt` dengan IP PC yang benar
- [ ] Pastikan base URL berakhiran `/` (slash)
- [ ] Tambahkan Internet Permission di AndroidManifest.xml
- [ ] Enable Cleartext Traffic untuk HTTP
- [ ] Test dari aplikasi Android
- [ ] Cek Logcat untuk melihat request URL

---

## 💡 Tips

1. **Gunakan Build Variants** untuk development dan production:
   ```kotlin
   object Config {
       const val BASE_URL = if (BuildConfig.DEBUG) {
           "http://192.168.1.100/dbrest/api/"
       } else {
           "https://yourdomain.com/dbrest/api/"
       }
   }
   ```

2. **Simpan IP di SharedPreferences** agar mudah diubah tanpa rebuild:
   ```kotlin
   val prefs = context.getSharedPreferences("config", Context.MODE_PRIVATE)
   val baseUrl = prefs.getString("base_url", "http://192.168.1.100/dbrest/api/")
   ```

3. **Gunakan Logging Interceptor** untuk debug:
   ```kotlin
   val logging = HttpLoggingInterceptor()
   logging.level = HttpLoggingInterceptor.Level.BODY
   // Lihat request/response di Logcat
   ```

---

**Kesimpulan:** Ya, **WAJIB** menggunakan base URL dengan IP PC (bukan localhost) agar Android bisa connect langsung! 🎯

