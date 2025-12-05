import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import type { ApiResponse } from '@/types';

interface ResponseBodyProps {
  response: ApiResponse | null;
}

// Helper function untuk extract error message dari response
const extractErrorMessage = (data: any): string | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // Cek berbagai format error message
  if (data.error) {
    return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
  }
  if (data.message) {
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

// Helper function untuk cek apakah response adalah error
const isErrorResponse = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Cek berbagai indikator error
  if (data.error || data.message || data.msg || data.errors) {
    return true;
  }
  if (data.status === 'error' || data.success === false) {
    return true;
  }

  return false;
};

export function ResponseBody({ response }: ResponseBodyProps) {
  if (!response) {
    return null;
  }

  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Response Body</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
          JSON response dari server
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <ScrollArea className="h-64 sm:h-96 w-full border border-gray-200 rounded-md bg-gray-50 overflow-auto">
          <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono whitespace-pre text-gray-800 block min-w-max">
            {formatJson(response.data)}
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

