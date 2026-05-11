const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'storage/uploads')));

const STORAGE_PATH = path.join(__dirname, 'storage/projects.json');
const UPLOADS_PATH = path.join(__dirname, 'storage/uploads');

// Ensure storage exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.writeFileSync(STORAGE_PATH, JSON.stringify([]));
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Helpers
const readProjects = () => JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
const writeProjects = (projects) => fs.writeFileSync(STORAGE_PATH, JSON.stringify(projects, null, 2));

// Routes
app.get('/api/projects', (req, res) => {
  res.json(readProjects());
});

app.post('/api/projects', (req, res) => {
  const { name } = req.body;
  const projects = readProjects();
  const newProject = {
    id: uuidv4(),
    name: name || 'Nuovo Progetto',
    color: '#ffffff',
    imgWall: null,
    imgRoom: null,
    createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  writeProjects(projects);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  let projects = readProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('Project not found');
  
  projects[index] = { ...projects[index], ...updates };
  writeProjects(projects);
  res.json(projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  let projects = readProjects();
  projects = projects.filter(p => p.id !== id);
  writeProjects(projects);
  res.status(204).send();
});

app.post('/api/projects/:id/upload/:type', upload.single('file'), (req, res) => {
  const { id, type } = req.params;
  const projects = readProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('Project not found');

  const filePath = `/uploads/${req.file.filename}`;
  if (type === 'wall') projects[index].imgWall = filePath;
  if (type === 'room') projects[index].imgRoom = filePath;

  writeProjects(projects);
  res.json(projects[index]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
