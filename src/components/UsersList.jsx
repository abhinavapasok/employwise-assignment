import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from './ui/pagination';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from './ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './ui/tooltip';
import { Search, Trash2, Edit, LogOut, Filter, SortAsc, SortDesc } from 'lucide-react';
import api from '../services/api'

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  
  // New state for sorting and filtering
  const [sortField, setSortField] = useState('first_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterField, setFilterField] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers(page);
    }
  }, [page, navigate]);

  const fetchUsers = async (pageNum) => {
    try {
      const response = await api.get(`/users?page=${pageNum}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/users/${selectedUser.id}`);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditUser = async () => {
    if (!editFirstName || !editLastName || !editEmail) {
      setEditError('All fields are required');
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.put(`/users/${selectedUser.id}`, {
        first_name: editFirstName,
        last_name: editLastName,
        email: editEmail,
      });

      // Update the user in the list
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, first_name: editFirstName, last_name: editLastName, email: editEmail }
          : user
      );
      setUsers(updatedUsers);

      toast.success('User updated successfully');
      setEditDialogOpen(false);
      setEditError('');
    } catch (err) {
      setEditError('Failed to update user');
      toast.error('Failed to update user');
    }
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setEditFirstName(user.first_name);
    setEditLastName(user.last_name);
    setEditEmail(user.email);
    setEditDialogOpen(true);
    setEditError('');
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Enhanced filtering and sorting logic using useMemo
  const processedUsers = useMemo(() => {
    let result = users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by specific field if selected
    if (filterField) {
      result = result.filter(user => 
        user[filterField] && user[filterField].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    result.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, filterField, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                  <Filter className="ml-2 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first_name">First Name</SelectItem>
                  <SelectItem value="last_name">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select a field to filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  setSortField(prev => prev === 'first_name' ? 'last_name' : 'first_name');
                  toggleSortDirection();
                }}
              >
                {sortDirection === 'asc' ? <SortAsc /> : <SortDesc />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Sort Field and Direction</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="items-center">
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openEditDialog(user)}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => openDeleteDialog(user)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={pageNum === page}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information below.
            </DialogDescription>
          </DialogHeader>
          
          {editError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
              {editError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="firstName" className="text-right">
                First Name
              </label>
              <Input
                id="firstName"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastName" className="text-right">
                Last Name
              </label>
              <Input
                id="lastName"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              {selectedUser && ` ${selectedUser.first_name} ${selectedUser.last_name}`} 
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersList;