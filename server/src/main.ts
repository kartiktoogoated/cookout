import express from 'express';
import testRouter from './routes/index'
import testOneRouter from './routes/taskOne';

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());

app.use('/api/test', testRouter);
app.use('/api/testOne', testOneRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});