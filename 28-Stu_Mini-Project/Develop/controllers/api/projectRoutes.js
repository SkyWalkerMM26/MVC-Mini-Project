const router = require('express').Router();
const { Project } = require('../../models');

router.get('/', async (req, res) =>{
  try {
    const dbProjectData = await Project.findAll({
      include: {attributes: ['name']},
    });
    console.log("dbProjectData", dbProjectData);
    const projects = dbProjectData.map((project) => project.dataValues);
    console.log("projects", projects);
    res.render('hompage', { projects: projects});
  }catch (err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/project/:id', async (req, res)=>{
  try{
    const dbProjectData = await Project.findByPk({
      include: {attributes: ['name', 'description', 'date-created', 'needed_funding']},
    });
    console.log("dbProjectData", dbProjectData);
    const projects = dbProjectData.map((projectDeets) => projectDeets.dataValues);
    console.log("projects", projects);
    res.render('hompage', { projects: projects});
  }catch (err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
