const fs = require('fs');

class Dim2SynchronizedBuilder {
    constructor() {
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitSyncInst(z, y, ax,ay,az, bx,by,bz, cx,cy,cz) {
        // 全命令をX=0から開始し、9要素でピッタリ使い切る。
        // パディング(10要素目)は0固定。PCスライドは発生するが、必ずジャンプで脱出するため問題ない。
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
    console.log("Inceptionut Compiler - The Synchronized DIM 2 Encoder");
    let b = new Dim2SynchronizedBuilder();

    // ==========================================
    // Z=0: Big Bang Header
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    b.universe[0][0][0] = 1; b.universe[0][0][1] = 1; b.universe[0][0][2] = 1;
    b.universe[0][0][3] = 1; b.universe[0][0][4] = 1; b.universe[0][0][5] = 1;
    b.universe[0][0][6] = 1; b.universe[0][0][7] = 1; b.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: Constants & Variables
    // ==========================================
    let V_TEMP = [1,9,9], V_ZERO = [0,9,9], V_JUMPY = [7,0,2];
    b.universe[9][9][0] = 0;   // Zero
    b.universe[9][9][1] = 0;   // Temp
    b.universe[9][9][2] = -48; // Const_Neg48
    b.universe[9][9][3] = 224; // Const_Space (-224 & 255 = 32)
    b.universe[9][9][4] = 247; // Const_Tab (-247 & 255 = 9)
    b.universe[9][9][5] = -1;  // Const_EOF (-1)

    // Halt Block
    b.emitSyncInst(8, 0,  ...V_ZERO, ...V_ZERO,  0,0,8);

    // ==========================================
    // Z=1: Main Logic (All Synchronized Jumps)
    // ==========================================
    // Y=1: Clear Temp -> Y=2
    b.emitSyncInst(1, 1,  ...V_TEMP, ...V_TEMP,  0,2,1);

    // Y=2: Read IN. Normal -> Y=3. EOF -> Y=8
    // IN(-1) - (-1) <= 0 なら EOF (Jump to Y=8)
    b.emitSyncInst(1, 2,  9,9,9, ...V_TEMP,  0,3,1);
    b.emitSyncInst(1, 3,  5,9,9, ...V_TEMP,  0,8,8); // If Temp <= -1, Halt. Else fall to Y=4

    // Y=4: Recover Temp -> Y=5
    // Temp was (Input - EOF). Restore to Input by adding EOF back.
    b.emitSyncInst(1, 4,  5,9,9, ...V_ZERO,  0,5,1); // Use Zero as garbage trampoline
    b.emitSyncInst(1, 5,  ...V_ZERO, ...V_TEMP,  0,6,1);

    // Y=6: Temp = Temp - (-48). -> Y=7
    b.emitSyncInst(1, 6,  2,9,9, ...V_TEMP,  0,7,1);

    // Y=7: Clear V_JUMPY -> Y=8
    b.emitSyncInst(1, 7,  ...V_JUMPY, ...V_JUMPY,  0,8,1);

    // Y=8: Modify V_JUMPY! (V_JUMPY -= Temp) -> Z=2, Y=0
    // This calculation is guaranteed to be negative, so it ALWAYS jumps.
    b.emitSyncInst(1, 8,  ...V_TEMP, ...V_JUMPY,  0,0,2);

    // ==========================================
    // Z=2: Dynamic Jump Execution!
    // ==========================================
    // Target C_y is at [7,0,2]
    b.emitSyncInst(2, 0,  ...V_ZERO, ...V_ZERO,  0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Dictionary
    // ==========================================
    for(let c=0; c<10; c++) {
        let Y = c;
        let chars = b.invisibleMap[c];
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? [3,9,9] : [4,9,9];
            let nextC = (i === 3) ? [0,1,1] : [0, Y, Z+1];
            // 常にマイナス値が引かれるため、必ず出力と同時にジャンプする！
            b.emitSyncInst(Z, Y,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Synchronized DIM 2 Encoder forged.");
}
main();
