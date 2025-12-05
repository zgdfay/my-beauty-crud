import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { History, Trash2, AlertTriangle } from 'lucide-react';
import type { RequestHistory } from '@/types';
import { format } from 'date-fns';
import { getMethodColor, getStatusColor } from '@/utils/colors';

interface HistoryPanelProps {
  history: RequestHistory[];
  onSelect: (history: RequestHistory) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onDelete, onClear }: HistoryPanelProps) {
  const [openClearDialog, setOpenClearDialog] = useState(false);

  if (history.length === 0) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
            <History className="h-5 w-5" />
            History
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
            Riwayat request yang pernah dikirim
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>Belum ada history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
              <History className="h-5 w-5" />
              History
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
              {history.length} request tersimpan
            </CardDescription>
          </div>
          <AlertDialog open={openClearDialog} onOpenChange={setOpenClearDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <AlertDialogTitle className="text-left text-base sm:text-lg">
                      Hapus Semua History?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left text-sm text-gray-600 mt-2">
                      Apakah Anda yakin ingin menghapus semua history? Tindakan ini tidak dapat dibatalkan.
                      <span className="font-medium text-gray-900 mt-1 block">
                        {history.length} request akan dihapus.
                      </span>
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="w-full sm:w-auto m-0">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClear();
                    setOpenClearDialog(false);
                  }}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                  Ya, Hapus Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <ScrollArea className="h-[300px] sm:h-[400px]">
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Badge variant="outline" className={`border ${getMethodColor(item.config.method)} font-medium flex-shrink-0`}>
                      {item.config.method}
                    </Badge>
                    <span className="text-sm font-medium truncate text-gray-900">
                      {item.name || item.config.url}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">
                  {item.config.url}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {format(new Date(item.timestamp), 'PPp')}
                  </p>
                  {item.response && (
                    <Badge
                      variant="outline"
                      className={`text-xs border font-medium ${getStatusColor(item.response.status)}`}
                    >
                      {item.response.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

