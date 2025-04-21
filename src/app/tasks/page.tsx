import { Metadata } from "next"
import { TasksPage } from "./tasks-page"

export const metadata: Metadata = {
  title: "Priorités",
  description: "Organisez et priorisez vos tâches",
}

export default function Page() {
  return <TasksPage />
}
