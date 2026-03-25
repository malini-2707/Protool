import { motion } from "framer-motion";

export default function TaskCard({ task }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-2 mb-2 rounded shadow"
    >
      {task.title}
    </motion.div>
  );
}
