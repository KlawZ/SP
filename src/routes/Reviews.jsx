import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
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
      setReviews(response.data.data);
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
        <div style={{ display: "flex", marginLeft: "20%", flexWrap: "wrap" }}>
          {reviews.length === 0 ? (
            <div
              style={{
                position: "relative",
                marginLeft: "450px",
                height: "100vh",
              }}
            >
              <Alert
                variant="warning"
                style={{
                  maxHeight: "100px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "300px",
                  textAlign: "center",
                }}
              >
                No reviews available.
              </Alert>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewDetails key={review.review_id} review={review} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;
