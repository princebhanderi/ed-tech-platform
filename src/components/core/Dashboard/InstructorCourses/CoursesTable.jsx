import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import { useMemo } from "react"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  return (
    <>
      <Table className="rounded-xl border border-richblack-800 ">
        <Thead>
          <Tr className="border-b border-b-richblack-800">
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr key={course._id} className="border-b border-richblack-800">
                <Td className="px-6 py-4">
                  <div className="flex gap-x-4">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[148px] w-[220px] rounded-lg object-cover"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-lg font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-[12px] text-white">
                        Created: {formatDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </p>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="px-6 py-4 text-sm font-medium text-richblack-100">
                  {course?.totalDuration || "-"}
                </Td>
                <Td className="px-6 py-4 text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>
                <Td className="px-6 py-4 text-sm font-medium text-richblack-100 ">
                  <div className="flex flex-col gap-2 items-center w-fit">
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }}
                      title="Edit"
                      className="px-2 py-1 rounded bg-blue-100 text-blue-900 font-semibold text-xs hover:bg-blue-50 transition w-full"
                    >
                      Edit
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1Text: !loading ? "Delete" : "Loading...  ",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }}
                      title="Delete"
                      className="px-2 py-1 rounded bg-admin-danger text-richblack-900 font-semibold text-xs hover:bg-admin-danger transition w-full"
                    >
                      Delete
                    </button>
                    <button
                      disabled={loading}
                      onClick={() =>
                        navigate(
                          `/dashboard/instructor-course-progress/${course._id}`
                        )
                      }
                      title="View Student Progress"
                      className="px-2 py-1 rounded bg-yellow-100 text-richblack-900 font-semibold text-xs hover:bg-yellow-50 transition w-fit"
                    >
                      View Student Progress
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}