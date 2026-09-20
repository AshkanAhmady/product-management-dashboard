import { Suspense, type ComponentType } from "react";
import { routeList } from "@/constants/routeList";
import PageLoader from "@/components/common/PageLoader";

const createRouteElement = (Element: ComponentType) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Element />
    </Suspense>
  );
};

export const routes = routeList.map(({ path, Element }) => ({
  path,
  element: createRouteElement(Element),
}));
