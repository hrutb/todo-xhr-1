let base_url ='https://jsonplaceholder.typicode.com' ;
let todo_url = `${base_url}/todos`;

const todoContainer= document.getElementById('todoContainer'); 
const todoForm= document.getElementById('todoForm'); 
const titleControl= document.getElementById('title'); 
// const contentControl= document.getElementById('content'); 
const completedControl= document.getElementById('completed'); 
const addTodo = document.getElementById('addTodo');
const updateTodo = document.getElementById('updateTodo');

const spinner = document.getElementById('spinner');



let todoArr = [];
function snackbar(msg,icon){ 
     swal.fire({
         title:msg,
         icon:icon,
         timer:3000
     })
}


function fetchTodo(){ 
         spinner.classList.remove('d-none');
        let xhr = new XMLHttpRequest() ; 
        xhr.open('GET', todo_url);
        xhr.send(null);
        
        xhr.onload = function(){ 
            
            if(xhr.status>=200 && xhr.status<=299){ 
                    todoArr =JSON.parse(xhr.response); 
               
                    createTodo(todoArr)     
                 spinner.classList.add('d-none');    
              }else{ 
                 spinner.classList.add('d-none');    

                 snackbar('Api is failed...!!','error');
             }
            
        }
}

fetchTodo() 





function createTodo(arr){
      let res =" " ; 
      
      arr.forEach((ele)=>{ 
             res += `<div class="col-md-6 mb-4" id=${ele.id}>
                <div class="card">
                    <div class="card-body">
                        <h4>Title:${ele.title}</h4>
                         <h5>Status:<span class="badge ${ele.completed ? "badge-success":"badge-danger"}">
                                       ${ele.completed ? 'Completed':'pending'}
                                    </span>
                         </h5>
                     </div>
                    
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>

                    </div>
                </div>
            </div>`
      });

      todoContainer.innerHTML=res ;
    } 


function onRemove(ele){ 
      let removeId = ele.closest('.col-md-6').id; 
      let removeUrl =`${base_url}/todos.${removeId}`;



        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed){ 
             
                
                let xhr= new XMLHttpRequest() ; 
                 xhr.open('DELETE', removeUrl);
                 xhr.send(null); 
                 
                 xhr.onload =function(){  
                   
                    ele.closest('.col-md-6').remove(); 
                   
                 }

               }
            });


}



function onSubmit(eve){ 
       eve.preventDefault() ; 
        
      let newTodo = { 
            title:titleControl.value , 
            completed:completedControl.value
      }

      
         spinner.classList.remove('d-none');
       
      let xhr= new XMLHttpRequest() ; 
        xhr.open('POST', todo_url);

        xhr.send(JSON.stringify(newTodo));
        xhr.onload = function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
              let res = JSON.parse(xhr.response);     
               console.log(res);
               
            let div= document.createElement('div');
                  div.className=  'col-md-6' ; 
                  div.id = res.id;
                  div.innerHTML =`<div class="card">
                                    <div class="card-body">
                                        <h4>Title:${newTodo.title}</h4>
                                        <h5>Status:<span class="badge ${newTodo.completed ? "badge-success":"badge-danger"}">
                                                    ${newTodo.completed ? 'Completed':'pending'}
                                                    </span>
                                        </h5>
                                    </div>
                                    
                                    <div class="card-footer d-flex justify-content-between align-items-center">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>

                                    </div>
                                </div>`

                     todoContainer.prepend(div);
                 spinner.classList.add('d-none');
               snackbar( 'Todo submitted successfully ', 'success');
                  todoForm.reset() ;
             }else{ 
         spinner.classList.add('d-none');

               snackbar('failed to submit todo', 'error');
             }
        }

}








function onEdit(){
      let editId= ele.closest('.col-md-6').id
       localStorage.setItem('EditId', editId);
      let editUrl = `${base_url}/todos/${editId}`;
      

         spinner.classList.remove('d-none');
      let xhr = new XMLHttpRequest() ;
            xhr.open('GET',editUrl);

            xhr.send(null);
            
            xhr.onload= function(){ 
                
                if(xhr.status>=200 && xhr.status<=299){
                let editObj=JSON.parse(xhr.response);
                    
                  titleControl.value = editObj.title ;
                  completedControl.value = editObj.completed ? 'Yes': 'No';
                
                  addTodo.classList.add('d-none');
                  updateTodo.classList.remove('d-none')
                  window.scrollTo({top:0 ,behavior:'smooth'})

                  spinner.classList.add('d-none');
                
                }else{ 
                    spinner.classList.add('d-none');
                    snackbar('failed to edit todo...!', 'error');
                  }
            }
}




function onUpdate(){
      let updateId =localStorage.getItem('EditId');
    
      let updateUrl = `${base_url}/todos/${updateId}`; 
      let updateObj = { 
          title:titleControl.value , 
          completed:completedControl.value
      }
         spinner.classList.remove('d-none');

      
      let xhr= new XMLHttpRequest() ; 
          xhr.open('PATCH', updateUrl);
          xhr.send(JSON.stringify(updateUrl));

          xhr.onload = function(){ 
            if(xhr.status>=200 && xhr.status<=299){
              let div =document.getElementById(updateId);
              div.innerHTML = `<div class="card">
                                    <div class="card-body">
                                        <h4>Title:${updateObj.title}</h4>
                                        <h5>Status:<span class="badge ${updateObj.completed ? "badge-success":"badge-danger"}">
                                                    ${updateObj.completed ? 'Completed':'pending'}
                                                    </span>
                                        </h5>
                                    </div>
                                    
                                    <div class="card-footer d-flex justify-content-between align-items-center">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger">Delete</button>

                                    </div>
                                </div>`
          
                addTodo.classList.remove('d-none');
                updateTodo.classList.add('d-none')
             
                todoForm.reset(); 
             
                spinner.classList.add('d-none');


                snackbar('todo udpated successfully...!', 'success');            
                  div.scrollIntoView({behavior:'smooth', block:'center'})          
              }else{ 
               spinner.classList.add('d-none');

               snackbar('Failed to udpate...!', 'error')
             }
       } 

    }


 function keyHandler(eve){ 
        if(eve.key==='Enter'){ 
             eve.preventDefault(); 
             onUpdate();
        }else{ 
            onSubmit(); 
        }
 }




todoForm.addEventListener('submit', onSubmit)
updateTodo.addEventListener('click', onUpdate);

todoForm.addEventListener('keydown', keyHandler)


