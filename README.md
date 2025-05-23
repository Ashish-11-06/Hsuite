# HSuite  – Medical Coding Platform

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

HSuite is a web-based platform designed for medical students, professionals, and doctors to access, manage, and review medical books and coding systems. The application includes role-based access tailored to different user types, enabling a collaborative and interactive environment for learning and professional development.

Purpose
HSuite aims to provide structured medical knowledge through accessible code sets and books, along with personality and knowledge testing tools for users to assess and improve their skills and traits.

 User Roles
Contributor
Contributors are responsible for adding, editing, deleting, and managing code sets and books. They ensure the accuracy and quality of the content.

Counsellor
Counsellors are professional doctors who guide users in improving their personal and professional categories. They can also provide personalized treatment plans based on personality test results.

Admin
Admins manage all users and assign roles (Contributor, Counsellor, or standard User). They also have full access to the system for maintenance and oversight.

User (Student/General)
Users can view all available books and code sets. Additionally, they have access to various tests to assess their knowledge and personality traits.

 Knowledge & Personality Testing
HSuite offers several tests for users:

Personality Test
Analyze your personality traits and get actionable insights.

Ego Gram Test
Evaluate your personality structure and identify strengths and areas for improvement.

MCQ Knowledge Test
Test your medical knowledge through multiple-choice questions.

After completing a test, users receive instant results. Based on personality tests, users can choose one of two improvement paths:

Predefined Treatment Steps: Created and maintained by the Admin.

Personalized Treatment Steps: Provided directly by a Counsellor.

🛠️ Tech Stack
Frontend: React.js with Redux

Backend: Django

UI/UX Design: Ant Design (AntD)