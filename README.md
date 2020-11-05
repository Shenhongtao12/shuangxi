# 双喜体检中心

##### 提交代码前先拉取远程代码

git stash 备份当前工作区的内容

git pull 下载git仓库的代码同步到本地

git stash pop 读取最近一次保存的内容，恢复工作区

全局搜索 “>>>”

**如果产生冲突**

找到对应位置解决冲突，选择保留正确的代码

##### 将所有改动文件加入git暂存区

git add -A . 

#### 提交代码到本地仓库

第一次提交：

git commit -m "message"

多次提交，且前一次没有提交到远程仓库：

git commit --amend

##### 提交代码到远程仓库

git push origin 分支名称
