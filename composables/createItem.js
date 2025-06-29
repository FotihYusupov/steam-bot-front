import axios from 'axios'
import { navigateTo, useRuntimeConfig } from 'nuxt/app';

async function createItem (route, data) {
  try {
    const token = JSON.parse(localStorage.getItem('token'))

    if(!token) {
      localStorage.removeItem('token')
      navigateTo('/login')
    }

    const config = useRuntimeConfig();
    const response = await axios.post(`${config.public.url}${route}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data
  } catch (err) {
    console.log('Error in creating data:', err.message)
  }
}

export default createItem;
