const Vue = require('./common/vue.js')

let page = new Vue({
    el:'#app',
    created:function(){
        console.log();
    },
    methods:{
        close:function(){
            window.close()
        },
        full:function(){

        }
    }
})
