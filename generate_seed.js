const fs = require('fs');

class Dim2PerfectBuilder {
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

    // スライド落下したPCを安全にキャッチする専用のトランポリン
    emitRelay(z, y, inX, targetX, targetY, targetZ) {
        for(let i=0; i<10; i++) this.universe[z][y][i] = 0;
        this.universe[z][y][(inX+6)%10] = targetX;
        this.universe[z][y][(inX+7)%10] = targetY;
        this.universe[z][y][(inX+8)%10] = targetZ;
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
    console.log("Inceptionut Compiler - The Final Perfect Encoder");
    let b = new Dim2PerfectBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を含まない)
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
    b.universe[9][9][0] = 9999; // V_HUGE1 (for EOF fallthrough)
    b.universe[9][5][0] = 9999; // V_HUGE2 (for V_JUMPY -= Temp fallthrough)
    b.universe[9][1][0] = 9999; // V_HUGE3 (for V_JUMPY -= 48 fallthrough)
    
    b.universe[9][9][1] = 48;   // Const_48
    b.universe[9][9][2] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][3] = 247;  // V_TAB (-247 & 255 = 9)
    b.universe[9][9][4] = 0;    // V_ZERO
    b.universe[9][9][5] = 0;    // V_TEMP

    let CONST_48 = [1,9,9];
    let V_SPACE  = [2,9,9];
    let V_TAB    = [3,9,9];
    let V_ZERO   = [4,9,9];
    let V_TEMP   = [5,9,9];
    let V_JUMPY  = [7,0,2];

    // ==========================================
    // トランポリン（スライド落下キャッチ網）
    // ==========================================
    // 1. Header( [0,0,0] ) からジャンプしてきたPCが [1,1,1] にズレるので、[0,1,1] へ直す
    b.emitRelay(1, 1, 1,  0, 1, 1);

    // 2. IN_EOF 落下時: X=9 -> Z=4, Y=0, X=9 へ落下するので、Halt [0,8,8] へジャンプ
    b.emitRelay(4, 0, 9,  0, 8, 8);

    // 3. V_JUMPY -= Temp 落下時: X=9 -> Z=5, Y=0, X=2 へ落下するので、[0,5,1] へジャンプ
    b.emitRelay(5, 0, 2,  0, 5, 1);

    // 4. V_JUMPY -= 48 落下時: X=9 -> Z=6, Y=0, X=2 へ落下するので、[0,6,1] へジャンプ
    b.emitRelay(6, 0, 2,  0, 6, 1);

    // ==========================================
    // Halt Trap
    // ==========================================
    b.emitSyncInst(8, 8,  ...V_ZERO, ...V_ZERO,  0,8,8);

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=1: Clear Temp -> Y=2
    b.emitSyncInst(1, 1,  ...V_TEMP, ...V_TEMP,  0,2,1);

    // Y=2: Clear V_JUMPY -> Y=3
    b.emitSyncInst(1, 2,  ...V_JUMPY, ...V_JUMPY,  0,3,1);

    // Y=3: IN to Temp. Char jumps to Y=4. EOF falls to Trampoline 2
    b.emitSyncInst(1, 3,  9,9,9, ...V_TEMP,  0,4,1);

    // Y=4: V_JUMPY -= Temp (-Char). Falls to Trampoline 3 -> Jumps to Y=5
    b.emitSyncInst(1, 4,  ...V_TEMP, ...V_JUMPY,  0,5,1);

    // Y=5: V_JUMPY -= 48. 0 jumps to Y=6. 1~9 falls to Trampoline 4 -> Jumps to Y=6
    b.emitSyncInst(1, 5,  ...CONST_48, ...V_JUMPY,  0,6,1);

    // Y=6: Dynamic Execute! Jumps to Z=2, Y=0
    b.emitSyncInst(1, 6,  ...V_ZERO, ...V_ZERO,  0,0,2);

    // ==========================================
    // Z=2: Dynamic Execute Target
    // ==========================================
    // C_y [7,0,2] is dynamically set to 0~9.
    b.emitSyncInst(2, 0,  ...V_ZERO, ...V_ZERO,  0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Dictionary
    // ==========================================
    for(let c=0; c<10; c++) {
        let chars = b.invisibleMap[c];
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? V_SPACE : V_TAB;
            let nextC = (i === 3) ? [0,1,1] : [0, c, Z+1];
            // 常にマイナス値(V_SPACE等)が引かれるため、必ず出力と同時にジャンプする
            b.emitSyncInst(Z, c,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Flawless DIM 2 Compiler forged.");
}
main();
