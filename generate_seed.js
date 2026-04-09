const fs = require('fs');

class InceptionutBuilder {
    constructor() {
        // 次元1 (10ブロック x 10要素) の宇宙
        this.universe = new Array(10).fill(null).map(() => new Array(10).fill(0));
        this.invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    }

    emitBootloader() {
        this.universe[0] = [9, 1, 9, 1, 2, 1, 5, 5, 5, 5];
    }

    emitSlingshot(targetBlock) {
        this.universe[1] = [0, 0, 0, 9, 0, 9, 0, targetBlock, 0, 0];
    }

    emitClear(blockIndex, varX, varY, nextBlock) {
        this.universe[blockIndex] = [varX, varY, varX, varY, 0, nextBlock, 0, 0, 0, 0];
    }

    emitIn(blockIndex, varX, varY, outBlock) {
        // 文字ならoutBlockへ。EOF(-1)ならPC=6へ進み、[0,9]-[0,9]<=0 で [9,9] へ脱出する
        this.universe[blockIndex] = [9, 9, varX, varY, 0, outBlock, 0, 9, 0, 9];
    }

    emitOutBounce(blockIndex, varX, varY, loopBlock, garbageBlock) {
        // The Intra-Block Bounce: 1ブロック内で3回跳ね返り、loopBlockへ脱出する奇跡の配列
        this.universe[blockIndex] = [varX, varY, 9, 9, 0, garbageBlock, 0, loopBlock, 0, 0];
    }

    emitHalt(blockIndex) {
        // [9,9] に飛んできたPCを [9,0] の特異点に捕らえて無限ループさせる
        this.universe[blockIndex] = [0, 9, 0, 9, 0, 9, 0, 9, 0, 9];
    }

    build() {
        let out = "";
        for (let y = 0; y < 10; y++) {
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
    console.log("Inceptionut IR Builder - The Intra-Block Bounce");
    let builder = new InceptionutBuilder();

    const BOOT = 0;
    const SLINGSHOT = 1;
    const LOOP_START = 2;
    const IN_BLOCK = 3;
    const OUT_BLOCK = 4;
    const GARBAGE = 6;
    const HALT_BLOCK = 9;

    const V_CHAR = [0, 8];

    builder.emitBootloader();
    builder.emitSlingshot(LOOP_START);
    
    // 変数をクリアして入力へ
    builder.emitClear(LOOP_START, V_CHAR[0], V_CHAR[1], IN_BLOCK);
    
    // 入力（EOFならHaltへ脱出）
    builder.emitIn(IN_BLOCK, V_CHAR[0], V_CHAR[1], OUT_BLOCK);

    // 出力と内部バウンド（脱出後はLOOP_STARTへ）
    builder.emitOutBounce(OUT_BLOCK, V_CHAR[0], V_CHAR[1], LOOP_START, GARBAGE);

    // 停止領域
    builder.emitHalt(HALT_BLOCK);

    fs.writeFileSync('echo.inc', builder.build());
    console.log("IR Building complete. Native binary forged.");
}
main();
