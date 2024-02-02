import moment from "moment";

export const formatDate = (): string => {
  return moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const handleError = (error: any): void => {
  console.error(error);
};
