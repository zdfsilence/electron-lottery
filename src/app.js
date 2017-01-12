const {
    ipcRenderer,
    remote
} = require('electron')
    // const storage = require('electron-storage')
const path = require('path')
const Vue = require('./common/vue.js')
const animate = require('./animate.js')

// const WinnerFilePath = path.resolve(__dirname + '/../winner.txt')
const win = remote.getCurrentWindow()
const {
    readWinnerStorage,
    writeWinnerFile,
    analyzeRecord,
    sumWinners,
    getPlayer,
    getNextTurn,
    getCurrentTurn,
    getWinnerList,
    getRandomWinner,
    writeWinnerStorage
} = require('./data.js')
Date.prototype.format = function(fmt) {
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
window.onload = function() {
    window.page = new Vue({
        el: '#app',
        data: {
            isFullScreen: false,
            info: require('../config.json'),
            currentAward: null,
            currentRecord: null,
            turn: undefined,
            idx: undefined,
            winnerRecord: [],
            isRolling: false
                // players: [],
                // winners: [],
                // current: null
        },
        computed: {
            winners() {
                return sumWinners(this.winnerRecord)
            },
            config() {
                return analyzeRecord(this.info.config, this.winnerRecord)
            },
            winnerList() {
                return getWinnerList(this.turn, this.idx, this.winnerRecord)
            }
        },
        created() {
            this.winnerRecord = readWinnerStorage(this.info.key)
            this.$watch('winnerRecord', function(val, oldVal) {
                writeWinnerStorage(this.info.key, val)
                writeWinnerFile(path.resolve(__dirname + '/../winner_' + this.info.key + '.csv'), val, oldVal)
            }, {
                deep: true
            })

        },
        mounted() {
            animate.init()
        },
        watch: {
            // winnerRecord: {
            //     handler: function(val, oldVal) {
            //         writeWinnerStorage(this.key, val)
            //     },
            //     deep: true
            // }
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
                    document.body.style.overflow = 'hidden'
                    el.style.transform = 'scale(' + (window.screen.width / el.clientWidth) + ',' + (window.screen.height / el.clientHeight) + ')'
                    el.style.transformOrigin = 'left top'
                } else {
                    document.body.style.overflow = 'auto'
                    el.style.transform = 'scale(1)'
                    el.style.transformOrigin = 'inital'
                }
            },
            open(turn, idx) {
                this.turn = turn
                this.idx = idx
                this.info.config[turn].list[idx].open = 1
                this.currentAward = this.config[turn].list[idx]
            },
            start() {
                if(this.isRolling || !this.currentAward || (this.currentAward.winner && this.currentAward.winner.length >= this.currentAward.number)) return
                this.isRolling = true
                animate.start()
            },
            end() {
                if(!this.isRolling || !this.currentAward || (this.currentAward.winner && this.currentAward.winner.length >= this.currentAward.number)) return
                animate.replaceBall()
                this.isRolling = false
                let total = this.currentAward.number - (this.currentAward.winner ? this.currentAward.winner.length : 0),
                    num = total > 10 ? 10 : total,
                    time = new Date().format('yyyy-MM-dd hh:mm:ss')
                for (var i = 0; i < num; i++) {
                    this.winnerRecord.push({
                        turn: this.turn,
                        idx: this.idx,
                        award: this.currentAward.name,
                        time: time,
                        winner: getRandomWinner(this.info.player, this.winners)
                    })
                }
            }
        },
        filters: {
            preFix: function(value) {
                return (Array(4).join('0') + value).slice(-4)
            }
        }
    })



}
