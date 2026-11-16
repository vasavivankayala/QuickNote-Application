import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen, Check, Clock3, FileText, Lightbulb, LoaderCircle,
  Pencil, Plus, Search, Sparkles, Trash2, X,
} from 'lucide-react'
import { notesApi } from './api'

const formatDate = (value) => new Date(value).toLocaleString([], {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit',
})

export default function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadNotes() {
    try {
      setError('')
      const data = await notesApi.getAll()
      setNotes(data)
    } catch (err) {
      setError(`${err.message} Make sure the Python backend is running.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNotes() }, [])

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return notes
    return notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  }, [notes, search])

  function resetForm() {
    setTitle('')
    setContent('')
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Please enter both a title and note content.')
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (editingId) {
        await notesApi.update(editingId, { title, content })
        setNotice('Your note has been updated.')
      } else {
        await notesApi.create({ title, content })
        setNotice('Your note has been saved.')
      }
      resetForm()
      await loadNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(note) {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this note permanently?')) return
    try {
      await notesApi.delete(id)
      setNotes(current => current.filter(note => note.id !== id))
      if (editingId === id) resetForm()
      setNotice('Note deleted.')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="QuickNote home">
          <span className="brand-mark"><BookOpen size={21} /></span>
          <span>quick<span className="brand-accent">note</span></span>
        </a>
        <div className="topbar-right"><span className="status-dot" /> Your personal space</div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14} /> A LITTLE SPACE FOR BIG IDEAS</div>
          <h1>Your thoughts,<br /><span>beautifully organized.</span></h1>
          <p>Capture a thought before it slips away. Everything important, all in one place.</p>
          <div className="hero-stats">
            <div><strong>{notes.length}</strong><span>{notes.length === 1 ? 'NOTE SAVED' : 'NOTES SAVED'}</span></div>
            <div className="stat-divider" />
            <div><strong>Always</strong><span>HERE WHEN YOU NEED IT</span></div>
          </div>
        </section>

        <section className="composer-card">
          <div className="section-heading">
            <div className="heading-icon"><Pencil size={18} /></div>
            <div>
              <h2>{editingId ? 'Edit your note' : 'Create a note'}</h2>
              <p>{editingId ? 'Make your changes below.' : 'A thought, a task, a little reminder — write it down.'}</p>
            </div>
            {editingId && <button className="cancel-edit" onClick={resetForm}><X size={15} /> Cancel</button>}
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="note-title">TITLE</label>
            <input
              id="note-title" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Give your note a title..." maxLength={100}
            />
            <label htmlFor="note-content">YOUR NOTE</label>
            <textarea
              id="note-content" value={content} onChange={e => setContent(e.target.value)}
              placeholder="Start writing here... what's on your mind?" rows={5}
            />
            <div className="form-footer">
              <span className="privacy-hint"><Lightbulb size={15} /> Saved securely in your local database</span>
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? <LoaderCircle className="spin" size={17} /> : editingId ? <Check size={17} /> : <Plus size={18} />}
                {saving ? 'Saving...' : editingId ? 'Update note' : 'Save note'}
              </button>
            </div>
          </form>
          {error && <div className="alert error-alert">{error}</div>}
          {notice && <div className="alert success-alert"><Check size={15} /> {notice}</div>}
        </section>

        <section className="notes-section">
          <div className="notes-heading">
            <div>
              <div className="eyebrow muted-eyebrow"><FileText size={14} /> YOUR COLLECTION</div>
              <h2>All your notes <span className="count-pill">{notes.length}</span></h2>
            </div>
            <div className="search-box">
              <Search size={17} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." aria-label="Search notes" />
              {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><LoaderCircle className="spin" size={25} /><p>Loading your notes...</p></div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FileText size={25} /></div>
              <h3>{search ? 'No matching notes' : 'Your page is a blank canvas'}</h3>
              <p>{search ? 'Try another keyword.' : 'Your first note is just a few words away. Add one above!'}</p>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note, index) => (
                <article className={`note-card tone-${index % 4}`} key={note.id}>
                  <div className="note-card-top">
                    <span className="note-label"><span /> NOTE</span>
                    <div className="note-actions">
                      <button onClick={() => startEdit(note)} aria-label={`Edit ${note.title}`} title="Edit"><Pencil size={15} /></button>
                      <button className="delete-action" onClick={() => handleDelete(note.id)} aria-label={`Delete ${note.title}`} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <h3>{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <div className="note-date"><Clock3 size={13} /> Updated {formatDate(note.updated_at)}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer><span className="footer-brand">quicknote</span> · Made for the thoughts worth keeping.</footer>
    </div>
  )
}
