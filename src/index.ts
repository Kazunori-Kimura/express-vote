import { config } from 'dotenv';
import app from './app';

config();
const PORT = process.env.PORT || 3080;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`starting localhost:${PORT}`);
});
