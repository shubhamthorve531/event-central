import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
<div className="p-4">
      <h1 className="text-2xl font-bold">Event Central</h1>
      <p>Welcome to Event Management Platform</p>
    </div>
  )
}

export default App
