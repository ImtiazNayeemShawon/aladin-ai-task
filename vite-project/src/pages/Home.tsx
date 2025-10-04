import SandboxCard from '../components/sandboxCard'
import api from '../lib/api'
import { useState, useEffect } from 'react'



export default function App() {

  const [sandboxes, setSandboxes] = useState([])
  useEffect(() => {
    api.get('/sandboxes').then((res) => {
      setSandboxes(res.data.sandboxes)
    })
  }, [])


  return (
    <div>
      <div className="m-10">
        <svg
          className="feather feather-codesandbox"
          fill="none"
          height={44}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
          width={44}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
          <polyline points="7.5 19.79 7.5 14.6 3 12" />
          <polyline points="21 12 16.5 14.6 16.5 19.79" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1={12} x2={12} y1="22.08" y2={12} />
        </svg>
      </div>
      <div className="m-10 mt-60">
        <div className="grid grid-cols-2 border-b border-zinc-800 h-96">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold">Faster,Cleaner,Easier</h1>
            <p className="">Create a new sandbox in seconds with our easy-to-use interface. No coding required.</p>
            <button className="border cursor-pointer px-10 py-2 rounded-xl bg-amber-50 text-black font-">Create a Sandbox</button>
          </div>
          <div>
          </div>
        </div>

      </div>
      {/* previus sandboxes */}
      <div className="m-10">
        <h1 className="text-2xl font-bold">Previous Sandboxes</h1>
        <div className="grid grid-cols-4 gap-4 m-10">
          {sandboxes.map((sandbox) => (
            <SandboxCard sandbox={sandbox} />
          ))}
        </div>
      </div>
    </div>
  )
}
