# TaskOra

**TaskOra** is a smart and interactive web-based task management application designed to help you **never miss a task again**. It allows you to store tasks with date and time, get notifications before the task, and receive a beep alarm at the exact time of the task. The app also visually prioritizes tasks based on their remaining time using animations and colors.

---

## 🌟 Features

1. **Task Management with Time:** Manage your tasks efficiently with associated date and time.  
2. **Save Tasks:** Add your tasks along with their date and time for easy tracking.  
3. **Notifications:** Get notified before your task is due.  
4. **Exact-Time Alarm:** Beep alert at the exact scheduled time.  
5. **Visual Task Prioritization:** Tasks are displayed with animations and color cues according to remaining time (less time = more urgent visual cue).  
6. **Interactive Web Experience:** Users can test all functionality directly through a provided link (to be updated after deployment).  
7. **Simple Task Input:** Add task description and date-time easily, click "Save / Add Task" to store and view tasks.

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript  
- **Backend:** Node.js, Express.js, MongoDB  
- **Database:** MongoDB

---

## 📁 Project Structure

```
TaskOra/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── server.js
    ├── package.json
    ├── .env
    ├── models/
    │   └── Task.js
    └── routes/
        └── tasks.js
```

---

## 🚀 Getting Started

### Frontend
To run the frontend locally:
1. Navigate to the `frontend` directory
2. Open `index.html` in your browser

### Backend
To run the backend server:
1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables
4. Start the server: `npm start` or `npm run dev`

---

## 📝 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

Rudra Bhuyan - [GitHub](https://github.com/Rudra-011)