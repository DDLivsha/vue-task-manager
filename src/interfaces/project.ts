import type { TaskProps } from "./task";

export interface ProjectProps {
   id?: number;
   title: string;
   tasks_quantity: number;
   description: string;
   tasks: {
      tasks_todo: TaskProps[];
      tasks_in_progress: TaskProps[];
      tasks_done: TaskProps[];
   }
   status: 'to do' | 'in progress' | 'done';
   created_at: string;
}