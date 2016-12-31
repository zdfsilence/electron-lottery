exports.readWinnerStorage = function(key) {
    let storage = localStorage.getItem('key_' + key)

    return !storage ? [] : JSON.parse(storage)
}
exports.writeWinnerFile = function(filePath, data) {

    fs.exists(filePath, function(isExist) {
        if (!isExist) {
            fs.writeFile(filePath, JSON.stringify(data), {
                flag: 'a',
                encoding: 'utf8'
            }, function(err) {
                if (err) {
                    alert(err)
                } else {
                    console.log('中奖名单创建成功')
                }
            })
        } else {
            fs.appendFile(filePath, '\r\n使用fs.appendFile追加文件内容', function() {
                console.log('追加内容完成');
            })
        }
    })
}
exports.analyzeRecord = function(config, record) {
    return config.map((turn, i) => {
        turn.list = turn.list.map((idx, j) => {
            let rec = record.filter((e) => {
                if (e.turn == turn.name && e.idx == j) {
                    return true
                } else {
                    return false
                }
            })

            if (rec.length > 0) {
                idx.winner = rec.reduce((r, e) => {
                    return Array.prototype.concat.apply(r, e.winner)
                }, [])
            } else {
                idx.winner = []
            }
            return idx
        })
        return turn
    })
}
exports.sumWinners = function(record) {
    return record.reduce((r, e) => {
        return Array.prototype.concat.apply(r, e.winner)
    }, [])
}
exports.getTurn = function(config) {
    let turn,
        idx
    config.every((e, i)=>{
        turn = i
        e.list.every((d, j)=>{
            if(d.number > d.winner.length){
                idx = j
                return false
            }
            return true
        })
        if(idx !== undefined) return false
        return true
    })
    return {
        turn,
        idx
    }
}
// exports.getPlayer = function(players, winners) {
//     for (let i = 1, tmp; i <= players; i++) {
//         if(winners)
//     }
// }
