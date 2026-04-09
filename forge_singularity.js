const fs=require('fs');
function encodeBase10(mem,len){
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let out="";
for(let i=0;i<len;i++){
let s=("00000"+mem[i]).slice(-5);
for(let j=0;j<5;j++)out+=im[parseInt(s[j])];
}
return out;
}
function buildCompiler(){
let code=[],labels={},pc=0;
function label(n){labels[n]=pc;}
function emit(a,b,c){code.push({a,b,c,addr:pc});pc+=3;}
label('START');
emit('CONST_32','NEG_32',pc+3);
emit('CONST_9','NEG_9',pc+3);
emit('CONST_48','NEG_48',pc+3);
emit('NEG_48','POS_48',pc+3);
label('LOOP_START');
emit('TEMP','TEMP',pc+3);
emit(65535,'TEMP','L_EOF');
emit('ZERO','ZERO','L_EOF_HALT');
label('L_EOF');
emit('TARGET','TARGET',pc+3);
emit('TEMP','TARGET',pc+3);
emit('POS_48','TARGET',pc+3);
emit('TEMP','TEMP',pc+3);
let cy_addr=pc+6;
emit(cy_addr,cy_addr,pc+3);
emit('TARGET','TEMP',pc+3);
emit('TEMP',cy_addr,pc+3);
emit('ZERO','ZERO','JUMP_TABLE');
label('JUMP_TABLE');
for(let d=0;d<10;d++)emit('ZERO','ZERO',`BLOCK_${d}`);
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
for(let d=0;d<10;d++){
label(`BLOCK_${d}`);
let chars=im[d];
for(let i=0;i<4;i++){
let val=chars[i]===' '?'NEG_32':'NEG_9';
emit(val,65535,pc+3);
}
emit('ZERO','ZERO','LOOP_START');
}
label('L_EOF_HALT');
emit('ZERO','ZERO',65535);
label('CONST_32');emit(32,0,0);
label('CONST_9');emit(9,0,0);
label('CONST_48');emit(48,0,0);
label('NEG_32');emit(0,0,0);
label('NEG_9');emit(0,0,0);
label('NEG_48');emit(0,0,0);
label('POS_48');emit(0,0,0);
label('TEMP');emit(0,0,0);
label('TARGET');emit(0,0,0);
label('ZERO');emit(0,0,0);
let mem=new Array(pc).fill(0);
for(let i=0;i<code.length;i++){
let inst=code[i];
mem[inst.addr]=typeof inst.a==='string'?labels[inst.a]:inst.a;
mem[inst.addr+1]=typeof inst.b==='string'?labels[inst.b]:inst.b;
mem[inst.addr+2]=typeof inst.c==='string'?labels[inst.c]:inst.c;
}
return encodeBase10(mem,pc);
}
function buildInterpreter(){
let code=[],labels={},pc=0;
function label(n){labels[n]=pc;}
function emit(a,b,c){code.push({a,b,c,addr:pc});pc+=3;}
function SUB(d,s){emit(s,d,pc+3);}
function ADD(d,s){SUB('T_A','T_A');SUB('T_A',s);SUB(d,'T_A');}
function MOV(d,s){SUB(d,d);SUB('T_M','T_M');SUB('T_M',s);SUB(d,'T_M');SUB('T_M','T_M');}
function JEQ(v,t){
let lp=`JP_${pc}`,ln=`JN_${pc}`;
SUB('T_J1','T_J1');emit(v,'T_J1',lp);emit('ZERO','ZERO',ln);
label(lp);SUB('T_J2','T_J2');emit('T_J1','T_J2',t);label(ln);
}
label('START');
SUB('MINUS_ONE','MINUS_ONE');SUB('MINUS_ONE','CONST_1');
SUB('NEG_65535','NEG_65535');SUB('NEG_65535','CONST_65535');
label('LOOP_START');
SUB('DUMMY','DUMMY');ADD('DUMMY','G_PC');ADD('DUMMY','NEG_65535');JEQ('DUMMY',65535);
let smc_fa=pc+15;MOV(smc_fa,'G_PC');emit(0,'TEMP',pc+3);
SUB('A_ADDR','A_ADDR');SUB('A_ADDR','TEMP');SUB('TEMP','TEMP');SUB('G_PC','MINUS_ONE');
let smc_fb=pc+15;MOV(smc_fb,'G_PC');emit(0,'TEMP',pc+3);
SUB('B_ADDR','B_ADDR');SUB('B_ADDR','TEMP');SUB('TEMP','TEMP');SUB('G_PC','MINUS_ONE');
let smc_fc=pc+15;MOV(smc_fc,'G_PC');emit(0,'TEMP',pc+3);
SUB('C_ADDR','C_ADDR');SUB('C_ADDR','TEMP');SUB('TEMP','TEMP');SUB('G_PC','MINUS_ONE');
let ex_a=pc+33,ex_b=pc+34;
MOV(ex_a,'A_ADDR');MOV(ex_b,'B_ADDR');
emit('ZERO','ZERO',ex_a);
emit(0,0,'B_TAKEN');
label('B_NOT_TAKEN');emit('ZERO','ZERO','LOOP_START');
label('B_TAKEN');MOV('G_PC','C_ADDR');emit('ZERO','ZERO','LOOP_START');
label('G_PC');emit(10000,0,0);
label('TEMP');emit(0,0,0);label('T_A');emit(0,0,0);label('T_M');emit(0,0,0);
label('T_J1');emit(0,0,0);label('T_J2');emit(0,0,0);label('DUMMY');emit(0,0,0);
label('A_ADDR');emit(0,0,0);label('B_ADDR');emit(0,0,0);label('C_ADDR');emit(0,0,0);
label('MINUS_ONE');emit(0,0,0);label('NEG_65535');emit(0,0,0);
label('CONST_1');emit(1,0,0);label('CONST_65535');emit(65535,0,0);
label('ZERO');emit(0,0,0);
let mem=new Array(pc).fill(0);
for(let i=0;i<code.length;i++){
let inst=code[i];
mem[inst.addr]=typeof inst.a==='string'?labels[inst.a]:inst.a;
mem[inst.addr+1]=typeof inst.b==='string'?labels[inst.b]:inst.b;
mem[inst.addr+2]=typeof inst.c==='string'?labels[inst.c]:inst.c;
}
return encodeBase10(mem,pc);
}
let vmCode=`const fs=require('fs');
let mem=new Int32Array(65536);
function load(f,o){
if(!fs.existsSync(f))return;
let rc=fs.readFileSync(f,'utf8');
let cc="";
for(let i=0;i<rc.length;i++){if(rc[i]===' ')cc+="0";if(rc[i]==='\\t')cc+="1";}
let nb=[];
for(let i=0;i<cc.length;i+=4){
let b=cc.substring(i,i+4),v=0;
if(b[0]==='1')v+=8;if(b[1]==='1')v+=4;if(b[2]==='1')v+=2;if(b[3]==='1')v+=1;nb.push(v);
}
for(let i=0;i<nb.length;i+=5){
let v=0;for(let j=0;j<5;j++)v=v*10+(nb[i+j]||0);mem[o+Math.floor(i/5)]=v;
}
}
function main(){
load(process.argv[2],0);
if(process.argv[3])load(process.argv[3],10000);
let pc=0;
while(true){
if(pc>=65535||pc<0)break;
let a=mem[pc],b=mem[pc+1],c=mem[pc+2];
let va=(a===65535)?readIO():mem[a];
let vb=(b===65535)?0:mem[b];
let r=vb-va;
if(b===65535)writeIO(r);else mem[b]=r;
if(r<=0){if(pc===c)break;pc=c;}else{pc+=3;}
}
}
function readIO(){
let b=Buffer.alloc(1);
try{if(fs.readSync(0,b,0,1,null)===0)return -1;return b[0];}catch(e){return -1;}
}
function writeIO(v){try{fs.writeSync(1,Buffer.from([v&255]));}catch(e){}}
main();`;
fs.writeFileSync('stub_vm.js',vmCode);
fs.writeFileSync('encoder.inc',buildCompiler());
fs.writeFileSync('interpreter.inc',buildInterpreter());
console.log("The Singularity Forge Complete.");
