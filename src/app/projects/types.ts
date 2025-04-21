export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  nextSteps: any | null; // JSON type
  deployment: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProjectFormData {
  title: string;
  description: string | null;
  status: string;
  nextSteps: any | null;
  deployment: string | null;
}

export interface ProjectUpdateData extends ProjectFormData {
  id: string;
}
