import React from 'react';
import AgentForm from '../components/home/agent';
//import DemoTable from '../components/home/demo';
import AgentTable from "../components/home/table";

function AppHome() {
  return (
    <div className="main">
      <AgentForm></AgentForm>
      {/* <DemoTable/> */}
      <AgentTable></AgentTable>
    </div>
  );
}

export default AppHome;