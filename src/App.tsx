import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestForm } from '@/components/rest-client/RequestForm';
import { ProductForm } from '@/components/rest-client/ProductForm';
import { TransaksiForm } from '@/components/rest-client/TransaksiForm';
import { ResponseInfo } from '@/components/rest-client/ResponseInfo';
import { ResponseBody } from '@/components/rest-client/ResponseBody';
import { HistoryPanel } from '@/components/rest-client/HistoryPanel';
import { makeRequest } from '@/utils/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { RequestConfig, ApiResponse, RequestHistory } from '@/types';

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<RequestHistory[]>(
    'rest-client-history',
    []
  );
  const [activeTab, setActiveTab] = useState('request');

  const handleSubmit = async (config: RequestConfig) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const apiResponse = await makeRequest(config);
      setResponse(apiResponse);

      // Save to history
      let historyName = `${config.method} ${config.url}`;
      try {
        const urlObj = new URL(config.url);
        historyName = `${config.method} ${urlObj.pathname}`;
      } catch {
        // Keep original name if URL parsing fails
      }

      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        name: historyName,
        config,
        response: apiResponse,
        timestamp: Date.now(),
      };

      setHistory([historyItem, ...history.slice(0, 49)]); // Keep last 50 items
    } catch (error) {
      console.error('Request error:', error);
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: 'Failed to make request' },
        time: 0,
        size: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (historyItem: RequestHistory) => {
    // Show the response from history
    if (historyItem.response) {
      setResponse(historyItem.response);
    }
    // Switch to request tab to see the response
    setActiveTab('request');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        [data-state="active"][data-slot="tabs-trigger"] {
          background-color: rgb(219 234 254) !important;
          color: rgb(29 78 216) !important;
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        <header className="pt-6 sm:pt-8 lg:pt-10 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-blue-600">REST Client</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Test dan verifikasi REST API dengan mudah. Support semua HTTP
            methods (GET, POST, PUT, PATCH, DELETE)
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6 w-full overflow-x-auto">
            <TabsList className="bg-transparent p-0 gap-2 w-max min-w-full sm:min-w-0 border-0 shadow-none inline-flex">
              <TabsTrigger
                value="request"
                className="flex-shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-blue-100 data-[state=active]:!text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                Request
              </TabsTrigger>
              <TabsTrigger
                value="produk"
                className="flex-shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-blue-100 data-[state=active]:!text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                Form Produk
              </TabsTrigger>
              <TabsTrigger
                value="transaksi"
                className="flex-shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-blue-100 data-[state=active]:!text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                Form Transaksi
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-shrink-0 px-4 sm:px-8 py-2 rounded-md transition-colors data-[state=active]:!bg-blue-100 data-[state=active]:!text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 whitespace-nowrap">
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="request" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Request Form dan Response Info Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                <div className="flex w-full">
                  <RequestForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
                <div className="flex w-full">
                  <ResponseInfo response={response} />
                </div>
              </div>

              {/* Response Body Full Width */}
              {response && (
                <div>
                  <ResponseBody response={response} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="produk" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Product Form dan Response Info Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                <div className="flex w-full">
                  <ProductForm onSubmit={handleSubmit} isLoading={isLoading} response={response} />
                </div>
                <div className="flex w-full">
                  <ResponseInfo response={response} />
                </div>
              </div>

              {/* Response Body Full Width */}
              {response && (
                <div>
                  <ResponseBody response={response} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transaksi" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Transaksi Form dan Response Info Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                <div className="flex w-full">
                  <TransaksiForm onSubmit={handleSubmit} isLoading={isLoading} response={response} />
                </div>
                <div className="flex w-full">
                  <ResponseInfo response={response} />
                </div>
              </div>

              {/* Response Body Full Width */}
              {response && (
                <div>
                  <ResponseBody response={response} />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 sm:mt-6">
            <HistoryPanel
              history={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              onClear={handleClearHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
