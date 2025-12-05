# 📱 Panduan Mengakses API Lokal (XAMPP) dari Android Kotlin

## 🎯 Masalah Utama

Ketika Anda menjalankan API di XAMPP dengan URL `http://localhost/dbrest/api/produk.php`, URL ini **TIDAK BISA** diakses langsung dari aplikasi Android karena:

- `localhost` di Android merujuk ke perangkat Android itu sendiri, bukan ke PC Anda
- Android dan PC adalah perangkat yang berbeda dalam jaringan

## ✅ Solusi yang Direkomendasikan

### **Solusi 1: Menggunakan IP Lokal PC (PALING MUDAH untuk Development)**

Ini adalah solusi terbaik untuk development dan testing di jaringan lokal.

#### Langkah-langkah:

1. **Cari IP Address PC Anda:**

   - **Windows**: Buka CMD, ketik `ipconfig`, cari "IPv4 Address" (biasanya `192.168.x.x`)
   - **Mac/Linux**: Buka Terminal, ketik `ifconfig` atau `ip addr`, cari IP di `en0` atau `wlan0`

2. **Pastikan PC dan Android di WiFi yang sama:**

   - PC dan Android harus terhubung ke router WiFi yang sama
   - Jika PC pakai kabel LAN, pastikan router mengizinkan komunikasi antara WiFi dan LAN

3. **Ganti `localhost` dengan IP PC:**

   - Jika IP PC Anda adalah `192.168.1.100`
   - URL menjadi: `http://192.168.1.100/dbrest/api/produk.php`

4. **Konfigurasi Firewall:**

   - **Windows**: Buka Windows Defender Firewall → Allow an app → Centang "Apache HTTP Server"
   - **Mac**: System Preferences → Security & Privacy → Firewall → Allow Apache
   - Atau nonaktifkan firewall sementara untuk testing

5. **Test dari Browser Android:**
   - Buka browser di Android
   - Ketik: `http://192.168.1.100/dbrest/api/produk.php`
   - Jika muncul response, berarti sudah bisa diakses

#### Kelebihan:

- ✅ Gratis
- ✅ Tidak perlu install software tambahan
- ✅ Cepat dan stabil
- ✅ Cocok untuk development

#### Kekurangan:

- ❌ Hanya bekerja di jaringan lokal yang sama
- ❌ IP bisa berubah jika router restart (kecuali set static IP)

---

### **Solusi 2: Menggunakan Ngrok (Untuk Testing Cepat)**

Ngrok membuat tunnel dari internet ke localhost Anda, sehingga bisa diakses dari mana saja.

#### Langkah-langkah:

1. **Install Ngrok:**

   ```bash
   # Download dari https://ngrok.com/download
   # Atau via Homebrew (Mac):
   brew install ngrok
   ```

2. **Daftar dan dapatkan authtoken:**

   - Daftar di https://ngrok.com (gratis)
   - Dapatkan authtoken dari dashboard
   - Jalankan: `ngrok config add-authtoken YOUR_TOKEN`

3. **Jalankan Ngrok:**

   ```bash
   # Jika XAMPP di port 80:
   ngrok http 80

   # Jika XAMPP di port 8080:
   ngrok http 8080
   ```

4. **Copy URL yang diberikan:**

   - Akan muncul URL seperti: `https://xxxx-xxxx-xxxx.ngrok.io`
   - Gunakan URL ini di aplikasi Android

5. **Update URL di aplikasi:**
   - Ganti base URL menjadi: `https://xxxx-xxxx-xxxx.ngrok.io/dbrest/api/produk.php`

#### Kelebihan:

- ✅ Bisa diakses dari mana saja (internet)
- ✅ Cocok untuk testing dengan teman/klien
- ✅ Gratis (dengan batasan)

#### Kekurangan:

- ❌ URL berubah setiap restart (kecuali pakai plan berbayar)
- ❌ Ada batasan request untuk free plan
- ❌ Perlu koneksi internet

---

### **Solusi 3: Menggunakan ADB Port Forwarding (USB Connection)**

Jika Android terhubung ke PC via USB, bisa menggunakan port forwarding.

#### Langkah-langkah:

1. **Enable USB Debugging di Android:**

   - Settings → About Phone → Tap "Build Number" 7x
   - Settings → Developer Options → Enable "USB Debugging"

2. **Install ADB:**

   - Download Android SDK Platform Tools
   - Atau install Android Studio (sudah include ADB)

3. **Jalankan Port Forwarding:**

   ```bash
   # Forward port 80 dari Android ke PC
   adb reverse tcp:80 tcp:80

   # Atau port 8080 jika XAMPP di port 8080
   adb reverse tcp:8080 tcp:8080
   ```

4. **Gunakan `localhost` di Android:**
   - URL tetap: `http://127.0.0.1:80/dbrest/api/produk.php`
   - ADB akan forward ke PC secara otomatis

#### Kelebihan:

- ✅ Tidak perlu tahu IP PC
- ✅ Aman (hanya via USB)

#### Kekurangan:

- ❌ Harus terhubung USB terus
- ❌ Hanya untuk development, tidak untuk production

---

### **Solusi 4: Deploy ke Hosting/Server (Untuk Production)**

Untuk production atau testing jarak jauh, deploy API ke server.

#### Pilihan Hosting Gratis:

- **000webhost**: https://www.000webhost.com
- **InfinityFree**: https://www.infinityfree.net
- **Heroku**: https://www.heroku.com (sudah tidak free, tapi ada alternatif)
- **Railway**: https://railway.app (ada free tier)

