import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import RecordModel from "../models/Record.js";

const SECRET_KEY = "lolkekcheburek283598203958205982";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc2 = new RecordModel();
    const record = await doc2.save();

    const doc = new UserModel({
      nickName: req.body.nickName,
      email: req.body.email,
      passwordHash: hash,
      recordId: record._id,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword)
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user)
      return res.status(404).json({
        message: "Пользователь не найден",
      });

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    let users = await UserModel.find({});
    const records = await RecordModel.find({});
    if (!users) {
      return res.status(404).json({
        message: "Ничего не найдено",
      });
    }
    let newUsers = users.map((user) => {
      const record = records.find(
        (record) => record._id.toString() === user.recordId.toString()
      );
      let obj = { nickName: user.nickName, coins: record.coins };
      return obj;
    });
    newUsers.sort((a, b) => b.coins - a.coins);
    res.status(200).json(newUsers.slice(0, 5));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
