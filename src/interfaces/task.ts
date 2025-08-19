export interface TaskProps {
   id: number
   title: string
   user: string
   project_id: number
   status: 'to do' | 'in progress' | 'done'
   make_until: string
}