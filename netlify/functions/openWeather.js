export const handler = async () => {
    const POKE_API = 'https://dummyjson.com/products'
  
    const response = await fetch(POKE_API)
    const data = await response.json()
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        data
      }, null, 2)
    }
  }