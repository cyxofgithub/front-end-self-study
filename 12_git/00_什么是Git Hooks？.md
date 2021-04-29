#### 什么是Git Hooks？

话说，如同其他许多的版本控制系统一样，Git也具有在特定事件发生**之前**或**之后**执行特定脚本代码功能（从概念上类比，就与监听事件、触发器之类的东西类似）。
 Git Hooks就是那些在Git执行特定事件（如commit、push、receive等）后触发运行的脚本。
 按照Git Hooks脚本所在的位置可以分为两类：
 1.本地Hooks，触发事件如commit、merge等。
 2.服务端Hooks，触发事件如receive等。

#### Git Hooks能做什么？

Git Hooks是定制化的脚本程序，所以它实现的功能与相应的git动作相关；在实际工作中，Git Hooks还是相对比较万能的。下面仅举几个简单的例子：

- pre-commit: 检查每次的commit message是否有拼写错误，或是否符合某种规范。
- pre-receive: 统一上传到远程库的代码的编码。
- post-receive: 每当有新的提交的时候就通知项目成员（可以使用Email或SMS等方式）。
- post-receive: 把代码推送到生产环境。（这就是我想要做的）
   etc...

更多的功能可以按照生产环境的需求写出来。

#### Git Hooks是如何工作的？

每一个Git repo下都包含有.git/hoooks
 这个目录（没错，本地和远程都是这样），这里面就是放置Hooks的地方。你可以在这个目录下自由定制Hooks的功能，当触发一些Git行为时，相应地Hooks将被执行。
 这里是一个Git Hooks列表，现在如果觉得不是很明白，不用担心，以后我会继续讲：
 applypatch-msg
 pre-applypatch
 post-applypatch
 pre-commit
 prepare-commit-msg
 commit-msg
 post-commit
 pre-rebase
 post-checkout
 post-merge
 pre-receive
 update
 post-receive
 post-update
 pre-auto-gc
 post-rewrite

