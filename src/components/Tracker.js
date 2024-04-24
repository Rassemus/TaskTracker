import React, {useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import Button from './Buttons'

import './styles/calendar-style.css';
import './styles/style.css';

const ButtonContainer = ({info}) => {

    return(
        <>
            <div className='column content-container'>
                {info}
                <div className='button-container'>
                    <Button color={'green'} label={'Start'} />
                    <Button color={'transparent'} label={'Pause'} />
                    <Button color={'red'} label={'Stop'} />
                </div>
            </div>
        </>
    )
}

const InfoContainer = ({data}) => {

    return (
        <>
            {data}
        </>
    )
} 


const Tracker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(currentDate);

    // Käsittelijäfunktio päivämäärän muuttumiselle
    const handleDateChange = (date) => {
        console.log('Selected date:', date);
        setActiveDate(date); // Aseta valittu päivämäärä aktiiviseksi
    };

    const checkSelectedDate = () => {
        const current = currentDate.toLocaleDateString();
        const active = activeDate.toLocaleDateString();

        return current == active;
    }
    

    return(
        <div>
            <p>Tracker</p>
            <Calendar
                className={'react-calendar'}
                onChange={handleDateChange}
                value={activeDate}
            />
            {
              checkSelectedDate() ? <ButtonContainer info={'Started at 10:20'}/> : <InfoContainer data={'data'}/>
            }
        </div>
    )
}

export default Tracker;