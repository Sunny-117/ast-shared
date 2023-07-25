const core = require("@babel/core"); //babel核心模块
// let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions"); //转换箭头函数插件

let sourceCode = `
const sum = (a, b) => {
    return a + b;
};
`;

const arrowFunctionPlugin = {
  visitor: {
    ArrowFunctionExpression: (path) => {
      let { node } = path;
      node.type = "FunctionExpression";
    },
  },
};
let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin], //使用插件
});

console.log(targetSource.code);
