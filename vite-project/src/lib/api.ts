import axios from 'axios'
const api = axios.create({
    baseURL: 'https://aladin-ai-task.onrender.com'
})

export default api