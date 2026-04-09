const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        this.universe = new Array(100).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitInstruction(blockIndex, ax, ay, bx, by, cx, cy) {
        this.universe[blockIndex] = [ax, ay, bx, by, cx, cy, 0, 0, 0, 0];
    }

    // 落下(Fallthrough)を安全にキャッチしてジャンプさせるパディングブロック
    emitFallthroughPad(blockIndex, jumpX, jumpY) {
        this.universe[blockIndex] = [jumpX, jumpY, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    build() {
        let out = "";
        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 10; x++) {
                let val = this.universe[y][x];
                if (val < 0 || val > 9) val = 0;
                out += this.invisibleMap[val];
            }
        }
        return out;
    }
}

function main() {
    console.log("Inceptionut IR Builder - The Perfect Echo");
    let builder = new InceptionutBuilder();

    const BOOT = 0;
    const LOOP_START = 1;
    const IN_BLOCK = 2;
    const IN_PAD = 3;
    const OUT_BLOCK = 4;
    const OUT_PAD = 5;
    const HALT_BLOCK = 9;

    const V_CHAR = [0, 8]; // 変数(t1)の座標

    // 0. Bootloader -> [0, 1] (LOOP_START) へジャンプ
    builder.emitInstruction(BOOT, 9, 1, 9, 1, 0, LOOP_START);

    // 1. Clear V_CHAR (V_CHARを0に初期化してIN_BLOCKへ)
    builder.emitInstruction(LOOP_START, ...V_CHAR, ...V_CHAR, 0, IN_BLOCK);

    // 2. IN_BLOCK (文字ならOUT_BLOCKへジャンプ。EOFなら落下)
    builder.emitInstruction(IN_BLOCK, 9, 9, ...V_CHAR, 0, OUT_BLOCK);
    // 3. IN_PAD (落下してきたPCを安全にHALTへ送る)
    builder.emitFallthroughPad(IN_PAD, 0, HALT_BLOCK);

    // 4. OUT_BLOCK (V_CHARを出力。OUTは必ず落下する)
    builder.emitInstruction(OUT_BLOCK, ...V_CHAR, 9, 9, 0, 0);
    // 5. OUT_PAD (落下してきたPCを安全にLOOP_STARTへ戻す)
    builder.emitFallthroughPad(OUT_PAD, 0, LOOP_START);

    // 9. Halt Trap (自分自身に無限ループして安全に停止)
    builder.emitInstruction(HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK);

    fs.writeFileSync('echo.inc', builder.build());
    console.log("IR Building complete. Perfect native binary 'echo.inc' generated.");
}

main();
