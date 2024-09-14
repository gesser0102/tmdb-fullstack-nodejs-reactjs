import { HomePage } from "../pages/HomePage";
import { Favorites } from "../pages/Favorite";
import { MediaList } from "../pages/Medias";
import  SharedFavorites  from "../pages/ShareFavorites";
import { Restrict } from "../components/common/Restrict";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  favoriteList: "/favorites",
  sharedFavorites: (shareToken) => `/favorites/share/${shareToken}`,
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/favorites",
    element: (
      <Restrict>
        <Favorites />
      </Restrict>
    ),
    state: "favorites",
  },
  {
    path: "/favorites/share/:shareToken",
    element: <SharedFavorites />, 
    state: "shareFavorites",
  },
  {
    path: "/:mediaType",
    element: <MediaList />,
  },
];

export default routes;
