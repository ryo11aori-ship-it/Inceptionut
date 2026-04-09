const fs = require('fs');

class FlatVMEncoderBuilder {
    constructor() {
        this.u = new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => new Array(10).fill(0)));
        this.im = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }
    
    e(z, y, ax, ay, az, bx, by, bz, cx, cy, cz) {
        this.u[z][y][0] = ax; this.u[z][y][1] = ay; this.u[z][y][2] = az;
        this.u[z][y][3] = bx; this.u[z][y][4] = by; this.u[z][y][5] = bz;
        this.u[z][y][6] = cx; this.u[z][y][7] = cy; this.u[z][y][8] = cz;
        this.u[z][y][9] = 0; // 10要素目はパディングとして常に0
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
        console.log("The Pure Flat-VM Encoder forged.");
    }
}

function main() {
    let b = new FlatVMEncoderBuilder();
    
    // ==========================================
    // データセグメント (Z=9, Y=0) に基礎となる定数を配置
    // ==========================================
    b.u[9][0][0] = 8;
    b.u[9][0][1] = 9;
    
    let C8      = [0, 0, 9];
    let C9      = [1, 0, 9];
    let V_NEG32 = [2, 0, 9];
    let V_NEG9  = [3, 0, 9];
    let V_POS48 = [4, 0, 9];
    let TEMP    = [5, 0, 9];
    let TARGET  = [6, 0, 9];
    let ZERO    = [7, 0, 9];
    let I_O     = [9, 9, 9];
    
    let line = 0; // 現在の行数 (0〜99)
    function emit(A, B, C) {
        let z = Math.floor(line / 10);
        let y = line % 10;
        let cx = C ? C[0] : 0;
        let cy = C ? C[1] : (line+1)%10;          // Cが未指定なら次の行へフォールスルー
        let cz = C ? C[2] : Math.floor((line+1)/10);
        b.e(z, y, A[0], A[1], A[2], B[0], B[1], B[2], cx, cy, cz);
        line++;
    }

    // ==========================================
    // 1. 定数の動的ビルド (Line 0 〜 12)
    // ==========================================
    for(let i=0; i<4; i++) emit(C8, V_NEG32); // -8 * 4 = -32 (Space出力用)
    emit(C9, V_NEG9);                         // -9 (Tab出力用)
    
    for(let i=0; i<6; i++) emit(C8, TEMP);    // -8 * 6 = -48
    emit(TEMP, V_POS48);                      // 0 - (-48) = 48 (ASCII '0'のオフセット)
    emit(TEMP, TEMP);                         // TEMP を 0 にリセット

    // ==========================================
    // 2. メインループ (Line 13 〜 22)
    // ==========================================
    let L13 = [0, 3, 1]; // Line 13のアドレス
    let L14 = [0, 4, 1]; // Line 14のアドレス
    let L15 = [0, 5, 1]; // Line 15のアドレス
    
    emit(I_O, TEMP, L15);  // L13: 入力(IN) -> 文字ならL15へジャンプ、EOFなら次へ落下
    emit(ZERO, ZERO, L14); // L14: EOF到達時、自分自身にジャンプして安全にHalt

    emit(TARGET, TARGET);  // L15: TARGET変数をクリア
    emit(TEMP, TARGET);    // L16: TARGET = IN (入力文字)
    emit(V_POS48, TARGET); // L17: TARGET = IN - 48 (0〜9の数値になる)
    
    emit(TEMP, TEMP);      // L18: TEMP変数をクリア
    let CY_ADDR = [7, 2, 2]; // Line 22(z=2, y=2)のC_y座標のアドレスは227 -> [7,2,2]
    emit(CY_ADDR, CY_ADDR);// L19: 動的ジャンプ先のC_y座標をクリア
    
    emit(TARGET, TEMP);    // L20: TEMP = -TARGET
    emit(TEMP, CY_ADDR);   // L21: 動的ジャンプ先のC_y座標を TARGET で上書き
    
    emit(ZERO, ZERO, [0, 0, 3]); // L22: 動的ジャンプ実行！ Z=3 (Jump Table) へ飛ぶ

    // ==========================================
    // 3. ジャンプテーブル (Line 30 〜 39)
    // ==========================================
    line = 30;
    for(let d=0; d<10; d++) {
        let targetLine = 40 + d * 5; // 各数字の出力ブロックは5行ずつ
        emit(ZERO, ZERO, [0, targetLine % 10, Math.floor(targetLine / 10)]);
    }

    // ==========================================
    // 4. 出力ブロック (Line 40 〜 89)
    // ==========================================
    line = 40;
    for(let d=0; d<10; d++) {
        let chars = b.im[d];
        for(let i=0; i<4; i++) {
            // 文字がスペースなら -32 を、タブなら -9 を出力する (0 - (-32) = 32)
            let VAL = chars[i] === ' ' ? V_NEG32 : V_NEG9;
            emit(VAL, I_O); 
        }
        emit(ZERO, ZERO, L13); // 4文字出力後、L13(メインループ)へ戻る
    }

    b.build();
}
main();
