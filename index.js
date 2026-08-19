const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databaseReady = false;
let databasePromise = null;

app.use(async (req, res, next) => {
    try{
        if (!databaseReady) {
            if (!databasePromise) {
                databasePromise = connectToDatabase()
            }
            await databasePromise;
            databaseReady = true;
        }
        next();
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        databasePromise = null;
        return res.status(500).json({ 
            message: 'Database Connection Error' });
    }

    app.use('/api', require('./routes/api'));

    async function startServer() {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
});


startServer();