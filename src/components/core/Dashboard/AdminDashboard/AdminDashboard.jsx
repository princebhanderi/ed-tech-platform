import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPlatformStats } from '../../../../services/operations/adminAPI'
import { VscPerson, VscOrganization, VscGraph, VscBook, VscShield } from 'react-icons/vsc'

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const statsData = await getPlatformStats(token)
        setStats(statsData)
      } catch (err) {
        console.error('Error fetching platform stats:', err)
        setError('Failed to load platform statistics')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const adminCards = [
    {
      title: "Manage Users",
      description: "View and manage all platform users",
      icon: VscOrganization,
      path: "/dashboard/admin/users",
      color: "bg-admin-accent",
      textColor: "text-admin-accent"
    },
    {
      title: "Manage Courses",
      description: "View and manage all platform courses",
      icon: VscBook,
      path: "/dashboard/admin/courses",
      color: "bg-admin-success",
      textColor: "text-admin-success"
    },
    {
      title: "Platform Stats",
      description: "View detailed platform statistics",
      icon: VscGraph,
      path: "/dashboard/admin/stats",
      color: "bg-admin-info",
      textColor: "text-admin-info"
    },
    {
      title: "Manage Categories",
      description: "Create and manage course categories",
      icon: VscBook,
      path: "/dashboard/admin/categories",
      color: "bg-admin-warning",
      textColor: "text-admin-warning"
    }
  ]

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
        <h1 className="text-2xl font-bold text-admin-accent">
          Welcome, Admin {user?.firstName} 👋
        </h1>
        <p className="font-medium text-admin-text">
          Manage your platform from here
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-admin-textMuted text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-admin-primaryLight">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-admin-accent/10 p-3 rounded-full">
                    <VscOrganization className="text-2xl text-admin-accent" />
                  </div>
                </div>
              </div>
              <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-admin-textMuted text-sm font-medium">Total Courses</p>
                    <p className="text-3xl font-bold text-admin-accent">{stats.totalCourses}</p>
                  </div>
                  <div className="bg-admin-success/10 p-3 rounded-full">
                    <VscBook className="text-2xl text-admin-success" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div>
            <h2 className="text-xl font-bold text-admin-accent mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminCards.map((card, index) => (
                <Link key={index} to={card.path}>
                  <div className="bg-admin-card border border-admin-border rounded-lg p-6 hover:bg-admin-primary/10 transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                        <card.icon className={`text-2xl ${card.textColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-admin-accent">{card.title}</h3>
                        <p className="text-sm text-admin-text">{card.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-admin-accent/10 p-2 rounded-full">
                <VscShield className="text-xl text-admin-accent" />
              </div>
              <h3 className="text-lg font-semibold text-admin-accent">Admin Privileges</h3>
            </div>
            <div className="space-y-2 text-sm text-admin-text">
              <p>• View and manage all platform users</p>
              <p>• Delete any course from the platform</p>
              <p>• Access platform-wide statistics</p>
              <p>• Monitor platform health and performance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 