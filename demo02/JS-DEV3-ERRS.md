####关于JavaScript高级程序设计（第3版）发现的错误####

章节名：第12章 DOM2和DOM3
页码：第339页 2017-11-07 20:41:11

检测某个范围是否处于折叠状态，可以帮助我们确定范围中的两个节点是否紧密相邻。栗子有误
`range.setStartBefore(p2)需要改成range.setEndBefore(p2)。`

本页还有一处错误，比较方式的常量值`Range.END_TO_START(3)`是用于比较第一个范围的终点和第二个范围的起点。
`alert(range1.compareBoundaryPoints(Range.END_TO_START,range2));`