
import { useState, useEffect } from "react";
import { useTrainer } from "@/context/trainer-context";
import { Link } from "react-router-dom";
import { ChevronLeft, Clock, Sword, Coins, Filter, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { BattleRequest, Facility } from "@/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const BattleBulletinPage = () => {
  const { trainer, battleRequests, createBattleRequest, acceptBattleRequest, cancelBattleRequest, getBattleRequests, getMyBattleRequests } = useTrainer();
  const [currentTab, setCurrentTab] = useState("browse");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<BattleRequest[]>([]);
  const [myRequests, setMyRequests] = useState<BattleRequest[]>([]);
  
  // Filter states
  const [facilityFilter, setFacilityFilter] = useState<string>("");
  const [battleStyleFilter, setBattleStyleFilter] = useState<string>("");
  const [minTokensFilter, setMinTokensFilter] = useState<string>("");
  const [maxTokensFilter, setMaxTokensFilter] = useState<string>("");
  
  // New request states
  const [newRequest, setNewRequest] = useState({
    facilityId: "",
    facilityName: "",
    battleStyle: "Singles",
    time: "",
    tokensWagered: 1,
    notes: ""
  });
  
  // Fetch battle requests when tab changes
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (currentTab === "browse") {
          const data = await getBattleRequests();
          setRequests(data);
        } else {
          const data = await getMyBattleRequests();
          setMyRequests(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch battle requests");
      }
      setLoading(false);
    };
    
    fetchRequests();
  }, [currentTab, getBattleRequests, getMyBattleRequests]);
  
  // Mock facilities data for selecting in the post form
  const facilities: Facility[] = [
    { 
      id: "f1", 
      name: "Battle Tower", 
      description: "Test your strength in vertical battles", 
      image: "/assets/facilities/tower.jpg",
      battleStyle: "Singles",
      rules: ["3v3 Singles", "Level 50 Only"],
      entryRequirements: ["Trainer License"],
      badgeId: "b1",
      status: "available"
    },
    { 
      id: "f2", 
      name: "Battle Dome", 
      description: "Tournament-style battles", 
      image: "/assets/facilities/dome.jpg",
      battleStyle: "Singles",
      rules: ["3v3 Singles", "No Legendaries"],
      entryRequirements: ["2 Badges"],
      badgeId: "b2",
      status: "available"
    },
    { 
      id: "f3", 
      name: "Battle Factory", 
      description: "Random rental battles", 
      image: "/assets/facilities/factory.jpg",
      battleStyle: "Doubles",
      rules: ["4v4 Doubles", "Rental Pokemon Only"],
      entryRequirements: ["1 Badge"],
      badgeId: "b3",
      status: "available"
    },
  ];
  
  // Handle facility selection in the form
  const handleFacilityChange = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      setNewRequest({
        ...newRequest,
        facilityId: facility.id,
        facilityName: facility.name,
        battleStyle: facility.battleStyle
      });
    }
  };
  
  // Handle submitting a new battle request
  const handleSubmitRequest = async () => {
    // Validate the form
    if (!newRequest.facilityId || !newRequest.time || newRequest.tokensWagered < 1) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      await createBattleRequest(newRequest);
      
      // Reset form
      setNewRequest({
        facilityId: "",
        facilityName: "",
        battleStyle: "Singles",
        time: "",
        tokensWagered: 1,
        notes: ""
      });
      
      // Switch to My Requests tab
      setCurrentTab("my-requests");
      
      // Refresh my requests
      const updatedMyRequests = await getMyBattleRequests();
      setMyRequests(updatedMyRequests);
    } catch (error) {
      console.error("Error creating battle request:", error);
    }
  };
  
  // Handle accepting a battle request
  const handleAccept = (request: BattleRequest) => {
    if (trainer && trainer.tokens < request.tokensWagered) {
      toast.error("You don't have enough tokens for this battle");
      return;
    }
    
    acceptBattleRequest(request.id);
  };
  
  // Handle canceling a battle request
  const handleCancel = async (requestId: string) => {
    try {
      await cancelBattleRequest(requestId);
      // Update the UI after cancellation
      const updatedMyRequests = await getMyBattleRequests();
      setMyRequests(updatedMyRequests);
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };
  
  // Filter battle requests based on current filters
  const filteredRequests = requests.filter(request => {
    if (facilityFilter && request.facilityId !== facilityFilter) return false;
    if (battleStyleFilter && request.battleStyle !== battleStyleFilter) return false;
    if (minTokensFilter && request.tokensWagered < parseInt(minTokensFilter)) return false;
    if (maxTokensFilter && request.tokensWagered > parseInt(maxTokensFilter)) return false;
    return true;
  });
  
  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Format time from ISO string to readable format
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date from ISO string to readable format
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };
  
  // Get status badge for battle requests
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-500">Open</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500">Accepted</Badge>;
      case "completed":
        return <Badge className="bg-atl-primary-purple">Completed</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return null;
    }
  };

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Battle Bulletin</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Battle Requests</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Facility</Label>
                    <Select 
                      value={facilityFilter} 
                      onValueChange={setFacilityFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Facilities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Facilities</SelectItem>
                        {facilities.map(facility => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Battle Style</Label>
                    <Select 
                      value={battleStyleFilter} 
                      onValueChange={setBattleStyleFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Styles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Styles</SelectItem>
                        <SelectItem value="Singles">Singles</SelectItem>
                        <SelectItem value="Doubles">Doubles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Tokens</Label>
                      <Input
                        type="number"
                        min="0"
                        value={minTokensFilter}
                        onChange={(e) => setMinTokensFilter(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Tokens</Label>
                      <Input
                        type="number"
                        min="0"
                        value={maxTokensFilter}
                        onChange={(e) => setMaxTokensFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFacilityFilter("");
                        setBattleStyleFilter("");
                        setMinTokensFilter("");
                        setMaxTokensFilter("");
                      }}
                    >
                      Reset
                    </Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Post New Request Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Post Challenge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post Battle Challenge</DialogTitle>
                  <DialogDescription>
                    Create a new battle request for other trainers to accept.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="facility">Facility</Label>
                    <Select 
                      value={newRequest.facilityId} 
                      onValueChange={handleFacilityChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map(facility => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="battleStyle">Battle Style</Label>
                    <Select 
                      value={newRequest.battleStyle} 
                      onValueChange={(value) => setNewRequest({...newRequest, battleStyle: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Battle Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Singles">Singles</SelectItem>
                        <SelectItem value="Doubles">Doubles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Date & Time</Label>
                    <Input 
                      type="datetime-local"
                      value={newRequest.time}
                      onChange={(e) => setNewRequest({...newRequest, time: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tokens">Token Wager</Label>
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNewRequest({...newRequest, tokensWagered: Math.max(1, newRequest.tokensWagered - 1)})}
                      >
                        -
                      </Button>
                      <span className="mx-4 font-medium">{newRequest.tokensWagered}</span>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setNewRequest({...newRequest, tokensWagered: Math.min(10, newRequest.tokensWagered + 1)})}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input 
                      placeholder="Any special rules or comments"
                      value={newRequest.notes}
                      onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleSubmitRequest}>Post Challenge</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="p-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="browse">Browse Challenges</TabsTrigger>
            <TabsTrigger value="my-requests">My Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            {paginatedRequests.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginatedRequests.map(request => (
                    <div key={request.id} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-atl-dark-purple">
                          {request.trainerName} ({request.trainerClass})
                        </h3>
                        <div>
                          {formatDate(request.time)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Sword className="h-3 w-3" />
                          {request.facilityName} • {request.battleStyle}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(request.time)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {request.tokensWagered} Token{request.tokensWagered > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {request.notes && (
                        <p className="text-sm text-gray-500 mb-3">{request.notes}</p>
                      )}
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleAccept(request)}
                      >
                        Accept Challenge
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
                
                {paginatedRequests.length === 0 && totalPages > 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No battle requests on this page</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <Sword className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Challenges Available</h3>
                <p className="text-gray-500 text-sm mb-6">
                  There are no open battle challenges right now.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Post Your Challenge
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Same dialog content as above */}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-requests">
            {myRequests.length > 0 ? (
              <div className="space-y-3">
                {myRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-atl-dark-purple">
                        {request.facilityName} • {request.battleStyle}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(request.time)} • {formatTime(request.time)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {request.tokensWagered} Token{request.tokensWagered > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {request.notes && (
                      <p className="text-sm text-gray-500 mb-3">{request.notes}</p>
                    )}
                    
                    {request.status === "open" && (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleCancel(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel Challenge
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Sword className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Challenges Posted</h3>
                <p className="text-gray-500 text-sm mb-6">
                  You haven't posted any battle challenges yet.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Post Challenge
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Same dialog content as above */}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattleBulletinPage;
