const e=require("iconv").Iconv,r={"^L":"CP1252","^G":"CP1253","^C":"CP1251","^E":"CP1250","^T":"CP1254","^B":"CP1257","^J":"CP932","^H":"CP950","^S":"CP936","^K":"CP949","^8":"CP1252"},t={"^v":"|","^a":"*","^c":":","^d":"\\","^s":"/","^q":"?","^t":'"',"^l":"<","^r":">","^h":"#","^^":"^"},n=(e,r)=>{switch(e){case"^L":case"^8":case"^G":case"^C":case"^E":case"^T":case"^B":return!1;case"^J":return r>128&&r<160||r>=224&&r<253;case"^H":case"^S":case"^K":return r>128&&r<255;default:throw new Error(`Unknown Codepage: ${r}`)}};module.exports=function(c){let s=Buffer.from(c),o="^L",l="",a=0,i=0,C=new e(r[o],"UTF-8");for(let t=0;t<=s.length;t++)if(t===s.length||0===s[t])a<i&&(l+=C.convert(s.slice(a,i)).toString()),t=s.length;else if(n(o,s[t]))i+=2,t++;else if(94===s[t]){let n=`^${C.convert(s.slice(t+1,t+2))}`;r.hasOwnProperty(n)?(o=n,C=new e(r[o],"UTF-8"),a<i&&(l+=C.convert(s.slice(a,i)).toString()),a=56===s[t+1]?t:t+2,i=t+2,t++):(i+=2,t++)}else i++;for(let e in t)l=l.split(e).join(t[e]);return l};
//# sourceMappingURL=index.esm.mjs.map
