# webpack的学习及使用

### 1. webpack的安装

### 2. webpack的核心概念学习
    - 虽然最新版的webpack支持无配置工作，但是在真正的开发中，配置文件的重要性不言而喻。
    - webpack是基于nodejs的，遵循CommonJS
    - webpack是一个静态模块打包器，把一切文件看作模块

    1. 入口 entry
        - 单入口写成entry: string即可
        - 多入口将entry写成对象的形式，键值对分别为name和path
    2. 输出 output
        - filename属性的值可以写成 [name][hash:8].js
    3. 模式 mode
    development或者production
    4. 插件 plugin
    5. loader 
        1. 处理less文件