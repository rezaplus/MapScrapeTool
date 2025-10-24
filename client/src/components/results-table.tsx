import { Download, ExternalLink, Star, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessResult } from "@shared/schema";

interface ResultsTableProps {
  results: BusinessResult[];
  isLoading: boolean;
  onExportAll: () => void;
  onExportSingle: (result: BusinessResult) => void;
}

export function ResultsTable({
  results,
  isLoading,
  onExportAll,
  onExportSingle,
}: ResultsTableProps) {
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!results || results.length === 0) {
    return (
      <section className="py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      No results yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start a search above to extract business data from Google Maps
                    </p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Quick tips:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Be specific with your location (city, state)</li>
                      <li>• Use common business categories</li>
                      <li>• Try different search terms if no results</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" id="results">
      <div className="container px-4">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Search Results</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {results?.length || 0} {results?.length === 1 ? 'result' : 'results'}
                  </p>
                </div>
                <Button
                  onClick={onExportAll}
                  size="sm"
                  data-testid="button-export-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold w-48">Business Name</TableHead>
                        <TableHead className="font-semibold">Address</TableHead>
                        <TableHead className="font-semibold">Rating</TableHead>
                        <TableHead className="font-semibold">Phone</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Website</TableHead>
                        <TableHead className="font-semibold w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results?.map((result) => (
                        <TableRow
                          key={result.id}
                          className="hover-elevate"
                          data-testid={`row-result-${result.id}`}
                        >
                          <TableCell className="font-medium">
                            <div className="space-y-1">
                              <div>{result.name}</div>
                              {result.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2 max-w-xs">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{result.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.rating ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{result.rating.toFixed(1)}</span>
                                {result.reviewCount && (
                                  <span className="text-xs text-muted-foreground">
                                    ({result.reviewCount})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-mono">{result.phone}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.email ? (
                              <a
                                href={`mailto:${result.email}`}
                                className="text-sm text-primary hover:underline"
                              >
                                {result.email}
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.website ? (
                              <a
                                href={result.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline text-sm"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Link
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onExportSingle(result)}
                              data-testid={`button-export-${result.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
