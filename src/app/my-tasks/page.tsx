import { Metadata } from "next"
import { MyTasksPage } from "./my-tasks-page"

export const metadata: Metadata = {
  title: "Mes Tâches",
  description: "Liste de toutes les tâches qui me sont assignées",
}

export default function Page() {
  return <MyTasksPage />
}
