import FetchPictures from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formJS: document.querySelector('#search-form'),
  inputJS: document.querySelector('input'),
  galeryJS: document.querySelector('.gallery'),
  loadMoreJS: document.querySelector('.load-more'),
};
const fetchPictures = new FetchPictures();
const simpleLightbox = new SimpleLightbox('.gallery a');

refs.formJS.addEventListener('submit', handleSubmit);
refs.loadMoreJS.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  hideBtn();
  fetchPictures.resetPage();
  fetchPictures.keyWord = event.target.searchQuery.value;
  try {
    const searchResult = await fetchPictures.search();
    clearUI();
    if (searchResult.data.hits.length == 0) {
      notifyErr();
    } else {
      updateUI(searchResult.data.hits);
      notifyInfo(searchResult.data.totalHits);
      showBtn();
    }
  } catch (e) {
    console.log(e);
  }
}

async function handleLoadMore() {
  fetchPictures.increesePage();
  try {
    const searchResult = await fetchPictures.search();
    if (fetchPictures.resultsShown >= searchResult.data.totalHits) {
      notifyEnd();
      hideBtn();
    }
    updateUI(searchResult.data.hits);
  } catch (e) {
    console.log(e);
  }
}

function updateUI(arr) {
  refs.galeryJS.insertAdjacentHTML('beforeend', createMarckup(arr));
  simpleLightbox.refresh();
}

function createMarckup(arr) {
  const markup = arr
    .map(img => {
      return `
    <div class="photo-card">
  <a href="${img.largeImageURL}"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b><span>${img.likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b><span>${img.views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b><span>${img.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b><span>${img.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  return markup;
}
function clearUI() {
  refs.galeryJS.innerHTML = '';
}
function showBtn() {
  refs.loadMoreJS.classList.remove('hidden');
}
function hideBtn() {
  refs.loadMoreJS.classList.add('hidden');
}
function notifyInfo(totalHits) {
  Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);
}
function notifyErr() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function notifyEnd() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
