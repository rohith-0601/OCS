import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  const dots = [0, 1, 2]

  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5">
          {dots.map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-brand-500"
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.85, 1.1, 0.85],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <motion.p
          className="text-xs font-medium text-gray-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingSpinner
