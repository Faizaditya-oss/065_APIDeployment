const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let databaseReady = false;
let databasePromise = null;

async function connectToDatabase() {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

app.use(async (req, res, next) => {
    try{
        if (!databaseReady) {
            if (!databasePromise) {
                databasePromise = connectToDatabase();
            }
            await databasePromise;
            databaseReady = true;
        }
        next();
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        databasePromise = null;
        return res.status(500).json({ 
            message: 'Database Connection Error' 
        });
    }
});

app.use('/api', require('./routes/api'));

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}