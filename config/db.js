const mongoose = require('mongoose');

mongoose
    .connect(
        'mongodb+srv://' + process.env.DB_USERNAME + '@cluster0.kz7jamo.mongodb.net/mern-project',
        {
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connedct to MongoDB", err))