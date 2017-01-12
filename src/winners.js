const {
    ipcRenderer
} = require('electron')

const {
    writeWinnerFile
} = require('./data.js')
module.exports = {
    template:'#winnersTpl',
    props:['list'],
    created(){
        ipcRenderer.on('exportWinners', (ev, res) => {
            console.dir(res);
            writeWinnerFile(res, this.list)
        })
    },
    methods:{
        exportWinners(){
            ipcRenderer.send('exportWinners')
        }
    }




}
