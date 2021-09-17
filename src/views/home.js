import React from 'react';
import AgentForm from '../components/home/agent_form';
import AgentTable from "../components/home/agent_table";

function AppHome() {
  return (
    <div className="main">
      <AgentForm></AgentForm>
      <AgentTable></AgentTable>
    </div>
  );
}

export default AppHome;