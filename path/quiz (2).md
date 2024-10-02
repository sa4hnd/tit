Here’s the refined prompt adapted for a quiz application using MySQL and Prisma instead of Firebase, maintaining the same structure as your original request.

---

# Quiz Application with MySQL and Prisma Integration

## Path System Prompt:

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, and Tailwind CSS. Follow the Next.js documentation for Data Fetching, Rendering, and Routing. and i use pnpm

## App Description:

You will create a modern quiz application that utilizes MySQL for storage and Prisma for database interaction, allowing users to select subjects, years, and courses, take quizzes with multiple-choice questions, and view their results at the end, simulating a real exam environment. The application will feature a dark theme with a stylish grid dotted background.

## App Flow and Functionality:

1. **User Interface:**

   - The app opens with a homepage featuring a list of available subjects for quizzes, displayed as clickable buttons.

2. **Subject Selection:**

   - When a user clicks on a subject, they are directed to a page where they must select the year (2014 to present) and the course (first or second).

3. **Year and Course Selection:**

   - After selecting a subject, users choose the year and course from dropdown menus or buttons.
   - Once selections are made, users can navigate to the quiz page.

4. **Quiz Taking:**

   - Present a series of multiple-choice questions, one at a time, with clear answer options.
   - Include a timer to simulate a real exam environment.
   - Users can mark questions for review and navigate between questions.

5. **Submission and Results:**

   - Upon completing the quiz, users submit their answers.
   - Display a results page showing the total score, correct answers, user’s answers for comparison, and explanations for each question.

6. **Quiz History:**

   - Users can view their quiz history stored in MySQL, showing past quizzes taken, scores, and completion dates.

7. **Admin Panel:**

   - An admin interface for managing questions and user access.
   - Admins can add, edit, or delete questions and view a list of registered users.

### Key Features to Implement:

- **User Authentication:**

  - Implement user authentication using a suitable package (e.g., NextAuth.js or custom JWT) to secure access for students and admins.

- **Prisma for Data Storage:**

  - Use Prisma as an ORM to interact with the MySQL database, storing questions, quiz details, user scores, and quiz history.
  - Organize data into tables for subjects, questions, and users.

- **Dynamic Quiz Loading:**

  - Implement dynamic loading of quizzes based on user-selected subjects, years, and courses from MySQL.

- **Admin Interface:**

  - Create a dedicated admin panel with forms for adding and editing questions in the MySQL database using Prisma.
  - Implement validation for input fields.

- **Timer and Navigation:**

  - Include a countdown timer for quizzes and allow navigation between questions.

- **Comprehensive Results Display:**

  - After submission, provide a results page that shows:
    - Total score and percentage.
    - Detailed comparison of the user’s answers versus the correct answers.
    - Feedback on each question.

- **Dark Theme and Stylish Background:**

  - Implement a modern dark theme throughout the application.
  - Use a grid-looking dotted background for a contemporary feel.

- **Responsive Design:**

  - Use Shadcn UI, Radix UI, and Tailwind CSS for responsive and visually appealing design.

- **Error Handling:**

  - Ensure robust error handling for quiz loading, question management, and answer submissions.

### Required Components:

Create all necessary components for the quiz application, including but not limited to:

- `subject-list.tsx` for displaying available subjects.
- `year-selector.tsx` for selecting the year.
- `course-selector.tsx` for selecting the course.
- `quiz-selection.tsx` for presenting available quizzes based on selections.
- `quiz.tsx` for displaying questions and answer options, including a timer.
- `result-display.tsx` for showing final scores and comparisons after quiz submission.
- `quiz-history.tsx` for displaying user quiz history.
- `admin-panel.tsx` for managing questions and users.

```

This structure sets up a clear organization for your application and allows for easy scaling and maintenance. Let me know if you need any more modifications or specific implementation details!
```
