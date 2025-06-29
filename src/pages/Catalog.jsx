import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const navigate = useNavigate();
    const [allCategories, setAllCategories] = useState([]);
    const [error, setError] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            try {
              const res = await apiConnector("GET", categories.CATEGORIES_API);
              setAllCategories(res?.data?.data || []);
              const matchedCategory = res?.data?.data?.find(
                (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
              );
              if (matchedCategory) {
                setCategoryId(matchedCategory._id);
                setError("");
              } else {
                setCategoryId("");
                setError("Category not found");
              }
            } catch (err) {
              setError("Failed to fetch categories. Please try again later.");
              setCategoryId("");
            }
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                setCatalogPageData(res);
                if (!res?.success) {
                  setError(res?.message || "Failed to fetch category data.");
                } else {
                  setError("");
                }
            }
            catch(error) {
                setError("Failed to fetch category data. Please try again later.");
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);

    if (error) {
      return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 px-4">
          <div className="max-w-lg w-full rounded-lg bg-richblack-800 p-8 shadow-lg flex flex-col items-center gap-4 border border-richblack-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
            <h2 className="text-2xl font-bold text-richblack-5 text-center">{error === "Category not found" ? "Category Not Found" : "Error"}</h2>
            <p className="text-richblack-200 text-center">{error === "Category not found" ? "Sorry, the category you are looking for does not exist. Please check the URL or return to the catalog to browse available categories." : error}</p>
            <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 rounded bg-yellow-100 text-richblack-900 font-semibold hover:bg-yellow-50 transition">Go to Home</button>
          </div>
        </div>
      );
    }

    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !categoryId) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 px-4">
            <div className="max-w-lg w-full rounded-lg bg-richblack-800 p-8 shadow-lg flex flex-col items-center gap-4 border border-richblack-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
              <h2 className="text-2xl font-bold text-richblack-5 text-center">Category Not Found</h2>
              <p className="text-richblack-200 text-center">Sorry, the category you are looking for does not exist.<br/>Please check the URL or return to the catalog to browse available categories.</p>
              <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 rounded bg-yellow-100 text-richblack-900 font-semibold hover:bg-yellow-50 transition">Go to Home</button>
            </div>
          </div>
        );
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    
      return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              {(!catalogPageData?.data?.selectedCategory?.courses || catalogPageData?.data?.selectedCategory?.courses.length === 0) ? (
                <div className="text-center text-lg text-richblack-200 py-8">
                  No courses found in this category.
                </div>
              ) : (
                <CourseSlider
                  Courses={catalogPageData?.data?.selectedCategory?.courses}
                />
              )}
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className="py-8">
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
      )
    }
    
    export default Catalog