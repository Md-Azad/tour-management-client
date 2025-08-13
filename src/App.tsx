import CommonLayout from "./components/ui/layout/CommonLayout";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
}

export default App;
