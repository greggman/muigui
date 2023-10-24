import {
  Column,
  Frame,
  Grid,
  Row,
} from '../../src/muigui.js';

const elem = document.querySelector('#ui');


const root = new Column();
const topRow = root.add(new Row());
const midRow = root.add(new Row());
const botRow = root.add(new Row());

/*

+-[Column]----
|+-[Row]------------------------
||+-[Frame(fixed)]-++-[Frame(stretch-h)]-
|||                ||
||+-- 
|
+---


topRow.add(new Frame({size: [1, 1]}));
topRow.add(new Frame({size: [1, 1]}));
head.add(new )

*/
