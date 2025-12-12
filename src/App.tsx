import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductTable } from '@/components/rest-client/ProductTable';
import { TransaksiTable } from '@/components/rest-client/TransaksiTable';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [activeTab, setActiveTab] = useState('tabel-produk');

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        [data-state="active"][data-slot="tabs-trigger"] {
          background-color: rgb(252 231 243) !important;
          color: rgb(219 39 119) !important;
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        <header className="pt-6 sm:pt-8 lg:pt-10 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-pink-600">
            Master Data Produk dan Transaksi Skincare
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Aplikasi ini digunakan untuk mengelola data produk dan transaksi
            skincare.
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6 w-full overflow-x-auto">
            <TabsList className="bg-transparent p-0 gap-2 w-max min-w-full sm:min-w-0 border-0 shadow-none inline-flex">
              <TabsTrigger
                value="tabel-produk"
                className="flex-shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-pink-100 data-[state=active]:!text-pink-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                Tabel Produk
              </TabsTrigger>
              <TabsTrigger
                value="tabel-transaksi"
                className="shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-pink-100 data-[state=active]:!text-pink-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                Tabel Transaksi
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tabel-produk" className="mt-4 sm:mt-6">
            <ProductTable />
          </TabsContent>

          <TabsContent value="tabel-transaksi" className="mt-4 sm:mt-6">
            <TransaksiTable />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
