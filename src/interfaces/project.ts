export interface ProjectProps {
   id: number;
   title: string;
   tasks_quantity: number;
   status: 'to do' | 'in progress' | 'done';
   created_at: string;
}