const fs = require('fs');

class Dim2Builder {
    constructor() {
        // DIM 2: 10x10x10 = 1000 elements
        this.universe = new Array(10).fill(null).map(()=>
            new Array(10).fill(null).map(()=>
                new Array(10).fill(0)
            )
        );
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitInst(startX, y, z, ax,ay,az, bx,by,bz, cx,cy,cz, pad=0) {
        this.universe[z][y][(startX+0)%10] = ax;
        this.universe[z][y][(startX+1)%10] = ay;
        this.universe[z][y][(startX+2)%10] = az;
        this.universe[z][y][(startX+3)%10] = bx;
        this.universe[z][y][(startX+4)%10] = by;
        this.universe[z][y][(startX+5)%10] = bz;
        this.universe[z][y][(startX+6)%10] = cx;
        this.universe[z][y][(startX+7)%10] = cy;
        this.universe[z][y][(startX+8)%10] = cz;
        this.universe[z][y][(startX+9)%10] = pad;
    }

    build() {
        let out = "";
        for (let z = 0; z < 10; z++) {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    let val = this.universe[z][y][x];
                    if (val < 0 || val > 9) val = 0;
                    out += this.invisibleMap[val];
                }
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut Compiler - The DIM: 2 Encoder");
    let builder = new Dim2Builder();

    // ==========================================
    // Z=0: The Big Bang Header (Must contain NO zeros)
    // ==========================================
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) builder.universe[0][y][x] = 9;
    }
    // [0,0,0] triggers Big Bang, then safely jumps to [1,1,1]
    builder.universe[0][0][0] = 1; builder.universe[0][0][1] = 1; builder.universe[0][0][2] = 1;
    builder.universe[0][0][3] = 1; builder.universe[0][0][4] = 1; builder.universe[0][0][5] = 1;
    builder.universe[0][0][6] = 1; builder.universe[0][0][7] = 1; builder.universe[0][0][8] = 1;

    // ==========================================
    // Z=9: Variables and Constants
    // ==========================================
    builder.universe[9][9][0] = 9999; // Trap Const for EOF
    builder.universe[9][9][1] = 224;  // Value to output Space (32) via -224 & 255
    builder.universe[9][9][2] = 247;  // Value to output Tab (9) via -247 & 255
    builder.universe[9][9][3] = 48;   // ASCII '0'
    // Temp = [4,9,9], Target = [5,9,9]
    const V_TEMP = [4,9,9];
    const V_TARG = [5,9,9];

    // Halt Trap at [9,0,9] (EOF lands here)
    builder.emitInst(9, 0, 9,  9,0,9, 9,0,9,  9,0,9);

    // ==========================================
    // Z=1: Main Input & Logic
    // ==========================================
    // Relay from Header -> Jump to Y=2
    builder.emitInst(1, 1, 1,  1,1,1, 1,1,1,  0,2,1);
    // Y=2: Clear Temp. Jump Y=3.
    builder.emitInst(0, 2, 1,  ...V_TEMP, ...V_TEMP,  0,3,1);
    // Y=3: IN to Temp. Valid -> Y=9. EOF -> Falls to X=9, trapped to [9,0,9].
    builder.emitInst(0, 3, 1,  9,9,9, ...V_TEMP,  0,9,1);
    // Y=9: Clear Target. Jump Y=4.
    builder.emitInst(0, 9, 1,  ...V_TARG, ...V_TARG,  0,4,1);
    // Y=4: Target -= Temp (Target = Input). Jump Y=5.
    builder.emitInst(0, 4, 1,  ...V_TEMP, ...V_TARG,  0,5,1);
    // Y=5: Target -= 48 (Target = 0 to 9). Jump to Z=2.
    builder.emitInst(0, 5, 1,  3,9,9, ...V_TARG,  0,0,2);

    // ==========================================
    // Z=2: Dynamic Jump Modifier
    // ==========================================
    // Y=0: Clear Temp. Jump Y=1.
    builder.emitInst(0, 0, 2,  ...V_TEMP, ...V_TEMP,  0,1,2);
    // Y=1: Temp -= Target (Temp = -Target). Jump Y=2.
    builder.emitInst(0, 1, 2,  ...V_TARG, ...V_TEMP,  0,2,2);
    // Y=2: Clear JumpInst_Y ([7,3,2]). Jump Y=4.
    builder.emitInst(0, 2, 2,  7,3,2, 7,3,2,  0,4,2);
    // Y=4: JumpInst_Y -= Temp. Jump Y=3.
    builder.emitInst(0, 4, 2,  ...V_TEMP, 7,3,2,  0,3,2);
    // Y=3: Execute Dynamic Jump! Target_Y is modified dynamically.
    builder.emitInst(0, 3, 2,  0,0,0, 0,0,0,  0,0,3);

    // ==========================================
    // Z=3: The Jump Table
    // ==========================================
    for(let d=0; d<10; d++) {
        let outZ = 4 + Math.floor(d/2);
        let outY = (d%2) * 5;
        builder.emitInst(0, d, 3,  0,0,0, 0,0,0,  0,outY,outZ);
    }

    // ==========================================
    // Z=4 to 8: The Output Dictionary
    // ==========================================
    for(let d=0; d<10; d++) {
        let Z = 4 + Math.floor(d/2);
        let baseY = (d%2) * 5;
        let str = builder.invisibleMap[d];
        
        for(let i=0; i<4; i++) {
            let constCoord = (str[i] === ' ') ? [1,9,9] : [2,9,9];
            let nextY = (i === 3) ? 2 : baseY + i + 1;
            let nextZ = (i === 3) ? 1 : Z;
            // Negative subtraction trick: forces jump while outputting space/tab!
            builder.emitInst(0, baseY+i, Z,  ...constCoord, 9,9,9,  0,nextY,nextZ);
        }
    }

    fs.writeFileSync('encoder.inc', builder.build());
    console.log("DIM 2 Encoder binary forged.");
}
main();
