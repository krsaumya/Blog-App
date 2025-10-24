import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/blog/all');
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `${storedToken}`;
    }
  }, [fetchBlogs]);

  const value = {
    axios, navigate, token, setToken,
    blogs, setBlogs, input, setInput, fetchBlogs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
