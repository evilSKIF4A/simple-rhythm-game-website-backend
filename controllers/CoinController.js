import RecordModel from "../models/Record.js";

export const getCoins = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const record = await RecordModel.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Рекорд не найдет" });
    }
    res.status(200).json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const setCoins = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const total = parseInt(req.params.total);
    const record = await RecordModel.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: "Рекорд не найдет" });
    }
    record.coins += total;
    await record.save();
    res.status(200).json({
      message: "Рекорд обновлен",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
