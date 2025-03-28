EmployWise Assignment

A React application for user management, integrating with the Reqres API (https://reqres.in/). This project features authentication, a paginated user list with search functionality, user editing/deletion, and a responsive UI built with Tailwind CSS and Shadcn components.

Features
- Authentication: Login and sign-up pages with token persistence using localStorage.
- User Management:
  - Paginated list of users displayed in Shadcn-inspired cards.
  - Edit and delete functionality for individual users.
  - Client-side search across all users with dynamic pagination.
- Pagination: Uses Shadcn's Pagination component to display all pages dynamically.
- State Management: AuthContext for managing authentication state (login/logout).
- UI: Responsive design with Tailwind CSS and reusable Shadcn components.
- Notifications: Success/error messages displayed via react-toastify.

Tech Stack
- Frontend: React
- Routing: React Router DOM
- HTTP Requests: Axios
- Styling: Tailwind CSS + Shadcn UI components
- Notifications: React Toastify
- State Management: React Context API (AuthContext)

Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

Setup Instructions
1. Clone the Repository:
   git clone https://github.com/yourusername/employwise-assignment.git
   cd employwise-assignment

2. Install Dependencies:
   npm install

3. Initialize Shadcn UI (if not already included in the repo):
   npx shadcn-ui@latest init
   Follow the prompts to configure Tailwind CSS and set up the components/ui directory.

4. Add Pagination Component (if not already included):
   npx shadcn-ui@latest add pagination

5. Run the Application:
   npm start
   The app will start at http://localhost:3000.

Usage
1. Login:
   - Navigate to /.
   - Use credentials:
     - Email: eve.holt@reqres.in
     - Password: cityslicka
   - Successful login redirects to /users.

2. Sign Up:
   - Navigate to /signup.
   - Enter an email and password (e.g., eve.holt@reqres.in and cityslicka).
   - Successful registration redirects to /users.

3. Users List:
   - View all users in a card layout.
   - Search by name to filter users across all pages.
   - Use pagination to navigate through results.
   - Edit or delete users via buttons on each card.
   - Logout from the top-right button.

4. Edit User:
   - Click "Edit" on a user card to update their details.
   - Save changes to return to the users list.

Project Structure
src/
├── components/
│   ├── Login.js          # Login page
│   ├── SignUp.js         # Sign-up page
│   ├── UsersList.js      # Paginated user list with search
│   └── EditUser.js       # User edit form
├── context/
│   └── AuthContext.js    # Authentication context
├── components/ui/
│   └── pagination.jsx    # Shadcn Pagination components
├── App.js                # Main app with routing
├── index.js              # Entry point
└── index.css             # Tailwind CSS setup

Assumptions
- Reqres API: A mock API is used, so changes (edit/delete) are not persisted server-side but reflected client-side.
- Token: No expiration handling, as Reqres tokens are static.
- Pagination: Fetches all users initially to enable search across all pages, assuming a small dataset (Reqres has 12 users total).
- Shadcn Setup: Assumes Shadcn components are manually added or installed via the CLI.

Deployment
To deploy the app (e.g., on Netlify):
1. Build the Project:
   npm run build

2. Deploy to Netlify:
   - Push the repository to GitHub.
   - Connect your GitHub repo to Netlify.
   - Set the build command to npm run build and publish directory to build.
   - Deploy and access the live URL (e.g., https://your-app-name.netlify.app).

Live URL: [Insert Live URL Here After Deployment]

License
This project is for educational purposes and not licensed for production use.

---# employwise-assignment
