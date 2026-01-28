'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'

type Item = {
  id: string
  title: string
}

export default function ItemForm() {
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    if (!title.trim()) return
    setLoading(true)

    if (editId) {
      await supabase.from('items').update({ title }).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from('items').insert({ title })
    }

    setTitle('')
    setLoading(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('items').delete().eq('id', id)
    fetchItems()
  }

  const handleEdit = (item: Item) => {
    setTitle(item.title)
    setEditId(item.id)
  }

  return (
    <div className="card w-96 h-[520px] flex flex-col p-6">
      <h1 className="text-xl font-bold text-center mb-4">
        NEXT JS & SUPABASE
      </h1>

      {/* FORM */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1 color-white"
          placeholder="Enter item..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="button"
          onClick={handleSave}
          disabled={loading}
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      {/* LIST */}
      <ul className="flex-1 overflow-y-auto pr-1   ">
        {items.map((item) => (
          <li
            key={item.id}
            className="card p-3 flex justify-between items-center  "
          >
            <span className="font-medium truncate w-full">
              {item.title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="button"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
