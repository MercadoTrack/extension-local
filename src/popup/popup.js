import Storage from '../scripts/modules/storage';
import Utils from '../scripts/modules/utils/utils';
import store from './store';
import Vue from 'vue';
import 'materialize-css';
import './popup.sass';

Vue.filter('title', Utils.trimTitle)
Vue.filter('price', Utils.formatMoney)

new Vue({
    el: '#app',
    created() {
        this.refresh()
    },
    computed: {
        size: () => store.state.size,
        items: () => store.state.items
    },
    methods: {
        updateSize() {
            Storage.getSize().then(size => store.dispatch('UPDATE_SIZE', size))
        },
        updateItems() {
            Storage.get()
                .then(items => store.dispatch('UPDATE_ITEMS', items))
                .catch(() => store.dispatch('UPDATE_ITEMS'))
        },
        refresh() {
            this.updateSize()
            this.updateItems()
        },
        clear() {
            Storage.clear().then(this.refresh)
        },
        remove(item) {
            Storage.deleteItem(item).then(this.refresh)
        },
        toggleHistory(item) {
            store.dispatch('TOGGLE_HISTORY', item.id)
        },
        isShowingHistory(item) {
            return store.state.showing.includes(item.id)
        }
    }
})
