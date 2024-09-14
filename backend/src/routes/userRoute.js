import userModel from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/responseHandler.js";
import crypto from 'crypto';

const signup = async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Log input data
    const { username, password} = req.body;

    const checkUser = await userModel.findOne({ username });
    console.log("Check user exists:", checkUser);  // Log if user already exists

    if (checkUser) return responseHandler.badrequest(res, "username already used");

    const user = new userModel();
    user.username = username;
    user.setPassword(password);

    await user.save();
    console.log("User saved:", user); 

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    console.log("JWT Token:", token); 

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error("Signup error:", error);  
    responseHandler.error(res);
  }
};


const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id");

    if (!user) return responseHandler.badrequest(res, "Usuário não existe!");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Senha Inválida!");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

const generateShareToken = async (req, res) => {
  try {
    console.log("Iniciando generateShareToken");

    // Verifique se req.user está definido
    if (!req.user || !req.user.id) {
      console.error("Usuário não autenticado");
      return responseHandler.unauthorized(res);
    }

    const userId = req.user.id;

    // Gera um token aleatório
    const shareToken = crypto.randomBytes(16).toString('hex');

    // Atualiza o usuário com o novo token
    const updatedUser = await userModel.findByIdAndUpdate(userId, { shareToken }, { new: true });

    console.log("Usuário atualizado:", updatedUser);

    responseHandler.ok(res, { shareToken });
  } catch (error) {
    console.error("Erro em generateShareToken:", error);
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  generateShareToken
};