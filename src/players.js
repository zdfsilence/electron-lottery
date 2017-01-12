module.exports = {
    template:'#playersTpl',
    props:['list'],
    methods:{
        importPlayers(){
            this.$emit('import-players')
        }
    }




}
