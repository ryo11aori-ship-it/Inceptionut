const fs = require('fs');

function main() {
    console.log("Inceptionut Stage-2 Compiler (The Absolute Void)");
    let invisibleMap = ["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    
    // The Absolute Void
    // 100要素の空間を1ビットの無駄もなく、完璧な幾何学とトランポリンで制御する神の配列
    let binary = [
        // Block 0: Bootloader (0を排除してBig Bangを着火し、[2,1]へ飛ぶ)
        9, 1, 9, 1, 2, 1, 5, 5, 5, 5,
        
        // Block 1: Slingshot ([2,1]で受け止め、zeroを初期化して[0,2]へ射出)
        0, 9, 0, 9, 0, 2, 0, 0, 0, 0,
        
        // Block 2: Clear t1 (t1=[-IN] を初期化して[0,3]へ)
        2, 9, 2, 9, 0, 3, 0, 0, 0, 0,
        
        // Block 3: Clear t2 (t2=[+IN] を初期化して[0,4]へ)
        4, 9, 4, 9, 0, 4, 0, 0, 0, 0,
        
        // Block 4: IN t1 (文字なら[0,5]へ。EOFなら暴走して[9,9]の無限ループでHalt)
        9, 9, 2, 9, 0, 5, 0, 9, 0, 9,
        
        // Block 5: Copy t1 to t2 & Triple Trampoline
        // t2を+65に反転し、暴走するPCを[0,9]の変数空間へ強制着地させる
        2, 9, 4, 9, 0, 9, 0, 9, 9, 0,
        
        // Block 6: OUT t2 (反転した+65を出力し、結果が負になるため安全に[0,0]へ戻る)
        4, 9, 9, 9, 0, 0, 0, 0, 0, 0,
        
        // Block 7, 8: 余白 (通過しない安全地帯)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        
        // Block 9: Variable Area & Redirector
        // [0,9]=zero, [2,9]=t1, [4,9]=t2.
        // PCが[0,9]に飛んできた場合、[0,0] [0,0] [0,6]と解釈され、OUTブロックへ飛ぶ
        0, 0, 0, 0, 0, 6, 0, 0, 0, 0
    ];

    let finalOut = "";
    for (let i = 0; i < binary.length; i++) {
        finalOut += invisibleMap[binary[i]];
    }
    
    fs.writeFileSync('out.inut', finalOut);
    console.log("Compilation successful. The Absolute Void has been reached.");
}
main();
