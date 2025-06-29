import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data || [])
      }
    })()
  }, [])

  // console.log(reviews)

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={'auto'}
          centeredSlides={true}
          spaceBetween={24}
          loop={true}
          freeMode={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={4000}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}
                style={{ width: '320px', maxWidth: '90vw' }}
              >
                <div className="min-w-[260px] max-w-[350px] w-full flex flex-col gap-4 bg-richblack-800 p-5 rounded-xl shadow-lg text-[15px] text-richblack-25 transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl border border-richblack-700 min-h-[220px] mx-auto">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-12 w-12 rounded-full object-cover border-2 border-yellow-100 shadow"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5 text-base">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-xs font-medium text-richblack-400 mt-0.5">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-25 leading-relaxed bg-richblack-700/40 rounded px-3 py-2 mt-1 mb-2 min-h-[48px]">
                    {review?.review
                      ? review.review.split(" ").length > truncateWords
                        ? `${review.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                        : review.review
                      : <span className="italic text-richblack-400">No review text</span>}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="font-bold text-yellow-100 text-lg bg-yellow-900/30 px-2 py-1 rounded-lg shadow-inner">
                      {review.rating.toFixed(1)}
                    </span>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider