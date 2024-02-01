import React, { useState } from "react";
import { Input, Button } from "antd";
import axios from "axios";
import fetchTaskData from "./api";
const TaskInputForm = () => {
  const [newTaskName, setNewTaskName] = useState("");
  const [Description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  interface item {
    description: string;
    name: string;
    id: number;
    is_completed: boolean;
  }
  const moment = require("moment");

  const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 10) {
      setError("任務名稱最多10個字");
    } else {
      setError("");
    }
    setNewTaskName(inputValue);
  };

  const handleAddTask = async () => {
    try {
      await axios.post<item>("https://wayi.league-funny.com/api/task", {
        name: newTaskName,
        description: Description,
        is_completed: false,
        created_at: currentDate,
        updated_at: "2023-01-02T17:00:00Z",
      });
      // getTask();
      //fetchTaskData()
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="flex">
      <div>
        <Input
          placeholder="任務名稱"
          value={newTaskName}
          onChange={handleInputChange}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      <Input
        placeholder="任務描述"
        value={Description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        type="primary"
        size="small"
        className="bg-blue-500 text-white  rounded"
        onClick={handleAddTask}
      >
        增加
      </Button>
    </div>
  );
};

export default TaskInputForm;
