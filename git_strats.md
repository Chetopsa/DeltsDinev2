
# How to contribute to the github repo

```bash
# 1. clone repo
git clone https://github.com/Chetopsa/DeltsDineV2.git
# 2. create new branch     
git checkout -b <any-name>                 # now you are on new branch so make changes
# 3. stage your changes
git add -A                                 # -A adds all your new changes
# 4. commit your changes to your local git
git commit -m "commit message"
# 5. push changes to github                      
git push -u origin <any-name>              # -u, means --setbranch-upstream
# this command essentially will push you local git repo to the remote repo on github. the -u flag makes it so you don't have to specify remote repo in the future. origin is an alias for the link of the repo you initially cloned (https://github.com/Chetopsa/DeltsDineV2.git), and the last argument is the name of the branch you want to push.
```

<p>
Now go to git hub and you will see your commit created a new branch. You can submit a pull request on github, which will prompt me to merge you rchanges with the main branch
</p>

#

## Future Commits

<p> Now that you have established your usptream branch you can just use <code>git push branch_name</code> </p> 

```bash
# 1. make sure you are on the main branch
git checkout main
# 2. pull from the remote to make sure your local git is up to date
git pull
# 3. checkout to new our existing branch to make changes
git checkout <branch_name>      # goes to exisitng branch
git checkout -b <branch_name>   # creates new branch
git add -A
git commit -m "commit message"
git push
```
# Example git Workflow

```bash
➜  DeltsDineV2 git:(chet-dev) git checkout main # <----------------
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
➜  DeltsDineV2 git:(main) git pull # <----------------        
remote: Enumerating objects: 8, done.
remote: Counting objects: 100% (8/8), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 4 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (4/4), 1.84 KiB | 470.00 KiB/s, done.
From https://github.com/Chetopsa/DeltsDinev2
   c765ac8..c5f3f53  main       -> origin/main
Updating c765ac8..c5f3f53
Fast-forward
 git_strats.md | 6 +++++-
 1 file changed, 5 insertions(+), 1 deletion(-)
➜  DeltsDineV2 git:(main) git checkout chet-dev # <----------------
Switched to branch 'chet-dev'
Your branch is up to date with 'origin/chet-dev'.
➜  DeltsDineV2 git:(chet-dev) ✗ git add -A # <----------------
➜  DeltsDineV2 git:(chet-dev) ✗ git commit -m "example workflow" # <--------------
[chet-dev 5e2c32c] example workflow
 1 file changed, 1 insertion(+), 1 deletion(-)
➜  DeltsDineV2 git:(chet-dev) git push # <----------------
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 10 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 304 bytes | 304.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/Chetopsa/DeltsDinev2.git
   d662c77..5e2c32c  chet-dev -> chet-dev
```

<p> Go to github find your branch and submit a pull request (should be a big green button)</p>


