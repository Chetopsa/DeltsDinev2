
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

