import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useStateContext } from "../context/StateContext";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";
import ReviewDetails from "../components/ReviewDetails";

const Reviews = () => {
  const { userID, userRole } = useStateContext();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/advisors/reviews",
        {
          params: { advisor_id: userID },
        }
      );
      console.log(response.data.data);
      setReviews(response.data.data); // Assumes response data structure
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (userRole === "advisor") {
      fetchReviews();
    }
  }, []);

  return (
    <div>
      <Sidebar />
      {userRole === "investor" && (
        <div style={{ marginLeft: "250px", flexGrow: 1 }}>
          <ReviewForm />
        </div>
      )}
      {userRole === "advisor" && (
        <div style={{ marginLeft: "250px", flexGrow: 1 }}>
          {reviews.map((review) => (
            <ReviewDetails key={review.review_id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
