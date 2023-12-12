const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const PORT = 3000;
const users = require('./routes/userRoutes');
const posts = require('./routes/postRoutes')
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.json());
app.use('/users', users);
app.use('/posts', posts);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Powitanie!')
});


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});