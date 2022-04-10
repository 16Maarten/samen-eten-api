class CrudController {
  constructor(model) {
    this.model = model;
  }

  create = async (req, res, next) => {
    const entity = new this.model(req.body);
    await entity.save();
    res.status(201).json({ id: entity.id }).end();
  };

  getAll = async (req, res, next) => {
    const entities = await this.model.find();
    res.status(200).send(entities).end();
  };

  getOne = async (req, res, next) => {
    const entity = await this.model.findById(req.params.id);
    res.status(200).send(entity).end();
  };

  update = async (req, res, next) => {
    await this.model.findByIdAndUpdate(req.params.id, req.body);
    const entity = await this.model.findById(req.params.id);
    res.status(200).send(entity).end();
  };

  delete = async (req, res, next) => {
    const entity = await this.model.findById(req.params.id);
    await entity.delete()
    res.status(200).send({message: "entity with id: " + req.params.id + " deleted"}).end();
  };
}
module.exports = CrudController;
