
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret_key_change_in_production';


mongoose.connect('mongodb+srv://root:root@cluster0.trfqu29.mongodb.net/course')
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	pendingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});
const User = mongoose.model('User', userSchema);

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

// Certificate Model
const certificateSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
	certificateId: { type: String, required: true, unique: true },
	studentName: { type: String, required: true },
	courseName: { type: String, required: true },
	instructor: { type: String, required: true },
	completionDate: { type: Date, default: Date.now },
	grade: { type: String, default: 'Completed' },
});
const Certificate = mongoose.model('Certificate', certificateSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	
	if (!token) return res.status(401).json({ message: 'Access token required' });
	
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: 'Invalid token' });
		req.user = user;
		next();
	});
};

// ============ AUTH ROUTES ============

// Signup
app.post('/api/auth/signup', async (req, res) => {
	try {
		const { username, email, password } = req.body;
		
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, email, password: hashedPassword });
		await user.save();
		
		const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
		res.status(201).json({ message: 'User created successfully', token, user: { id: user._id, username, email } });
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error: error.message });
	}
});

// Login
app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		
		const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email } });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error: error.message });
	}
});

// ============ COURSE ROUTES ============

// Get all courses
app.get('/api/courses', async (req, res) => {
	try {
		const courses = await Course.find();
		res.json(courses);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching courses', error: error.message });
	}
});

// Get single course
app.get('/api/courses/:id', async (req, res) => {
	try {
		const course = await Course.findById(req.params.id);
		if (!course) return res.status(404).json({ message: 'Course not found' });
		res.json(course);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching course', error: error.message });
	}
});

// Create course (protected)
app.post('/api/courses', authenticateToken, async (req, res) => {
	try {
		const course = new Course(req.body);
		await course.save();
		res.status(201).json({ message: 'Course created successfully', course });
	} catch (error) {
		res.status(500).json({ message: 'Error creating course', error: error.message });
	}
});

// Update course (protected)
app.put('/api/courses/:id', authenticateToken, async (req, res) => {
	try {
		const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!course) return res.status(404).json({ message: 'Course not found' });
		res.json({ message: 'Course updated successfully', course });
	} catch (error) {
		res.status(500).json({ message: 'Error updating course', error: error.message });
	}
});

// Delete course (protected)
app.delete('/api/courses/:id', authenticateToken, async (req, res) => {
	try {
		const course = await Course.findByIdAndDelete(req.params.id);
		if (!course) return res.status(404).json({ message: 'Course not found' });
		res.json({ message: 'Course deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting course', error: error.message });
	}
});

// ============ CART ROUTES ============

// Get user cart
app.get('/api/cart', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('cart');
		res.json(user.cart);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching cart', error: error.message });
	}
});

// Add to cart
app.post('/api/cart/add/:courseId', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (user.cart.includes(req.params.courseId)) {
			return res.status(400).json({ message: 'Course already in cart' });
		}
		user.cart.push(req.params.courseId);
		await user.save();
		await user.populate('cart');
		res.json({ message: 'Course added to cart', cart: user.cart });
	} catch (error) {
		res.status(500).json({ message: 'Error adding to cart', error: error.message });
	}
});

// Remove from cart
app.delete('/api/cart/remove/:courseId', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		user.cart = user.cart.filter(id => id.toString() !== req.params.courseId);
		await user.save();
		await user.populate('cart');
		res.json({ message: 'Course removed from cart', cart: user.cart });
	} catch (error) {
		res.status(500).json({ message: 'Error removing from cart', error: error.message });
	}
});

// Get completed courses
app.get('/api/courses/completed', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('completedCourses');
		res.json(user.completedCourses);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching completed courses', error: error.message });
	}
});

// Get pending courses
app.get('/api/courses/pending', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('pendingCourses');
		res.json(user.pendingCourses);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching pending courses', error: error.message });
	}
});

