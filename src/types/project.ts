export type NextStep = {
    text: string;
    completed: boolean;
  };

  export type Project = {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    nextSteps: NextStep[] | null;
    deployment?: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };

  export type ProjectFormData = {
    title: string;
    description?: string;
    status: string;
    nextSteps: NextStep[];
    deployment?: string;
  };
