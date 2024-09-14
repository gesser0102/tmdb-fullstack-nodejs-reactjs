import responseHandler from "../handlers/responseHandler.js";
import favoriteModel from "../models/favoriteModel.js";
import userModel from "../models/userModel.js";

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save();

    responseHandler.created(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    console.log(favoriteId);

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });


    if (!favorite) return responseHandler.notfound(res);

    await favorite.deleteOne();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorite = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

const getSharedFavorites = async (req, res) => {
  try {
    const { shareToken } = req.params;

    // Encontra o usuário pelo token de compartilhamento
    const user = await userModel.findOne({ shareToken });

    if (!user) return responseHandler.notfound(res);

    // Obtém a lista de favoritos do usuário
    const favorites = await favoriteModel.find({ user: user._id }).sort("-createdAt");

    // Envia a resposta incluindo o nome de usuário e os favoritos
    responseHandler.ok(res, {
      username: user.username,
      favorites: favorites
    });

    console.log(user, favorites);

    console.log(favorites, user.username);
  } catch (error) {
    console.error("Erro em getSharedFavorites:", error);
    responseHandler.error(res);
  }
};


export default { addFavorite, removeFavorite, getFavorites, getSharedFavorites };