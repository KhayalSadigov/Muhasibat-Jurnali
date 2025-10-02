import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Layouts/AdminSideBar";
import AdminHeader from "../Layouts/AdminHeader";

function AdminMainRoute() {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        <AdminHeader />
        <div
          style={{
            overflowY: "scroll",
            height: "calc(100vh - 60px)", // Adjust height based on header height
          }}
          className="custom-scrollbar"
        >
          <Outlet />
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2c3e50;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2c3e50 #fff;
        }
      `}</style>
    </div>
  );
}

export default AdminMainRoute;
