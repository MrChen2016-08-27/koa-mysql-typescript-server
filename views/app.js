import Vue from 'vue'
import App from './App.vue'


export function createApp(context) {
    return new Vue({
        data: {
            url: context.url
        },
        render: h => h(App)
    })
}