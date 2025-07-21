🎓 Career Counseling App – OnBook  💼

Connect students with expert career counselors for one-on-one guidance, session booking, and personalized career support.

Real-time appointments powered by React, Firebase, and a fully responsive UI.

🔗 Live Demo: https://peppy-dolphin-e49bbb.netlify.app/

📁 GitHub Repo: https://github.com/sachinkumanache/careerCounseling

🚀 Features

✅ Student Registration and Login (Firebase Auth)

✅ Browse Available Counselors with Profile Images

✅ Book Counseling Sessions by Time and Date

✅ Real-Time Session Management with Firebase Database

✅ Session Timer: Countdown to the Meeting Time

✅ Dashboard for Users to See Booked Sessions and Counselor Details

✅ Admin Panel to View All Bookings and Manage Data

✅ Responsive UI for Both Mobile and Desktop

🖼️ Screenshots
<img width="1366" height="768" alt="Screenshot (525)" src="https://github.com/user-attachments/assets/28e2a6dd-6e53-41a9-a119-8d792f3f8774" />

<img width="1366" height="768" alt="Screenshot (526)" src="https://github.com/user-attachments/assets/2fc573e8-7915-440d-afe1-22fefbe08f7a" />

<img width="1366" height="768" alt="Screenshot (527)" src="https://github.com/user-attachments/assets/1c519290-207d-4aaf-8eee-6319119f7cc3" />



📦 Tech Stack

Tech	Usage
React	UI Development

Firebase Auth	User Authentication

Firebase Realtime DB	Storing Sessions & Counselor Info

Context API	Theme Management (Light/Dark Mode)

CSS Modules / Custom CSS	Responsive Design

React Router DOM	Routing and Navigation

📂 Folder Structure

src/                     
├── components/      
│   ├── Navbar.jsx    
│   ├── CounselorCard.jsx   
│   ├── SessionTimer.jsx    
├── pages/     
│   ├── Home.jsx      
│   ├── BookSession.jsx   
│   ├── Dashboard.jsx    
│   ├── AdminPanel.jsx        
│   ├── Login.jsx         
│   ├── Signup.jsx           
├── context/        
│   ├── ThemeContext.js      
├── firebase/      
│   ├── firebaseConfig.js       
├── App.jsx      
├── main.jsx      
└── index.css   

🔐 Authentication  

Firebase Authentication for secure sign-up and login.

Protected routes for Dashboard/Admin Panel using PrivateRoute.

User session is stored and checked using onAuthStateChanged.

🛠️ How to Run Locally

# 1. Clone the repo
git clone https://github.com/sachinkumanache/careerCounseling.git

# 2. Navigate into the folder
cd careerCounseling

# 3. Install dependencies
npm install

# 4. Set up Firebase
- Create a Firebase project
- Enable Authentication and Realtime Database
- Replace your Firebase config inside firebaseConfig.js

# 5. Run the app
npm run dev

🙋‍♂️ Author 
Sachin Kumanache

🔗 LinkedIn-https://www.linkedin.com/in/sachin-kumanache/

📫 GitHub-https://github.com/sachinkumanache

