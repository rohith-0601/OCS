import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 16, md: 24, lg: 36 }
  const iconSize = sizes[size] || sizes.md

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="loading-container"
        >
          <Loader2 size={iconSize} className="loading-icon" />
          <p className="text-sm text-gray-500">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="loading-inline">
      <Loader2 size={iconSize} className="loading-icon" />
    </div>
  )
}

export default LoadingSpinner
