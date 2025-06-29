import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Ensure courses is an array and has data
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        <p className="mt-4 text-xl font-medium text-richblack-50">
          No data available to visualize
        </p>
      </div>
    )
  }

  // Filter out courses with no data
  const validCourses = courses.filter(course => 
    course && course.courseName && 
    ((currChart === "students" && course.totalStudentsEnrolled > 0) || 
     (currChart === "income" && course.totalAmountGenerated > 0))
  )

  if (validCourses.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        <p className="mt-4 text-xl font-medium text-richblack-50">
          No {currChart} data available to visualize
        </p>
      </div>
    )
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: validCourses.map((course) => course.courseName),
    datasets: [
      {
        data: validCourses.map((course) => course.totalStudentsEnrolled || 0),
        backgroundColor: generateRandomColors(validCourses.length),
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: validCourses.map((course) => course.courseName),
    datasets: [
      {
        data: validCourses.map((course) => course.totalAmountGenerated || 0),
        backgroundColor: generateRandomColors(validCourses.length),
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#E2E8F0', // richblack-200 equivalent
          font: {
            size: 12
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}