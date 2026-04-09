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
        console.log("The True Blank Binary Encoder forged.");
    }
}

function main() {
    let b = new Dim0EncoderBuilder();
    
    // 定数の初期配置 (すべて 0〜9 で表現)
    b.u[9][0][7] = 8; // 値: 8
    b.u[9][0][8] = 9; // 値: 9
    
    let ZERO   = [0, 0, 9];
    let NEG_8  = [1, 0, 9];
    let NEG_9  = [2, 0, 9];
    let NEG_32 = [3, 0, 9];
    let NEG_48 = [4, 0, 9];
    let TEMP   = [5, 0, 9];
    let CONST_8= [7, 0, 9]; 
    let CONST_9= [8, 0, 9]; 
    let I_O    = [9, 9, 9];
    
    let z = 0, y = 0;
    
    // PCの自動進行（フォールスルー）を計算して、必ず次の命令へ安全にジャンプさせる関数
    function emit(A, B, C) {
        let cx = C ? C[0] : 0;
        let cy = C ? C[1] : (y+1)%10;
        let cz = C ? C[2] : z + Math.floor((y+1)/10);
        b.e(z, y, A[0], A[1], A[2], B[0], B[1], B[2], cx, cy, cz);
        y++;
        if (y > 9) { y = 0; z++; }
    }

    // ==========================================
    // 1. 定数の動的ビルド（引き算によるマイナス値の生成）
    // ==========================================
    emit(CONST_8, NEG_8); // 0 - 8 = -8
    emit(CONST_9, NEG_9); // 0 - 9 = -9
    for(let i=0; i<4; i++) emit(CONST_8, NEG_32); // 0 - 8 * 4 = -32 (Space)
    for(let i=0; i<6; i++) emit(CONST_8, NEG_48); // 0 - 8 * 6 = -48 (ASCII '0'のオフセット)

    // ==========================================
    // 2. メインループ
    // ==========================================
    let LOOP_START = [0, y, z];
    
    emit(TEMP, TEMP);             // 変数クリア
    
    let CHAR_HANDLER = [0, (y+2)%10, z + Math.floor((y+2)/10)];
    emit(I_O, TEMP, CHAR_HANDLER); // 入力読込。EOFなら次へ落下、文字ならCHAR_HANDLERへ
    
    let HALT_ADDR = [0, y, z];
    emit(ZERO, ZERO, HALT_ADDR);  // EOF時: 自分自身にジャンプして安全にHalt
    
    // --- 文字の処理 (CHAR_HANDLER) ---
    emit(NEG_48, TEMP);           // 入力値から 48 を引く
    
    let TARGET_C_Y = [7, (y+2)%10, z + Math.floor((y+2)/10)]; 
    emit(TARGET_C_Y, TARGET_C_Y); // 動的ジャンプ先のC_yをゼロクリア
    
    emit(TEMP, TARGET_C_Y);       // 計算結果(0〜9)を動的ジャンプ先のC_yに上書き
    
    emit(ZERO, ZERO, [0, 0, 4]);  // Z=4 (辞書ディスパッチ) へジャンプ

    // ==========================================
    // 3. 辞書ディスパッチ (Z=4)
    // ==========================================
    z = 4; y = 0;
    for(let d=0; d<10; d++) {
        let targetZ = 5 + Math.floor(d / 2);
        let targetY = (d % 2) * 5;
        emit(ZERO, ZERO, [0, targetY, targetZ]); // 上書きされたY座標に応じて各文字ブロックへ飛ぶ
    }

    // ==========================================
    // 4. 文字出力ブロック (Z=5〜9 に高密度パッキング)
    // ==========================================
    for(let d=0; d<10; d++) {
        z = 5 + Math.floor(d / 2);
        y = (d % 2) * 5;
        let chars = b.im[d];
        for(let i=0; i<4; i++) {
            let val = chars[i] === ' ' ? NEG_32 : NEG_9;
            emit(val, I_O); // I_O に出力 (0 - (-32) = 32 など)
        }
        emit(ZERO, ZERO, LOOP_START); // 次の文字を読むためにループ先頭へ戻る
    }

    b.build();
}
main();
