import { AppSidebar, Container, Header } from "@components/layouts";
import { Separator, SidebarProvider } from "@components/ui";

import { Outlet } from "react-router-dom";

const LayoutPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Container>
        <Header />
        <Separator />
        <div className="p-6 py-2">
          <Outlet />
        </div>
      </Container>
    </SidebarProvider>
  );
};

export default LayoutPage;