#### Langkah-langkah:

1. **Upload file PHP ke hosting:**

   - Upload folder `dbrest` ke hosting
   - Import database ke phpMyAdmin hosting

2. **Update URL di aplikasi:**
   - Ganti dengan URL hosting: `https://yourdomain.com/dbrest/api/produk.php`

#### Kelebihan:

- ✅ Bisa diakses dari mana saja
- ✅ URL tetap/permanen
- ✅ Cocok untuk production

#### Kekurangan:

- ❌ Perlu setup hosting
- ❌ Mungkin ada batasan untuk free hosting

---

## 🔧 Implementasi di Android Kotlin

### **1. Setup Base URL dengan Build Variants**

Buat file `Config.kt` untuk mengelola URL berdasarkan environment:

```kotlin
// app/src/main/java/com/yourapp/config/Config.kt
object Config {
    // Development - Ganti dengan IP PC Anda
    const val BASE_URL_DEV = "http://192.168.1.100/dbrest/api/"

    // Production - URL hosting
    const val BASE_URL_PROD = "https://yourdomain.com/dbrest/api/"

    // Ngrok - Untuk testing cepat
    const val BASE_URL_NGROK = "https://xxxx-xxxx-xxxx.ngrok.io/dbrest/api/"

    // Pilih environment
    const val BASE_URL = BASE_URL_DEV // Ganti sesuai kebutuhan
}
```

### **2. Setup Retrofit/OkHttp**

```kotlin
// app/src/main/java/com/yourapp/network/ApiClient.kt
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(Config.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

### **3. Setup API Interface**

```kotlin
// app/src/main/java/com/yourapp/network/ApiService.kt
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // GET All Products
    @GET("produk.php")
    suspend fun getAllProducts(): Response<ApiResponse<List<Product>>>

    // GET Product by ID
    @GET("produk.php")
    suspend fun getProductById(@Query("id") id: String): Response<ApiResponse<Product>>

    // POST Create Product
    @POST("produk.php")
    suspend fun createProduct(@Body product: ProductRequest): Response<ApiResponse<Product>>

    // PUT Update Product
    @PUT("produk.php")
    suspend fun updateProduct(@Body product: ProductRequest): Response<ApiResponse<Product>>

    // DELETE Product
    @DELETE("produk.php")
    suspend fun deleteProduct(@Query("id") id: String): Response<ApiResponse<Unit>>
}
```

### **4. Tambahkan Internet Permission**

```xml
<!-- app/src/main/AndroidManifest.xml -->
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Untuk HTTP (non-HTTPS) di Android 9+ -->
    <application
        android:usesCleartextTraffic="true"
        ...>
        ...
    </application>
</manifest>
```

### **5. Handle Error dengan Try-Catch**

```kotlin
// Contoh penggunaan di ViewModel atau Repository
suspend fun loadProducts(): Result<List<Product>> {
    return try {
        val response = ApiClient.apiService.getAllProducts()
        if (response.isSuccessful && response.body() != null) {
            Result.success(response.body()!!.data)
        } else {
            Result.failure(Exception("Error: ${response.message()}"))
        }
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

---

## 📋 Checklist untuk UAS

- [ ] **Cari IP PC** dan pastikan PC dan Android di WiFi yang sama
- [ ] **Test API dari browser Android** untuk memastikan bisa diakses
- [ ] **Update `.env.local`** di web app dengan IP PC (jika perlu)
- [ ] **Setup Retrofit/OkHttp** di Android dengan base URL yang benar
- [ ] **Tambahkan Internet Permission** di AndroidManifest.xml
- [ ] **Enable Cleartext Traffic** untuk HTTP (jika tidak pakai HTTPS)
- [ ] **Test semua CRUD operations** dari Android
- [ ] **Handle error** dengan baik (network error, timeout, dll)
- [ ] **Siapkan alternatif** (ngrok atau hosting) jika IP lokal tidak bekerja

---

## 🎓 Tips untuk Presentasi UAS

1. **Jelaskan alasan menggunakan IP lokal** (development, testing)
2. **Tunjukkan test dari browser Android** untuk membuktikan API bisa diakses
3. **Siapkan backup plan** (ngrok atau hosting) jika demo tidak berjalan
4. **Jelaskan flow lengkap**: XAMPP → IP PC → Android App
5. **Tunjukkan error handling** jika koneksi gagal

---

## 🚨 Troubleshooting

### **Error: "Unable to resolve host"**

- ✅ Pastikan IP PC benar
- ✅ Pastikan PC dan Android di WiFi yang sama
- ✅ Test dari browser Android dulu

### **Error: "Connection refused"**

- ✅ Pastikan XAMPP Apache running
- ✅ Cek firewall PC
- ✅ Pastikan port 80 tidak digunakan aplikasi lain

### **Error: "Cleartext HTTP traffic not permitted"**

- ✅ Tambahkan `android:usesCleartextTraffic="true"` di AndroidManifest.xml
- ✅ Atau gunakan HTTPS (ngrok atau hosting)

### **IP PC berubah setiap hari**

- ✅ Set static IP di router
- ✅ Atau gunakan ngrok/hosting untuk URL tetap

---

## 📚 Referensi

- [Android Network Security Config](https://developer.android.com/training/articles/security-config)
- [Retrofit Documentation](https://square.github.io/retrofit/)
- [Ngrok Documentation](https://ngrok.com/docs)
- [OkHttp Documentation](https://square.github.io/okhttp/)

---

**Selamat mengerjakan UAS! 🎉**
