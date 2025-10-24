import { Clock, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchHistoryItem } from "@shared/schema";

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onRerun: (item: SearchHistoryItem) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onRerun, onClear }: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Searches
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  data-testid="button-clear-history"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-auto max-h-64">
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-md border hover-elevate"
                      data-testid={`history-item-${item.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.businessType} in {item.location}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{item.resultCount} results</span>
                          <span>•</span>
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRerun(item)}
                        data-testid={`button-rerun-${item.id}`}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
