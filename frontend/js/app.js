/**
 * CineCatálogo - Frontend Application Script
 * JS Vanilla com Fetch API, manipulação de DOM e modais
 */

// Configuração da URL base da API
const API_BASE = window.location.protocol === 'file:' 
  ? 'http://localhost:3000/api/movies' 
  : '/api/movies';

// Estado local da aplicação
let allMovies = [];
let movieToDeleteId = null;

// Elementos da DOM
const moviesGrid = document.getElementById('moviesGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const emptyMessage = document.getElementById('emptyMessage');
const statsCounter = document.getElementById('statsCounter');

const searchInput = document.getElementById('searchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const genreFilter = document.getElementById('genreFilter');
const sortFilter = document.getElementById('sortFilter');

const movieModal = document.getElementById('movieModal');
const movieForm = document.getElementById('movieForm');
const modalTitle = document.getElementById('modalTitle');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const btnSaveMovie = document.getElementById('btnSaveMovie');
const btnSaveText = document.getElementById('btnSaveText');
const saveSpinner = document.getElementById('saveSpinner');
const btnEmptyAdd = document.getElementById('btnEmptyAdd');

const deleteModal = document.getElementById('deleteModal');
const deleteMovieTitle = document.getElementById('deleteMovieTitle');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const btnCancelDelete = document.getElementById('btnCancelDelete');

// Campos do Formulário
const inputId = document.getElementById('movieId');
const inputTitle = document.getElementById('movieTitle');
const inputDirector = document.getElementById('movieDirector');
const inputYear = document.getElementById('movieYear');
const inputGenre = document.getElementById('movieGenre');
const inputCoverUrl = document.getElementById('movieCoverUrl');
const btnPreviewCover = document.getElementById('btnPreviewCover');
const coverPreviewContainer = document.getElementById('coverPreviewContainer');
const coverPreviewImg = document.getElementById('coverPreviewImg');

// Erros de campos
const errorTitle = document.getElementById('errorTitle');
const errorDirector = document.getElementById('errorDirector');
const errorYear = document.getElementById('errorYear');
const errorGenre = document.getElementById('errorGenre');
const errorCoverUrl = document.getElementById('errorCoverUrl');

// ==========================================================
// Inicialização
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupEventListeners();
});

function setupEventListeners() {
  // Abertura e fechamento de modal
  btnOpenModal.addEventListener('click', () => openMovieModal('create'));
  btnEmptyAdd.addEventListener('click', () => openMovieModal('create'));
  btnCloseModal.addEventListener('click', closeMovieModal);
  btnCancelModal.addEventListener('click', closeMovieModal);

  // Submissão do formulário
  movieForm.addEventListener('submit', handleFormSubmit);

  // Filtros e busca
  searchInput.addEventListener('input', handleSearchInput);
  btnClearSearch.addEventListener('click', handleClearSearch);
  genreFilter.addEventListener('change', renderMoviesList);
  sortFilter.addEventListener('change', renderMoviesList);

  // Preview de capa
  btnPreviewCover.addEventListener('click', updateCoverPreview);
  inputCoverUrl.addEventListener('blur', updateCoverPreview);

  // Exclusão
  btnConfirmDelete.addEventListener('click', confirmDeleteMovie);
  btnCancelDelete.addEventListener('click', closeDeleteModal);

  // Fechar modais ao clicar no fundo ou teclar ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMovieModal();
      closeDeleteModal();
    }
  });

  movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) closeMovieModal();
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });
}

// ==========================================================
// Comunicação com API (Fetch API)
// ==========================================================

/**
 * Busca a lista completa de filmes no backend
 */
async function fetchMovies() {
  showLoading(true);
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`Erro na API (${response.status}): ${response.statusText}`);
    }

    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      allMovies = result.data;
      populateGenreFilter();
      renderMoviesList();
    } else {
      throw new Error(result.error || 'Formato de resposta inválido.');
    }
  } catch (error) {
    console.error('Falha ao carregar filmes:', error);
    showToast(`Erro ao carregar catálogo: ${error.message}`, 'error');
    moviesGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyMessage.textContent = 'Não foi possível carregar os filmes. Verifique se o backend está em execução.';
  } finally {
    showLoading(false);
  }
}

