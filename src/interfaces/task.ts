export interface TaskProps {
   id: number
   title: string
   executor: string
   project_id: number
   status: 'to do' | 'in progress' | 'done'
   make_until: string
}