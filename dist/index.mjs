var e=require("iconv").Iconv,r={"^L":"CP1252","^G":"CP1253","^C":"CP1251","^E":"CP1250","^T":"CP1254","^B":"CP1257","^J":"CP932","^H":"CP950","^S":"CP936","^K":"CP949","^8":"CP1252"},n={"^v":"|","^a":"*","^c":":","^d":"\\","^s":"/","^q":"?","^t":'"',"^l":"<","^r":">","^h":"#","^^":"^"},c=function(e,r){switch(e){case"^L":case"^8":case"^G":case"^C":case"^E":case"^T":case"^B":return!1;case"^J":return r>128&&r<160||r>=224&&r<253;case"^H":case"^S":case"^K":return r>128&&r<255;default:throw new Error("Unknown Codepage: "+r)}};module.exports=function(t){for(var s=Buffer.from(t),o="^L",a="",i=0,C=0,l=new e(r[o],"UTF-8"),P=0;P<=s.length;P++)if(P===s.length||0===s[P])i<C&&(a+=l.convert(s.slice(i,C)).toString()),P=s.length;else if(c(o,s[P]))C+=2,P++;else if(94===s[P]){var f="^"+l.convert(s.slice(P+1,P+2));r.hasOwnProperty(f)?(l=new e(r[o=f],"UTF-8"),i<C&&(a+=l.convert(s.slice(i,C)).toString()),i=56===s[P+1]?P:P+2,C=P+2,P++):(C+=2,P++)}else C++;for(var u in n)a=a.split(u).join(n[u]);return a};
//# sourceMappingURL=index.mjs.map
