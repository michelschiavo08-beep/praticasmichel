// ==========================================
// StudyFlow — Notes Page
// ==========================================

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Search, Trash2, Bold, Italic, List, Heading2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useData } from '../contexts/DataContext';
import { useToast } from '../components/ui/Toast';
import { relativeTime } from '../utils';
import './Notes.css';

// Subject icon map
const subjectEmojiMap: Record<string, string> = {
  Calculator: '🔢', BookOpen: '📖', Code: '💻', Globe: '🌍', Landmark: '🏛️',
  Beaker: '🧪', Music: '🎵', Palette: '🎨', Microscope: '🔬', Scale: '⚖️',
  Brain: '🧠', Lightbulb: '💡', GraduationCap: '🎓', PenTool: '✏️', Atom: '⚛️',
};

export default function Notes() {
  const { notes, subjects, addNote, updateNote, deleteNote } = useData();
  const { showToast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Comece a escrever sua nota...' }),
    ],
    content: '',
    onUpdate: ({ editor: ed }) => {
      if (selectedNote) {
        updateNote(selectedNote, { content: ed.getHTML(), title: noteTitle });
      }
    },
  });

  // Filter notes by subject and search
  const filteredNotes = useMemo(() => {
    let list = [...notes];
    if (selectedSubject) list = list.filter(n => n.subjectId === selectedSubject);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, selectedSubject, searchQuery]);

  // Count notes per subject
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(n => { counts[n.subjectId] = (counts[n.subjectId] || 0) + 1; });
    return counts;
  }, [notes]);

  // Load note into editor
  const loadNote = useCallback((noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && editor) {
      setSelectedNote(noteId);
      setNoteTitle(note.title);
      editor.commands.setContent(note.content);
    }
  }, [notes, editor]);

  // Save title on blur
  useEffect(() => {
    if (selectedNote && noteTitle) {
      const timeout = setTimeout(() => {
        updateNote(selectedNote, { title: noteTitle });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [noteTitle, selectedNote, updateNote]);

  const createNewNote = () => {
    if (!selectedSubject) {
      showToast('Selecione uma matéria primeiro', 'info');
      return;
    }
    addNote({
      title: 'Nova Nota',
      content: '',
      subjectId: selectedSubject,
    });
    showToast('Nota criada!');
    // Select the new note (it'll be the latest)
    setTimeout(() => {
      const latest = notes[notes.length - 1];
      if (latest) loadNote(latest.id);
    }, 100);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNote === id) {
      setSelectedNote(null);
      setNoteTitle('');
      editor?.commands.setContent('');
    }
    showToast('Nota excluída', 'info');
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div>
      <div className="sf-page-header">
        <div>
          <h1 className="sf-page-title">📝 Anotações</h1>
          <p className="sf-page-subtitle">Organize seus resumos e anotações por matéria</p>
        </div>
        <button className="sf-btn sf-btn--primary" onClick={createNewNote}>
          <Plus size={18} /> Nova Nota
        </button>
      </div>

      {/* Subject Cards */}
      <div className="notes-subjects">
        {subjects.map((sub, i) => (
          <div
            key={sub.id}
            className={`notes-subject-card ${selectedSubject === sub.id ? 'notes-subject-card--active' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${sub.color}, ${sub.color}aa)`,
              animationDelay: `${i * 60}ms`,
            }}
            onClick={() => setSelectedSubject(selectedSubject === sub.id ? null : sub.id)}
          >
            <div className="notes-subject-icon">
              {subjectEmojiMap[sub.icon] || '📚'}
            </div>
            <div className="notes-subject-name">{sub.name}</div>
            <div className="notes-subject-count">{noteCounts[sub.id] || 0} notas</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="notes-search">
        <Search size={16} style={{ color: 'var(--text-tertiary)' }} />
        <input
          placeholder="Buscar nas anotações..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Notes Content */}
      <div className="notes-content">
        {/* Notes List */}
        <div className="notes-list">
          <div className="notes-list-header">
            <span className="notes-list-title">
              {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Todas'} ({filteredNotes.length})
            </span>
          </div>
          <div className="notes-list-items">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-list-item ${selectedNote === note.id ? 'note-list-item--active' : ''}`}
                onClick={() => loadNote(note.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="note-list-item-title">{note.title}</div>
                  <button
                    className="sf-btn sf-btn--ghost sf-btn--icon"
                    style={{ width: 24, height: 24, padding: 2, opacity: 0.5 }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="note-list-item-preview">{stripHtml(note.content).slice(0, 60)}</div>
                <div className="note-list-item-date">{relativeTime(note.updatedAt.split('T')[0])}</div>
              </div>
            ))}
            {filteredNotes.length === 0 && (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                Nenhuma nota encontrada
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="notes-editor">
          {selectedNote ? (
            <>
              <div className="notes-editor-header">
                <input
                  className="notes-editor-title-input"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Título da nota..."
                />
              </div>
              <div className="notes-editor-toolbar">
                <button
                  className={editor?.isActive('bold') ? 'active' : ''}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  title="Negrito"
                >
                  <Bold size={16} />
                </button>
                <button
                  className={editor?.isActive('italic') ? 'active' : ''}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  title="Itálico"
                >
                  <Italic size={16} />
                </button>
                <button
                  className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  title="Título"
                >
                  <Heading2 size={16} />
                </button>
                <button
                  className={editor?.isActive('bulletList') ? 'active' : ''}
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  title="Lista"
                >
                  <List size={16} />
                </button>
              </div>
              <EditorContent editor={editor} />
            </>
          ) : (
            <div className="sf-empty" style={{ minHeight: 400 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                <path d="M14 2v6h6" />
              </svg>
              <div className="sf-empty-title">Selecione uma nota para editar</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                Escolha uma nota na lista ao lado ou crie uma nova
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