// Mark course as completed
app.post('/api/courses/complete/:courseId', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const course = await Course.findById(req.params.courseId);
		
		if (!course) {
			return res.status(404).json({ message: 'Course not found' });
		}

		if (!user.completedCourses.includes(req.params.courseId)) {
			user.completedCourses.push(req.params.courseId);
			user.pendingCourses = user.pendingCourses.filter(id => id.toString() !== req.params.courseId);
			await user.save();

			// Generate certificate
			const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
			
			const certificate = new Certificate({
				userId: user._id,
				courseId: course._id,
				certificateId: certificateId,
				studentName: user.username,
				courseName: course.name,
				instructor: course.instructor,
				completionDate: new Date()
			});

			await certificate.save();
		}
		
		await user.populate('completedCourses');
		res.json({ 
			message: 'Course marked as completed', 
			completedCourses: user.completedCourses,
			certificateGenerated: true
		});
	} catch (error) {
		res.status(500).json({ message: 'Error marking course as completed', error: error.message });
	}
});

// Mark course as pending
app.post('/api/courses/pending/:courseId', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user.pendingCourses.includes(req.params.courseId)) {
			user.pendingCourses.push(req.params.courseId);
			user.completedCourses = user.completedCourses.filter(id => id.toString() !== req.params.courseId);
			await user.save();
		}
		await user.populate('pendingCourses');
		res.json({ message: 'Course marked as pending', pendingCourses: user.pendingCourses });
	} catch (error) {
		res.status(500).json({ message: 'Error marking course as pending', error: error.message });
	}
});

// ============ CERTIFICATE ROUTES ============

// Get user's certificates
app.get('/api/certificates', authenticateToken, async (req, res) => {
	try {
		const certificates = await Certificate.find({ userId: req.user.id }).populate('courseId');
		res.json(certificates);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching certificates', error: error.message });
	}
});

// Get specific certificate
app.get('/api/certificates/:certificateId', async (req, res) => {
	try {
		const certificate = await Certificate.findOne({ 
			certificateId: req.params.certificateId 
		}).populate('courseId');
		
		if (!certificate) {
			return res.status(404).json({ message: 'Certificate not found' });
		}
		
		res.json(certificate);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching certificate', error: error.message });
	}
});

// ============ PAYMENT ROUTES ============

// Process checkout (simulate payment)
app.post('/api/checkout', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('cart');
		
		if (user.cart.length === 0) {
			return res.status(400).json({ message: 'Cart is empty' });
		}

		// Calculate total amount
		const totalAmount = user.cart.reduce((total, course) => {
			return total + (course.isFree ? 0 : course.price);
		}, 0);

		// Simulate payment processing (in real app, integrate with payment gateway)
		// For demo purposes, we'll assume payment is successful
		
		// Get course counts before clearing cart
		const paidCourses = user.cart.filter(course => !course.isFree);
		const freeCourses = user.cart.filter(course => course.isFree);
		const totalCoursesCount = user.cart.length;
		
		// Add paid courses to purchased courses (for access control)
		for (const course of paidCourses) {
			if (!user.purchasedCourses.includes(course._id)) {
				user.purchasedCourses.push(course._id);
			}
		}
		
		// Add ALL courses (both paid and free) to pending courses
		for (const course of user.cart) {
			if (!user.pendingCourses.includes(course._id)) {
				user.pendingCourses.push(course._id);
			}
		}

		// Clear cart
		user.cart = [];
		await user.save();

		res.json({ 
			message: 'Checkout successful! All courses added to your learning list.', 
			totalAmount,
			totalCourses: totalCoursesCount,
			purchasedCourses: paidCourses.length,
			freeCourses: freeCourses.length
		});
	} catch (error) {
		res.status(500).json({ message: 'Payment failed', error: error.message });
	}
});

// Get user's purchased courses
app.get('/api/courses/purchased', authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('purchasedCourses');
		res.json(user.purchasedCourses);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching purchased courses', error: error.message });
	}
});

// Check if user can access a course
app.get('/api/courses/:id/access', authenticateToken, async (req, res) => {
	try {
		const courseId = req.params.id;
		const course = await Course.findById(courseId);
		
		if (!course) {
			return res.status(404).json({ message: 'Course not found' });
		}

		const user = await User.findById(req.user.id);
		
		// Free courses are always accessible
		if (course.isFree) {
			return res.json({ hasAccess: true, reason: 'free' });
		}
		
		// Check if user has purchased the course
		const hasPurchased = user.purchasedCourses.includes(courseId);
		
		res.json({ 
			hasAccess: hasPurchased, 
			reason: hasPurchased ? 'purchased' : 'not_purchased',
			course: course
		});
	} catch (error) {
		res.status(500).json({ message: 'Error checking course access', error: error.message });
	}
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
