#!/bin/bash
#
# Instructions at: https://gist.github.com/hmps/4a36ec7a8c4dbfa40498

# VARIABLES
DEVELOP="develop"
MASTER="master"

RED="\033[31m"
BLACK="\033[0m"
BLUE="\033[30m"
WHITE="\033[37m"

# HELPERS
function echoerror()
{
    echo "$RED$1$BLACK"
    echo;
}

function echomessage()
{
    echo "$BLUE$1$BLACK"
    echo;
}

function testbranch()
{
  if [ $1 != 'release' ] && [ $1 != 'feature' ]
  then
      echoerror "ERROR: This branch does not seem to be a feature or release branch."
      exit 1
  fi

  if [ $1 == 'release' ] && ! [ ${#2} -ge 5 ]
  then
      echoerror "$2 does not seem to be a valid semver version."
  fi
}

function finishfeature()
{

    echomessage "CHECKING OUT AND UPDATING DEVELOP"
    git checkout $DEVELOP || exit 1
    git pull origin $DEVELOP --no-edit || exit 1

    echo ""
    echomessage "MAKING SURE FEATURE BRANCH IS UP TO DATE"
    git checkout $WORKINGBRANCH || exit 1
    git rebase $DEVELOP || exit 1

    echo ""
    echomessage "CHECKING OUT DEVELOP"
    git checkout $DEVELOP || exit 1

    echo ""
    echomessage "MERGING FEATURE BRANCH WITH DEVELOP"
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $DEVELOP" || exit 1

    echo ""
    echomessage "PUBLISHING DEVELOP"
    git push origin $DEVELOP || exit 1

    echo ""
    echomessage "DELETING FEATURE BRANCH"
    git branch -d $WORKINGBRANCH || exit 1

    # SUMMARY
    echo ""
    echo ""
    echo "SUCCESS!"
    echo "======================================="
    echomessage "Here's what was done:"
    echomessage "1. Merged $WHITE$WORKINGBRANCH$BLUE into $WHITE$DEVELOP$BLUE"
    echomessage "2. Published $WHITE$DEVELOP$BLUE to remote"
    echomessage "3. Deleted $WHITE$WORKINGBRANCH$BLUE"

}

function finishrelease()
{
    echomessage "CHECKING OUT AND UPDATING DEVELOP"
    git checkout $DEVELOP || exit 1
    git pull origin $DEVELOP --no-edit || exit 1

    echo ""
    echomessage "CHECKING OUT AND UPDATING MASTER"
    git checkout $MASTER || exit 1
    git pull origin $MASTER --no-edit || exit 1

    echo ""
    echomessage "MAKING SURE RELEASE BRANCH IS UP TO DATE"
    git checkout $WORKINGBRANCH || exit 1
    git rebase $DEVELOP || exit 1

    echo ""
    echomessage "CREATING RELEASE TAG"
    git tag -a v$BRANCHSUFFIX -m"version $BRANCHSUFFIX" || exit 1

    echo ""
    echomessage "CHECKING OUT MASTER"
    git checkout $MASTER || exit 1

    echo ""
    echomessage "MERGING RELEASE WITH MASTER"
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $MASTER" || exit 1

    echo ""
    echomessage "PUBLISHING MASTER"
    git push origin $MASTER || exit 1

    echo ""
    echomessage "PUBLISHING RELEASE"
    git push origin v$BRANCHSUFFIX || exit 1

    echo ""
    echomessage "CHECKING OUT DEVELOP"
    git checkout $DEVELOP || exit 1

    echo ""
    echomessage "MERGING RELEASE WITH DEVELOP"
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $DEVELOP" || exit 1

    echo ""
    echomessage "PUBLISHING DEVELOP"
    git push origin $DEVELOP || exit 1

    echo ""
    echomessage "DELETING RELEASE BRANCH"
    git branch -d $WORKINGBRANCH || exit 1

    echo ""
    echo ""
    echo "SUCCESS!"
    echo "======================================="
    echomessage "Here's what was done:"
    echomessage "1. Merged $WHITE$WORKINGBRANCH$BLUE into $WHITE$MASTER$BLUE"
    echomessage "2. Tagged $WHITE$MASTER$BLUE with $WHITEv$BRANCHSUFFIX$BLUE"
    echomessage "3. Published $WHITE$MASTER$BLUE and $WHITEv$BRANCHSUFFIX$BLUE to remote"
    echomessage "4. Merged $WHITE$WORKINGBRANCH$BLUE into $WHITE$DEVELOP$BLUE"
    echomessage "5. Published $WHITE$DEVELOP$BLUE to remote"
    echomessage "6. Deleted $WHITE$WORKINGBRANCH$BLUE"
}

# MAIN
if branch=$(git symbolic-ref --short -q HEAD)
then
    WORKINGBRANCH=$branch
    BRANCHPREFIX=$(echo $WORKINGBRANCH | cut -d'/' -f 1)
    BRANCHSUFFIX=$(echo $WORKINGBRANCH | cut -d'/' -f 2)

    testbranch $BRANCHPREFIX $BRANCHSUFFIX

    if [ $BRANCHPREFIX == 'release' ]
    then
        # Do the gitf low dance
        finishrelease
    elif [ $BRANCHPREFIX == 'feature' ]
    then
        finishfeature
    fi
else
    echoerror "Couldn't find a branch"
    exit 1
fi
