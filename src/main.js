import './css/demo.less'
import './css/demo.css'
import treeShaking from './js/treeShaking'
function sum (a,b) {
    console.log(a + b);
}

sum(1,2);

treeShaking.isUse();

document.body.innerHTML = '<div>123456</div>'