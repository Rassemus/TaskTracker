import React, {useState} from 'react';
import Calendar from 'react-calendar';
import Button from './Buttons'

import './styles/calendar-style.css';
import './styles/style.css';

const timeToString = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeString = `${hours}:${minutes}`

    return timeString;
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

const saveToDb = ({data}) => {
    //take data and save to the db
    // Takes obj {startTime: 10:12, endTime:11.20, duration: 680000}
    //if offline save to the localStorage
}


const ButtonContainer = () => {
    const [info, setInfo] = useState('_ _ _');
    const [isRunning, setIsRunning] = useState(false) //false === paused, true === runniung
    const [taskTime, setTaskTime] = useState([]);
    const [pauses, setPauses] = useState([]);
    
    const handleStart = () => {
        const startTime = new Date();

        // funktio tietokantaan tallennukseen, jonne tallennetaan koko datenow
        // Offline tilassa tallennetaan localStorage
        setTaskTime(prevPauses => [...prevPauses, { taskStart: startTime }]);
        setInfo(`Stared at ${timeToString(startTime)}`)
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



    const handleStop = (pauses) => {
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
        setTaskTime([...taskTime.slice(0, -1), totalTaskTime]);


        setInfo(`Ended at ${timeToString(endTime)}`)
        setPauses([])

        
    }


    return(
        <>
            <div className='column content-container'>
                {info}
                <div className='button-container'>
                    <Button onClick = {() => handleStart()} color={'green'} label={'Start'} />
                    <Button onClick = {() => handlePause()} color={'transparent'} label={isRunning ? "Continue" : "Pause"} />
                    <Button onClick = {() => handleStop(pauses)} color={'red'} label={'Stop'} />
                </div>
            </div>
            <InfoContainer data ={taskTime}/>
        </>
    )
}

const InfoContainer = ({data}) => {
    // data muodossa lista
    // sisällä object {startTime: 10:12, endTime: 11:20, duration: 68000}
    return (
        <div className='content-container'>
            <h4>The times of completed tasks</h4>
            {
                data.map((item, index) => {
                    console.log("item: ", item.duration)
                    return (
                         <li key={index} style={{listStyle: 'none'}}>
                            {item?.duration && (
                            <div className='space-around-row'>
                                <span>
                                    Start time: {item?.taskStart.toLocaleDateString()}
                                </span> 
                                <span>
                                    End time: {item?.taskEnd.toLocaleDateString()}
                                </span> 
                                <span>
                                    Kesto: {item?.duration}
                                </span> 
                            </div>
                            )}
                         </li>
                    )
                })
            }
        </div>
    )
} 


const Tracker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(currentDate);
    const [dateTasks, setDateTasks] = useState();

    // Käsittelijäfunktio päivämäärän muuttumiselle
    const handleDateChange = (date) => {
        console.log('Selected date:', date);
        setActiveDate(date); // Aseta valittu päivämäärä aktiiviseksi
    };

    const checkSelectedDate = () => {
        const current = currentDate.toLocaleDateString();
        const active = activeDate.toLocaleDateString();

        return current === active;
    }
    

    return(
        <div>
            <p>Tracker</p>
            <Calendar
                onChange={handleDateChange}
                value={activeDate}
            />
            {
              checkSelectedDate() ? <ButtonContainer /> : <InfoContainer data={['data']}/>
            }
        </div>
    )
}

export default Tracker;