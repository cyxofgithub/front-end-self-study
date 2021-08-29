class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;

        //保存 options参数,后面处理数据要用到
        this.$options = options;

        // 如果这个根元素存在则开始编译模板
        if (this.$el) {

            // 1.实现一个指令解析器compile
            new Compile(this.$el, this)
        }
    }
}

class Compile{
    constructor(el,vm) {

        // 判断el参数是否是一个元素节点,如果是直接赋值,如果不是 则获取赋值
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        /**
         *  这样外界可以这样操作
         *  let vm = new Vue({
                el:'#app'
            })
            //or
            let vm = new Vue({
                el:document.getElementById('app')
            })
        **/

        // 因为每次匹配到进行替换时都要重新渲染一遍,会导致页面的回流和重绘,影响页面的性能
        // 所以需要创建文档碎片来进行缓存,减少页面的回流和重绘
        // 1.获取文档碎片对象
        const fragment = this.node2Fragment(this.el);
        console.log(fragment);
        // 2.编译模板
        // 3.把子元素的所有内容添加到根元素中
        // 4.这时候会发现页面跟之前没有任何变化,但是经过Fragment的处理,优化页面渲染性能
        this.el.appendChild(fragment);
                
    }

    // 生产文档碎片
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let firstChild;
        console.log(el.firstChild);

        while (firstChild = el.firstChild) {

            // 将节点剪切到 fragment 中
            fragment.appendChild(firstChild);
        }
        console.log(fragment);

        return fragment
    }

    isElementNode(node){

        // 判断是否是元素节点
        return node.nodeType === 1
    }
}