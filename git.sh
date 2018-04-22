#!/bin/bash



cd "${0%/*}"

commitConst="commitAndPush"
pushConst="pushOnly"
standardConst="standard"
standardOp="standardOperation"

first="$1"
second="$2"
third="$3"

operation=$commitConst



adjustArguments() {

	echo "__standard__ $message $remote"

	if [[ $first == $standardConst ]];
	then

		operation=$standardOp

		if [[ -z $third && -z $second && -n $first ]];
		then

			message="update"
			remote="origin"
			branch="master"

		elif [[ -n $second ]];
		then

			message="update"
			remote="origin"
			branch=$second

		fi
	else

		if [[ -z $third && -n $second && -n $first ]]; 
		then

			operation=$pushConst
			message=""
			remote=$first
			branch=$second

		elif [[ -n $third ]];
		then

			operation=$commitConst
			message=$first
			remote=$second
			branch=$third

		fi
	fi
}


commit () {

	git add -A && git commit -m $message
}


push() {

	git push $remote $branch
}


checkPush() {


	if [[ -n $remote && -n $branch ]]; 
	then

		push
	fi

}


commitAndPush() {


	echo "commit and push"

	if [[ -n $branch && -n $message ]] && [[ $operation == $commitConst || $operation == $standardOp ]]; 
	then

		commit

		checkPush		
	fi

}


pushOnly() {


	echo "push only"

	if [[ $operation == $pushConst ]];
	then

		checkPush
	fi

}




run() {

	adjustArguments

	if [[ $operation == $commitConst || $operation == $standardOp ]];
	then

		commitAndPush

	elif [[ $operation == $pushConst ]];
	then

		pushOnly
	fi

}



run




