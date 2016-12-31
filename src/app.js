const {
    ipcRenderer,
    remote
} = require('electron')
    // const storage = require('electron-storage')
const path = require('path')
const fs = require('fs')
const Vue = require('./common/vue.js')
const WinnerFilePath = path.resolve(__dirname + '/../winner.txt')
const win = remote.getCurrentWindow()
const {
    readWinnerStorage,
    writeWinnerFile,
    analyzeRecord,
    sumWinners,
    getPlayer,
    getTurn
} = require('./data.js')
Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

window.page = new Vue({
    el: '#app',
    data: {
        isFullScreen: false,
        info: require('../config.json'),
        config: null,
        winnerRecord: null,
        // players: [],
        winners: [],
        current: null
    },
    created() {
        this.winnerRecord = readWinnerStorage() || []
        this.winners = sumWinners(this.winnerRecord)
        this.config = analyzeRecord(this.info.config, this.winnerRecord)
            // this.players = getPlayer(this.config.player, this.winners)
        this.current = getTurn(this.config)
    },
    methods: {
        close() {
            win.close()
        },
        full() {
            if (win.isFullScreen()) {
                win.setFullScreen(false)
                this.stretchScreen(false)
            } else {
                win.setFullScreen(true)
                this.stretchScreen(true)
            }
        },
        stretchScreen(flag) {
            let el = this.$refs.lottery

            if (flag) {
                document.body.style.overflowX = 'hidden'
                el.style.transform = 'scale(' + (window.screen.width / el.clientWidth) + ',' + (window.screen.height / el.clientHeight) + ')'
                el.style.transformOrigin = 'left top'
            } else {
                document.body.style.overflowX = 'auto'
                el.style.transform = 'scale(1)'
                el.style.transformOrigin = 'inital'
            }
        },
        start() {

        },
        end() {

        }
    }
})
