const {
    ipcRenderer
} = require('electron')

const {
    writeConfigStorage
} = require('./data.js')
module.exports = {
    data() {
        return {
            turn: 0,
            list: null,
            selected: [],
            selectedAll: false
        }
    },
    template: '#configTpl',
    props: ['info'],
    // computed:{
    //     selected(){
    //         return this.list[this.turn].list.map(()=>{
    //             return false
    //         })
    //     }
    // },
    created() {
        this.list = this.info.map((e) => {
            e.list = e.list.sort((a, b) => {
                return a.idx - b.idx
            })
            return e
        })
        this.$watch('info', function(value) {
            writeConfigStorage(value)
        }, {
            deep: true
        })

        this.selected = this.list[this.turn].list.map(() => {
            return false
        })

    },
    methods: {
        add() {
            this.info[this.turn].list.push({
                "idx": this.info[this.turn].list.length + 1,
                "name": "奖品名称",
                "type": "奖 品",
                "level": 1,
                "number": 1,
                "unit": "个"
            })
            this.selected.push(false)
        },
        change(item) {
            if (item.type == "奖 品") {
                item.level = 1
            } else {
                item.level = 2
            }
        },
        select(ev){
            if(ev.target.checked==false){
                this.selectedAll = false
            }
        },
        del() {
            this.info[this.turn].list = this.info[this.turn].list.filter((e, i)=>{
                return !this.selected[i]
            })
            this.selected = this.selected.filter((e)=>{
                return !e
            })
        },
        selectAll(ev) {
            this.selected = this.selected.map(() => {
                return ev.target.checked
            })
        }

    }
}
