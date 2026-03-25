import Column from "./Column";

export default function KanbanBoard({ columns }) {
  return (
    <div className="flex gap-4">
      {columns.map(col => (
        <Column key={col.id} column={col} />
      ))}
    </div>
  );
}
