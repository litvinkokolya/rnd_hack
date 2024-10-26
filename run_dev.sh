projectName='RND_HACK'
command1="Start without Backend"
command2="Start All"
command3="Close Terminals"
command4="Exit"

function start_front(){
    if [ $1 -ne 0 ]
     then
        tmux split-window -h
    fi
    tmux send-keys -t $1 "cd frontend && yarn dev" C-m
}

function start_back(){
    tmux split-window -h
    tmux send-keys -t $1 "cd backend && source venv/bin/activate && python manage.py runserver" C-m
}

#function start_celery() {
#    tmux split-window -h
#    tmux send-keys -t $1 "celery -A rnd_hack worker --loglevel=info && celery -A rnd_hack beat --loglevel=info"
#}

function ensure_session() {
    tmux has-session -t ${projectName} 2>/dev/null

    if [ $? != 0 ]; then
        tmux new-session -d -s ${projectName}

        tmux select-layout tiled &
        xterm -fs 10 -fa "Liberation Mono" -e "tmux attach-session -t ${projectName};" &
    fi
}


select command in "${command1}" "${command2}" "${command3}" "${command4}"; do

   if [ "$command" == "$command2" ]
       then
           ensure_session
           echo -e "\e[1;33mRunning ${projectName}....\e[0m"
           tmux kill-pane -a
           start_front 0 &
           start_back 1 &
           echo -e "\e[1;33mProject ${projectName} was started....\e[0m"
   fi

   if [ "$command" == "$command1" ]
       then
            ensure_session
            echo -e "\e[1;33mRunning ${projectName}....\e[0m"
            tmux kill-pane -a
            start_front 0 &
            echo -e "\e[1;33mProject ${projectName} was started....\e[0m"
   fi

   if [ "$command" == "$command3" ]
       then
       tmux kill-session -t ${projectName}
       break
   fi

   if [ "$command" == "$command4" ]
       then
           clear
           break
   fi
done

