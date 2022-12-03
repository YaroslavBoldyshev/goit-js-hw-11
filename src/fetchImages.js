import axios from 'axios';
export default class FetchPictures {
  page = 1;
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '22812338-89cc7af62214fe881f61e5605';
  FILTERS = 'image_type=photo&orientation=horizontal&safesearch=true';
  keyWord = '';
  resultsShown = 40;
  search() {
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${this.keyWord}&${this.FILTERS}&page=${this.page}&per_page=40`;
    return axios.get(url);
  }
  increesePage() {
    this.page += 1;
    this.resultsShown += 40;
  }
  resetPage() {
    this.page = 1;
    this.resultsShown = 40;
  }
}
