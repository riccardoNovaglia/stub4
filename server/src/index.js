const { app, load } = require('./app');

try {
  const loadFile = process.argv[2];
  load(loadFile);
} catch (e) {}

app.listen(8080, () => {
  console.log('Started on 8080');
});
