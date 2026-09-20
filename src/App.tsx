import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "@/app/routes";
import { ROUTES } from "@/constants/routes";

const App = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.PRODUCTS} replace />}
      />

      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default App;
