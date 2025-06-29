import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllCourses, deleteCourse } from '../../../../services/operations/adminAPI'
import { VscSearch, VscFilter, VscTrash, VscEye, VscBook, VscOrganization } from 'react-icons/vsc'
import ConfirmationModal from '../../../common/ConfirmationModal'
import { useNavigate } from 'react-router-dom'

export default function ManageCourses() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const coursesData = await getAllCourses(token)
        setCourses(coursesData)
        setFilteredCourses(coursesData)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  useEffect(() => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => course.status === filterStatus)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, filterStatus])

  const handleDeleteCourse = async (courseId, courseName) => {
    setConfirmationModal({
      text1: "Are you sure?",
      text2: `This will permanently delete the course "${courseName}". This action cannot be undone.`,
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          const success = await deleteCourse(courseId, token)
          if (success) {
            setCourses(courses.filter(course => course._id !== courseId))
            setConfirmationModal(null)
          }
        } catch (err) {
          console.error('Error deleting course:', err)
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
          Manage Courses
        </h1>
        <p className="font-medium text-admin-textMuted">
          View and manage all platform courses
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
                placeholder="Search courses by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card border border-admin-border rounded-lg text-admin-text focus:outline-none focus:border-admin-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <VscFilter className="text-admin-secondaryLight" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-admin-card border border-admin-border rounded-lg text-admin-text focus:outline-none focus:border-admin-primary"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-admin-card border border-admin-border rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-admin-bg">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-admin-primary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-admin-accent/10 transition-colors">
                      <td className="px-6 py-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-10 w-10 rounded object-cover border border-admin-border"
                            src={course.thumbnail}
                            alt={course.courseName}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-admin-accent truncate max-w-[180px]">{course.courseName}</span>
                            </div>
                            <div className="text-xs text-admin-textMuted truncate max-w-[180px]">
                              {course.courseDescription?.substring(0, 40)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                          ${course.status === 'Published' ? 'bg-admin-success/20 text-admin-success' : 'bg-admin-warning/20 text-admin-warning'}`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 align-middle text-sm font-semibold text-admin-warning">
                        <div className="flex items-center gap-1">
                          <VscBook className="inline text-admin-warning" />
                          Rs. {course.price}
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle text-sm font-semibold text-admin-success">
                        <div className="flex items-center gap-1">
                          <VscOrganization className="inline text-admin-success" />
                          {course.studentsEnrolled?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle">
                        <div className="flex flex-col gap-2 items-start w-full">
                          <button
                            title="View"
                            onClick={() => navigate(`/dashboard/course/${course._id}`)}
                            className="inline-flex items-center px-2 py-1 rounded bg-admin-accent text-white hover:bg-admin-accentHover transition-colors w-fit"
                          >
                            <VscEye className="mr-1" /> View
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDeleteCourse(course._id, course.courseName)}
                            className="inline-flex items-center px-2 py-1 rounded bg-admin-danger text-white hover:bg-admin-dangerHover transition-colors w-fit"
                          >
                            <VscTrash className="mr-1" /> Delete
                          </button>
                          <button
                            title="View Student Progress"
                            onClick={() => navigate(`/dashboard/admin-course-progress/${course._id}`)}
                            className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-richblack-900 font-semibold text-xs hover:bg-yellow-50 transition w-fit"
                          >
                            <VscOrganization className="mr-1" /> Student Progress
                          </button>
                        </div>
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
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
        </div>
      )}

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}
