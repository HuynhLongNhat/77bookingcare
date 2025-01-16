import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import SidebarAdmin from "./Dashboard/SidebarAdmin";
import Header from "@/components/Header";
const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className={styles.adminLayout}>
        <SidebarAdmin />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
  
    </>
  );
};

export default AdminLayout;
