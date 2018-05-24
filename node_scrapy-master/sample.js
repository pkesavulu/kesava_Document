var [a,b,c]=" AMMA,\nBABA,cat:,D-DDD,\ncEEE ".trim().split('c').map(st=>(st || '').split("\n").filter(s=>",").join(' '));

console.log([a,b]);