/**
 * Cadastra ou atualiza um filme
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const isEditing = Boolean(inputId.value);
  const moviePayload = {
    title: inputTitle.value.trim(),
    director: inputDirector.value.trim(),
    year: Number(inputYear.value),
    genre: inputGenre.value.trim(),
    coverUrl: inputCoverUrl.value.trim()
  };

  const endpoint = isEditing ? `${API_BASE}/${inputId.value}` : API_BASE;
  const method = isEditing ? 'PUT' : 'POST';

  setSubmittingState(true);

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moviePayload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao processar requisição.');
    }

    showToast(
      isEditing ? 'Filme atualizado com sucesso!' : 'Filme cadastrado com sucesso!', 
      'success'
    );

    closeMovieModal();
    await fetchMovies();
  } catch (error) {
    console.error('Erro ao salvar filme:', error);
    showToast(`Falha ao salvar: ${error.message}`, 'error');
  } finally {
    setSubmittingState(false);
  }
}

/**
 * Inicia o fluxo de exclusão de um filme
 */
function promptDeleteMovie(id, title) {
  movieToDeleteId = id;
  deleteMovieTitle.textContent = `"${title}"`;
  deleteModal.classList.remove('hidden');
}

/**
 * Envia requisição DELETE para a API
 */
async function confirmDeleteMovie() {
  if (!movieToDeleteId) return;

  btnConfirmDelete.disabled = true;
  btnConfirmDelete.textContent = 'Excluindo...';

  try {
    const response = await fetch(`${API_BASE}/${movieToDeleteId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Erro ao excluir filme.');
    }

    showToast('Filme excluído do catálogo!', 'info');
    closeDeleteModal();
    await fetchMovies();
  } catch (error) {
    console.error('Erro ao excluir:', error);
    showToast(`Erro ao excluir: ${error.message}`, 'error');
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = 'Sim, Excluir';
  }
}

// ==========================================================
// Renderização da Interface
// ==========================================================

/**
 * Aplica os filtros locais e renderiza os cards
 */
function renderMoviesList() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;
  const sortBy = sortFilter.value;

  // Filtragem
  let filtered = allMovies.filter(movie => {
    const matchesSearch = 
      !searchTerm ||
      (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
      (movie.director && movie.director.toLowerCase().includes(searchTerm)) ||
      (movie.genre && movie.genre.toLowerCase().includes(searchTerm));

    const matchesGenre = 
      selectedGenre === 'todos' || 
      (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

    return matchesSearch && matchesGenre;
  });

  // Ordenação
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'year-desc':
        return b.year - a.year;
      case 'year-asc':
        return a.year - b.year;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default: // recent
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Atualizar contador
  statsCounter.textContent = `${filtered.length} de ${allMovies.length} filme(s)`;

  // Controle de estados
  if (filtered.length === 0) {
    moviesGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyMessage.textContent = allMovies.length === 0 
      ? 'O catálogo está vazio no momento. Cadastre seu primeiro filme!' 
      : 'Nenhum filme corresponde aos filtros selecionados.';
    return;
  }

  emptyState.classList.add('hidden');
  moviesGrid.classList.remove('hidden');
  moviesGrid.innerHTML = '';

  // Criar cards
  filtered.forEach(movie => {
    const card = createMovieCardElement(movie);
    moviesGrid.appendChild(card);
  });
}

/**
 * Cria o elemento HTML de um Card de Filme
 */
function createMovieCardElement(movie) {
  const card = document.createElement('article');
  card.className = 'movie-card';

  const movieId = movie.id || movie._id;

  // Montagem do card com proteção contra XSS
  card.innerHTML = `
    <div class="card-poster">
      <img 
        src="${escapeHtml(movie.coverUrl)}" 
        alt="Capa de ${escapeHtml(movie.title)}" 
        loading="lazy"
      >
      <span class="card-badge-year">${escapeHtml(String(movie.year))}</span>
    </div>
    <div class="card-content">
      <h3 class="card-title">${escapeHtml(movie.title)}</h3>
      <p class="card-director">
        <span>🎬</span> Direção: <strong>${escapeHtml(movie.director)}</strong>
      </p>
      <span class="card-genre">${escapeHtml(movie.genre)}</span>

      <div class="card-footer">
        <button class="btn-card-action btn-edit" title="Editar filme">
          ✏️ Editar
        </button>
        <button class="btn-card-action btn-card-delete" title="Excluir filme">
          🗑️ Excluir
        </button>
      </div>
    </div>
  `;

  // Fallback caso a imagem não carregue
  const imgElement = card.querySelector('img');
  imgElement.addEventListener('error', () => {
    const posterDiv = card.querySelector('.card-poster');
    posterDiv.innerHTML = `
      <div class="poster-fallback">
        <span class="fallback-icon">🎥</span>
        <span>${escapeHtml(movie.title)}</span>
      </div>
      <span class="card-badge-year">${escapeHtml(String(movie.year))}</span>
    `;
  });

  // Ações dos botões do card
  const btnEdit = card.querySelector('.btn-edit');
  btnEdit.addEventListener('click', () => openMovieModal('edit', movie));

  const btnDelete = card.querySelector('.btn-card-delete');
  btnDelete.addEventListener('click', () => promptDeleteMovie(movieId, movie.title));

  return card;
}

/**
 * Popula as opções do filtro de gêneros
 */
function populateGenreFilter() {
  const currentSelected = genreFilter.value;
  const genresSet = new Set();

  allMovies.forEach(m => {
    if (m.genre) {
      // Divide gêneros compostos tipo "Crime / Drama"
      const parts = m.genre.split(/[\/,]/);
      parts.forEach(p => {
        const clean = p.trim();
        if (clean) genresSet.add(clean);
      });
    }
  });

  const sortedGenres = Array.from(genresSet).sort((a, b) => a.localeCompare(b));

  genreFilter.innerHTML = '<option value="todos">Todos os gêneros</option>';
  sortedGenres.forEach(genre => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    if (genre === currentSelected) opt.selected = true;
    genreFilter.appendChild(opt);
  });
}

// ==========================================================
// Gerenciamento dos Modais
// ==========================================================

function openMovieModal(mode = 'create', movieData = null) {
  clearFormErrors();
  movieForm.reset();
  coverPreviewContainer.classList.add('hidden');
  coverPreviewImg.src = '';

  if (mode === 'edit' && movieData) {
    modalTitle.textContent = 'Editar Filme';
    btnSaveText.textContent = 'Atualizar Filme';
    inputId.value = movieData.id || movieData._id;
    inputTitle.value = movieData.title || '';
    inputDirector.value = movieData.director || '';
    inputYear.value = movieData.year || '';
    inputGenre.value = movieData.genre || '';
    inputCoverUrl.value = movieData.coverUrl || '';
    updateCoverPreview();
  } else {
    modalTitle.textContent = 'Cadastrar Novo Filme';
    btnSaveText.textContent = 'Salvar Filme';
    inputId.value = '';
    inputYear.value = new Date().getFullYear();
  }

  movieModal.classList.remove('hidden');
  inputTitle.focus();
}

function closeMovieModal() {
  movieModal.classList.add('hidden');
  clearFormErrors();
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  movieToDeleteId = null;
}

function updateCoverPreview() {
  const url = inputCoverUrl.value.trim();
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    coverPreviewImg.src = url;
    coverPreviewContainer.classList.remove('hidden');

    coverPreviewImg.onerror = () => {
      coverPreviewContainer.classList.add('hidden');
    };
  } else {
    coverPreviewContainer.classList.add('hidden');
  }
}

// ==========================================================
// Validação de Formulário
// ==========================================================

function validateForm() {
  clearFormErrors();
  let isValid = true;

  if (!inputTitle.value.trim()) {
    errorTitle.textContent = 'O título do filme é obrigatório.';
    isValid = false;
  }

  if (!inputDirector.value.trim()) {
    errorDirector.textContent = 'O diretor é obrigatório.';
    isValid = false;
  }

  const yearNum = Number(inputYear.value);
  if (!inputYear.value || isNaN(yearNum) || yearNum < 1888 || yearNum > 2035) {
    errorYear.textContent = 'Informe um ano válido entre 1888 e 2035.';
    isValid = false;
  }

  if (!inputGenre.value.trim()) {
    errorGenre.textContent = 'O gênero é obrigatório.';
    isValid = false;
  }

  const url = inputCoverUrl.value.trim();
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    errorCoverUrl.textContent = 'URL da capa inválida. Deve começar com http:// ou https://';
    isValid = false;
  }

  return isValid;
}

function clearFormErrors() {
  errorTitle.textContent = '';
  errorDirector.textContent = '';
  errorYear.textContent = '';
  errorGenre.textContent = '';
  errorCoverUrl.textContent = '';
}

function setSubmittingState(isSubmitting) {
  btnSaveMovie.disabled = isSubmitting;
  btnCancelModal.disabled = isSubmitting;
  if (isSubmitting) {
    saveSpinner.classList.remove('hidden');
    btnSaveText.textContent = 'Salvando...';
  } else {
    saveSpinner.classList.add('hidden');
    btnSaveText.textContent = inputId.value ? 'Atualizar Filme' : 'Salvar Filme';
  }
}

// ==========================================================
// Busca e Filtros
// ==========================================================

function handleSearchInput() {
  if (searchInput.value.trim()) {
    btnClearSearch.classList.remove('hidden');
  } else {
    btnClearSearch.classList.add('hidden');
  }
  renderMoviesList();
}

function handleClearSearch() {
  searchInput.value = '';
  btnClearSearch.classList.add('hidden');
  renderMoviesList();
  searchInput.focus();
}

// ==========================================================
// Utilitários
// ==========================================================

function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
