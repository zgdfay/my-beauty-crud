/**
 * CONTOH IMPLEMENTASI API DI ANDROID KOTLIN
 * 
 * File ini berisi contoh kode lengkap untuk mengakses API dari Android Kotlin
 * Copy-paste dan sesuaikan dengan struktur project Anda
 */

// ============================================
// 1. CONFIG.kt - Konfigurasi Base URL
// ============================================
// Lokasi: app/src/main/java/com/yourapp/config/Config.kt

object Config {
    /**
     * ⚠️ PENTING: Base URL HARUS menggunakan IP PC, BUKAN localhost!
     * 
     * Format Base URL:
     * - http://[IP_PC]/dbrest/api/
     * - Pastikan ada "/" di akhir
     * 
     * Contoh:
     * - http://192.168.1.100/dbrest/api/
     * - http://192.168.43.1/dbrest/api/
     * - http://10.0.2.2/dbrest/api/ (jika pakai Android Emulator)
     */
    
    // ✅ DEVELOPMENT: Ganti dengan IP PC Anda (WAJIB!)
    // Cara cari IP: Windows (ipconfig) atau Mac/Linux (ifconfig)
    const val BASE_URL_DEV = "http://192.168.1.100/dbrest/api/"
    
    // ✅ ANDROID EMULATOR: Gunakan ini jika pakai Android Emulator
    // 10.0.2.2 adalah IP khusus untuk akses localhost PC dari emulator
    const val BASE_URL_EMULATOR = "http://10.0.2.2/dbrest/api/"
    
    // ✅ NGROK: Untuk testing dari internet (jika IP lokal tidak bekerja)
    const val BASE_URL_NGROK = "https://xxxx-xxxx-xxxx.ngrok.io/dbrest/api/"
    
    // ✅ PRODUCTION: URL hosting untuk production
    const val BASE_URL_PROD = "https://yourdomain.com/dbrest/api/"
    
    /**
     * Pilih salah satu base URL sesuai kondisi:
     * - BASE_URL_DEV: Untuk device Android fisik di WiFi yang sama
     * - BASE_URL_EMULATOR: Untuk Android Emulator
     * - BASE_URL_NGROK: Untuk testing dari internet
     * - BASE_URL_PROD: Untuk production
     */
    const val BASE_URL = BASE_URL_DEV // ⬅️ GANTI INI dengan IP PC Anda!
}

// ============================================
// 2. Data Models
// ============================================
// Lokasi: app/src/main/java/com/yourapp/model/Product.kt

data class Product(
    val id: String? = null,
    val id_produk: String? = null,
    val nama_produk: String,
    val kategori: String,
    val harga: String,
    val stok: String,
    val deskripsi: String? = null
)

data class ProductRequest(
    val id: String? = null,
    val id_produk: String? = null,
    val nama_produk: String,
    val kategori: String,
    val harga: String,
    val stok: String,
    val deskripsi: String? = null
)

data class Transaksi(
    val id: String? = null,
    val id_transaksi: String? = null,
    val product_id: String,
    val qty: String,
    val total_harga: String,
    val tanggal: String? = null
)

data class TransaksiRequest(
    val product_id: String,
    val qty: String,
    val total_harga: String? = null // Optional untuk POST
)

// Generic API Response
data class ApiResponse<T>(
    val success: Boolean? = null,
    val message: String? = null,
    val data: T? = null,
    val error: String? = null
)

// ============================================
// 3. ApiService.kt - Interface Retrofit
// ============================================
// Lokasi: app/src/main/java/com/yourapp/network/ApiService.kt

import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // ========== PRODUCT API ==========
    
    // GET All Products
    @GET("produk.php")
    suspend fun getAllProducts(): Response<ApiResponse<List<Product>>>
    
    // GET Product by ID
    @GET("produk.php")
    suspend fun getProductById(@Query("id") id: String): Response<ApiResponse<Product>>
    
    // POST Create Product
    @POST("produk.php")
    @Headers("Content-Type: application/json")
    suspend fun createProduct(@Body product: ProductRequest): Response<ApiResponse<Product>>
    
    // PUT Update Product
    @PUT("produk.php")
    @Headers("Content-Type: application/json")
    suspend fun updateProduct(@Body product: ProductRequest): Response<ApiResponse<Product>>
    
    // PATCH Update Product
    @PATCH("produk.php")
    @Headers("Content-Type: application/json")
    suspend fun patchProduct(@Body product: ProductRequest): Response<ApiResponse<Product>>
    
    // DELETE Product
    @DELETE("produk.php")
    suspend fun deleteProduct(@Query("id") id: String): Response<ApiResponse<Unit>>
    
    // ========== TRANSAKSI API ==========
    
    // GET All Transaksi
    @GET("transaksi.php")
    suspend fun getAllTransaksi(): Response<ApiResponse<List<Transaksi>>>
    
    // GET Transaksi by ID
    @GET("transaksi.php")
    suspend fun getTransaksiById(@Query("id") id: String): Response<ApiResponse<Transaksi>>
    
    // POST Create Transaksi (hanya product_id dan qty)
    @POST("transaksi.php")
    @Headers("Content-Type: application/json")
    suspend fun createTransaksi(@Body transaksi: TransaksiRequest): Response<ApiResponse<Transaksi>>
    
    // PUT Update Transaksi
    @PUT("transaksi.php")
    @Headers("Content-Type: application/json")
    suspend fun updateTransaksi(@Body transaksi: TransaksiRequest): Response<ApiResponse<Transaksi>>
    
    // DELETE Transaksi
    @DELETE("transaksi.php")
    suspend fun deleteTransaksi(@Query("id") id: String): Response<ApiResponse<Unit>>
}

