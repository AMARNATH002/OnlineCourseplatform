const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb+srv://root:root@cluster0.trfqu29.mongodb.net/course');

// Course Model
const courseSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	instructor: { type: String, default: 'The Compilers Team' },
	duration: { type: String, required: true },
	days: { type: Number, required: true },
	price: { type: Number, required: true },
	isFree: { type: Boolean, default: false },
	ratings: { type: Number, default: 0, min: 0, max: 5 },
	recommended: { type: Boolean, default: false },
	image: { type: String, default: '' },
	category: { type: String, default: 'Programming' },
});
const Course = mongoose.model('Course', courseSchema);

const sampleCourses = [
	{
		name: "Complete JavaScript Mastery",
		description: "Master JavaScript from basics to advanced concepts including ES6+, DOM manipulation, and async programming.",
		instructor: "The Compilers Team",
		duration: "40 hours",
		days: 30,
		price: 0,
		isFree: true,
		ratings: 4.8,
		recommended: true,
		category: "JavaScript"
	},
	{
		name: "React.js Complete Course",
		description: "Build modern web applications with React.js, hooks, context API, and state management.",
		instructor: "The Compilers Team",
		duration: "35 hours",
		days: 25,
		price: 2999,
		isFree: false,
		ratings: 4.9,
		recommended: true,
		category: "React"
	},
	{
		name: "Node.js Backend Development",
		description: "Learn server-side development with Node.js, Express, MongoDB, and REST APIs.",
		instructor: "The Compilers Team",
		duration: "45 hours",
		days: 35,
		price: 3499,
		isFree: false,
		ratings: 4.7,
		recommended: true,
		category: "Node.js"
	},
	{
		name: "Python Programming Fundamentals",
		description: "Start your programming journey with Python - from basics to data structures and algorithms.",
		instructor: "The Compilers Team",
		duration: "30 hours",
		days: 20,
		price: 0,
		isFree: true,
		ratings: 4.6,
		recommended: false,
		category: "Python"
	},
	{
		name: "Full Stack Web Development",
		description: "Complete MERN stack development course covering MongoDB, Express, React, and Node.js.",
		instructor: "The Compilers Team",
		duration: "80 hours",
		days: 60,
		price: 5999,
		isFree: false,
		ratings: 4.9,
		recommended: true,
		category: "Full Stack"
	},
	{
		name: "Data Structures & Algorithms",
		description: "Master DSA concepts with practical implementations and coding interview preparation.",
		instructor: "The Compilers Team",
		duration: "50 hours",
		days: 40,
		price: 4499,
		isFree: false,
		ratings: 4.8,
		recommended: true,
		category: "DSA"
	}
];

async function seedCourses() {
	try {
		await Course.deleteMany({}); // Clear existing courses
		await Course.insertMany(sampleCourses);
		console.log('Sample courses added successfully!');
		process.exit(0);
	} catch (error) {
		console.error('Error seeding courses:', error);
		process.exit(1);
	}
}

seedCourses();