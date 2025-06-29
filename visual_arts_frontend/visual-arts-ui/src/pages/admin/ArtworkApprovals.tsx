import { useEffect, useState } from "react";
import API from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import { ChevronDown, ChevronUp, Search, Filter, Download, RotateCw, Eye, Info, Mail } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

type Artwork = {
  id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  artist_name: string;
  artist_email: string;
  submission_date: string;
  rejection_count?: number;
  approval_status: "pending" | "approved" | "rejected";
};

type SortConfig = {
  key: keyof Artwork;
  direction: "asc" | "desc";
};

type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
};

export default function ArtworkApprovals() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "submission_date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchArtworks();
    fetchStats();
  }, []);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      let endpoint = "/artwork/";
      if (statusFilter !== "all") {
        endpoint += `?approval_status=${statusFilter}`;
      }
      const res = await API.get(endpoint);
      setArtworks(res.data.results || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch artworks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/artwork/stats/");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await API.patch(`/artwork/${id}/approve/`);
      fetchArtworks();
      fetchStats();
      setShowDialog(false);
      toast({
        title: "Success",
        description: "Artwork approved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve artwork.",
      });
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selectedIds.map(id => API.patch(`/artwork/${id}/approve/`)));
      fetchArtworks();
      fetchStats();
      setSelectedIds([]);
      toast({
        title: "Success",
        description: `${selectedIds.length} artwork(s) approved successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve selected artworks.",
      });
    }
  };

  const handleReject = async () => {
    if (!selected || !feedback.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Feedback is required to reject an artwork.",
      });
      return;
    }
    try {
      await API.patch(`/artwork/${selected.id}/reject/`, { feedback });
      fetchArtworks();
      fetchStats();
      setShowDialog(false);
      setFeedback("");
      toast({
        title: "Success",
        description: "Artwork rejected with feedback.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject artwork.",
      });
    }
  };

  const handleBulkReject = async () => {
    if (!feedback.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Feedback is required for bulk rejection.",
      });
      return;
    }
    try {
      await Promise.all(selectedIds.map(id => API.patch(`/artwork/${id}/reject/`, { feedback })));
      fetchArtworks();
      fetchStats();
      setSelectedIds([]);
      setShowDialog(false);
      setFeedback("");
      toast({
        title: "Success",
        description: `${selectedIds.length} artwork(s) rejected with feedback.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject selected artworks.",
      });
    }
  };

  const handleSort = (key: keyof Artwork) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedArtworks = [...artworks]
    .filter(art => 
      (searchQuery === "" || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (categoryFilter === "" || art.category === categoryFilter)
    )
    .sort((a, b) => {
      const factor = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? factor : -factor;
    });

  const paginatedArtworks = sortedArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(new Set(artworks.map(art => art.category)));

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Artist", "Category", "Status", "Submission Date"];
    const rows = artworks.map(art => [
      art.id,
      `"${art.title}"`,
      `"${art.artist_name}"`,
      `"${art.category}"`,
      `"${art.approval_status}"`,
      new Date(art.submission_date).toISOString()
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `artwork_approvals_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Artwork Approvals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and review submitted artworks from artists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={fetchArtworks} disabled={isLoading}>
            <RotateCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</h3>
            <Badge variant="secondary">{stats.pending}</Badge>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
          <Progress value={stats.total ? (stats.pending / stats.total) * 100 : 0} className="h-2 mt-2" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</h3>
            <Badge variant="success">{stats.approved}</Badge>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.approved}</p>
          <Progress value={stats.total ? (stats.approved / stats.total) * 100 : 0} className="h-2 mt-2" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</h3>
            <Badge variant="destructive">{stats.rejected}</Badge>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.rejected}</p>
          <Progress value={stats.total ? (stats.rejected / stats.total) * 100 : 0} className="h-2 mt-2" />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search artworks by title, artist or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: "pending" | "approved" | "rejected" | "all") => setStatusFilter(value)}>
    <SelectTrigger className="w-[180px]">
      <Filter className="w-4 h-4 mr-2" />
      <SelectValue placeholder="Filter by status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="approved">Approved</SelectItem>
      <SelectItem value="rejected">Rejected</SelectItem>
    </SelectContent>
    </Select>

    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-[180px]">
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map(category => (
          <SelectItem key={category} value={category}>{category}</SelectItem>
        ))}
      </SelectContent>
    </Select>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handleBulkApprove} size="sm" className="gap-2">
              <Checkbox className="w-4 h-4" checked />
              Approve Selected ({selectedIds.length})
            </Button>
            <Button variant="destructive" onClick={() => setShowDialog(true)} size="sm">
              Reject Selected ({selectedIds.length})
            </Button>
            <Button variant="outline" onClick={() => setSelectedIds([])} size="sm">
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as "list" | "grid")}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RotateCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : viewMode === "list" ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === artworks.length && artworks.length > 0}
                    onCheckedChange={(checked) => {
                      setSelectedIds(checked ? artworks.map(art => art.id) : []);
                    }}
                  />
                </TableHead>
                <TableHead>Preview</TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    {sortConfig.key === "title" && (sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort("artist_name")}
                >
                  <div className="flex items-center gap-1">
                    Artist
                    {sortConfig.key === "artist_name" && (sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortConfig.key === "category" && (sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort("submission_date")}
                >
                  <div className="flex items-center gap-1">
                    Submitted
                    {sortConfig.key === "submission_date" && (sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArtworks.length > 0 ? (
                paginatedArtworks.map((art) => (
                  <TableRow key={art.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(art.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(checked
                            ? [...selectedIds, art.id]
                            : selectedIds.filter(id => id !== art.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                setSelected(art);
                                setShowPreviewDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview artwork</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="line-clamp-1">{art.title}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{art.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {art.artist_name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-6 h-6"
                                onClick={() => window.open(`mailto:${art.artist_email}`)}
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Contact artist</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>{art.category}</TableCell>
                    <TableCell>
                      {new Date(art.submission_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      {art.approval_status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {art.approval_status === "approved" && (
                        <Badge variant="success">Approved</Badge>
                      )}
                      {art.approval_status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {art.approval_status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(art.id)}>Approve</Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelected(art);
                                setShowDialog(true);
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {art.approval_status === "rejected" && art.rejection_count && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rejected {art.rejection_count} time(s)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No artworks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedArtworks.map((art) => (
            <div key={art.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => {
                    setSelected(art);
                    setShowPreviewDialog(true);
                  }}
                />
                <div className="absolute top-2 right-2">
                  {art.approval_status === "pending" && (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                  {art.approval_status === "approved" && (
                    <Badge variant="success">Approved</Badge>
                  )}
                  {art.approval_status === "rejected" && (
                    <Badge variant="destructive">Rejected</Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedIds.includes(art.id)}
                    onCheckedChange={(checked) => {
                      setSelectedIds(checked
                        ? [...selectedIds, art.id]
                        : selectedIds.filter(id => id !== art.id)
                      );
                    }}
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{art.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{art.artist_name}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {art.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(art.submission_date).toLocaleDateString()}
                  </span>
                </div>
                {art.approval_status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleApprove(art.id)}>Approve</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setSelected(art);
                        setShowDialog(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedArtworks.length)} of {sortedArtworks.length} artworks
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.ceil(sortedArtworks.length / itemsPerPage) }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(currentPage + 2, Math.ceil(sortedArtworks.length / itemsPerPage)))
              .map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage * itemsPerPage >= sortedArtworks.length}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reject {selectedIds.length > 0 ? "Selected Artworks" : "Artwork"}</DialogTitle>
            <DialogDescription>
              Provide constructive feedback to help the artist improve their submission
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img src={selected.image} alt={selected.title} className="w-32 h-32 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{selected.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">By: {selected.artist_name}</p>
                  <p className="text-sm mt-2 line-clamp-3">{selected.description}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rejection Feedback</label>
                <Textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Be specific about what needs improvement. Example: 'The composition could be stronger with better contrast...'"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">You are about to reject {selectedIds.length} artworks. Please provide feedback that will be sent to all artists.</p>
              <div>
                <label className="block text-sm font-medium mb-1">Rejection Feedback</label>
                <Textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="General feedback that applies to all selected artworks..."
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={selectedIds.length > 0 ? handleBulkReject : handleReject}
              disabled={!feedback.trim()}
            >
              Submit Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>By {selected?.artist_name}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <img 
                  src={selected.image} 
                  alt={selected.title} 
                  className="max-h-[400px] object-contain rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                  <p>{selected.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</h4>
                  <p>{new Date(selected.submission_date).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                  <p className="whitespace-pre-line">{selected.description}</p>
                </div>
                {selected.approval_status === "pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => handleApprove(selected.id)}>Approve</Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowPreviewDialog(false);
                        setShowDialog(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}