var fruits, text, fLen, i;

var fruits, text, fLen, i;

fruits = ["Banana", "Orange", "Apple", "Mango"];
fLen = fruits.length;
text="";
for (i = 0; i < fLen; i++) {
    text = text + fruits[i] + "\n";
}

document.getElementById("demo").innerHTML = text;
