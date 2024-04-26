import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import Button from './Buttons'

import './styles/calendar-style.css';
import './styles/style.css';
import useFetch from '../useFetch.js';

const timeToString = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    return timeString;
}

const millisecondsToTime = (milliseconds) => {
    // 1 sec= 1000 millisec
    // 1 min= 60 sec
    // 1 h = 60 min
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    // format string
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return formattedTime;
}

const taskDuration = (endTime, startTime, pauseTime) => {
    const duration = (endTime - startTime) - pauseTime;
    return duration;
}

const calculatePauseDuration = (pause) => {
    if (pause.pauseStart && pause.pauseEnd) {
      const duration = pause.pauseEnd - pause.pauseStart;
      // Palauta tauon kesto millisekunteina
      return duration;
    }
    return null;
};

const postData = (data) => {
    // console.log("data to save: ", data)
    //take data and save to the db
    // Takes obj {startTime: 10:12, endTime:11.20, duration: 680000}
    //if offline save to the localStorage
     const response = fetch("http://localhost:8000/tasks", {
         method: "POST",
         cache: "force-cache",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
     })

    setDataToLocalStorage(data);

    // console.log(response)
}

const setDataToLocalStorage = (data) => {
    localStorage.setItem(localStorage.length, JSON.stringify(data))
}

const getDataFromLocalStorage = () => {
    const list = [];
    for(let i = 0; i < localStorage.length; i++){
        const data = localStorage.getItem(i.toString());
        list.push(JSON.parse(data));
    }
    return list;
}

const ButtonContainer = ({taskData, setToTaskList}) => {
    const [info, setInfo] = useState('_ _ _');
    const [isRunning, setIsRunning] = useState(false) //false === paused, true === runniung
    const [taskTime, setTaskTime] = useState([]);
    const [pauses, setPauses] = useState([]);
    const [started, setStarted] = useState(false);
    
    const handleStart = () => {
        const startTime = new Date();

        // funktio tietokantaan tallennukseen, jonne tallennetaan koko datenow
        // Offline tilassa tallennetaan localStorage
        setTaskTime(prevPauses => [...prevPauses, { taskStart: startTime }]);
        setInfo(`Stared at ${timeToString(startTime)}`)
        setStarted(!started);
    }

    const handlePauseStart = () => {
        const pauseStartTime = new Date();
        setPauses(prevPauses => [...prevPauses, { pauseStart: pauseStartTime }]);
    };

    const handlePauseEnd = () => {
      const pauseEndTime = new Date();
      const lastPause = pauses[pauses.length - 1];
      lastPause.pauseEnd = pauseEndTime;
      setPauses([...pauses.slice(0, -1), lastPause]);
    };

    const handlePause = () => {
        setIsRunning(prevState => !prevState);
        if(!isRunning){
            console.log("tauko käynnissä")
            handlePauseStart();
        }else{
            console.log("Tehtävä käynnissä")
            handlePauseEnd();
        }
    }

    const handleStop = async (pauses) => {
        const endTime = new Date();
        const pauseList = [];

        // push calculated pause times to the list
        pauses.map((pause, index) => (
            pauseList.push(calculatePauseDuration(pause))
        ))
        
        // Sum pause times
        const totalPauseTime = pauseList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        // Set end time to the state
        const lastEnd = taskTime[taskTime.length - 1];
        lastEnd.taskEnd = endTime;
        setTaskTime([...taskTime.slice(0, -1), lastEnd]);

        //Set duration to the state
        const totalTaskTime = taskTime[taskTime.length - 1];
        totalTaskTime.duration = taskDuration(endTime, taskTime[taskTime.length -1].taskStart, totalPauseTime);
        setTaskTime([...taskTime.slice(0, -1), totalTaskTime])
        
        

        setInfo(`Ended at ${timeToString(endTime)}`)
        setPauses([])

        postData(taskTime[taskTime.length -1]);
        setToTaskList(getDataFromLocalStorage());
        setStarted(!started);
    }

    return(
        <>
            <div className='column content-container'>
                {info}
                <div className='button-container'> 
                {/* onko taski käynnissä true tai false jos käynnissä vain pause ja stop nappi aktiivisina jos ei käynnissä niin start nappi aktiivisena */}
                    <Button disabled={started} onClick = {() => handleStart()} color={'green'} label={'Start'} />
                    <Button disabled={!started} onClick = {() => handlePause()} color={'transparent'} label={isRunning ? "Continue" : "Pause"} />
                    <Button disabled={!started || isRunning} onClick = {() => handleStop(pauses)} color={'red'} label={'Stop'} />
                </div>
            </div>
            <InfoContainer data ={taskData}/>
        </>
    )
}

