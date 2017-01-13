class Ball {
    constructor(x, y, img, sx = 0, sy = 0) {
        this.x = x
        this.y = y
        this.img = img
        this.sx = sx
        this.sy = sy
        this.r = 25
    }
    draw(ctx) {
        this.move()
        ctx.drawImage(this.img, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    }
    move() {
        let x = this.x + this.sx,
            y = this.y + this.sy
        if (x > 500) {
            this.x = 1000 - x
            this.sx = -this.sx
        } else if (x < 0) {
            this.x = -x
            this.sx = -this.sx
        } else {
            this.x = x
        }
        if (y > 280) {
            this.y = 560 - y
            this.sy = -this.sy
        } else if (y < 0) {
            this.y = -y
            this.sy = -this.sy
        } else {
            this.y = y
        }

    }
}

module.exports = {
    cvs: null,
    ctx: null,
    balls: [],
    requestFrameId:null,
    imgs: [
        document.querySelector('#img1'),
        document.querySelector('#img2'),
        document.querySelector('#img3'),
        document.querySelector('#img4'),
        document.querySelector('#img5')
    ],
    init(id) {
        this.cvs = document.querySelector('#cvs')
        this.ctx = this.cvs.getContext('2d')
        this.createBall(100)
        console.dir(this.balls)
        console.dir(this.imgs);


    },
    draw() {
        this.ctx.clearRect(0, 0, 500, 280)
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.ctx)
        }
    },
    createBall() {
        let pos = this.getPos()
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos[i].length; j++) {
                this.balls.push(new Ball(pos[i][j][0], pos[i][j][1], this.imgs[parseInt(Math.random() * 5)]))
            }
        }
        this.draw()
    },
    replaceBall() {
        let pos = this.getPos(),
            idx = 0

        cancelAnimationFrame(this.requestFrameId)
        this.balls = this.balls.sort(() => {
            return Math.random() > 0.5
        })
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos[i].length; j++) {
                this.balls[idx].x = pos[i][j][0]
                this.balls[idx].y = pos[i][j][1]
                this.balls[idx].sx = 0
                this.balls[idx].sy = 0
                idx++
            }
        }
        this.draw()
    },
    getPos() {
        let x = 25,
            y = 255,
            d = 50,
            pos = [
                [],
                [],
                [],
                [],
                [],
                []
            ]

        for (var k = 0; k < pos.length; k++) {
            if (k % 2 == 0) {
                for (let i1 = 0; i1 < 3; i1++) {
                    for (let j1 = 0; j1 < 10; j1++) {
                        pos[k].push([25 + j1 * 50 + ((Math.random() - 0.5) * 25), 255 - i1 * 50 + ((Math.random() - 0.5) * 25)])
                    }
                }
            } else {
                for (let i2 = 0; i2 < 3; i2++) {
                    for (let j2 = 0; j2 < 9; j2++) {
                        pos[k].push([50 + j2 * 50 + ((Math.random() - 0.5) * 25), 230 - i2 * 50 + ((Math.random() - 0.5) * 25)])
                    }
                }
            }

        }
        return pos
    },
    start() {
        for (var i = 0; i < this.balls.length; i++) {
            this.balls[i].sx = (Math.random() - 0.5) * 10
            this.balls[i].sy = 4 + Math.random() * 8
        }
        this.move()
    },
    move() {
        this.draw()
        this.requestFrameId = requestAnimationFrame(()=>{
            this.move()
        })

    }



}
