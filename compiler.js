const fs=require('fs');
function main(){
let im=["    ","   \t","  \t ","  \t\t"," \t  "," \t \t"," \t\t "," \t\t\t","\t   ","\t  \t"];
let rm={};for(let i=0;i<10;i++)rm[im[i]]=i;
let s;try{s=fs.readFileSync(process.argv[2],'utf8');}catch(e){return;}
let t=[];for(let i=0;i<s.length;i+=4){let c=s.substr(i,4);if(rm[c]!==undefined)t.push(rm[c]);}
let o=[],pc=0;
let r=()=>{if(t.length<3)return 0;let v=t.shift()+t.shift()*10+t.shift()*100;return v;};
while(t.length>0){
let op=t.shift();
if(op===0){o.push(r(),r(),r());pc+=3;}
else if(op===1){let a=r();o.push(a,a,pc+3);pc+=3;}
else if(op===2){let c=r();o.push(900,900,c);pc+=3;}
}
let os="";
for(let i=0;i<o.length;i++){
let v=(o[i]%1000+1000)%1000;
os+=im[v%10]+im[Math.floor((v/10)%10)]+im[Math.floor(v/100)];
}
fs.writeFileSync(process.argv[3],os);
console.log("Compilation complete: "+process.argv[3]);
}
main();
