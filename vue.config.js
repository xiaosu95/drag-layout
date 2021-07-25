// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
function _resovle(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("@", _resovle("packages"));
    config.resolve.alias.set("@@", _resovle("src"));
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true
      });
  },
  publicPath: "/example/drag-layout",
  configureWebpack: {
    output: {
      libraryExport: "default"
    }
  }
};
