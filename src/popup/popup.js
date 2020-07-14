import 'materialize-css';
import './popup.sass';
import Vue from 'vue';
import axios from 'axios'
import Utils from '../scripts/modules/utils/utils';
import jwtDecode from 'jwt-decode'

// "chrome-extension://dalhiaalbimlfakgphiamkjgaicfblen/popup.html"

Vue.filter('title', Utils.trimTitle)
Vue.filter('price', Utils.formatMoney)

const AUTH_KEY = 'authResult'

new Vue({
  el: '#app',
  data: () => ({
    auth: JSON.parse(localStorage.getItem(AUTH_KEY)),
    user: null,
    authenticating: false,
    loading: false,
    articles: [],
    unfoldedArticle: null
  }),
  methods: {
    login() {
      this.authenticating = true
      chrome.runtime.sendMessage({
        type: 'authenticate'
      });
      const checkAuthInterval = setInterval(() => {
        const auth = JSON.parse(localStorage.getItem(AUTH_KEY))
        if (auth) {
          this.authenticating = false
          this.auth = auth
          this.loading = true
          this.user = jwtDecode(auth.id_token)
          this.getArticles().finally(() => {
            this.loading = false
          })
          clearInterval(checkAuthInterval)
        }
      }, 1000)
    },
    getArticles() {
      return axios.get('https://api.mercadotrack.com/user/favorites?full=true', { headers: { Authorization: `Bearer ${this.auth.id_token}` } })
      .then(({ data }) => {
        this.articles = data
        console.log(data)
      })
      .catch((err) => {
        console.log(err.message)
        throw err
      })
    },
    getArticleLink(article) {
      return `https://mercadotrack.com/articulo/${article.id}`
    },
    toggleArticle(article) {
      this.unfoldedArticle = this.unfoldedArticle === article.id
      ? null 
      : article.id
    },
    isUnfolded(article) {
      return this.unfoldedArticle === article.id
    }
  },
  created () {
    if (this.auth) {
      this.user = jwtDecode(this.auth.id_token)
      this.loading = true
      this.getArticles().finally(() => {
        this.loading = false
      })
    }
  }
})
