const fs = require('fs');

class Dim1EncoderBuilder {
    constructor() {
        this.u = Array(10).fill(0).map(() => Array(10).fill(0));
        this.im = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
        this.currentSlot = 0;
        this.currentY = 1;
        this.slotX = [1, 7, 3, 9, 5];
    }
    
    emit(A, B, C) {
        let x = this.slotX[this.currentSlot];
        let y = this.currentY;
        this.u[y][(x)%10] = A[0]; this.u[y][(x+1)%10] = A[1];
        this.u[y][(x+2)%10] = B[0]; this.u[y][(x+3)%10] = B[1];
        
        let nextSlot = (this.currentSlot + 1) % 5;
        let nextY = this.currentY;
        if (nextSlot === 0) {
            nextY++;
            if (nextY === 4) nextY = 7; // Y=4,5,6 は出力用辞書として予約
        }
        
        let cx = C ? C[0] : this.slotX[nextSlot];
        let cy = C ? C[1] : nextY;
        this.u[y][(x+4)%10] = cx; this.u[y][(x+5)%10] = cy;
        
        let instInfo = { cx_addr: [(x+4)%10, y], cy_addr: [(x+5)%10, y] };
        this.currentSlot = nextSlot;
        this.currentY = nextY;
        return instInfo;
    }

    build() {
        let o = "";
        for(let y=0; y<10; y++) {
            for(let x=0; x<10; x++) {
                o += this.im[this.u[y][x]];
            }
        }
        fs.writeFileSync('encoder.inc', o);
        console.log("The True Dim 1 Encoder forged.");
    }
}

function main() {
    let b = new Dim1EncoderBuilder();
    
    // ==========================================
    // 1. Big Bang Header (Dim 0 を飽和させ Dim 1 へ拡張)
    // ==========================================
    for (let i=0; i<10; i++) b.u[0][i] = 1;

    // ==========================================
    // 2. 変数・定数領域 (Y=8 に配置)
    // ==========================================
    let C8 = [0, 8]; b.u[8][0] = 8;
    let C9 = [1, 8]; b.u[8][1] = 9;
    let C5 = [7, 8]; b.u[8][7] = 5;
    
    let V_NEG32 = [2, 8]; let V_NEG9  = [3, 8]; let V_NEG48 = [4, 8];
    let TEMP    = [5, 8]; let ZERO    = [6, 8]; let V_NEG5  = [8, 8];
    let I_O     = [9, 9];

    // ==========================================
    // 3. 定数生成 (実行時ビルド)
    // ==========================================
    b.emit(C5, V_NEG5); // -5
    b.emit(C9, V_NEG9); // -9
    for(let i=0; i<4; i++) b.emit(C8, V_NEG32); // -32 (Space)
    for(let i=0; i<6; i++) b.emit(C8, V_NEG48); // -48 (ASCII_0)

    // ==========================================
    // 4. メインループ (IN & 動的ジャンプ)
    // ==========================================
    let loop_start_x = b.slotX[b.currentSlot];
    let loop_start_y = b.currentY;

    b.emit(TEMP, TEMP);      // TEMP = 0
    b.emit(V_NEG48, TEMP);   // TEMP = 48
    
    let in_inst = b.emit(I_O, TEMP, [0, 0]); // TEMP = 48 - IN

    // EOF時 (フォールスルー先) -> 無限ループで安全にHalt
    let halt_x = b.slotX[b.currentSlot];
    let halt_y = b.currentY;
    b.emit(ZERO, ZERO, [halt_x, halt_y]); 

    // IN命令のジャンプ先を上書き (文字入力時は次の命令へ飛ぶ)
    b.u[in_inst.cy_addr[1]][in_inst.cy_addr[0]] = b.currentY;
    b.u[in_inst.cx_addr[1]][in_inst.cx_addr[0]] = b.slotX[b.currentSlot];

    // 動的ジャンプ命令の配置先を計算 (4命令後)
    let dyn_slot = (b.currentSlot + 3) % 5;
    let dyn_y = b.currentY;
    if (b.currentSlot + 3 >= 5) {
        dyn_y++;
        if (dyn_y === 4) dyn_y = 7;
    }
    let dyn_x = b.slotX[dyn_slot];
    let CY_ADDR = [(dyn_x + 5) % 10, dyn_y];

    // 動的ジャンプ先のY座標を計算: CY_ADDR = 5 - (48 - IN)
    b.emit(CY_ADDR, CY_ADDR); // CY_ADDR = 0
    b.emit(V_NEG5, CY_ADDR);  // CY_ADDR = 5
    b.emit(TEMP, CY_ADDR);    // CY_ADDR = 5 - TEMP 

    // 動的ジャンプ実行
    b.emit(ZERO, ZERO, [1, 0]); // X=1, Yは自己書き換えにより 5, 6, 4(ドーナツ) へ分岐！

    // ==========================================
    // 5. 出力ディスパッチ辞書 (Y=4, 5, 6)
    // ==========================================
    // '9' (ASCII 57) -> 5 - (48 - 57) = 14 -> Y=4 (ドーナツループ)
    b.currentY = 4; b.currentSlot = 0;
    b.emit(V_NEG9, I_O); b.emit(V_NEG32, I_O); b.emit(V_NEG9, I_O); b.emit(V_NEG9, I_O);
    b.emit(ZERO, ZERO, [loop_start_x, loop_start_y]); // Main Loopへ戻る

    // '0' (ASCII 48) -> 5 - (48 - 48) = 5 -> Y=5
    b.currentY = 5; b.currentSlot = 0;
    b.emit(V_NEG32, I_O); b.emit(V_NEG32, I_O); b.emit(V_NEG32, I_O); b.emit(V_NEG32, I_O);
    b.emit(ZERO, ZERO, [loop_start_x, loop_start_y]);

    // '1' (ASCII 49) -> 5 - (48 - 49) = 6 -> Y=6
    b.currentY = 6; b.currentSlot = 0;
    b.emit(V_NEG32, I_O); b.emit(V_NEG32, I_O); b.emit(V_NEG32, I_O); b.emit(V_NEG9, I_O);
    b.emit(ZERO, ZERO, [loop_start_x, loop_start_y]);

    b.build();
}
main();
