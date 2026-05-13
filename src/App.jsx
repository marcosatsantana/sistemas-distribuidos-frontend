import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import logo from './assets/Logo-Unigoias-vetorizada.svg';

const API_URL = 'https://sistemas-distribuidos-backend.onrender.com/api';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', author: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/items/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/items`, formData);
      }
      setFormData({ title: '', description: '', author: '' });
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Check console.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      author: item.author || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="UniGoiás Logo" className="logo" />
          <h1>Portal Acadêmico</h1>
        </div>
      </header>

      <main>
        <section className="form-card">
          <h2>{editingId ? 'Editar Registro' : 'Novo Registro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título do Projeto/Artigo</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ex: Sistema de Gestão Distribuído"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Autor(es)</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Nome do aluno ou pesquisador"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Resumo do projeto..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
              {editingId ? 'Atualizar Registro' : 'Adicionar Registro'}
            </button>
          </form>
        </section>

        <section className="items-section">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={24} style={{ color: 'var(--primary-light)' }} />
            Acervo de Projetos
          </h2>

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={32} />
              <p>Carregando registros...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum projeto registrado ainda.</p>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-content">
                    <h3>{item.title || 'Sem título'}</h3>
                    <p>{item.description || 'Sem descrição'}</p>
                    <div className="item-meta">
                      <span>Autor: {item.author || 'N/A'}</span> •
                      <span> Adicionado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-edit"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
