var fs = require('fs')
var path = require('path')

var sourcePath = path.resolve('./src/components/')
var targetPath = path.resolve('./docs/components')
const pages = path.resolve('./src/pages')

const sidebarObj = require(path.join(path.resolve('./docs/.vuepress/components'), 'sidebar.js'))
let sidebarArr = []
for (let i in sidebarObj) {
  sidebarArr = sidebarArr.concat(sidebarObj[i])
}
let componentsArr = []
sidebarArr.map((name)=> {
  name = name.replace(/([A-Z])/g,"-$1").toLowerCase().substring(1)
  componentsArr.push(name)
})
/* 生成site的README.md */
fs.access(path.resolve('./introduce.md'), (err) => {
  if (err) throw err
  fs.readFile(path.resolve('./introduce.md'), (err, data) => {
    if (err) throw err
    let introContent = `${data}
<StyleCom />`
    fs.writeFile(path.join(targetPath, 'README.md'), introContent, (err) => {
      if (err) throw err
    })
  })
})

function syncFiles (sourcePath, targetPath, fileName = '') {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath)
  }
  fs.readdir(sourcePath, function (err, paths) {
    if (err) {
      console.log('读取文件夹出错')
    }
    paths.map(_p => {
      if (!/\./.test(_p)) { // 如果是文件夹
        return syncFiles(path.join(sourcePath, _p), targetPath, _p)
      }
      if (!/\.md/.test(_p)) {
        return
      }
      // var readstream = fs.createReadStream(path.join(sourcePath, _p))
      let mdContent = ''
      fs.readFile(path.join(sourcePath, _p), 'utf-8', (err, data) => {
        if (err) {
          throw(err)
        }
        let index = data.indexOf('### props') === -1 ? data.indexOf('### Props') : data.indexOf('### props')
        let data1 = data.substring(0, index)
        let data2 = data.substring(index, data.length)
        let vueContent = ''

        let pageName = ''
        fileName.split('-').map(i => {
          pageName += i.substring(0, 1).toUpperCase() + i.substring(1)
        })
        if (componentsArr.indexOf(fileName) !== -1) {
          vueContent = fs.readFileSync(path.join(pages, `${pageName}.vue`), 'utf-8')
        }
        let vueContentMd = '#### Code Example\n```vue\n' + vueContent + '\n```'
        mdContent = `${data1}
${vueContentMd}
${data2}
<Demo url="https://ladybirddev.github.io/ui-nuclear-mobile-demo/#/${fileName}" />`
        if (fileName.indexOf('mobile-') === -1) { // 移除mobile组件
          fs.writeFile(path.join(targetPath, `${pageName}.md`), mdContent, () => {})
        }

      })
      // var writestream = fs.createWriteStream(path.join(targetPath, fileName + '.md'))
      // readstream.pipe(writestream)
    })
  })
}
syncFiles(sourcePath, targetPath)
