

1.What is the difference between var, let, and const?
Ans: a.var: Old school. It’s function-scoped and can be re-declared, which often leads to messy bugs.
b.let: Modern and block-scoped. It can update the value, but it can’t re-declare it in the same block.
c.const: Short for constant. Once it's set the value, it’s locked. You can't re-assign or re-declare it.


2.What is the spread operator(...) ?
Ans:It "unpacks" elements.Use it to quickly copy an array/object or merge multiple ones into one without complex loops.


3.What is the difference between map(), filter(), and forEach()?
Ans: a.forEach(): Just a basic loop to run a function on every item. Returns nothing.
b.map(): Transforms every item and returns a new array of the same length.
c.filter(): Sifts through the data and returns a new array with only the items that meet a specific condition.


4.What is an arrow function?
Ans:A shorter way to write functions using => .It’s cleaner to read and handles the this keyword more predictably than regular functions.


5.What are template literals?
Ans:Writing strings using backticks (``) instead of quotes.It lets you drop variables directly into a string using ${variable} and supports multi-line text naturally.
