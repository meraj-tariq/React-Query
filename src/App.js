import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Form from './component/Form'

const completeTodo = (id) => {
  return () => {
    fetch('http://localhost:8000/todo/mark-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
  }
}
function App() {
  const [id, setId] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['todo'],
    queryFn: async () => (await fetch('http://localhost:8000/todo')).json(),
  })

  const todoMutation = useMutation({
    mutationFn: completeTodo(id),
    onSuccess: () => {
      console.log('Successfully created')
      queryClient.invalidateQueries('todo')
      setId('')
    },
    onError: () => {
      console.log('Error')
    },
  })

  return (
    <div className="App">
      <Form />
      {data &&
        data.data &&
        data.data.map((todo) => (
          <li>
            {todo.title}
            <button
              style={{
                marginLeft: '10px',
              }}
              disabled={todo.isCompleted}
              onClick={() => {
                setId(todo.id)
                todoMutation.mutate(todo.id)
              }}
            >
              Complete
            </button>
          </li>
        ))}
    </div>
  )
}

export default App
