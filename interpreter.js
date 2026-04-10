const fs=require('fs');
let mem=new Int32Array(1000);
function r(a){
if(a===999){
let b=Buffer.alloc(1);
try{if(fs.readSync(0,b,0,1,null)===0)return -1;return b[0];}catch(e){return -1;}
}
return mem[(a%1000+1000)%1000];
}
function w(a,v){
if(a===999){
try{fs.writeSync(1,Buffer.from([v&255]));}catch(e){}
}else{
mem[(a%1000+1000)%1000]=v;
}
}
function main(){
let rc;
try{rc=fs.readFileSync(process.argv[2]||'encoder.inc','utf8');}catch(e){console.log("Failed to load native binary.");return;}
let cc="";
for(let i=0;i<rc.length;i++){
if(rc[i]===' '||rc[i]==='S')cc+="0";
if(rc[i]==='\t'||rc[i]==='T')cc+="1";
}
for(let i=0;i<cc.length;i+=4){
let b=cc.substring(i,i+4);
let v=0;
if(b[0]==='1')v+=8;if(b[1]==='1')v+=4;if(b[2]==='1')v+=2;if(b[3]==='1')v+=1;
mem[Math.floor(i/4)%1000]=v;
}
let pc=0;
let c=0;
console.log("Starting Subleq Execution Loop...");
while(c++<99999){
let ax=r(pc),ay=r(pc+1),az=r(pc+2),bx=r(pc+3),by=r(pc+4),bz=r(pc+5),cx=r(pc+6),cy=r(pc+7),cz=r(pc+8);
let aa=ax===9&&ay===9&&az===9?999:ax+ay*10+az*100;
let ab=bx===9&&by===9&&bz===9?999:bx+by*10+bz*100;
let ac=cx===9&&cy===9&&cz===9?999:cx+cy*10+cz*100;
let va=r(aa);
let vb=ab===999?0:r(ab);
let res=vb-va;
w(ab,res);
if(res<=0){
if(pc===ac){console.log("Halt Condition Reached.");break;}
pc=ac;
}else{
pc=(Math.floor(pc/10)*10+10)%1000;
}
}
}
main();