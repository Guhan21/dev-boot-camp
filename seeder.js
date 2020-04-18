const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Initiating config
dotenv.config({ path: "./config/config.env" });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


const importData = async (bootcamps, courses, users, reviews) => {
    try {
        await Bootcamp.create(JSON.parse(bootcamps));
        await Course.create(JSON.parse(courses));
        await User.create(JSON.parse(users));
        await Review.create(JSON.parse(reviews));
        console.log(`Data added`.green.inverse);
        process.exit(0);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log(`Data destroyed`.red.inverse);
        process.exit(0);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

if(process.argv[2] === '-i') {
    const bootcamps = fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8');
    const courses = fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8');
    const users = fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8');
    const reviews = fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8');
    importData(bootcamps, courses, users, reviews);
} else if(process.argv[2] === '-d') {
    deleteData();
}
