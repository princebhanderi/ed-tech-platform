import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AdminCourseProgress() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError('Failed to fetch students progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [courseId, token]);

  return (
    <div className="bg-admin-bg min-h-screen p-6">
      <h2 className="text-2xl font-bold text-admin-accent mb-6">Student Progress</h2>
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="text-admin-danger">{error}</div>
      ) : students.length === 0 ? (
        <div className="text-admin-textMuted">No students enrolled in this course.</div>
      ) : (
        <div className="overflow-x-auto">
          {students.every(student => student.progress === 0) ? (
            <div className="text-center text-admin-textMuted py-8">No student has started this course yet.</div>
          ) : (
            <table className="min-w-full bg-admin-card rounded-lg text-left">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-admin-accent font-semibold">Student</th>
                  <th className="px-6 py-3 text-admin-accent font-semibold">Email</th>
                  <th className="px-6 py-3 text-admin-accent font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  student.progress === 0 ? null : (
                  <tr key={student.studentId} className="border-b border-admin-border align-middle">
                    <td className="px-6 py-3 flex items-center gap-3">
                      <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-admin-primary font-semibold">{student.name}</span>
                    </td>
                    <td className="px-6 py-3 text-admin-textMuted">{student.email}</td>
                    <td className="px-6 py-3">
                      <div className="w-40 bg-admin-border rounded-full h-4 overflow-hidden">
                        <div
                          className={student.progress === 0 ? "bg-admin-textMuted h-4 rounded-full" : "bg-admin-accent h-4 rounded-full"}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-admin-primary font-bold">
                        {student.progress === 0 ? <span className="text-admin-textMuted">Not started</span> : `${student.progress}%`}
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