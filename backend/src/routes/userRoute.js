import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favoriteControlle.js";
import userController from "../controllers/userController.js";
import requestHandler from "../handlers/requestHandler.js";
import userModel from "../models/userModel.js";
import token from "../middlewares/token.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists().withMessage("Usuário é obrigat¢rio")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("Usuario já existe");
    }),
  body("password")
    .exists().withMessage("Senha é obrigat¢ria"),
  body("confirmPassword")
    .exists().withMessage("Confirmar senha é obrigat¢ria")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Senhas não conferem");
      return true;
    }),
    requestHandler.validate,
    userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("Usuário é obrigatório"),
  body("password")
    .exists().withMessage("Senha é obrigatória"),
  requestHandler.validate,
  userController.signin
);


router.get(
  "/info",
  token.auth,
  userController.getInfo
);

router.get(
  "/favorites",
  token.auth,
  favoriteController.getFavorites
);

router.post(
  "/favorites",
  token.auth,
  body("mediaType")
    .exists().withMessage("mediaType é obrigatório")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalida"),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId não pode ser vazio"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle é obrigatório"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster é obrigatório"),
  body("mediaRate")
    .exists().withMessage("mediaRate é obrigatório"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  token.auth,
  favoriteController.removeFavorite
);

export default router;