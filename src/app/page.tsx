"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, List, Checkbox, Input, Pagination, Modal } from "antd";
import { CloseCircleOutlined, PlusSquareTwoTone } from "@ant-design/icons";

export default function Home() {
  interface item {
    description: string;
    name: string;
    id: number;
    is_completed: boolean;
  }
  const moment = require("moment");
  const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
  const [data, setData] = useState<item[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<item[]>([]);

  const [putTaskName, setPutTaskName] = useState<string>("");
  const [putDescription, setputDescription] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorEditName, setErrorEditName] = useState("");
  const [errorEditDescription, setErrorEditDescription] = useState("");
  const [total, setTotal] = useState(0);
  const currentRef = useRef<number>(1);
  // const putTaskName = useRef<string>("");
  const [editingName, setEditingName] = useState(-1);
  const apiUrl = "https://wayi.league-funny.com/api/task";

  const handleDelete = async (id: number) => {
    await axios.delete(`${apiUrl}/${id}`);
    getTask();
  };

  const handlePatch = async (id: number) => {
    await axios.patch(`${apiUrl}/${id}`);
    getTask();
  };
  const handlePutApi = async (id: number) => {
    if (putTaskName === "") {
      setError("必填");
    }

    try {
      setEditingName(-1);
      await axios.put<item>(`${apiUrl}/${id}`, {
        name: putTaskName,
        description: putDescription,
        is_completed: false,
        //created_at: currentDate,
        updated_at: currentDate,
      });
      getTask();
      setPutTaskName("");
      setputDescription("");
    } catch (error) {
      console.error("Error Put task:", error);
    }
  };
  const handleAddTask = async () => {
    if (newTaskName === "") {
      setError("必填");
    } else {
      try {
        await axios.post<item>(`${apiUrl}`, {
          name: newTaskName,
          description: Description,
          is_completed: false,
          created_at: currentDate,
          updated_at: "2023-01-02T17:00:00Z",
        });
        getTask();
        setNewTaskName("");
        setDescription("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };
  const getTask = async () => {
    try {
      const response = await axios.get(`${apiUrl}?page=${currentRef.current}`);
      setTotal(response.data.total);
      const ans = response.data.data;
      const newArray: {
        description: string;
        name: string;
        id: number;
        is_completed: boolean;
      }[] = ans.map((item: item) => ({
        description: item.description,
        name: item.name,
        id: item.id,
        is_completed: item.is_completed,
      }));
      setData(newArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const InputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 10) {
      setError("最多10個字");
    } else {
      setError("");
    }
    setNewTaskName(inputValue);
  };

  const InputDsciption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 30) {
      setErrorDescription("最多30個字");
    } else {
      setErrorDescription("");
    }
    setDescription(inputValue);
  };

  const editName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 10) {
      setErrorEditName("最多10個字");
    } else {
      setErrorEditName("");
    }
    setPutTaskName(inputValue);
  };
  const editDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 30) {
      setErrorEditDescription("最多30個字");
    } else {
      setErrorEditDescription("");
    }
    setputDescription(inputValue);
  };
  const handleShowCompleted = () => {
    const completedTasks = data.filter((item) => item.is_completed === true);
    setFilteredTasks(completedTasks);
  };
  const handleShowAll = () => {
    setFilteredTasks([]);
  };

  useEffect(() => {
    getTask();
  }, []);
  const onChange = (page: number) => {
    currentRef.current = page;
    getTask();
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div className="flex ml-auto items-center ">
        <div className="flex ml-auto items-center w-[300px]">
          <div> 總筆數: {total}</div>
          <Button onClick={handleShowAll}>全部</Button>
          <Button onClick={handleShowCompleted}>已完成</Button>
        </div>
      </div>

      <div className="flex mx:w-[375px] md:w-[500px] lg:w-[700px] ">
        <div>
          <Input
            placeholder="任務名稱"
            value={newTaskName}
            onChange={InputName}
          />
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <div className="mx:w-[200px] md:w-[300px] lg:w-[500px]">
          <Input
            placeholder="任務描述"
            value={Description}
            onChange={InputDsciption}
            className="h-[30px]"
          />
          {errorDescription && (
            <div className="text-red-500">{errorDescription}</div>
          )}
        </div>
        <PlusSquareTwoTone
          className="cursor-pointer text-3xl "
          onClick={handleAddTask}
        />
      </div>

      <div>
        <List
          bordered
          dataSource={filteredTasks.length > 0 ? filteredTasks : data}
          renderItem={(item, index) => (
            <List.Item>
              <div className="flex justify-between w-full bg-white p-4 min-[500px]:w-[375px] md:w-[500px] lg:w-[700px]">
                {editingName === index ? (
                  <div className="w-3/12">
                    名稱: {item.name}
                    <Input
                      placeholder="輸入新名稱"
                      value={putTaskName}
                      onChange={(e) => editName(e)}
                    />
                    {errorEditName && (
                      <div className="text-red-500">{errorEditName}</div>
                    )}
                    <Button onClick={() => handlePutApi(item.id)}>修改</Button>
                  </div>
                ) : (
                  <div
                    className={`w-full md:w-3/12 overflow-hidden cursor-pointer ${
                      item.is_completed ? "line-through" : "no-underline"
                    }`}
                    onClick={() => setEditingName(index)}
                  >
                    名稱:
                    {item.name}
                  </div>
                )}
                {editingName === index ? (
                  <div className="w-7/12">
                    描述:{item.description}
                    <Input
                      placeholder="輸入新描述"
                      value={putDescription}
                      onChange={(e) => editDescription(e)}
                    />
                    {errorEditDescription && (
                      <div className="text-red-500">{errorEditDescription}</div>
                    )}
                    <Button onClick={() => handlePutApi(item.id)}>修改</Button>
                  </div>
                ) : (
                  <div
                    className={`w-full md:w-7/12 overflow-hidden cursor-pointer ${
                      item.is_completed ? "line-through" : "no-underline"
                    }`}
                    onClick={() => setEditingName(index)}
                  >
                    描述:
                    {item.description}
                  </div>
                )}
                {/* </div> */}
                <div className="w-1/12 text-center">
                  <Checkbox
                    checked={item.is_completed}
                    onChange={() => handlePatch(item.id)}
                  >
                    {/* {item.id} */}
                  </Checkbox>
                </div>
                <div className="w-1/12 text-center">
                  <CloseCircleOutlined
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      <div>
        <Pagination
          current={currentRef.current}
          onChange={onChange}
          total={total}
        />
      </div>
    </main>
  );
}
