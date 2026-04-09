const fs = require('fs');

class Dim2CompilerBuilder {
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
    console.log("Inceptionut Compiler - The Perfect Math & Trampoline Fix");
    let b = new Dim2CompilerBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を含まない起爆装置)
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
    b.universe[9][9][0] = 9999; // V_HUGE1 [0,9,9]
    b.universe[9][5][0] = 9999; // V_HUGE2 [0,5,9]
    b.universe[9][9][2] = 48;   // V_CONST_48 [2,9,9]
    b.universe[9][9][3] = 224;  // V_SPACE (-224 & 255 = 32)
    b.universe[9][9][4] = 247;  // V_TAB (-247 & 255 = 9)
    b.universe[9][9][5] = 0;    // V_ZERO [5,9,9]
    
    let V_TEMP = [3,9,8]; // [3,9,8] = 0
    let V_JUMPY = [7,0,2]; // [7,0,2] = 0
    let V_ZERO = [5,9,9];

    // ==========================================
    // Trampolines (スライド落下の安全なキャッチ)
    // ==========================================
    // Trampoline 1: EOF Catch at Z=3, Y=0, X=8 -> Jumps to Halt [0,0,8]
    b.universe[3][0][8] = 5; b.universe[3][0][9] = 9; b.universe[3][0][0] = 9;
    b.universe[3][0][1] = 5; b.universe[3][0][2] = 9; b.universe[3][0][3] = 9;
    b.universe[3][0][4] = 0; b.universe[3][0][5] = 0; b.universe[3][0][6] = 8;

    // Trampoline 2: Target > 0 Catch at Z=4, Y=0, X=8 -> Jumps to Y=4 [0,4,1]
    b.universe[4][0][8] = 5; b.universe[4][0][9] = 9; b.universe[4][0][0] = 9;
    b.universe[4][0][1] = 5; b.universe[4][0][2] = 9; b.universe[4][0][3] = 9;
    b.universe[4][0][4] = 0; b.universe[4][0][5] = 4; b.universe[4][0][6] = 1;

    // Trampoline 3: Modifier > 0 Catch at Z=6, Y=0, X=2 -> Jumps to Y=6 [0,6,1]
    b.universe[6][0][2] = 5; b.universe[6][0][3] = 9; b.universe[6][0][4] = 9;
    b.universe[6][0][5] = 5; b.universe[6][0][6] = 9; b.universe[6][0][7] = 9;
    b.universe[6][0][8] = 0; b.universe[6][0][9] = 6; b.universe[6][0][0] = 1;

    // Halt Trap at Z=8, Y=0, X=0
    b.emitSyncInst(8, 0,  ...V_ZERO, ...V_ZERO,  0,0,8);

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=1: Clear Temp
    b.emitSyncInst(1, 1,  ...V_TEMP, ...V_TEMP,  0,2,1);

    // Y=2: IN to Temp. EOF falls to X=9 -> Trampoline 1
    b.emitSyncInst(1, 2,  9,9,9, ...V_TEMP,  0,3,1);

    // Y=3: Temp -= 48. Positive falls to X=9 -> Trampoline 2
    b.emitSyncInst(1, 3,  2,9,9, ...V_TEMP,  0,4,1);

    // Y=4: V_ZERO -= Temp. Always negative (0 to -9), never falls.
    b.emitSyncInst(1, 4,  ...V_TEMP, ...V_ZERO,  0,5,1);

    // Y=5: V_JUMPY -= V_ZERO. Positive falls to X=9 -> Trampoline 3
    b.emitSyncInst(1, 5,  ...V_ZERO, ...V_JUMPY, 0,6,1);

    // Y=6: Clear V_ZERO. Jumps to Dynamic Execute!
    b.emitSyncInst(1, 6,  ...V_ZERO, ...V_ZERO,  0,0,2);

    // ==========================================
    // Z=2: Dynamic Jump Execution!
    // ==========================================
    // C_y [7,0,2] is dynamically set to 0~9 based on input!
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
            // 常にマイナス値(V_CHAR)が引かれるため、必ず出力と同時にジャンプする！
            b.emitSyncInst(Z, Y,  ...V_CHAR, 9,9,9,  ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Flawless DIM 2 Compiler forged.");
}
main();
