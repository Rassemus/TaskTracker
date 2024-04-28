import {postData, getDataFromLocalStorage, fetchDataFromServer} from './API'


export const CheckIfExists = (existingData, data ) => {
    const isDataExists = existingData.some(existingItem => {

      return existingItem.id === data.id;
    });

    return isDataExists;
}

export const CheckIfUndefined = (item) => {
    return item.id === undefined;
}

export const PostFromLocaStorage = async () => {
    const dbData = await fetchDataFromServer();
    const data = getDataFromLocalStorage();
    
    data.map(async (item) => {
      if(!CheckIfExists(dbData, item)){ // if not found
        await postData(item)
      }
    })
}

export const TimeToString = (time) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  return timeString;
}

export const MillisecondsToTime = (milliseconds) => {
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

export const TaskDuration = (endTime, startTime, pauseTime) => {
  const duration = (endTime - startTime) - pauseTime;
  return duration;
}

export const CalculatePauseDuration = (pause) => {
  if (pause.pauseStart && pause.pauseEnd) {
    const duration = pause.pauseEnd - pause.pauseStart;
    
    return duration;
  }
  return null;
};
