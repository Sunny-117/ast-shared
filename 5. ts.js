const core = require("@babel/core");
const fs = require("fs");
const originSourceCode = fs.readFileSync("./test.ts", "utf8");

const TypeAnnotationMap = {
  TSNumberKeyword: "NumericLiteral",
  TSBooleanKeyword: "BooleanLiteral",
  TSStringKeyword: "StringLiteral",
  TSNullKeyword: "NullLiteral",
  TSObjectKeyword: "ObjectExpression",
  TSTypeReference: "ArrayExpression",
};

const myTsCheckPlugin = {
  pre(file) {
    file.set("errors", []);
  },
  visitor: {
    VariableDeclarator(path, state) {
      const errors = state.file.get("errors");
      const { node } = path;
      //第一步：获取拿到声明的类型
      const idType =
        TypeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type]; //拿到声明的类型 TSNumberKeyword
      //第二步：获取真实值的类型
      const initType = node.init.type;
      //第三步：比较声明的类型和值的类型是否相同
      if (idType !== initType) {
        errors.push(
          path
            .get("init")
            .buildCodeFrameError(
              `无法把${initType}类型赋值给${idType}类型`,
              Error
            )
        );
      }
    },
  },
  post(file) {
    console.log(...file.get("errors"));
  },
};

let targetSource = core.transform(originSourceCode, {
  parserOpts: { plugins: ["typescript"] }, //解析的参数，这样才能识别ts语法
  plugins: [myTsCheckPlugin], //使用插件
});

console.log(targetSource.code);
