import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllUsers, deleteUser } from '../../../../services/operations/adminAPI'
import { VscSearch, VscFilter, VscPerson, VscMortarBoard, VscShield } from 'react-icons/vsc'
import ConfirmationModal from '../../../common/ConfirmationModal'

export default function ManageUsers() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [error, setError] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    if (!token) return

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const usersData = await getAllUsers(token)
        setUsers(usersData)
        setFilteredUsers(usersData)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.accountType === filterRole)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole])

  const getRoleIcon = (accountType) => {
    switch (accountType) {
      case 'Student':
        return <VscPerson className="text-admin-success" />
      case 'Instructor':
        return <VscMortarBoard className="text-admin-warning" />
      case 'Admin':
        return <VscShield className="text-admin-accent" />
      default:
        return <VscPerson className="text-admin-gray" />
    }
  }

  const getRoleBadge = (accountType) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (accountType) {
      case 'Student':
        return `${baseClasses} bg-admin-success/10 text-admin-success`
      case 'Instructor':
        return `${baseClasses} bg-admin-warning/10 text-admin-warning`
      case 'Admin':
        return `${baseClasses} bg-admin-accent/10 text-admin-accent`
      default:
        return `${baseClasses} bg-admin-gray/10 text-admin-gray`
    }
  }

  const handleDeleteUser = (userId, userName) => {
    setConfirmationModal({
      text1: 'Are you sure?',
      text2: `This will permanently delete the user "${userName}". This action cannot be undone.`,
      btn1Text: 'Delete',
      btn2Text: 'Cancel',
      btn1Handler: async () => {
        try {
          await deleteUser(userId, token)
          setUsers(users.filter(user => user._id !== userId))
          setConfirmationModal(null)
        } catch (err) {
          setConfirmationModal(null)
        }
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (error) {
    return (
      <div className="mt-20 rounded-md bg-admin-light border border-admin-lightGray p-6 py-20">
        <p className="text-center text-2xl font-bold text-admin-danger">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 mx-auto block px-4 py-2 bg-admin-accent text-white rounded-md hover:bg-admin-accentHover transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-admin-bg min-h-screen w-full p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-admin-primary">
          Manage Users
        </h1>
        <p className="font-medium text-admin-textMuted">
          View and manage all platform users
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <VscSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-secondaryLight" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card border border-admin-border rounded-lg text-admin-text focus:outline-none focus:border-admin-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <VscFilter className="text-admin-secondaryLight" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 bg-admin-card border border-admin-border rounded-lg text-admin-text focus:outline-none focus:border-admin-primary"
              >
                <option value="all">All Roles</option>
                <option value="Student">Students</option>
                <option value="Instructor">Instructors</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-admin-card border border-admin-border rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-admin-bg">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-admin-accent/10 transition-colors align-middle">
                      {/* User Info */}
                      <td className="px-4 py-3 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-10 w-10 rounded-full border border-admin-border"
                            src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-admin-accent truncate max-w-[180px]">{user.firstName} {user.lastName}</div>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-4 py-3 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                          ${user.accountType === 'Student' ? 'bg-admin-success/20 text-admin-success' : user.accountType === 'Instructor' ? 'bg-admin-accent/20 text-admin-accent' : 'bg-admin-warning/20 text-admin-warning'}`}
                        >
                          {user.accountType}
                        </span>
                      </td>
                      {/* Email */}
                      <td className="px-4 py-3 align-middle text-sm text-admin-info truncate max-w-[180px]">{user.email}</td>
                      {/* Joined */}
                      <td className="px-4 py-3 align-middle text-sm text-admin-textMuted">{new Date(user.createdAt).toLocaleDateString()}</td>
                      {/* Actions */}
                      <td className="px-4 py-3 align-middle text-sm font-medium flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-admin-danger text-admin-white hover:bg-admin-danger/80 transition-colors text-xs font-semibold"
                          onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-4">
            <p className="text-sm text-admin-text">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
} 