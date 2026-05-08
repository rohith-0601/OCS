import { useState, useEffect } from 'react'
import { getBlocksApi } from '../api/roomApi'

export const useBlocks = () => {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlocksApi()
      .then((res) => setBlocks(res.data.blocks))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { blocks, loading }
}
