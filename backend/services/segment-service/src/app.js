const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const segmentRoutes = require('./routes/segmentRoutes');
const swaggerSpec = require('./swagger/swagger');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'segment-service' });
});

app.use('/api/segments', segmentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Segment Service running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;