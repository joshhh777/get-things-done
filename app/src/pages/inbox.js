import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout/layout' // Este componente nos permite mantener un mismo 
import React, {useState} from 'react'

export async function getStaticProps() {
    const res = await fetch('http://localhost:3001/api/imbox')
    const data = await res.json()
  
    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  
    return {
      props: { data },
    }
}

export default function Inbox({data}) {
    //Hook para reconocer edición de tarea
    const [editingRow, setEditingRow] = useState()
    //Hook para guardar nuevo valor para actualizar tarea
    const [updTask, setUpdTask] = useState("--")
    
    async function newTask(event) {
        event.preventDefault()
        await fetch(
            'http://localhost:3001/api/imbox',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    "tarea": event.target.tarea.value
                })
            }
        )
        window.location.reload()
    }
    
    async function updateTask(id) {
        event.preventDefault()
        await fetch(
            `http://localhost:3001/api/imbox/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    "tarea": updTask
                })
            }
        )
        window.location.reload()
    }
    
    async function deleteTask(id) {
            fetch(`http://localhost:3001/api/imbox/${id}`, { method: 'DELETE' })
            window.location.reload()
    }

    const handleTaskChange = (event)=>{
        setUpdTask(event.target.value)
    }

    return (
        <Layout>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/*
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
                    crossorigin="anonymous"
                />
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                    crossorigin="anonymous">
                </script>
                <script src="pages/agregar.js"></script>
            */}
                <title>Inbox</title>
            </Head>
            <h1 className="text-3xl">Inbox</h1>
            <div>
                <body>
                    <div className="titulo">
                    </div>
                    <div className="principal">
                        <div className="wrap">
                            <form onSubmit={newTask}>
                                <input type="text" class="tareaInput" placeholder="Agrega tu tarea" name="tarea"></input>
                                <button class="btnAgregar"></button>
                            </form>
                        </div>

                    </div>
                    <div class="tareas">
                        <div class="wrap">
                            <ul class="list-group" id="lista">                      
                                {data.map((item,row) => (
                                    <li class="list-group-item">
                                        {
                                            editingRow == row ? 
                                            <form>
                                                <input type="text" onChange={handleTaskChange} defaultValue={item.tarea} name="nombre"/>
                                                <button class="btnActualizar" onClick={()=>updateTask(item._id)}>Guardar</button>
                                            </form>
                                            : 
                                            <div>
                                                <span onClick={()=>{setEditingRow(row);setUpdTask(item.tarea)}}>
                                                    {item.tarea}
                                                </span>
                                                <button class="btnEliminar" onClick={()=>deleteTask(item._id)}>X</button>
                                            </div>
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </body>
            </div>
            <style>{`
                .principal{
                    padding: 20px;
                }
                .principal form {
                    display:flex;
                }
                .principal .tareaInput{
                    width: 100%;
                    margin-right: 10px;
                    border-color: skyblue!important;
                    border-radius: 0.5em;
                }
                .principal .btnAgregar{
                    background: url(https://image.flaticon.com/icons/png/512/60/60525.png);
                    background-size: 100% 100%;
                    width: 40px;
                    border-style:none;
                }
                .tareas{
                    padding: 20px;
                }
                .tareas .list-group-item{
                    padding: 10px;
                    background-color: #ffcf005c;
                }
                .tareas .btnEliminar {
                    display: none;
                    float: right;
                    color: red;
                }
                li:hover .btnEliminar {
                    display: block;
                }
                .tareas .btnActualizar {
                    font-size: 11px;
                    padding: 3.5px;
                    background-color:green;
                    color: white;
                    margin-left: 10px;
                    border-radius: 0.5em;
                }
                `}
            </style>
        </Layout>
    )
}