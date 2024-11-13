import React from "react";
import CircularProgressWithLabel from "../../components/circularProgress/CircularProgress";

const Dashboard = () => {
  return (
    <div className="flex gap-4">
      <section className="w-1/2">
        <div className="bg-red-800 rounded-xl px-4 py-4 flex justify-between w-full items-center">
          <CircularProgressWithLabel value={50} />
          <div>
            <h2 className="text-white text-xl font-bold text-nowrap">
              Available Storage
            </h2>
            <p className="text-white opacity-75 text-sm font-semibold">
              82GB / 128GB
            </p>
          </div>
        </div>
      </section>
      <section className="w-1/2 bg-red-400"></section>
    </div>
  );
};

export default Dashboard;
