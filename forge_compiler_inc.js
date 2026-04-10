const fs = require('fs');

function buildCompiler() {
    let code = [], labels = {}, pc = 10;
    function label(n) { labels[n] = pc; }
    function emit(a, b, c) { code.push({a, b, c, addr: pc}); pc += 3; }

    // 0~9のメモリ領域を変数として使用
    let ZERO=0, CHAR=1, T1=2, T2=3, C_TAB=4, C_SPACE=5, OUT_VAL=6;

    label('LOOP');
    emit(CHAR, CHAR, pc+3);
    emit(999, CHAR, 'HAS_CHAR'); // 入力を読み込む。EOF(-1)ならHALTへ落下、文字ならHAS_CHARへジャンプ
    label('HALT');
    emit(ZERO, ZERO, 9999);

    label('HAS_CHAR');
    emit(T1, T1, pc+3);
    emit(CHAR, T1, pc+3);
    emit(C_TAB, T1, 'CHK_GE_9'); // 入力がTab(9)か判定
    emit(ZERO, ZERO, 'NOT_TAB');

    label('CHK_GE_9');
    emit(T2, T2, pc+3);
    emit(C_TAB, T2, pc+3);
    emit(CHAR, T2, 'IS_TAB');
    emit(ZERO, ZERO, 'NOT_TAB');

    label('IS_TAB');
    emit(OUT_VAL, OUT_VAL, pc+3);
    emit(C_TAB, OUT_VAL, pc+3);
    emit(OUT_VAL, 999, 'LOOP'); // Tabを標準出力へ書き出す

    label('NOT_TAB');
    emit(T1, T1, pc+3);
    emit(CHAR, T1, pc+3);
    emit(C_SPACE, T1, 'CHK_GE_32'); // 入力がSpace(32)か判定
    emit(ZERO, ZERO, 'LOOP'); // SpaceでもTabでもない文字(改行など)は無視してLOOPへ！

    label('CHK_GE_32');
    emit(T2, T2, pc+3);
    emit(C_SPACE, T2, pc+3);
    emit(CHAR, T2, 'IS_SPACE');
    emit(ZERO, ZERO, 'LOOP');

    label('IS_SPACE');
    emit(OUT_VAL, OUT_VAL, pc+3);
    emit(C_SPACE, OUT_VAL, pc+3);
    emit(OUT_VAL, 999, 'LOOP'); // Spaceを標準出力へ書き出す

    // メモリ初期化
    let mem = new Array(pc).fill(0);
    mem[ZERO] = 0; mem[C_TAB] = 9; mem[C_SPACE] = 32;

    for (let inst of code) {
        mem[inst.addr] = typeof inst.a === 'string' ? labels[inst.a] : inst.a;
        mem[inst.addr+1] = typeof inst.b === 'string' ? labels[inst.b] : inst.b;
        mem[inst.addr+2] = typeof inst.c === 'string' ? labels[inst.c] : inst.c;
    }

    // 不可視文字へのエンコード
    let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
    let out = "";
    for (let i = 0; i < pc; i+=3) {
        for(let j=0; j<3; j++) {
            if(i+j >= pc) break;
            let v = (mem[i+j] % 1000 + 1000) % 1000;
            let s = ("000" + v).slice(-3);
            out += im[parseInt(s[0])] + im[parseInt(s[1])] + im[parseInt(s[2])];
        }
        out += "\n"; // 構造を示すための「改行」。これがコンパイル時に削ぎ落とされる！
    }
    fs.writeFileSync('compiler.inc', out);
}
buildCompiler();

// compiler.incと全く同じ「改行を削ぎ落とす」論理を持つ、初期ブート用JSコンパイラ
let js = `const fs=require('fs');
let s=fs.readFileSync(process.argv[2],'utf8');
let o="";
for(let i=0;i<s.length;i++){if(s[i]===' '||s[i]==='\\t')o+=s[i];}
fs.writeFileSync(process.argv[3],o);`;
fs.writeFileSync('compiler.js', js);

console.log("The Pure Invisible Compiler Forged.");
