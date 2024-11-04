import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
  return response.data;
};

export const createCategory = async (category) => {
  const response = await axios.post(`${API_BASE_URL}/categories`, category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await axios.put(`${API_BASE_URL}/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`${API_BASE_URL}/categories/${id}`);
};

export const deleteCategories = async (ids) => {
  try {
      await axios.post(`${API_BASE_URL}/categories/delete`, ids );
  } catch (error) {
      console.error('Error deleting categories:', error);
      throw error;
  }
};

// Subcategory API calls
export const getTopicsByCategoryId = async (categoryId) => {
  const response = await axios.get(`${API_BASE_URL}/topic/category/${categoryId}`);
  return response.data;
};

export const getTopicById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/topic/${id}`);
  return response.data;
};

export const createTopic = async (subcategory) => {
  const response = await axios.post(`${API_BASE_URL}/topic`, subcategory);
  return response.data;
};

export const updateTopic = async (id, subcategory) => {
  const response = await axios.put(`${API_BASE_URL}/topic/${id}`, subcategory);
  return response.data;
};

export const deleteTopic = async (id) => {
  await axios.delete(`${API_BASE_URL}/topic/${id}`);
};

export const deleteTopics = async (ids) => {
  try {
      await axios.post(`${API_BASE_URL}/topic/delete`, ids );
  } catch (error) {
      console.error('Error deleting categories:', error);
      throw error;
  }
};
