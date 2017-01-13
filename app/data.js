const fs = require('fs')
const iconv = require('iconv-lite')

exports.readConfigStorage = function() {
    let storage = localStorage.getItem('CONFIG')
    return !storage ? [{name:'',list:[]}] : JSON.parse(storage)
}
exports.writeConfigStorage = function(data) {
    localStorage.setItem('CONFIG', JSON.stringify(data))
}
exports.readWinnerStorage = function() {
    let storage = localStorage.getItem('WINNERS')
    return !storage ? [] : JSON.parse(storage)
}
exports.writeWinnerStorage = function(data) {
    localStorage.setItem('WINNERS', JSON.stringify(data))
}
exports.readPlayersFile = function(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            console.dir(data);
            if (err) {
                if (err.code === "ENOENT") {
                    fs.writeFile(filePath, '', {
                        flag: 'w'
                    }, function(err) {
                        if (err) {
                            console.log('创建players文件失败')
                        } else {
                            console.log('保存players文件成功')
                        }
                    })
                } else {
                    throw err
                }
                reject()
            } else {
                resolve(data.toString())
            }

        })
    })
}
exports.importPlayersFile = function(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject()
            } else {
                resolve(data.toString())
            }
        })
    })
}
exports.writeWinnerFile = function(filePath, data) {
    let csv = data.reduce((r, e, i) => {
        r.push((i + 1) + ',' + (e.turn + 1) + ',' + (e.idx + 1) + ',' + e.award + ',' + e.winner + ',' + e.time)
        return r
    }, ['序号,轮次,顺序,奖品,中奖号码,抽奖时间']).join('\r')
    csv = iconv.encode(csv, 'gbk')
    fs.writeFile(filePath, csv, {
        flag: 'w'
    }, function(err) {
        if (err) {
            console.log('保存失败')
        } else {
            console.log('保存成功')
        }
    })
}
exports.savePlayersFile = function(filePath, data) {
    fs.writeFile(filePath, data, {
        flag: 'w'
    }, function(err) {
        if (err) {
            console.log('保存失败')
        } else {
            console.log('保存成功')
        }
    })
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
            } else {
                delete idx.open
                idx.winner = []
                idx = JSON.parse(JSON.stringify(idx))
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
exports.getRandomPlayers = function(players, blackList) {
    let num
    while (num === undefined) {
        num = players[Math.floor(Math.random() * players.length)]
        if (blackList.indexOf(num) > -1) num = undefined
    }
    return num
}
