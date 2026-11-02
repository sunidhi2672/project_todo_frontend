import React, { useEffect, useState } from "react";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = async () => {
    const trimmedTask = task.trim();

    if (!trimmedTask) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: trimmedTask,
      },
    ]);

    const todoPayload = {
      title: task,
      complete: false,
    };

    const res = await fetch("http://localhost:5000/todo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server you are sending JSON
        // 'Authorization': 'Bearer 6876uygufhgfygfhgghkhgjhghj' (Add this line if authentication is required)
      },
      body: JSON.stringify(todoPayload),
    });
    // console.log(await res.json(),"a gyea res")
    setTask("");
  };



  
  const getTodo = async () => {
    const res = await fetch("http://localhost:5000/todo/get", {
      method: "GET",
    });

    const todoData = await res.json();
    // console.log(todoData,"a gyea res")
    setTodos(todoData);
  };

  useEffect(() => {
    getTodo();
  }, []);

  const removeTodo = async (id) => {
    setTodos(todos.filter((todo) => todo._id !== id));

    const todoPayload = { todoId: id };
    console.log(todoPayload);
    const res = await fetch("http://localhost:5000/todo/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Tell the server you are sending JSON
        // 'Authorization': 'Bearer 6876uygufhgfygfhgghkhgjhghj' (Add this line if authentication is required)
      },
      body: JSON.stringify(todoPayload),
    });
  };
  const handleUpdateTodo = async (id) => {
    const existingTodo = todos.find((todo) => todo._id == id);
    console.log(existingTodo, "phala");
    const completedTodo = {
      ...existingTodo,
      complete: true,
    };
    console.log(completedTodo, "duja");
    // const todoPayload = { todoId : id  };
    // console.log(todoPayload)
    const res = await fetch("http://localhost:5000/todo/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Tell the server you are sending JSON
        // 'Authorization': 'Bearer 6876uygufhgfygfhgghkhgjhghj' (Add this line if authentication is required)
      },
      body: JSON.stringify(completedTodo),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            My Todo List
          </h1>

          <p className="mt-2 text-gray-500">
            Keep track of what you need to do ✨
          </p>
        </div>

        {/* Add Todo */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500"
          />

          <button
            onClick={addTodo}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center">
              <div className="mb-2 text-4xl">📝</div>

              <p className="font-medium text-gray-500">No todos yet</p>

              <span className="text-sm text-gray-400">
                Add something above to get started.
              </span>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:bg-gray-100"
              >
                <span
                  className={`flex-1 break-words text-gray-700 ${todo.complete ? "line-through" : " "}`}
                >
                  {todo.title}
                </span>

                <button
                  onClick={() => removeTodo(todo._id)}
                  title="Remove todo"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl leading-none text-red-500 transition hover:bg-red-200 hover:text-red-600 active:scale-90"
                >
                  ×
                </button>
                {todo.complete ? (
                  ""
                ) : (
                  <button
                    onClick={() => handleUpdateTodo(todo._id)}
                    className="p-2 bg-blue-600 text-white rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-5 text-right text-sm text-gray-400">
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </div>
        )}
      </div>
    </div>
  );
}
