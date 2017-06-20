/* todo: this file must be modularized */
/* eslint-disable */
import Storage from '../scripts/modules/storage'
import Utils from '../scripts/modules/utils/utils'
import Vue from 'vue'
import '../../node_modules/materialize-css/dist/js/materialize.min'
import './popup.sass'

/* todo: add missing functionality and modularize */

(() => {

    new Vue({
        el: '#app',
        data: {
            size: 0, 
            items: []
        },
        methods: {
            refresh() {
                Promise.all([
                    Storage.getSize().then(size => this.size = size), 
                    Storage.get().then(items => this.items = items)
                ]);
            },
            clear() { Storage.clear().then(this.refresh) }
        },
        created() { this.refresh() }
    })

})()
