const fs = require('fs');

class Dim0EncoderBuilder {
    constructor() {
        this.u = new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => new Array(10).fill(0)));
        this.im = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }
    
    e(z, y, ax, ay, az, bx, by, bz, cx, cy, cz) {
        this.u[z][y][0] = ax; this.u[z][y][1] = ay; this.u[z][y][2] = az;
        this.u[z][y][3] = bx; this.u[z][y][4] = by; this.u[z][y][5] = bz;
        this.u[z][y][6] = cx; this.u[z][y][7] = cy; this.u[z][y][8] = cz;
        this.u[z][y][9] = 5; // PCスライド発生時のA_xを5 (ZERO) に固定するマジックナンバー
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
        console.log("The Flawless Diamond Encoder forged.");
    }
}

function main() {
    let b = new Dim0EncoderBuilder();
    
    // ==========================================
    // 1. 次元拡張ヘッダー (Dim 0 -> Dim 2 へのビッグバン)
    // ==========================================
    for (let x=0; x<10; x++) b.u[0][0][x] = 8;
    for (let x=0; x<10; x++) b.u[0][1][x] = 9;
    for (let x=0; x<10; x++) b.u[0][2][x] = 7;
    for (let y=3; y<10; y++) {
        for (let x=0; x<10; x++) b.u[0][y][x] = 1;
    }
    
    // Header Execution Jump: [0,0,0] -> [8,8,8] -> [0,0,1]
    b.u[8][8][8] = 0; b.u[8][8][9] = 9; b.u[8][8][0] = 9;
    b.u[8][8][1] = 0; b.u[8][8][2] = 9; b.u[8][8][3] = 9;
    b.u[8][8][4] = 0; b.u[8][8][5] = 0; b.u[8][8][6] = 1;
    b.u[8][8][7] = 0;

    // ==========================================
    // 2. 変数・定数アドレスマッピング
    // ==========================================
    let CONST_8 = [0, 0, 0]; let CONST_9 = [0, 1, 0]; let CONST_7 = [0, 2, 0];
    let NEG_48  = [1, 9, 9]; let NEG_224 = [2, 9, 9]; let NEG_247 = [3, 9, 9];
    let TEMP    = [4, 9, 2]; let ZERO    = [5, 9, 9]; let TEMP_POS= [8, 9, 9];
    let POS_224 = [0, 8, 9]; let POS_247 = [1, 8, 9]; let TARGET_C= [7, 5, 8];
    let I_O     = [9, 9, 9];
    
    // ==========================================
    // 3. 定数ビルド (Z=1 から開始)
    // ==========================================
    let z = 1, y = 0;
    function emit(A, B) {
        let ny = y + 1, nz = z;
        if (ny > 9) { ny = 0; nz++; }
        b.e(z, y, A[0], A[1], A[2], B[0], B[1], B[2], 0, ny, nz);
        y = ny; z = nz;
    }
    
    for(let i=0; i<6; i++)  emit(CONST_8, NEG_48);   // '0'のオフセット (-48)
    for(let i=0; i<28; i++) emit(CONST_8, NEG_224);  // Space生成用 (-224)
    for(let i=0; i<30; i++) emit(CONST_8, NEG_247);  // Tab生成用 (-247)
    emit(CONST_7, NEG_247);
    emit(NEG_224, POS_224); // 絶対ジャンプ出力用 (+224)
    emit(NEG_247, POS_247); // 絶対ジャンプ出力用 (+247)

    // ==========================================
    // 4. メインループ (Z=8)
    // ==========================================
    b.e(8, 0,  TEMP[0], TEMP[1], TEMP[2],  TEMP[0], TEMP[1], TEMP[2],  0, 1, 8);
    b.e(8, 1,  TEMP_POS[0], TEMP_POS[1], TEMP_POS[2],  TEMP_POS[0], TEMP_POS[1], TEMP_POS[2],  0, 2, 8);
    b.e(8, 2,  NEG_48[0], NEG_48[1], NEG_48[2],  TEMP_POS[0], TEMP_POS[1], TEMP_POS[2],  0, 3, 8);
    b.e(8, 3,  TARGET_C[0], TARGET_C[1], TARGET_C[2],  TARGET_C[0], TARGET_C[1], TARGET_C[2],  0, 4, 8);
    b.e(8, 4,  I_O[0], I_O[1], I_O[2],  TEMP[0], TEMP[1], TEMP[2],  0, 6, 8); // IN
    b.e(8, 6,  TEMP[0], TEMP[1], TEMP[2],  TARGET_C[0], TARGET_C[1], TARGET_C[2],  0, 7, 8);
    b.e(8, 7,  TEMP_POS[0], TEMP_POS[1], TEMP_POS[2],  TARGET_C[0], TARGET_C[1], TARGET_C[2],  0, 5, 8);
    b.e(8, 5,  ZERO[0], ZERO[1], ZERO[2],  ZERO[0], ZERO[1], ZERO[2],  0, 0, 9); // Dynamic Execute

    // ==========================================
    // 5. 落下キャッチ用トランポリン群 (幾何学的逆算)
    // ==========================================
    // EOF時 (IN スライド落下 -> Halt)
    b.u[6][0][2] = 5; b.u[6][0][3] = 9; b.u[6][0][4] = 9;
    b.u[6][0][5] = 5; b.u[6][0][6] = 9; b.u[6][0][7] = 9;
    b.u[6][0][8] = 0; b.u[6][0][9] = 9; b.u[6][0][0] = 9; // Jumps to 0,9,9 (Halt Trap)

    // TARGET_C -= TEMP スライド落下 -> Z=8, Y=7 へ復帰
    b.u[7][0][8] = 5; b.u[7][0][9] = 9; b.u[7][0][0] = 9;
    b.u[7][0][1] = 5; b.u[7][0][2] = 9; b.u[7][0][3] = 9;
    b.u[7][0][4] = 0; b.u[7][0][5] = 7; b.u[7][0][6] = 8;

    // TARGET_C -= TEMP_POS スライド落下 -> Z=8, Y=5 へ復帰
    b.u[5][0][8] = 5; b.u[5][0][9] = 9; b.u[5][0][0] = 9;
    b.u[5][0][1] = 5; b.u[5][0][2] = 9; b.u[5][0][3] = 9;
    b.u[5][0][4] = 0; b.u[5][0][5] = 5; b.u[5][0][6] = 8;

    b.e(9, 9,  ZERO[0], ZERO[1], ZERO[2],  ZERO[0], ZERO[1], ZERO[2],  0, 9, 9); // Halt Trap

    // ==========================================
    // 6. 辞書ディスパッチ (Z=9)
    // ==========================================
    for(let d=0; d<10; d++) {
        b.e(9, d,  ZERO[0], ZERO[1], ZERO[2],  ZERO[0], ZERO[1], ZERO[2],  0, (d*4)%10, 2 + Math.floor((d*4)/10));
    }

    // ==========================================
    // 7. 出力カスケード (Z=2 〜 Z=5)
    // ==========================================
    for(let d=0; d<10; d++) {
        let chars = b.im[d];
        for(let i=0; i<4; i++) {
            let currIdx = d * 4 + i;
            let cz = 2 + Math.floor(currIdx / 10);
            let cy = currIdx % 10;
            let nz = 2 + Math.floor((currIdx + 1) / 10);
            let ny = (currIdx + 1) % 10;
            
            let val = chars[i] === ' ' ? POS_224 : POS_247;
            
            if (i === 3) {
                b.e(cz, cy,  val[0], val[1], val[2],  9, 9, 9,  0, 0, 8); // 文字出力完了、ループへ戻る
            } else {
                b.e(cz, cy,  val[0], val[1], val[2],  9, 9, 9,  0, ny, nz); // 次の文字片を出力
            }
        }
    }

    b.build();
}
main();
