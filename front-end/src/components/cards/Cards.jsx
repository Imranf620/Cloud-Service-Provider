import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PieChartIcon from '@mui/icons-material/PieChart';
import { dataTypes } from "../../assets/data";

const Cards = () => {
  return (
    <div className="grid grid-cols-1 z-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 gap-y-16 place-items-center p-4">
      {dataTypes.map((item) => (
        <section key={item.id} className="relative rounded-xl bg-white p-4 shadow-lg max-w-[260px] w-full transform hover:scale-105 transition duration-300">
          <div className="absolute -top-4 -left-4 rounded-br-[70%] pr-4 pb-4 bg-gray-200 grid place-items-center">
            <div
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md"
              style={{ backgroundColor: item.color }}
            >
              {item.icon === "ArticleIcon" && <ArticleIcon className="text-white" />}
              {item.icon === "PermMediaIcon" && <PermMediaIcon className="text-white" />}
              {item.icon === "VideoCallIcon" && <VideoCallIcon className="text-white" />}
              {item.icon === "PieChartIcon" && <PieChartIcon className="text-white" />}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold w-full text-end text-gray-800">{item.size} GB</h1>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm text-gray-600">{item.lastUpdated}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Cards;
