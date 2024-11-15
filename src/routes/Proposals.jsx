import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import ProposalForm from "../components/ProposalForm";
import { useStateContext } from "../context/StateContext";
import ProposalDetails from "../components/ProposalDetails";
import axios from "axios";

const fetchInvestorProposals = async (userID, setProposals) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/advisors/proposals",
      { params: { advisor_id: userID } }
    );
    console.log(localStorage.getItem("marketState"));
    setProposals(response.data.data);
  } catch (error) {
    console.error("Error fetching investor proposals:", error);
  }
};

const Proposals = () => {
  const { userID, userRole } = useStateContext();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (userRole === "advisor") {
      fetchInvestorProposals(userID, setProposals);
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      {localStorage.getItem("marketState", false) ? (
        <div
          style={{
            position: "relative",
            marginLeft: "450px",
            height: "100vh",
          }}
        >
          <Alert
            variant="danger"
            style={{
              maxHeight: "100px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "300px",
              textAlign: "center",
            }}
          >
            The market is currently closed. Proposals cannot be created or
            viewed.
          </Alert>
        </div>
      ) : (
        <>
          {userRole === "investor" && (
            <div style={{ marginLeft: "250px", flexGrow: 1 }}>
              <ProposalForm />
            </div>
          )}
          {userRole === "advisor" && (
            <div
              style={{ display: "flex", flexWrap: "wrap", marginLeft: "250px" }}
            >
              {proposals.length === 0 ? (
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
                    No proposal details available.
                  </Alert>
                </div>
              ) : (
                proposals.map((proposal) => (
                  <ProposalDetails
                    key={proposal.proposal_id}
                    proposal={proposal}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Proposals;
