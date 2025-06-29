import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function InstructorCourseProgress() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug: Log token and user
    console.log('InstructorCourseProgress: token =', token);
    console.log('InstructorCourseProgress: user =', user);
    if (!token) {
      setError('You are not logged in. Please log in as an instructor.');
      setLoading(false);
      return;
    }
    if (!user || user.accountType !== 'Instructor') {
      setError('You must be logged in as an instructor to view this page.');
      setLoading(false);
      return;
    }
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          'http://localhost:4000/api/v1/course/getAllStudentsProgressForCourse',
          { courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data.data);
      } catch (err) {
        setError('Failed to fetch students progress. You may not have permission to view this course.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [courseId, token, user]);

  return (
    <div className="bg-richblack-900 min-h-screen p-6">
      <h2 className="text-2xl font-bold text-yellow-100 mb-6">Student Progress</h2>
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : students.length === 0 ? (
        <div className="text-richblack-200">No students enrolled in this course.</div>
      ) : (
        <div className="overflow-x-auto">
          {students.every(student => student.progress === 0) ? (
            <div className="text-center text-richblack-200 py-8">No student has started this course yet.</div>
          ) : (
            <table className="min-w-full bg-richblack-800 rounded-lg text-left">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-yellow-100 font-semibold">Student</th>
                  <th className="px-6 py-3 text-yellow-100 font-semibold">Email</th>
                  <th className="px-6 py-3 text-yellow-100 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  student.progress === 0 ? null : (
                  <tr key={student.studentId} className="border-b border-richblack-700 align-middle">
                    <td className="px-6 py-3 flex items-center gap-3">
                      <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-richblack-5 font-semibold">{student.name}</span>
                    </td>
                    <td className="px-6 py-3 text-richblack-200">{student.email}</td>
                    <td className="px-6 py-3">
                      <div className="w-40 bg-richblack-700 rounded-full h-4 overflow-hidden">
                        <div
                          className={student.progress === 0 ? "bg-richblack-400 h-4 rounded-full" : "bg-yellow-100 h-4 rounded-full"}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-richblack-5 font-bold">
                        {student.progress === 0 ? <span className="text-richblack-300">Not started</span> : `${student.progress}%`}
                      </span>
                    </td>
                  </tr>
                  )
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
} 