// ============================================
// 4. ApiClient.kt - Setup Retrofit
// ============================================
// Lokasi: app/src/main/java/com/yourapp/network/ApiClient.kt

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // Logging interceptor untuk debugging
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY // Lihat request/response di Logcat
    }
    
    // OkHttp Client dengan timeout
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    // Retrofit instance
    private val retrofit = Retrofit.Builder()
        .baseUrl(Config.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}

// ============================================
// 5. Repository Pattern (Opsional tapi Recommended)
// ============================================
// Lokasi: app/src/main/java/com/yourapp/repository/ProductRepository.kt

import android.util.Log

class ProductRepository {
    private val apiService = ApiClient.apiService
    
    suspend fun getAllProducts(): Result<List<Product>> {
        return try {
            val response = apiService.getAllProducts()
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception("Data kosong"))
                }
            } else {
                Result.failure(Exception("Error: ${response.code()} - ${response.message()}"))
            }
        } catch (e: Exception) {
            Log.e("ProductRepository", "Error: ${e.message}", e)
            Result.failure(e)
        }
    }
    
    suspend fun getProductById(id: String): Result<Product> {
        return try {
            val response = apiService.getProductById(id)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception("Product tidak ditemukan"))
                }
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e("ProductRepository", "Error: ${e.message}", e)
            Result.failure(e)
        }
    }
    
    suspend fun createProduct(product: ProductRequest): Result<Product> {
        return try {
            val response = apiService.createProduct(product)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception("Gagal membuat product"))
                }
            } else {
                val errorBody = response.errorBody()?.string()
                Result.failure(Exception("Error: ${response.code()} - $errorBody"))
            }
        } catch (e: Exception) {
            Log.e("ProductRepository", "Error: ${e.message}", e)
            Result.failure(e)
        }
    }
    
    suspend fun updateProduct(product: ProductRequest): Result<Product> {
        return try {
            val response = apiService.updateProduct(product)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception("Gagal update product"))
                }
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e("ProductRepository", "Error: ${e.message}", e)
            Result.failure(e)
        }
    }
    
    suspend fun deleteProduct(id: String): Result<Unit> {
        return try {
            val response = apiService.deleteProduct(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Log.e("ProductRepository", "Error: ${e.message}", e)
            Result.failure(e)
        }
    }
}

// ============================================
// 6. ViewModel (MVVM Pattern)
// ============================================
// Lokasi: app/src/main/java/com/yourapp/viewmodel/ProductViewModel.kt

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ProductViewModel : ViewModel() {
    private val repository = ProductRepository()
    
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage
    
    fun loadProducts() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            repository.getAllProducts()
                .onSuccess { products ->
                    _products.value = products
                }
                .onFailure { error ->
                    _errorMessage.value = error.message ?: "Terjadi kesalahan"
                }
            
            _isLoading.value = false
        }
    }
    
    fun createProduct(product: ProductRequest) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            repository.createProduct(product)
                .onSuccess {
                    loadProducts() // Reload list setelah create
                }
                .onFailure { error ->
                    _errorMessage.value = error.message ?: "Gagal membuat product"
                }
            
            _isLoading.value = false
        }
    }
    
    fun updateProduct(product: ProductRequest) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            repository.updateProduct(product)
                .onSuccess {
                    loadProducts() // Reload list setelah update
                }
                .onFailure { error ->
                    _errorMessage.value = error.message ?: "Gagal update product"
                }
            
            _isLoading.value = false
        }
    }
    
    fun deleteProduct(id: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            repository.deleteProduct(id)
                .onSuccess {
                    loadProducts() // Reload list setelah delete
                }
                .onFailure { error ->
                    _errorMessage.value = error.message ?: "Gagal menghapus product"
                }
            
            _isLoading.value = false
        }
    }
}

// ============================================
// 7. AndroidManifest.xml - Permissions
// ============================================
/*
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Internet Permission -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:usesCleartextTraffic="true"  <!-- Penting untuk HTTP (non-HTTPS) -->
        ...>
        ...
    </application>
</manifest>
*/

// ============================================
// 8. build.gradle (Module: app) - Dependencies
// ============================================
/*
dependencies {
    // Retrofit
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    
    // OkHttp (sudah include di Retrofit, tapi bisa tambah logging)
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // ViewModel
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
}
*/

// ============================================
// 9. Contoh Penggunaan di Activity/Fragment
// ============================================
/*
class MainActivity : AppCompatActivity() {
    private lateinit var viewModel: ProductViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        viewModel = ViewModelProvider(this)[ProductViewModel::class.java]
        
        // Observe products
        lifecycleScope.launch {
            viewModel.products.collect { products ->
                // Update UI dengan products
                adapter.submitList(products)
            }
        }
        
        // Observe loading
        lifecycleScope.launch {
            viewModel.isLoading.collect { isLoading ->
                progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            }
        }
        
        // Observe error
        lifecycleScope.launch {
            viewModel.errorMessage.collect { error ->
                error?.let {
                    Toast.makeText(this@MainActivity, it, Toast.LENGTH_SHORT).show()
                }
            }
        }
        
        // Load products
        viewModel.loadProducts()
    }
}
*/

