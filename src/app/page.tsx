'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)

  const fetchItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    setItems(data || [])
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSave = async () => {
    if (!title) return

    if (editId) {
      await supabase.from('items').update({ title }).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('items').insert([{ title }])
    }

    setTitle('')
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('items').delete().eq('id', id)
    fetchItems()
  }

  const handleEdit = (item: any) => {
    setTitle(item.title)
    setEditId(item.id)
  }

  return (
   <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
  {/* Centered card */}
  <div className="card w-96 h-[500px] flex flex-col p-6  ">
    <h1 className="text-xl font-bold mb-4 text-center">Next.js + Supabase</h1>

    {/* Input Section */}
    <div className="flex gap-2 mb-4">
      <input
        className="input flex-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter item"
      />
      <button className="button" onClick={handleSave}>
        {editId ? 'Update' : 'Add'}
      </button>
    </div>

    {/* List Section */}
    <ul className="flex-1 overflow-y-auto space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex-1 card p-3 flex justify-between items-center">
          <span className="text-gray-700 font-medium">{item.title}</span>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(item)} className="button px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600">
              Edit
            </button>
            <button onClick={() => handleDelete(item.id)} className="button px-3 py-1 text-sm bg-red-500 hover:bg-red-600">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  )
}
