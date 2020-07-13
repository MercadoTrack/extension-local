import Utils from '../scripts/modules/utils/utils';
import Vue from 'vue';
import 'materialize-css';
import './popup.sass';
import axios from 'axios'

// "chrome-extension://dalhiaalbimlfakgphiamkjgaicfblen/popup.html"

Vue.filter('title', Utils.trimTitle)
Vue.filter('price', Utils.formatMoney)

const AUTH_KEY = 'authResult'

new Vue({
    el: '#app',
    data: () => ({
        auth: JSON.parse(localStorage.getItem(AUTH_KEY)),
        loading: false,
        articles: [],
        unfoldedArticle: null
    }),
    methods: {
        login() {
            this.loading = true // quizas authenticating en vez de loading?
            chrome.runtime.sendMessage({
                type: 'authenticate'
            });
            const checkAuthInterval = setInterval(() => {
                const auth = JSON.parse(localStorage.getItem(AUTH_KEY))
                if (auth) {
                    this.auth = auth
                    clearInterval(checkAuthInterval)
                    this.getArticles()
                }
            }, 500)
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
            this.loading = true
            this.getArticles()
                .then(() => {
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                    this.loading = false
                })
        }
    }
})
