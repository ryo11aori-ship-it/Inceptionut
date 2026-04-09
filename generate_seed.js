const fs = require('fs');

class Dim2MasterBuilder {
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
        this.universe[z][y][9] = 0;
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
    console.log("Inceptionut Compiler - The Ultimate Magic Cascade");
    let b = new Dim2MasterBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を一切含まない起爆装置)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    b.universe[0][0][0] = 1; b.universe[0][0][1] = 1; b.universe[0][0][2] = 1;
    b.universe[0][0][3] = 1; b.universe[0][0][4] = 1; b.universe[0][0][5] = 1;
    b.universe[0][0][6] = 1; b.universe[0][0][7] = 1; b.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: Constants
    // ==========================================
    b.universe[9][9][0] = 9999; // V_HUGE1 (Mangled A fallback)
    b.universe[9][2][0] = 9999; // V_HUGE2 (Mangled A fallback)
    b.universe[9][9][2] = 48;   // V_CONST_48
    b.universe[9][9][3] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][4] = 247;  // V_TAB (-247 & 255 = 9)
    b.universe[9][9][5] = 0;    // V_ZERO

    let V_TEMP = [9,9,8];
    let V_JUMPY = [7,6,2]; // 動的ジャンプのC_yは Z=2, Y=6, X=7 に配置
    let V_ZERO = [5,9,9];

    // ==========================================
    // 落下キャッチ用トランポリン群 (Mangled Cの逆算座標)
    // ==========================================
    // 1. Header Relay at Z=1, Y=1, X=1 (Jumps to Clear Temp [0,2,1])
    b.universe[1][1][1] = 5; b.universe[1][1][2] = 9; b.universe[1][1][3] = 9;
    b.universe[1][1][4] = 5; b.universe[1][1][5] = 9; b.universe[1][1][6] = 9;
    b.universe[1][1][7] = 0; b.universe[1][1][8] = 2; b.universe[1][1][9] = 1;

    // 2. IN_EOF Halt Trap at Z=4, Y=0, X=1 (Falls from IN [0,4,1])
    b.universe[4][0][1] = 1; b.universe[4][0][2] = 0; b.universe[4][0][3] = 4;
    b.universe[4][0][4] = 1; b.universe[4][0][5] = 0; b.universe[4][0][6] = 4;
    b.universe[4][0][7] = 1; b.universe[4][0][8] = 0; b.universe[4][0][9] = 4;

    // 3. Relay for V_JUMPY -= Temp at Z=5, Y=0, X=1 (Falls to [1,0,5] -> Relay to [0,5,1])
    b.universe[5][0][1] = 5; b.universe[5][0][2] = 9; b.universe[5][0][3] = 9;
    b.universe[5][0][4] = 5; b.universe[5][0][5] = 9; b.universe[5][0][6] = 9;
    b.universe[5][0][7] = 0; b.universe[5][0][8] = 5; b.universe[5][0][9] = 1;

    // 4. Relay for V_JUMPY -= 48 at Z=6, Y=0, X=2 (Falls to [2,0,6] -> Relay to [0,6,2])
    b.universe[6][0][2] = 5; b.universe[6][0][3] = 9; b.universe[6][0][4] = 9;
    b.universe[6][0][5] = 5; b.universe[6][0][6] = 9; b.universe[6][0][7] = 9;
    b.universe[6][0][8] = 0; b.universe[6][0][9] = 6; b.universe[6][0][0] = 2;


    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=2, X=0: Clear Temp
    b.emitSyncInst(1, 2,  ...V_TEMP, ...V_TEMP,  0,8,1);

    // Y=8, X=0: Clear V_JUMPY
    b.emitSyncInst(1, 8,  ...V_JUMPY, ...V_JUMPY,  0,3,1);

    // Y=3, X=0: IN to Temp (Char jumps to Y=4, EOF falls to Halt Trap Z=4)
    b.emitSyncInst(1, 3,  9,9,9, ...V_TEMP,  0,4,1);

    // Y=4, X=0: V_JUMPY -= V_TEMP (Always positive, falls to Z=5 Relay -> Jumps to Y=5)
    b.emitSyncInst(1, 4,  ...V_TEMP, ...V_JUMPY,  0,5,1);

    // Y=5, X=0: V_JUMPY -= 48 ('0' jumps to Z=2 Y=6. '1'-'9' fall to Z=6 Relay -> Jumps to Z=2 Y=6)
    b.emitSyncInst(1, 5,  2,9,9, ...V_JUMPY,  0,6,2);

    // ==========================================
    // Z=2: Dynamic Execute!
    // ==========================================
    // C_y is overwritten with exact input value (0~9). Jumps to Z=3, Y=Input.
    b.emitSyncInst(2, 6,  ...V_ZERO, ...V_ZERO,  0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Cascade
    // ==========================================
    for(let c=0; c<10; c++) {
        let Y = c;
        let chars = b.invisibleMap[c];
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? [3,9,9] : [4,9,9];
            // 最後の文字を出力後、Y=2 (Clear Temp) へ戻ってループを再開する
            let nextC = (i === 3) ? [0,2,1] : [0, Y, Z+1];
            b.emitSyncInst(Z, Y,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Ultimate DIM 2 Compiler forged.");
}
main();
