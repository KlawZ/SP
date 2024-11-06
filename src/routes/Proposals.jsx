import React from "react";
import Sidebar from "../components/Sidebar";
import ProposalForm from "../components/ProposalForm";

const Proposals = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", flexGrow: 1 }}>
        <ProposalForm />
      </div>
    </div>
  );
};

export default Proposals;
