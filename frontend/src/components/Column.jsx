import TaskCard from "./TaskCard";

export default function Column({ column }) {
  return (
    <div className="w-64 bg-gray-200 p-3 rounded">
      <h3 className="font-semibold mb-2">{column.name}</h3>

      {column.tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
