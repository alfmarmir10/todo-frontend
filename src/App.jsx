/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styles from './App.module.css';
import checked from './assets/checked.png';
import DeleteImg from './assets/delete.png';

const App = () => {

  const [tasks, setTasks] = useState();
  const [taskIdToogle, setTaskIdToogle] = useState();
  const [taskIdDelete, setTaskIdDelete] = useState();
  const [taskDescription, setTaskDescription] = useState();
  const [fetchingTasks, setFetchingTasks] = useState(true);

  useEffect(() => {
    if (fetchingTasks) {
      const fetchAllTasks = async () => {
        const response = await fetch('https://todo-express-alf.herokuapp.com/tasks');
        // const response = await fetch('http://localhost:8000/tasks/1');
        const tasks = await response.json();
        console.log(tasks);
        setTasks(tasks);
        setFetchingTasks(false);
      }
      fetchAllTasks();
    }
  }, [fetchingTasks])

  useEffect(() => {
    if (taskIdToogle) {
      const toogleStatusTask = async (taskId) => {
        const task = tasks.find(item => item.Id === taskId);
        let newStatus;
        if (task.Status === "Pending") {
          newStatus = "Completed";
        } else {
          newStatus = "Pending";
        }
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(`https://todo-express-alf.herokuapp.com/tasks/${task.Id}?Description=${task.Description}&Status=${newStatus}`, requestOptions)
        console.log(await response.json());
        setFetchingTasks(true);
        setTaskIdToogle();

      }
      toogleStatusTask(taskIdToogle);
    }
  }, [taskIdToogle]);
  
  useEffect(() => {
    if (taskIdDelete) {
      const deleteTask = async (taskId) => {
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(`https://todo-express-alf.herokuapp.com/tasks/${taskIdDelete}`, requestOptions)
        console.log(await response.json());
        setFetchingTasks(true);
        setTaskIdDelete();

      }
      deleteTask(taskIdDelete);
    }
  }, [taskIdDelete]);

  useEffect(() => {
    if (taskDescription) {
      const addTask = async () => {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(`https://todo-express-alf.herokuapp.com/tasks?Description=${encodeURIComponent(taskDescription)}&Status=Pending`, requestOptions)
        console.log(await response.json());
        setFetchingTasks(true);
        setTaskDescription();
        document.getElementById('description_input').value = "";
      }
      addTask();
    }
    
  }, [taskDescription])

  return (
    <div className={styles.MAIN_CONTAINER}>
      <p className={styles.TITLE}>My Tasks</p>
      <input  id="description_input" className={styles.SET_INPUT} type='text' placeholder='Check space suit...' onBlur={(e) => setTaskDescription(e.target.value) } />
      <div className={styles.TASKS_MAIN_CONTAINER}>
        {
          tasks && tasks.map(item => {
            return (
              <div className={styles.TASKS_CARD} key={item.Id}>
                <div className={styles.CHECK_MAIN_CONTAINER} onClick={()=>setTaskIdToogle(item.Id)}>
                  <div className={styles.CHECK_OPTION_CONTAINER}>
                    {
                      item.Status === "Pending" ? (
                        <></>
                      ) : (
                        <img src={checked} alt="Checked icon" className={ styles.CHECKED_ICON} />
                      )
                    }
                  </div>
                </div>
                <div className={styles.TASK_DESCRIPTION_CONTAINER}>
                  <p className={styles.TASK_DESCRIPTION}>{item.Description }</p>
                </div>
                <div className={styles.DELETE_ICON_MAIN_CONTAINER} onClick={()=>setTaskIdDelete(item.Id)} >
                  <img src={DeleteImg} alt="Delete icon" className={styles.DELETE_ICON} />
                </div>
              </div>
            )
          })

        }
      </div>
    </div>
  )
}

export default App
