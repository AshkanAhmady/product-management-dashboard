import { Suspense, type ComponentType } from "react";
import { routeList } from "@/constants/routeList";

const createRouteElement = (Element: ComponentType) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Element />
    </Suspense>
  );
};

export const routes = routeList.map(({ path, Element }) => ({
  path,
  element: createRouteElement(Element),
}));
