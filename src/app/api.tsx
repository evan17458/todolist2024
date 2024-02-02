import axios from "axios";
interface item {
  description: string;
  name: string;
  id: number;
  is_completed: boolean;
}
export const apiUrl = "https://wayi.league-funny.com/api/task";

export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${apiUrl}/${id}`);
  } catch (error: any) {
    throw new Error(error);
  }
};
export const patchTask = async (id: number) => {
  try {
    await axios.patch(`${apiUrl}/${id}`);
  } catch (error: any) {
    throw new Error(error);
  }
};
export const addTask = async (data: object) => {
  try {
    await axios.post<item>(`${apiUrl}`, data);
  } catch (error: any) {
    throw new Error(error);
  }
};
export const editTask = async (data: object, id: number) => {
  try {
    await axios.put<item>(`${apiUrl}/${id}`, data);
  } catch (error: any) {
    throw new Error(error);
  }
};
