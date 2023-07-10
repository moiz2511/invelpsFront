import React, { useEffect, useState } from 'react';
import ScreenModelService from '../services/ScreenModelService';
import MyTable from './TaskTable';


const AllScreenTasks = (props) => {
    const restClient = new ScreenModelService();

    const [getAgain,setGetAgain] = useState(false)

    const[tasks, setTasks] = useState([{
        'task_name': "",
        'task_description': "",
        'style': "",
        'mentor': "",
        'model': "",
        'start_time': "",
        'is_recurring': "",
        'recurrence_pattern': "",
        'logs': "",
        'last_occurrence': "",
        'isTwitter': "",
        'isEmail': "",
        'isAIDescription': "",

    }])

    useEffect(() => {
        const getAllScrennTasks = async () => {
            await restClient.getAllScreenTasks()
                .then((response) => {
                    console.log(response)
                    setTasks(response.data.tasks)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        getAllScrennTasks()
    }, [getAgain])
    return (
        <div>
            <MyTable data={tasks} getAgain={getAgain} setGetAgain={setGetAgain} />
        </div>
    );
};

export default AllScreenTasks;
