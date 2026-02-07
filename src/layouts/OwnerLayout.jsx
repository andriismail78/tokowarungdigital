import { Outlet } from "react-router-dom";
import SidebarOwner from "../components/SidebarOwner";

const OwnerLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarOwner />
      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;
