const fs = require('fs');

class PerfectEncoderBuilder {
    constructor() {
        this.u = new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => new Array(10).fill(0)));
        this.im = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }
    
    e(z, y, ax, ay, az, bx, by, bz, cx, cy, cz) {
        this.u[z][y][0] = ax; this.u[z][y][1] = ay; this.u[z][y][2] = az;
        this.u[z][y][3] = bx; this.u[z][y][4] = by; this.u[z][y][5] = bz;
        this.u[z][y][6] = cx; this.u[z][y][7] = cy; this.u[z][y][8] = cz;
        this.u[z][y][9] = 0; 
    }

    emitRelay(z, y, inX, targetC) {
        for(let i=0; i<10; i++) this.u[z][y][i] = 0;
        this.u[z][y][(inX + 6) % 10] = targetC[0];
        this.u[z][y][(inX + 7) % 10] = targetC[1];
        this.u[z][y][(inX + 8) % 10] = targetC[2];
    }
    
    build() {
        let o = "";
        for(let z=0; z<10; z++) {
            for(let y=0; y<10; y++) {
                for(let x=0; x<10; x++) {
                    o += this.im[this.u[z][y][x]];
                }
            }
        }
        fs.writeFileSync('encoder.inc', o);
        console.log("The Flawless Pure Math Encoder forged.");
    }
}

function main() {
    let b = new PerfectEncoderBuilder();
    
    // ==========================================
    // 次元拡張 (Big Bang) ヘッダー (10要素の壁を破りDIM 2へ拡張)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.u[0][y][x] = 8; // 0を含まない100要素
    }
    b.e(0, 0, 1,1,1, 1,1,1, 0,1,1); // [1,1,1] へジャンプし、Relay経由で [0,2,1] へ
    b.emitRelay(1, 1, 1, [0, 2, 1]);

    // ==========================================
    // データセグメント (Z=9)
    // ==========================================
    b.u[9][0][8] = 8; b.u[9][0][9] = 9; b.u[9][0][7] = 7;
    b.u[9][9][0] = 9999; // 落下時の HUGE スライドアブソーバー
    
    let C8 = [8, 0, 9], C9 = [9, 0, 9], C7 = [7, 0, 9];
    let V_NEG8 = [1, 9, 9], V_NEG7 = [2, 9, 9];
    let V_NEG32 = [3, 9, 9], V_NEG48 = [4, 9, 9];
    let V_POS224 = [5, 9, 9], V_POS247 = [6, 9, 9];
    let V_TEMP = [7, 9, 9], ZERO = [8, 9, 9], I_O = [9, 9, 9];
    
    // ==========================================
    // 定数ビルド (Z=1, Y=2 から)
    // ==========================================
    let cyc = 12; // Z=1, Y=2
    function emitC