const InfoContainer = ({data}) => {
    return (
        <div className='content-container'>
            <h4>The times of completed tasks</h4>
            <div className='scroll-view'>
                {
                    data?.map((item, index) => {
                        // console.log("item: ", item[index].duration)
                        const taskStart = new Date(item?.taskStart)
                        const taskEnd = new Date(item?.taskEnd)
                        return (
                            <div key={Math.random()+index}>
                                <span key={"error"+index}>{item?.error}</span>
                                <span key={"pending"+index}>{item?.isPending}</span>
                                 <li key={index} style={{listStyle: 'none'}}>
                                    {item?.duration && (
                                    <div key={Math.random()+index} className='space-around-row'>
                                        <span key={Math.random()+index}>
                                            Start time: {timeToString(taskStart)}
                                        </span> 
                                        <span key={Math.random()+index}>
                                            End time: {timeToString(taskEnd)}
                                        </span> 
                                        <span key={Math.random()+index}>
                                            Duration: {millisecondsToTime(item?.duration)}
                                        </span> 
                                    </div>
                                    )}
                                 </li>
                             </div>
                        )
                    })
                }
            </div>
        </div>
    )
} 


const Tracker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(currentDate);
    const [taskList, setToTaskList] = useState(getDataFromLocalStorage());
    const { data: tasks, isPending, error } = useFetch("http://localhost:8000/tasks");

    useEffect(() => {
        if(tasks){
            if(tasks?.length !== localStorage.length){
                localStorage.clear();

                tasks?.forEach((item, index) => {
                    // console.log("ITEM: ",item, " Index: ",index);
                    localStorage.setItem(index, JSON.stringify(item));
                })
                setToTaskList(getDataFromLocalStorage())
                console.log("Data haettu kannasta")
            }
        }
    }, [tasks]);


    const handleDateChange = (date) => {
        console.log('Selected date:', date);
        setActiveDate(date); // Set selected date to active
    };

    const checkSelectedDate = () => {
        const current = currentDate.toLocaleDateString();
        const active = activeDate.toLocaleDateString();

        return current === active;
    }

    const getSelectedDayData = () => {

        let selectedDayData;
        if(error){
            selectedDayData = [{error: error}]
        }else if(isPending){
            selectedDayData = [{isPending: 'Loading data...'}]
        }else{
            {taskList && (
                 selectedDayData = taskList?.filter(task => {
                    const taskDate = new Date(task.taskStart);
                    return taskDate.getDate() === activeDate.getDate() && taskDate.getMonth() === activeDate.getMonth() && taskDate.getFullYear() === activeDate.getFullYear();
                  })
                 )
             }
        }

         return selectedDayData;
      };
      
    return(
        <div>
            <p>Tracker</p>
            <Calendar
                onChange={handleDateChange}
                value={activeDate}
            />
            {
              checkSelectedDate() ? 
              <ButtonContainer taskData={getSelectedDayData()} setToTaskList={setToTaskList} taskList={taskList}/> 
              : 
              <InfoContainer data={getSelectedDayData()}/>
            }
        </div>
    )
}

export default Tracker;