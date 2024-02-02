"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, List, Checkbox, Input, Pagination } from "antd";
import { CloseCircleOutlined, PlusSquareTwoTone } from "@ant-design/icons";
import { formatDate, handleError } from "./utils";
import { deleteTask, patchTask, addTask, apiUrl, editTask } from "./api";
export default function Home() {
  interface item {
    description: string;
    name: string;
    id: number;
    is_completed: boolean;
  }
  const [data, setData] = useState<item[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<item[]>([]);
  const [putTaskName, setPutTaskName] = useState<string>("");
  const [putDescription, setputDescription] = useState<string>("");
  const [Description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>("");
  const [errorEditName, setErrorEditName] = useState<string>("");
  const [errorEditDescription, setErrorEditDescription] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const currentRef = useRef<number>(1);
  const [editingName, setEditingName] = useState<number>(-1);
  useEffect(() => {
    getTask();
  }, []);
  const handleDelete = async (id: number) => {
    await deleteTask(id);
    getTask();
  };
  const handlePatch = async (id: number) => {
    await patchTask(id);
    getTask();
  };
  const handleAddTask = async () => {
    if (newTaskName === "") {
      setError("必填");
      return;
    }
    await addTask({
      name: newTaskName,
      description: Description,
      is_completed: false,
      created_at: formatDate(),
    });
    getTask();
    setNewTaskName("");
    setDescription("");
  };
  const handlePutApi = async (id: number) => {
    if (putTaskName === "") {
      setErrorEditName("必填");
      return;
    }
    setEditingName(-1);
    await editTask(
      {
        name: putTaskName,
        description: putDescription,
        is_completed: false,
        updated_at: formatDate(),
      },
      id
    );
    getTask();
    setPutTaskName("");
    setputDescription("");
  };
  const getTask = async () => {
    try {
      const response = await axios.get(`${apiUrl}?page=${currentRef.current}`);
      setTotal(response.data.total);
      setData(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    maxLength: number
  ) => {
    const inputValue = e.target.value;
    if (inputValue.length > maxLength) {
      setError(`最多${maxLength}個字`);
    } else {
      setError("");
    }
    setValue(inputValue);
  };
  const InputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setNewTaskName, setError, 10);
  };

  const InputDsciption = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setDescription, setErrorDescription, 30);
  };

  const editName = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setPutTaskName, setErrorEditName, 10);
  };

  const editDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setputDescription, setErrorEditDescription, 30);
  };

  const handleShowCompleted = () => {
    const completedTasks = data.filter((item) => item.is_completed === true);
    setFilteredTasks(completedTasks);
  };
  const handleShowAll = () => {
    setFilteredTasks([]);
  };

  const onPageChanged = (page: number) => {
    currentRef.current = page;
    getTask();
  };
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <div>
        <List
          header={
            data.length > 0 && (
              <div className="flex mx:w-[375px] md:w-[536px] lg:w-[700px] ">
                <div>
                  <Input
                    placeholder="任務名稱"
                    value={newTaskName}
                    onChange={InputName}
                  />
                  {error && <div className="text-red-500">{error}</div>}
                </div>
                <div className="min-[374px]:w-[165px] min-[500px]:w-[238px] md:w-[450px] lg:w-[500px]">
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
            )
          }
          footer={
            data.length > 0 && (
              <div className="flex justify-around">
                <div> 總筆數: {total}</div>
                <Button onClick={handleShowAll}>全部</Button>
                <Button onClick={handleShowCompleted}>已完成</Button>
              </div>
            )
          }
          dataSource={filteredTasks.length > 0 ? filteredTasks : data}
          renderItem={(item, index) => (
            <List.Item>
              <div className="flex  w-full bg-white p-4  min-[374px]:w-[375px] min-[500px]:w-[450px] md:w-[530px] lg:w-[700px]">
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
                    className={`w-full min-[374px]:w-[150px] min-[500px]:w-[186px]  md:w-3/12 overflow-hidden cursor-pointer ${
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
                <div className="w-1/12 text-center">
                  <Checkbox
                    checked={item.is_completed}
                    onChange={() => handlePatch(item.id)}
                  ></Checkbox>
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
        {data.length > 0 && (
          <Pagination
            current={currentRef.current}
            onChange={onPageChanged}
            total={total}
          />
        )}
      </div>
    </main>
  );
}