![img](https:////upload-images.jianshu.io/upload_images/2310905-7291f34c886a0528.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

图中是我一个本地repo的git hooks示例。

#### 如何开始使用Git Hooks？

好了，前面啰嗦一大堆，这里才是重点。
 如图中所示的文件，是由本地执行的脚本语言写成的，尽管这些文件默认会是Shell Script，你完全可以给它替换成自己喜欢的Ruby，Python或者Perl。

关于这些脚本文件的命名，细心的读者就会发现图中的文件都是上面Git行为列表中列出的名称加上后缀.sample。没错就是这样，把那些文件的后缀去掉，或者以列表中的名字直接命名，就会把该脚本绑定到特定的Git行为上。
 所以说，Git Hooks的正确操作方式是：写脚本。
 Git Hooks脚本分类
 Git Hooks脚本可以按照运行环境分为两类：本地Hooks与服务端Hooks。

- Client Side
   也就是上面提到的本地hooks。 其实本地hooks还是占大多数的，可以给它们分成三类：
   commit hooks
   e-mail hooks
   其他
- Commit Hooks
   与git commit相关的hooks一共有四个，均由git commit
   命令触发调用，按照一次发生的顺序分别是：
   pre-commit
   prepare-commit-msg
   commit-msg
   post-commit

其中，pre-commit是最先触发运行的脚本。在提交一个commit之前，该hook有能力做许多工作，比如检查待提交东西的快照，以确保这份提交中没有缺少什么东西、文件名是否符合规范、是否对这份提交进行了测试、代码风格是否符合团队要求等等。 这个脚本可以通过传递--no-verify参数而禁用，如果脚本运行失败（返回非零值），git提交就会被终止。
 prepare-commit-msg脚本会在默认的提交信息准备完成后但编辑器尚未启动之前运行。 这个脚本的作用是用来编辑commit的默认提交说明。 该脚本有1~3个参数：包含提交说明文件的路径，commit类型（message, template, merge, squash），一个用于commit的SHA1值。这个脚本用的机会不是太多，主要是用于能自动生成commit message的情况。 不会因为--no-verify参数而禁用，如果脚本运行失败（返回非零值），git提交就会被终止。
 commit-msg
 包含有一个参数，用来规定提交说明文件的路径。 该脚本可以用来验证提交说明的规范性，如果作者写的提交说明不符合指定路径文件中的规范，提交就会被终止。 该脚本可以通过传递--no-verify参数而禁用，如果脚本运行失败（返回非零值），git提交就会被终止。
 post-commit
 脚本发生在整个提交过程完成之后。这个脚本不包含任何参数，也不会影响commit的运行结果，可以用于发送new commit通知。

需要注意到，这几个脚本并不会通过clone传到项目中，而且既然是完全运行在本地，那就无法完全保证验证能起到作用（可以随便修改），但为了保证一些项目的可靠性，还需要开发者们自觉遵守这些规则。

- E-mail Hooks
   与git am
   相关的脚本由三个，均由git am
   触发运行，按顺序依次是：
   applypatch-msg
   pre-applypatch
   post-applypaych

如果在工作流中用不到这个命令，那也就无所谓了。不过，如果要用git format-patch命令通过Email提交补丁，这部分内容还是比较有用的。
 applypatch-msg
 脚本最先被触发，它包含一个参数，用来规定提交说明文件的路径。该脚本可以修改文件中保存的提交说明，以便规范提交说明以符合项目标准。如果提交说明不符合规定的标准，脚本返回非零值，git终止提交。
 说明一点，这个脚本看上去和commit-msg
 作用几乎一样。
 也就是说，该脚本会调用commit-msg并执行。实际上，这一切都是可修改的。
 pre-applypatch
 会在补丁应用后但尚未提交前运行。这个脚本没有参数，可以用于对应用补丁后的工作区进行测试，或对git tree进行检查。如果不能通过测试或检查，脚本返回非零值，git终止提交。 同样需要注意，git提供的此默认脚本中只是简单调用了pre-commit，因此在实际工作中需要视情况修改。
 post-applypatch
 脚本会在补丁应用并提交之后运行，它不包含参数，也不会影响git am的运行结果。该脚本可以用来向工作组成员或补丁作者发送通知。

- 其他Hooks
   pre-rebase

由git rebase
 命令调用，运行在rebase执行之前，可以用来阻止任何已发发生过的提交参与变基（字面意思，找不到合适的词汇了）。默认的pre-rebase
 确实是这么做的，不过脚本中的next
 是根据Git项目自身而写的分支名，在使用过程中应该将其改成自己的稳定分支名称。
 post-checkout
 由git checkout
 命令调用，在完成工作区更新之后执行。该脚本由三个参数：之前HEAD指向的引用，新的HEAD指向的引用，一个用于标识此次检出是否是分支检出的值（0表示文件检出，1表示分支检出）。
 也可以被git clone触发调用，除非在克隆时使用参数--no-checkout。在由clone调用执行时，三个参数分别为null, 1, 1。
 这个脚本可以用于为自己的项目设置合适的工作区，比如自动生成文档、移动一些大型二进制文件等，也可以用于检查版本库的有效性。
 post-merge

由git merge
 调用，在merge成功后执行。该脚本有一个参数，标识合并是否为压缩合并。该脚本可以用于对一些Git无法记录的数据的恢复，比如文件权限、属主、ACL等。
 Server Side
 除了本地执行的Hooks脚本之外，还有一些放在Git Server上的Hooks脚本，作为管理员，可以利用这些服务端的脚本来强制确保项目的任何规范。这些运行在服务端的脚本，会在push命令发生的前后执行。pre系列的脚本可以在任何时候返回非零值来终止某次push，并向push方返回一个错误

# 四个基本命令搞会 Git 使用

## 一、前言

首先，在进入 Git 的各种神仙操作之前，**一定要明白 git 的三个「分区」是什么，否则的话你一定没办法真正理解 Git 的原理**。

Git 的三个分区分别是：`working directory`，`stage/index area`，`commit history`。

![https://rogerdudler.github.io/git-guide](https://labuladong.github.io/algo/pictures/git/trees.png)

**`working directory` 是「工作目录」，也就是我们肉眼能够看到的文件**，后文我们称其为 `work dir` 区。

当我们在 `work dir` 中**执行 `git add` 相关命令后，就会把 `work dir` 中的修改添加到「暂存区」`stage area`（或者叫 `index area`）中去**，后文我们称暂存区为 `stage` 区。

当 `stage` 中存在修改时，我们**使用 `git commit` 相关命令之后，就会把 `stage` 中的修改保存到「提交历史」 `commit history` 中**，也就是 `HEAD` 指针指向的位置。后文我们称「提交历史」为 `history` 区。

关于 `commit history` 我们多说几句，任何修改只要进入 `commit history`，基本可以认为永远不会丢失了。每个 `commit` 都有一个唯一的 Hash 值，我们经常说的 `HEAD` 或者 `master` 分支，都可以理解为一个指向某个 `commit` 的指针。

`work dir` 和 `stage` 区域的状态，可以通过命令 `git status` 来查看，`history` 区域的提交历史可以通过 `git log` 命令来查看。

好的，如果上面的内容你都能够理解，那么本文就完全围绕这三个概念展开，下面就是一个「状态转移图」：

![img](https://labuladong.github.io/algo/pictures/git/1.jpeg)

## 二、本地 Git 极简教程

### **需求一，如何把 `work dir` 中的修改加入 `stage`**。

![img](https://labuladong.github.io/algo/pictures/git/2.jpeg)

这个是最简单，使用 **`git add`** 相关的命令就行了。顺便一提，`add` 有个别名叫做 `stage`，也就是说你可能见到 `git stage` 相关的命令，这个命令和 `git add` 命令是完全一样的。

风险等级：无风险。

理由：不会改变任或撤销任何已作出的修改，而且还会将 `work dir` 中未追踪的修改（Untracked file）添加到暂存区 `stage` 中进行追踪。

### **需求二，如何把 `stage` 中的修改还原到 `work dir` 中**。

![img](https://labuladong.github.io/algo/pictures/git/3.jpeg)

这个需求很常见，也很重要，比如我先将当前 `work dir` 中的修改添加到 `stage` 中，然后又对 `work dir` 中的文件进行了修改，但是又后悔了，如何把 `work dir` 中的全部或部分文件还原成 `stage` 中的样子呢？

来个实际场景，我先新建两个文件，然后把他们都加到 `stage`：

```shell
$ touch a.txt b.txt
$ git add .
$ git status
On branch master
Changes to be committed:
    new file:   a.txt
    new file:   b.txt
```

然后我又修改了 `a.txt` 文件：

```shell
$ echo hello world >> a.txt
$ git status
On branch master
Changes to be committed:
    new file:   a.txt
    new file:   b.txt

Changes not staged for commit:
    modified:   a.txt
```

现在，我后悔了，我认为不应该修改 `a.txt`，我想把它还原成 `stage` 中的空文件，怎么办？

答案是，使用 **`checkout`** 命令：

```shell
$ git checkout a.txt
Updated 1 path from the index

$ git status
On branch master
Changes to be committed:
    new file:   a.txt
    new file:   b.txt
```

看到了么，输出显示从 `index` 区（也就是 `stage` 区）更新了一个文件，也就是把 `work dir` 中 `a.txt` 文件还原成了 `stage` 中的状态（一个空文件）。

当然，如果 `work dir` 中被修改的文件很多，可以使用通配符全部恢复成 `stage`：

```shell
$ git checkout .
```

有一点需要指出的是，`checkout` 命令只会把被「修改」的文件恢复成 `stage` 的状态，如果 `work dir` 中新增了新文件，你使用 `git checkout .` 是不会删除新文件的。

风险等级：中风险。

理由：在 `work dir` 做出的「修改」会被 `stage` 覆盖，无法恢复。所以使用该命令你应该确定 `work dir` 中的修改可以抛弃。

### **需求三，将 `stage` 区的文件添加到 `history` 区**。

![img](https://labuladong.github.io/algo/pictures/git/4.jpeg)

很简单，就是 **`git commit`** 相关的命令，一般我们就是这样用的：

```shell
$ git commit -m '一些描述'
```

再简单提一些常见场景， 比如说 `commit` 完之后，突然发现一些错别字需要修改，又不想为改几个错别字而新开一个 `commit` 到 `history` 区，那么就可以使用下面这个命令：

```shell
$ git commit --amend
```

这样就是把错别字的修改和之前的那个 `commit` 中的修改合并，作为一个 `commit` 提交到 `history` 区。

风险等级：无风险。

理由：不会改变任或撤销任何已作出的修改，而且还会将 `stage` 区的修改加入 `history` 区并分配一个 Hash 值。只要不乱动本地的 `.git` 文件夹，进入 `history` 的修改就永远不会丢失。

### **需求四，将 `history` 区的文件还原到 `stage` 区**。

![img](https://labuladong.github.io/algo/pictures/git/5.jpeg)

这个需求很常见，比如说我用了一个 `git add .` 一股脑把所有修改加入 `stage`，但是突然想起来文件 `a.txt` 中的代码我还没写完，不应该把它 `commit` 到 `history` 区，所以我得把它从 `stage` 中撤销，等后面我写完了再提交。

```shell
$ echo aaa >> a.txt; echo bbb >> b.txt;
$ git add .
$ git status
On branch master
Changes to be committed:
    modified:   a.txt
    modified:   b.txt
```

如何把 `a.txt` 从 `stage` 区还原出来呢？可以使用 **`git reset`** 命令：

```shell
$ git reset a.txt

$ git status
On branch master
Changes to be committed:
    modified:   b.txt

Changes not staged for commit:
    modified:   a.txt
```

你看，这样就可以把 `a.txt` 文件从 `stage` 区移出，这时候进行 `git commit` 相关的操作就不会把这个文件一起提交到 `history` 区了。

上面的这个命令是一个简写，实际上 `reset` 命令的完整写法如下：

```shell
$ git reset --mixed HEAD a.txt
```

其中，`mixed` 是一个模式（mode）参数，如果 `reset` 省略这个选项的话默认是 `mixed` 模式；`HEAD` 指定了一个历史提交的 hash 值；`a.txt` 指定了一个或者多个文件。

**该命令的自然语言描述是：不改变 `work dir` 中的任何数据，将 `stage` 区域中的 `a.txt` 文件还原成 `HEAD` 指向的 `commit history` 中的样子**。就相当于把对 `a.txt` 的修改从 `stage` 区撤销，但依然保存在 `work dir` 中，变为 `unstage` 的状态。

风险等级：低风险。

理由：不会改变 `work dir` 中的数据，会改变 `stage` 区的数据，所以应确保 `stage` 中被改动数据是可以抛弃的。

### **需求五，将 `work dir` 的修改提交到 `history` 区**。

![img](https://labuladong.github.io/algo/pictures/git/6.jpeg)

这个需求很简单啦，先 `git add` 然后 `git commit` 就行了，或者一个快捷方法是使用命令 `git commit -a`。

风险等级：无风险。

理由：显而易见。

### **需求六，将 `history` 区的历史提交还原到 `work dir` 中**。

![img](https://labuladong.github.io/algo/pictures/git/7.jpeg)

这个场景，我说一个极端一点的例子：比如我从 GitHub 上 `clone` 了一个项目，然后乱改了一通代码，结果发现我写的代码根本跑不通，于是后悔了，干脆不改了，我想恢复成最初的模样，怎么办？

依然是使用 `checkout` 命令，但是和之前的使用方式有一些不同：

```shell
$ git checkout HEAD .
Updated 12 paths from d480c4f
```

这样，`work dir` 和 `stage` 中所有的「修改」都会被撤销，恢复成 `HEAD` 指向的那个 `history commit`。

注意，类似之前通过 `stage` 恢复 `work dir` 的 `checkout` 命令，这里撤销的也只是修改，新增的文件不会被撤销。

当然，只要找到任意一个 `commit` 的 HASH 值，`checkout` 命令可就以将文件恢复成任一个 `history commit` 中的样子：

```shell
$ git checkout 2bdf04a some_test.go
Updated 1 path from 2bdf04a
# 前文的用法显示 update from index
```

比如，我改了某个测试文件，结果发现测试跑不过了，所以就把该文件恢复到了它能跑过的那个历史版本……

风险等级：高风险。

理由：这个操作会将指定文件在 `work dir` 的数据恢复成指定 `commit` 的样子，且会删除该文件在 `stage` 中的数据，都无法恢复，所以应该慎重使用。

## 三、其他技巧

### **需求一，合并多个 `commit`**。

比如说我本地从 `17bd20c` 到 `HEAD` 有多个 `commit`，但我希望把他们合并成一个 `commit` 推到远程仓库，这时候就可以使用 `reset` 命令：

```shell
$ git reset 17bd20c
$ git add .
$ git commit -m 'balabala'
```

回顾一下刚才说的 `reset` 命令的作用，相当于把 HEAD 移到了 `17bd20c` 这个 `commit`，而且不会修改 `work dir` 中的数据，所以只要 `add` 再 `commit`，就相当于把中间的多个 `commit` 合并到一个了。

### **需求二，由于 `HEAD` 指针的回退，导致有的 `commit` 在 `git log` 命令中无法看到，怎么得到它们的 Hash 值呢**？

再重复一遍，只要你不乱动本地的 `.git` 文件夹，任何修改只要提交到 `commit history` 中，都永远不会丢失，看不到某些 `commit` 只是因为它们不是我们当前 `HEAD` 位置的「历史」提交，我们可以使用如下命令查看操作记录：

```shell
$ git reflog
```

比如 `reset`，`checkout` 等等关键操作都会在这里留下记录，所有 `commit` 的 Hash 值都能在这里找到，所以如果你发现有哪个 `commit` 突然找不到了，一定都可以在这里找到。

### **需求三，怎么解决冲突**？

记住，Git 虽然高大上，但也不要迷恋，一定要懂得借助先进的工具。

比较流行的代码编辑器或者 IDE 都会集成方便的可视化 Git 工具，至于解决冲突，可视化的表现方式不是比你在命令行里 `git diff` 看半天要清晰明了得多？只需要点点点就行了。

所以说，只要明白本文讲的这些基本操作，够你用的了，平时能用图形化工具就多用图形化工具，毕竟工具都是为人服务的。



# git命令流程

git add .

git commit -m 

git pull origin 分支名（要拉取的分支名）

git chekout -b 分支名（建与远程对应的分支名）

git push -u origin 分支名(要推送的分支)

git reflog 查看所有分支记录

git rest -- hard 版本号 （回到回来的版本）

#  git push 和 pull request 的区别

## 1、pull request

A负责a分支，B负责b分支
 如果提交一致或者b分支比a分支多了一个提交，那么b的z文件和a对应z文件数据不一致，b新的commit后，push后z文件可以覆盖上去。如果a比b多了一个提交，并且该提交涉及到了修改z文件，那么b也修改z文件 b->pull request->a后，该文件会冲突，如果b没有修改z文件，就不会冲突，可以pull request。
 pr感觉就是，以文件为单元，谁最后一次修改了某个文件，谁就是该文件的老大，只要别人pr时没碰该文件，随你怎么pr

## 2、push

A、B同时负责a分支，谁的commit再前边，另外一个push必然提示冲突。
 push感觉就是，以commit为单元，谁最后一次对项目commit，谁就是该项目的老大，别人不能随便push