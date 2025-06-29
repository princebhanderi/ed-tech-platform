import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  GET_ALL_USERS_API,
  GET_ALL_COURSES_API,
  DELETE_COURSE_API,
  GET_PLATFORM_STATS_API,
  DELETE_USER_API,
  GET_ALL_CATEGORIES_API,
  CREATE_CATEGORY_API,
  DELETE_CATEGORY_API,
} = adminEndpoints

export const getAllUsers = async (token) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_USERS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_ALL_USERS_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Users")
    }
    result = response?.data?.users
  } catch (error) {
    console.log("GET_ALL_USERS_API ERROR............", error)
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  toast.dismiss(toastId)
  return result
}

export const getAllCourses = async (token) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_ALL_COURSES_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Courses")
    }
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_ALL_COURSES_API ERROR............", error)
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  toast.dismiss(toastId)
  return result
}

export const deleteCourse = async (courseId, token) => {
  const toastId = toast.loading("Deleting course...")
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_COURSE_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE_COURSE_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course deleted successfully")
    success = true
  } catch (error) {
    console.log("DELETE_COURSE_API ERROR............", error)
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  toast.dismiss(toastId)
  return success
}

export const getPlatformStats = async (token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("GET", GET_PLATFORM_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_PLATFORM_STATS_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Platform Stats")
    }
    result = response?.data?.stats
  } catch (error) {
    console.log("GET_PLATFORM_STATS_API ERROR............", error)
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  toast.dismiss(toastId)
  return result
}

export const deleteUser = async (userId, token) => {
  const toastId = toast.loading("Deleting user...")
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_USER_API}/${userId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete User")
    }
    toast.success("User deleted successfully")
    success = true
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  toast.dismiss(toastId)
  return success
}

export const getAllCategories = async (token) => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORIES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Categories")
    }
    result = response?.data?.categories
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  return result
}

export const createCategory = async ({ name, description }, token) => {
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, { name, description }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Category")
    }
    toast.success("Category created successfully")
    success = true
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  return success
}

export const deleteCategory = async (categoryId, token) => {
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_CATEGORY_API}/${categoryId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Category")
    }
    toast.success("Category deleted successfully")
    success = true
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.response?.data?.error || error.message || 'Something went wrong')
  }
  return success
} 