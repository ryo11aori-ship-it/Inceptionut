const fs = require('fs');

class Dim2FinalBuilder {
    constructor() {
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitSyncInst(z, y, ax,ay,az, bx,by,bz, cx,cy,cz) {
        this.universe[z][y][0] = ax; this.universe[z][y][1] = ay; this.universe[z][y][2] = az;
        this.universe[z][y][3] = bx; this.universe[z][y][4] = by; this.universe[z][y][5] = bz;
        this.universe[z][y][6] = cx; this.universe[z][y][7] = cy; this.universe[z][y][8] = cz;
        this.universe[z][y][9] = 0; // Pad
    }

    build() {
        let out = "";
        for (let z = 0; z < 10; z++) {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    out += this.invisibleMap[this.universe[z][y][x]];
                }
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut Compiler - The Flawless Encoder");
    let b = new Dim2FinalBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を一切含まない)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    b.universe[0][0][0] = 1; b.universe[0][0][1] = 1; b.universe[0][0][2] = 1;
    b.universe[0][0][3] = 1; b.universe[0][0][4] = 1; b.universe[0][0][5] = 1;
    b.universe[0][0][6] = 1; b.universe[0][0][7] = 1; b.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: 定数・変数領域
    // ==========================================
    b.universe[9][9][0] = 9999; // V_HUGE (スライド落下時の安全用)
    b.universe[9][9][3] = 0;    // V_JUMPY (ジャンプ先計算用)
    b.universe[9][9][4] = 0;    // V_TEMP (入力文字用)
    b.universe[9][9][5] = 48;   // Const_48
    b.universe[9][9][6] = 0;    // V_ZERO
    b.universe[9][9][7] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][8] = 247;  // V_TAB (-247 & 255 = 9)

    // Halt トラップ (Z=8, Y=8, X=0)
    b.emitSyncInst(8, 8,  0,0,0, 0,0,0,  0,0,8);

    // ==========================================
    // トランポリン（スライド落下キャッチ網）
    // ==========================================
    // 1. Headerからの着地: [1,1,1] でスライドしたPCを [0,1,1] (Main Logic)へ流す
    b.universe[1][1][1] = 9; b.universe[1][1][2] = 9; b.universe[1][1][3] = 6;
    b.universe[1][1][4] = 9; b.universe[1][1][5] = 9; b.universe[1][1][6] = 6;
    b.universe[1][1][7] = 0; b.universe[1][1][8] = 1; b.universe[1][1][9] = 1;

    // 2. IN 命令が EOFだった場合のスライドキャッチ -> Halt [0,8,8]へ
    b.universe[3][0][4] = 9; b.universe[3][0][5] = 9; b.universe[3][0][6] = 6;
    b.universe[3][0][7] = 9; b.universe[3][0][8] = 9; b.universe[3][0][9] = 6;
    b.universe[3][0][0] = 0; b.universe[3][0][1] = 8; b.universe[3][0][2] = 8;

    // 3. V_JUMPY -= V_TEMP のスライドキャッチ -> 次の命令 [0,4,1]へ
    b.universe[4][0][1] = 9; b.universe[4][0][2] = 9; b.universe[4][0][3] = 6;
    b.universe[4][0][4] = 9; b.universe[4][0][5] = 9; b.universe[4][0][6] = 6;
    b.universe[4][0][7] = 0; b.universe[4][0][8] = 4; b.universe[4][0][9] = 1;

    // 4. V_JUMPY -= 48 のスライドキャッチ -> 次の命令 [0,5,1]へ
    b.universe[5][0][1] = 9; b.universe[5][0][2] = 9; b.universe[5][0][3] = 6;
    b.universe[5][0][4] = 9; b.universe[5][0][5] = 9; b.universe[5][0][6] = 6;
    b.universe[5][0][7] = 0; b.universe[5][0][8] = 5; b.universe[5][0][9] = 1;

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=1: V_TEMP, V_JUMPY の初期化 (次の入力へ備える)
    b.emitSyncInst(1, 1,  9,9,4, 9,9,4,  0,2,1);

    // Y=2: IN -> V_TEMP
    b.emitSyncInst(1, 2,  9,9,9, 9,9,4,  0,3,1);

    // Y=3: V_JUMPY -= V_TEMP (自己書き換え先の座標 [7,5,1] を計算)
    b.emitSyncInst(1, 3,  9,9,4, 7,5,1,  0,4,1);

    // Y=4: V_JUMPY -= 48 (マイナス座標エラーを回避するため常にプラスになる順番で引く)
    b.emitSyncInst(1, 4,  9,9,5, 7,5,1,  0,5,1);

    // Y=5: Dynamic Jump! (計算されたY座標へ飛ぶ)
    b.emitSyncInst(1, 5,  9,9,6, 9,9,6,  0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Dictionary (出力辞書)
    // ==========================================
    for(let c=0; c<10; c++) {
        let chars = b.invisibleMap[c];
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? [9,9,7] : [9,9,8];
            // 4文字出力し終えたら Y=1 へ戻って次の文字を読み込む
            let nextC = (i === 3) ? [0,1,1] : [0, c, Z+1];
            // 正の数を引いてマイナスの結果を作り、絶対に落下スライドさせない！
            b.emitSyncInst(Z, c,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Flawless DIM 2 Compiler forged.");
}
main();
