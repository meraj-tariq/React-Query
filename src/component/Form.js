import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createTodo = (text) => {
  return () => {
    fetch('http://localhost:8000/todo/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: text }),
    })
  }
}

const Form = () => {
  const queryClient = useQueryClient()
  const [text, setText] = useState('')

  const todoMutation = useMutation({
    mutationFn: createTodo(text),
    onSuccess: () => {
      console.log('Successfully created')
      queryClient.invalidateQueries('todo')
    },
    onError: () => {
      console.log('Error')
    },
  })

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => todoMutation.mutate()}>Create</button>
    </div>
  )
}

export default Form
