import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import Icon from "@mdi/react";
import { mdiAccountGroup, mdiVideoVintage, mdiMenu } from "@mdi/js";
const Sidebar = ({ isOpen, setCurrentView }) => {
  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<Icon path={mdiMenu} size={1} />}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            Administrador
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <div onClick={() => setCurrentView("movies")}>
              <CDBSidebarMenuItem>
                <Icon path={mdiVideoVintage} size={1} />
                Gestión de Películas
              </CDBSidebarMenuItem>
            </div>
            <div onClick={() => setCurrentView("users")}>
              <CDBSidebarMenuItem>
                <Icon path={mdiAccountGroup} size={1} />
                Gestión de Usuarios
              </CDBSidebarMenuItem>
            </div>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
