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

let list = require('../config.json')

let page = new Vue({
    el: '#app',
    data: {
        isFullScreen: false
    },
    created: function() {
        this.createWinner(WinnerFilePath)
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
        createWinner() {
            let filePath = WinnerFilePath
            fs.exists(filePath, function(isExist) {
                    if (!isExist) {
                        fs.writeFile(filePath, '', {
                            flag: 'a',
                            encoding: 'utf8'
                        }, function(err) {
                            if (err) {
                                alert(err)
                            } else {
                                console.log('中奖名单创建成功')
                            }
                        })
                    }
                })
        },
        saveWinner() {
            let filePath = WinnerFilePath
            fs.appendFile(filePath, '\r\n使用fs.appendFile追加文件内容', function() {
                console.log('追加内容完成');
            })
        }
    }
})
