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
    <main className="p-12 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Next.js + Supabase CRUD</h1>

      <div className="flex gap-3 mb-6 justify-center">
        <input
          className="input "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter item"
        />
        <button
          className="button"
          onClick={handleSave}
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>


      <ul className="space-y-4   flex-col items-center">
        {items.map((item) => (
          <li
            key={item.id}
            className="card  flex justify-between items-center p-4 bg-gray-50 shadow-md hover:shadow-lg transition-shadow w-64"
          >
            <span className="text-gray-700 font-medium">{item.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="button px-4 py-1 text-sm bg-blue-500 hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="button px-4 py-1 text-sm bg-red-500 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>


    </main>
  )
}
