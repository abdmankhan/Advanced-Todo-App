Phase 1: Core Features (MVP - Minimum Viable Product)
✅ Set up the MERN stack
✅ User authentication (JWT + Google Sign-In + OTP setup)
✅ Task management (CRUD: Create, Read, Update, Delete tasks)
✅ Mark tasks as complete
✅ Basic UI with Redux for state management
✅ Dark mode

Phase 2: Enhancements
🔹 Email notifications
🔹 User location tracking
🔹 Reward system for task consistency

Phase 3: Advanced Features
🔸 Recurring tasks
🔸 Collaboration & sharing
🔸 Task prioritization
🔸 Voice input
🔸 Drag-and-drop & analytics

NOTES:

1. If you want to navigate after Zustand's state update, always use useEffect because Zustand updates are asynchronous.

2. How to mark as completed
   Technical Flow (How the System Handles It)
   Frontend (React) Changes:

Add a checkbox to each task in the UI.
When the user clicks the checkbox, an API request is sent to update the task in the backend.
If the API request succeeds, update the UI.
If the API request fails, show an error message and revert the checkbox state.
Backend (Node.js + Express) Changes:

Add an endpoint to handle task completion updates.
This endpoint should:
Accept the task ID and new completion status (true or false).
Validate that the logged-in user owns the task before updating.
Respond with a success or failure message.

3. **Delete task issue**
   Incorrect Querying and Deletion:

Task.findOne(req.params.id) is incorrect because findOne expects a query object, not a direct ID.
findOneAndDelete(req.params.id) is incorrect for the same reason.
Async Issue with task.title:

Task.findOne(req.params.id) returns a Promise, so task.title is undefined because task is not awaited.

</> i was doing the findOne and it takes in query object not id, have to use findbyID only

4. Google login flow [Video Moment](https://youtu.be/a75PNthqQOI?t=64)