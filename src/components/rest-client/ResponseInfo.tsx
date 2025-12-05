import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Clock, Database, AlertCircle } from 'lucide-react';
import type { ApiResponse } from '@/types';
import { getStatusColor } from '@/utils/colors';

// Helper function untuk extract error message dari response
const extractErrorMessage = (data: any): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // Cek berbagai format error message
  if (data.error) {
    return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
  }
  if (data.message && (data.status === 'error' || data.success === false)) {
    return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
  }
  if (data.msg) {
    return typeof data.msg === 'string' ? data.msg : JSON.stringify(data.msg);
  }
  if (data.errors && Array.isArray(data.errors)) {
    return data.errors.join(', ');
  }
  if (data.errors && typeof data.errors === 'object') {
    return JSON.stringify(data.errors);
  }

  return null;
};

interface ResponseInfoProps {
  response: ApiResponse | null;
}

export function ResponseInfo({ response }: ResponseInfoProps) {
  if (!response) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm h-full flex flex-col w-full">
        <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4 flex-shrink-0">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Response</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
            Response akan muncul di sini setelah request dikirim
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 flex-1 flex items-center justify-center">
          <div className="text-gray-400">
            <p>Belum ada response</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  const isError = response.status >= 400 || response.status === 0;
  const errorMessage = extractErrorMessage(response.data);

  return (
    <Card className="bg-white border-gray-200 shadow-sm h-full flex flex-col w-full">
      <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Response</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
              Hasil dari request yang dikirim
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs sm:text-sm border font-medium ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </Badge>
            {isSuccess ? (
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 space-y-4 flex-1 flex flex-col min-h-0">
        {/* Response Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700">Time</p>
              <p className="text-xs text-blue-600">{response.time} ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Database className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-700">Size</p>
              <p className="text-xs text-purple-600">
                {(response.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${isSuccess ? 'bg-green-50 border-green-200' : isError ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-sm font-medium ${isSuccess ? 'text-green-700' : isError ? 'text-red-700' : 'text-amber-700'}`}>Status</p>
            <p className={`text-xs ${isSuccess ? 'text-green-600' : isError ? 'text-red-600' : 'text-amber-600'}`}>
              {isSuccess ? 'Success' : isError ? 'Error' : 'Warning'}
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 flex-shrink-0" />

        {/* Error Message Alert */}
        {isError && errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 mb-1">Error Message</h4>
                <p className="text-sm text-red-800 break-words">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Headers */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 flex-shrink-0">Response Headers</h3>
          <ScrollArea className="flex-1 w-full border border-gray-200 rounded-md p-3 bg-gray-50 min-h-0">
            <div className="space-y-1">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="text-xs font-mono">
                  <span className="text-gray-500">{key}:</span>{' '}
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

