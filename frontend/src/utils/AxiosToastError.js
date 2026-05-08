import { toast } from 'react-hot-toast';

const AxiosToastError = (error) => {
  console.error("Axios Error:", error); 
  let errorMessage = "Something went wrong!"; 
  if (error.response) {
    errorMessage = error.response.data?.message || `Error ${error.response.status}`;
  } else if (error.request) {
    errorMessage = "No response from server. Check your internet connection.";
  } else {
    errorMessage = error.message;
  }
  toast.error(errorMessage); 
};

export default AxiosToastError;
