var e={"^L":"CP1252","^G":"CP1253","^C":"CP1251","^E":"CP1250","^T":"CP1254","^B":"CP1257","^J":"shift-jis","^H":"big5","^S":"gbk","^K":"euc-kr","^8":"CP1252"},r={"^v":"|","^a":"*","^c":":","^d":"\\","^s":"/","^q":"?","^t":'"',"^l":"<","^r":">","^h":"#"},a=function(e,r){switch(e){case"^L":case"^8":case"^G":case"^C":case"^E":case"^T":case"^B":return!1;case"^J":return r>128&&r<160||r>=224&&r<253;case"^H":case"^S":case"^K":return r>128&&r<255;default:throw new Error("Unknown Codepage: "+r)}};function c(c){var n;n="string"==typeof c?new Uint8Array(c.split("").map(function(e){return e.charCodeAt(0)})):c;for(var t="^L",s="",l=0,o=0,i=new TextDecoder(e[t]),d=0;d<=n.length;d++)if(d===n.length||0===n[d])l<o&&(s+=i.decode(n.slice(l,o))),d=n.length;else if(a(t,n[d]))o+=2,d++;else if(94===n[d]){var f="^"+i.decode(n.slice(d+1,d+2));e.hasOwnProperty(f)?(l<o&&(s+=i.decode(n.slice(l,o))),t=f,i=new TextDecoder(e[t]),l=56===n[d+1]?d:d+2,o=d+2,d++):(o+=2,d++)}else o++;for(var u in r){var C=new RegExp("(?<!\\^)\\"+u,"g");s=s.replaceAll(C,r[u])}return s.replaceAll("^^","^")}export{c as default};
//# sourceMappingURL=index.esm.js.map
