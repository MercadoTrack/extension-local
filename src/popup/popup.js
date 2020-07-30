import Vue from "vue";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Utils from "../scripts/modules/utils/utils";

// "chrome-extension://dalhiaalbimlfakgphiamkjgaicfblen/popup.html"

Vue.filter("title", Utils.trimTitle);
Vue.filter("price", Utils.formatMoney);

const AUTH_KEY = "authResult";

new Vue({
  el: "#app",
  data: () => ({
    auth: JSON.parse(localStorage.getItem(AUTH_KEY)),
    user: null,
    authenticating: false,
    loading: false,
    articles: [],
    getArticlesError: null,
    unfoldedArticle: null,
    hasOldData: false,
  }),
  methods: {
    login() {
      this.authenticating = true;
      chrome.runtime.sendMessage({
        type: "authenticate",
      });
      const checkAuthInterval = setInterval(() => {
        const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
        if (auth) {
          this.authenticating = false;
          this.auth = auth;
          this.loading = true;
          this.user = jwtDecode(auth.id_token);
          this.getArticles().finally(() => {
            this.loading = false;
          });
          clearInterval(checkAuthInterval);
        }
      }, 1000);
    },
    getArticles() {
      const token = this.auth && this.auth.id_token;
      return axios
        .get("https://api.mercadotrack.com/user/favorites?full=true", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          this.articles = data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            localStorage.removeItem("authResult");
            this.auth = null;
            console.log("Session expired");
          } else {
            this.getArticlesError = err;
          }
        });
    },
    getArticleLink(article) {
      return `https://mercadotrack.com/articulo/${article.id}`;
    },
    toggleArticle(article) {
      this.unfoldedArticle =
        this.unfoldedArticle === article.id ? null : article.id;
    },
    isUnfolded(article) {
      return this.unfoldedArticle === article.id;
    },
    downloadOldData() {
      chrome.storage.local.get(null, (items) => {
        const str = JSON.stringify(items, null, 2);
        chrome.downloads.download({
          url: URL.createObjectURL(
            new Blob([str], { type: "application/json" })
          ),
          filename: "mercadotrack-legacy.json",
        });
      });
    },
    clearOldData() {
      chrome.storage.local.clear(() => {
        chrome.storage.local.get(null, (items) => {
          this.hasOldData = Boolean(items && Object.keys(items).length);
        });
      });
    },
  },
  created() {
    if (this.auth && this.auth.id_token) {
      try {
        this.user = jwtDecode(this.auth.id_token);
      } catch (err) {
        console.log(err);
      }
      this.loading = true;
      this.getArticles().finally(() => {
        this.loading = false;
      });
    }
    chrome.storage.local.get(null, (items) => {
      this.hasOldData = Boolean(items && Object.keys(items).length);
    });
  },
});
