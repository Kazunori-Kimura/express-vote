import express from 'express';

const app = express();
app.get('/', (_, res) => res.send('<h1>hello</h1>'));

app.listen(process.env.PORT || 3080, () => {
    // eslint-disable-next-line no-console
    console.log('listening');
});
