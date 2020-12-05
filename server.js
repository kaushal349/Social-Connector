const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/dbConnect');

connectDB();

// defining routes
app.use('/api/auth', require('./config/routes/auth'));
app.use('/api/user', require('./config/routes/user'));
app.use('/api/post', require('./config/routes/post'));
app.use('/api/profile', require('./config/routes/profile'));

app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
