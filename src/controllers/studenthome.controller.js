const Studenthome = require("../models/studenthome.model");

class StudenthomeController {

  async create({ headers, body }, req, res, next) {
    const newStudenthome = await Studenthome.create(body).catch(next);
    res.status(201).json(newStudenthome);
  }

  getAll = async (req, res, next) => {
    const entities = await this.model.find();
    res.status(200).send(entities);
  };

  getOne = async (req, res, next) => {
    const entity = await this.model.findById(req.params.id).catch(next);
    res.status(200).send(entity);
  };

  update = async (req, res, next) => {
    await this.model.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).end();
  };

  delete = async (req, res, next) => {
    // this happens in two steps to make mongoose middleware run
    const entity = await this.model.findById(req.params.id);
    await entity.delete();
    res.status(204).end();
  };
}

module.exports = new StudenthomeController();
