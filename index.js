const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const configs = require('./bin/infra/configs/global_config');
const port = process.env.port || configs.get('/port') || 1337;

const migrationRouter = require('./bin/modules/migration')
const albumRouter = require('./bin/modules/albums')
const photoRouter = require('./bin/modules/photos')
const userRouter = require('./bin/modules/users')
const authRouter = require('./bin/modules/auth')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!!'));
app.use('/migrations', migrationRouter);
app.use('/albums', albumRouter);
app.use('/photos', photoRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  const ctx = 'app-listen';
  console.log(`${ctx}, Application server listening at http://localhost:${port}`)
});