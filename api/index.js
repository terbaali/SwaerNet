const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Simuloitu tietokanta bannatuille IP-osoitteille
const bannedIPs = new Set(['::2']);

app.use(helmet());

app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500, // attempts
  message: 'Too many requests from the same IP address. Try again later',
  onLimitReached: (req, res, options) => {
    console.log('LOPETA SPAMMAAMINEN.');
    const banInfo = {
      banned: true,
      expires: Date.now() + 3600000, // 1 h
    };
    res.cookie('banInfo', JSON.stringify(banInfo), { expires: new Date(banInfo.expires), httpOnly: false });
  },
});

// Suspicious activity limiters
app.use(limiter);
app.use((req, res, next) => {
  if (bannedIPs.has(req.ip)) {
    const banInfo = {
      banned: true,
      expires: Date.now() + 3600000, // 1 h
    };
    res.cookie('banInfo', JSON.stringify(banInfo), { expires: new Date(banInfo.expires), httpOnly: false });
    next();
  } else {
    next();
  }
});


app.use(express.static(path.join(__dirname, '../swearnet/build')));

const users = require('./routes/userRoutes');
const posts = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes');

// Handle the specific route and serve the React component
app.get('/reset-password/:token', (req, res) => {
  console.log('Request received:', req.params.token);
  res.sendFile(path.join(__dirname, '../swearnet/build', 'index.html'));
});

app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Kurwa!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});