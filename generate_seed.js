const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        this.universe = new Array(100).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitBootloader() {
        // 絶対に0を含んではいけない（ビッグバン誘発の法則）
        this.universe[0] = [9, 1, 9, 1, 2, 1, 5, 5, 5, 5];
    }

    emitSlingshot(targetBlock) {
        // [2,1] に着地したPCを [0, targetBlock] へ安全に射出する
        this.universe[1] = [0, 0, 0, 9, 0, 9, 0, targetBlock, 0, 0];
    }

    emitInstruction(blockIndex, ax, ay, bx, by, cx, cy) {
        // 末尾4要素に [0,9],[0,9] を配置し、落下時のA,B読み取りを安全な0-0=0にする
        this.universe[blockIndex] = [ax, ay, bx, by, cx, cy, 0, 9, 0, 9];
    }

    emitFallthroughPad(blockIndex, jumpX, jumpY) {
        // 落下してきたPCにCの座標(ジャンプ先)を提供し、残りは0で埋める
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
    console.log("Inceptionut IR Builder - The Perfect Echo (Big Bang Fixed)");
    let builder = new InceptionutBuilder();

    const BOOT = 0;
    const SLINGSHOT = 1;
    const LOOP_START = 2;
    const IN_BLOCK = 3;
    const IN_PAD = 4;
    const OUT_BLOCK = 5;
    const OUT_PAD = 6;
    const HALT_BLOCK = 9;

    const V_CHAR = [0, 8]; // 変数(t1)の座標

    // 0. Bootloader -> 1. Slingshot -> LOOP_START へ
    builder.emitBootloader();
    builder.emitSlingshot(LOOP_START);

    // 2. Clear V_CHAR (V_CHARを0に初期化してIN_BLOCKへ)
    builder.emitInstruction(LOOP_START, ...V_CHAR, ...V_CHAR, 0, IN_BLOCK);

    // 3. IN_BLOCK (文字ならOUT_BLOCKへジャンプ。EOFなら落下)
    builder.emitInstruction(IN_BLOCK, 9, 9, ...V_CHAR, 0, OUT_BLOCK);
    // 4. IN_PAD (落下してきたPCをHALTへ送る)
    builder.emitFallthroughPad(IN_PAD, 0, HALT_BLOCK);

    // 5. OUT_BLOCK (V_CHARを出力。OUTは必ず落下する)
    builder.emitInstruction(OUT_BLOCK, ...V_CHAR, 9, 9, 0, 0);
    // 6. OUT_PAD (落下してきたPCをLOOP_STARTへ戻す)
    builder.emitFallthroughPad(OUT_PAD, 0, LOOP_START);

    // 9. Halt Trap (自分自身に無限ループして安全に停止)
    builder.emitInstruction(HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK, 0, HALT_BLOCK);

    fs.writeFileSync('echo.inc', builder.build());
    console.log("IR Building complete. Perfect native binary 'echo.inc' generated.");
}

main();
