import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseLearning.css';

function CourseLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Check course access first
      const accessResponse = await fetch(`http://localhost:5000/api/courses/${courseId}/access`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (accessResponse.ok) {
        const accessData = await accessResponse.json();
        setHasAccess(accessData.hasAccess);
        setAccessReason(accessData.reason);
        
        if (!accessData.hasAccess) {
          setLoading(false);
          return;
        }
      }
      
      // Fetch course data
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
        
        // Generate course modules based on course data
        const modules = generateCourseModules(courseData);
        setCourse({ ...courseData, modules });
      } else {
        navigate('/courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const generateCourseModules = (courseData) => {
    // Generate modules based on course category and content
    const baseModules = [
      {
        title: "Course Overview",
        duration: "5 min",
        description: `Welcome to ${courseData.name}. In this module, you'll get an overview of what you'll learn and the prerequisites needed.`,
        content: `
          <h3>Welcome to ${courseData.name}</h3>
          <p>This comprehensive course will take you through ${courseData.duration} of learning over ${courseData.days} days.</p>
          <h4>What you'll learn:</h4>
          <ul>
            <li>Fundamental concepts and principles</li>
            <li>Practical implementation techniques</li>
            <li>Real-world applications and examples</li>
            <li>Best practices and industry standards</li>
          </ul>
          <h4>Prerequisites:</h4>
          <ul>
            <li>Basic understanding of programming concepts</li>
            <li>Familiarity with development tools</li>
            <li>Enthusiasm to learn!</li>
          </ul>
        `
      }
    ];

    // Add category-specific modules
    if (courseData.category === 'JavaScript') {
      baseModules.push(
        {
          title: "JavaScript Fundamentals",
          duration: "45 min",
          description: "Learn the core concepts of JavaScript including variables, functions, and control structures.",
          content: `
            <h3>JavaScript Fundamentals</h3>
            <p>JavaScript is a versatile programming language that powers the web.</p>
            <h4>Key Topics:</h4>
            <ul>
              <li>Variables and Data Types</li>
              <li>Functions and Scope</li>
              <li>Control Structures (if/else, loops)</li>
              <li>Objects and Arrays</li>
            </ul>
            <h4>Code Example:</h4>
            <pre><code>
// Variable declaration
let message = "Hello, World!";
const PI = 3.14159;

// Function definition
function greetUser(name) {
    return \`Hello, \${name}!\`;
}

// Using the function
console.log(greetUser("Developer"));
            </code></pre>
          `
        },
        {
          title: "DOM Manipulation",
          duration: "60 min",
          description: "Learn how to interact with HTML elements using JavaScript.",
          content: `
            <h3>DOM Manipulation</h3>
            <p>The Document Object Model (DOM) allows JavaScript to interact with HTML elements.</p>
            <h4>Key Concepts:</h4>
            <ul>
              <li>Selecting Elements</li>
              <li>Modifying Content and Attributes</li>
              <li>Event Handling</li>
              <li>Creating Dynamic Content</li>
            </ul>
            <h4>Example:</h4>
            <pre><code>
// Select an element
const button = document.getElementById('myButton');

// Add event listener
button.addEventListener('click', function() {
    document.getElementById('output').textContent = 'Button clicked!';
});
            </code></pre>
          `
        }
      );
    } else if (courseData.category === 'React') {
      baseModules.push(
        {
          title: "React Components",
          duration: "50 min",
          description: "Understanding React components and JSX syntax.",
          content: `
            <h3>React Components</h3>
            <p>Components are the building blocks of React applications.</p>
            <h4>Key Topics:</h4>
            <ul>
              <li>Functional vs Class Components</li>
              <li>JSX Syntax</li>
              <li>Props and State</li>
              <li>Component Lifecycle</li>
            </ul>
            <h4>Example Component:</h4>
            <pre><code>
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        &lt;div&gt;
            &lt;h2&gt;Count: {count}&lt;/h2&gt;
            &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
                Increment
            &lt;/button&gt;
        &lt;/div&gt;
    );
}

export default Counter;
            </code></pre>
          `
        },
        {
          title: "State Management",
          duration: "40 min",
          description: "Learn how to manage state in React applications.",
          content: `
            <h3>State Management in React</h3>
            <p>State management is crucial for building interactive React applications.</p>
            <h4>Topics Covered:</h4>
            <ul>
              <li>useState Hook</li>
              <li>useEffect Hook</li>
              <li>Context API</li>
              <li>State Best Practices</li>
            </ul>
          `
        }
      );
    } else {
      // Generic modules for other categories
      baseModules.push(
        {
          title: "Core Concepts",
          duration: "40 min",
          description: "Learn the fundamental concepts and principles.",
          content: `
            <h3>Core Concepts</h3>
            <p>Understanding the fundamental principles is essential for mastering ${courseData.category}.</p>
            <h4>What you'll learn:</h4>
            <ul>
              <li>Basic terminology and concepts</li>
              <li>Key principles and methodologies</li>
              <li>Common patterns and practices</li>
              <li>Tools and resources</li>
            </ul>
          `
        },
        {
          title: "Practical Applications",
          duration: "60 min",
          description: "Apply your knowledge with hands-on exercises and projects.",
          content: `
            <h3>Practical Applications</h3>
            <p>Put your knowledge into practice with real-world examples and exercises.</p>
            <h4>Activities:</h4>
            <ul>
              <li>Hands-on coding exercises</li>
              <li>Project-based learning</li>
              <li>Problem-solving scenarios</li>
              <li>Best practice implementations</li>
            </ul>
          `
        }
      );
    }

    // Add conclusion module
    baseModules.push({
      title: "Course Conclusion",
      duration: "10 min",
      description: "Wrap up your learning journey and explore next steps.",
      content: `
        <h3>Congratulations!</h3>
        <p>You've successfully completed ${courseData.name}!</p>
        <h4>What you've accomplished:</h4>
        <ul>
          <li>Mastered core concepts and principles</li>
          <li>Completed practical exercises</li>
          <li>Built real-world applications</li>
          <li>Developed industry-relevant skills</li>
        </ul>
        <h4>Next Steps:</h4>
        <ul>
          <li>Practice with personal projects</li>
          <li>Explore advanced topics</li>
          <li>Join developer communities</li>
          <li>Consider related courses</li>
        </ul>
        <p>Keep learning and building amazing things!</p>
      `
    });

    return baseModules;
  };

  const markModuleComplete = (moduleIndex) => {
    if (!completedModules.includes(moduleIndex)) {
      setCompletedModules([...completedModules, moduleIndex]);
    }
  };

  const markCourseComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/courses/complete/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('🎉 Congratulations! Course completed successfully!\n\n🏆 Your certificate has been generated!\n📜 View it in "My Learning" → "Completed" section');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error marking course as complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="course-loading">
        <div className="loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (!hasAccess && !loading) {
    return (
      <div className="course-error">
        <h2>Access Denied</h2>
        <p>You need to purchase this course to access the content.</p>
        <div className="access-actions">
          <button onClick={() => navigate('/courses')} className="btn-secondary">
            Browse Courses
          </button>
          <button onClick={() => navigate('/cart')} className="btn-primary">
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-error">
        <h2>Course not found</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const progress = ((completedModules.length / course.modules.length) * 100).toFixed(0);

  return (
    <div className="course-learning">
      <div className="course-header">
        <div className="container">
          <button onClick={() => navigate('/cart')} className="back-button">
            ← Back to My Learning
          </button>
          <h1>{course.name}</h1>
          <div className="course-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{progress}% Complete</span>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="container">
          <div className="learning-layout">
            <div className="course-sidebar">
              <h3>Course Modules</h3>
              <div className="modules-list">
                {course.modules.map((module, index) => (
                  <div
                    key={index}
                    className={`module-item ${currentModule === index ? 'active' : ''} ${
                      completedModules.includes(index) ? 'completed' : ''
                    }`}
                    onClick={() => setCurrentModule(index)}
                  >
                    <div className="module-status">
                      {completedModules.includes(index) ? '✓' : index + 1}
                    </div>
                    <div className="module-info">
                      <h4>{module.title}</h4>
                      <span className="module-duration">{module.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="course-main">
              <div className="module-content">
                <div className="module-header">
                  <h2>{currentModuleData.title}</h2>
                  <span className="module-duration">Duration: {currentModuleData.duration}</span>
                </div>
                
                <div className="module-description">
                  <p>{currentModuleData.description}</p>
                </div>

                <div className="module-body">
                  <div dangerouslySetInnerHTML={{ __html: currentModuleData.content }} />
                </div>

                <div className="module-actions">
                  {!completedModules.includes(currentModule) && (
                    <button
                      onClick={() => markModuleComplete(currentModule)}
                      className="btn-complete-module"
                    >
                      Mark as Complete
                    </button>
                  )}
                  
                  {currentModule < course.modules.length - 1 && (
                    <button
                      onClick={() => setCurrentModule(currentModule + 1)}
                      className="btn-next-module"
                    >
                      Next Module →
                    </button>
                  )}
                  
                  {currentModule === course.modules.length - 1 && completedModules.length === course.modules.length && (
                    <button
                      onClick={markCourseComplete}
                      className="btn-complete-course"
                    >
                      Complete Course 🎉
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseLearning;