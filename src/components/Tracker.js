import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import Button from './Buttons'

import './styles/calendar-style.css';
import './styles/style.css';
import useFetch from '../useFetch.js';
import { saveData, getDataFromLocalStorage, postData } from './API.js';
import { TimeToString, MillisecondsToTime, TaskDuration, CalculatePauseDuration } from './Utils.js';



const ButtonContainer = ({taskData, setToTaskList}) => {
    const [info, setInfo] = useState('_ _ _');
    const [isRunning, setIsRunning] = useState(false) //false === paused, true === runniung
    const [taskTime, setTaskTime] = useState([]);
    const [pauses, setPauses] = useState([]);
    const [started, setStarted] = useState(false);
    
    const handleStart = () => {
        const startTime = new Date();
        setTaskTime(prevPauses => [...prevPauses, { taskStart: startTime }]);
        setInfo(`Stared at ${TimeToString(startTime)}`)
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
            handlePauseStart();
        }else{
            handlePauseEnd();
        }
    }

    const handleStop = async (pauses) => {
        const endTime = new Date();
        const pauseList = [];

        // push calculated pause times to the list
        pauses.map((pause, index) => (
            pauseList.push(CalculatePauseDuration(pause))
        ))
        
        // Sum pause times
        const totalPauseTime = pauseList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        // Set end time to the state
        const lastEnd = taskTime[taskTime.length - 1];
        lastEnd.taskEnd = endTime;
        setTaskTime([...taskTime.slice(0, -1), lastEnd]);

        //Set duration to the state
        const totalTaskTime = taskTime[taskTime.length - 1];
        totalTaskTime.duration = TaskDuration(endTime, taskTime[taskTime.length -1].taskStart, totalPauseTime);
        setTaskTime([...taskTime.slice(0, -1), totalTaskTime])
        
        setInfo(`Ended at ${TimeToString(endTime)}`)
        setPauses([])

        saveData(taskTime[taskTime.length -1]);
        setToTaskList(getDataFromLocalStorage());
        setStarted(!started);
    }

    return(
        <>
            <div className='column content-container'>
                {info}
                <div className='button-container'> 
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
                                            Start time: {TimeToString(taskStart)}
                                        </span> 
                                        <span key={Math.random()+index}>
                                            End time: {TimeToString(taskEnd)}
                                        </span> 
                                        <span key={Math.random()+index}>
                                            Duration: {MillisecondsToTime(item?.duration)}
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
                localStorage.clear();

                tasks?.forEach((item, index) => {
                    localStorage.setItem(index, JSON.stringify(item));
                })
                setToTaskList(getDataFromLocalStorage())
        }
    }, [tasks]);


    const handleDateChange = (date) => {
        setActiveDate(date); // Set selected date to active
    };

    const checkSelectedDate = () => {
        const current = currentDate.toLocaleDateString();
        const active = activeDate.toLocaleDateString();

        return current === active;
    }

    const getSelectedDayData = () => {
        let selectedDayData;

        if(isPending){
            selectedDayData = [{isPending: 'Loading data...'}]
        }else{
            selectedDayData = taskList?.filter(task => {
                const taskDate = new Date(task.taskStart);
                return taskDate.getDate() === activeDate.getDate() && taskDate.getMonth() === activeDate.getMonth() && taskDate.getFullYear() === activeDate.getFullYear();
            })
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