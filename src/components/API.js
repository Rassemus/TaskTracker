export const fetchDataFromServer = async () => {
    const response = await fetch("http://localhost:8000/tasks");
    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }
    const data = await response.json();
    return data;
}

export const postData = async (data) => {
    try {
        const response = await fetch("http://localhost:8000/tasks", {
            method: "POST",
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        if (!response.ok) {
            throw new Error('Failed to save data to server');
        }

    } catch (error) {
        console.error("ERROR: ", error)
    }

}

export const saveData = (data) => {
    if(navigator.onLine){
        postData(data);
    }
    setDataToLocalStorage(localStorage.length,data);
}

export const setDataToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getDataFromLocalStorage = () => {
    const list = [];
    for(let i = 0; i < localStorage.length; i++){
        const data = localStorage.getItem(i.toString());
        list.push(JSON.parse(data));
    }
    return list;
}