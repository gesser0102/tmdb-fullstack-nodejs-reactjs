import { HomePage } from "../pages/HomePage";
import { Favorites } from "../pages/Favorite";
import { MediaList } from "../pages/Medias";
import  SharedFavorites  from "../pages/ShareFavorites"; // Importação do componente SharedFavorites
import { Restrict } from "../components/common/Restrict";

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  favoriteList: "/favorites",
  sharedFavorites: (shareToken) => `/favorites/share/${shareToken}`, // Função para gerar a rota dos favoritos compartilhados
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
    element: <SharedFavorites />, // Nova rota para os favoritos compartilhados
    state: "shareFavorites",
  },
  {
    path: "/:mediaType",
    element: <MediaList />,
  },
];

export default routes;
