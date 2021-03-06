const fs = require('fs')
const iconv = require('iconv-lite')
exports.readWinnerStorage = function(key) {
    let storage = localStorage.getItem('key_' + key)
    return !storage ? [] : JSON.parse(storage)
}
exports.writeWinnerStorage = function(key, data) {
    localStorage.setItem('key_' + key, JSON.stringify(data))
}
exports.writeWinnerFile = function(filePath, data) {
    //let addData = data.slice(odata.length)
    // fs.writeFile(filePath, '', {
    //     flag: 'w',
    //     encoding: 'utf8'
    // }, function(err) {
    //     if (err) {
    //         console.log('清空失败')
    //     } else {
    //         console.log('清空成功')
    //     }
    // })
    let csv = data.reduce((r, e, i)=>{
        r.push((i+1)+','+(e.turn+1)+','+(e.idx+1)+','+e.award+','+e.winner+','+e.time)
        return r
    }, ['序号,轮次,顺序,奖品,中奖号码,抽奖时间']).join('\r')
    csv = iconv.encode(csv,'gbk')
    // fs.writeFile(filePath, JSON.stringify(data).replace(/\}\,\{/g, '},\r{'), {
    fs.writeFile(filePath, csv, {
        flag: 'w'
    }, function(err) {
        if (err) {
            console.log('保存失败')
        } else {
            console.log('保存成功')
        }
    })
    // fs.exists(filePath, function(isExist) {
    //     if (!isExist) {
    //         fs.writeFile(filePath, JSON.stringify(data), {
    //             flag: 'a',
    //             encoding: 'utf8'
    //         }, function(err) {
    //             if (err) {
    //                 alert(err)
    //             } else {
    //                 console.log('中奖名单创建成功')
    //             }
    //         })
    //     } else {
    //         fs.writeFile(filePath, '\r\n使用fs.appendFile追加文件内容', function() {
    //             console.log('追加内容完成');
    //         })
    //     }
    // })
}
exports.analyzeRecord = function(config, record) {
    return config.map((turn, i) => {
        turn.list = turn.list.map((idx, j) => {
            let rec = record.filter((e) => {
                if (e.turn == i && e.idx == j) {
                    return true
                } else {
                    return false
                }
            })

            if (rec.length > 0) {
                idx.winner = rec.map((e) => {
                    return e.winner
                })

            }
            return idx
        })
        return turn
    })
}
exports.sumWinners = function(record) {
    return record.map((e) => {
        return e.winner
    })
}
exports.getNextTurn = function(config) {
    let turn,
        idx,
        status
    config.every((e, i) => {
        turn = i
        e.list.every((d, j) => {
            if (!d.winner || d.number > d.winner.length) {
                idx = j
                status = (d.winner && d.winner.length >= 0) ? 'open' : 'close'
                return false
            }
            return true
        })
        if (idx !== undefined) return false
        return true
    })
    return {
        turn,
        idx,
        status
    }
}
exports.getCurrentTurn = function(config) {
    let turn,
        idx,
        status
    config.every((e, i) => {
        turn = i
        e.list.every((d, j) => {
            if (!d.winner || d.number > d.winner.length) {
                idx = j
                status = (d.winner && d.winner.length >= 0) ? 'open' : 'close'
                return false
            }
            return true
        })
        if (idx !== undefined) return false
        return true
    })
    return {
        turn,
        idx,
        status
    }
}
exports.getWinnerList = function(turn, idx, winnerRecord) {
    let list, time
    if (turn == undefined || idx == undefined) return []
    list = winnerRecord.filter((e) => {
        return e.turn == turn && e.idx == idx
    })
    if (list.length > 10) {
        time = list[list.length - 1].time
        return list.filter((e) => {
            return e.time == time
        })
    } else {
        return list
    }
}
exports.getRandomWinner = function(number, blackList) {
    let num
    while (num === undefined) {
        num = parseInt(Math.random() * number) + 1
        if (blackList.indexOf(num) > -1) num = undefined
    }
    return num
}
