import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPlatformStats, getAllUsers, getAllCourses } from '../../../../services/operations/adminAPI'
import { VscOrganization, VscBook, VscGraph, VscPerson } from 'react-icons/vsc'

export default function PlatformStats() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [error, setError] = useState(null)
  const [userStats, setUserStats] = useState({
    total: 0,
    students: 0,
    instructors: 0,
    admins: 0,
  })

  useEffect(() => {
    if (!token) return

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [statsData, usersData, coursesData] = await Promise.all([
          getPlatformStats(token),
          getAllUsers(token),
          getAllCourses(token)
        ])
        setStats(statsData)
        setUsers(usersData)
        setCourses(coursesData)
        setUserStats({
          total: usersData.length,
          students: usersData.filter(user => user.accountType === 'Student').length,
          instructors: usersData.filter(user => user.accountType === 'Instructor').length,
          admins: usersData.filter(user => user.accountType === 'Admin').length,
        })
      } catch (err) {
        console.error('Error fetching platform data:', err)
        setError('Failed to load platform statistics')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const calculateCourseStats = () => {
    if (!courses.length) return {}
    
    const published = courses.filter(course => course.status === 'Published').length
    const draft = courses.filter(course => course.status === 'Draft').length
    const totalRevenue = courses.reduce((acc, course) => {
      const students = course.studentsEnrolled?.length || 0
      return acc + (students * (course.price || 0))
    }, 0)
    
    return { published, draft, totalRevenue }
  }

  const courseStats = calculateCourseStats()

  if (error) {
    return (
      <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
        <p className="text-center text-2xl font-bold text-red-400">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 mx-auto block px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-admin-bg min-h-screen w-full p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-admin-primary">
          Platform Statistics
        </h1>
        <p className="font-medium text-admin-textMuted">
          Comprehensive overview of your platform
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-textMuted text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-admin-success">{userStats.total}</p>
                </div>
                <div className="bg-admin-accent/10 p-3 rounded-full">
                  <VscOrganization className="text-admin-accent text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-textMuted text-sm font-medium">Students</p>
                  <p className="text-admin-success text-3xl font-bold">{userStats.students}</p>
                </div>
                <div className="bg-admin-success/10 p-3 rounded-full">
                  <VscPerson className="text-admin-success text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-textMuted text-sm font-medium">Instructors</p>
                  <p className="text-admin-warning text-3xl font-bold">{userStats.instructors}</p>
                </div>
                <div className="bg-admin-warning/10 p-3 rounded-full">
                  <VscBook className="text-admin-warning text-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-textMuted text-sm font-medium">Total Courses</p>
                  <p className="text-admin-info text-3xl font-bold">{courses.length}</p>
                </div>
                <div className="bg-admin-info/10 p-3 rounded-full">
                  <VscGraph className="text-admin-info text-2xl" />
                </div>
              </div>
            </div>
            {/* Total Revenue Card */}
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-textMuted text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-admin-accent">Rs. {courseStats.totalRevenue?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-admin-accent/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-admin-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor-wise Total Revenue */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm mb-10">
            <h3 className="text-lg font-semibold text-admin-accent mb-4">Instructor-wise Total Revenue</h3>
            <div className="space-y-3">
              {users.filter(user => user.accountType === 'Instructor').length === 0 ? (
                <p className="text-center text-admin-textMuted py-4">No instructors found</p>
              ) : (
                users.filter(user => user.accountType === 'Instructor').map(instructor => {
                  const instructorCourses = courses.filter(course => course.instructor && course.instructor._id === instructor._id);
                  const instructorRevenue = instructorCourses.reduce((acc, course) => acc + ((course.studentsEnrolled?.length || 0) * (course.price || 0)), 0);
                  return (
                    <div key={instructor._id} className="flex items-center justify-between p-4 bg-admin-card border border-admin-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={instructor.image}
                          alt={instructor.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-admin-border"
                        />
                        <div>
                          <p className="text-sm font-semibold text-admin-accent">{instructor.firstName} {instructor.lastName}</p>
                          <p className="text-xs text-admin-textMuted">{instructor.email}</p>
                          <p className="text-xs text-admin-success">Courses: {instructorCourses.length}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-admin-success">Rs. {instructorRevenue.toLocaleString()}</p>
                        <p className="text-xs text-admin-textMuted">Total Revenue</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Course-wise Total Revenue */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm mb-10">
            <h3 className="text-lg font-semibold text-admin-accent mb-4">Course-wise Total Revenue</h3>
            <div className="space-y-3">
              {courses.length === 0 ? (
                <p className="text-center text-admin-textMuted py-4">No courses found</p>
              ) : (
                courses.map(course => {
                  const revenue = (course.studentsEnrolled?.length || 0) * (course.price || 0);
                  return (
                    <div key={course._id} className="flex items-center justify-between p-4 bg-admin-card border border-admin-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-10 h-10 rounded object-cover border border-admin-border"
                        />
                        <div>
                          <p className="text-sm font-semibold text-admin-accent">{course.courseName}</p>
                          <p className="text-xs text-admin-success">{course.studentsEnrolled?.length || 0} students</p>
                          <p className="text-xs text-admin-warning">Price: Rs. {course.price || 0}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-admin-success">Rs. {revenue.toLocaleString()}</p>
                        <p className="text-xs text-admin-textMuted">Total Revenue</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-admin-primary mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-admin-textMuted">Students</span>
                  </div>
                  <span className="text-admin-text font-semibold">{userStats.students || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-admin-textMuted">Instructors</span>
                  </div>
                  <span className="text-admin-text font-semibold">{userStats.instructors || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-admin-textMuted">Admins</span>
                  </div>
                  <span className="text-admin-text font-semibold">{userStats.admins || 0}</span>
                </div>
              </div>
            </div>

            {/* Course Status */}
            <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-admin-primary mb-4">Course Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-admin-textMuted">Published</span>
                  </div>
                  <span className="text-admin-text font-semibold">{courseStats.published || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-admin-textMuted">Draft</span>
                  </div>
                  <span className="text-admin-text font-semibold">{courseStats.draft || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course-wise Revenue */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm mb-10">
            <h3 className="text-lg font-semibold text-admin-accent mb-4">Course-wise Revenue & Enrollment</h3>
            <div className="space-y-3">
              {courses
                .filter(course => course.studentsEnrolled?.length > 0)
                .sort((a, b) => (b.studentsEnrolled?.length || 0) * (b.price || 0) - (a.studentsEnrolled?.length || 0) * (a.price || 0))
                .slice(0, 5)
                .map((course) => {
                  const revenue = (course.studentsEnrolled?.length || 0) * (course.price || 0);
                  return (
                    <div key={course._id} className="flex items-center justify-between p-4 bg-admin-card border border-admin-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-12 h-12 rounded-lg object-cover border border-admin-border"
                        />
                        <div>
                          <p className="text-sm font-semibold text-admin-accent">{course.courseName}</p>
                          <p className="text-xs text-admin-success">
                            {course.studentsEnrolled?.length || 0} students enrolled
                          </p>
                          <p className="text-xs text-admin-warning">
                            Price: Rs. {course.price || 0}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-admin-success">Rs. {revenue.toLocaleString()}</p>
                        <p className="text-xs text-admin-textMuted">Revenue</p>
                      </div>
                    </div>
                  );
                })}
              {courses.filter(course => course.studentsEnrolled?.length > 0).length === 0 && (
                <p className="text-center text-admin-textMuted py-4">No revenue data available</p>
              )}
            </div>
          </div>

          {/* Course Enrollment Details */}
          <div className="bg-admin-card border border-admin-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-admin-primary mb-4">Course Enrollment Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="text-left py-3 px-4 text-admin-primary font-medium">Course</th>
                    <th className="text-center py-3 px-4 text-admin-textMuted font-medium">Category</th>
                    <th className="text-center py-3 px-4 text-admin-textMuted font-medium">Instructor</th>
                    <th className="text-center py-3 px-4 text-admin-textMuted font-medium">Students Enrolled</th>
                    <th className="text-center py-3 px-4 text-admin-textMuted font-medium">Price</th>
                    <th className="text-center py-3 px-4 text-admin-textMuted font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-admin-lightGray/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-admin-primary">{course.courseName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="text-sm text-admin-primary">{course.category?.name || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="text-sm text-admin-accent">{course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-admin-success/10 text-admin-success">
                          {course.studentsEnrolled?.length || 0} students
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="text-sm text-admin-warning">Rs. {course.price || 0}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.status === 'Published' 
                            ? 'bg-admin-success/10 text-admin-success' 
                            : 'bg-admin-warning/10 text-admin-warning'
                        }`}>
                          {course.status || 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 