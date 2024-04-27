import {postData, getDataFromLocalStorage} from './API'

export const CheckOnline = () => {
    window.addEventListener('online', () => {
        console.log("is online")
        // if (navigator.onLine) {
        //   const localStorageData = getDataFromLocalStorage();
        //   console.log("DATA: ",localStorageData);
        //   // Tallenna kaikki tiedot tietokantaan ja odota niiden tallentamista
        //   Promise.all(localStorageData.map(data => postData(data)))
        //     .then(() => {
        //       // Kun kaikki tiedot on tallennettu, poista ne localStoragessa
        //       localStorage.clear();
        //     })
        //     .catch(error => {
        //       console.error('Failed to save data to the database:', error);
        //     });
        // }
      });
}
