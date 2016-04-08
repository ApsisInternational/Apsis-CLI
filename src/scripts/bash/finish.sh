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

# Assign passed in params
SLACKTEAM=$1
SLACKTOKEN=$2
SLACKCHANNEL=$3
IMGFLIPUSER=$4
IMGFLIPPASS=$5

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
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $DEVELOP" --no-ff || exit 1

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
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $MASTER" --no-ff || exit 1

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
    git merge $WORKINGBRANCH -m"chore: Merge $WORKINGBRANCH into $DEVELOP" --no-ff || exit 1

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

function getRandomMeme()
{
    # 516587 = Sound of music
    # 61532 = The most interesting man in the world
    # 5496396 = leo toasting
    # 563423 = that would be great
    # 61582 = willy wonka
    # 61544 = success kid
    # 28251713 = oprah
    # 61556 = grandma
    # 15878567 = you the real mvp
    # Get a random image id from a list of ids
    declare -a expressions=('516587' '61532' '5496396' '563423' '61582' '61544' '28251713' '61556' '15878567')
    declare -a first_text=(
        "The hills are alive with the sound of"
        "When I use $1, I always use"
        "This is to you $1"
        "It would be reaaaaally great if you updated to"
        "Gosh, I just dunno. Maybe $1"
        "OH YEAH!"
        "YOU ALL GET A NEW VERSION OF"
        "What is that dear? "
        "We managed to publish $1 $2!"
        )
    declare -a second_text=(
        "$1 $2"
        "version $2"
        "may v$2 be the best one yet"
        "$1 $2 before you go home"
        "is the golden ticket"
        "$1 $2 was published"
        "$1 ($2)"
        "$1 $2 was published?"
        "My team are the true MVPs today."
        )
    index=$( jot -r 1  0 $((${#expressions[@]} - 1)) )
    IMGFLIPID=${expressions[index]}
    IMGFLIPTEXT0=${first_text[index]}
    IMGFLIPTEXT1=${second_text[index]}

    RESPONSE=$(curl --data "username=$IMGFLIPUSER&password=$IMGFLIPPASS&template_id=$IMGFLIPID&text0=$IMGFLIPTEXT0&text1=$IMGFLIPTEXT1" -s https://api.imgflip.com/caption_image) > /dev/null
    IMGFLIPURL=$(node -pe 'JSON.parse(process.argv[1]).data.url' $RESPONSE)
}

function sendMessageToSlack()
{
    # $1 should be the message to send
    echo "Sending message to Slack..."

    URL="https://$SLACKTEAM.slack.com/services/hooks/slackbot?token=$SLACKTOKEN&channel=%23$SLACKCHANNEL"

    curl -Ss --data "$1" $"$URL" > /dev/null

    echo "Done!"
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
        # Get a random meme id for imgflip
        getRandomMeme $(basename $(pwd)) $BRANCHSUFFIX
        # Finally send a message to Slack
        sendMessageToSlack "Greetings humans! Apsis component *$(basename $(pwd))@$BRANCHSUFFIX* was just published. :rocknroll: $IMGFLIPURL"
    elif [ $BRANCHPREFIX == 'feature' ]
    then
        finishfeature
    fi
else
    echoerror "Couldn't find a branch"
    exit 1
fi
