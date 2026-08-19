const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

// Local development
if (require.main === module) {
    const db = require('./models');
    db.sequelize.authenticate().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

module.exports = app;