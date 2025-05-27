import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Eye,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Mail
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Sample user data for demonstration
const SAMPLE_USERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    createdAt: '2025-03-15',
    status: 'active',
    lastLogin: '2025-05-24',
    orders: 12,
    totalSpent: 875.45
  },
  {
    id: 2,
    name: 'Michael Davis',
    email: 'michael.d@example.com',
    createdAt: '2025-01-22',
    status: 'active',
    lastLogin: '2025-05-23',
    orders: 8,
    totalSpent: 562.30
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    createdAt: '2025-04-10',
    status: 'active',
    lastLogin: '2025-05-20',
    orders: 5,
    totalSpent: 325.75
  },
  {
    id: 4,
    name: 'James Smith',
    email: 'james.s@example.com',
    createdAt: '2024-11-05',
    status: 'blocked',
    lastLogin: '2025-04-30',
    orders: 3,
    totalSpent: 189.50
  },
  {
    id: 5,
    name: 'Olivia Brown',
    email: 'olivia.b@example.com',
    createdAt: '2025-02-18',
    status: 'active',
    lastLogin: '2025-05-22',
    orders: 15,
    totalSpent: 1247.65
  },
  {
    id: 6,
    name: 'Noah Jones',
    email: 'noah.j@example.com',
    createdAt: '2024-12-07',
    status: 'active',
    lastLogin: '2025-05-18',
    orders: 6,
    totalSpent: 423.90
  }
];

export default function AdminUsers() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const usersPerPage = 10;
  const { toast } = useToast();

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleToggleUserStatus = (userId: number) => {
    // In a real application, you would call your API to update the user status
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'blocked' : 'active';
    
    toast({
      title: `User ${newStatus === 'active' ? 'unblocked' : 'blocked'}`,
      description: `${user?.name} has been ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully.`,
    });
    
    setIsBlockDialogOpen(false);
  };

  const openViewDialog = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openBlockDialog = (user: any) => {
    setSelectedUser(user);
    setIsBlockDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your registered customers</p>
        </div>

        <Card>
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>User List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Blocked'}
                        </span>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openViewDialog(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openBlockDialog(user)}
                          >
                            {user.status === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  {selectedUser.email}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    <span 
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedUser.status === 'active' ? 'Active' : 'Blocked'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{selectedUser.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-medium">${selectedUser.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                openBlockDialog(selectedUser);
              }}
            >
              {selectedUser?.status === 'active' ? 'Block User' : 'Unblock User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === 'active' ? 'Block User' : 'Unblock User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'active'
                ? 'Are you sure you want to block this user? They will not be able to login or place orders.'
                : 'Are you sure you want to unblock this user? They will regain full access to their account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.status === 'active' ? 'destructive' : 'default'}
              onClick={() => selectedUser && handleToggleUserStatus(selectedUser.id)}
            >
              {selectedUser?.status === 'active' ? 'Block User' : 'Unblock User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}