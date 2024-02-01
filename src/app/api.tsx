import axios from "axios";

interface TaskItem {
  description: string;
  name: string;
  id: number;
  is_completed: boolean;
}

const fetchTaskData = async (
  currentPage: number,
  setTotal: React.Dispatch<React.SetStateAction<number>>,
  setData: React.Dispatch<React.SetStateAction<TaskItem[]>>
): Promise<void> => {
  try {
    const response = await axios.get(
      `https://wayi.league-funny.com/api/task?page=${currentPage}`
    );
    setTotal(response.data.total);

    const ans: any[] = response.data.data; // Adjust the type if necessary
    const newArray: TaskItem[] = ans.map((item: any) => ({
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

export default fetchTaskData;
