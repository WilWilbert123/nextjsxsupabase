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
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Next.js + Supabase CRUD</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter item"
        />
        <button
          onClick={handleSave}
          className="bg-black text-white px-4"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-3 flex justify-between"
          >
            {item.title}
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
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
