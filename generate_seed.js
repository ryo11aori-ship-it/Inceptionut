const fs = require('fs');

class Dim2EncoderBuilder {
    constructor() {
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitInst(z, y, startX, ax,ay,az, bx,by,bz, cx,cy,cz, pad=0) {
        this.universe[z][y][(startX+0)%10] = ax; this.universe[z][y][(startX+1)%10] = ay; this.universe[z][y][(startX+2)%10] = az;
        this.universe[z][y][(startX+3)%10] = bx; this.universe[z][y][(startX+4)%10] = by; this.universe[z][y][(startX+5)%10] = bz;
        this.universe[z][y][(startX+6)%10] = cx; this.universe[z][y][(startX+7)%10] = cy; this.universe[z][y][(startX+8)%10] = cz;
        this.universe[z][y][(startX+9)%10] = pad;
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
    console.log("Inceptionut Compiler - The Perfect DIM 2 Encoder");
    let b = new Dim2EncoderBuilder();

    // ==========================================
    // Z=0: Big Bang Header (0を含まない爆薬)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) b.universe[0][y][x] = 9;
    }
    // [0,0,0] triggers Big Bang, then jumps to [1,1,1]
    b.universe[0][0][0] = 1; b.universe[0][0][1] = 1; b.universe[0][0][2] = 1;
    b.universe[0][0][3] = 1; b.universe[0][0][4] = 1; b.universe[0][0][5] = 1;
    b.universe[0][0][6] = 1; b.universe[0][0][7] = 1; b.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: Constants & Variables
    // ==========================================
    b.universe[9][9][0] = 9999; // V_HUGE1 [0,9,9]
    b.universe[9][1][0] = 9999; // V_HUGE2 [0,1,9]
    b.universe[9][2][0] = -48;  // V_CONST_NEG48 [0,2,9]
    b.universe[9][3][0] = 224;  // V_SPACE [0,3,9] (-224 & 255 = 32 = Space)
    b.universe[9][4][0] = 247;  // V_TAB [0,4,9]   (-247 & 255 = 9 = Tab)
    
    let V_TEMP = [1,9,0], V_ZERO = [0,9,0], V_JUMPY = [7,0,2];

    // ==========================================
    // Z=8: Halt Block (EOF target)
    // ==========================================
    b.emitInst(8, 0, 0,  ...V_ZERO, ...V_ZERO, 0,0,8);

    // ==========================================
    // Z=1: Main Logic
    // ==========================================
    // Y=1, X=1: Clear V_TEMP
    b.emitInst(1, 1, 1,  ...V_TEMP, ...V_TEMP, 0,2,1);

    // Y=2, X=0: Read IN. Normal -> Y=8. EOF -> Garbage1 -> Z=8, Y=0 (Halt).
    b.emitInst(1, 2, 0,  9,9,9, ...V_TEMP, 0,8,1);

    // Y=8, X=0: Temp = Temp - (-48). Result <= 0.
    b.emitInst(1, 8, 0,  0,2,9, ...V_TEMP, 0,4,1);

    // Y=4, X=0: Clear V_JUMPY. Result <= 0.
    b.emitInst(1, 4, 0,  ...V_JUMPY, ...V_JUMPY, 0,5,1);

    // Y=5, X=0: V_JUMPY = V_JUMPY - Temp.
    // '0' -> jumps to [2,6,1]. '1'-'9' -> fallthrough -> Garbage2 -> jumps to [2,2,6].
    b.emitInst(1, 5, 0,  ...V_TEMP, ...V_JUMPY, 2,6,1);

    // Y=6, X=2: Trampoline 1 (Direct Jump from '0')
    b.emitInst(1, 6, 2,  ...V_ZERO, ...V_ZERO, 0,0,2);
    // Z=6, Y=2, X=2: Trampoline 2 (Garbage Jump from '1'..'9')
    b.emitInst(6, 2, 2,  ...V_ZERO, ...V_ZERO, 0,0,2);

    // ==========================================
    // Z=2: Dynamic Jump Execution!
    // ==========================================
    // C_y is at [7,0,2], modified by Z=1, Y=5 logic.
    b.emitInst(2, 0, 0,  ...V_ZERO, ...V_ZERO, 0,0,3);

    // ==========================================
    // Z=3, 4, 5, 6: Output Dictionary
    // ==========================================
    for(let c of [0, 1, 9]) {
        let Y = c;
        let chars = b.invisibleMap[c]; // 例: '1' なら "   \t"
        for(let i=0; i<4; i++) {
            let Z = 3 + i;
            let V_CHAR = (chars[i] === ' ') ? [0,3,9] : [0,4,9];
            let nextC = (i === 3) ? [1,1,1] : [0, Y, Z+1];
            // 常に -224 か -247 が引かれるため、結果は <= 0 となり確実にジャンプする！
            b.emitInst(Z, Y, 0,  ...V_CHAR, 9,9,9, ...nextC);
        }
    }

    fs.writeFileSync('encoder.inc', b.build());
    console.log("Flawless DIM 2 Encoder forged.");
}
main();
