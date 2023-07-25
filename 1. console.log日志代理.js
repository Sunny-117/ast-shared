const traverse = require("@babel/core").traverse;
const parse = require("@babel/core").parse;
const generator = require("@babel/generator");
const t = require("@babel/types");
function compile(code) {
  // 1. 解析
  const ast = parse(code);
  // 2. 遍历
  const visitor = {
    // 找到所有的console.log()
    // console.log是调用
    // isMemberExpression： 对象值的访问
    CallExpression(path) {
      const { callee } = path.node;
      if (
        t.isMemberExpression(callee) &&
        callee.object.name === "console" &&
        callee.property.name === "log"
      ) {
        const funcPath = path.findParent((p) => {
          // 是函数声明
          return p.isFunctionDeclaration();
        });
        path.node.arguments.unshift(
          t.stringLiteral(`[${funcPath.node.id.name}]`)
        );
      }
    },
  };
  traverse(ast, visitor);
  // 3. 生成代码
  return generator.default(ast, {}, code);
}
const code = `
    function foo() {
        console.log("bar");
    }
`;

const result = compile(code);
console.log(result.code);
